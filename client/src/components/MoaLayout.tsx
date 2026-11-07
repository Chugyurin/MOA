import { useState, type ReactNode } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

type PageName = "about" | "how" | "care" | "price";

const links: { label: string; href: string; page: PageName }[] = [
  { label: "MOA 소개", href: "/about", page: "about" },
  { label: "이용 방법", href: "/how", page: "how" },
  { label: "돌봄 서비스", href: "/care", page: "care" },
  { label: "이용 안내", href: "/price", page: "price" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="/"
      className={`logo ${light ? "logo-light" : ""}`}
      aria-label="MOA 홈으로"
    >
      <span className="logo-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>
        moa<span className="logo-dot">.</span>
      </span>
    </a>
  );
}

export function SiteLayout({
  children,
  active,
}: {
  children: ReactNode;
  active?: PageName;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <div className="header-inner wrap">
          <Logo />
          <nav
            id="main-menu"
            className={menuOpen ? "nav-links nav-open" : "nav-links"}
            aria-label="주요 메뉴"
          >
            {links.map(link => (
              <a
                key={link.page}
                href={link.href}
                aria-current={active === link.page ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href="/#signup">
            출시 알림 받기 <ArrowRight size={17} />
          </a>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div>
            <Logo light />
            <p>부모님의 일상에 안심을 모으다.</p>
          </div>
          <div className="footer-right">
            <p>
              MOA는 출시를 준비 중인 스마트 복약 케어 서비스입니다.
              <br />
              제품과 기능은 개발 과정에서 달라질 수 있습니다.
            </p>
            <span>© MOA. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
