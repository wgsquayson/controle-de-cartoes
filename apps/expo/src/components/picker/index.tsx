import React from "react";
import { Text, View } from "react-native";
import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";

type PickerProps = PickerSelectProps & {
  label: string;
};

const Picker: React.FC<PickerProps> = ({ label, ...props }) => {
  return (
    <View>
      <Text className="text-base text-slate-800 font-medium">{label}</Text>
      <View className="h-1" />
      <View className="flex border-2 border-slate-800 p-4 rounded-lg">
        <RNPickerSelect
          placeholder={{ label: "Escolha uma opção..." }}
          {...props}
        />
      </View>
    </View>
  );
};

export default Picker;
