import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const missingSupabaseEnv =
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const root = createRoot(document.getElementById("root")!);

if (missingSupabaseEnv) {
  root.render(
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Configuração do Supabase ausente</h1>
      <p style={{ margin: 0, opacity: 0.8 }}>
        Crie/edite <code>frontend/.env.local</code> com:
        <br />
        <code>VITE_SUPABASE_URL=...</code>
        <br />
        <code>VITE_SUPABASE_PUBLISHABLE_KEY=...</code>
        <br />
        e reinicie <code>npm run dev</code>.
      </p>
    </div>
  );
} else {
  root.render(<App />);
}
