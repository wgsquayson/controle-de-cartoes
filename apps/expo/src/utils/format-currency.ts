import { MaskService } from "react-native-masked-text";

const formatCurrency = (amount?: number | string) => {
  const stringAmount = String(amount ?? 0);

  return MaskService.toMask("money", stringAmount, { unit: "R$ " });
};

export const sanitizeCurrency = (amount: string) => {
  return Number(amount.split(" ")[1]?.replace(/[,.]+/g, ""));
};

export default formatCurrency;
