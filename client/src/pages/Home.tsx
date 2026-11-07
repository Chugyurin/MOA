import {
  ArrowDown,
  ArrowUpRight,
  BellRing,
  Check,
  Clock3,
  Smartphone,
} from "lucide-react";
import { SiteLayout } from "@/components/MoaLayout";
import { LaunchButton } from "@/components/LaunchDialog";
function ProductConcept() {
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
          <span>오늘도 편안한 하루 되세요</span>
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
          <BellRing size={19} />
        </span>
        <div>
          <strong>약 챙길 시간이에요</strong>
          <span>한 번분을 컵에 준비해요</span>
        </div>
      </div>
      <figcaption>
        제품 이해를 돕는 콘셉트 일러스트 · 실제 제품과 다를 수 있습니다
      </figcaption>
    </figure>
  );
}
export default function Home() {
  return (
    <SiteLayout>
      <main id="main">
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="status-dot" />
                스마트 복약 케어 · 출시 준비 중
              </p>
              <h1>
                부모님의 약 시간,
                <br />
                마음이 놓이는
                <br />
                <span>일상이 되도록.</span>
              </h1>
              <p className="hero-description">
                약을 준비하는 순간부터 확인까지.
                <br />
                부모님께는 간편함을, 가족에게는 안심을 더해요.
              </p>
              <div className="hero-actions">
                <LaunchButton />
                <p className="quiet">
                  신청은 무료예요. 구매나 결제로 이어지지 않아요.
                </p>
              </div>
              <a className="text-link" href="#experience">
                어떤 서비스인지 살펴보기 <ArrowDown size={17} />
              </a>
            </div>
            <ProductConcept />
          </div>
        </section>
        <section id="experience" className="experience section">
          <div className="wrap">
            <div className="section-heading">
              <p className="eyebrow">매일 반복되는 일이니까</p>
              <h2>
                챙기는 수고는 덜고,
                <br />
                함께 살피는 마음은 더하고.
              </h2>
              <p>복잡한 약 관리를 돕는 세 가지 연결을 준비하고 있어요.</p>
            </div>
            <div className="feature-columns">
              <article>
                <span className="feature-number">01 / 준비</span>
                <h3>
                  여러 약봉지에서
                  <br />한 번분을 한 컵으로.
                </h3>
                <p>
                  설정한 시간에 약봉지를 열고,
                  <br />
                  먹어야 할 만큼 컵에 담도록 개발 중이에요.
                </p>
                <a className="text-link" href="/how">
                  처음 이용하는 방법 <ArrowUpRight size={18} />
                </a>
              </article>
              <article>
                <span className="feature-number">02 / 알림</span>
                <h3>
                  놓치기 쉬운 약 시간,
                  <br />한 번 더 알려드려요.
                </h3>
                <p>
                  컵에 약이 남아 있으면 알림으로
                  <br />
                  다시 확인할 수 있도록 준비하고 있어요.
                </p>
                <span className="feature-symbol">
                  <Clock3 size={42} strokeWidth={1.3} />
                </span>
              </article>
              <article>
                <span className="feature-number">03 / 확인</span>
                <h3>
                  곁에 있지 못할 때도,
                  <br />
                  앱으로 함께 살펴요.
                </h3>
                <p>
                  부모님의 약 준비 상태와 알림을
                  <br />
                  가족이 앱에서 확인하도록 만들고 있어요.
                </p>
                <span className="feature-symbol">
                  <Smartphone size={42} strokeWidth={1.3} />
                </span>
              </article>
            </div>
            <p className="fine-print feature-disclaimer">
              개발 중인 기능입니다. 컵에 남은 약의 감지는 실제 복용 여부를
              확정하지 않으며, 약과 포장 형태에 따른 호환성은 검증 후
              안내합니다.
            </p>
          </div>
        </section>
        <section className="connection section">
          <div className="wrap connection-grid">
            <div
              className="app-preview"
              role="img"
              aria-label="보호자 앱의 알림 화면 예시"
            >
              <div className="preview-top">
                <span>가족의 오늘</span>
                <span>화면 예시</span>
              </div>
              <h3>엄마의 약 시간</h3>
              <p>오늘도 차근차근, 함께 챙겨요.</p>
              <div className="schedule-row">
                <span className="schedule-check">
                  <Check size={20} />
                </span>
                <div>
                  <strong>아침 약 준비</strong>
                  <span>오전 8:30 · 컵에 약을 담았어요</span>
                </div>
                <span className="state-tag">준비됨</span>
              </div>
              <div className="schedule-row">
                <span className="schedule-clock">
                  <Clock3 size={20} />
                </span>
                <div>
                  <strong>점심 약 준비</strong>
                  <span>오후 12:30 · 준비 예정이에요</span>
                </div>
              </div>
              <div className="app-notice">
                <BellRing size={20} />
                <p>
                  컵에 남은 약이 감지되면
                  <br />
                  <strong>다시 확인할 수 있도록 알려드려요.</strong>
                </p>
              </div>
              <p className="preview-caption">
                개발 방향을 설명하기 위한 예시 화면입니다.
              </p>
            </div>
            <div className="connection-copy">
              <p className="eyebrow">멀리 있어도, 마음은 가까이</p>
              <h2>
                매번 묻기 어려웠던
                <br />
                “약은 챙겨 드셨어요?”
              </h2>
              <p>
                부모님의 일상은 존중하면서,
                <br />
                필요한 순간에 함께 확인할 수 있도록.
              </p>
              <p>
                기기와 스마트컵, 보호자 앱을 연결해
                <br />
                가족의 돌봄에 작은 여유를 더하려 해요.
              </p>
              <a className="text-link" href="/care">
                추가로 준비 중인 돌봄 서비스 <ArrowUpRight size={18} />
              </a>
            </div>
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
            <p>이메일 하나로 새로운 소식을 받아보세요.</p>
            <LaunchButton />
            <span className="quiet">무료 알림 신청 · 결제 정보 입력 없이</span>
            <a className="text-link" href="/price">
              예정 요금과 자주 묻는 질문 <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
