import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT ?? 5174);
const jwtSecret = process.env.JWT_SECRET ?? "change-this-secret-before-production";

const serviceStatuses = [
  "Talep Alındı",
  "Ön İnceleme Bekliyor",
  "Ürün Teslim Alındı",
  "Teknik İnceleme Başladı",
  "Arıza Tespit Edildi",
  "Fiyat Onayı Bekleniyor",
  "Onarım Başladı",
  "Test Ediliyor",
  "Teslime Hazır",
  "Teslim Edildi",
];

const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).default("Müşteri"),
  phone: z.string().min(1),
  email: z.string().optional().default(""),
  addresses: z.array(z.string()).optional().default([]),
});

const serviceSchema = z.object({
  id: z.string().optional(),
  trackingNo: z.string().optional(),
  customerId: z.string().optional(),
  contactName: z.string().optional().default("Müşteri"),
  contactPhone: z.string().min(1),
  contactEmail: z.string().optional().default(""),
  productCategory: z.string().optional().default("Telefonla tamamlanacak"),
  brand: z.string().optional().default("Telefonla tamamlanacak"),
  model: z.string().optional().default("Telefonla tamamlanacak"),
  serialNo: z.string().optional().default("Telefonla tamamlanacak"),
  warranty: z.string().optional().default("Telefonla netleştirilecek"),
  issueTitle: z.string().optional().default("Telefonla tamamlanacak"),
  description: z.string().optional().default(""),
  urgency: z.string().optional().default("Normal"),
  preference: z.string().optional().default("Kendim servise bırakacağım"),
  address: z.string().optional().default(""),
  appointment: z.string().optional().default(""),
  currentStatus: z.string().optional().default("Talep Alındı"),
  estimatedDelivery: z.string().optional().default("Telefonla bildirilecek"),
  technician: z.string().optional().default("FBS Teknik Servis"),
  visibleNotes: z.array(z.string()).optional().default(["Servis talebiniz FBS ekibine iletildi."]),
  internalNotes: z.array(z.string()).optional().default([]),
  photos: z.array(z.string()).optional().default([]),
  priceOffer: z.unknown().optional(),
  timeline: z.array(z.unknown()).optional().default([]),
  messages: z.array(z.unknown()).optional().default([]),
});

const smsTemplateSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
});

const smsSendSchema = z.object({
  customerId: z.string().optional(),
  serviceRequestId: z.string().optional(),
  phone: z.string().min(1),
  message: z.string().min(1),
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

function normalizePhone(phone = "") {
  const digits = String(phone).replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length === 12) {
    return digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return digits.slice(1);
  }

  return digits;
}

function nowText() {
  return new Date().toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function toCustomer(record) {
  return {
    id: record.id,
    name: record.name,
    phone: record.phone,
    email: record.email,
    addresses: record.addresses,
  };
}

function toService(record) {
  return {
    id: record.id,
    trackingNo: record.trackingNo,
    customerId: record.customerId,
    contactName: record.contactName,
    contactPhone: record.contactPhone,
    contactEmail: record.contactEmail,
    productCategory: record.productCategory,
    brand: record.brand,
    model: record.model,
    serialNo: record.serialNo,
    warranty: record.warranty,
    issueTitle: record.issueTitle,
    description: record.description,
    urgency: record.urgency,
    preference: record.preference,
    address: record.address,
    appointment: record.appointment,
    currentStatus: record.currentStatus,
    lastUpdate: record.updatedAt.toLocaleString("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    estimatedDelivery: record.estimatedDelivery,
    technician: record.technician,
    visibleNotes: record.visibleNotes,
    internalNotes: record.internalNotes,
    photos: record.photos,
    priceOffer: record.priceOffer ?? undefined,
    timeline: record.timeline,
    messages: record.messages,
  };
}

async function generateTrackingNo() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const prefix = `FBS-${year}-${month}-${day}`;
  const count = await prisma.serviceRequest.count({
    where: {
      trackingNo: {
        startsWith: `${prefix}-`,
      },
    },
  });

  return `${prefix}-${String(count + 1).padStart(3, "0")}`;
}

async function upsertCustomerFromService(payload) {
  const phone = payload.contactPhone || payload.phone || "";
  const normalizedPhone = normalizePhone(phone);
  const existingCustomer = await prisma.customer.findUnique({
    where: {
      phone: normalizedPhone,
    },
  });
  const nextAddress = payload.address ? [payload.address] : existingCustomer?.addresses ?? [];

  if (existingCustomer) {
    return prisma.customer.update({
      where: {
        id: existingCustomer.id,
      },
      data: {
        name: payload.contactName || payload.name || existingCustomer.name,
        phone: normalizedPhone,
        email:
          payload.contactEmail === "Belirtilmedi"
            ? existingCustomer.email
            : payload.contactEmail || payload.email || existingCustomer.email,
        addresses: nextAddress,
      },
    });
  }

  return prisma.customer.create({
    data: {
      name: payload.contactName || payload.name || "Müşteri",
      phone: normalizedPhone,
      email: payload.contactEmail === "Belirtilmedi" ? "" : payload.contactEmail || payload.email || "",
      addresses: nextAddress,
    },
  });
}

function asyncRoute(handler) {
  return async (request, response, next) => {
    try {
      await handler(request, response, next);
    } catch (error) {
      next(error);
    }
  };
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "fbs-postgres-api" });
});

app.get("/api/service-statuses", (_request, response) => {
  response.json(serviceStatuses);
});

app.post("/api/auth/admin/login", asyncRoute(async (request, response) => {
  const credentials = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  }).parse(request.body);
  const admin = await prisma.adminUser.findUnique({
    where: {
      username: credentials.username,
    },
  });

  if (!admin || !admin.isActive) {
    response.status(401).json({ error: "Kullanıcı adı veya şifre hatalı" });
    return;
  }

  const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);

  if (!isValid) {
    response.status(401).json({ error: "Kullanıcı adı veya şifre hatalı" });
    return;
  }

  const token = jwt.sign({ sub: admin.id, username: admin.username }, jwtSecret, {
    expiresIn: "12h",
  });

  response.json({
    token,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
    },
  });
}));

app.get("/api/customers", asyncRoute(async (_request, response) => {
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  response.json(customers.map(toCustomer));
}));

app.post("/api/customers", asyncRoute(async (request, response) => {
  const payload = customerSchema.parse({
    ...request.body,
    phone: normalizePhone(request.body.phone),
  });
  const customer = await prisma.customer.upsert({
    where: {
      phone: payload.phone,
    },
    create: payload,
    update: payload,
  });
  response.status(201).json(toCustomer(customer));
}));

app.get("/api/customers/:id", asyncRoute(async (request, response) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: request.params.id,
    },
  });

  if (!customer) {
    response.status(404).json({ error: "Müşteri bulunamadı" });
    return;
  }

  response.json(toCustomer(customer));
}));

app.patch("/api/customers/:id", asyncRoute(async (request, response) => {
  const payload = customerSchema.partial().parse({
    ...request.body,
    phone: request.body.phone ? normalizePhone(request.body.phone) : undefined,
  });
  const customer = await prisma.customer.update({
    where: {
      id: request.params.id,
    },
    data: payload,
  });
  await prisma.serviceRequest.updateMany({
    where: {
      customerId: customer.id,
    },
    data: {
      contactName: customer.name,
      contactPhone: customer.phone,
      contactEmail: customer.email || "Belirtilmedi",
      address: customer.addresses[0] ?? undefined,
    },
  });
  response.json(toCustomer(customer));
}));

app.delete("/api/customers/:id", asyncRoute(async (request, response) => {
  await prisma.customer.delete({
    where: {
      id: request.params.id,
    },
  });
  response.status(204).end();
}));

app.get("/api/services", asyncRoute(async (request, response) => {
  const phone = request.query.phone ? normalizePhone(String(request.query.phone)) : "";
  const services = await prisma.serviceRequest.findMany({
    where: phone
      ? {
          contactPhone: phone,
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });
  response.json(services.map(toService));
}));

app.post("/api/services", asyncRoute(async (request, response) => {
  const payload = serviceSchema.parse({
    ...request.body,
    contactPhone: normalizePhone(request.body.contactPhone),
  });
  const customer = await upsertCustomerFromService(payload);
  const createdAtText = nowText();
  const service = await prisma.serviceRequest.create({
    data: {
      trackingNo: payload.trackingNo || await generateTrackingNo(),
      customerId: customer.id,
      contactName: customer.name,
      contactPhone: customer.phone,
      contactEmail: customer.email || "Belirtilmedi",
      productCategory: payload.productCategory,
      brand: payload.brand,
      model: payload.model,
      serialNo: payload.serialNo,
      warranty: payload.warranty,
      issueTitle: payload.issueTitle,
      description: payload.description,
      urgency: payload.urgency,
      preference: payload.preference,
      address: payload.address,
      appointment: payload.appointment,
      currentStatus: payload.currentStatus,
      estimatedDelivery: payload.estimatedDelivery,
      technician: payload.technician,
      visibleNotes: payload.visibleNotes,
      internalNotes: payload.internalNotes,
      photos: payload.photos,
      priceOffer: payload.priceOffer,
      timeline: payload.timeline.length
        ? payload.timeline
        : [
            {
              status: payload.currentStatus,
              date: createdAtText,
              note: "Servis talebi oluşturuldu.",
              completed: false,
            },
          ],
      messages: payload.messages,
    },
  });
  response.status(201).json(toService(service));
}));

app.get("/api/services/:id", asyncRoute(async (request, response) => {
  const service = await prisma.serviceRequest.findUnique({
    where: {
      id: request.params.id,
    },
  });

  if (!service) {
    response.status(404).json({ error: "Servis kaydı bulunamadı" });
    return;
  }

  response.json(toService(service));
}));

app.patch("/api/services/:id", asyncRoute(async (request, response) => {
  const service = await prisma.serviceRequest.update({
    where: {
      id: request.params.id,
    },
    data: request.body,
  });

  if (request.body.contactName || request.body.contactPhone || request.body.contactEmail || request.body.address) {
    await upsertCustomerFromService(toService(service));
  }

  response.json(toService(service));
}));

app.delete("/api/services/:id", asyncRoute(async (request, response) => {
  await prisma.serviceRequest.delete({
    where: {
      id: request.params.id,
    },
  });
  response.status(204).end();
}));

app.get("/api/services/:id/messages", asyncRoute(async (request, response) => {
  const service = await prisma.serviceRequest.findUnique({
    where: {
      id: request.params.id,
    },
    select: {
      messages: true,
    },
  });

  if (!service) {
    response.status(404).json({ error: "Servis kaydı bulunamadı" });
    return;
  }

  response.json(service.messages);
}));

app.post("/api/services/:id/messages", asyncRoute(async (request, response) => {
  const messages = z.array(z.unknown()).parse(request.body.messages);
  const service = await prisma.serviceRequest.update({
    where: {
      id: request.params.id,
    },
    data: {
      messages,
    },
  });
  response.status(201).json(toService(service));
}));

app.get("/api/sms/templates", asyncRoute(async (_request, response) => {
  const templates = await prisma.smsTemplate.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  response.json(templates);
}));

app.post("/api/sms/templates", asyncRoute(async (request, response) => {
  const payload = smsTemplateSchema.parse(request.body);
  const template = await prisma.smsTemplate.create({
    data: payload,
  });
  response.status(201).json(template);
}));

app.patch("/api/sms/templates/:id", asyncRoute(async (request, response) => {
  const payload = smsTemplateSchema.partial().parse(request.body);
  const template = await prisma.smsTemplate.update({
    where: {
      id: request.params.id,
    },
    data: payload,
  });
  response.json(template);
}));

app.delete("/api/sms/templates/:id", asyncRoute(async (request, response) => {
  await prisma.smsTemplate.delete({
    where: {
      id: request.params.id,
    },
  });
  response.status(204).end();
}));

app.post("/api/sms/send", asyncRoute(async (request, response) => {
  const payload = smsSendSchema.parse(request.body);
  const log = await prisma.smsLog.create({
    data: {
      customerId: payload.customerId,
      serviceRequestId: payload.serviceRequestId,
      phone: normalizePhone(payload.phone),
      message: payload.message,
      providerResponse: {
        mock: true,
        sentAt: new Date().toISOString(),
      },
    },
  });
  response.status(201).json(log);
}));

app.get("/api/sms/logs", asyncRoute(async (_request, response) => {
  const logs = await prisma.smsLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  response.json(logs);
}));

app.get("/api/admin/dashboard/stats", asyncRoute(async (_request, response) => {
  const [newRequests, activeServices, pendingOffers, readyServices, todayActivities] = await Promise.all([
    prisma.serviceRequest.count({ where: { currentStatus: "Talep Alındı" } }),
    prisma.serviceRequest.count({ where: { currentStatus: { notIn: ["Teslim Edildi"] } } }),
    prisma.serviceRequest.count({ where: { currentStatus: "Fiyat Onayı Bekleniyor" } }),
    prisma.serviceRequest.count({ where: { currentStatus: "Teslime Hazır" } }),
    prisma.serviceRequest.count({
      where: {
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  response.json({
    newRequests,
    activeServices,
    pendingOffers,
    readyServices,
    todayActivities,
  });
}));

app.use((error, _request, response, next) => {
  void next;
  if (error instanceof z.ZodError) {
    response.status(400).json({
      error: "Geçersiz istek verisi",
      issues: error.issues,
    });
    return;
  }

  if (error?.code === "P2025") {
    response.status(404).json({ error: "Kayıt bulunamadı" });
    return;
  }

  if (error?.code === "P2002") {
    response.status(409).json({ error: "Bu kayıt zaten mevcut" });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Sunucu hatası" });
});

app.listen(port, () => {
  console.log(`FBS PostgreSQL API running at http://localhost:${port}`);
});
