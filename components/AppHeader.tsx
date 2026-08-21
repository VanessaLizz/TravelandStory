"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, Globe2, Map, Menu, NotebookTabs, Search } from "lucide-react";

const navigation = [
  { href: "/", label: "Visão geral", icon: Globe2 },
  { href: "/perfil", label: "Meu mapa", icon: Map },
  { href: "/#descobrir", label: "Descobrir", icon: Compass },
  { href: "/perfil#diario", label: "Diário", icon: NotebookTabs },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link className="brand" href="/" aria-label="Atlas, página inicial">
          <span className="brand__mark"><Globe2 size={20} strokeWidth={1.8} /></span>
          <span>atlas</span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : href.startsWith("/perfil") && pathname === "/perfil";
            return (
              <Link className={active ? "desktop-nav__link is-active" : "desktop-nav__link"} href={href} key={label}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="app-header__actions">
          <button className="icon-button search-button" type="button" aria-label="Pesquisar cidades e lugares">
            <Search size={18} />
          </button>
          <button className="icon-button" type="button" aria-label="Notificações">
            <Bell size={18} />
            <span className="notification-dot" />
          </button>
          <Link className="profile-button" href="/perfil" aria-label="Abrir perfil de Vanessa">
            <span>VS</span>
            <strong>Vanessa</strong>
          </Link>
          <button className="icon-button mobile-menu" type="button" aria-label="Abrir menu">
            <Menu size={20} />
          </button>
        </div>
      </div>

      <nav className="mobile-nav" aria-label="Navegação para celular">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : href.startsWith("/perfil") && pathname === "/perfil";
          return (
            <Link className={active ? "mobile-nav__link is-active" : "mobile-nav__link"} href={href} key={label}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
