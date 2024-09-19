import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlusCircle, FaTrash, FaUpload } from "react-icons/fa";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { TbReplaceFilled } from "react-icons/tb";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import * as yup from "yup";
import imgPlaceHolder from "../../assets/img-placeholder.jpg";
import { useUploadMutation } from "../../redux/baseAPI.js";
import {
  useAddRoomMutation,
  useGetRoomsAndHotelsQuery,
} from "../../redux/room/roomAPI.js";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";
import { getResizedImage, resizeFile } from "../../utils/utils.js";
import Swal from "sweetalert2";
import axios from "axios";

// form validation
const validationSchema = yup.object({
  category: yup.string().required("Category is required"),
  type: yup.string().required("Type is required"),
  capacity: yup.string().required("Capacity is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .integer("Price must be an integer"),
  bedSize: yup.string().required("Bed size is required"),
  floorNumber: yup
    .number()
    .required("Floor number is required")
    .positive("Floor number must be a positive")
    .integer("Floor number must be an integer"),
  roomNumber: yup
    .number()
    .required("Room number is required")
    .positive("Room number must be a positive")
    .integer("Room number must be an integer"),
  photos: yup.array().test("fileCount", "Photo is required", (value) => {
    return value && value.length > 0;
  }),
  description: yup.string().required("Description is required"),
  // .min(10, "Description at least 10 characters length"),
  // hotel_id: yup.string().required("Choose hotel is required"),
});
const chunkSize = 1024 * 1024;
const AddRoom = () => {
  const fileInputRef = useRef(null);
  // const navigate = useNavigate();
  const { user } = useSelector((store) => store.authSlice);

  const [isLoading, setLoading] = useState(false);

  const { data: hotelsList, isLoading: loading } = useGetRoomsAndHotelsQuery();

  const [addRoom] = useAddRoomMutation();
  const [upload, { isError, error }] = useUploadMutation();
  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    initialValues: {
      // hotel_id: "",
      category: "",
      type: "",
      capacity: "",
      price: "",
      bedSize: "",
      floorNumber: "",
      roomNumber: "",
      photos: [],
      description: "",
      air_conditioned: false,
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      setLoading(true);

      ///upload

      const obj = { ...values };
      const formData = new FormData();

      for (let i = 0; i < selectedImages.length; i++) {
        const photoName = selectedImages[i].name.substring(
          0,
          selectedImages[i].name.lastIndexOf(".")
        );

        formData.append(photoName, selectedImages[i]);
      }

      // obj.hotel_id = user.assignedHotel;
      obj.air_conditioned = obj.ac;
      delete obj.photos;
      delete obj.ac;
      await upload(formData).then(
        (result) => (obj.images = result.data.imageUrls)
      );
      if (!isError) {
        const response = await addRoom(obj);

        if (response?.error) {
          toast.error(response.error.data.message);
        } else {
          toast.success(response.data.message);
          formikHelpers.resetForm();
          setSelectedImages([]);
        }

        setLoading(false);
      } else {
        toast.error("Image is not uploaded");
        setLoading(false);
      }
    },
  });

  const handleImageUpload = async (e) => {
    const selectedImage = e.currentTarget.files[0];

    if (!selectedImage) {
      fileInputRef.current ? (fileInputRef.current.value = "") : null;
      return;
    }

    const image = await getResizedImage(selectedImage);
    formik.setFieldValue("photos", [...formik.values.photos, image]);

    setSelectedImages([...selectedImages, image]);
    fileInputRef.current ? (fileInputRef.current.value = "") : null;
  };

  // Image delete
  const handleDelete = (idx) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(idx, 1);

    formik.setFieldValue("photos", updatedImages);
    setSelectedImages(updatedImages);
    fileInputRef.current ? (fileInputRef.current.value = "") : null;
  };

  // HandleChange
  const handleChange = async (idx, newFile) => {
    if (!newFile) {
      fileInputRef.current ? (fileInputRef.current.value = "") : null;
      return;
    }
    const res = await getResizedImage(newFile);
    const updatedImages = [...selectedImages];
    updatedImages[idx] = res;
    formik.setFieldValue("photos", updatedImages);
    setSelectedImages(updatedImages);
    fileInputRef.current ? (fileInputRef.current.value = "") : null;
  };

  return (
    <>
      <div className={`space-y-10`}>
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <div className="mb-8">
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
            {/* add room */}
            <div className="w-full">
              <h3
                className={`flex bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7`}
              >
                <FaPlusCircle />
                <span>Add Room</span>
              </h3>
            </div>

            <form
              autoComplete="off"
              className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full mx-auto"
              onSubmit={formik.handleSubmit}
            >
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
                          <div
                            className={`absolute top-3 right-3 space-x-1.5 `}
                          >
                            <label className="relative btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy normal-case rounded">
                              <TbReplaceFilled />
                              <input
                               ref={(el) => (fileInputRef.current = el)}
                                type="file"
                                accept="image/*"
                                className="absolute left-0 top-0  overflow-hidden h-0"
                                multiple={false}
                                onChange={(e) =>
                                  handleChange(idx, e.currentTarget.files[0])
                                }
                              />
                            </label>
                            <button
                              className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
                              onClick={() => handleDelete(idx)}
                              type="button"
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

              {/* category box */}
              <div className="flex flex-col gap-3">
                <select
                  name="category"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" selected disabled>
                    Category
                  </option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Super_Deluxe">Super Deluxe</option>
                  <option value="President_Suite">President Suite</option>
                </select>
                {formik.touched.category && Boolean(formik.errors.category) ? (
                  <small className="text-red-600">
                    {formik.touched.category && formik.errors.category}
                  </small>
                ) : null}
              </div>

              {/* type box */}
              <div className="flex flex-col gap-3">
                <select
                  name="type"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" selected disabled>
                    Type
                  </option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Twin">Twin</option>
                </select>
                {formik.touched.type && Boolean(formik.errors.type) ? (
                  <small className="text-red-600">
                    {formik.touched.type && formik.errors.type}
                  </small>
                ) : null}
              </div>
              <div className="flex flex-col gap-3">
                <label className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy space-x-1.5 flex items-center">
                  <input
                    type="checkbox"
                    name="air_conditioned"
                    className="checkbox checkbox-sm"
                    checked={formik.values.air_conditioned}
                    onChange={formik.handleChange}
                  />
                  <span className="label-text">AC?</span>
                </label>
              </div>
              {/* capacity box */}
              <div className="flex flex-col gap-3">
                <select
                  name="capacity"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" selected disabled>
                    Capacity
                  </option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
                {formik.touched.capacity && Boolean(formik.errors.capacity) ? (
                  <small className="text-red-600">
                    {formik.touched.capacity && formik.errors.capacity}
                  </small>
                ) : null}
              </div>
              {/* price box */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Price"
                  name="price"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.price && Boolean(formik.errors.price) ? (
                  <small className="text-red-600">
                    {formik.touched.price && formik.errors.price}
                  </small>
                ) : null}
              </div>
              {/* bed size box */}
              <div className="flex flex-col gap-3">
                <select
                  name="bedSize"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.bedSize}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" selected disabled>
                    Bed Size
                  </option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="King">King</option>
                </select>
                {formik.touched.bedSize && Boolean(formik.errors.bedSize) ? (
                  <small className="text-red-600">
                    {formik.touched.bedSize && formik.errors.bedSize}
                  </small>
                ) : null}
              </div>
              {/* floor number box */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Floor Number"
                  name="floorNumber"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.floorNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.floorNumber &&
                Boolean(formik.errors.floorNumber) ? (
                  <small className="text-red-600">
                    {formik.touched.floorNumber && formik.errors.floorNumber}
                  </small>
                ) : null}
              </div>
              {/* room number box */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Room Number"
                  name="roomNumber"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.roomNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.roomNumber &&
                Boolean(formik.errors.roomNumber) ? (
                  <small className="text-red-600">
                    {formik.touched.roomNumber && formik.errors.roomNumber}
                  </small>
                ) : null}
              </div>
              {/* room photos */}
              <div className={`flex space-x-1.5`}>
                <div className="flex flex-col gap-3 w-full">
                  <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
                    {selectedImages.length ? (
                      <span>{selectedImages.length + " files"}</span>
                    ) : (
                      <span className={`flex items-baseline space-x-1.5`}>
                        <FaUpload />
                        <span>Choose photos</span>
                      </span>
                    )}
                    <input
                     ref={(el) => (fileInputRef.current = el)}
                      type="file"
                      multiple={false}
                      name="photos"
                      className="absolute left-0 top-0  overflow-hidden h-0"
                      onChange={handleImageUpload}
                      onBlur={formik.handleBlur}
                    />
                  </label>
                  {formik.touched.photos && Boolean(formik.errors.photos) ? (
                    <small className="text-red-600">
                      {formik.touched.photos && formik.errors.photos}
                    </small>
                  ) : null}
                </div>
              </div>
              <div className="col-span-full flex flex-col gap-3">
                <textarea
                  placeholder="Description"
                  name="description"
                  className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description &&
                Boolean(formik.errors.description) ? (
                  <small className="text-red-600">
                    {formik.touched.description && formik.errors.description}
                  </small>
                ) : null}
              </div>
              {/* submit button */}
              <div className=" col-span-full text-end mt-5">
                <button
                  disabled={isLoading}
                  type="submit"
                  className=" btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
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
    </>
  );
};

export default AddRoom;
