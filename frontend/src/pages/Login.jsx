import { Navigate } from "react-router-dom";

// Redirect to SignIn page
const Login = () => {
  return <Navigate to="/signin" replace />;
};

export default Login;
