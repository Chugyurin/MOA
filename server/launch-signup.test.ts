import { afterEach, describe, expect, it, vi } from "vitest";
import { saveLaunchSignup } from "../client/src/lib/launch-signup";

const config = { url: "https://test-project.supabase.co", publishableKey: "sb_publishable_test" };
afterEach(() => vi.restoreAllMocks());
describe("Supabase launch signup", () => {
  it("sends normalized email only to the insert-only RPC", async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    await saveLaunchSignup(" HELLO@example.com ", true, config, request);
    expect(request).toHaveBeenCalledWith("https://test-project.supabase.co/rest/v1/rpc/submit_launch_signup", expect.objectContaining({
      method: "POST", credentials: "omit", body: JSON.stringify({ p_email: "hello@example.com", p_consent: true }),
      headers: { "Content-Type": "application/json", apikey: "sb_publishable_test" },
    }));
  });
  it.each([["bad", true], ["x@y.com", false], ["a".repeat(250) + "@x.com", true]])("rejects invalid input without sending", async (email, consent) => {
    const request = vi.fn();
    await expect(saveLaunchSignup(email as string, consent as boolean, config, request)).rejects.toThrow();
    expect(request).not.toHaveBeenCalled();
  });
  it("refuses secret keys in the browser", async () => {
    const request = vi.fn();
    await expect(saveLaunchSignup("x@y.com", true, { ...config, publishableKey: "sb_secret_test" }, request)).rejects.toThrow();
    expect(request).not.toHaveBeenCalled();
  });
  it("does not mark failed saves as successful", async () => {
    const request = vi.fn().mockResolvedValue(new Response("failure", { status: 500 }));
    await expect(saveLaunchSignup("x@y.com", true, config, request)).rejects.toThrow();
  });
  it("requires an explicit success response", async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false })));
    await expect(saveLaunchSignup("x@y.com", true, config, request)).rejects.toThrow();
  });
});
