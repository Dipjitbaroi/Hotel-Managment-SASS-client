import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import * as yup from "yup";
import { useAddSubAdminMutation } from "../../redux/admin/subadmin/subadminAPI.js";
import {
    useUploadMutation,
    useUploadSingleMutation,
} from "../../redux/baseAPI.js";

// form validation
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  userName: yup.string().required("Username is required"),
  address: yup.string().required("Address is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  phoneNumber: yup.string().required("Phone Number is required"),
  emergency_contact: yup.string().required("Emergency contact is required"),
  salary: yup
    .number()
    .required("Salary is required")
    .positive("Salary must be a positive number")
    .integer("Salary must be an integer"),
  joiningDate: yup.string().required("Joining Date is required"),
  documentsType: yup.string().required("Documents type is required"),
  documents: yup.string().when(["documentsType"], ([documentsType], schema) => {
    if (documentsType) return schema.required(`${documentsType} is required`);
    else return schema;
  }),
});

const AddManager = () => {
  const [isLoading, setLoading] = useState(false);
  const [upload,{isError}] = useUploadMutation();
  const [uploadSingle,{isError:singleError}] = useUploadSingleMutation();
  const [addSubAdmin] = useAddSubAdminMutation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      userName: "",
      password: "",
      address: "",
      email: "",
      phoneNumber: "",
      emergency_contact: "",
      salary: "",
      joiningDate: "",
      userImg: null,
      documentsType: "",
      documents: null,
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      setLoading(true);

      const formData = new FormData();
      const formData2 = new FormData();
      const obj = { ...values };
      const {
        name,
        userName: username,
        phoneNumber: phone_no,
        email,
        emergency_contact,
        password,
        address,
        salary,
        joiningDate: joining_date,
        documentsType,
        documents,
        userImg,
      } = obj;

      for (let i = 0; i < documents.length; i++) {
        const photoName = documents[i].name.substring(
          0,
          documents[i].name.lastIndexOf("."),
        );

        formData.append(photoName, documents[i]);
      }

      await upload(formData).then((result) => {
        let title;

        switch (documentsType) {
          case "NID":
            title = "nid";
            break;
          case "Passport":
            title = "passport";
            break;
          case "Driving License":
            title = "driving_lic_img";
        }

        obj.images = {
          [title]: result.data.imageUrls,
        };
      });

      formData2.append(
        userImg.name.substring(0, userImg.name.lastIndexOf(".")),
        userImg,
      );

      await uploadSingle(formData2).then(
        (result) => (obj.images.profile_img = result.data.imageUrl),
      );

      const response = await addSubAdmin({
        role: "manager",
        name,
        username,
        phone_no,
        email,
        emergency_contact,
        password,
        address,
        salary,
        joining_date,
        images: obj.images,
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        formikHelpers.resetForm();
        setSelectedImages([]);
      }

      setLoading(false);
    },
  });

  // const handleDelete = (idx) => {
  //   const tempImgs = [
  //     ...selectedImages.slice(0, idx),
  //     ...selectedImages.slice(idx + 1),
  //   ];
  //   const dataTransfer = new DataTransfer();
  //
  //   for (const file of tempImgs) {
  //     dataTransfer.items.add(file);
  //   }
  //
  //   formik.setFieldValue("documents", dataTransfer.files);
  //   setSelectedImages(tempImgs);
  // };
  //
  // const handleChange = (idx, newFile) => {
  //   const updatedImages = [...selectedImages];
  //   updatedImages[idx] = newFile;
  //
  //   const dataTransfer = new DataTransfer();
  //
  //   for (const file of updatedImages) {
  //     dataTransfer.items.add(file);
  //   }
  //
  //   formik.setFieldValue("documents", dataTransfer.files);
  //   setSelectedImages(updatedImages);
  // };

  useEffect(() => {
    if (formik.values.documents || formik.values.userImg) {
      const selectedImagesArray = formik.values.documents
        ? Array.from(formik.values.documents)
        : [];

      if (formik.values.userImg) {
        setSelectedImages([...selectedImagesArray, formik.values.userImg]);
      } else {
        setSelectedImages([...selectedImagesArray]);
      }
    }
  }, [formik.values.documents, formik.values.userImg]);

  return (
    <div className={`space-y-10`}>
      <div className="card bg-white shadow-xl">
        <div className="card-body p-4">
          <h2 className={`text-3xl`}>Add Manager</h2>
          <hr className={`my-5`} />
        </div>

        <div className="max-auto">
          <form autoComplete="off"
            className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
            onSubmit={formik.handleSubmit}
          >
            {selectedImages?.length ? (
              <div className={`relative col-span-full`}>
                <div className="swiper-controller absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-between w-full px-4 z-10">
                  <div className="swiper-er-button-prev flex justify-center items-center bg-green-slimy text-white w-6 h-6 rounded-full cursor-pointer">
                    <MdOutlineKeyboardArrowLeft />
                  </div>
                  <div className="swiper-er-button-next flex justify-center items-center bg-green-slimy text-white w-6 h-6 rounded-full cursor-pointer">
                    <MdOutlineKeyboardArrowRight />
                  </div>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    enabled: true,
                    prevEl: ".swiper-er-button-prev",
                    nextEl: ".swiper-er-button-next",
                    disabledClass: "swiper-er-button-disabled",
                  }}
                  slidesPerView={1}
                  spaceBetween={50}
                >
                  {selectedImages.length
                    ? selectedImages?.map((image, idx) => (
                        <SwiperSlide key={idx}>
                          <div className={`relative`}>
                            {/*<div*/}
                            {/*  className={`absolute top-3 right-3 space-x-1.5`}*/}
                            {/*>*/}
                            {/*  <label className="relative btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy normal-case rounded">*/}
                            {/*    <TbReplaceFilled />*/}
                            {/*    <input*/}
                            {/*      type="file"*/}
                            {/*      className="absolute left-0 top-0  overflow-hidden h-0"*/}
                            {/*      onChange={(e) =>*/}
                            {/*        handleChange(idx, e.currentTarget.files[0])*/}
                            {/*      }*/}
                            {/*    />*/}
                            {/*  </label>*/}
                            {/*  <button*/}
                            {/*    className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"*/}
                            {/*    onClick={() => handleDelete(idx)}*/}
                            {/*  >*/}
                            {/*    <FaTrash />*/}
                            {/*  </button>*/}
                            {/*</div>*/}
                            <img
                              key={idx}
                              src={URL.createObjectURL(image)}
                              alt=""
                              className={`w-full h-96 object-cover rounded`}
                            />
                          </div>
                        </SwiperSlide>
                      ))
                    : null}
                </Swiper>
              </div>
            ) : null}
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
            {/* User Name box */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="User Name"
                name="userName"
                className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.userName && Boolean(formik.errors.userName) ? (
                <small className="text-red-600">
                  {formik.touched.userName && formik.errors.userName}
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
            {/*Manager Joining Date  box */}
            <div className="flex flex-col gap-3">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                name="joiningDate"
                placeholderText={`Joining Date`}
                selected={formik.values.joiningDate}
                className={`input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full`}
                onChange={(date) => formik.setFieldValue("joiningDate", date)}
                onBlur={formik.handleBlur}
              />
              {formik.touched.joiningDate &&
              Boolean(formik.errors.joiningDate) ? (
                <small className="text-red-600">
                  {formik.touched.joiningDate && formik.errors.joiningDate}
                </small>
              ) : null}
            </div>

            {/* documents type */}
            <div className="flex flex-col gap-3">
              <select
                name="documentsType"
                className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
                value={formik.values.documentsType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" selected>
                  Type Of Documents
                </option>
                <option value="Driving License">Driving License</option>
                <option value="NID">NID</option>
                <option value="Passport">Passport</option>
              </select>
              {formik.touched.documentsType &&
              Boolean(formik.errors.documentsType) ? (
                <small className="text-red-600">
                  {formik.touched.documentsType && formik.errors.documentsType}
                </small>
              ) : null}
            </div>
            {/* Documents */}
            {formik.values.documentsType ? (
              <div className={`flex space-x-1.5`}>
                <div className="flex flex-col gap-3 w-full">
                  <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
                    {formik.values.documents ? (
                      <span>{formik.values.documents.length + " files"}</span>
                    ) : (
                      <span className={`flex items-baseline space-x-1.5`}>
                        <FaUpload />
                        <span>Choose {formik.values.documentsType}</span>
                      </span>
                    )}
                    <input
                      type="file"
                      multiple
                      name="documents"
                      className="absolute left-0 top-0  overflow-hidden h-0"
                      onChange={(e) =>
                        formik.setFieldValue("documents", e.currentTarget.files)
                      }
                      onBlur={formik.handleBlur}
                    />
                  </label>
                  {formik.touched.documents &&
                  Boolean(formik.errors.documents) ? (
                    <small className="text-red-600">
                      {formik.touched.documents && formik.errors.documents}
                    </small>
                  ) : null}
                </div>
              </div>
            ) : null}
            {/* user image box */}
            <div className="col-span-full flex flex-col gap-3">
              <label className="relative input input-md input-bordered border-gray-500/50 rounded  focus:outline-none bg-transparent flex items-center justify-center">
                {formik.values.userImg ? (
                  `Profile Image: ${formik.values.userImg.name.substring(
                    0,
                    formik.values.userImg.name.lastIndexOf("."),
                  )}`
                ) : (
                  <span
                    className={`flex justify-center items-baseline space-x-1.5`}
                  >
                    <FaUpload />
                    <span>Choose profile Photo</span>
                  </span>
                )}
                <input
                  type="file"
                  name="userImg"
                  className="absolute left-0 top-0 w-0 h-0 overflow-hidden"
                  accept="image/*"
                  onChange={(e) =>
                    formik.setFieldValue("userImg", e.currentTarget.files[0])
                  }
                  onBlur={formik.handleBlur}
                />
              </label>
              {formik.touched.userImg && Boolean(formik.errors.userImg) ? (
                <small className="text-red-600">
                  {formik.touched.userImg && formik.errors.userImg}
                </small>
              ) : null}
            </div>
            {/* <div className={`flex space-x-1.5`}>
          <div className="flex flex-col gap-3 w-full">
            <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
              {formik.values.utility ? (
                <span>{formik.values.utility.length + " files"}</span>
              ) : (
                <span className={`flex items-baseline space-x-1.5`}>
                  <FaUpload />
                  <span>Choose Utilities</span>
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                name="utility"
                className="absolute left-0 top-0  overflow-hidden h-0"
                onChange={(e) =>
                  formik.setFieldValue("utility", e.currentTarget.files)
                }
                onBlur={formik.handleBlur}
              />
            </label>
            {formik.touched.utility && Boolean(formik.errors.utility) ? (
              <small className="text-red-600">
                {formik.touched.utility && formik.errors.utility}
              </small>
            ) : null}
          </div>
        </div> */}

            {/* submit button */}
            <div className=" col-span-full text-end mb-5 ">
              <button
                type="submit"
                className=" btn btn-md  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
              >
                <span>Add</span>
                {isLoading ? (
                  <span
                    className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                    role="status"
                  ></span>
                ) : null}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddManager;
