import { BrowserRouter, Routes, Route } from "react-router-dom";
import FinancialAccountList from "./features/Finances/pages/FinancialAccountList";
import DebtList from "./features/Finances/pages/DebtList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FinancialAccountList />} />
        <Route path="/debts" element={<DebtList />} />
      </Routes>
    </BrowserRouter>
  );
}