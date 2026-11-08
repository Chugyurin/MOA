import { describe, expect, it } from "vitest";
import {
  LAUNCH_OFFER_DEADLINE,
  remainingOfferSeconds,
  formatOfferCountdown,
} from "../shared/launchOffer";
describe("launch offer deadline", () => {
  it("uses 2026-11-09 18:00 Korea time regardless of visitor timezone", () => {
    expect(new Date(LAUNCH_OFFER_DEADLINE).toISOString()).toBe(
      "2026-11-09T09:00:00.000Z"
    );
    expect(remainingOfferSeconds(Date.parse("2026-11-09T17:59:59+09:00"))).toBe(
      1
    );
  });
  it("expires exactly at the deadline and never becomes negative", () => {
    expect(remainingOfferSeconds(LAUNCH_OFFER_DEADLINE)).toBe(0);
    expect(remainingOfferSeconds(LAUNCH_OFFER_DEADLINE + 1000)).toBe(0);
  });
  it("formats remaining total hours and calculates from the current time", () => {
    expect(formatOfferCountdown(90061)).toBe("25:01:01");
    expect(
      formatOfferCountdown(remainingOfferSeconds(LAUNCH_OFFER_DEADLINE - 1001))
    ).toBe("00:00:02");
    expect(
      formatOfferCountdown(remainingOfferSeconds(LAUNCH_OFFER_DEADLINE + 1))
    ).toBe("00:00:00");
  });
});
