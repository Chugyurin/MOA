import { parseLaunchContact } from "@shared/launchContact";
import type { LaunchEvent } from "./launch-analytics";
export type SignupConfig = { url: string; publishableKey: string };

export async function saveLaunchSignup(
  contact: string,
  consent: boolean,
  config: SignupConfig,
  request: typeof fetch = fetch,
  successEvent?: LaunchEvent
) {
  const normalized = parseLaunchContact(contact);
  if (!consent || !normalized) {
    throw new Error("올바른 이메일 또는 전화번호와 수집 동의가 필요합니다.");
  }
  const url = new URL(config.url);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    !config.publishableKey.startsWith("sb_publishable_")
  ) {
    throw new Error("출시 알림 연결 설정을 확인해 주세요.");
  }
  const response = await request(
    `${url.origin}/rest/v1/rpc/submit_launch_contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.publishableKey,
      },
      body: JSON.stringify({
        p_contact: normalized.value,
        p_consent: consent,
        ...(successEvent ? { p_context: successEvent } : {}),
      }),
      signal: AbortSignal.timeout(15000),
      credentials: "omit",
    }
  );
  if (!response.ok) throw new Error("출시 알림 저장에 실패했습니다.");
  const result = await response.json();
  if (result?.ok !== true)
    throw new Error("출시 알림 저장을 확인하지 못했습니다.");

  // Report only a completed action, never the email, consent, or health details.
  // A blocked/unavailable pixel must not turn a saved signup into an error.
  if (typeof window !== "undefined") {
    try {
      const pixelWindow = window as Window & {
        fbq?: (...args: unknown[]) => void;
      };
      pixelWindow.fbq?.("trackSingle", "2343685343054855", "Lead");
    } catch {
      // The signup itself has already been saved successfully.
    }
  }
}

export async function getLaunchSignupCount(
  config: SignupConfig,
  request: typeof fetch = fetch
): Promise<number> {
  const url = new URL(config.url);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    !config.publishableKey.startsWith("sb_publishable_")
  ) {
    throw new Error("출시 알림 연결 설정을 확인해 주세요.");
  }
  const response = await request(
    `${url.origin}/rest/v1/rpc/get_launch_signup_count`,
    {
      method: "GET",
      headers: { apikey: config.publishableKey },
      signal: AbortSignal.timeout(10000),
      credentials: "omit",
    }
  );
  if (!response.ok) throw new Error("신청자 수를 불러오지 못했습니다.");
  const count = await response.json();
  if (!Number.isSafeInteger(count) || count < 1168)
    throw new Error("신청자 수 응답이 올바르지 않습니다.");
  return count;
}
