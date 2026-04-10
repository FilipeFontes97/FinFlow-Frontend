import { BrowserRouter, Routes, Route } from "react-router-dom";
import FinancialAccountList from "./features/Finances/pages/FinancialAccountList";
import DebtList from "./features/Finances/pages/DebtList";
import FixedExpensesList from "./features/Finances/pages/FixedExpensesList";
import AppLayout from "./layout/AppLayout";
import InvestmentByYear from "./features/Finances/pages/InvestmentByYear";
import HomeDashboard from "./features/Finances/pages/HomeDashboard";
import SettingsPage from "./features/Finances/pages/SettingsPage";
import LandingPage from "./features/Finances/pages/LandingPage";
import { CalculatorProvider } from "./features/Finances/contexts/CalculatorContext";

export default function App() {
  return (
    <BrowserRouter>
      <CalculatorProvider>
        <Routes>
          {/* Layout route */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<HomeDashboard />} />
            <Route path="/accounts" element={<FinancialAccountList />} />
             <Route path="/fixed-expenses" element={<FixedExpensesList />} />
            <Route path="/debts" element={<DebtList />} />
            <Route path="/investments-by-year" element={<InvestmentByYear />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </CalculatorProvider>
    </BrowserRouter>
  );
}
