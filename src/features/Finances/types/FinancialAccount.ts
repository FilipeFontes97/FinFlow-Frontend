export interface FinancialAccountResponse {
  id: string;
  name: string;
  type: string;
  valueInvested: number | null;
  currentValue: number | null;
  profit: number | null;
  notes?: string;
}

export interface FinancialAccountListResponse {
  financialAccountList: FinancialAccountResponse[];
  totalCurrentValue: number;
}

export interface CreateFinancialAccountRequest {
  name: string;
  type: string;
  valueInvested: number | null;
  currentValue: number | null;
  notes?: string;
}

export interface UpdateFinancialAccountRequest {
  name: string;
  type: string;
  valueInvested: number | null;
  currentValue: number | null;
  notes?: string;
}