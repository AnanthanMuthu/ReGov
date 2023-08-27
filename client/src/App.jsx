import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogIn from "./components/LogIn.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import VerifyAccountPage from "./components/VerifyAccountPage.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import PublicRoutes from "./utils/PublicRoutes";
import PrivateRoutes from "./utils/PrivateRoutes";
import CreateKyc from "./components/CreateKyc";
import KycList from "./components/KycList";
import UpdateKyc from "./components/UpdateKyc";
import VerifyKyc from "./components/VerifyKyc";
function App() {
  return (
    <Router>
      <Routes>
        <Route oute element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
          {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
          <Route
            path="/user/confirm/:confirmationCode"
            element={<VerifyAccountPage />}
          />
          <Route
            path="/user/reset-password/:confirmationCode"
            element={<ResetPassword />}
          />
          <Route path="/kyc-list" element={<KycList />} />
          <Route path="/create-kyc" element={<CreateKyc />} />
          <Route path="/verify-kyc/:kyc_id" element={<VerifyKyc />} />
          <Route path="/update-kyc" element={<UpdateKyc />} />
        </Route>

        <Route oute element={<PublicRoutes />}>
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
