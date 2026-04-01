export const DebtStatus = {
  InDebt: 0,
  Paid: 1,
} as const;

export type DebtStatus = typeof DebtStatus[keyof typeof DebtStatus];

export interface DebtResponse {
  id: string;
  itemName: string;
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  lastPaymentDate?: string;
  paymentPortions: number;
  notes?: string;
  debtStatus: DebtStatus;
}