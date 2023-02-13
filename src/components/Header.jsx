import React from "react";
import { useSelector } from "react-redux";
import { AddIcon } from "@chakra-ui/icons";
import { Button, Heading } from "@chakra-ui/react";

function Header(props) {
  const { role, fName, lName } = useSelector((state) => {
    return {
      fName: state.user.firstName,
      lName: state.user.lastName,
      role: state.user.role,
    };
  });
  const firstCharUp = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div className="d-flex align-items-center justify-content-between mb-5">
      <div className="d-flex gap-4 align-items-center">
        <h1 className="h1">{props.pageName}</h1>
        {props.pageName === "Transaction" ? null : (
          <Button
            onClick={props.open}
            type="button"
            leftIcon={<AddIcon />}
            colorScheme="red"
            variant="ghost"
          >
            Register New {props.pageName}
          </Button>
        )}
      </div>
      <div className="d-flex flex-column">
        <span style={{ fontSize: "13px" }}>{role === "admin" ? `Welcome, ` : `Kasir`}</span>
        <Heading as="h5" size="md">
          {firstCharUp(fName)} {firstCharUp(lName)}
        </Heading>
      </div>
    </div>
  );
}

export default Header;
