import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Check, Mail, X } from "lucide-react";
import { saveLaunchSignup, getLaunchSignupCount } from "@/lib/launch-signup";
import {
  INITIAL_LAUNCH_SUBSCRIBERS,
  remainingOfferSeconds,
  formatOfferCountdown,
} from "@shared/launchOffer";
const LaunchContext = createContext<() => void>(() => {});
const OfferCountdownContext = createContext(0);
function LaunchOfferContent() {
  const seconds = useContext(OfferCountdownContext);
  return (
    <span className="offer-title">
      {seconds > 0 ? (
        <>
          지금 알림 신청하면 <span className="offer-amount">20,000원</span>{" "}
          <span className="offer-amount">할인</span>
        </>
      ) : (
        "출시 알림 신청하기"
      )}
    </span>
  );
}
export function LaunchCountdown() {
  const seconds = useContext(OfferCountdownContext);
  return (
    <p className="offer-countdown" role="timer" aria-live="off">
      {seconds > 0 ? (
        <>
          <span>마감까지</span>
          <strong>{formatOfferCountdown(seconds)}</strong>
        </>
      ) : (
        <span>할인 혜택이 종료되었어요</span>
      )}
    </p>
  );
}
export function LaunchButton() {
  const open = useContext(LaunchContext);
  return (
    <button
      type="button"
      className="button primary offer-button"
      aria-haspopup="dialog"
      onClick={open}
    >
      <LaunchOfferContent />
      <ArrowRight size={18} aria-hidden="true" />
    </button>
  );
}
export function LaunchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(() =>
    remainingOfferSeconds(Date.now())
  );
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const refresh = () => {
      const seconds = remainingOfferSeconds(Date.now());
      setRemaining(seconds);
      if (seconds === 0 && interval !== undefined) clearInterval(interval);
    };
    refresh();
    if (remainingOfferSeconds(Date.now()) > 0)
      interval = setInterval(refresh, 1000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const trigger = useRef<HTMLElement | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(
    INITIAL_LAUNCH_SUBSCRIBERS
  );
  const [isPending, setIsPending] = useState(false);
  const pending = useRef(false);
  const signupConfig = {
    url: import.meta.env.VITE_SUPABASE_URL ?? "",
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
  };
  useEffect(() => {
    if (!open || submitted) return;
    let active = true;
    const refresh = () => {
      void getLaunchSignupCount(signupConfig)
        .then(count => {
          if (active) setSubscriberCount(count);
        })
        .catch(() => {
          /* Keep the supplied baseline if count retrieval fails. */
        });
    };
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [open, submitted]);
  const show = () => {
    trigger.current = document.activeElement as HTMLElement;
    setSubmitted(false);
    setEmail("");
    setConsent(false);
    setError("");
    setOpen(true);
  };
  useEffect(() => {
    const checkHash = () => {
      if (location.hash === "#signup") {
        setSubmitted(false);
        setEmail("");
        setConsent(false);
        setError("");
        setOpen(true);
        history.replaceState(null, "", location.pathname + location.search);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    setError("");
    if (!consent) {
      setError("이메일 수집·이용에 동의해 주세요.");
      return;
    }
    pending.current = true;
    setIsPending(true);
    try {
      await saveLaunchSignup(email, consent, signupConfig);
      setSubmitted(true);
    } catch {
      setError("신청을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      pending.current = false;
      setIsPending(false);
    }
  }
  return (
    <OfferCountdownContext.Provider value={remaining}>
      <LaunchContext.Provider value={show}>
        {children}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="modal-overlay" />
            <Dialog.Content
              className="launch-modal"
              onOpenAutoFocus={event => {
                const input = document.getElementById("launch-email");
                if (input) {
                  event.preventDefault();
                  input.focus();
                }
              }}
              onCloseAutoFocus={event => {
                event.preventDefault();
                trigger.current?.focus();
              }}
            >
              <Dialog.Close className="close-button" aria-label="팝업 닫기">
                <X size={22} />
              </Dialog.Close>
              <span
                className={`modal-icon ${submitted ? "success" : ""}`}
                aria-hidden="true"
              >
                {submitted ? <Check /> : <Mail />}
              </span>
              <Dialog.Title>
                {submitted
                  ? "출시 소식을 전해드릴게요."
                  : `이미 ${subscriberCount}명의 보호자가 알림을 신청했어요.`}
              </Dialog.Title>
              <Dialog.Description>
                {submitted
                  ? "출시 알림 신청이 완료되었어요. 입력하신 이메일로 안내해 드릴게요."
                  : "이메일을 남겨주시면 출시 소식을 알려드려요. 신청은 무료이며, 결제되지 않아요."}
              </Dialog.Description>
              {submitted ? (
                <Dialog.Close className="button primary full">
                  확인했어요
                </Dialog.Close>
              ) : (
                <form onSubmit={submit}>
                  <label className="field-label" htmlFor="launch-email">
                    이메일 주소
                  </label>
                  <input
                    id="launch-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@example.com"
                    maxLength={254}
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    aria-describedby={
                      error ? "signup-error signup-policy" : "signup-policy"
                    }
                  />
                  <label className="consent">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={e => setConsent(e.target.checked)}
                      required
                    />
                    <span>[필수] 출시 안내를 위한 이메일 수집·이용 동의</span>
                  </label>
                  <p id="signup-policy" className="fine-print">
                    수집 항목: 이메일 · 이용 목적: 출시 안내
                    <br />
                    보관 기간: 출시 안내 종료 시까지. 동의를 거부할 수 있으며,
                    거부 시 알림 신청이 제한됩니다.
                  </p>
                  {error && (
                    <p id="signup-error" className="form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="modal-offer-panel">
                    <LaunchCountdown />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="button primary full offer-button"
                    >
                      {isPending ? "신청하고 있어요…" : <LaunchOfferContent />}
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </form>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </LaunchContext.Provider>
    </OfferCountdownContext.Provider>
  );
}
