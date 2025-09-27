import { useState } from "react";
import { BrowserRouter, Routes, Route, Link,useLocation } from "react-router-dom";
import Card from "./Card";
import Card2 from "./Card2";

const Navigation = ({ squares1, squares2 }) => {
  const location = useLocation();

  const isCard1Active = location.pathname === "/";
  const isCard2Active = location.pathname === "/card2";

  const baseLinkStyle = {
    textDecoration: "none",
    fontFamily: 'DotGothic16',
    fontSize: "50px",
    marginRight: 30,
    color: "cyan",
    textShadow: "0 0 10px cyan, 0 0 20px cyan",
  };

  const activeLinkStyle = {
    color: "lime",
    textShadow: "0 0 10px lime, 0 0 20px lime",
  };

  return (
    <div style={{ position: "fixed", top: 10, left: 10, zIndex: 10 }}>
      <Link
        to="/"
        style={{
          ...baseLinkStyle,
          ...(isCard1Active ? activeLinkStyle : {}),
          marginRight: 30
        }}
      >
        {isCard1Active ? "▶ " : ""}ビンゴカード1
      </Link>

      <Link
        to="/card2"
        style={{
          ...baseLinkStyle,
          ...(isCard2Active ? activeLinkStyle : {}),
          marginRight: 0
        }}
      >
        {isCard2Active ? "▶ " : ""}ビンゴカード2
      </Link>
    </div>
  );
};
export default function App() {
  const [squares1, setSquares1] = useState(Array(25).fill(null));
  const [squares2, setSquares2] = useState(Array(25).fill(null));

  if (!squares1[12]) squares1[12] = "/NKC2.png";
  if (!squares2[12]) squares2[12] = "/NKC2.png";
  return (
    <BrowserRouter>
      <link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Train+One&family=Rampart+One&display=swap" rel="stylesheet"></link>
      <Navigation squares1={squares1} squares2={squares2} /> 

      <Routes>
        <Route path="/" element={<Card squares={squares1} setSquares={setSquares1} />}/>
        <Route path="/card2" element={<Card2 squares={squares2} setSquares={setSquares2} />} />
      </Routes>
    </BrowserRouter>
  );
}
