export const loginAction = (data) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: data,
  };
};
export const logoutAction = () => {
  localStorage.removeItem("pos_login");
  return {
    type: "LOGOUT",
  };
};
