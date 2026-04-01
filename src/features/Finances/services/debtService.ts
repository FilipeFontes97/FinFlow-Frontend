import http from "../../../api/http";
import type { DebtCreateRequest, DebtResponse } from "../types/Debt";

export const debtService = {
  getAll: async (): Promise<DebtResponse[]> => {
    const res = await http.get("/Debt/myDebts");
    return res.data;
  },

  create: async (payload: DebtCreateRequest): Promise<DebtResponse> => {
    const res = await http.post("/Debt/createDebt", payload);
    return res.data;
  },

  update: async (id: string, payload: DebtResponse): Promise<DebtResponse> => {
    const res = await http.put(`/Debt/updateDebt/${id}`, payload);
    return res.data;
  },

  addPayment: async (debtId: string, amount: number): Promise<DebtResponse> => {
    const res = await http.post(`/Debt/addPayment/${debtId}`, amount, {
      headers: { "Content-Type": "application/json" }
    });
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/Debt/deleteDebt/${id}`);
  }
};