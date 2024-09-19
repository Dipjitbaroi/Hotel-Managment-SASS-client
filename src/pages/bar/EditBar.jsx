import { useFormik } from "formik";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useUpdateInventoryMutation } from "../../redux/inventory/inventoryAPI.js";

// form validation
const validationSchema = yup.object({
  brandName: yup.string().required("Brand Name is required"),
  typeOfAlcohol: yup.string().required("Type Of Alcohol is required"),
  status: yup.string().required("Type Of Alcohol is required"),
  surveyorQuantity: yup
  .number()
  .required("Quantity is required")
  .positive("Quantity must be a positive number")
  .integer("Quantity must be an integer"),
  totalQuantity: yup
  .number()
  .required("Total Quantity is required")
  .positive("Total Quantity must be a positive number")
  .integer("Total Quantity must be an integer"),
  ItemPrice: yup.string().required("Price is required"),
  weightPerBottle: yup.string().required("weight Per Bottle is required"),
 
  itemDescription: yup
    .string()
    .required("Description is required")
    .min(20, "Description at least 20 characters length"),
  
});

const EditBar = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const [updateInventory] = useUpdateInventoryMutation()
  const formik = useFormik({
    initialValues: {
      brandName: "",
      typeOfAlcohol: "",
      status: "",
      surveyorQuantity: "",
      totalQuantity: "",
      ItemPrice: "",
      weightPerBottle: "",
      itemDescription: "",
    },
    validationSchema,
    onSubmit: (values) => {
      },
  });

  return (
    <div className={`space-y-10 bg-white p-10 rounded-2xl`}>
      <div
        className={`flex justify-between bg-green-slimy max-w-3xl mx-auto py-3 px-6 rounded`}
      >
        <h3 className={`flex text-2xl text-white space-x-1.5`}>
          <FaPencil />
          <span>Edit Bar</span>
        </h3>
        <div
          className={`flex hover:text-white hover:bg-transparent border border-white items-center space-x-1.5 bg-white text-green-slimy cursor-pointer px-3 py-1 rounded transition-colors duration-500`}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back</span>
        </div>
      </div>
      <form autoComplete="off"
    
    className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
    onSubmit={formik.handleSubmit}
  >
    {/* Brand Name */}
    <div className="flex flex-col gap-5">
      <input
        type="text"
        placeholder="Brand Name"
        name="brandName"
        className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
        value={formik.values.brandName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.brandName && Boolean(formik.errors.brandName) ? (
        <small className="text-red-600">
          {formik.touched.brandName && formik.errors.brandName}
        </small>
      ) : null}
    </div>

    {/* Type Of Alcohol Pack */}
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Type Of Alcohol"
        name="typeOfAlcohol"
        className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
        value={formik.values.typeOfAlcohol}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.typeOfAlcohol &&
      Boolean(formik.errors.typeOfAlcohol) ? (
        <small className="text-red-600">
          {formik.touched.typeOfAlcohol && formik.errors.typeOfAlcohol}
        </small>
      ) : null}
    </div>
          {/* Status */}
          <div className="flex flex-col gap-3">
            <select
              name="status"
              className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Status
              </option>
              <option value=" available">Available</option>
              <option value="notavailable">Not Available </option>
             
            </select>
            {formik.touched.status && Boolean(formik.errors.status) ? (
              <small className="text-red-600">
                {formik.touched.status && formik.errors.status}
              </small>
            ) : null}
          </div>
    {/* surveyor Quantity */}
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="surveyor Quantity"
        name="surveyorQuantity"
        className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
        value={formik.values.surveyorQuantity}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.surveyorQuantity &&
      Boolean(formik.errors.surveyorQuantity) ? (
        <small className="text-red-600">
          {formik.touched.surveyorQuantity && formik.errors.surveyorQuantity}
        </small>
      ) : null}
    </div>
    {/* Total Quantity */}
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Total Quantity"
        name="totalQuantity"
        className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
        value={formik.values.totalQuantity}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.totalQuantity &&
      Boolean(formik.errors.totalQuantity) ? (
        <small className="text-red-600">
          {formik.touched.totalQuantity && formik.errors.totalQuantity}
        </small>
      ) : null}
    </div>
    {/* Item Price */}
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Price"
        name="ItemPrice"
        className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
        value={formik.values.ItemPrice}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.ItemPrice &&
      Boolean(formik.errors.ItemPrice) ? (
        <small className="text-red-600">
          {formik.touched.ItemPrice && formik.errors.ItemPrice}
        </small>
      ) : null}
    </div>
    {/* Weight Per Price */}
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder=" Weight Per Bottle"
        name="weightPerBottle"
        className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
        value={formik.values.weightPerBottle}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.weightPerBottle &&
      Boolean(formik.errors.weightPerBottle) ? (
        <small className="text-red-600">
          {formik.touched.weightPerBottle && formik.errors.weightPerBottle}
        </small>
      ) : null}
    </div>

 
    
    {/* item Description */}
    <div className="col-span-full flex flex-col gap-3">
      <textarea
        placeholder="Item Description"
        name="itemDescription"
        className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
        value={formik.values.itemDescription}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.itemDescription &&
      Boolean(formik.errors.itemDescription) ? (
        <small className="text-red-600">
          {formik.touched.itemDescription && formik.errors.itemDescription}
        </small>
      ) : null}
    </div>
    {/* submit button */}
    <div className=" col-span-full text-end mt-5 ">
      <button
        type="submit"
        className=" btn btn-md  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
      >
        Update
      </button>
    </div>
  </form>
    </div>
  );
};

export default EditBar;
