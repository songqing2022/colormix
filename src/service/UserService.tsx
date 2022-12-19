import React, { createContext, useContext } from "react";
export const UserContext = createContext<any|null>(null);
const actions = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

const reducer = (state:any, action:any) => {
  switch (action.type) {
    case actions.LOGIN:
      return Object.assign({}, state, { user: action.data });
    case actions.LOGOUT:
      return { user: { userId: 0 } };
    default:
      return state;
  }
};
export const UserProvider = ({ children }:{children:React.ReactNode}) => {
  const [state, dispatch] = React.useReducer(reducer, { user: { userId: 0 } });
  const value = {
    user: state.user,
    login: (user:any) => {
      dispatch({ type: actions.LOGIN, data: user });
    },
    logout: () => {
      dispatch({ type: actions.LOGOUT });
    },
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
const useUserService = () => {
  return useContext(UserContext);
};
export default useUserService;
