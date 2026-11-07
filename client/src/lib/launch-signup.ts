export type SignupConfig = { url: string; publishableKey: string };

export async function saveLaunchSignup(
  email: string,
  consent: boolean,
  config: SignupConfig,
  request: typeof fetch = fetch,
) {
  const normalized = email.trim().toLowerCase();
  if (!consent || normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error("올바른 이메일과 수집 동의가 필요합니다.");
  }
  const url = new URL(config.url);
  if (url.protocol !== "https:" || url.pathname !== "/" || !config.publishableKey.startsWith("sb_publishable_")) {
    throw new Error("출시 알림 연결 설정을 확인해 주세요.");
  }
  const response = await request(`${url.origin}/rest/v1/rpc/submit_launch_signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: config.publishableKey },
    body: JSON.stringify({ p_email: normalized, p_consent: consent }),
    signal: AbortSignal.timeout(15000),
    credentials: "omit",
  });
  if (!response.ok) throw new Error("출시 알림 저장에 실패했습니다.");
  const result = await response.json();
  if (result?.ok !== true) throw new Error("출시 알림 저장을 확인하지 못했습니다.");
}
