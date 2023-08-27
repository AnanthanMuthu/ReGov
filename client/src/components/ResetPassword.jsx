import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { isEmpty } from "../utils/isEmpty";
import { BASE_URL } from "../constants";

const VerifyAccountPage = () => {
  const { confirmationCode } = useParams();
  const [isConfirmationLoading, setIsConfirmationLoading] = useState(false);
  const [verificationSentResponse, setVerificationSentResponse] = useState({});

  useEffect(() => {
    console.log("confirm called");
    setIsConfirmationLoading(true);
    axios
      .get(`${BASE_URL}/user/resetPassword/${confirmationCode}`)
      .then((response) => {
        console.log("confirm ", response);
        setIsConfirmationLoading(false);
        setVerificationSentResponse({
          message: response.data.message,
          statusCode: response.status,
        });
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setVerificationSentResponse({
            message: error.response.data.message,
            statusCode: error.response.status,
          });

          console.log("confirm er ", error.response);
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log("confirm error ", error);
        }
        setIsConfirmationLoading(false);
      });
  }, []);

  const handleSubmitForm = (values) => {
    setIsLoading(true);
    const userData = {
      password: values.password,
      retypePassword: values.retypePassword,
    };

    axios
      .post(`${BASE_URL}/user/updatePassword`, userData)
      .then((response) => {
        console.log(response);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("server responded");
          if (error?.response?.data?.type === "FORM_ERROR") {
            formik.setErrors(error.response.data.errors);
          }
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
      password: "",
      retypePassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
      retypePassword: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
    }),
    onSubmit: (values) => handleSubmitForm(values),
  });

  return (
    <div className="activate-container">
      {isConfirmationLoading ? (
        <div className="activate-content">
          <div>
            <div class="lds-dual-ring"></div>
          </div>
          <div>Confirming account ...</div>
        </div>
      ) : (
        <div className="activate-content">
          <div>Account Verification</div>

          {!isEmpty(verificationSentResponse) ? (
            <div
              className={`text-message ${
                verificationSentResponse.statusCode === 200 ||
                verificationSentResponse.statusCode === 202
                  ? "text-success"
                  : verificationSentResponse.statusCode === 201
                  ? "text-normal"
                  : "text-error"
              }`}
              style={{
                padding: "10px",
                margin: "10px",
              }}>
              <div>{verificationSentResponse.message}</div>
            </div>
          ) : (
            <></>
          )}
          {verificationSentResponse.statusCode === 200 ||
          verificationSentResponse.statusCode === 201 ||
          verificationSentResponse.statusCode === 202 ? (
            <>
              <form className="form-container" onSubmit={formik.handleSubmit}>
                <h1>Register</h1>
                <div className="input-container">
                  <label htmlFor="password">New Password</label>
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
                <div className="input-container">
                  <label htmlFor="password">Retype Password</label>
                  <input
                    type="password"
                    id="retypePassword"
                    name="retypePassword"
                    placeholder="Your password.."
                    onChange={formik.handleChange}
                    value={formik.values.retypePassword}
                  />
                  {formik.errors.retypePassword &&
                    formik.touched.retypePassword && (
                      <p className="form-error-text">
                        {formik.errors.retypePassword}
                      </p>
                    )}
                </div>
                {isLoading ? (
                  <div className="">
                    <div class="lds-dual-ring"></div>
                  </div>
                ) : (
                  <button type="submit">Reset Password</button>
                )}
              </form>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyAccountPage;
