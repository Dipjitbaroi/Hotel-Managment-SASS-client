import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { TbReplaceFilled } from "react-icons/tb";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import * as yup from "yup";
import imgPlaceHolder from "../../assets/img-placeholder.jpg";
import { useAddSubAdminMutation } from "../../redux/admin/subadmin/subadminAPI.js";
import { useUploadMutation } from "../../redux/baseAPI.js";
import { Link } from "react-router-dom";
import { getResizedImage } from "../../utils/utils.js";

// form validation
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  phoneNumber: yup.string().required("Phone is required"),
  emergency_contact: yup.string().required("Emergency contact is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  address: yup.string().required("Address is required"),
  salary: yup
    .number()
    .required("Salary is required")
    .positive("Salary must be a positive number")
    .integer("Salary must be an integer"),
  joiningDate: yup.string().required("Joining date is required"),
  documentsType: yup.string().required("Type of documents are required"),
  documents: yup.mixed().when(["documentsType"], ([documentsType], schema) => {
    if (documentsType)
      return schema.required(
        `${
          documentsType === "NID" ? "Aadhaar Card / ID" : documentsType
        } are required`
      );
    else return schema;
  }),
});

const AddSubAdmin = () => {
  const fileInputRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const [upload, { isError }] = useUploadMutation();
  const [addSubAdmin] = useAddSubAdminMutation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      phoneNumber: "",
      email: "",
      emergency_contact: "",
      password: "",
      address: "",
      salary: "",
      joiningDate: "",
      documentsType: "",
      documents: [],
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      setLoading(true);

      const formData = new FormData();
      const obj = { ...values };
      const {
        name,
        username,
        phoneNumber: phone_no,
        email,
        emergency_contact,
        password,
        address,
        salary,
        joiningDate: joining_date,
        documentsType,
        documents,
      } = obj;

      for (let i = 0; i < documents.length; i++) {
        const photoName = documents[i].name.substring(
          0,
          documents[i].name.lastIndexOf(".")
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

      if (!isError) {
        const response = await addSubAdmin({
          name,
          username,
          role: "subadmin",
          phone_no,
          emergency_contact,
          email,
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
      } else {
        toast.error("Image is not uploaded");
      }

      setLoading(false);
    },
  });

  const handleDelete = (idx) => {
    const tempImgs = [
      ...selectedImages.slice(0, idx),
      ...selectedImages.slice(idx + 1),
    ];

    formik.setFieldValue("documents", tempImgs);
    setSelectedImages(tempImgs);
    fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };

  const handleChange = async (idx, newFile) => {
    if (newFile) {
      const res = await getResizedImage(newFile);
      const updatedImages = [...selectedImages];
      updatedImages[idx] = res;

      formik.setFieldValue("documents", updatedImages);
      setSelectedImages(updatedImages);
      fileInputRef.current ? (fileInputRef.current.value = '') : null;
    }
  };
  const handleUploadImage = async (e) => {
    const uploadedFile = e.currentTarget.files[0];
    if (uploadedFile) {
      const res = await getResizedImage(uploadedFile);
      formik.setFieldValue("documents", [...formik.values.documents, res]);
      setSelectedImages((prev) => [...prev, res]);
    }
    fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };
  return (
    <div className={`space-y-10`}>
      <div className="card bg-white shadow-xl">
        <div className="card-body p-4">
          <div>
            <Link to={`/dashboard `}>
              <button
                type="button"
                className="text-white bg-green-slimy  font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1 "
              >
                <dfn>
                  <abbr title="Back">
                    <FaArrowLeft />
                  </abbr>
                </dfn>

                <span className="tracking-wider font-semibold text-[1rem]"></span>
              </button>
            </Link>
          </div>
          <div>
            <h2 className="bg-green-slimy text-2xl text-center text-white max-w-[47rem]  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 mt-4">
              Add Sub Admin
            </h2>
            <hr className={`my-5`} />
          </div>
        </div>

        <div className="max-auto pb-5">
          <form
            autoComplete="off"
            className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto p-3"
            onSubmit={formik.handleSubmit}
          >
            {selectedImages.length ? (
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
                  {selectedImages.length ? (
                    selectedImages.map((image, idx) => (
                      <SwiperSlide key={idx} className="h-auto">
                        <div className={`relative h-full`}>
                          <div className={`absolute top-3 right-3 space-x-1.5`}>
                            <label className="relative btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy normal-case rounded">
                              <TbReplaceFilled />
                              <input
                                ref={(el) => (fileInputRef.current = el)}
                                type="file"
                                className="absolute left-0 top-0  overflow-hidden h-0"
                                onChange={(e) =>
                                  handleChange(idx, e.currentTarget.files[0])
                                }
                              />
                            </label>
                            <button
                              type="button"
                              className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
                              onClick={() => handleDelete(idx)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <div className="h-full flex justify-center items-center">
                            <img
                              key={idx}
                              src={URL.createObjectURL(image)}
                              alt=""
                              className={`mx-auto max-h-[40em] rounded`}
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <img
                      src={imgPlaceHolder}
                      alt=""
                      className={`w-full h-96 object-cover rounded`}
                    />
                  )}
                </Swiper>
              </div>
            ) : null}
            {/* Sub Admin Name box */}
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
            {/* Sub Admin UserName box */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Username"
                name="username"
                className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && Boolean(formik.errors.username) ? (
                <small className="text-red-600">
                  {formik.touched.username && formik.errors.username}
                </small>
              ) : null}
            </div>
            {/*Sub Admin Phone Number  box */}
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
            {/*Emergency Contact*/}
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
            {/*Sub Admin Email box */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Email"
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

            {/* Sub Admin Password box */}
            <div className={`flex flex-col gap-3 `}>
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

            {/* Sub Admin Address box */}
            <div className="col-span-full flex flex-col gap-3">
              <textarea
                placeholder="Address"
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

            {/*Sub Admin salary  box */}
            <div className="flex flex-col gap-3">
              <input
                onWheel={(event) => event.currentTarget.blur()}
                type="number"
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
            {/*Sub Admin Joining Date  box */}
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
            {/* documents type box */}
            <div className={`flex flex-col gap-3`}>
              <select
                name="documentsType"
                className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
                value={formik.values.documentsType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" selected disabled>
                  Type of Documents
                </option>
                <option value="NID">Aadhaar Card / ID</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
              {formik.touched.documentsType &&
              Boolean(formik.errors.documentsType) ? (
                <small className="text-red-600">
                  {formik.touched.documentsType && formik.errors.documentsType}
                </small>
              ) : null}
            </div>

            {/* documents box */}
            {formik.values.documentsType ? (
              <div className={`flex space-x-1.5`}>
                <div className="flex flex-col gap-3 w-full">
                  <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
                    {formik.values.documents ? (
                      <span>{formik.values.documents.length + " files"}</span>
                    ) : (
                      <span className={`flex items-baseline space-x-1.5`}>
                        <FaUpload />
                        <span>Choose Documents</span>
                      </span>
                    )}
                    <input
                     ref={(el) => (fileInputRef.current = el)}
                      type="file"
                      accept="image/*"
                      name="documents"
                      className="absolute left-0 top-0  overflow-hidden h-0"
                      onChange={handleUploadImage}
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

            {/* submit button */}
            <div className="col-span-full text-end">
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
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

export default AddSubAdmin;
