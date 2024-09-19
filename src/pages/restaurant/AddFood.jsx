import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaPlus,
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
import { useUploadMutation } from "../../redux/baseAPI.js";
import {
  useAddFoodMutation,
  useGetCategoryQuery,
} from "../../redux/restaurant/foodAPI.js";
import { useSelector } from "react-redux";
import { useGetRoomsAndHotelsQuery } from "../../redux/room/roomAPI.js";
import { Rings } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { getResizedImage } from "../../utils/utils.js";

// form validation
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  category: yup.string().required("Category is required"),
  surveyorQuantity: yup.string().required("Surveyor quantity is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .integer("Price must be an integer"),
  description: yup.string().required("Description is required"),
  // .min(10, "Description at least 20 characters length"),
  photos: yup.array().test("fileCount", "Photo is required", (value) => {
    return value && value.length > 0;
  }),
});

const AddFood = () => {
  const fileInputRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const [addFood] = useAddFoodMutation();
  const {
    data: categories,
    isLoading: categoryLoading,
    isError,
  } = useGetCategoryQuery();
  const [upload, { isError: isImageError }] = useUploadMutation();
  const [selectedImages, setSelectedImages] = useState([]);
  const { user } = useSelector((store) => store.authSlice);
  const { data: hotelList } = useGetRoomsAndHotelsQuery();
  const [showPass, setShowPass] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      photos: [],
      surveyorQuantity: "",
      surveyorQuantityOthers: "",
      chooseHotel: "",
      category: "",
      categoryOthers: "",
      typeOfAlcohol: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      setLoading(true);

      const obj = { ...values };
      const {
        category,
        categoryOthers,
        name: food_name,
        price,
        description,
        surveyorQuantity: serveyor_quantity,
        photos,
        typeOfAlcohol: type_of_alcohol,
        password,
      } = obj;

      const formData = new FormData();

      for (let i = 0; i < photos.length; i++) {
        const photoName = photos[i].name.substring(
          0,
          photos[i].name.lastIndexOf(".")
        );

        formData.append(photoName, photos[i]);
      }

      await upload(formData).then(
        (result) => (obj.images = result.data.imageUrls)
      );
      if (!isImageError) {
        const response = await addFood({
          category: category === "Others" ? categoryOthers : category,
          food_name,
          price,
          description,
          serveyor_quantity:
            serveyor_quantity === "Others"
              ? surveyorQuantityOthers
              : serveyor_quantity,
          images: obj.images,
          type_of_alcohol,
          password,
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

  // Image delete
  const handleDelete = (idx) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(idx, 1);

    formik.setFieldValue("photos", updatedImages);
    setSelectedImages(updatedImages);
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };

  // HandleChange
  const handleChange = async (idx, newFile) => {
    if (!newFile) return;
    const res = await getResizedImage(newFile);
    const updatedImages = [...selectedImages];
    updatedImages[idx] = res;
    formik.setFieldValue("photos", updatedImages);
    setSelectedImages(updatedImages);
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };
  const handleImageUpload = async (e) => {
    const selectedImage = e.currentTarget.files[0];
    if (!selectedImage) return;

    const image = await getResizedImage(selectedImage);
    formik.setFieldValue(
      "photos",
      formik.values.photos?.length ? [...formik.values.photos, image] : [image]
    );

    setSelectedImages([...selectedImages, image]);
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
  };

  const predefinedOptions = [
    { key: "", value: "", label: "Category" },
    { key: "Liquor", value: "Liquor", label: "Liquor" },
    { key: "Rice", value: "Rice", label: "Rice" },
    { key: "Full Meal", value: "Full Meal", label: "Full Meal" },
    { key: "Snacks", value: "Snacks", label: "Snacks" },
    { key: "Drinks", value: "Drinks", label: "Drinks" },
    { key: "Deserts", value: "Deserts", label: "Deserts" },
    { key: "Juices", value: "Juices", label: "Juices" },
    {
      key: "Vegetarian Meals",
      value: "Vegetarian Meals",
      label: "Vegetarian Meals",
    },
    { key: "Curries", value: "Curries", label: "Curries" },
  ];
  const combinedArray =
    categoryLoading || isError
      ? [...predefinedOptions]
      : [
          ...predefinedOptions,
          ...categories?.data?.map((category) => {
            const categoryExists = predefinedOptions.find(
              (option) =>
                option.value === category.category_name &&
                option.label === category.category_name
            );
            if (categoryExists) {
              return null;
            }
            return {
              key: category?._id,
              value: category?.category_name,
              label: category?.category_name,
            };
          }),
        ].filter((item) => item !== null);
  if (categoryLoading) {
    return (
      <Rings
        width="50"
        height="50"
        color="#37a000"
        wrapperClass="justify-center"
      />
    );
  }
  return (
    <>
      <div className="mb-7">
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
      <div className={`max-w-xl bg-white rounded-2xl mx-auto p-8`}>
        <div
          className={`flex justify-between bg-green-slimy max-w-3xl mx-auto py-3 px-6 rounded`}
        >
          <h3 className={`flex text-2xl text-white space-x-1.5`}>
            <FaPlus />
            <span>Add Food / Beverage</span>
          </h3>
        </div>
        <form
          autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 mt-5"
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
                selectedImages?.map((image, idx) => (
                  <SwiperSlide key={idx} className="h-auto">
                    <div className={`relative h-full`}>
                      <div className={`absolute top-3 right-3 space-x-1.5`}>
                        <label className="relative btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy normal-case rounded">
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
                      <div className="h-full max-h-[40em] flex justify-center items-center">
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
          <div className="flex flex-col gap-3">
            <select
              name="category"
              className="select select-md bg-transparent select-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {[
                ...combinedArray,
                { key: "Others", value: "Others", label: "Others" },
              ]?.map((option) => (
                <option
                  key={option.key}
                  value={option.value}
                  disabled={option === "Category" ? true : false}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {formik.touched.category && Boolean(formik.errors.category) ? (
              <small className="text-red-600">
                {formik.touched.category && formik.errors.category}
              </small>
            ) : null}
          </div>
          {formik.values.category && formik.values.category === "Others" ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Write your category"
                name="categoryOthers"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
                value={formik.values.categoryOthers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.categoryOthers &&
              Boolean(formik.errors.categoryOthers) ? (
                <small className="text-red-600">
                  {formik.touched.categoryOthers &&
                    formik.errors.categoryOthers}
                </small>
              ) : null}
            </div>
          ) : null}
          {/*{formik.values.category && formik.values.category === "Liquor" ? (*/}
          {/*  <div className="flex flex-col gap-3">*/}
          {/*    <input*/}
          {/*      type="text"*/}
          {/*      placeholder="Type of Alcohol"*/}
          {/*      name="typeOfAlco"*/}
          {/*      className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"*/}
          {/*      value={formik.values.typeOfAlco}*/}
          {/*      onChange={formik.handleChange}*/}
          {/*      onBlur={formik.handleBlur}*/}
          {/*    />*/}
          {/*    /!*{formik.touched.categoryOthers &&*!/*/}
          {/*    /!*Boolean(formik.errors.categoryOthers) ? (*!/*/}
          {/*    /!*    <small className="text-red-600">*!/*/}
          {/*    /!*      {formik.touched.categoryOthers && formik.errors.categoryOthers}*!/*/}
          {/*    /!*    </small>*!/*/}
          {/*    /!*) : null}*!/*/}
          {/*  </div>*/}
          {/*) : null}*/}
          <div className="flex flex-col gap-3">
            <input
              type="text"
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
          {formik.values.category === "Liquor" ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Type of alcohol"
                name="typeOfAlcohol"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
                value={formik.values.typeOfAlcohol}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && Boolean(formik.errors.name) ? (
                <small className="text-red-600">
                  {formik.touched.name && formik.errors.name}
                </small>
              ) : null}
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-3">
            {formik.values.category === "Liquor" ? (
              <select
                name="surveyorQuantity"
                className="select select-md bg-transparent select-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                value={formik.values.surveyorQuantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" selected disabled>
                  Surveyor Quantity
                </option>
                <option value="30 ml Peg">30 ML Peg</option>
                <option value="60 ml Peg">60 ML Peg</option>
                <option value="Cans">Cans</option>
                <option value="Bear Bottle">Bear Bottle</option>
                <option value="Quarter Bottle">Quarter Bottle</option>
                <option value="Half Bottle">Half Bottle</option>
                <option value="Full Bottle">Full Bottle</option>
                <option value="Others">Others</option>
              </select>
            ) : (
              <input
                type="text"
                placeholder="Surveyor Quantity"
                name="surveyorQuantity"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
                value={formik.values.surveyorQuantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            )}
            {formik.touched.surveyorQuantity &&
            Boolean(formik.errors.surveyorQuantity) ? (
              <small className="text-red-600">
                {formik.touched.surveyorQuantity &&
                  formik.errors.surveyorQuantity}
              </small>
            ) : null}
          </div>
          {formik.values.surveyorQuantity &&
          formik.values.surveyorQuantity === "Others" ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Write your surveyor quantity"
                name="surveyorQuantityOthers"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
                value={formik.values.surveyorQuantityOthers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.surveyorQuantityOthers &&
              Boolean(formik.errors.surveyorQuantityOthers) ? (
                <small className="text-red-600">
                  {formik.touched.surveyorQuantityOthers &&
                    formik.errors.surveyorQuantityOthers}
                </small>
              ) : null}
            </div>
          ) : null}
          {/* Price box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Price"
              name="price"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
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
          {/* photo box */}
          <div className={`flex space-x-1.5`}>
            <div className="flex flex-col gap-3 w-full">
              <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
                {formik.values.photos ? (
                  <span>{formik.values.photos.length + " files"}</span>
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
          {/* Description */}
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
          {formik.values.category && formik.values.category === "Liquor" ? (
            <div className={`flex flex-col gap-3`}>
              <div className={`relative`}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
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
          ) : null}
          {/* button */}
          <div className={`flex justify-between`}>
            <button
              disabled={isLoading}
              type={"submit"}
              className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
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
    </>
  );
};

export default AddFood;
