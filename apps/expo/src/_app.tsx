import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import Home from "./screens/home";
import { TRPCProvider } from "./utils/api";

export const App = () => {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <Home />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </TRPCProvider>
  );
};
