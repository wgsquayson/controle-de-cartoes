import React from "react";
import { Platform, Text, View } from "react-native";
import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";

type PickerVariants = "primary" | "secondary";

type PickerProps = PickerSelectProps & {
  label: string;
  variant?: PickerVariants;
  width?: string;
};

const Picker: React.FC<PickerProps> = ({
  label,
  variant = "primary",
  width,
  ...props
}) => {
  const paddingSize = Platform.OS === "android" ? "1" : "4";

  const containerStyle: Record<PickerVariants, string> = {
    primary: `flex border-2 border-slate-300 p-${paddingSize} rounded-lg ${
      width ?? ""
    }`,
    secondary: `flex border-2 border-slate-800 p-${paddingSize} rounded-lg ${
      width ?? ""
    }`,
  };

  const textStyle: Record<PickerVariants, string> = {
    primary: "text-base text-slate-300 font-medium",
    secondary: "text-base text-slate-800 font-medium",
  };

  return (
    <View>
      <Text className={textStyle[variant]}>{label}</Text>
      <View className="h-1" />
      <View className={containerStyle[variant]}>
        <RNPickerSelect
          placeholder={{ label: "Escolha uma opção..." }}
          style={{
            inputIOS: {
              color: variant === "primary" ? "#FFF" : "#000",
            },
            inputAndroid: {
              color: variant === "primary" ? "#FFF" : "#000",
            },
            placeholder: {
              color: variant === "primary" ? "#FFF" : "#000",
            },
          }}
          {...props}
        />
      </View>
    </View>
  );
};

export default Picker;
