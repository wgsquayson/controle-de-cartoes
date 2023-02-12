import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const statementRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.statement.findMany({ orderBy: { id: "desc" } });
  }),
  create: publicProcedure
    .input(
      z.object({
        description: z.string(),
        amount: z.number(),
        purchaseDate: z.date(),
        cardId: z.string(),
        paymentDate: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cardDebt = await ctx.prisma.debt.findFirst({
        where: {
          cardId: input.cardId,
          month: (input.paymentDate.getMonth() + 1).toString(),
          year: input.paymentDate.getFullYear().toString(),
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
            month: (input.paymentDate.getMonth() + 1).toString(),
            year: input.paymentDate.getFullYear().toString(),
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
          month: (statement.paymentDate.getMonth() + 1).toString(),
          year: statement.paymentDate.getFullYear().toString(),
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
