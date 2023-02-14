import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";

import Button from "../button";
import CardForm from "./components/card-form";
import StatementForm from "./components/statement-form";
import { Card } from ".prisma/client";

type AddItemSheetProps = Partial<BottomSheetProps> & {
  onFinish: () => void;
  cards: Card[];
};

const AddItemSheet: React.ForwardRefRenderFunction<
  BottomSheet,
  AddItemSheetProps
> = ({ onClose, onFinish, cards }, ref) => {
  const [selectedOption, setSelectedOption] = useState<
    "card" | "statement" | null
  >(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);

  const {
    animatedSnapPoints,
    animatedHandleHeight,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const handleFinish = () => {
    onFinish();
    setSelectedOption(null);
  };

  const renderContent = useCallback(() => {
    switch (selectedOption) {
      case "card":
        return (
          <CardForm
            onFinish={handleFinish}
            onClose={onClose}
            onGoBack={() => setSelectedOption(null)}
          />
        );

      case "statement":
        return (
          <StatementForm
            cards={cards}
            onGoBack={() => setSelectedOption(null)}
            onFinish={handleFinish}
            onClose={onClose}
          />
        );

      default:
        return (
          <Animated.View
            key="1"
            className="p-4"
            entering={FadeIn}
            exiting={FadeOut}
          >
            <Button
              onPress={() => setSelectedOption("card")}
              text="Adicionar cartão"
              variant="secondary"
            />
            <View className="h-4" />
            {cards.length > 0 && (
              <>
                <Button
                  onPress={() => setSelectedOption("statement")}
                  text="Adicionar gasto"
                  variant="secondary"
                />
                <View className="h-6" />
              </>
            )}
            <Button
              onPress={() => onClose?.()}
              text="Fechar"
              variant="tertiary"
            />
            <View className="h-6" />
          </Animated.View>
        );
    }
  }, [selectedOption, cards.length]);

  return (
    <BottomSheet
      waitFor={ref}
      onClose={onClose}
      ref={ref}
      index={-1}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enableOverDrag
    >
      <ScrollView>
        <BottomSheetView onLayout={handleContentLayout}>
          {renderContent()}
        </BottomSheetView>
      </ScrollView>
    </BottomSheet>
  );
};

export default React.forwardRef(AddItemSheet);
