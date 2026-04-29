import { useAuth } from "@/hooks/useAuth";

export function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <main className="home-placeholder">
      <section>
        <p className="eyebrow">Area autenticada</p>
        <h1>Login realizado com sucesso</h1>
        <p>
          {user?.firstName
            ? `${user.firstName}, a listagem de produtos sera implementada na proxima etapa.`
            : "A listagem de produtos sera implementada na proxima etapa."}
        </p>
        <button className="button-secondary" type="button" onClick={signOut}>
          Sair
        </button>
      </section>
    </main>
  );
}
