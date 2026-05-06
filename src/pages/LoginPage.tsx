import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Smartphone, UserPlus } from "lucide-react";
import { Button, Card, Field, Input } from "../components/ui";
import { usePortalStore } from "../hooks/usePortalStore";

type AuthMode = "login" | "register";
type AuthStep = "details" | "otp";

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<AuthStep>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const login = usePortalStore((state) => state.login);
  const registerCustomer = usePortalStore((state) => state.registerCustomer);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/servis-takip";

  const isRegister = mode === "register";
  const canContinue = isRegister
    ? name.trim().length > 2 && phone.trim().length >= 10 && email.includes("@")
    : phone.trim().length >= 10;

  const resetMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setStep("details");
    setOtp("");
  };

  const verify = () => {
    if (isRegister) {
      registerCustomer({ name, phone, email });
    } else {
      login({ phone });
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#d9edff_0,#f5f8fc_38%,#ffffff_100%)] px-5 py-8">
      <Card className="w-full max-w-lg p-5 md:p-6">
        <Link
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-brand-700"
          to="/"
        >
          <ArrowLeft size={17} />
          Ana sayfaya dön
        </Link>

        <div className="mb-6 grid h-14 w-14 place-items-center rounded-lg bg-brand-50 text-brand-700">
          {step === "otp" ? <ShieldCheck size={28} /> : isRegister ? <UserPlus size={28} /> : <Smartphone size={28} />}
        </div>

        <h1 className="text-2xl font-black text-slate-950">
          {isRegister ? "FBS müşteri üyeliği" : "Üye girişi"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Servis takip, mesajlar ve hesap alanı için müşteri girişi gerekir. Doğrulama mock SMS
          kodu ile simüle edilir.
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button
            className={`min-h-11 rounded-lg text-sm font-black transition ${
              mode === "login" ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"
            }`}
            onClick={() => resetMode("login")}
            type="button"
          >
            Üye girişi
          </button>
          <button
            className={`min-h-11 rounded-lg text-sm font-black transition ${
              mode === "register" ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"
            }`}
            onClick={() => resetMode("register")}
            type="button"
          >
            Yeni üyelik
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {step === "details" ? (
            <>
              {isRegister ? (
                <Field label="Ad soyad">
                  <Input
                    placeholder="Adınız soyadınız"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Field>
              ) : null}
              <Field label="Telefon numarası">
                <Input
                  inputMode="tel"
                  placeholder="+90 5__ ___ __ __"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </Field>
              {isRegister ? (
                <Field label="E-posta">
                  <Input
                    inputMode="email"
                    placeholder="ornek@mail.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Field>
              ) : null}
              <Button className="w-full" disabled={!canContinue} onClick={() => setStep("otp")}>
                SMS kodu gönder
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-lg bg-brand-50 p-4 text-sm leading-6 text-brand-800">
                SMS kodu <strong>{phone}</strong> numarasına gönderildi. Mock doğrulama için
                istediğiniz 4-6 haneli kodu girebilirsiniz.
              </div>
              <Field label="SMS doğrulama kodu">
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
              </Field>
              <Button className="w-full" disabled={otp.length < 4} onClick={verify}>
                {isRegister ? "Üyeliği oluştur ve giriş yap" : "Giriş yap"}
              </Button>
              <Button className="w-full" variant="ghost" onClick={() => setStep("details")}>
                Bilgileri düzenle
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
