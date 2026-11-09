import { afterEach, describe, expect, it, vi } from "vitest";
import { parseLaunchContact } from "../shared/launchContact";
import { LaunchAnalytics } from "../client/src/lib/launch-analytics";
import { saveLaunchSignup } from "../client/src/lib/launch-signup";
const config = {
  url: "https://test.supabase.co",
  publishableKey: "sb_publishable_test",
};
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
describe("contact normalization", () => {
  it.each([
    [" HELLO@example.com ", "email", "hello@example.com"],
    ["010-1234-5678", "phone", "+821012345678"],
    ["+82 (0)10-1234-5678", "phone", "+821012345678"],
    ["02-123-4567", "phone", "+8221234567"],
    ["+1 202-555-0123", "phone", "+12025550123"],
  ])("normalizes %s", (input, type, value) =>
    expect(parseLaunchContact(input)).toEqual({ type, value })
  );
  it.each([
    "",
    "1234",
    "010-123",
    "hello@",
    "x @y.com",
    "01012345678<script>",
    "010123456789",
    "+0123456789",
  ])("rejects %s", value => expect(parseLaunchContact(value)).toBeNull());
  it("saves phone and authoritative event together", async () => {
    const event = new LaunchAnalytics(config).event("submit_success", {
      flow_id: crypto.randomUUID(),
      source: "launch_dock",
    });
    const request = vi.fn().mockResolvedValue(new Response('{"ok":true}'));
    await saveLaunchSignup("010-1234-5678", true, config, request, event);
    const body = JSON.parse(request.mock.calls[0][1].body);
    expect(body.p_contact).toBe("+821012345678");
    expect(body.p_context.event_id).toBe(event.event_id);
  });
});
describe("event transport", () => {
  it("calls browser fetch without the collector as its receiver", async () => {
    vi.useFakeTimers();
    let receiver: unknown = "not-called";
    const send = function(this: unknown) {
      receiver = this;
      return Promise.resolve(new Response('{"ok":true}'));
    } as typeof fetch;
    const analytics = new LaunchAnalytics(config, send);
    analytics.track("cta_click");
    await analytics.flush();
    expect(receiver).toBeUndefined();
  });

  it("never includes arbitrary contact or query data", async () => {
    vi.useFakeTimers();
    const request = vi.fn().mockResolvedValue(new Response('{"ok":true}'));
    const analytics = new LaunchAnalytics(
      config,
      request,
      undefined,
      "/?email=private@example.com"
    );
    analytics.track("contact_input_started", {
      flow_id: crypto.randomUUID(),
      email: "private@example.com",
      phone: "01012345678",
    } as never);
    await analytics.flush();
    const body = request.mock.calls[0][1].body;
    expect(body).not.toContain("private@example.com");
    expect(body).not.toContain("01012345678");
    expect(JSON.parse(body).p_events[0].page_path).toBe("/404");
  });
  it("retries the same event ID after failure and clears after success", async () => {
    vi.useFakeTimers();
    const data = new Map<string, string>();
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
    };
    const request = vi
      .fn()
      .mockRejectedValueOnce(Error("offline"))
      .mockResolvedValue(new Response('{"ok":true}'));
    const analytics = new LaunchAnalytics(config, request, storage);
    analytics.track("cta_click");
    await analytics.flush();
    expect(JSON.parse(data.get("moa_launch_events_v1")!)).toHaveLength(1);
    await analytics.flush(true);
    expect(JSON.parse(request.mock.calls[0][1].body).p_events[0].event_id).toBe(
      JSON.parse(request.mock.calls[1][1].body).p_events[0].event_id
    );
    expect(data.get("moa_launch_events_v1")).toBe("[]");
    expect(request.mock.calls[1][1].keepalive).toBe(true);
  });
  it("shares tab session IDs but gives every page a new ID", () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
    };
    const a = new LaunchAnalytics(config, fetch, storage);
    const b = new LaunchAnalytics(config, fetch, storage);
    expect(a.sessionId).toBe(b.sessionId);
    expect(a.pageId).not.toBe(b.pageId);
  });
  it("marks QA events explicitly", () => {
    expect(
      new LaunchAnalytics(config, fetch, undefined, "/", true).event(
        "cta_click"
      ).is_test
    ).toBe(true);
  });
});
