import React from "react";
import { Icon } from "@chakra-ui/react";
import { GiClothes } from "react-icons/gi";
import { FaClipboardList } from "react-icons/fa";
import { ImHome } from "react-icons/im";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import BtnLogout from "./BtnLogout";

function AdminNavLinks(props) {
  return (
    <div className="mt-5 gap-5 d-flex flex-column align-items-center justify-content-center">
      <Link to="/dashboard" style={{ color: "inherit" }}>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Icon as={ImHome} w={8} h={8} />
          <span>Home</span>
        </div>
      </Link>
      <Link to="/products" style={{ color: "inherit" }}>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Icon as={GiClothes} w={8} h={8} />
          <span>Products</span>
        </div>
      </Link>
      <Link to="/transaction" style={{ color: "inherit" }}>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Icon as={FaClipboardList} w={8} h={8} />
          <span>Transactions</span>
        </div>
      </Link>
      <Link to="/cashier" style={{ color: "inherit" }}>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Icon as={FaUserAlt} w={8} h={8} />
          <span>Cashiers</span>
        </div>
      </Link>
      <BtnLogout />
    </div>
  );
}

export default AdminNavLinks;
