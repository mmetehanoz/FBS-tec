import http from "node:http";

const port = Number(process.env.PORT ?? 5174);

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

let services = [];
let customers = [];

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

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function generateTrackingNo() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const prefix = `FBS-${year}-${month}-${day}`;
  const sequence =
    services.filter((service) => service.trackingNo?.startsWith(`${prefix}-`)).length + 1;

  return `${prefix}-${String(sequence).padStart(3, "0")}`;
}

function upsertCustomer(payload) {
  const phone = payload.contactPhone ?? payload.phone ?? "";
  const normalizedPhone = normalizePhone(phone);
  const id = payload.customerId?.startsWith("cus-")
    ? payload.customerId
    : `cus-${normalizedPhone || Date.now()}`;
  const existingIndex = customers.findIndex(
    (customer) => customer.id === id || normalizePhone(customer.phone) === normalizedPhone,
  );
  const customer = {
    id: existingIndex >= 0 ? customers[existingIndex].id : id,
    name: payload.contactName ?? payload.name ?? customers[existingIndex]?.name ?? "Müşteri",
    phone: phone || customers[existingIndex]?.phone || "",
    email:
      payload.contactEmail === "Belirtilmedi"
        ? customers[existingIndex]?.email ?? ""
        : payload.contactEmail ?? payload.email ?? customers[existingIndex]?.email ?? "",
    addresses: payload.address ? [payload.address] : customers[existingIndex]?.addresses ?? [],
  };

  if (existingIndex >= 0) {
    customers[existingIndex] = customer;
  } else {
    customers = [customer, ...customers];
  }

  return customer;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, service: "fbs-mock-api" });
    return;
  }

  if (url.pathname === "/api/service-statuses" && request.method === "GET") {
    sendJson(response, 200, serviceStatuses);
    return;
  }

  if (url.pathname === "/api/customers" && request.method === "GET") {
    sendJson(response, 200, customers);
    return;
  }

  if (url.pathname === "/api/customers" && request.method === "POST") {
    try {
      const payload = await readBody(request);
      const customer = upsertCustomer(payload);
      sendJson(response, 201, customer);
    } catch {
      sendJson(response, 400, { error: "Geçersiz JSON gövdesi" });
    }
    return;
  }

  const customerMatch = url.pathname.match(/^\/api\/customers\/([^/]+)$/);
  if (customerMatch && request.method === "GET") {
    const customer = customers.find((item) => item.id === customerMatch[1]);
    sendJson(response, customer ? 200 : 404, customer ?? { error: "Müşteri bulunamadı" });
    return;
  }

  if (customerMatch && request.method === "PATCH") {
    try {
      const payload = await readBody(request);
      const customerIndex = customers.findIndex((item) => item.id === customerMatch[1]);

      if (customerIndex === -1) {
        sendJson(response, 404, { error: "Müşteri bulunamadı" });
        return;
      }

      customers[customerIndex] = {
        ...customers[customerIndex],
        ...payload,
        addresses: Array.isArray(payload.addresses)
          ? payload.addresses
          : customers[customerIndex].addresses,
      };
      services = services.map((service) =>
        service.customerId === customers[customerIndex].id
          ? {
              ...service,
              contactName: customers[customerIndex].name,
              contactPhone: customers[customerIndex].phone,
              contactEmail: customers[customerIndex].email || "Belirtilmedi",
              address: customers[customerIndex].addresses[0] ?? service.address,
            }
          : service,
      );
      sendJson(response, 200, customers[customerIndex]);
    } catch {
      sendJson(response, 400, { error: "Geçersiz JSON gövdesi" });
    }
    return;
  }

  if (url.pathname === "/api/services" && request.method === "GET") {
    sendJson(response, 200, services);
    return;
  }

  if (url.pathname === "/api/services" && request.method === "POST") {
    try {
      const payload = await readBody(request);
      const customer = upsertCustomer(payload);
      const now = new Date().toLocaleString("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      const service = {
        ...payload,
        id: `svc-${Date.now()}`,
        customerId: customer.id,
        contactName: customer.name,
        contactPhone: customer.phone,
        contactEmail: customer.email || "Belirtilmedi",
        trackingNo: generateTrackingNo(),
        currentStatus: payload.currentStatus ?? "Talep Alındı",
        lastUpdate: now,
        timeline: payload.timeline?.length
          ? payload.timeline
          : [
              {
                status: "Talep Alındı",
                date: now,
                note: "Talep mock API üzerinden alındı.",
                completed: false,
              },
            ],
        messages: payload.messages ?? [],
        photos: payload.photos ?? [],
        visibleNotes: payload.visibleNotes ?? ["Servis talebiniz FBS ekibine iletildi."],
        internalNotes: payload.internalNotes ?? [],
      };
      services = [service, ...services];
      sendJson(response, 201, service);
    } catch {
      sendJson(response, 400, { error: "Geçersiz JSON gövdesi" });
    }
    return;
  }

  const serviceMatch = url.pathname.match(/^\/api\/services\/([^/]+)$/);
  if (serviceMatch && request.method === "GET") {
    const service = services.find((item) => item.id === serviceMatch[1]);
    sendJson(response, service ? 200 : 404, service ?? { error: "Servis kaydı bulunamadı" });
    return;
  }

  if (serviceMatch && request.method === "PATCH") {
    try {
      const payload = await readBody(request);
      const serviceIndex = services.findIndex((item) => item.id === serviceMatch[1]);

      if (serviceIndex === -1) {
        sendJson(response, 404, { error: "Servis kaydı bulunamadı" });
        return;
      }

      services[serviceIndex] = {
        ...services[serviceIndex],
        ...payload,
        lastUpdate: new Date().toLocaleString("tr-TR", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };
      if (
        payload.contactName ||
        payload.contactPhone ||
        payload.contactEmail ||
        payload.address
      ) {
        upsertCustomer(services[serviceIndex]);
      }
      sendJson(response, 200, services[serviceIndex]);
    } catch {
      sendJson(response, 400, { error: "Geçersiz JSON gövdesi" });
    }
    return;
  }

  sendJson(response, 404, { error: "Endpoint bulunamadı" });
});

server.listen(port, () => {
  console.log(`FBS mock API running at http://localhost:${port}`);
});
