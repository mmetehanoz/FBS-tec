import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="hidden border-t border-slate-200 bg-white md:block">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-xl font-black text-slate-950">FBS Fırat Bilgisayar Sistemleri</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            1998’den beri Elazığ’da bilgisayar sistemleri, teknik servis, yazılım lisansları,
            kamera güvenlik çözümleri ve kurumsal destek hizmetleri sunar.
          </p>
        </div>
        <div>
          <h3 className="font-black text-slate-950">Kurumsal</h3>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600">
            <Link to="/hakkimizda">Hakkımızda</Link>
            <Link to="/bayilikler">Bayilikler</Link>
            <Link to="/yeterlilikler">Yeterlilikler</Link>
            <Link to="/iletisim">İletişim</Link>
          </div>
        </div>
        <div>
          <h3 className="font-black text-slate-950">Müşteri Portalı</h3>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600">
            <Link to="/servis-talebi">Servis Talebi Oluştur</Link>
            <Link to="/servis-takip">Servis Takip</Link>
            <Link to="/mesajlar">Mesajlar</Link>
            <Link to="/admin">Admin Panel</Link>
          </div>
        </div>
        <div>
          <h3 className="font-black text-slate-950">İletişim</h3>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600">
            <a href="tel:+904242384408">0424 238 44 08</a>
            <a href="mailto:info@firatbilgisayar.com.tr">info@firatbilgisayar.com.tr</a>
            <a href="https://wa.me/905305017401" rel="noreferrer" target="_blank">
              WhatsApp
            </a>
            <span>Nail Bey, Tuncay Sk. No:09, Merkez/Elazığ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
