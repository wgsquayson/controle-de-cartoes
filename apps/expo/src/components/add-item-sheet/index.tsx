import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { StackParamList } from "../../domains";
import Button from "../button";

type AddItemSheetProps = Partial<BottomSheetProps> & {
  hasCards?: boolean;
};

const AddItemSheet: React.ForwardRefRenderFunction<
  BottomSheet,
  AddItemSheetProps
> = ({ onClose, hasCards }, ref) => {
  const navigation =
    useNavigation<NavigationProp<StackParamList, "Overview">>();

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);

  const {
    animatedSnapPoints,
    animatedHandleHeight,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const handleAddNewCard = () => {
    onClose?.();
    return navigation.navigate("CardForm");
  };

  const handleAddStatement = () => {
    onClose?.();
    return navigation.navigate("StatementForm");
  };

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
          <View className="p-4">
            <Button
              onPress={handleAddNewCard}
              text="Adicionar cartão"
              variant="secondary"
            />
            <View className="h-4" />
            {hasCards && (
              <>
                <Button
                  onPress={handleAddStatement}
                  text="Adicionar gasto"
                  variant="secondary"
                />
                <View className="h-6" />
              </>
            )}
            <Button onPress={onClose} text="Fechar" variant="tertiary" />
          </View>
          <View className="h-6" />
        </BottomSheetView>
      </ScrollView>
    </BottomSheet>
  );
};

export default React.forwardRef(AddItemSheet);
