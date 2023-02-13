import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Item } from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";

import { AddItemSheet, Button, Picker, Statement } from "../components";
import { api } from "../utils/api";
import formatCurrency from "../utils/format-currency";
import formatDate from "../utils/format-date";
import monthArray from "../utils/monthArray";

const Home: React.FC = () => {
  const date = new Date();

  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

  const statements = api.statement.byFilter.useQuery({
    paymentMonth: String(selectedMonth + 1),
    paymentYear: String(selectedYear),
  });
  const cards = api.card.all.useQuery();

  const { mutate: deleteCard } = api.card.delete.useMutation();
  const { mutate: deleteStatement } = api.statement.delete.useMutation();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const cardsDetail = ({
    dueDay,
    lastFourDigits,
  }: {
    dueDay: string | null;
    lastFourDigits: string | null;
  }) => {
    if (dueDay && lastFourDigits)
      return `Final ${lastFourDigits} | Fatura vence dia ${dueDay}`;
    else if (dueDay) return `Fatura vence dia ${dueDay}`;
    else if (lastFourDigits) return `Final ${lastFourDigits}`;
    else return "";
  };

  const getCard = (id: string) => {
    const cardSearch = cards.data?.find((card) => card.id === id);

    return cardSearch;
  };

  const getDebt = (cardId: string, year: string, month: string) => {
    const cardSearch = cards.data?.find((card) => card.id === cardId);

    const cardDebt = cardSearch?.debt.find((debt) => {
      if (debt.month === month && debt.year === year) return debt;
    });

    return cardDebt?.amount;
  };

  const getTotalDebt = () => {
    const debtByCard = cards.data?.map((card) => {
      return card.debt.reduce((prev, curr) => {
        return (
          prev +
          (curr.month === String(selectedMonth + 1) &&
          curr.year === String(selectedYear)
            ? curr.amount
            : 0)
        );
      }, 0);
    });

    return debtByCard?.reduce((prev, curr) => prev + curr, 0);
  };

  const statementsDetail = ({
    cardId,
    purchaseDate,
    paymentMonth,
    paymentYear,
  }: {
    cardId: string;
    purchaseDate: Date;
    paymentMonth: string;
    paymentYear: string;
  }) => {
    return `${getCard(cardId)?.name}\nComprado em ${formatDate(
      purchaseDate,
    )}\nPagar em ${monthArray[
      Number(paymentMonth) - 1
    ]?.toLowerCase()}/${paymentYear}`;
  };

  const onFinish = useCallback(() => {
    cards.refetch();
    statements.refetch();
  }, [cards, statements]);

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
      yearsArray.push(String(selectedYear - 5 + index));
    }

    return yearsArray.map((year) => ({
      label: year,
      value: year,
    }));
  }, []);

  useEffect(() => {
    onFinish();
  }, [selectedMonth, selectedYear]);

  if (cards.isLoading || statements.isLoading)
    return (
      <View className="grow bg-slate-800 items-center justify-center">
        <ActivityIndicator color="#FFF" animating size="large" />
      </View>
    );

  return (
    <SafeAreaView className="grow bg-slate-800 p-6">
      <ScrollView>
        <Text className="text-2xl text-slate-200 font-bold">
          Controle de cartões
        </Text>
        <View className="h-4" />
        <Picker
          label="Ano"
          items={yearPickerItems}
          placeholder={{
            label: String(selectedYear),
            value: String(selectedYear),
          }}
          onValueChange={(value) => setSelectedYear(value)}
          variant="secondary"
        />
        <View className="h-4" />
        <Picker
          label="Mês"
          items={monthPickerItems}
          placeholder={{
            label: monthArray[selectedMonth],
            value: selectedMonth,
          }}
          onValueChange={(value) => setSelectedMonth(value)}
          variant="secondary"
        />
        <View className="h-4" />
        <Text className="text-xl text-slate-200 font-bold">
          Dívidas em {monthArray[selectedMonth]?.toLowerCase()}/{selectedYear}
        </Text>
        <View className="h-4" />
        {cards.data && cards.data.length > 0 ? (
          cards.data?.map(({ id, name, lastFourDigits, dueDay }) => (
            <React.Fragment key={id}>
              <Statement
                onPress={() => {
                  deleteCard(id);

                  onFinish();
                }}
                title={name}
                amount={
                  "Dívida: " +
                  formatCurrency(
                    getDebt(
                      id,
                      String(selectedYear),
                      String(selectedMonth + 1),
                    ),
                  )
                }
                detail={cardsDetail({ dueDay, lastFourDigits })}
              />
              <View className="h-4" />
            </React.Fragment>
          ))
        ) : (
          <Text className="text-base text-slate-200">Sem registros.</Text>
        )}
        <View className="h-4" />
        <Text className="text-xl text-slate-200 font-bold">
          Últimos registros para {monthArray[selectedMonth]?.toLowerCase()}/
          {selectedYear}
        </Text>
        <View className="h-4" />
        {statements.data && statements.data.length > 0 ? (
          statements.data?.map(
            ({
              id,
              amount,
              description,
              purchaseDate,
              cardId,
              paymentMonth,
              paymentYear,
            }) => (
              <React.Fragment key={id}>
                <Statement
                  onPress={() => {
                    deleteStatement(id);

                    onFinish();
                  }}
                  title={description}
                  amount={formatCurrency(amount)}
                  detail={statementsDetail({
                    cardId,
                    purchaseDate,
                    paymentMonth,
                    paymentYear,
                  })}
                />
                <View className="h-4" />
              </React.Fragment>
            ),
          )
        ) : (
          <Text className="text-base text-slate-200">Sem registros.</Text>
        )}
        <View className="h-4" />
      </ScrollView>
      <Button text="Adicionar" onPress={openBottomSheet} />
      <AddItemSheet
        ref={bottomSheetRef}
        onClose={closeBottomSheet}
        onFinish={onFinish}
        cards={cards.data ?? []}
      />
    </SafeAreaView>
  );
};

export default Home;
