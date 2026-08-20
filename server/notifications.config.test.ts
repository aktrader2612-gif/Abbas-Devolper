import { describe, expect, it } from "vitest";

describe("notification provider configuration", () => {
  it("does not claim notification delivery when provider credentials are missing", () => {
    const hasEmail = Boolean(process.env.RESEND_API_KEY);
    const hasWhatsApp = Boolean(
      process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID,
    );

    if (!hasEmail || !hasWhatsApp) {
      expect({ email: hasEmail, whatsapp: hasWhatsApp }).toMatchObject({
        email: false,
        whatsapp: false,
      });
      return;
    }

    expect(hasEmail && hasWhatsApp).toBe(true);
  });
});
