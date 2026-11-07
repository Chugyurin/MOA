import { useEffect, type ReactNode } from "react";
import {
  ArrowLeft,
  ChevronDown,
  HeartHandshake,
  PackageOpen,
} from "lucide-react";
import { SiteLayout } from "@/components/MoaLayout";

import { Redirect } from "wouter";
import "./detail.css";
import { sitePath } from "@/lib/site-path";
export function AboutPage() {
  return <Redirect to="/" />;
}
function Detail({
  active,
  label,
  title,
  intro,
  children,
}: {
  active: "how" | "care" | "price";
  label: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = `${label} | 스마트 복약 케어`;
  }, [label]);
  return (
    <SiteLayout active={active}>
      <main id="main" className="detail-page">
        <div className="detail-wrap">
          <a className="text-link back-link" href={sitePath("/")}>
            <ArrowLeft size={17} />
            서비스 살펴보기
          </a>
          <header className="detail-heading">
            <p className="eyebrow">{label}</p>
            <h1>{title}</h1>
            <p>{intro}</p>
          </header>
          {children}
          <div className="detail-launch">
            <div>
              <h2>출시 소식을 받아보세요.</h2>
              <p>구체적인 이용 조건은 출시 시 안내해 드려요.</p>
            </div>
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}
export function HowPage() {
  return (
    <Detail
      active="how"
      label="이용 방법"
      title="처음 사용하기 전에, 이것만 확인해 주세요."
      intro="보호자가 준비할 일과 이용 시 알아둘 점을 정리했어요."
    >
      <ol className="setup-list">
        {[
          [
            "사용할 약을 확인해요",
            "약 종류와 포장 형태별 호환성은 검증 후 안내할 예정이에요. 출시 시 지원 범위를 먼저 확인해 주세요.",
          ],
          [
            "보호자가 약을 채워요",
            "약봉지와 약은 보호자가 직접 채우는 방식이에요. 방문 약 충전은 별도의 선택형 서비스로 검토하고 있어요.",
          ],
          [
            "처방에 맞는 시간을 준비해요",
            "복용 시간과 한 번분의 약은 처방을 기준으로 확인해 주세요. 구체적인 기기 설정 방법은 출시 시 안내할 예정이에요.",
          ],
        ].map(([title, text], i) => (
          <li key={title}>
            <span className="step-index">0{i + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <aside className="info-notice">
        <strong>확인은 보호자와 함께</strong>
        <p>
          스마트컵은 컵에 남은 약을 감지해요. 실제로 약을 복용했는지 확정하는
          기능은 아니므로, 필요한 경우 부모님께 직접 확인해 주세요.
        </p>
      </aside>
    </Detail>
  );
}
export function CarePage() {
  return (
    <Detail
      active="care"
      label="추가 돌봄"
      title="도움이 더 필요한 날을 위해."
      intro="가족의 상황에 맞게 선택할 수 있는 두 가지 서비스를 검토하고 있어요."
    >
      <div className="care-options">
        <article>
          <HeartHandshake size={32} strokeWidth={1.5} />
          <span className="status-label">제공 검토 중</span>
          <h2>병원부터 집까지 동행</h2>
          <p>병원 진료, 약국 방문, 귀가까지 함께하는 동행 서비스예요.</p>
        </article>
        <article>
          <PackageOpen size={32} strokeWidth={1.5} />
          <span className="status-label">제공 검토 중</span>
          <h2>방문 약 충전</h2>
          <p>직접 방문해 기기에 약을 채우는 서비스를 검토하고 있어요.</p>
        </article>
      </div>
      <aside className="info-notice">
        <strong>아직 신청할 수 없는 서비스예요</strong>
        <p>
          제공 여부와 지역, 별도 요금, 이용 조건은 정해지지 않았어요. 확정된
          내용은 추후 안내할 예정입니다.
        </p>
      </aside>
    </Detail>
  );
}
const questions = [
  [
    "출시 알림을 신청하면 결제되나요?",
    "아니요. 이메일로 출시 소식을 받아보는 무료 신청입니다. 구매 예약이나 결제가 아니며, 결제 정보를 받지 않아요.",
  ],
  [
    "언제부터 이용할 수 있나요?",
    "현재 출시를 준비 중이며, 정확한 출시일은 아직 정해지지 않았어요. 출시 알림을 신청하면 이메일로 안내해 드릴게요.",
  ],
  [
    "월 요금에 무엇이 포함되나요?",
    "월 49,800원은 예정 이용 요금입니다. 기기와 서비스의 세부 구성, 약정, 배송, 해지 조건은 아직 확정되지 않았어요. 출시 시 최종 요금과 함께 안내합니다.",
  ],
  [
    "어떤 약을 사용할 수 있나요?",
    "약과 포장 형태에 따른 호환성은 검증 중이에요. 지원 범위와 사용 방법은 출시 시 확인할 수 있어요.",
  ],
];
export function PricePage() {
  return (
    <Detail
      active="price"
      label="요금·자주 묻는 질문"
      title="신청 전, 궁금한 점을 확인하세요."
      intro="정해진 내용과 준비 중인 내용을 투명하게 안내할게요."
    >
      <section className="pricing-panel">
        <div>
          <span className="status-label">출시 예정</span>
          <h2>스마트 복약 케어</h2>
          <p>예정 이용 요금</p>
        </div>
        <div className="price-value">
          <span>월</span> 49,800<span>원</span>
          <small>최종 요금과 상세 이용 조건은 출시 시 안내</small>
        </div>
      </section>
      <section className="faq-section" aria-labelledby="faq-title">
        <h2 id="faq-title">자주 묻는 질문</h2>
        {questions.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <ChevronDown size={20} aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </Detail>
  );
}
