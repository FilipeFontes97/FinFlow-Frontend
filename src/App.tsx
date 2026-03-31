import { BrowserRouter, Routes, Route } from "react-router-dom";
import FinancialAccountList from "./features/financialAccounts/pages/FinancialAccountList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FinancialAccountList />} />
      </Routes>
    </BrowserRouter>
  );
}