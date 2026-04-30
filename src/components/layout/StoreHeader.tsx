import { Link } from "react-router-dom";
import techstoreIconUrl from "@/assets/techstore-icon.svg";

type StoreHeaderProps = {
  onSignOut: () => void;
};

export function StoreHeader({ onSignOut }: StoreHeaderProps) {
  return (
    <header className="store-header">
      <Link className="store-brand" to="/home" aria-label="TechStore home">
        <img className="store-brand-icon" src={techstoreIconUrl} alt="" aria-hidden="true" />
        <span>TechStore</span>
      </Link>

      <button className="header-action" type="button" onClick={onSignOut}>
        Sair
      </button>
    </header>
  );
}
