import { AuthIcon } from "@/components/auth/AuthIcon";

const FEATURES = [
  { icon: "shield", label: "API segura" },
  { icon: "speed", label: "Alta performance" },
  { icon: "privacy", label: "Privacidade primeiro" },
  { icon: "spark", label: "Ambiente de teste" },
] as const;

export function LoginFeatureList() {
  return (
    <ul className="login-features" aria-label="Destaques da aplicacao">
      {FEATURES.map((feature) => (
        <li key={feature.label}>
          <AuthIcon name={feature.icon} size={17} />
          <span>{feature.label}</span>
        </li>
      ))}
    </ul>
  );
}
