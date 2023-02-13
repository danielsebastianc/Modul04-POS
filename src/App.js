import React from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { loginAction } from "./actions/user";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { Spinner } from "@chakra-ui/react";
import Cashier from "./pages/Cashier";
import { API_URL } from "./helper";
import Products from "./pages/Products";
import Transaction from "./pages/Transaction";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const pathName = window.location.pathname;
  const arr = pathName.toString().split("/");
  const currentPath = arr[arr.length - 1];

  const [loading, setLoading] = React.useState(true);

  const keepLogin = async () => {
    try {
      let getLocalStorage = localStorage.getItem("pos_login");
      let currentPath = location.pathname;
      if (getLocalStorage) {
        let response = await Axios.get(API_URL + "/users/keep", {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        });
        dispatch(loginAction(response.data.data));
        localStorage.setItem("pos_login", response.data.token);
        if (response.data.data.role === "admin") {
          navigate(`${currentPath}`);
        } else if (response.data.data.role === "cashier") {
          navigate(`${currentPath}`);
        }
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    keepLogin();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner thickness="5px" speed="0.8s" emptyColor="gray.200" color="red.700" size="xl" />
      ) : (
        <div
          className={
            currentPath.length > 0
              ? "container-fluid d-flex flex-row m-0 p-0 align-items-stretch"
              : ""
          }
        >
          {currentPath.length > 0 ? <Sidebar /> : null}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/products" element={<Products />} />
            <Route path="/transaction" element={<Transaction />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
