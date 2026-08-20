import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { z } from "zod";
import { createContactMessage, updateContactMessageStatus } from "./db";
import { notifyContactSubmission } from "./notifications";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";

const contactAttempts = new Map<string, number[]>();
const CONTACT_RATE_LIMIT = 5;
const CONTACT_RATE_WINDOW_MS = 10 * 60 * 1000;

function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket: { remoteAddress?: string } }) {
  const forwarded = req.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return (firstForwarded || req.socket.remoteAddress || "unknown").trim();
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(160),
          email: z.string().trim().email().max(320),
          message: z.string().trim().min(10).max(4000),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const now = Date.now();
        const ip = getClientIp(ctx.req);
        const recentAttempts = (contactAttempts.get(ip) || []).filter((timestamp) => now - timestamp < CONTACT_RATE_WINDOW_MS);
        if (recentAttempts.length >= CONTACT_RATE_LIMIT) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait a few minutes before sending another message." });
        }
        recentAttempts.push(now);
        contactAttempts.set(ip, recentAttempts);

        const id = await createContactMessage({
          name: input.name,
          email: input.email,
          message: input.message,
          notificationStatus: "pending",
        });
        const delivery = await notifyContactSubmission(input);
        const status = delivery.email && delivery.whatsapp ? "sent" : delivery.email || delivery.whatsapp ? "partial" : "failed";
        await updateContactMessageStatus(id, status);
        return { success: true, notificationStatus: status } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
