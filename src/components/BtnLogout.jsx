import React from "react";
import { useDispatch } from "react-redux";
import { logoutAction } from "../actions/user";
import { ImExit } from "react-icons/im";
import { Icon } from "@chakra-ui/react";

function BtnLogout(props) {
  const dispatch = useDispatch();

  const onBtnLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <button onClick={onBtnLogout} type="button" className="btn" style={{ color: "inherit" }}>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <Icon as={ImExit} w={8} h={8} />
        <span>Logout</span>
      </div>
    </button>
  );
}

export default BtnLogout;
