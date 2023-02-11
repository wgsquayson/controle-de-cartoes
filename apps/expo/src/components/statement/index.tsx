import React from "react";
import { Pressable, PressableProps, Text, View } from "react-native";

type StatementProps = PressableProps & {
  title: string;
  amount: string;
  detail: string;
};

const Statement: React.FC<StatementProps> = ({
  title,
  amount,
  detail,
  ...props
}) => {
  return (
    <Pressable {...props}>
      <View className="flex bg-slate-600 p-4 rounded-lg">
        <View className="flex-row align-center justify-between">
          <Text className="text-lg text-slate-200 font-bold">{title}</Text>
          <Text className="text-base text-red-400 font-bold">{amount}</Text>
        </View>
        <Text className="text-sm text-slate-300">{detail}</Text>
      </View>
    </Pressable>
  );
};

export default React.memo(Statement);
