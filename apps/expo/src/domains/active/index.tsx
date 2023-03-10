import { RouteConfig, StackNavigationState } from "@react-navigation/native";
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

import CardForm from "./card-form";
import Overview from "./overview";
import StatementForm from "./statement-form";

export type ActiveStackParamList = {
  Overview: undefined;
  CardForm: {
    cardId?: string;
  };
  StatementForm: {
    statementId?: string;
  };
};

type ActiveStackRoutesType = RouteConfig<
  ActiveStackParamList,
  keyof ActiveStackParamList,
  StackNavigationState<ActiveStackParamList>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap
>;

const ActiveStack: ActiveStackRoutesType[] = [
  {
    name: "Overview",
    component: Overview,
  },
  {
    name: "CardForm",
    component: CardForm,
    initialParams: {},
  },
  {
    name: "StatementForm",
    component: StatementForm,
    initialParams: {},
  },
];

export default ActiveStack;
