import http from "../../../api/http";

interface AddInvestmentRequest {
  financialAccountId: string;
  amount: number;
  investmentDate: string;
}

export const investmentService = {
  addInvestment: async (payload: AddInvestmentRequest): Promise<void> => {
    await http.post("/Investments", payload);
  }
};