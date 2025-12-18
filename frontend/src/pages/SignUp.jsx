import { Navigate } from "react-router-dom";

// SignUp now redirects to SignIn page where the auth flow is handled via modals
const SignUp = () => {
  return <Navigate to="/signin" replace />;
};

export default SignUp;
