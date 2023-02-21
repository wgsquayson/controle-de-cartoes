import React from "react";
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type InputProps = TextInputProps & {
  label: string;
  onPress?: () => void;
  readonly?: boolean;
};

const Input: React.FC<InputProps> = ({
  label = "",
  onPress,
  readonly,
  ...props
}) => {
  const paddingSize = Platform.OS === "android" ? "2" : "4";

  if (readonly) {
    return (
      <View>
        <Text className="text-base text-slate-300 font-medium">{label}</Text>
        <View className="h-1" />
        <Pressable onPress={onPress}>
          <View className="flex border-2 border-slate-300 p-4 rounded-lg">
            <Text className="text-slate-300">{props.value}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-base text-slate-300 font-medium">{label}</Text>
      <View className="h-1" />
      <View
        className={`flex border-2 border-slate-300 p-${paddingSize} rounded-lg`}
      >
        <TextInput className="grow text-slate-300" {...props} />
      </View>
    </View>
  );
};

export default React.memo(Input);
