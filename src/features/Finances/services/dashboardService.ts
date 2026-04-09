import http from "../../../api/http";

export interface DashboardAllocation {
  accountType: string;
  amount: number;
  percentage: number;
}

export interface DashboardInvestmentByYear {
  year: number;
  totalInvested: number;
}

export interface DashboardSignal {
  code: string;
  message: string;
level: "Info" | "Warning" | "Danger";
}

export interface DashboardOverview {
  assets: number;
  debts: number;
  monthlyFixedExpenses: number;
  allTimeInvested: number;
  netPosition: number;
  assetAllocation: DashboardAllocation[];
  investmentsByYear: DashboardInvestmentByYear[];
  signals?: DashboardSignal[];
}

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await http.get<DashboardOverview>("/dashboard/dashboard");
    return response.data;
  }
};