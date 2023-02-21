import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Item } from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import BottomSheet from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";

import { AddItemSheet, Button, Picker, Statement } from "../../../components";
import { api, formatCurrency, formatDate, monthArray } from "../../../utils";
import { Statement as StatementType } from ".prisma/client";

const Overview: React.FC = () => {
  const date = new Date();

  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [nextMonth, setNextMonth] = useState(0);
  const [nextYear, setNextYear] = useState(0);

  const statements = api.statement.byFilter.useQuery({
    paymentMonth: String(selectedMonth + 1),
    paymentYear: String(selectedYear),
  });

  const cards = api.card.all.useQuery();

  const monthDebt = api.debt.totalDebtByDate.useQuery({
    month: String(selectedMonth + 1),
    year: String(selectedYear),
  });

  const refetch = async () => {
    await cards.refetch();
    await statements.refetch();
    await monthDebt.refetch();
  };

  const { mutate: deleteCard } = api.card.delete.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const { mutate: deleteStatement } = api.statement.delete.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

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

  const statementsDetail = (statement: StatementType) => {
    return `${getCard(statement.cardId)?.name}\nComprado em ${formatDate(
      statement.purchaseDate,
    )}\nPagar em ${monthArray[
      Number(statement.paymentMonth) - 1
    ]?.toLowerCase()}/${statement.paymentYear}`;
  };

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

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  if (cards.isLoading || statements.isLoading)
    return (
      <View className="grow bg-slate-800 items-center justify-center">
        <ActivityIndicator color="#FFF" animating size="large" />
      </View>
    );

  return (
    <SafeAreaView className="grow bg-slate-800 p-6">
      <StatusBar style="light" />
      <ScrollView>
        <Text className="text-2xl text-slate-200 font-bold">
          Controle de cartões
        </Text>
        <View className="h-4" />
        <View className="flex flex-row">
          <Picker
            label="Ano"
            items={yearPickerItems}
            placeholder={{
              label: String(selectedYear),
              value: String(selectedYear),
            }}
            onValueChange={(value: number) => setNextYear(value)}
            onDonePress={() => setSelectedYear(nextYear)}
          />
          <View className="w-4" />
          <Picker
            label="Mês"
            items={monthPickerItems}
            placeholder={{
              label: monthArray[selectedMonth],
              value: selectedMonth,
            }}
            onValueChange={(value: number) => setNextMonth(value)}
            onDonePress={() => setSelectedMonth(nextMonth)}
            width="w-72"
          />
        </View>
        <View className="h-4" />
        <Text className="text-xl text-slate-200 font-bold">
          Dívidas em {monthArray[selectedMonth]?.toLowerCase()}/{selectedYear}
        </Text>
        <View className="h-4" />
        <Text className="text-base text-slate-200 font-bold">
          Total: {formatCurrency(monthDebt.data)}
        </Text>
        <View className="h-4" />
        {cards.data && cards.data.length > 0 ? (
          cards.data?.map(({ id, name, lastFourDigits, dueDay }) => (
            <React.Fragment key={id}>
              <Statement
                onPress={() => {
                  deleteCard(id);
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
          statements.data?.map((statement) => (
            <React.Fragment key={statement.id}>
              <Statement
                onPress={() => {
                  deleteStatement(statement.id);
                }}
                title={statement.description}
                amount={formatCurrency(statement.amount)}
                detail={statementsDetail(statement)}
              />
              <View className="h-4" />
            </React.Fragment>
          ))
        ) : (
          <Text className="text-base text-slate-200">Sem registros.</Text>
        )}
        <View className="h-4" />
      </ScrollView>
      <Button text="Adicionar" onPress={openBottomSheet} />
      <AddItemSheet
        ref={bottomSheetRef}
        onClose={closeBottomSheet}
        hasCards={cards.data && cards.data?.length > 0}
      />
    </SafeAreaView>
  );
};

export default Overview;
