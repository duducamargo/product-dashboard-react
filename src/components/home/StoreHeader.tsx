import { Link } from "react-router-dom";

type StoreHeaderProps = {
  onSignOut: () => void;
};

export function StoreHeader({ onSignOut }: StoreHeaderProps) {
  return (
    <header className="store-header">
      <Link className="store-brand" to="/home" aria-label="TechStore home">
        TechStore
      </Link>

      <button className="header-action" type="button" onClick={onSignOut}>
        Sair
      </button>
    </header>
  );
}
