import http from "../../../api/http";
import type {
  FixedExpenseResponse,
  CreateFixedExpenseRequest,
  UpdateFixedExpenseRequest
} from "../types/FixedExpenses";

export const fixedExpensesService = {
  getAll: async (): Promise<FixedExpenseResponse[]> => {
    const response = await http.get("/FixedExpenses/myFixedExpenses");
    return response.data;
  },

  getById: async (id: string): Promise<FixedExpenseResponse> => {
    const response = await http.get(`/FixedExpenses/getFixedExpenseById/${id}`);
    return response.data;
  },

  create: async (
    payload: CreateFixedExpenseRequest
  ): Promise<FixedExpenseResponse> => {
    const response = await http.post("/FixedExpenses/createFixedExpense", payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateFixedExpenseRequest
  ): Promise<void> => {
    await http.put(`/FixedExpenses/updateFixedExpense/${id}`, payload);
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/FixedExpenses/deleteFixedExpense/${id}`);
  }
};