export interface InvestmentByYear {
  year: number;
  totalInvested: number;
}

export interface InvestmentSummary {
  byYear: InvestmentByYear[];
  totalInvested: number;
}