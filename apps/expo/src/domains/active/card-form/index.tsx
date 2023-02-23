import React, { useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
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

  const route = useRoute<RouteProp<StackParamList, "CardForm">>();

  const card = api.card.byId.useQuery({
    id: route.params.cardId ?? "",
  });

  const { control, handleSubmit } = useForm<CardInputValues>();

  const { mutate: createCard, isLoading } = api.card.create.useMutation({
    onSuccess() {
      return navigation.goBack();
    },
  });

  const { mutate: updateCard, isLoading: updateLoading } =
    api.card.update.useMutation({
      onSuccess() {
        card.refetch();
        return navigation.goBack();
      },
    });

  const onSubmit: SubmitHandler<CardInputValues> = (data) => {
    if (card.data) {
      return updateCard({
        ...data,
        id: card.data.id,
      });
    }

    createCard(data);
  };

  if (card.isLoading)
    return (
      <View className="grow bg-slate-800 items-center justify-center">
        <ActivityIndicator color="#FFF" animating size="large" />
      </View>
    );

  return (
    <SafeAreaView className="grow bg-slate-800 p-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <Text className="text-2xl text-slate-200 font-bold">
            {`${card.data ? "Editar" : "Adicionar"} cartão`}
          </Text>
          <View className="h-4" />
          <Controller
            name="name"
            control={control}
            defaultValue={card.data?.name}
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
            defaultValue={card.data?.lastFourDigits ?? ""}
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
            defaultValue={card.data?.dueDay ?? ""}
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
            loading={isLoading || updateLoading}
            text={`${card.data ? "Editar" : "Adicionar"} cartão`}
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
