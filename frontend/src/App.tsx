import { BrowserRouter, Routes, Route } from "react-router-dom";
import TableManagement from "./pages/TableManagement";
import Menu from "./pages/Menu";
import CategoriesManagement from "./pages/CategoriesManagement";
import ModifiersManagement from "./pages/ModifiersManagement";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TableManagement />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/categories" element={<CategoriesManagement />} />
        <Route path="/modifiers" element={<ModifiersManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
