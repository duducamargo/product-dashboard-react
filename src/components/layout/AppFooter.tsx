import "@/components/layout/AppFooter.css";
import techstoreIconUrl from "@/assets/techstore-icon.svg";

const FOOTER_LINKS = [
  { label: "Termos de Privacidade", href: "/" },
  { label: "Termos de Uso", href: "/" },
  { label: "Github", href: "/" },
  { label: "Documentação", href: "/" },
] as const;

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-brand">
        <div className="app-footer-logo-row">
          <img className="app-footer-logo" src={techstoreIconUrl} alt="" aria-hidden="true" />
          <strong>TechStore</strong>
        </div>

        <p>&copy; 2026 TechStore. Feito para ser rápido e confiável.</p>
      </div>

      <nav className="app-footer-nav" aria-label="Footer links">
        {FOOTER_LINKS.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
