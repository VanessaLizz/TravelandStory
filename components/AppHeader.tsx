"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Compass,
  Map,
  MapPin,
  Menu,
  MountainSnow,
  Search,
  UsersRound,
} from "lucide-react";

const navigation = [
  { href: "/", label: "Explorar", icon: Compass },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/perfil", label: "Perfil", icon: MapPin },
  { href: "/#comunidade", label: "Comunidade", icon: UsersRound },
];

export function AppHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/mapa") return pathname === "/mapa";
    if (href === "/perfil") return pathname === "/perfil";
    return false;
  }

  return (
    <header className="travel-header">
      <div className="travel-header__inner">
        <Link
          className="travel-brand"
          href="/"
          aria-label="Atlas, página inicial"
        >
          <span className="travel-brand__mark">
            <MountainSnow size={19} />
          </span>
          <span>Atlas</span>
        </Link>

        <nav
          className="travel-desktop-nav"
          aria-label="Navegação principal"
        >
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              className={
                isActive(href)
                  ? "travel-nav-link is-active"
                  : "travel-nav-link"
              }
              href={href}
              key={label}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="travel-header__actions">
          <label className="travel-search">
            <Search size={16} />
            <input
              aria-label="Pesquisar cidades e lugares"
              placeholder="Pesquisar"
            />
          </label>

          <button
            className="travel-icon-button"
            type="button"
            aria-label="Notificações"
          >
            <Bell size={18} />
            <span className="travel-notification-dot" />
          </button>

          <Link
            className="travel-profile-button"
            href="/perfil"
            aria-label="Abrir perfil de Vanessa"
          >
            <span>VS</span>
            <strong>Vanessa</strong>
          </Link>

          <button
            className="travel-icon-button travel-menu-button"
            type="button"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <nav
        className="travel-mobile-nav"
        aria-label="Navegação para celular"
      >
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link
            className={
              isActive(href)
                ? "travel-mobile-link is-active"
                : "travel-mobile-link"
            }
            href={href}
            key={label}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
