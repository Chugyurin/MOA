export type ContactType = "email" | "phone";
export function parseLaunchContact(
  value: string
): { type: ContactType; value: string } | null {
  const text = value.trim();
  if (!text || text.length > 254) return null;
  if (text.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
      ? { type: "email", value: text.toLowerCase() }
      : null;
  }
  if (!/^[+\d\s().-]+$/.test(text)) return null;
  let phone = text.replace(/[\s().-]/g, "");
  if (phone.startsWith("+82")) phone = "0" + phone.slice(3).replace(/^0/, "");
  if (phone.startsWith("+"))
    return /^\+[1-9]\d{7,14}$/.test(phone)
      ? { type: "phone", value: phone }
      : null;
  if (
    !/^(?:010\d{8}|01[16789]\d{7,8}|02\d{7,8}|0[3-6][1-5]\d{7,8}|070\d{8}|050\d{8,9})$/.test(
      phone
    )
  )
    return null;
  return { type: "phone", value: "+82" + phone.slice(1) };
}
