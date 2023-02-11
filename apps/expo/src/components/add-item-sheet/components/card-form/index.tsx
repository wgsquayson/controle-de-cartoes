import React from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { api } from "../../../../utils/api";
import Button from "../../../button";
import Input from "../../../input";

export type CardInputValues = {
  name: string;
  lastFourDigits?: string;
  dueDay?: string;
};

type CardFormProps = {
  onGoBack: () => void;
  onFinish: () => void;
  onClose?: () => void;
};

const CardForm: React.FC<CardFormProps> = ({ onGoBack, onClose, onFinish }) => {
  const { control, handleSubmit } = useForm<CardInputValues>();

  const { mutate: createCard } = api.card.create.useMutation({
    onSuccess() {
      onFinish();
      onClose?.();
    },
  });

  const onSubmit: SubmitHandler<CardInputValues> = (data) => {
    createCard(data);
  };

  return (
    <Animated.View key="2" className="p-4" entering={FadeIn} exiting={FadeOut}>
      <Controller
        name="name"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Input label="Nome do cartão" value={value} onChangeText={onChange} />
        )}
      />
      <View className="h-4" />
      <Controller
        name="lastFourDigits"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Input
            keyboardType="number-pad"
            maxLength={4}
            returnKeyType="done"
            label="Quatro últimos dígitos"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <View className="h-4" />
      <Controller
        name="dueDay"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Input
            keyboardType="number-pad"
            maxLength={2}
            returnKeyType="done"
            label="Dia de vencimento"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <View className="h-6" />
      <Button
        text="Adicionar cartão"
        variant="secondary"
        onPress={handleSubmit(onSubmit)}
      />
      <View className="h-6" />
      <Button text="Voltar" variant="tertiary" onPress={onGoBack} />
      <View className="h-6" />
    </Animated.View>
  );
};

export default React.memo(CardForm);
