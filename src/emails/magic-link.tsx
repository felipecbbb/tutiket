import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type MagicLinkEmailProps = {
  url: string;
  appName?: string;
};

export function MagicLinkEmail({ url, appName = "proyecto" }: MagicLinkEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Tu enlace para entrar en {appName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Entra en {appName}</Heading>
          <Text style={paragraph}>
            Pulsa el botón para entrar. El enlace expira en 5 minutos y solo
            funciona una vez.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Link href={url} style={button}>
              Entrar ahora
            </Link>
          </Section>
          <Text style={small}>
            Si no funciona el botón, copia y pega esta URL en tu navegador:
          </Text>
          <Text style={mono}>{url}</Text>
          <Text style={small}>
            Si no pediste este email, puedes ignorarlo sin problema.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default MagicLinkEmail;

const body: React.CSSProperties = {
  backgroundColor: "#faf6ee",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: "40px 0",
};
const container: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e7e2d4",
  borderRadius: 12,
  margin: "0 auto",
  maxWidth: 480,
  padding: 32,
};
const heading: React.CSSProperties = {
  color: "#1a1410",
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 12,
};
const paragraph: React.CSSProperties = {
  color: "#1a1410",
  fontSize: 15,
  lineHeight: "22px",
  margin: "12px 0",
};
const button: React.CSSProperties = {
  background: "#ff5a1f",
  borderRadius: 10,
  color: "#fff",
  display: "inline-block",
  fontSize: 16,
  fontWeight: 600,
  padding: "14px 28px",
  textDecoration: "none",
};
const small: React.CSSProperties = {
  color: "#7a6f60",
  fontSize: 12,
  lineHeight: "18px",
  margin: "8px 0",
};
const mono: React.CSSProperties = {
  background: "#f4eedd",
  borderRadius: 6,
  color: "#1a1410",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 12,
  padding: "8px 10px",
  wordBreak: "break-all",
};
