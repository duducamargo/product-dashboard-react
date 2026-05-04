import type { ReactNode } from "react";
import { LoginFeatureList } from "@/components/auth/LoginFeatureList";
import { AppFooter } from "@/components/layout/AppFooter";
import techstoreIconUrl from "@/assets/techstore-icon.svg";
import "@/components/auth/AuthPageLayout.css";

type AuthPageLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  prompt?: string;
  promptActionLabel?: string;
  promptActionTo?: string;
};

export function AuthPageLayout({
  title,
  description,
  children,
  prompt,
  promptActionLabel,
  promptActionTo,
}: AuthPageLayoutProps) {
  return (
    <main className="auth-page">
      <div className="auth-content">
        <header className="auth-brand">
          <div className="auth-logo-container">
            <img className="auth-logo" src={techstoreIconUrl} alt="" aria-hidden="true" />
            <strong>TechStore</strong>
          </div>
          <p>A escolha confiável para hardware profissional.</p>
        </header>

        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-heading">
            <h1 id="auth-title">{title}</h1>
            <p>{description}</p>
          </div>

          {children}

          {prompt && promptActionLabel && promptActionTo ? (
            <>
              <div className="auth-divider" />

              <p className="auth-prompt">
                {prompt} <a className="link-button" href={promptActionTo}>{promptActionLabel}</a>
              </p>
            </>
          ) : null}
        </section>

        <LoginFeatureList />
      </div>

      <AppFooter />
    </main>
  );
}
