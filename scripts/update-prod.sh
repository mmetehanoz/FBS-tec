#!/usr/bin/env bash
# =============================================================================
# FBS Teknik Servis — GÜNCELLEME (update-prod.sh)
#
# Kod değişikliklerini production'a güvenli şekilde uygular.
# Veritabanındaki hiçbir veriyi SİLMEZ veya BOZMAZ.
#
# Kullanım:
#   chmod +x scripts/update-prod.sh
#   ./scripts/update-prod.sh
#
# Git kullanıyorsanız önce: git pull
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

# ─── .env kontrolü ────────────────────────────────────────────────────────────
[ -f ".env" ] || error ".env dosyası bulunamadı. Önce deploy-prod.sh çalıştırın."

set -a
# shellcheck disable=SC1091
source .env
set +a

section "Güncelleme başlıyor"
log "Tarih: $(date '+%Y-%m-%d %H:%M:%S')"
log "Dizin: $PROJECT_DIR"

# ─── Bağımlılıklar ────────────────────────────────────────────────────────────
section "npm bağımlılıkları"
npm ci --omit=dev 2>/dev/null || npm install
log "Paketler güncellendi."

# ─── Prisma generate (şema değiştiyse client'ı yenile) ───────────────────────
section "Prisma client"
npx prisma generate
log "Prisma client güncellendi."

# ─── Veritabanı migration ─────────────────────────────────────────────────────
# 'migrate deploy': sadece YENİ migration'ları uygular.
# Mevcut veriyi asla silmez veya değiştirmez.
section "Veritabanı migration"

# DB container çalışıyor mu?
if ! docker exec fbs-postgres pg_isready -U "${POSTGRES_USER:-fbs}" >/dev/null 2>&1; then
  warn "PostgreSQL container yanıt vermiyor. Başlatılıyor..."
  if docker compose version >/dev/null 2>&1; then
    docker compose up -d postgres
  else
    docker-compose up -d postgres
  fi
  sleep 5
fi

npx prisma migrate deploy
log "Migration'lar uygulandı (yeni migration yoksa atlandı)."

# ─── Frontend build ───────────────────────────────────────────────────────────
section "Frontend derleniyor"
npm run build
log "Frontend yeniden derlendi."

# ─── PM2 ile API yeniden başlat ──────────────────────────────────────────────
section "API yeniden başlatılıyor"

PM2_APP_NAME="fbs-api"

if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$PM2_APP_NAME" --update-env
  log "PM2 servisi yeniden yüklendi (sıfır kesinti)."
else
  warn "PM2'de '$PM2_APP_NAME' bulunamadı. deploy-prod.sh çalıştırın."
  pm2 start server/api.mjs \
    --name "$PM2_APP_NAME" \
    --interpreter node \
    --env production \
    --time \
    --max-memory-restart 500M
  pm2 save
  log "PM2 servisi yeni oluşturuldu."
fi

# ─── Sağlık kontrolü ─────────────────────────────────────────────────────────
section "Sağlık kontrolü"
PORT="${PORT:-5174}"
sleep 2  # API'nin başlaması için kısa bekle

if curl -sf "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
  log "API sağlıklı yanıt veriyor: http://localhost:$PORT/api/health"
else
  warn "API'den yanıt alınamadı. Logları kontrol edin: pm2 logs fbs-api"
fi

# ─── Özet ─────────────────────────────────────────────────────────────────────
section "Güncelleme tamamlandı"
log "$(date '+%Y-%m-%d %H:%M:%S') — Güncelleme başarıyla uygulandı."
echo ""
echo "  Logları görmek için:    pm2 logs fbs-api"
echo "  Son 100 satır:          pm2 logs fbs-api --lines 100"
echo "  Servis durumu:          pm2 status"
echo ""
