import { BrowserRouter as Router, Route, Routes ,Link } from "react-router-dom";
import React, { useEffect, useState } from "react"
import CardDetail from "./Components/CardDetail";
import Home from "./Components/Home";
import Login from "./Components/Login";
import About from "./Components/Abaut";
import Users from "./Components/Users";
import Buyurtmalar from "./Components/Buyurtmalar";
import BerilganBuyurtmalar from "./Components/BerilganBuyurtmalar";
import MalumotlarSorash from "./MalumotSo'rash";
import Hisob from "./Components/Hisob";
import Elonlar from "./Components/Elonlar";
import Navbar from "./Components/Navbar";
import Messenger from "./Components/messenger";
import Card from "./Components/card";


function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('https://shoop-9wre.onrender.com/tort').then(response => response.json()),
      fetch('https://shoop-9wre.onrender.com/qolmehnati').then(response => response.json()),
      fetch('https://shoop-9wre.onrender.com/kiyimlar').then(response => response.json())
    ]).then(([tort, qolMehnati, kiyimlar]) => {
      setData([...tort, ...qolMehnati, ...kiyimlar]); 
    });
  }, []);

  return (
    <Router>
      <Navbar 
      
      />
      <Routes>
        <Route
          path="/cart"
          element={
            <div>
              {data.map((card, index) => (
                <Link to={`/cart/${card.id}`} key={`${card.id}-${index}`}>
                  <Card card={card} />
                </Link>
              ))}
            </div>
          }
        />
        <Route path="/cart/:id" element={<CardDetail />} />
        <Route path="/messages/*" element={<Messenger />} />
        <Route path="/*" element={<Home  />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/haqida" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/buyurtmalarberish" element={<Buyurtmalar />} />
        <Route path="/berilganbuyurtmalar/*" element={<BerilganBuyurtmalar  />} />
        <Route path="/malumotlar" element={<MalumotlarSorash />} />
        <Route path="/hisob/*" element={<Hisob  />} />
        <Route path="/elonlar/*" element={<Elonlar  />} />
      </Routes>
    </Router>
  );
}

export default App;