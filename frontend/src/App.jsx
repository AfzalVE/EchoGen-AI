import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
