import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/index";
import Account from "./pages/account";
import Secret from "./pages/secret";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/secret" element={<Secret />} />
      </Routes>
    </Router>
  );
}

export default App;
