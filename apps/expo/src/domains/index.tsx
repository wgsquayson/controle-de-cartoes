import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import activeStack, { ActiveStackParamList } from "./active";

export type StackParamList = ActiveStackParamList;

const Stack = createNativeStackNavigator<StackParamList>();

const Routes = () => {
  const routes = [...activeStack];

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Overview"
        screenOptions={{ headerShown: false }}
      >
        {routes.map((route) => (
          <Stack.Screen key={route.name} {...route} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
