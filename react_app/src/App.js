// App.js
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Card from "./Card";
import Card2 from "./Card2";

export default function App() {
  const [squares1, setSquares1] = useState(Array(25).fill(null));
  const [squares2, setSquares2] = useState(Array(25).fill(null));

  if (!squares1[12]) squares1[12] = "/smile.png";
  if (!squares2[12]) squares2[12] = "/smile.png";

  return (
    <BrowserRouter>
      <div style={{ position: "fixed", top: 10, left: 10, zIndex: 10 }}>
        <Link to="/" style={{ marginRight: 10, color: "cyan" }}>Card1</Link>
        <Link to="/card2" style={{ color: "cyan" }}>Card2</Link>
      </div>

      <Routes>
        <Route path="/" element={<Card squares={squares1} setSquares={setSquares1} />} />
        <Route path="/card2" element={<Card2 squares={squares2} setSquares={setSquares2} />} />
      </Routes>
    </BrowserRouter>
  );
}
