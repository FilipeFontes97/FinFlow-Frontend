export const DebtStatus = {
  InDebt: 0,
  Paid: 1,
} as const;

export type DebtStatus = typeof DebtStatus[keyof typeof DebtStatus];

export interface Payment {
  id: string;
  amount: number;
  date: string;
}


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
  payments: Payment[]
}

export interface DebtCreateRequest {
  itemName: string;
  totalAmount: number;
  paymentPortions: number;
  notes?: string;
}