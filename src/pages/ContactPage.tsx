import {
  Clock,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button, Card, Field, Input, Textarea } from "../components/ui";

const contactDetails = [
  {
    icon: Phone,
    title: "Telefon",
    text: "0424 238 44 08",
    href: "tel:+904242384408",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    text: "+90 530 501 74 01",
    href: "https://wa.me/905305017401",
  },
  {
    icon: Mail,
    title: "E-posta",
    text: "info@firatbilgisayar.com.tr",
    href: "mailto:info@firatbilgisayar.com.tr",
  },
  {
    icon: Instagram,
    title: "Instagram",
    text: "@fbsfiratbilgisayar",
    href: "https://www.instagram.com/fbsfiratbilgisayar/",
  },
  {
    icon: MapPin,
    title: "Adres",
    text: "Nail Bey, Tuncay Sk. No:09, 23100 Merkez/Elazığ",
    href: "https://share.google/VQvydZcJHdHad8PHZ",
  },
  {
    icon: Clock,
    title: "Çalışma saatleri",
    text: "Pazartesi - Cumartesi, 09:00 - 18:30",
  },
];

const googleMapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3114.8949669783656!2d39.218241977254834!3d38.674281859836114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4076c07afd15ff37%3A0xc5265f84aac5df4b!2sFBS%20F%C4%B1rat%20Bilgisayar%20Sistemleri!5e0!3m2!1str!2str!4v1777844985739!5m2!1str!2str";

const mapLinks = [
  {
    label: "Google Maps’te aç",
    href: "https://share.google/VQvydZcJHdHad8PHZ",
  },
  {
    label: "Apple Maps’te aç",
    href: "https://maps.apple/p/.fDfBYk8vyY0oK",
  },
  {
    label: "Yandex Maps’te aç",
    href: "https://yandex.com.tr/maps/-/CPWm5V2F",
  },
];

export function ContactPage() {
  return (
    <div className="px-5 pb-6 pt-6 md:px-0 md:pt-0">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">İletişim</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            Teknik servis, adresten teslim ve servis takibi için FBS’ye ulaşın.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            Bilgisayar, notebook, yazıcı, yazılım, ağ veya kurumsal bakım talepleriniz
            için iletişim formunu kullanabilirsiniz.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-1">
            {contactDetails.map((item) => (
              <ContactItem key={item.title} {...item} />
            ))}
          </div>
        </div>

        <Card className="space-y-4 p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ad soyad">
              <Input placeholder="Adınız soyadınız" />
            </Field>
            <Field label="Telefon">
              <Input placeholder="+90 ___ ___ __ __" />
            </Field>
          </div>
          <Field label="Konu">
            <Input placeholder="Teknik servis, yazıcı, ağ, bakım..." />
          </Field>
          <Field label="Mesaj">
            <Textarea placeholder="Nasıl yardımcı olabiliriz?" />
          </Field>
          <Button className="w-full md:w-auto">
            <Send size={18} />
            Mesaj gönder
          </Button>
        </Card>
      </section>

      <Card className="mt-6 overflow-hidden md:mt-10">
        <div className="grid gap-6 bg-brand-900 p-5 text-white md:grid-cols-[1fr_auto] md:items-center md:p-7">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-brand-700">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-100">
                Konum
              </p>
              <h2 className="mt-2 text-2xl font-black">FBS Fırat Bilgisayar Sistemleri</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/85">
                Nail Bey, Tuncay Sk. No:09, 23100 Merkez/Elazığ
              </p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
            {mapLinks.map((link) => (
              <a
                key={link.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-brand-700 transition hover:bg-brand-50"
                href={link.href}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink size={17} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <iframe
          allowFullScreen
          className="h-[360px] w-full border-0 md:h-[460px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={googleMapsEmbedUrl}
          title="FBS Fırat Bilgisayar Sistemleri Google Maps konumu"
        />
      </Card>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <Card className="flex items-start gap-3 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-black text-slate-950">{title}</p>
        <p className="mt-1 break-words text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} rel="noreferrer" target={href.startsWith("http") ? "_blank" : undefined}>
      {content}
    </a>
  );
}
