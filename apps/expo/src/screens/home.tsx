import React, { useRef } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";

import { AddItemSheet, Button, Statement } from "../components";
import { api } from "../utils/api";
import formatCurrency from "../utils/format-currency";
import formatDate from "../utils/format-date";

const Home: React.FC = () => {
  const cards = api.card.all.useQuery();
  const statements = api.statement.all.useQuery();

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

  const statementsDetail = ({
    cardId,
    purchaseDate,
  }: {
    cardId: string;
    purchaseDate: Date;
  }) => {
    return `${getCard(cardId)?.name} | Comprado em ${formatDate(purchaseDate)}`;
  };

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
        <Text className="text-xl text-slate-200 font-bold">Cartões</Text>
        <View className="h-2" />
        <Text className="text-base text-slate-200 font-bold">
          Mês: Fevereiro
        </Text>
        <View className="h-2" />
        <Text className="text-base text-slate-200 font-bold">
          Gasto total: R$ 10,00
        </Text>
        <View className="h-4" />
        {cards.data &&
          cards.data?.map(({ id, name, lastFourDigits, dueDay }) => (
            <React.Fragment key={id}>
              <Statement
                onPress={async () => {
                  deleteCard(id);

                  await cards.refetch();
                  await statements.refetch();
                }}
                title={name}
                amount={formatCurrency(getDebt(id, "2023", "3"))}
                detail={cardsDetail({ dueDay, lastFourDigits })}
              />
              <View className="h-4" />
            </React.Fragment>
          ))}

        <Text className="text-xl text-slate-200 font-bold">
          Últimos registros
        </Text>
        <View className="h-4" />
        {statements.data &&
          statements.data?.map(
            ({ id, amount, description, purchaseDate, cardId }) => (
              <React.Fragment key={id}>
                <Statement
                  onPress={async () => {
                    deleteStatement(id);

                    await cards.refetch();
                    await statements.refetch();
                  }}
                  title={description}
                  amount={formatCurrency(amount)}
                  detail={statementsDetail({ cardId, purchaseDate })}
                />
                <View className="h-4" />
              </React.Fragment>
            ),
          )}
        <View className="h-4" />
        <Button text="Adicionar" onPress={openBottomSheet} />
      </ScrollView>
      <AddItemSheet
        ref={bottomSheetRef}
        onClose={closeBottomSheet}
        onFinish={cards.refetch}
        cards={cards.data ?? []}
      />
    </SafeAreaView>
  );
};

export default Home;
