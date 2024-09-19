import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { TbReplaceFilled } from "react-icons/tb";
import { Rings } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../redux/admin/subadmin/subadminAPI.js";
import { useUploadSingleMutation } from "../../redux/baseAPI.js";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .when([], {
      is: (password) => password && password.length > 0,
      then: yup.string().required("Password is required"),
    }),
  phoneNumber: yup.string().required("Phone Number is required"),
  emergency_contact: yup.string().required("Emergency contact is required"),
  salary: yup
    .number()
    .required("Salary is required")
    .positive("Salary must be a positive number")
    .integer("Salary must be an integer"),
});

const ManagerEdit = () => {
  const { id } = useParams();
  const { data: userData, error, isLoading } = useGetUserQuery(id);
  const [userImgPrev, setUserImgPrev] = useState(null);
  const navigate = useNavigate();
  const [updateUser, { isLoading: isFetching }] = useUpdateUserMutation();
  const [uploadSingle] = useUploadSingleMutation();
  const [showPass, setShowPass] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      address: "",
      email: "",
      phoneNumber: "",
      emergency_contact: "",
      salary: "",
      userImg: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const obj = { ...values };
      const {
        name,
        phoneNumber: phone_no,
        email,
        emergency_contact,
        password,
        address,
        salary,
        userImg,
      } = obj;

      if (userImg) {
        const formData = new FormData();
        formData.append(
          userImg.name.substring(0, userImg.name.lastIndexOf(".")),
          userImg,
        );

        await uploadSingle(formData).then(
          (result) => (obj.profile_img = result.data.imageUrl),
        );
      }

      let response;

      if (password) {
        response = await updateUser({
          id,
          data: {
            name,
            phone_no,
            email,
            emergency_contact,
            password,
            address,
            salary,
            ...(userImg ? { images: { profile_img: obj.profile_img } } : {}),
          },
        });
      } else {
        response = await updateUser({
          id,
          data: {
            name,
            phone_no,
            email,
            emergency_contact,
            address,
            salary,
            ...(userImg ? { images: { profile_img: obj.profile_img } } : {}),
          },
        });
      }

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
      }
    },
  });

  useEffect(() => {
    if (formik.values.userImg) {
      const reader = new FileReader();

      reader.onload = () => setUserImgPrev(reader.result);
      reader.readAsDataURL(formik.values.userImg);
    } else {
      setUserImgPrev(null);
    }
  }, [formik.values.userImg]);

  useEffect(() => {
    if (userData) {
      formik.setValues({
        name: userData?.name,
        address: userData?.address,
        email: userData?.email,
        phoneNumber: userData?.phone_no,
        emergency_contact: userData?.emergency_contact,
        salary: userData?.salary,
      });
    }
  }, [userData]);

  return (
    <div className={`space-y-10`}>
      <div className="card bg-white shadow-xl">
        <div className="card-body p-4">
          <div>
            <span
              className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </span>
          </div>
          <h2 className={`text-3xl text-center`}>Edit Manager</h2>
          <hr className={`my-5`} />
        </div>

        <div className="max-auto">
          {!isLoading ? (
            <form
              autoComplete="off"
              className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
              onSubmit={formik.handleSubmit}
            >
              <div className={`col-span-full relative rounded overflow-hidden`}>
                <div className={`absolute top-3 right-3`}>
                  <label className="relative btn btn-md p-2 h-auto bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-gray-500/50 focus:border-green-slimy normal-case">
                    <TbReplaceFilled />
                    <input
                      type="file"
                      name="userImg"
                      className="absolute left-0 top-0 w-0 h-0 overflow-hidden"
                      accept="image/*"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "userImg",
                          e.currentTarget.files[0],
                        )
                      }
                      onBlur={formik.handleBlur}
                    />
                  </label>
                </div>
                {userImgPrev ? (
                  <img
                    src={userImgPrev}
                    alt=""
                    className={`w-full h-96 object-cover`}
                  />
                ) : (
                  <img
                    src={userData?.images?.profile_img}
                    alt=""
                    className={`w-full h-96 object-cover`}
                  />
                )}
              </div>
              {/* manager Name box */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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
              {/* User Password box */}
              <div className={`flex flex-col gap-3`}>
                <div className={`relative`}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="New Password"
                    name="password"
                    className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full"
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
                {formik.touched.password && Boolean(formik.errors.password) ? (
                  <small className="text-red-600">
                    {formik.touched.password && formik.errors.password}
                  </small>
                ) : null}
              </div>
              {/* Manager Address box */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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
              {/*Manager Email box */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Email "
                  name="email"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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

              {/*Manager Phone Number  box */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phoneNumber &&
                Boolean(formik.errors.phoneNumber) ? (
                  <small className="text-red-600">
                    {formik.touched.phoneNumber && formik.errors.phoneNumber}
                  </small>
                ) : null}
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Emergency Contact"
                  name="emergency_contact"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.emergency_contact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.emergency_contact &&
                Boolean(formik.errors.emergency_contact) ? (
                  <small className="text-red-600">
                    {formik.touched.emergency_contact &&
                      formik.errors.emergency_contact}
                  </small>
                ) : null}
              </div>
              {/*Manager salary  box */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Salary"
                  name="salary"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.salary && Boolean(formik.errors.salary) ? (
                  <small className="text-red-600">
                    {formik.touched.salary && formik.errors.salary}
                  </small>
                ) : null}
              </div>
              {/* submit button */}
              <div className=" col-span-full text-end mb-5 ">
                <button
                  type="submit"
                  className=" btn btn-md  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
                >
                  <span>Update</span>
                  {isLoading ? (
                    <span
                      className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                      role="status"
                    ></span>
                  ) : null}
                </button>
              </div>
            </form>
          ) : (
            <Rings
              width="50"
              height="50"
              color="#37a000"
              wrapperClass="justify-center"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerEdit;
