import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Item } from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { StackParamList } from "../..";
import { Button, Input, Picker } from "../../../components";
import {
  api,
  formatCurrency,
  formatDate,
  monthArray,
  sanitizeCurrency,
} from "../../../utils";

export type StatementInputValues = {
  description: string;
  amount: string;
  purchaseDate: string;
  cardId: string;
  paymentDate: string;
};

const StatementForm: React.FC = () => {
  const navigation =
    useNavigation<NavigationProp<StackParamList, "StatementForm">>();
  const route = useRoute<RouteProp<StackParamList, "StatementForm">>();

  const cards = api.card.all.useQuery();

  const statement = api.statement.byId.useQuery({
    id: route.params.statementId ?? "",
  });

  const { control, handleSubmit } = useForm<StatementInputValues>();

  const today = new Date();

  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());
  const [selectedCard, setSelectedCard] = useState<string>();
  const [paymentYear, setPaymentYear] = useState(String(today.getFullYear()));
  const [paymentMonth, setPaymentMonth] = useState(
    String(today.getMonth() + 1),
  );

  const pickerCards: Item[] = cards?.data
    ?.map((card) => {
      return {
        label: card.name,
        value: card.id,
        key: card.id,
      };
    })
    .filter(Boolean) as Item[];

  const { mutate: createStatement, isLoading } =
    api.statement.create.useMutation({
      onSuccess() {
        return navigation.goBack();
      },
    });

  const { mutate: updateStatement, isLoading: updateLoading } =
    api.statement.update.useMutation({
      onSuccess() {
        statement.refetch();
        return navigation.goBack();
      },
    });

  const onSubmit: SubmitHandler<StatementInputValues> = ({
    amount,
    description,
  }) => {
    if (statement.data) {
      return updateStatement({
        id: statement.data.id,
        amount: sanitizeCurrency(amount),
        cardId: selectedCard ?? statement.data.cardId,
        description,
        paymentMonth:
          paymentMonth === statement.data.paymentMonth
            ? statement.data.paymentMonth
            : String(Number(paymentMonth) + 1),
        paymentYear,
        purchaseDate,
      });
    }

    if (!selectedCard || sanitizeCurrency(amount) === 0) return;

    return createStatement({
      amount: sanitizeCurrency(amount),
      cardId: selectedCard,
      description,
      paymentMonth: String(Number(paymentMonth) + 1),
      paymentYear,
      purchaseDate,
    });
  };

  const renderDatePickerComponent = useCallback(
    ({
      label,
      onPress,
      value,
      onChange,
    }: {
      label: string;
      onPress?: () => void;
      value?: Date;
      onChange?: (_: DateTimePickerEvent, date: Date | undefined) => void;
    }) => {
      if (Platform.OS === "android") {
        return (
          <Input
            label={label}
            value={formatDate(value ?? new Date())}
            readonly
            onPress={onPress}
          />
        );
      } else {
        return (
          <>
            <Text className="text-base text-slate-300 font-medium">
              {label}
            </Text>
            <View className="h-1" />
            <View className="flex border-2 border-slate-300 p-2 rounded-lg">
              <DateTimePicker
                style={{ alignSelf: "flex-start" }}
                value={value ?? new Date()}
                mode="date"
                onChange={onChange}
                themeVariant="dark"
              />
            </View>
          </>
        );
      }
    },
    [],
  );

  const monthPickerItems: Item[] = useMemo(
    () =>
      monthArray.map((month, index) => ({
        label: month,
        value: index,
        key: index,
      })),
    [],
  );

  const yearPickerItems: Item[] = useMemo(() => {
    const yearsArray = [];
    for (let index = 0; index < 10; index++) {
      yearsArray.push(String(Number(paymentYear) - 5 + index));
    }

    return yearsArray.map((year) => ({
      label: year,
      value: year,
      key: year,
    }));
  }, []);

  if (cards.isLoading || statement.isLoading)
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-2xl text-slate-200 font-bold">
            {`${statement.data ? "Editar" : "Adicionar"} gasto`}
          </Text>
          <View className="h-4" />
          <Controller
            name="description"
            control={control}
            defaultValue={statement?.data?.description}
            render={({ field: { value, onChange } }) => (
              <Input label="Descrição" value={value} onChangeText={onChange} />
            )}
          />
          <View className="h-4" />
          <Controller
            name="amount"
            control={control}
            defaultValue={formatCurrency(statement?.data?.amount)}
            render={({ field: { value, onChange } }) => (
              <Input
                label="Valor"
                value={formatCurrency(value)}
                onChangeText={onChange}
              />
            )}
          />
          <View className="h-4" />
          {renderDatePickerComponent({
            label: "Data de compra",
            value: statement?.data?.purchaseDate ?? purchaseDate,
            onChange: (_, date) => setPurchaseDate(date as Date),
            onPress: () =>
              DateTimePickerAndroid.open({
                value: purchaseDate,
                onChange: (_, date) => setPurchaseDate(date as Date),
              }),
          })}
          <View className="h-4" />
          <Picker
            label="Cartão"
            items={pickerCards}
            itemKey={statement?.data?.cardId}
            onValueChange={(value: string) => {
              setSelectedCard(value);
            }}
            {...(statement && { placeholder: {} })}
          />

          <View className="h-4" />
          <Picker
            label="Mês de pagamento"
            items={monthPickerItems}
            placeholder={
              statement
                ? {}
                : {
                    label: monthArray[Number(paymentMonth)],
                    value: paymentMonth,
                  }
            }
            itemKey={Number(statement?.data?.paymentMonth) - 1}
            onValueChange={(value: string) => setPaymentMonth(value)}
          />
          <View className="h-4" />
          <Picker
            label="Ano de pagamento"
            items={yearPickerItems}
            placeholder={
              statement
                ? {}
                : {
                    label: paymentYear,
                    value: paymentYear,
                  }
            }
            itemKey={statement?.data?.paymentYear}
            onValueChange={(value: string) => setPaymentYear(value)}
          />
          <View className="h-6" />
          <Button
            onPress={handleSubmit(onSubmit)}
            text={`${statement.data ? "Editar" : "Adicionar"} gasto`}
            loading={isLoading || updateLoading}
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

export default React.memo(StatementForm);
