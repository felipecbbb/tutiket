import { Resend } from "resend";
import { render } from "@react-email/render";
import { env } from "@/lib/env";

let resend: Resend | null = null;
function getClient(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(env.RESEND_API_KEY);
  return resend;
}

type SendEmailInput = {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
  replyTo?: string;
};

/**
 * Envía un email vía Resend. En desarrollo, si no hay RESEND_API_KEY,
 * loguea el contenido por consola y devuelve éxito — útil para iterar
 * el flujo de auth sin configurar credenciales.
 */
export async function sendEmail({ to, subject, react, from, replyTo }: SendEmailInput) {
  const client = getClient();
  const sender = from ?? env.EMAIL_FROM;

  if (!client) {
    const html = await render(react);
    console.warn(
      `[email:dev] RESEND_API_KEY ausente — log en lugar de envío real`,
    );
    console.warn(`  to=${to}`);
    console.warn(`  subject=${subject}`);
    console.warn(`  from=${sender}`);
    console.warn(`  body:\n${html}\n`);
    return { id: "dev-log", skipped: true as const };
  }

  const { data, error } = await client.emails.send({
    from: sender,
    to,
    subject,
    react,
    replyTo,
  });

  if (error) {
    console.error("[email] envío fallido:", error);
    throw new Error(`Resend error: ${error.message ?? "unknown"}`);
  }
  return { id: data?.id ?? null, skipped: false as const };
}
