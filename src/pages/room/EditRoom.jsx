import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaTrash, FaUpload } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { TbReplaceFilled } from "react-icons/tb";
import { Rings } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import * as yup from "yup";
import { useUploadSingleMutation } from "../../redux/baseAPI.js";
import {
  useRoomQuery,
  useUpdateRoomMutation,
} from "../../redux/room/roomAPI.js";
import { getResizedImage, handleImageUrl } from "../../utils/utils.js";

// form validation
const validationSchema = yup.object({
  price: yup.number(),
  description: yup.string().required("Description is required"),
  // .min(20, "Description at least 20 characters length"),
});

const EditRoom = () => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isLoading, data: room } = useRoomQuery(id);
  const [selectedImages, setSelectedImages] = useState([]);
  const [updateRoom] = useUpdateRoomMutation();
  const [uploadSingle] = useUploadSingleMutation();

  const formik = useFormik({
    initialValues: {
      category: "",
      type: "",
      capacity: "",
      price: "",
      floorNumber: "",
      roomNumber: "",
      bedSize: "",
      photos: [],
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const obj = { ...values };
      const images = [...selectedImages];

      for (let i = 0; i < images.length; i++) {
        if (typeof images[i] !== "string") {
          const formData = new FormData();
          const photoName = images[i].name.substring(
            0,
            images[i].name.lastIndexOf(".")
          );

          formData.append(photoName, images[i]);
          await uploadSingle(formData).then((result) =>
            images.splice(i, 1, result.data.imageUrl)
          );
        }
      }
      obj.images = images;
      obj.air_conditioned = obj.ac;
      delete obj.ac;
      delete obj.photos;

      const response = await updateRoom({ id, data: obj });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        navigate(-1);
      }

      setLoading(false);
    },
  });

  const handleDelete = (idx) => {
    const tempImgs = [
      ...selectedImages.slice(0, idx),
      ...selectedImages.slice(idx + 1),
    ];
    const dataTransfer = new DataTransfer();

    for (const file of tempImgs) {
      if (typeof file !== "string") {
        dataTransfer.items.add(file);
      }
    }

    setSelectedImages(tempImgs);
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };

  const handleChange = async (idx, newFile) => {
    if (!newFile) {
     fileInputRef.current ? (fileInputRef.current.value = '') : null;
      return;
    }
    const res = await getResizedImage(newFile);
    const updatedImages = [...selectedImages];
    updatedImages[idx] = res;
    setSelectedImages(updatedImages);
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };

  const handleImageUpload = async (e) => {
    const uploadedImage = e.currentTarget.files[0];
    if (!uploadedImage) {
     fileInputRef.current ? (fileInputRef.current.value = '') : null;
      return;
    }

    const image = await getResizedImage(uploadedImage);
    formik?.values?.photos
      ? formik.setFieldValue("photos", [...formik?.values?.photos, image])
      : formik.setFieldValue("photos", [image]);

    setSelectedImages([...selectedImages, image]);
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };

  useEffect(() => {
    if (room) {
      formik.setValues({
        category: room?.data?.category,
        type: room?.data?.type,
        capacity: room?.data?.capacity,
        price: room?.data?.price,
        bedSize: room?.data?.bedSize,
        floorNumber: room?.data?.floorNumber,
        roomNumber: room?.data?.roomNumber,
        ac: room?.data?.air_conditioned,
        description: room?.data?.description,
      });

      setSelectedImages(room?.data?.images);
    }
  }, [room]);

  const handlePrice = (e) => {
    const inputValue = e.target.value;
    const fieldName = e.target.price;
    if (inputValue >= 0) {
      // Update the Formik state
      formik.handleChange(e);
    } else if (inputValue === "") {
      e.target.value = 0;
      formik.handleChange(e);
    }
  };

  return (
    <div className={`space-y-10 bg-white p-10 rounded-2xl`}>
      <div
        className={`flex justify-between bg-green-slimy max-w-3xl mx-auto py-3 px-6 rounded`}
      >
        <h3 className={`flex text-2xl text-white space-x-1.5`}>
          <FaPencil />
          <span>Edit Room</span>
        </h3>
        <div
          className={`flex hover:text-white hover:bg-transparent border border-white items-center space-x-1.5 bg-white text-green-slimy cursor-pointer px-3 py-1 rounded transition-colors duration-500`}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back</span>
        </div>
      </div>
      {!isLoading ? (
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
              {selectedImages?.map((image, idx) => (
                <SwiperSlide key={idx} className="h-auto">
                  <div className={`relative h-full`}>
                    <div className={`absolute top-3 right-3 space-x-1.5`}>
                      <label className="relative btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy normal-case">
                        <TbReplaceFilled />
                        <input
                         ref={(el) => (fileInputRef.current = el)}
                          type="file"
                          multiple={false}
                          accept="image/*"
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
                    {typeof image === "string" ? (
                      <div className="h-full flex justify-center items-center">
                        <img
                          key={idx}
                          src={handleImageUrl(image)}
                          alt=""
                          className={`mx-auto max-h-[40em] rounded`}
                        />
                      </div>
                    ) : (
                      <div className="h-full flex justify-center items-center">
                        <img
                          key={idx}
                          src={URL.createObjectURL(image)}
                          alt=""
                          className={`mx-auto max-h-[40em] rounded`}
                        />
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
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
                name="ac"
                className="checkbox checkbox-sm"
                checked={formik.values.ac}
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
              onChange={handlePrice}
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
            {formik.touched.roomNumber && Boolean(formik.errors.roomNumber) ? (
              <small className="text-red-600">
                {formik.touched.roomNumber && formik.errors.roomNumber}
              </small>
            ) : null}
          </div>
          {/* room photos */}
          <div className={`flex space-x-1.5`}>
            <div className="flex flex-col gap-3 w-full">
              <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
                {selectedImages?.length ? (
                  <span>{selectedImages?.length + " files"}</span>
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
                  accept="image/*"
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
              disabled={loading}
              type="submit"
              className=" btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
            >
              <span>Update</span>
              {loading ? (
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
  );
};

export default EditRoom;
