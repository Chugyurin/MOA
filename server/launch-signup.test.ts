import { afterEach, describe, expect, it, vi } from "vitest";
import { saveLaunchSignup } from "../client/src/lib/launch-signup";

const config = {
  url: "https://test-project.supabase.co",
  publishableKey: "sb_publishable_test",
};
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("Supabase launch signup", () => {
  it("sends normalized email only to the insert-only RPC", async () => {
    const request = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    await saveLaunchSignup(" HELLO@example.com ", true, config, request);
    expect(request).toHaveBeenCalledWith(
      "https://test-project.supabase.co/rest/v1/rpc/submit_launch_contact",
      expect.objectContaining({
        method: "POST",
        credentials: "omit",
        body: JSON.stringify({ p_contact: "hello@example.com", p_consent: true }),
        headers: {
          "Content-Type": "application/json",
          apikey: "sb_publishable_test",
        },
      })
    );
  });
  it.each([
    ["bad", true],
    ["x@y.com", false],
    ["a".repeat(250) + "@x.com", true],
  ])("rejects invalid input without sending", async (email, consent) => {
    const request = vi.fn();
    await expect(
      saveLaunchSignup(email as string, consent as boolean, config, request)
    ).rejects.toThrow();
    expect(request).not.toHaveBeenCalled();
  });
  it("refuses secret keys in the browser", async () => {
    const request = vi.fn();
    await expect(
      saveLaunchSignup(
        "x@y.com",
        true,
        { ...config, publishableKey: "sb_secret_test" },
        request
      )
    ).rejects.toThrow();
    expect(request).not.toHaveBeenCalled();
  });
  it("does not mark failed saves as successful", async () => {
    const fbq = vi.fn();
    vi.stubGlobal("window", { fbq });
    const request = vi
      .fn()
      .mockResolvedValue(new Response("failure", { status: 500 }));
    await expect(
      saveLaunchSignup("x@y.com", true, config, request)
    ).rejects.toThrow();
    expect(fbq).not.toHaveBeenCalled();
  });
  it("requires an explicit success response", async () => {
    const request = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: false })));
    await expect(
      saveLaunchSignup("x@y.com", true, config, request)
    ).rejects.toThrow();
  });
  it("reports Lead only after confirmed storage, without signup data", async () => {
    const fbq = vi.fn();
    vi.stubGlobal("window", { fbq });
    let finish!: (response: Response) => void;
    const request = vi.fn(
      () =>
        new Promise<Response>(resolve => {
          finish = resolve;
        })
    );
    const saving = saveLaunchSignup(
      "private@example.com",
      true,
      config,
      request
    );
    expect(fbq).not.toHaveBeenCalled();
    finish(new Response(JSON.stringify({ ok: true })));
    await saving;
    expect(fbq.mock.calls).toEqual([
      ["trackSingle", "2343685343054855", "Lead"],
    ]);
  });
  it("keeps saved signups successful when the pixel is blocked", async () => {
    vi.stubGlobal("window", {
      fbq: () => {
        throw new Error("Blocked");
      },
    });
    const request = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    await expect(
      saveLaunchSignup("x@y.com", true, config, request)
    ).resolves.toBeUndefined();
  });
});

import { getLaunchSignupCount } from "../client/src/lib/launch-signup";
describe("public aggregate count", () => {
  it("reads only the count RPC and returns a validated total", async () => {
    const request = vi.fn().mockResolvedValue(new Response("1169"));
    await expect(getLaunchSignupCount(config, request)).resolves.toBe(1169);
    expect(request).toHaveBeenCalledWith(
      "https://test-project.supabase.co/rest/v1/rpc/get_launch_signup_count",
      expect.objectContaining({
        method: "GET",
        credentials: "omit",
        headers: { apikey: "sb_publishable_test" },
      })
    );
  });
  it.each(["null", "1167", '{"email":"x@y.com"}'])(
    "rejects invalid count replies",
    async body => {
      const request = vi.fn().mockResolvedValue(new Response(body));
      await expect(getLaunchSignupCount(config, request)).rejects.toThrow();
    }
  );
});
