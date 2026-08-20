import { describe, expect, it } from "vitest";
import { notifyContactSubmission } from "./notifications";

describe("notification delivery", () => {
  it("fails safely without provider credentials", async () => {
    const original = {
      resend: process.env.RESEND_API_KEY,
      from: process.env.PORTFOLIO_FROM_EMAIL,
      whatsappToken: process.env.WHATSAPP_ACCESS_TOKEN,
      whatsappPhoneId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    };

    delete process.env.RESEND_API_KEY;
    delete process.env.PORTFOLIO_FROM_EMAIL;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;

    await expect(
      notifyContactSubmission({
        name: "Test visitor",
        email: "visitor@example.com",
        message: "A valid contact message for the safe-failure test.",
      }),
    ).resolves.toEqual({ email: false, whatsapp: false });

    if (original.resend === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = original.resend;
    if (original.from === undefined) delete process.env.PORTFOLIO_FROM_EMAIL;
    else process.env.PORTFOLIO_FROM_EMAIL = original.from;
    if (original.whatsappToken === undefined) delete process.env.WHATSAPP_ACCESS_TOKEN;
    else process.env.WHATSAPP_ACCESS_TOKEN = original.whatsappToken;
    if (original.whatsappPhoneId === undefined) delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    else process.env.WHATSAPP_PHONE_NUMBER_ID = original.whatsappPhoneId;
  });
});

