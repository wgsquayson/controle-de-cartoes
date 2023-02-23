import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const debtRouter = createTRPCRouter({
  totalDebtByDate: publicProcedure
    .input(
      z.object({
        month: z.string(),
        year: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cards = await ctx.prisma.card.findMany({
        include: { debt: true },
      });

      const debtByCard = cards.map((card) => {
        return card.debt.reduce((prev, curr) => {
          return (
            prev +
            (curr.month === String(input.month) &&
            curr.year === String(input.year)
              ? curr.amount
              : 0)
          );
        }, 0);
      });

      return debtByCard?.reduce((prev, curr) => prev + curr, 0);
    }),
});
