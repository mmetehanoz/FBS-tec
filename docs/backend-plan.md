# FBS Backend Plan

Bu plan tek admin kullanıcılı PostgreSQL backend için hazırlanmıştır.

## Teknoloji

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Zod validation
- bcryptjs ile admin şifre hash
- JWT ile admin login token

## Tek Admin Varsayımı

Admin panelde sadece bir kullanıcı olacak ve tam yetkili çalışacak.

Varsayılan geliştirme bilgileri:

- Kullanıcı adı: `admin`
- Şifre: `Fbs1997*`

Gerçek ortamda bu değerler `.env` üzerinden değiştirilmeli.

## Veritabanı Modelleri

- `admin_users`
- `customers`
- `service_requests`
- `sms_templates`
- `sms_logs`

İlk sürümde mesajlar, timeline, notlar, fotoğraflar ve fiyat teklifleri `service_requests`
üzerinde JSON alanları olarak tutulur. Operasyon netleşince bu yapılar ayrı tablolara
bölünebilir.

## CRUD Endpointleri

### Health

- `GET /api/health`
- `GET /api/service-statuses`

### Admin Auth

- `POST /api/auth/admin/login`

### Customers

- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/:id`
- `PATCH /api/customers/:id`
- `DELETE /api/customers/:id`

### Service Requests

- `GET /api/services`
- `GET /api/services?phone=5XXXXXXXXX`
- `POST /api/services`
- `GET /api/services/:id`
- `PATCH /api/services/:id`
- `DELETE /api/services/:id`

### Messages

- `GET /api/services/:id/messages`
- `POST /api/services/:id/messages`

### SMS Templates

- `GET /api/sms/templates`
- `POST /api/sms/templates`
- `PATCH /api/sms/templates/:id`
- `DELETE /api/sms/templates/:id`

### SMS Logs

- `POST /api/sms/send`
- `GET /api/sms/logs`

### Dashboard

- `GET /api/admin/dashboard/stats`

## Local Kurulum

Docker Compose plugin varsa:

```bash
cp .env.example .env
docker compose up -d
npm run db:push
npm run db:seed
npm run api
```

Bu makinedeki gibi Docker CLI var ama Compose plugin yoksa Docker Desktop açıldıktan sonra:

```bash
cp .env.example .env
docker volume create fbs_postgres_data
docker run --name fbs-postgres \
  -e POSTGRES_DB=fbs_tec \
  -e POSTGRES_USER=fbs \
  -e POSTGRES_PASSWORD=fbs_password \
  -p 5432:5432 \
  -v fbs_postgres_data:/var/lib/postgresql/data \
  -d postgres:16-alpine
npm run db:push
npm run db:seed
npm run api
```

Var olan container durduysa:

```bash
docker start fbs-postgres
```

Frontend ayrı terminalde:

```bash
npm run dev
```

## Geliştirme Sırası

1. PostgreSQL + Prisma schema
2. Tek admin login seed
3. Customer CRUD
4. Service Request CRUD
5. Message endpoints
6. SMS template CRUD
7. SMS log mock gönderim
8. Frontend SMS sayfasını backend SMS template API’ye bağlama
9. Frontend admin login’i backend auth’a bağlama
10. Dosya yükleme ve gerçek SMS sağlayıcı entegrasyonu
