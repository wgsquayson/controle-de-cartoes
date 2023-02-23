import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const cardRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.card.findMany({
      orderBy: { id: "desc" },
      include: { statements: true, debt: true },
    });
  }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.card.findFirst({
        where: {
          id: input.id,
        },
        orderBy: { id: "desc" },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        lastFourDigits: z.string().optional(),
        dueDay: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();

      const card = await ctx.prisma.card.create({
        data: input,
      });

      await ctx.prisma.debt.create({
        data: {
          amount: 0,
          month: (date.getMonth() + 1).toString(),
          year: date.getFullYear().toString(),
          cardId: card.id,
        },
      });

      return card;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        lastFourDigits: z.string().optional(),
        dueDay: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.card.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.card.delete({ where: { id: input } });
  }),
});
