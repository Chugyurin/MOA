import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { LaunchButton, LaunchProvider } from "./LaunchDialog";
type PageName = "about" | "how" | "care" | "price";
const links = [
  { label: "서비스 살펴보기", href: "/", page: "about" },
  { label: "이용 방법", href: "/how", page: "how" },
  { label: "추가 돌봄", href: "/care", page: "care" },
  { label: "요금·자주 묻는 질문", href: "/price", page: "price" },
];
export function SiteLayout({
  children,
  active = "about",
}: {
  children: ReactNode;
  active?: PageName;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <LaunchProvider>
      <div className="site-shell">
        <a className="skip-link" href="#main">
          본문 바로가기
        </a>
        <header className="site-header">
          <div className="wrap header-inner">
            <a href="/" className="mobile-home">
              서비스 살펴보기
            </a>
            <nav
              id="main-menu"
              className={`nav-links ${menuOpen ? "nav-open" : ""}`}
              aria-label="주요 메뉴"
            >
              {links.map(link => (
                <a
                  href={link.href}
                  key={link.page}
                  aria-current={active === link.page ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
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
              <strong>매일의 복약을, 조금 더 편안하게.</strong>
              <p>부모님과 가족을 위한 스마트 복약 케어</p>
            </div>
            <p>
              출시를 준비 중인 서비스입니다.
              <br />
              제품 사양과 기능, 이용 조건은 개발 과정에서 달라질 수 있습니다.
            </p>
            <a href="/price">이용 안내 보기 ↗</a>
          </div>
        </footer>
        <div
          className="launch-dock"
          role="region"
          aria-label="무료 출시 알림 신청"
        >
          <LaunchButton />
        </div>
      </div>
    </LaunchProvider>
  );
}
