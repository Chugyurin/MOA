import {
  ArrowRight,
  BellRing,
  ChevronDown,
  HeartHandshake,
  PackageOpen,
  Pill,
  Scissors,
  Smartphone,
  Sparkles,
  Wine,
} from "lucide-react";
import { SiteLayout } from "@/components/MoaLayout";
import "./detail.css";

const productImage = "/manus-storage/pasted_file_Fx42Ad_image_0050fba3.png";

function LaunchLink() {
  return (
    <a className="detail-button" href="/#signup">
      무료로 출시 알림 받기 <ArrowRight size={19} aria-hidden="true" />
    </a>
  );
}

function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <div className="detail-intro">
      <p className="detail-eyebrow">{label}</p>
      <h1>{title}</h1>
      <p className="detail-lead">{description}</p>
    </div>
  );
}

function NextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a className="detail-next-link" href={href}>
      {children} <ArrowRight size={19} aria-hidden="true" />
    </a>
  );
}

export function AboutPage() {
  return (
    <SiteLayout active="about">
      <main className="detail-page">
        <section className="detail-about-hero">
          <div className="detail-wrap detail-about-grid">
            <div className="detail-about-copy">
              <PageIntro
                label="MOA 소개"
                title={
                  <>
                    돌봄의 마음은 그대로,
                    <br />
                    <em>약 관리의 부담은 가볍게.</em>
                  </>
                }
                description={
                  <>
                    기기와 스마트컵, 앱을 하나로 연결해
                    <br />
                    부모님의 매일을 함께 살피는 MOA입니다.
                  </>
                }
              />
              <div className="detail-actions">
                <LaunchLink />
                <NextLink href="/how">이용 방법 보기</NextLink>
              </div>
              <p className="detail-caption">
                MOA는 개발 중인 스마트 복약 케어 서비스입니다.
              </p>
            </div>
            <figure className="detail-product">
              <img
                src={productImage}
                alt="MOA 스마트 복약 기기와 스마트컵 디자인 시안"
              />
              <figcaption>MOA 스마트 복약 기기 · 디자인 시안</figcaption>
            </figure>
          </div>
        </section>

        <section className="detail-section">
          <div className="detail-wrap">
            <div className="detail-section-heading">
              <div>
                <p className="detail-eyebrow">MOA와 함께</p>
                <h2>
                  매일의 약 관리를
                  <br />
                  <em>하나로 모아.</em>
                </h2>
              </div>
              <p>
                준비부터 확인까지,
                <br />
                가족의 부담을 덜 수 있도록 생각했어요.
              </p>
            </div>
            <div className="detail-feature-grid">
              <article className="detail-feature">
                <span className="detail-icon">
                  <PackageOpen size={26} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3>복약 기기</h3>
                <p>보호자가 채운 약을 시간에 맞춰 준비하도록 만들고 있어요.</p>
              </article>
              <article className="detail-feature">
                <span className="detail-icon">
                  <Wine size={26} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3>스마트컵</h3>
                <p>컵에 남은 약을 감지해 확인을 돕도록 개발 중이에요.</p>
              </article>
              <article className="detail-feature">
                <span className="detail-icon">
                  <Smartphone size={26} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3>보호자 앱</h3>
                <p>
                  복용 시간과 알림을
                  <br />
                  확인할 수 있도록 준비해요.
                </p>
              </article>
            </div>
            <p className="detail-note">
              제품과 기능은 개발 중이며, 약 종류와 포장 형태에 따른 호환성은
              검증이 필요합니다.
            </p>
          </div>
        </section>
        <BottomBanner
          title="MOA가 어떻게 작동하는지 궁금하신가요?"
          href="/how"
          linkText="이용 방법 살펴보기"
        />
      </main>
    </SiteLayout>
  );
}

export function HowPage() {
  return (
    <SiteLayout active="how">
      <main className="detail-page">
        <section className="detail-simple-hero">
          <div className="detail-wrap">
            <PageIntro
              label="이용 방법"
              title={
                <>
                  약을 챙기는 하루,
                  <br />
                  <em>세 단계로 간단하게.</em>
                </>
              }
              description={
                <>보호자가 약을 채우고, MOA가 준비와 확인을 도와요.</>
              }
            />
            <div className="detail-actions">
              <LaunchLink />
            </div>
          </div>
        </section>
        <section className="detail-section detail-steps-section">
          <div className="detail-wrap">
            <div className="detail-steps">
              <article className="detail-step">
                <div className="detail-step-top">
                  <span>01</span>
                  <PackageOpen size={27} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <p className="detail-step-label">채우기</p>
                <h2>보호자가 약을 채워요</h2>
                <p>보호자가 약봉지와 약을 기기에 직접 채워요.</p>
              </article>
              <article className="detail-step">
                <div className="detail-step-top">
                  <span>02</span>
                  <Scissors size={27} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <p className="detail-step-label">준비하기</p>
                <h2>시간에 맞춰 컵에 담아요</h2>
                <p>
                  설정한 시간에 약봉지를 열고 한 번분의 약을 컵에 담도록 개발
                  중이에요.
                </p>
              </article>
              <article className="detail-step">
                <div className="detail-step-top">
                  <span>03</span>
                  <BellRing size={27} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <p className="detail-step-label">확인하기</p>
                <h2>앱에서 확인해요</h2>
                <p>
                  스마트컵으로 남은 약을 감지하고, 앱에서 확인과 알림을 받을 수
                  있도록 준비 중이에요.
                </p>
              </article>
            </div>
            <div className="detail-notice">
              <strong>알아두세요</strong>
              <div>
                <p>
                  약 종류와 약봉지 등 포장 형태에 따른 호환성은 검증이 필요해요.
                </p>
                <p>
                  스마트컵 감지는 실제 복용 여부를 확정하지 않아요. 필요할 때
                  보호자의 확인이 필요해요.
                </p>
              </div>
            </div>
          </div>
        </section>
        <BottomBanner
          title="필요한 순간, 돌봄을 더할 수 있도록."
          href="/care"
          linkText="돌봄 서비스 보기"
        />
      </main>
    </SiteLayout>
  );
}

export function CarePage() {
  return (
    <SiteLayout active="care">
      <main className="detail-page">
        <section className="detail-simple-hero detail-care-hero">
          <div className="detail-wrap detail-care-hero-inner">
            <PageIntro
              label="돌봄 서비스"
              title={
                <>
                  필요한 날에는,
                  <br />
                  <em>한 걸음 더 함께.</em>
                </>
              }
              description={
                <>가족의 돌봄을 돕는 선택형 서비스를 검토하고 있어요.</>
              }
            />
            <div className="detail-care-symbol" aria-hidden="true">
              <HeartHandshake size={80} strokeWidth={1} />
            </div>
          </div>
        </section>
        <section className="detail-section">
          <div className="detail-wrap">
            <div className="detail-section-heading">
              <div>
                <p className="detail-eyebrow">선택형 부가 서비스</p>
                <h2>
                  필요에 따라
                  <br />
                  <em>선택할 수 있도록.</em>
                </h2>
              </div>
              <p>
                아래 서비스는 제공을 검토 중이며,
                <br />
                제공 여부와 요금은 아직 정해지지 않았어요.
              </p>
            </div>
            <div className="detail-care-grid">
              <article className="detail-care-card">
                <span className="detail-icon">
                  <HeartHandshake
                    size={28}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="detail-tag">선택형 · 검토 중</span>
                <h3>병원부터 집까지 동행</h3>
                <p>
                  병원 진료부터 약국 방문, 귀가까지 함께하는 서비스를 검토하고
                  있어요.
                </p>
              </article>
              <article className="detail-care-card">
                <span className="detail-icon">
                  <Pill size={28} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="detail-tag">선택형 · 검토 중</span>
                <h3>방문 약 충전</h3>
                <p>
                  필요할 때 방문해 기기에 약을 채우는 서비스를 검토하고 있어요.
                </p>
              </article>
            </div>
            <p className="detail-note">
              부가 서비스의 제공 여부, 요금과 이용 조건은 추후 안내할
              예정입니다.
            </p>
          </div>
        </section>
        <BottomBanner
          title="MOA의 출시 소식을 가장 먼저 받아보세요."
          href="/#signup"
          linkText="무료로 출시 알림 받기"
        />
      </main>
    </SiteLayout>
  );
}

const questions = [
  {
    question: "어떤 약을 사용할 수 있나요?",
    answer:
      "약 종류와 약봉지 등 포장 형태에 따른 호환성은 검증 후 안내할 예정이에요.",
  },
  {
    question: "약은 누가 채우나요?",
    answer:
      "보호자가 직접 채워요. 방문 약 충전은 선택형 서비스로 검토 중이에요.",
  },
  {
    question: "스마트컵으로 복용을 확실히 알 수 있나요?",
    answer: "아니요. 남은 약 감지는 확인을 돕지만 실제 복용을 확정하지 않아요.",
  },
  {
    question: "출시 알림을 신청하면 결제되나요?",
    answer: "아니요. 출시 알림 신청은 무료이며, 구매나 결제로 이어지지 않아요.",
  },
];

export function PricePage() {
  return (
    <SiteLayout active="price">
      <main className="detail-page">
        <section className="detail-price-hero">
          <div className="detail-wrap detail-price-grid">
            <div>
              <PageIntro
                label="이용 안내"
                title={
                  <>
                    매일의 돌봄을
                    <br />
                    <em>가까이에서.</em>
                  </>
                }
                description={
                  <>
                    MOA의 출시를 준비하고 있어요.
                    <br />
                    먼저 무료로 소식을 받아보세요.
                  </>
                }
              />
            </div>
            <div className="detail-price-card">
              <div className="detail-price-card-head">
                <strong>MOA 스마트 복약 케어</strong>
                <span>출시 예정</span>
              </div>
              <p className="detail-price-label">예정 이용 요금</p>
              <p className="detail-price">
                <span>월</span> 49,800<span>원</span>
              </p>
              <div className="detail-price-divider" />
              <p className="detail-price-copy">
                제품과 서비스는 개발 중이며, 상세 이용 조건은 아직 정해지지
                않았어요.
              </p>
              <LaunchLink />
              <p className="detail-price-footnote">
                알림 신청은 무료이며 구매나 결제가 아닙니다.
              </p>
            </div>
          </div>
        </section>
        <section className="detail-section detail-faq-section">
          <div className="detail-wrap detail-faq-grid">
            <div>
              <p className="detail-eyebrow">자주 묻는 질문</p>
              <h2>
                궁금한 점을
                <br />
                <em>모아봤어요.</em>
              </h2>
              <p className="detail-faq-intro">
                MOA를 만나기 전, 짧게 확인해 보세요.
              </p>
            </div>
            <div className="detail-faq-list">
              {questions.map(({ question, answer }) => (
                <details key={question}>
                  <summary>
                    {question}
                    <ChevronDown size={21} aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <BottomBanner
          title="더 궁금한 이용 방법을 살펴보세요."
          href="/how"
          linkText="이용 방법 보기"
        />
      </main>
    </SiteLayout>
  );
}

function BottomBanner({
  title,
  href,
  linkText,
}: {
  title: string;
  href: string;
  linkText: string;
}) {
  return (
    <section className="detail-bottom">
      <div className="detail-wrap detail-bottom-inner">
        <div className="detail-bottom-copy">
          <Sparkles size={22} aria-hidden="true" />
          <p>{title}</p>
        </div>
        <NextLink href={href}>{linkText}</NextLink>
      </div>
    </section>
  );
}
