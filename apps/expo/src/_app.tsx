import React from "react";

import Routes from "./domains";
import { TRPCProvider } from "./utils/api";

export const App = () => {
  return (
    <TRPCProvider>
      <Routes />
    </TRPCProvider>
  );
};
