import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const statementRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.statement.findMany({ orderBy: { id: "desc" } });
  }),
  byFilter: publicProcedure
    .input(
      z.object({
        paymentMonth: z.string(),
        paymentYear: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.statement.findMany({
        where: {
          paymentMonth: input.paymentMonth,
          paymentYear: input.paymentYear,
        },
        orderBy: { id: "desc" },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        description: z.string(),
        amount: z.number(),
        purchaseDate: z.date(),
        cardId: z.string(),
        paymentMonth: z.string(),
        paymentYear: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cardDebt = await ctx.prisma.debt.findFirst({
        where: {
          cardId: input.cardId,
          month: input.paymentMonth,
          year: input.paymentYear,
        },
      });

      if (cardDebt) {
        await ctx.prisma.debt.update({
          where: { id: cardDebt.id },
          data: { amount: cardDebt.amount + input.amount },
        });
      } else {
        await ctx.prisma.debt.create({
          data: {
            amount: input.amount,
            month: input.paymentMonth,
            year: input.paymentYear,
            cardId: input.cardId,
          },
        });
      }

      return ctx.prisma.statement.create({ data: input });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const statement = await ctx.prisma.statement.findFirst({
      where: {
        id: input,
      },
    });

    if (statement) {
      const cardDebt = await ctx.prisma.debt.findFirst({
        where: {
          cardId: statement.cardId,
          month: statement.paymentMonth,
          year: statement.paymentYear,
        },
      });

      if (cardDebt) {
        const newAmount = cardDebt.amount - statement.amount;

        await ctx.prisma.debt.update({
          where: { id: cardDebt.id },
          data: { amount: newAmount },
        });
      }
    }

    return ctx.prisma.statement.delete({ where: { id: input } });
  }),
});
