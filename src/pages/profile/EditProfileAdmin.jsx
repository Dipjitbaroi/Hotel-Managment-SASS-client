import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useUpdateUserMutation } from "../../redux/admin/subadmin/subadminAPI.js";

// form validation
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  newPassword: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .when([], {
      is: (newPassword) => newPassword && newPassword.length > 0,
      then: yup.string().required("Password is required"),
    }),
  confirmPassword: yup
    .string()
    .min(8, "Confirm Password should be of minimum 8 characters length")
    .when([], {
      is: (confirmPassword) => confirmPassword && confirmPassword.length > 0,
      then: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
    }),
});

const EditProfileAdmin = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [updateUser, { isLoading: isFetching }] = useUpdateUserMutation();
  const { user } = useSelector((store) => store.authSlice);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const obj = { ...values };
      const {
        name,
        phone: phone_no,
        email,
        newPassword: password,
        address,
      } = obj;
      let response;

      if (password) {
        response = await updateUser({
          id: user._id,
          data: {
            name,
            phone_no,
            email,
            password,
            address,
          },
        });
      } else {
        response = await updateUser({
          id: user._id,
          data: {
            name,
            phone_no,
            email,
            address,
          },
        });
      }

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        navigate(-1);
        toast.success(response.data.message);
      }
    },
  });

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user?.name,
        address: user?.address,
        phone: user?.phone_no,
        email: user?.email,
      });
    }
  }, [user]);

  return (
    <div
      className={`relative max-w-xl bg-white rounded-2xl mx-auto p-8 pt-10 mt-20`}
    >
      <div>
        {/*<div className="absolute -top-16 inset-x-1/2 -translate-x-1/2 border-4 border-green-slimy rounded-full h-32 w-32">*/}
        {/*  {imagePreview ? (*/}
        {/*    <img*/}
        {/*      src={imagePreview}*/}
        {/*      alt=""*/}
        {/*      className="object-cover object-top h-full w-full rounded-full"*/}
        {/*    />*/}
        {/*  ) : (*/}
        {/*    <img*/}
        {/*      src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"*/}
        {/*      alt=""*/}
        {/*      className="object-cover h-full w-full rounded-full"*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</div>*/}
        <div>
          <button
            type="button"
            className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded-md normal-case"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
      <form
        autoComplete="off"
        className="form-control grid grid-cols-1 gap-4 mt-14"
        onSubmit={formik.handleSubmit}
      >
        <div>
          <h3 className={`font-semibold`}>Name</h3>
          <div className="relative">
            <input
              type={"text"}
              placeholder="Name"
              name="name"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && Boolean(formik.errors.name) ? (
              <small className="text-red-600">
                {formik.touched.name && formik.errors.name}
              </small>
            ) : null}
          </div>
        </div>
        <div>
          <h3 className={`font-semibold`}>Address</h3>
          <div className="relative">
            <input
              type={"text"}
              placeholder="Address"
              name="address"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.address && Boolean(formik.errors.address) ? (
              <small className="text-red-600">
                {formik.touched.address && formik.errors.address}
              </small>
            ) : null}
          </div>
        </div>
        <div>
          <h3 className={`font-semibold`}>Phone</h3>
          <div className="relative">
            <input
              type={"text"}
              placeholder="Phone"
              name="phone"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && Boolean(formik.errors.phone) ? (
              <small className="text-red-600">
                {formik.touched.phone && formik.errors.phone}
              </small>
            ) : null}
          </div>
        </div>
        <div>
          <h3 className={`font-semibold`}>Email</h3>
          <div className="relative">
            <input
              type={"text"}
              placeholder="Email"
              name="email"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && Boolean(formik.errors.email) ? (
              <small className="text-red-600">
                {formik.touched.email && formik.errors.email}
              </small>
            ) : null}
          </div>
        </div>
        <div>
          <h3 className={`font-semibold`}>New Password</h3>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter New Password"
              name="newPassword"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.newPassword &&
            Boolean(formik.errors.newPassword) ? (
              <small className="text-red-600">
                {formik.touched.newPassword && formik.errors.newPassword}
              </small>
            ) : null}

            {!showPass ? (
              <FaEyeSlash
                onClick={handleShowPass}
                className="absolute right-0 top-4 text-green-slimy text-lg mr-3 cursor-pointer"
              />
            ) : (
              <FaEye
                onClick={handleShowPass}
                className="absolute right-0 top-4 text-green-slimy text-lg mr-3 cursor-pointer"
              />
            )}
          </div>
        </div>

        <div>
          <h3 className={`font-semibold`}>Confirm Password</h3>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword) ? (
              <small className="text-red-600">
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword}
              </small>
            ) : null}

            {!showPass ? (
              <FaEyeSlash
                onClick={handleShowPass}
                className="absolute right-0 top-4 text-green-slimy text-lg mr-3 cursor-pointer"
              />
            ) : (
              <FaEye
                onClick={handleShowPass}
                className="absolute right-0 top-4 text-green-slimy text-lg mr-3 cursor-pointer"
              />
            )}
          </div>
        </div>

        <button
          type={"submit"}
          className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
        >
          <span>Update</span>
          {isFetching ? (
            <span
              className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
              role="status"
            ></span>
          ) : null}
        </button>
      </form>
    </div>
  );
};

export default EditProfileAdmin;
