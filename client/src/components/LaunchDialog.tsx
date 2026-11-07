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
import { trpc } from "@/lib/trpc";
const LaunchContext = createContext<() => void>(() => {});
export function LaunchButton({ compact = false }: { compact?: boolean }) {
  const open = useContext(LaunchContext);
  return (
    <button
      type="button"
      className={`button primary ${compact ? "compact" : ""}`}
      onClick={open}
    >
      {compact ? "출시 알림 받기" : "무료로 출시 알림 받기"}
      <ArrowRight size={18} aria-hidden="true" />
    </button>
  );
}
export function LaunchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const trigger = useRef<HTMLElement | null>(null);
  const signup = trpc.launch.signup.useMutation();
  const show = () => {
    trigger.current = document.activeElement as HTMLElement;
    setOpen(true);
  };
  useEffect(() => {
    const checkHash = () => {
      if (location.hash === "#signup") {
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
    if (signup.isPending) return;
    setError("");
    if (!consent) {
      setError("이메일 수집·이용에 동의해 주세요.");
      return;
    }
    try {
      await signup.mutateAsync({ email: email.trim(), consent });
      setSubmitted(true);
    } catch {
      setError("신청을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  }
  return (
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
              {submitted ? (
                "출시 소식을 전해드릴게요."
              ) : (
                <>
                  새로운 돌봄의 시작,
                  <br />
                  가장 먼저 만나보세요.
                </>
              )}
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
                <button
                  type="submit"
                  disabled={signup.isPending}
                  className="button primary full"
                >
                  {signup.isPending
                    ? "신청하고 있어요…"
                    : "무료로 출시 알림 받기"}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </LaunchContext.Provider>
  );
}
