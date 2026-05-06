import { Link } from "react-router-dom";
import { Button, Card } from "../components/ui";

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-5">
      <Card className="max-w-md p-6 text-center">
        <h1 className="text-2xl font-black text-slate-950">Sayfa bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-600">Aradığınız route bu mock portalda tanımlı değil.</p>
        <Link to="/">
          <Button className="mt-5 w-full">Ana sayfaya dön</Button>
        </Link>
      </Card>
    </div>
  );
}
