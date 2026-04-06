export interface FixedExpenseResponse {
  id: string;

  category: string | number;

  description?: string | null;

  monthlyAmount: number;


  paymentDay?: number | null;

  notes?: string | null;
}

export interface CreateFixedExpenseRequest {
  category: string | number;
  description?: string | null;
  monthlyAmount: number;
  paymentDay?: number | null;
  notes?: string | null;
}

export interface UpdateFixedExpenseRequest {
  category: string | number;
  description?: string | null;
  monthlyAmount: number;
  paymentDay?: number | null;
  notes?: string | null;
}