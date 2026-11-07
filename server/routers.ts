import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { launchSignups } from "../drizzle/schema";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";

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

  launch: router({
    signup: publicProcedure
      .input(
        z.object({
          email: z
            .string()
            .trim()
            .max(254, "이메일은 254자 이하여야 합니다.")
            .email("올바른 이메일 주소를 입력해 주세요.")
            .transform(email => email.toLowerCase()),
          consent: z.boolean().refine(value => value, {
            message: "개인정보 수집 및 이용에 동의해 주세요.",
          }),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
          });
        }

        try {
          await db
            .insert(launchSignups)
            .values({ email: input.email, consent: input.consent })
            // Keep the original consent and signup time on a duplicate request.
            .onDuplicateKeyUpdate({ set: { email: sql`${launchSignups.email}` } });
        } catch {
          // Database errors can contain the submitted email; do not expose or log them.
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
          });
        }

        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
