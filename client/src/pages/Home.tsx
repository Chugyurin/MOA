import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, BellRing, CheckCircle2, Mail } from "lucide-react";
import { SiteLayout } from "@/components/MoaLayout";
import { trpc } from "@/lib/trpc";

const productImage = "/manus-storage/pasted_file_Fx42Ad_image_0050fba3.png";
const pillsImage =
  "/manus-storage/async-images/mmG3zYWXmo2YKdYfFIhoA8/image-1.webp";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const signup = trpc.launch.signup.useMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!consent) {
      setError("출시 안내를 위한 개인정보 수집·이용에 동의해 주세요.");
      return;
    }
    try {
      await signup.mutateAsync({ email: email.trim(), consent });
      setSubmitted(true);
    } catch {
      setError("신청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  if (submitted) {
    return (
      <div className="success-box" role="status">
        <CheckCircle2 size={28} />
        <div>
          <strong>출시 알림 신청이 접수되었어요.</strong>
          <p>MOA의 새로운 소식을 기다려 주세요.</p>
        </div>
      </div>
    );
  }
  return (
    <form className="signup-form" onSubmit={submit}>
      <label className="input-label" htmlFor="email">
        이메일 주소
      </label>
      <div className="input-row">
        <div className="email-wrap">
          <Mail size={20} aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="이메일 주소를 입력해 주세요"
            maxLength={254}
            required
          />
        </div>
        <button
          className="button button-dark submit-button"
          type="submit"
          disabled={signup.isPending}
        >
          {signup.isPending ? "신청 중..." : "무료로 출시 알림 받기"}
          <ArrowRight size={19} />
        </button>
      </div>
      <label className="consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={event => setConsent(event.target.checked)}
          required
        />
        <span>
          <b>[필수]</b> 출시 안내를 위한 이메일 주소 수집·이용에 동의합니다.
        </span>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <p className="form-note">
        이메일은 출시 안내 종료 시까지 보관합니다. 동의를 거부할 수 있으며, 거부
        시 알림 신청이 제한됩니다.
      </p>
    </form>
  );
}

export default function Home() {
  useEffect(() => {
    if (window.location.hash === "#signup") {
      requestAnimationFrame(() =>
        document.getElementById("signup")?.scrollIntoView()
      );
    }
  }, []);
  return (
    <SiteLayout>
      <main className="reference-home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">부모님을 위한 스마트 복약 케어</p>
              <h1 id="hero-title">
                부모님 약,
                <br />
                <em>챙기기 힘드시죠?</em>
              </h1>
              <p className="hero-description">이제 쉽게 관리하세요.</p>
              <div className="hero-price">
                <strong>월 49,800원</strong>
                <span>출시 예정</span>
              </div>
              <div className="hero-actions">
                <a className="button button-dark" href="#signup">
                  무료로 출시 알림 받기 <ArrowRight size={19} />
                </a>
              </div>
              <p className="hero-note">신청은 무료이며 결제되지 않아요.</p>
            </div>
            <div className="hero-visual">
              <div className="product-image-wrap">
                <img
                  src={productImage}
                  alt="약을 컵에 준비하는 MOA 스마트 복약 기기 디자인 시안"
                />
              </div>
              <div className="image-caption">
                <span>MOA SMART MEDICATION CARE</span>
                <span>제품 디자인 시안</span>
              </div>
            </div>
          </div>
        </section>

        <section className="highlights" aria-label="MOA 핵심 기능">
          <div className="wrap">
            <div className="highlight-grid">
              <article className="highlight-card pills-card">
                <div className="highlight-copy">
                  <p>약 종류가 많아도,</p>
                  <h2>
                    먹어야 할 만큼,
                    <br />
                    <span>한 컵에.</span>
                  </h2>
                  <div className="highlight-description">
                    자동으로 한 번분을 조합해요.
                  </div>
                </div>
                <div className="highlight-image">
                  <img
                    src={pillsImage}
                    alt="여러 약봉지의 약을 한 컵에 모으는 모습"
                  />
                </div>
              </article>
              <article className="highlight-card reminder-card">
                <div className="highlight-copy">
                  <h2>
                    컵에 약이 남아 있으면,
                    <br />
                    <span>계속 알려드려요.</span>
                  </h2>
                  <div className="highlight-description">
                    깜빡해도 다시 알림.
                  </div>
                </div>
                <div className="highlight-image reminder-image">
                  <img
                    src={productImage}
                    alt="MOA 기기의 스마트컵 디자인 시안"
                  />
                  <span className="reminder-badge" aria-hidden="true">
                    <BellRing size={23} />
                  </span>
                </div>
              </article>
            </div>
            <p className="features-note">
              출시 준비 중인 기능입니다. 스마트컵 감지는 복용 확인을 돕지만 실제
              복용 여부를 확정하지는 않습니다.
            </p>
          </div>
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <div className="wrap closing-grid">
            <div className="closing-copy">
              <p className="section-label">매일의 복약을 더 간편하게</p>
              <h2 id="closing-title">
                처방받은 약봉지,
                <br />
                <span>
                  그대로 넣으면
                  <br />
                  자동으로 잘라 담아요.
                </span>
              </h2>
              <p className="closing-price">월 49,800원</p>
              <a className="button button-dark" href="#signup">
                무료로 출시 알림 받기 <ArrowRight size={19} />
              </a>
            </div>
            <div className="closing-image">
              <img
                src={productImage}
                alt="약이 담긴 MOA 스마트컵 디자인 시안"
              />
            </div>
          </div>
        </section>

        <section
          id="signup"
          className="signup-section"
          aria-labelledby="signup-title"
        >
          <div className="wrap signup-grid">
            <div className="signup-intro">
              <p className="section-label">MOA를 가장 먼저 만나보세요</p>
              <h2 id="signup-title">
                무료로 출시 소식을
                <br />
                <span>받아보세요.</span>
              </h2>
              <p>신청해도 구매나 결제는 이루어지지 않아요.</p>
            </div>
            <div className="signup-box">
              <div className="signup-box-head">
                <div>
                  <strong>무료 출시 알림 신청</strong>
                  <span>이메일로 출시 소식을 알려드릴게요.</span>
                </div>
                <span className="signup-price">
                  월 <b>49,800</b>원
                </span>
              </div>
              <SignupForm />
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
