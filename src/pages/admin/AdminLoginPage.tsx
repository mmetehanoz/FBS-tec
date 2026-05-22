import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Field, Input } from "../../components/ui";
import { usePortalStore } from "../../hooks/usePortalStore";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminAuthenticated = usePortalStore((state) => state.isAdminAuthenticated);
  const adminLogin = usePortalStore((state) => state.adminLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const from = typeof location.state?.from === "string" ? location.state.from : "/admin";

  if (isAdminAuthenticated) {
    return <Navigate replace to="/admin" />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const isValid = await adminLogin(username, password);
    setIsLoading(false);

    if (!isValid) {
      setError("Kullanıcı adı veya şifre hatalı.");
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#d9edff_0,#f5f8fc_38%,#ffffff_100%)] px-5 py-10 text-slate-900">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">
              FBS Admin
            </p>
            <h1 className="text-2xl font-black text-slate-950">Güvenli giriş</h1>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Kullanıcı adı">
            <Input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
          </Field>
          <Field label="Şifre">
            <Input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <Button className="w-full" type="submit" disabled={isLoading}>
            <LockKeyhole size={18} />
            {isLoading ? "Giriş yapılıyor..." : "Admin paneline gir"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
