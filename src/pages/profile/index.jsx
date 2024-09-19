import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TbReplaceFilled } from "react-icons/tb";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useUploadSingleMutation } from "../../redux/baseAPI.js";
import { useUpdateUserMutation } from "../../redux/admin/subadmin/subadminAPI.js";
import {
  getOnlyFormatDate,
  getResizedImage,
  handleImageUrl,
} from "../../utils/utils.js";

const Profile = () => {
  const fileInputRef = useRef(null);
  const { user } = useSelector((store) => store.authSlice);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadSingle] = useUploadSingleMutation();
  const [updateUser] = useUpdateUserMutation();
  const formik = useFormik({
    initialValues: {
      userImg: null,
    },
    onSubmit: async (values) => {
      const obj = { ...values };
      const { userImg } = obj;

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

      const response = await updateUser({
        id: user._id,
        data: {
          images: { profile_img: obj.profile_img },
        },
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
      }
    },
  });
  const handleProfileUpload = async (e) => {
    const uploadedFile = e.currentTarget.files[0];
    if (uploadedFile) {
      const resizedUploadedFile = await getResizedImage(uploadedFile);
      formik.setFieldValue("userImg", resizedUploadedFile);
    }
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };
  useEffect(() => {
    if (formik.values.userImg) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(formik.values.userImg);

      formik.handleSubmit();
    } else {
      setImagePreview(null);
    }
  }, [formik.values.userImg]);

  return (
    <div
      className={`relative max-w-xl bg-white rounded-2xl mx-auto p-8 pt-10 mt-20 min-h-screen md:min-h-0`}
    >
      <div>
        <div className="relative -top-16 inset-x-1/2 -translate-x-1/2 border-4 border-green-slimy rounded-full h-32 w-32">
          <div className={`absolute bottom-0 right-0`}>
            <label className="relative btn btn-md p-2 h-auto bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-gray-500/50 focus:border-green-slimy normal-case rounded-full">
              <TbReplaceFilled />
              <input
               ref={(el) => (fileInputRef.current = el)}
                type="file"
                name="userImg"
                className="absolute left-0 top-0 w-0 h-0 overflow-hidden"
                accept="image/*"
                onChange={handleProfileUpload}
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
        <div className={`text-end`}>
          <button
            type="button"
            className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded-md normal-case"
            onClick={() =>
              navigate(user?.role === "admin" ? "admin/edit" : "edit")
            }
          >
            {user?.role === "admin" ? "Edit" : "Change Password"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-14">
        {/* name box */}
        <div className="flex sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md glass">
          <label className={`min-w-[5.5rem]`}>Name</label>
          <span>:</span>
          <p className="text-slate-600 ml-2 break-all">{user?.name}</p>
        </div>
        {/* Email box */}
        <div className="flex sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md glass">
          <label className={`min-w-[5.5rem]`}>Email</label>
          <span>:</span>
          <p className="text-slate-600 ml-2 break-all">{user?.email}</p>
        </div>
        {/* Phone box */}
        <div className="flex sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md glass">
          <label className={`min-w-[5.5rem]`}>Phone</label>
          <span>:</span>
          <p className="text-slate-600 ml-2 break-all">{user?.phone_no}</p>
        </div>
        {/* Address box */}
        <div className="flex sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md glass">
          <label className={`min-w-[5.5rem]`}>Address</label>
          <span>:</span>
          <p className="text-slate-600 ml-2 break-all">{user?.address}</p>
        </div>
        {user?.role === "owner" ? (
          <>
            <div className="flex sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md glass">
              <label className={`min-w-[5.5rem]`}>License</label>
              <span>:</span>
              <p className="text-slate-600 ml-2 break-all">
                {user?.license_key}
              </p>
            </div>
            <div className="flex sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md glass">
              <label className={`min-w-[5.5rem]`}>Expire Date</label>
              <span> : </span>
              <p className="text-slate-600 ml-2 break-all">
                {getOnlyFormatDate(user?.bill_to)}
                {/* {new Date(user?.bill_to).toLocaleDateString()} */}
              </p>
            </div>
            <div className="flex sm:flex-row sm:items-center sm:gap-5 py-2 px-2 rounded-md glass">
              <label className={`min-w-[5.5rem]`}>
                Last Renew <br /> Date
              </label>
              <span>:</span>
              <p className="text-slate-600 ml-2 break-all">
                {getOnlyFormatDate(user?.bill_from)}
                {/* {new Date(user?.bill_from).toLocaleDateString()} */}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
