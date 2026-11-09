import type { SignupConfig } from "./launch-signup";
export const eventNames = [
  "page_view",
  "cta_view",
  "cta_click",
  "dialog_open",
  "contact_focus",
  "contact_input_started",
  "contact_valid",
  "contact_blur",
  "consent_changed",
  "submit_attempt",
  "validation_error",
  "submit_started",
  "submit_retry",
  "submit_failed",
  "submit_success",
  "dialog_closed",
  "dialog_interrupted",
] as const;
export type EventName = (typeof eventNames)[number];
export type EventDetails = {
  flow_id?: string;
  source?: "launch_dock" | "hash" | "api";
  contact_type?: "email" | "phone" | "unknown";
  consent?: boolean;
  reason?:
    | "close_button"
    | "escape"
    | "outside"
    | "success_confirm"
    | "hidden"
    | "pagehide"
    | "contact_invalid"
    | "consent_required"
    | "save_failed"
    | "save_timeout"
    | "completed"
    | "abandoned";
  attempt?: number;
  elapsed_ms?: number;
};
export type LaunchEvent = EventDetails & {
  event_id: string;
  event_name: EventName;
  session_id: string;
  page_id: string;
  page_path: string;
  occurred_at: string;
  is_test: boolean;
};
const queueKey = "moa_launch_events_v1";
const sessionKey = "moa_launch_session_v1";
export class LaunchAnalytics {
  readonly sessionId: string;
  readonly pageId = crypto.randomUUID();
  private queue: LaunchEvent[] = [];
  private sending = false;
  private timer?: ReturnType<typeof setTimeout>;
  constructor(
    private config: SignupConfig,
    private request: typeof fetch = fetch,
    private storage?: Pick<Storage, "getItem" | "setItem">,
    private path = "/",
    private testMode = false
  ) {
    let id: string | null = null;
    try {
      id = storage?.getItem(sessionKey) ?? null;
      if (!id || !/^[0-9a-f-]{36}$/i.test(id)) id = crypto.randomUUID();
      storage?.setItem(sessionKey, id);
      const previous = JSON.parse(storage?.getItem(queueKey) || "[]");
      // Only restore the schema this module emitted; never send arbitrary cached text.
      if (Array.isArray(previous))
        this.queue = previous
          .filter(e => eventNames.includes(e.event_name) && e.session_id === id)
          .slice(-100)
          .map(e => this.sanitize(e));
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
    this.sessionId = id || crypto.randomUUID();
  }
  private sanitize(e: LaunchEvent): LaunchEvent {
    const {
      event_id,
      event_name,
      session_id,
      page_id,
      page_path,
      occurred_at,
      flow_id,
      source,
      contact_type,
      consent,
      reason,
      attempt,
      elapsed_ms,
      is_test,
    } = e;
    return {
      event_id,
      event_name,
      session_id,
      page_id,
      page_path,
      occurred_at,
      flow_id,
      source,
      contact_type,
      consent,
      reason,
      attempt,
      elapsed_ms,
      is_test,
    };
  }
  event(name: EventName, details: EventDetails = {}): LaunchEvent {
    // Select known properties explicitly. No contact value, query string, referrer or keystrokes.
    return this.sanitize({
      ...details,
      event_id: crypto.randomUUID(),
      event_name: name,
      session_id: this.sessionId,
      page_id: this.pageId,
      page_path: ["/", "/how", "/care", "/price", "/about", "/404"].includes(
        this.path
      )
        ? this.path
        : "/404",
      is_test: this.testMode,
      occurred_at: new Date().toISOString(),
    });
  }
  track(
    name: Exclude<EventName, "submit_success">,
    details: EventDetails = {}
  ) {
    this.queue.push(this.event(name, details));
    this.queue = this.queue.slice(-100);
    this.persist();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      void this.flush();
    }, 200);
  }
  private persist() {
    try {
      this.storage?.setItem(queueKey, JSON.stringify(this.queue));
    } catch {
      /* Memory queue remains available. */
    }
  }
  async flush(keepalive = false): Promise<void> {
    clearTimeout(this.timer);
    if (!this.queue.length || (this.sending && !keepalive)) return;
    const batch = this.queue.slice(0, 20);
    const ids = new Set(batch.map(e => e.event_id));
    this.sending = true;
    try {
      const response = await this.request(
        `${this.config.url.replace(/\/$/, "")}/rest/v1/rpc/record_launch_events`,
        {
          method: "POST",
          headers: {
            apikey: this.config.publishableKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ p_events: batch }),
          credentials: "omit",
          keepalive,
          signal: AbortSignal.timeout(10000),
        }
      );
      if (!response.ok || (await response.json())?.ok !== true)
        throw Error("Event storage failed");
      this.queue = this.queue.filter(e => !ids.has(e.event_id));
      this.persist();
    } catch {
      /* Analytics failure must never prevent a real signup. Retry the same event IDs. */
    } finally {
      this.sending = false;
      if (this.queue.length && !keepalive)
        this.timer = setTimeout(() => {
          void this.flush();
        }, 15000);
    }
  }
}
let collector: LaunchAnalytics | undefined;
export function launchAnalytics() {
  if (!collector) {
    let storage: Storage | undefined;
    try {
      storage = window.sessionStorage;
    } catch {
      /* optional */
    }
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const path =
      window.location.pathname.slice(base.length).replace(/\/$/, "") || "/";
    collector = new LaunchAnalytics(
      {
        url: import.meta.env.VITE_SUPABASE_URL,
        publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      fetch,
      storage,
      path,
      new URLSearchParams(window.location.search).get("qa") === "1"
    );
  }
  return collector;
}
