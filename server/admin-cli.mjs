/**
 * FBS Admin Kullanıcı Yönetimi
 *
 * Kullanım:
 *   node server/admin-cli.mjs                       → Mevcut admin listeler
 *   node server/admin-cli.mjs set-password <şifre>  → Şifreyi değiştirir
 *   node server/admin-cli.mjs set-username <ad>     → Kullanıcı adını değiştirir
 *   node server/admin-cli.mjs set-name <görünen ad> → Görünen adı değiştirir
 *   node server/admin-cli.mjs deactivate            → Admin'i devre dışı bırakır
 *   node server/admin-cli.mjs activate              → Admin'i yeniden aktif eder
 *
 * veya npm scripti ile:
 *   npm run admin:set -- set-password YeniSifre123*
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const [, , command, value] = process.argv;

async function showAdmins() {
  const admins = await prisma.adminUser.findMany({
    select: { id: true, username: true, name: true, isActive: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "asc" },
  });

  if (!admins.length) {
    console.log("\n⚠  Hiç admin kullanıcısı yok. 'npm run db:seed' ile oluşturun.\n");
    return;
  }

  console.log("\n── Admin Kullanıcıları ─────────────────────────────");
  for (const admin of admins) {
    console.log(`  Kullanıcı adı : ${admin.username}`);
    console.log(`  Görünen ad    : ${admin.name}`);
    console.log(`  Durum         : ${admin.isActive ? "✔ Aktif" : "✗ Devre dışı"}`);
    console.log(`  Oluşturuldu   : ${admin.createdAt.toLocaleString("tr-TR")}`);
    console.log(`  Son güncelleme: ${admin.updatedAt.toLocaleString("tr-TR")}`);
    console.log("  ─────────────────────────────────────────────────");
  }
  console.log();
}

async function run() {
  const username = process.env.ADMIN_USERNAME ?? "admin";

  const admin = await prisma.adminUser.findUnique({ where: { username } });

  if (!command || command === "list") {
    await showAdmins();
    return;
  }

  if (command === "set-password") {
    if (!value || value.trim().length < 8) {
      console.error("✗ Şifre en az 8 karakter olmalıdır.");
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(value.trim(), 12);

    await prisma.adminUser.upsert({
      where: { username },
      create: { username, passwordHash, name: "FBS Admin" },
      update: { passwordHash, isActive: true },
    });

    console.log(`\n✔ '${username}' kullanıcısının şifresi güncellendi.\n`);
    return;
  }

  if (command === "set-username") {
    if (!value || value.trim().length < 3) {
      console.error("✗ Kullanıcı adı en az 3 karakter olmalıdır.");
      process.exit(1);
    }

    if (!admin) {
      console.error(`✗ '${username}' kullanıcısı bulunamadı. Önce 'npm run db:seed' çalıştırın.`);
      process.exit(1);
    }

    await prisma.adminUser.update({
      where: { username },
      data: { username: value.trim() },
    });

    console.log(`\n✔ Kullanıcı adı '${value.trim()}' olarak güncellendi.`);
    console.log(`  .env dosyasındaki ADMIN_USERNAME değerini de güncelleyin.\n`);
    return;
  }

  if (command === "set-name") {
    if (!value || value.trim().length < 2) {
      console.error("✗ Görünen ad en az 2 karakter olmalıdır.");
      process.exit(1);
    }

    if (!admin) {
      console.error(`✗ '${username}' kullanıcısı bulunamadı.`);
      process.exit(1);
    }

    await prisma.adminUser.update({
      where: { username },
      data: { name: value.trim() },
    });

    console.log(`\n✔ Görünen ad '${value.trim()}' olarak güncellendi.\n`);
    return;
  }

  if (command === "deactivate") {
    if (!admin) {
      console.error(`✗ '${username}' kullanıcısı bulunamadı.`);
      process.exit(1);
    }

    await prisma.adminUser.update({ where: { username }, data: { isActive: false } });
    console.log(`\n⚠  '${username}' kullanıcısı devre dışı bırakıldı. Giriş yapamaz.\n`);
    return;
  }

  if (command === "activate") {
    if (!admin) {
      console.error(`✗ '${username}' kullanıcısı bulunamadı.`);
      process.exit(1);
    }

    await prisma.adminUser.update({ where: { username }, data: { isActive: true } });
    console.log(`\n✔ '${username}' kullanıcısı aktif edildi.\n`);
    return;
  }

  console.error(`✗ Bilinmeyen komut: '${command}'`);
  console.log(`\nGeçerli komutlar: list | set-password | set-username | set-name | deactivate | activate\n`);
  process.exit(1);
}

run()
  .catch((error) => {
    console.error("Hata:", error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
