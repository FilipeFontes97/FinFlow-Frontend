import { BrowserRouter, Routes, Route } from "react-router-dom";
import FinancialAccountList from "./features/Finances/pages/FinancialAccountList";
import DebtList from "./features/Finances/pages/DebtList";
import FixedExpensesList from "./features/Finances/pages/FixedExpensesList";
import AppLayout from "./layout/AppLayout";
import InvestmentByYear from "./features/Finances/pages/InvestmentByYear";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout route */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<FinancialAccountList />} />
           <Route path="/fixed-expenses" element={<FixedExpensesList />} />
          <Route path="/debts" element={<DebtList />} />
          <Route path="/investments-by-year" element={<InvestmentByYear />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
