import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Rings } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../redux/admin/subadmin/subadminAPI.js";
import { useUploadSingleMutation } from "../../redux/baseAPI.js";
import { TbReplaceFilled } from "react-icons/tb";
import {
  getOnlyFormatDate,
  getResizedImage,
  handleImageUrl,
} from "../../utils/utils.js";

// form validation
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phoneNumber: yup.string().required("Phone Number is required"),
  salary: yup
    .number()
    .required("Salary is required")
    .positive("Salary must be a positive number")
    .integer("Salary must be an integer"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .when([], {
      is: (password) => password && password.length > 0,
      then: yup.string().required("Password is required"),
    }),
});

const SubAdminProfile = () => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const { isLoading, data: user } = useGetUserQuery(id);
  const [updateUser] = useUpdateUserMutation();
  const [isFetching, setFetching] = useState(false);
  const [uploadSingle] = useUploadSingleMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      salary: "",
      emergency_contact: "",
      userImg: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setFetching(true);

      const obj = { ...values };
      const {
        name,
        phoneNumber: phone_no,
        email,
        password,
        address,
        salary,
        emergency_contact,
        userImg,
      } = obj;

      if (userImg) {
        const formData = new FormData();
        const photoName = userImg.name.substring(
          0,
          userImg.name.lastIndexOf(".")
        );

        formData.append(photoName, userImg);

        delete obj.userImg;
        await uploadSingle(formData).then(
          (result) => (obj.profile_img = result.data.imageUrl)
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
            password,
            address,
            salary,
            emergency_contact,
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
            address,
            salary,
            emergency_contact,
            ...(userImg ? { images: { profile_img: obj.profile_img } } : {}),
          },
        });
      }

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        navigate(-1);
      }

      setFetching(false);
    },
  });

  useEffect(() => {
    if (formik.values.userImg) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(formik.values.userImg);
    } else {
      setImagePreview(null);
    }
  }, [formik.values.userImg]);

  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user?.name,
        email: user?.email,
        phoneNumber: user?.phone_no,
        address: user?.address,
        salary: user?.salary,
        emergency_contact: user?.emergency_contact,
      });
    }
  }, [user]);

  return (
    <div
      className={`relative max-w-xl bg-white rounded-2xl mx-auto p-8 pt-10 mt-20`}
    >
      <div>
        <div>
          <span
            className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </span>
        </div>
        <div className="relative -top-28 inset-x-1/2 -translate-x-1/2 border-4 border-green-slimy rounded-full h-32 w-32">
          <div className={`absolute bottom-0 right-0`}>
            <label className="relative btn btn-md p-2 h-auto bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-gray-500/50 focus:border-green-slimy normal-case rounded-full">
              <TbReplaceFilled />
              <input
               ref={(el) => (fileInputRef.current = el)}
                type="file"
                name="userImg"
                className="absolute left-0 top-0 w-0 h-0 overflow-hidden"
                accept="image/*"
                onChange={async (e) => {
                  const uploadedFile = e.currentTarget.files[0];
                  if (uploadedFile) {
                    const resizedUploadedFile =
                      await getResizedImage(uploadedFile);
                    formik.setFieldValue("userImg", resizedUploadedFile);
                  }
                 fileInputRef.current ? (fileInputRef.current.value = '') : null;
                }}
                onBlur={formik.handleBlur}
              />
            </label>
          </div>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt=""
              className="object-cover object-top h-full w-full rounded-full"
            />
          ) : (
            <img
              src={handleImageUrl(user?.images?.profile_img)}
              alt=""
              className="object-cover h-full w-full rounded-full"
            />
          )}
        </div>
      </div>
      {!isLoading ? (
        <form
          autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 max-w-3xl mx-auto"
          onSubmit={formik.handleSubmit}
        >
          {/* name box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md">
            <label className={`w-24 break-words`}>Name: </label>
            <div className="flex flex-col w-full space-y-2">
              <input
                type="text"
                name="name"
                className="input input-md bg-transparent w-full input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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
          {/* Email box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md">
            <label className={`w-24 break-words`}>Email: </label>
            <div className="flex flex-col w-full space-y-2">
              <input
                type="email"
                name="email"
                className="input input-md bg-transparent w-full input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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
          {/* Phone box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md">
            <label className={`w-24 break-words`}>Phone: </label>
            <div className="flex flex-col w-full space-y-2">
              <input
                type="text"
                name="phoneNumber"
                className="input input-md bg-transparent w-full input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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
          </div>
          {/* emergency contact  */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md">
            <label className={`w-24 break-words`}>Emergency Contact: </label>
            <div className="flex flex-col w-full space-y-2">
              <input
                type="text"
                name="emergency_contact"
                className="input input-md bg-transparent w-full input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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
          </div>

          {/* Address box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md">
            <label className={`w-24 break-words`}>Address: </label>
            <div className="flex flex-col w-full space-y-2">
              <textarea
                name="address"
                className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md">
            <label className={`w-24 break-words`}>Password: </label>
            <div className="relative flex flex-col w-full">
              <input
                type={showPass ? "text" : "password"}
                placeholder="New Password"
                name="password"
                className="input input-md bg-transparent w-full input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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

              {formik.touched.password && Boolean(formik.errors.password) ? (
                <small className="text-red-600 mt-2">
                  {formik.touched.password && formik.errors.password}
                </small>
              ) : null}
            </div>
          </div>
          {/* salary box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md">
            <label className={`w-24 break-words`}>Salary: </label>
            <div className="flex flex-col w-full space-y-2">
              <input
                type="text"
                name="salary"
                className="input input-md bg-transparent w-full input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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
          </div>
          {/* Joining date box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md">
            <label className={`w-24 break-words`}>Joining Date: </label>
            <div className="flex flex-col w-full space-y-2">
              <input
                type="text"
                placeholder={getOnlyFormatDate(user?.joining_date)}
                // {new Date(user?.joining_date).toLocaleDateString()}
                className="input input-md bg-transparent w-full input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy input-disabled"
                readOnly
              />
            </div>
          </div>
          {/* submit button */}
          <div className="flex justify-end">
            <button
              disabled={isFetching}
              type="submit"
              className="btn w-fit bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case max-w-xs h-auto"
            >
              <span>Update Information</span>
              {isFetching ? (
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
          wrapperClass="justify-center mt-14"
        />
      )}
    </div>
  );
};

export default SubAdminProfile;
