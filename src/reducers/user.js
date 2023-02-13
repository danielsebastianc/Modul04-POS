const INITIAL_STATE = {
  idusers: 0,
  firstName: "",
  lastName: "",
  role: "",
  status: "",
};

export const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return INITIAL_STATE;
    default:
      return state;
  }
};
