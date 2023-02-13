import React, { useCallback, useMemo, useState } from "react";
import { Platform, Text, View } from "react-native";
import { MaskService } from "react-native-masked-text";
import { Item } from "react-native-picker-select";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { api } from "../../../../utils/api";
import formatCurrency, {
  sanitizeCurrency,
} from "../../../../utils/format-currency";
import formatDate from "../../../../utils/format-date";
import monthArray from "../../../../utils/monthArray";
import Button from "../../../button";
import Input from "../../../input";
import Picker from "../../../picker";
import { Card } from ".prisma/client";

export type StatementInputValues = {
  description: string;
  amount: string;
  purchaseDate: string;
  cardId: string;
  paymentDate: string;
};

type StatementFormProps = {
  cards: Card[];
  onGoBack: () => void;
  onFinish: () => void;
  onClose?: () => void;
};

const StatementForm: React.FC<StatementFormProps> = ({
  cards,
  onFinish,
  onGoBack,
  onClose,
}) => {
  const { control, handleSubmit } = useForm<StatementInputValues>();

  const today = new Date();

  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());
  const [selectedCard, setSelectedCard] = useState<string>();
  const [paymentYear, setPaymentYear] = useState(String(today.getFullYear()));
  const [paymentMonth, setPaymentMonth] = useState(
    String(today.getMonth() + 1),
  );

  const pickerCards: Item[] = cards
    .map((card) => {
      return {
        label: card.name,
        value: card.id,
        key: card.id,
      };
    })
    .filter(Boolean);

  const { mutate: createStatement } = api.statement.create.useMutation({
    onSuccess() {
      onFinish();
      onClose?.();
    },
  });

  const onSubmit: SubmitHandler<StatementInputValues> = ({
    amount,
    description,
  }) => {
    if (!selectedCard || sanitizeCurrency(amount) === 0) return;

    createStatement({
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
            <Text className="text-base text-slate-800 font-medium">
              {label}
            </Text>
            <View className="h-1" />
            <View className="flex border-2 border-slate-800 p-2 rounded-lg">
              <DateTimePicker
                style={{ alignSelf: "flex-start" }}
                value={value ?? new Date()}
                mode="date"
                onChange={onChange}
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
    }));
  }, []);

  return (
    <>
      <Animated.View
        key="3"
        className="p-4"
        entering={FadeIn}
        exiting={FadeOut}
      >
        <Controller
          name="description"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input label="Descrição" value={value} onChangeText={onChange} />
          )}
        />
        <View className="h-4" />
        <Controller
          name="amount"
          control={control}
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
          value: purchaseDate,
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
          onValueChange={(value: string) => {
            setSelectedCard(value);
          }}
        />

        <View className="h-4" />
        <Picker
          label="Mês de pagamento"
          items={monthPickerItems}
          placeholder={{
            label: monthArray[Number(paymentMonth)],
            value: paymentMonth,
          }}
          onValueChange={(value) => setPaymentMonth(value)}
        />
        <View className="h-4" />
        <Picker
          label="Ano de pagamento"
          items={yearPickerItems}
          placeholder={{
            label: paymentYear,
            value: paymentYear,
          }}
          onValueChange={(value) => setPaymentYear(value)}
        />
        <View className="h-6" />
        <Button
          onPress={handleSubmit(onSubmit)}
          text="Adicionar gasto"
          variant="secondary"
        />
        <View className="h-6" />
        <Button text="Voltar" variant="tertiary" onPress={onGoBack} />
        <View className="h-6" />
      </Animated.View>
    </>
  );
};

export default React.memo(StatementForm);
