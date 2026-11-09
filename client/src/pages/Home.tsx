import { ArrowUpRight, BellRing, Scissors } from "lucide-react";
import { SiteLayout } from "@/components/MoaLayout";

import "./home-highlights.css";
import PreparationIllustration from "@/components/PreparationIllustration";
import { sitePath } from "@/lib/site-path";
function ProductConcept({ preparation = false }: { preparation?: boolean }) {
  return (
    <figure className="product-scene">
      <div className="scene-grid" aria-hidden="true" />
      <div
        className="device"
        role="img"
        aria-label="시간 표시창과 약을 담는 컵으로 구성된 복약 기기 콘셉트 일러스트"
      >
        <div className="device-top" />
        <div className="device-display">
          <span className="display-dot" />
          아침 약 준비 시간<strong>08:30</strong>
          <span>한 번분 준비 완료</span>
        </div>
        <div className="device-slot">
          <div className="device-nozzle" />
          <div className="medicine-cup">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="device-foot" />
      </div>
      <div className="scene-note">
        <span className="note-icon">
          {preparation ? <Scissors size={19} /> : <BellRing size={19} />}
        </span>
        <div>
          <strong>
            {preparation ? "약봉지 그대로 넣으세요" : "약 챙길 시간이에요"}
          </strong>
          <span>
            {preparation
              ? "자동으로 잘라 컵에 담아요"
              : "한 번분을 컵에 준비해요"}
          </span>
        </div>
      </div>
      <figcaption>
        제품 이해를 돕는 콘셉트 일러스트 · 실제 제품과 다를 수 있습니다
      </figcaption>
    </figure>
  );
}
function CupIllustration({ reminder = false }: { reminder?: boolean }) {
  return (
    <div
      className={`cup-illustration ${reminder ? "cup-reminder" : ""}`}
      role="img"
      aria-label={
        reminder
          ? "컵에 남아 있는 약과 다시 울리는 알림을 표현한 일러스트"
          : "여러 약봉지의 약이 한 컵에 모이는 일러스트"
      }
    >
      {reminder ? (
        <div className="reminder-signal">
          <span className="signal-ring" />
          <span className="signal-ring outer" />
          <BellRing size={32} strokeWidth={1.6} />
        </div>
      ) : (
        <div className="packet-row">
          {[0, 1, 2].map(n => (
            <div className={`medicine-packet packet-${n}`} key={n}>
              <span />
              <i />
              <i />
            </div>
          ))}
        </div>
      )}
      {!reminder && (
        <div className="packet-path" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}
      <div className="large-cup">
        <div className="cup-interior">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="cup-shadow" />
      {reminder && (
        <span className="reminder-label">
          <span />
          약이 남아 있어요
        </span>
      )}
    </div>
  );
}
export default function Home() {
  return (
    <SiteLayout>
      <main id="main">
        <section className="hero restored-hero" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">부모님을 위한 스마트 복약 케어</p>
              <h1 id="hero-title">
                부모님 약,
                <br />
                <span>챙기기 힘드시죠?</span>
              </h1>
              <p className="hero-description">이제 쉽게 관리하세요.</p>
              <div className="restored-price">
                <strong>월 49,800원</strong>
                <span>출시 예정</span>
              </div>
            </div>
            <ProductConcept />
          </div>
        </section>
        <section
          id="experience"
          className="restored-features"
          aria-label="스마트 복약 케어 핵심 기능"
        >
          <div className="wrap">
            <div className="benefit-grid">
              <article className="benefit-card">
                <div className="benefit-copy">
                  <p className="benefit-kicker">약 종류가 많아도,</p>
                  <h2>
                    먹어야 할 만큼,
                    <br />
                    <span>한 컵에.</span>
                  </h2>
                  <p>자동으로 한 번분을 조합해요.</p>
                </div>
                <CupIllustration />
              </article>
              <article className="benefit-card">
                <div className="benefit-copy">
                  <h2>
                    컵에 약이 남아 있으면,
                    <br />
                    <span>계속 알려드려요.</span>
                  </h2>
                  <p>깜빡해도 다시 알림.</p>
                </div>
                <CupIllustration reminder />
              </article>
            </div>
            <p className="fine-print benefits-note">
              출시 준비 중인 기능입니다. 스마트컵 감지는 복용 확인을 돕지만 실제
              복용 여부를 확정하지는 않습니다.
            </p>
          </div>
        </section>
        <section
          className="preparation-section"
          aria-labelledby="preparation-title"
        >
          <div className="wrap preparation-grid">
            <div className="preparation-copy">
              <p className="eyebrow">매일의 복약을 더 간편하게</p>
              <h2 id="preparation-title">
                처방받은 약봉지,
                <br />
                <span>
                  그대로 넣으면
                  <br />
                  자동으로 잘라 담아요.
                </span>
              </h2>
            </div>
            <PreparationIllustration />
          </div>
        </section>
        <section className="launch-section">
          <div className="wrap launch-inner">
            <p className="eyebrow">더 편안한 약 관리의 시작</p>
            <h2>
              출시 소식,
              <br />
              가장 먼저 전해드릴게요.
            </h2>
            <p>연락처 하나로 새로운 소식을 받아보세요.</p>
            <span className="quiet">무료 알림 신청 · 결제 정보 입력 없이</span>
            <a className="text-link" href={sitePath("/price")}>
              예정 요금과 자주 묻는 질문 <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
