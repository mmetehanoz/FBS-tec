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

let services = [
  {
    id: "svc-1",
    trackingNo: "FBS-2026-05-02-001",
    customerId: "cus-1",
    productCategory: "Notebook",
    brand: "Lenovo",
    model: "ThinkPad E15",
    serialNo: "LNV-E15-8X21",
    warranty: "Garanti dışı",
    issueTitle: "Açılışta siyah ekran",
    description: "Cihaz güç alıyor ancak ekrana görüntü gelmiyor.",
    urgency: "Acil",
    preference: "Ürün adresten alınsın",
    address: "Cumhuriyet Mah. Malatya Cad. No: 42 Elazığ",
    appointment: "06 Mayıs 2026, 10:30",
    currentStatus: "Fiyat Onayı Bekleniyor",
    lastUpdate: "03 Mayıs 2026, 14:20",
    estimatedDelivery: "07 Mayıs 2026",
    technician: "Murat Demir",
    visibleNotes: ["Anakart güç hattında kısa devre tespit edildi."],
    internalNotes: ["BIOS hattı da test edilecek."],
    photos: [],
    priceOffer: {
      title: "Anakart güç devresi onarımı",
      amount: 2450,
      status: "Bekliyor",
    },
    timeline: [
      {
        status: "Talep Alındı",
        date: "02 Mayıs 2026, 09:12",
        note: "Servis talebi müşteri portalından oluşturuldu.",
        completed: true,
      },
      {
        status: "Fiyat Onayı Bekleniyor",
        date: "03 Mayıs 2026, 14:35",
        note: "Teklif müşteriye iletildi.",
        completed: false,
      },
    ],
    messages: [
      {
        id: "msg-1",
        from: "technician",
        text: "Merhaba, cihazınızda güç hattı arızası tespit ettik.",
        time: "14:24",
      },
    ],
  },
];

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

  if (url.pathname === "/api/services" && request.method === "GET") {
    sendJson(response, 200, services);
    return;
  }

  if (url.pathname === "/api/services" && request.method === "POST") {
    try {
      const payload = await readBody(request);
      const now = new Date().toLocaleString("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      const service = {
        ...payload,
        id: `svc-${Date.now()}`,
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
