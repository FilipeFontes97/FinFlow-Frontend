import http from "../../../api/http";
import type { InvestmentSummary } from "../types/Investments";

interface InvestmentByYearApiResponse {
  year: number;
  totalInvested: number;
}

interface InvestmentSummaryApiResponse {
  investmentsByYear?: InvestmentByYearApiResponse[];
  totalInvested: number;
}

export const investmentReportService = {
  getByYear: async (): Promise<InvestmentSummary> => {
    const response = await http.get<InvestmentSummaryApiResponse>("/Investments/byYear");

    return {
      byYear: response.data.investmentsByYear ?? [],
      totalInvested: response.data.totalInvested,
    };
  }
};