import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { StackParamList } from "../..";
import { Button, Input } from "../../../components";
import { api } from "../../../utils";

export type CardInputValues = {
  name: string;
  lastFourDigits?: string;
  dueDay?: string;
};

const CardForm: React.FC = () => {
  const navigation =
    useNavigation<NavigationProp<StackParamList, "CardForm">>();

  const { control, handleSubmit } = useForm<CardInputValues>();

  const { mutate: createCard, isLoading } = api.card.create.useMutation({
    onSuccess() {
      return navigation.goBack();
    },
  });

  const onSubmit: SubmitHandler<CardInputValues> = (data) => {
    createCard(data);
  };

  return (
    <SafeAreaView className="grow bg-slate-800 p-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <Text className="text-2xl text-slate-200 font-bold">
            Adicionar cartão
          </Text>
          <View className="h-4" />
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                label="Nome do cartão"
                value={value}
                onChangeText={onChange}
              />
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
            loading={isLoading}
            text="Adicionar cartão"
            onPress={handleSubmit(onSubmit)}
          />
          <View className="h-6" />
          <Button
            text="Voltar"
            variant="tertiary"
            onPress={navigation.goBack}
          />
          <View className="h-6" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CardForm;
