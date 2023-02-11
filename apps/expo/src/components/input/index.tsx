import React, { useCallback } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
} from "react-native";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";

type InputProps = TextInputProps & {
  label: string;
  defaultValue?: string;
  onPress?: () => void;
  readonly?: boolean;
};

const Input: React.FC<InputProps> = ({
  label = "",
  onFocus,
  onBlur,
  onPress,
  readonly,
  ...props
}) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      if (onFocus) {
        onFocus(args);
      }
    },
    [onFocus, shouldHandleKeyboardEvents],
  );

  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      if (onBlur) {
        onBlur(args);
      }
    },
    [onBlur, shouldHandleKeyboardEvents],
  );

  if (readonly) {
    return (
      <View>
        <Text className="text-base text-slate-800 font-medium">{label}</Text>
        <View className="h-1" />
        <Pressable onPress={onPress}>
          <View className="flex border-2 border-slate-800 p-4 rounded-lg">
            <Text>{props.value}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-base text-slate-800 font-medium">{label}</Text>
      <View className="h-1" />
      <View className="flex border-2 border-slate-800 p-4 rounded-lg">
        <TextInput
          className="grow"
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          {...props}
        />
      </View>
    </View>
  );
};

export default React.memo(Input);
