import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

type ButtonVariants = "primary" | "secondary" | "tertiary";

type ButtonProps = PressableProps & {
  text: string;
  variant?: ButtonVariants;
};

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  disabled,
  ...props
}) => {
  const buttonStyle: Record<ButtonVariants, string> = {
    primary: "flex bg-slate-300 p-4 rounded-lg",
    secondary: `flex bg-slate-${disabled ? "600" : "800"} p-4 rounded-lg`,
    tertiary: "flex",
  };

  const textStyle: Record<ButtonVariants, string> = {
    primary: "text-lg text-slate-800 font-bold self-center",
    secondary: "text-lg text-slate-200 font-bold self-center",
    tertiary: "text-lg text-slate-800 font-bold self-center",
  };

  return (
    <Pressable className={buttonStyle[variant]} {...props}>
      <Text className={textStyle[variant]}>{text}</Text>
    </Pressable>
  );
};

export default React.memo(Button);
