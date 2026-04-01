import http from "../../../api/http";
import type {
  FinancialAccountResponse,
  FinancialAccountListResponse,
  CreateFinancialAccountRequest,
  UpdateFinancialAccountRequest,
} from "../types/FinancialAccount";

export const financialAccountService = {
  // ✅ GET ALL
  getAll: async (): Promise<FinancialAccountListResponse> => {
    const res = await http.get("/FinancialAccount/myFinancialAccounts");
    return res.data;
  },

  // ✅ GET BY ID
  getById: async (id: string): Promise<FinancialAccountResponse> => {
    const res = await http.get(`/FinancialAccount/getFinancialAccountById/${id}`);
    return res.data;
  },

  // ✅ CREATE
  create: async (
    data: CreateFinancialAccountRequest
  ): Promise<FinancialAccountResponse> => {
    const res = await http.post("/FinancialAccount", data);
    return res.data;
  },

  // ✅ UPDATE
  update: async (
    id: string,
    data: UpdateFinancialAccountRequest
  ): Promise<FinancialAccountResponse> => {
    const res = await http.put(`/FinancialAccount/updateFinancialAccout/${id}`, data);
    return res.data;
  },

  // ✅ DELETE
  delete: async (id: string): Promise<void> => {
    await http.delete(`/FinancialAccount/deleteFinancialAccount/${id}`);
  },
};