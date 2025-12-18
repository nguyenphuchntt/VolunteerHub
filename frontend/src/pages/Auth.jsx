import React from "react";
import { useLocation } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Auth = () => {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";

  return isSignUp ? <SignUp /> : <SignIn />;
};

export default Auth;
