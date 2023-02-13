import React from "react";
import { Input, InputGroup, Button, InputRightElement, Text, IconButton } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../helper";
import { loginAction } from "../actions/user";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

function Login(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  const onBtnLogin = () => {
    Axios.post(API_URL + "/users/login", {
      email,
      password,
    })
      .then((res) => {
        dispatch(loginAction(res.data.data));
        localStorage.setItem("pos_login", res.data.token);
        if (res.data.data.role === "admin") {
          navigate("/dashboard", { replace: true });
        } else if (res.data.data.role === "cashier") {
          navigate("/dashboard", { replace: true });
        }
      })
      .catch((error) => {
        console.log(error);
        if (!error.res.data.data.success) {
          alert(error.res.data.message);
        }
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onBtnLogin();
    }
  };
  return (
    <div
      className="d-flex flex-row justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#E5E5E6" }}
    >
      <div className="rounded-3 p-5 w-xl-25" style={{ backgroundColor: "#F5F6F7" }}>
        <div className="text-center">
          <h1 className="h2 mb-3">B&M CLOTHES</h1>
        </div>
        <Text mb="5px">Email</Text>
        <InputGroup>
          <Input
            focusBorderColor="#E96F16"
            onChange={(event) => setEmail(event.target.value)}
            type="text"
            mb="10px"
            shadow="sm"
            rounded={6}
          />
        </InputGroup>
        <Text mb="5px">Password</Text>
        <InputGroup size="md" mb="20px">
          <Input
            onChange={(event) => setPassword(event.target.value)}
            size="md"
            pr="4.5rem"
            type={show ? "text" : "password"}
            onKeyDown={handleKeyDown}
            focusBorderColor="#E96F16"
            shadow="sm"
            rounded={6}
          />
          <InputRightElement>
            <IconButton
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              size="sm"
              onClick={handleClick}
              variant="unstyled"
              mb={1}
            />
          </InputRightElement>
        </InputGroup>
        <button
          onClick={onBtnLogin}
          type="button"
          style={{ backgroundColor: "#A42221", color: "#F5F6F7" }}
          className="btn w-100"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
