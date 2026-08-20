type ContactNotificationInput = {
  name: string;
  email: string;
  message: string;
};

type DeliveryResult = {
  email: boolean;
  whatsapp: boolean;
};

const recipientEmail = "abbasbaloch2612@gmail.com";
const recipientWhatsApp = "923290990550";

async function sendEmail(input: ContactNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PORTFOLIO_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [recipientEmail],
      reply_to: input.email,
      subject: `New portfolio inquiry from ${input.name}`,
      text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
    }),
  });

  return response.ok;
}

async function sendWhatsApp(input: ContactNotificationInput) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "portfolio_contact_alert";
  if (!token || !phoneNumberId) return false;

  const response = await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipientWhatsApp,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: input.name },
              { type: "text", text: input.email },
              { type: "text", text: input.message.slice(0, 800) },
            ],
          },
        ],
      },
    }),
  });

  return response.ok;
}

export async function notifyContactSubmission(input: ContactNotificationInput): Promise<DeliveryResult> {
  const [email, whatsapp] = await Promise.allSettled([sendEmail(input), sendWhatsApp(input)]);
  return {
    email: email.status === "fulfilled" && email.value,
    whatsapp: whatsapp.status === "fulfilled" && whatsapp.value,
  };
}
