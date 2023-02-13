import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminNavLinks from "./AdminNavLinks";
import CashierNavLinks from "./CashierNavLinks";

function Sidebar(props) {
  const navigate = useNavigate();
  const { role, firstName } = useSelector((state) => {
    return {
      firstName: state.user.firstName,
      role: state.user.role,
    };
  });

  useEffect(() => {
    if (!firstName) {
      navigate("/", { replace: true });
    }
  }, [firstName]);

  return (
    <div
      style={{ backgroundColor: "#575764", color: "#F5F6F7" }}
      className="d-flex flex-column p-4"
    >
      {role === "admin" ? <AdminNavLinks /> : <CashierNavLinks />}
    </div>
  );
}

export default Sidebar;
