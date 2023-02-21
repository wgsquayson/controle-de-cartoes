import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";

type ButtonVariants = "primary" | "secondary" | "tertiary";

type ButtonProps = PressableProps & {
  text: string;
  variant?: ButtonVariants;
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  disabled,
  loading,
  ...props
}) => {
  const buttonStyle: Record<ButtonVariants, string> = {
    primary: "flex bg-slate-300 rounded-lg h-16 justify-center",
    secondary: `flex bg-slate-${
      disabled ? "600" : "800"
    } rounded-lg h-16 justify-center`,
    tertiary: "flex",
  };

  const textStyle: Record<ButtonVariants, string> = {
    primary: "text-lg text-slate-800 font-bold self-center",
    secondary: "text-lg text-slate-200 font-bold self-center",
    tertiary: "text-lg text-slate-400 font-bold self-center",
  };

  const loadingColor: Record<ButtonVariants, string> = {
    primary: "#1e293b",
    secondary: "#cbd5e1",
    tertiary: "transparent",
  };

  return (
    <Pressable className={buttonStyle[variant]} {...props}>
      {loading ? (
        <ActivityIndicator color={loadingColor[variant]} />
      ) : (
        <Text className={textStyle[variant]}>{text}</Text>
      )}
    </Pressable>
  );
};

export default React.memo(Button);
