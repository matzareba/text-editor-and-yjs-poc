import { useLocation } from "react-router-dom";
import { Link } from "./Link";

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home" },
  { path: "/blocknote-partykit", label: "BlockNote on PartyKit Cloud" },
  { path: "/blocknote-owncf", label: "BlockNote on Own CloudFlare" },
  { path: "/tiptap-owncf", label: "Tiptap on Own CloudFlare" },
];

export const NavBar = () => {
  const location = useLocation();

  return (
    <nav
      style={{
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #e9ecef",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              variant="nav"
              isActive={location.pathname === item.path}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
