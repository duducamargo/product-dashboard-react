import { AuthIcon } from "@/components/auth/AuthIcon";

const FEATURES = [
  { icon: "shield", label: "Secure API" },
  { icon: "speed", label: "High Performance" },
  { icon: "privacy", label: "Privacy First" },
  { icon: "spark", label: "Technical Test Env" },
] as const;

export function LoginFeatureList() {
  return (
    <ul className="login-features" aria-label="Application highlights">
      {FEATURES.map((feature) => (
        <li key={feature.label}>
          <AuthIcon name={feature.icon} size={17} />
          <span>{feature.label}</span>
        </li>
      ))}
    </ul>
  );
}
