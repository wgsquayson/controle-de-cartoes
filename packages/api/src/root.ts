import { authRouter } from "./router/auth";
import { cardRouter } from "./router/card";
import { statementRouter } from "./router/statement";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  statement: statementRouter,
  card: cardRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
