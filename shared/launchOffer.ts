// Explicit offset keeps the deadline identical in every visitor's time zone.
export const LAUNCH_OFFER_DEADLINE = Date.parse("2026-11-09T18:00:00+09:00");
export function remainingOfferSeconds(now: number) {
  return Math.max(0, Math.ceil((LAUNCH_OFFER_DEADLINE - now) / 1000));
}
export function formatOfferCountdown(seconds: number) {
  const value = Math.max(0, Math.floor(seconds));
  return [Math.floor(value / 3600), Math.floor((value % 3600) / 60), value % 60]
    .map(part => String(part).padStart(2, "0"))
    .join(":");
}

// Initial subscriber count supplied for this launch campaign.
export const INITIAL_LAUNCH_SUBSCRIBERS = 1168;
