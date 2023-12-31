import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { isEmpty } from "../utils/isEmpty";
import { BASE_URL } from "../constants";
import Regov from "./../assets/regov.png";

const LogIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState({});
  const [verificationSentResponse, setVerificationSentResponse] = useState({});

  const handleSubmitForm = (values) => {
    setIsLoading(true);
    const userData = {
      email: values.email,
      password: values.password,
    };
    console.log(userData);
    axios
      .post(`${BASE_URL}/user/login`, userData)
      .then(async (response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setIsLoading(false);
        navigate("/home");
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setLoginError({
            message: error.response.data.message,
            statusCode: error.response.status,
          });
          setVerificationSentResponse({});
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
        setIsLoading(false);
      });
  };
  const handleForgotPassword = (email) => {
    setIsLoading(true);
    const userData = {
      email,
    };
    console.log(email);
    axios
      .post(`${BASE_URL}/user/forgotPassword`, userData)
      .then(async (response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setIsLoading(false);
        // navigate("/home");
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setLoginError({
            message: error.response.data.message,
            statusCode: error.response.status,
          });
          setVerificationSentResponse({});
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
        setIsLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid Email").required("Required"),
      password: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
    }),
    onSubmit: (values) => handleSubmitForm(values),
  });

  const handleResendVerification = () => {
    setIsLoading(true);
    const userData = {
      email: formik.values.email,
      password: formik.values.password,
    };
    console.log(userData);
    axios
      .post(`${BASE_URL}/user/verify/resend`, userData)
      .then(async (response) => {
        console.log("### response", response);
        if (response.data.status == "active") {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        setIsLoading(false);
        setVerificationSentResponse({
          message: response.data.message,
          statusCode: response.status,
        });
        setLoginError({});
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          !isEmpty(error) &&
            !isEmpty(error.response) &&
            !isEmpty(error.response.data) &&
            !isEmpty(error.response.data.message) &&
            setVerificationSentResponse({
              message: error.response.data.message,
              statusCode: error.response.status,
            });
          setLoginError({});
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }

        setIsLoading(false);
      });
  };

  return (
    <div className="container">
      <form className="form-container" onSubmit={formik.handleSubmit}>
        <img src={Regov} width="100" alt="Regov" />
        <h1>Login</h1>
        {!isEmpty(loginError) ? (
          <div className="text-normal">
            <div>{loginError.message}</div>
            {loginError.statusCode === 403 ? (
              <div>
                <div className="">
                  Didn't get email verification?{" "}
                  <div
                    className="toggle-button"
                    onClick={handleResendVerification}>
                    Resend
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {!isEmpty(verificationSentResponse) ? (
          <div
            className={
              verificationSentResponse.statusCode === 200 ||
              verificationSentResponse.statusCode === 202
                ? "text-success"
                : verificationSentResponse.statusCode === 201
                ? "text-normal"
                : "text-error"
            }>
            <div>{verificationSentResponse.message}</div>
          </div>
        ) : (
          <></>
        )}
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email.."
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="form-error-text">{formik.errors.email}</p>
          )}
        </div>

        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Your password.."
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && formik.touched.password && (
            <p className="form-error-text">{formik.errors.password}</p>
          )}
        </div>
        {isLoading ? (
          <div className="">
            <div className="lds-dual-ring"></div>
          </div>
        ) : (
          <button type="submit">Login</button>
        )}
        <div
          className="toggle-button mb20"
          onClick={() => handleForgotPassword(formik.values.email)}>
          Forgot password?
        </div>
        {!isLoading ? (
          <div className="toggle-text">
            Don't have an account?{" "}
            <Link className="toggle-button" to="/register">
              Register
            </Link>
          </div>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default LogIn;
