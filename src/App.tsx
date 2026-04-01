import { BrowserRouter, Routes, Route } from "react-router-dom";
import FinancialAccountList from "./features/Finances/pages/FinancialAccountList";
import DebtList from "./features/Finances/pages/DebtList";
import AppLayout from "./layout/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout route */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<FinancialAccountList />} />
          <Route path="/debts" element={<DebtList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
