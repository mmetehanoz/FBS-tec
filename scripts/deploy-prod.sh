#!/usr/bin/env bash
# =============================================================================
# FBS Teknik Servis — İLK CANLI YAYINA ALMA (deploy-prod.sh)
#
# Bu script sunucuda ilk kez çalıştırılır.
# Sonraki güncellemeler için update-prod.sh kullanın.
#
# Kullanım:
#   chmod +x scripts/deploy-prod.sh
#   ./scripts/deploy-prod.sh
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()    { echo -e "${GREEN}[✔]${NC} $1"; }
warn()   { echo -e "${YELLOW}[!]${NC} $1"; }
error()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }
section(){ echo -e "\n${BLUE}━━━ $1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

# ─── Proje kökünden çalıştırıldığından emin ol ───────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

section "Ön koşul kontrolleri"

command -v node  >/dev/null 2>&1 || error "Node.js kurulu değil. https://nodejs.org"
command -v npm   >/dev/null 2>&1 || error "npm kurulu değil."
command -v docker>/dev/null 2>&1 || error "Docker kurulu değil."
log "Node.js $(node --version) | npm $(npm --version) | Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"

# Docker Compose (plugin veya standalone)
if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  error "Docker Compose bulunamadı. 'docker compose' plugin veya 'docker-compose' yükleyin."
fi
log "Compose komutu: $COMPOSE_CMD"

# PM2
if ! command -v pm2 >/dev/null 2>&1; then
  warn "PM2 bulunamadı. Global kurulum yapılıyor..."
  npm install -g pm2
fi
log "PM2 $(pm2 --version)"

# ─── .env dosyası ─────────────────────────────────────────────────────────────
section ".env yapılandırması"

if [ ! -f ".env" ]; then
  cp .env.example .env
  warn ".env dosyası .env.example'dan oluşturuldu."
  warn "Lütfen .env dosyasını düzenleyip gerçek değerleri girin, sonra bu scripti tekrar çalıştırın."
  warn "En az şunları ayarlayın:"
  warn "  DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD"
  warn "  NETGSM_USERNAME, NETGSM_PASSWORD, NETGSM_HEADER"
  warn "  VITE_API_URL (örn: https://siteniz.com veya http://SUNUCU_IP:5174)"
  echo ""
  read -r -p "Şimdi .env dosyasını düzenlemeyi tamamladınız mı? (evet/hayır): " answer
  if [[ "$answer" != "evet" && "$answer" != "e" ]]; then
    warn "İptal edildi. .env düzenlenip script tekrar çalıştırılmalı."
    exit 0
  fi
fi

# .env'i yükle
set -a
# shellcheck disable=SC1091
source .env
set +a

# Kritik değişkenleri kontrol et
[[ "${JWT_SECRET:-change-this-secret-before-production}" == "change-this-secret-before-production" ]] && \
  error "JWT_SECRET değiştirmediniz! .env'de güçlü bir secret belirleyin."
[[ "${DATABASE_URL:-}" == "" ]] && error "DATABASE_URL .env'de tanımlı değil."

log ".env yüklendi ve doğrulandı."

# ─── npm bağımlılıkları ───────────────────────────────────────────────────────
section "Bağımlılıklar"
npm ci 2>/dev/null || npm install
log "npm paketleri yüklendi."

# ─── Frontend build ───────────────────────────────────────────────────────────
section "Frontend derleniyor"
# Prod'da API adresi .env'deki VITE_API_URL'den gelir
npm run build
log "Frontend dist/ klasörüne derlendi."

# ─── PostgreSQL başlat ───────────────────────────────────────────────────────
section "Veritabanı"
$COMPOSE_CMD up -d postgres
log "PostgreSQL container başlatıldı."

# DB hazır olana kadar bekle (maks 60 saniye)
MAX_WAIT=60
ELAPSED=0
echo -n "PostgreSQL bağlantısı bekleniyor"
until docker exec fbs-postgres pg_isready -U "${POSTGRES_USER:-fbs}" >/dev/null 2>&1; do
  echo -n "."
  sleep 2
  ELAPSED=$((ELAPSED + 2))
  if [ $ELAPSED -ge $MAX_WAIT ]; then
    error "PostgreSQL $MAX_WAIT saniyede hazır olmadı."
  fi
done
echo ""
log "PostgreSQL hazır."

# ─── Prisma: migrate deploy ───────────────────────────────────────────────────
# 'migrate deploy' asla veri silmez; sadece uygulanmamış migration'ları çalıştırır.
section "Veritabanı migration"
npx prisma generate
npx prisma migrate deploy
log "Migration'lar uygulandı."

# ─── Admin kullanıcısı ────────────────────────────────────────────────────────
section "Admin kullanıcısı"
node server/seed-admin.mjs
log "Admin kullanıcısı hazır."

# ─── PM2 ile API başlat ──────────────────────────────────────────────────────
section "API servisi başlatılıyor"

PM2_APP_NAME="fbs-api"

if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  warn "PM2'de '$PM2_APP_NAME' zaten mevcut. Yeniden başlatılıyor..."
  pm2 restart "$PM2_APP_NAME"
else
  pm2 start server/api.mjs \
    --name "$PM2_APP_NAME" \
    --interpreter node \
    --env production \
    --time \
    --max-memory-restart 500M
fi

# Sunucu yeniden başladığında PM2'nin otomatik başlaması
pm2 save
pm2 startup 2>/dev/null | tail -1 | grep -v "^$" || true
log "PM2 servisi aktif ve otomatik başlatma kaydedildi."

# ─── Özet ─────────────────────────────────────────────────────────────────────
section "Tamamlandı"
PORT="${PORT:-5174}"
log "FBS Teknik Servis canlıya alındı."
echo ""
echo "  API + Frontend:  http://localhost:$PORT"
echo "  Admin panel:     http://localhost:$PORT/admin"
echo "  API health:      http://localhost:$PORT/api/health"
echo ""
echo "  Logları görmek için:  pm2 logs fbs-api"
echo "  Durumu görmek için:   pm2 status"
echo ""
warn "HATIRLATMA: Sunucunuzda 80/443 portları için nginx reverse proxy kurmanız önerilir."
warn "Örnek nginx config: scripts/nginx.conf.example"
