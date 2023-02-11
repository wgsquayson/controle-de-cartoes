import { MaskService } from "react-native-masked-text";

const formatCurrency = (amount?: number) => {
  const stringAmount = String(amount ?? 0);

  return MaskService.toMask("money", stringAmount, { unit: "R$ " });
};

export default formatCurrency;
