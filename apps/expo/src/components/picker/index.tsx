import React from "react";
import { Platform, Text, View } from "react-native";
import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";

type PickerProps = PickerSelectProps & {
  label: string;
};

const Picker: React.FC<PickerProps> = ({ label, ...props }) => {
  const paddingSize = Platform.OS === "android" ? "1" : "4";

  return (
    <View>
      <Text className="text-base text-slate-800 font-medium">{label}</Text>
      <View className="h-1" />
      <View
        className={`flex border-2 border-slate-800 p-${paddingSize} rounded-lg`}
      >
        <RNPickerSelect
          placeholder={{ label: "Escolha uma opção..." }}
          {...props}
        />
      </View>
    </View>
  );
};

export default Picker;
