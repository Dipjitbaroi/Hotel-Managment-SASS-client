import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import imgAbstractSI from "../assets/bg-abstract-signin.svg";
import { useSignInMutation } from "../redux/auth/authAPI.js";
import { setToken } from "../redux/auth/authSlice.js";
import loginPageLogo from "../assets/LoginLogo.png";
import Footer from "../components/Footer.jsx";
import { versionControl } from "../utils/utils.js";

// sign in form validation
const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const SignIn = () => {
  const dispatch = useDispatch();
  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const fromURL = location.state?.fromURL.pathname;
  const { token } = useSelector((store) => store.authSlice);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const response = await signIn(values);

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        dispatch(setToken(response.data.token));
        navigate(fromURL || "/dashboard");
        toast.success("Sign In Successfully!", {
          duration: 3000,
        });
      }
    },
  });
  useEffect(() => {
    if (token) {
      navigate(fromURL || "/dashboard");
    }
  }, []);
  useEffect(() => {
    if (fromURL)
      toast.error(
        "Only registered user can access this page. Please, login first!"
      );
  }, []);

  return (
    <>
      <section className={`relative py-10`}>
        {/* background pattern */}
        <figure
          className={`hidden md:block absolute top-0 left-0 w-full h-96 overflow-hidden`}
        >
          <img src={imgAbstractSI} alt="" />
        </figure>
        <div className="container max-2xl mx-auto">
          <div className={`mt-20`}>
            {/* brand title */}
            <div className={`relative -mt-20 max-w-xl max-h-sm mx-auto`}>
              <img src={loginPageLogo} alt="Dak Hopitality" />
            </div>

            <div className={`relative text-center -mt-10 mb-10 mx-auto`}>
              <h1 className="text-4xl font-bold text-green-slimy">
                Hotel Management System
              </h1>
            </div>
            {/* <h1
            className={` text-4xl absolute right-[38%]   text-center w-auto -mt-14 font-black text-green-slimy`}
          >
            Hotel Management System
          </h1> */}
            {/* sign in card */}
            <div className="card  w-full sm:max-w-lg sm:mx-auto bg-white shadow-2xl">
              <div className="card-body">
                <div className={`flex flex-col items-center space-y-2`}>
                  <h3 className={`text-2xl font-bold`}>Sign In</h3>
                  <p>Sign in Using Your Username</p>
                </div>
                <form
                  autoComplete="off"
                  className="form-control gap-y-4"
                  onSubmit={formik.handleSubmit}
                >
                  {/* username box */}
                  <div className="flex flex-col gap-3">
                    <input
                      type="username"
                      placeholder="Username"
                      name="username"
                      className="input input-sm bg-transparent text-green-slimy w-full px-0 border-0 border-b border-b-green-slimy rounded-none focus:outline-none"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.username &&
                    Boolean(formik.errors.username) ? (
                      <small className="text-red-600">
                        {formik.touched.username && formik.errors.username}
                      </small>
                    ) : null}
                  </div>
                  {/* password box */}
                  <div className="flex flex-col gap-3">
                    <div className={`relative`}>
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        className="input input-sm bg-transparent text-green-slimy w-full px-0 border-0 border-b border-b-green-slimy rounded-none focus:outline-none"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {showPass ? (
                        <span
                          className={`absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer`}
                          onClick={() => setShowPass(false)}
                        >
                          <FaEyeSlash />
                        </span>
                      ) : (
                        <span
                          className={`absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer`}
                          onClick={() => setShowPass(true)}
                        >
                          <FaEye />
                        </span>
                      )}
                    </div>
                    {formik.touched.password &&
                    Boolean(formik.errors.password) ? (
                      <small className="text-red-600">
                        {formik.touched.password && formik.errors.password}
                      </small>
                    ) : null}
                  </div>
                  {/* submit button */}
                  <button
                    type="submit"
                    disable={isLoading ? true : false}
                    className="btn btn-sm w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                  >
                    <span>Sign In</span>
                    {isLoading ? (
                      <span
                        className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                        role="status"
                      ></span>
                    ) : null}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        <h3 className="text-lg text-center">
          Powered by{" "}
          <Link
            className={`text-green-slimy text-xl font-semibold`}
            to={`https://jsencoder.com/`}
            target="_blank"
          >
            JS Encoder
          </Link>
          . Copyright &copy; {new Date().getFullYear()}. All rights reserved.
          Version {versionControl}{" "}
        </h3>
      </div>
    </>
  );
};

export default SignIn;
