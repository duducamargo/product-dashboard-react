import "@/components/layout/AppFooter.css";

const FOOTER_LINKS = [
  { label: "Privacy", href: "/" },
  { label: "Terms", href: "/" },
  { label: "Support", href: "/" },
  { label: "Docs", href: "/" },
] as const;

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-brand">
        <div className="app-footer-logo-row">
          <span className="app-footer-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17V8.5l4.4 2.7V20L7 17Z"
                fill="currentColor"
                opacity="0.9"
              />
              <path d="M7 8.5 12 5l5 3.4-4.6 2.8L7 8.5Z" fill="currentColor" />
              <path
                d="M13 12.2 18 9v8l-5 3v-7.8Z"
                fill="currentColor"
                opacity="0.72"
              />
              <path
                d="M4.5 5.8 2.8 4.1M5.5 3.7 4.9 1.4M8 3.5 9.5 1.8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
          <strong>TechStore</strong>
        </div>

        <p>&copy; 2024 TechStore. Powered by Precision Commerce Engine.</p>
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
