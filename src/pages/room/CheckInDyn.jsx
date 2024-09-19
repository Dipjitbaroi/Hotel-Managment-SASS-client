import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import * as yup from "yup";
import {
  useAddBookingMutation,
  useGetHotelByIdQuery,
  useGetRoomsAndHotelsQuery,
  useRoomsQuery,
  useUpdateBookingMutation,
  useUpdateBookingTOCheckInMutation,
} from "../../redux/room/roomAPI.js";
import DatePicker from "react-datepicker";
import store from "../../redux/store.js";
import toast from "react-hot-toast";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { TbReplaceFilled } from "react-icons/tb";
import { FaTrash, FaUpload } from "react-icons/fa";
import { useUploadMutation } from "../../redux/baseAPI.js";
import SuspendAndLockList from "./../Admin/SuspendAndLockList";
import { useNavigate, useParams } from "react-router-dom";
import { getResizedImage } from "../../utils/utils.js";

// form validation
const validationSchema = yup.object({
  documentsType: yup.string(),
  doc_number: yup.string().when(["documentsType"], (documentsType, schema) => {
    if (documentsType?.length > 0 && !documentsType.includes(undefined)) {
      return schema.required("Document number is required");
    } else {
      return schema;
    }
  }),
  documents: yup.array().when(["documentsType"], (documentsType, schema) => {
    if (documentsType?.length > 0 && !documentsType.includes(undefined)) {
      console.log({ documentsType });
      return schema.min(1, "At least one document is required");
    } else {
      return schema;
    }
  }),
  paymentMethod: yup.string(),
  amount: yup.number(),
  transection_id: yup
    .string()
    .when(["paymentMethod"], (paymentMethod, schema) => {
      if (
        paymentMethod.includes("Card") ||
        paymentMethod.includes("Mobile_Banking")
      ) {
        return schema.required("Transaction ID is required");
      } else {
        return schema;
      }
    }),
});

const CheckInDyn = ({ data }) => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const closeRef = useRef(null);
  const [upload, { isError }] = useUploadMutation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [updateBookingTOCheckIn] = useUpdateBookingTOCheckInMutation();
  const [isLoading, setIsLoading] = useState(false);
  // handle advanceAmoun
  const handleAmount = (e) => {
    const inputValue = e.target.value;
    const fieldName = e.target.amount;

    if (inputValue >= 0) {
      // Update the Formik state
      formik.handleChange(e);
    } else if (inputValue === "") {
      e.target.value = 0;
      formik.handleChange(e);
    }
  };

  // navigate to manage checkIn page
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      amount: "",
      documentsType: "",
      doc_number: "",
      documents: [],
      paymentMethod: "",
      transection_id: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      setIsLoading(true);
      const obj = { ...values };
      let title;
      let tempImg;

      switch (obj.documentsType) {
        case "Aadhar Card":
          title = "nid";
          break;
        case "Passport":
          title = "passport";
          break;
        case "Driving Licence":
          title = "driving_lic_img";
      }
      const paidAmount =
        typeof obj.amount === "number" ? Math.ceil(obj.amount) : 0;

      const uploadedData = {
        paid_amount: paidAmount,
        status: "CheckedIn",
        paymentMethod: obj.paymentMethod,
        transection_id: obj.transection_id,
        total_unpaid_amount: Math.ceil(data?.total_unpaid_amount - paidAmount),
        remark: "Advance payment for checkIn",
        booking_id: id,
      };

      if (selectedImages?.length) {
        const formData = new FormData();

        for (let i = 0; i < obj.documents.length; i++) {
          const photoName = obj.documents[i].name.substring(
            0,
            obj.documents[i].name.lastIndexOf(".")
          );

          formData.append(photoName, obj.documents[i]);
        }

        await upload(formData).then(
          (result) => (tempImg = result.data.imageUrls)
        );
        if (!isError) {
          const response = await updateBookingTOCheckIn({
            ...uploadedData,
            doc_number: obj.doc_number,
            doc_images: {
              [title]: tempImg,
            },
          });

          if (response?.error) {
            toast.error(response.error.data.message);
          } else {
            closeRef.current.click();
            toast.success(response.data.message);
            navigate("/dashboard/manage-checkin");
          }
        } else {
          toast.error("Image is not uploaded");
        }
      } else {
        const response = await updateBookingTOCheckIn(uploadedData);

        if (response?.error) {
          toast.error(response.error.data.message);
        } else {
          closeRef.current.click();
          toast.success(response.data.message);
          navigate("/dashboard/manage-checkin");
        }
      }
      setIsLoading(false);
    },
  });
  const handlePaymentChange = (e) => {
    const paymentMethod = e.target.value;
    if (paymentMethod === "Card" || paymentMethod === "Mobile_Banking") {
      formik.setFieldValue("paymentMethod", paymentMethod);
    } else {
      formik.setFieldValue("paymentMethod", paymentMethod);
      formik.setFieldValue("transection_id", "");
    }
  };
  const handleDelete = (idx) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(idx, 1);

    formik.setFieldValue("documents", updatedImages);
    setSelectedImages(updatedImages);
    fileInputRef.current ? (fileInputRef.current.value = "") : null;
  };

  const handleChange = async (idx, newFile) => {
    if (!newFile) {
      fileInputRef.current ? (fileInputRef.current.value = "") : null;
      return;
    }
    const res = await getResizedImage(newFile);
    const updatedImages = [...selectedImages];
    updatedImages[idx] = res;
    formik.setFieldValue("documents", updatedImages);
    setSelectedImages(updatedImages);
    fileInputRef.current ? (fileInputRef.current.value = "") : null;
  };
  const handleImageUpload = async (e) => {
    const selectedImage = e.currentTarget.files[0];
    if (!selectedImage) {
      fileInputRef.current ? (fileInputRef.current.value = "") : null;
      return;
    }

    const image = await getResizedImage(selectedImage);
    formik.setFieldValue(
      "documents",
      formik.values.documents?.length
        ? [...formik.values.documents, image]
        : [image]
    );

    setSelectedImages([...selectedImages, image]);
    fileInputRef.current ? (fileInputRef.current.value = "") : null;
  };

  useEffect(() => {
    if (formik.values.documents) {
      const selectedImagesArray = Array.from(formik.values.documents);
      setSelectedImages(selectedImagesArray);
    }
  }, [formik.values.documents]);

  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          ref={closeRef}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => formik.handleReset()}
        >
          ✕
        </button>
      </form>
      <div>
        <h3 className={`text-2xl font-semibold mb-3`}>
          Check In ({data?.guestName})
        </h3>
        <hr />
        {/* <div className="mt-4">
     <h1 className="mb-2"> Room Rent : <span className="font-semibold">{data?.rent_per_day}</span></h1>
      
      <h1> Paid Amount : <span className="font-semibold">{data?.paid_amount}</span> </h1>
     </div> */}
        <form
          autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 mt-5"
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
                  ? selectedImages.map((image, idx) => (
                      <SwiperSlide className="h-auto">
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
                          <div className="flex items-center justify-center h-full">
                            <img
                              key={idx}
                              src={URL.createObjectURL(image)}
                              alt=""
                              className={`w-full max-h-[40em]  rounded`}
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : null}
              </Swiper>
            </div>
          ) : null}
          <div className="flex flex-col gap-3">
            <select
              name="paymentMethod"
              className="select select-md bg-transparent select-bordered border-gray-500/50 rounded w-full focus:outline-none"
              value={formik.values.paymentMethod}
              onChange={handlePaymentChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Payment Method
              </option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Mobile_Banking">Mobile Banking</option>
              <option value="Oyo">Oyo</option>
              <option value="Fab">Fab</option>
            </select>
            {formik.touched.paymentMethod &&
            Boolean(formik.errors.paymentMethod) ? (
              <small className="text-red-600">
                {formik.touched.paymentMethod && formik.errors.paymentMethod}
              </small>
            ) : null}
          </div>
          {formik.values.paymentMethod.length ? (
            <div className="flex flex-col gap-3">
              <input
                onWheel={(event) => event.currentTarget.blur()}
                type="number"
                placeholder="Advanced Amount"
                name="amount"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
                value={formik.values.amount}
                onChange={handleAmount}
                onBlur={formik.handleBlur}
              />
            </div>
          ) : (
            <></>
          )}
          {formik.values.paymentMethod === "Card" ||
          formik.values.paymentMethod === "Mobile_Banking" ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="transaction Id"
                name="transection_id"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
                value={formik.values.transection_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.transection_id &&
              Boolean(formik.errors.transection_id) ? (
                <small className="text-red-600">
                  {formik.touched.transection_id &&
                    formik.errors.transection_id}
                </small>
              ) : null}
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-3">
            <select
              name="documentsType"
              className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
              value={formik.values.documentsType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Type Of Documents
              </option>
              <option value="Aadhar Card">Aadhar Card/ ID</option>
              <option value="Passport">Passport</option>
              <option value="Driving Licence">Driving Licence</option>
            </select>
            {formik.touched.documentsType &&
            Boolean(formik.errors.documentsType) ? (
              <small className="text-red-600">
                {formik.touched.documentsType && formik.errors.documentsType}
              </small>
            ) : null}
          </div>
          {formik.values.documentsType ? (
            <>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Document Number"
                  name="doc_number"
                  className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
                  value={formik.values.doc_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.doc_number &&
                Boolean(formik.errors.doc_number) ? (
                  <small className="text-red-600">
                    {formik.touched.doc_number && formik.errors.doc_number}
                  </small>
                ) : null}
              </div>
              <div className={`flex space-x-1.5`}>
                <div className="flex flex-col gap-3 w-full">
                  <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
                    {formik.values.documents ? (
                      <span>{formik.values.documents.length + " files"}</span>
                    ) : (
                      <span className={`flex items-baseline space-x-1.5`}>
                        <FaUpload />
                        <span>Choose documents</span>
                      </span>
                    )}
                    <input
                      ref={(el) => (fileInputRef.current = el)}
                      type="file"
                      multiple={false}
                      accept="image/*"
                      name="documents"
                      className="absolute left-0 top-0  overflow-hidden h-0"
                      onChange={handleImageUpload}
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
            </>
          ) : null}

          {/* button */}
          <div className={`flex justify-between`}>
            <button
              disabled={isLoading}
              type={"submit"}
              className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
            >
              Confirm
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
    </>
  );
};

export default CheckInDyn;
