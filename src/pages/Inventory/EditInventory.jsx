import { useFormik } from "formik";
import React, { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import {
  useInvSingleQuery,
  useUpdateInventoryMutation,
} from "../../redux/inventory/inventoryAPI.js";
import toast from "react-hot-toast";

// form validation
const validationSchema = yup.object({
  itemName: yup.string().required("Name is required"),
  itemDescription: yup
    .string()
    .required("Description is required")
    // .min(20, "Description at least 20 characters length"),
});

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: userData } = useInvSingleQuery(id);
  const [updateInventory, { isLoading }] = useUpdateInventoryMutation();
  const formik = useFormik({
    initialValues: {
      itemName: "",
      itemDescription: "",
      status: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const response = await updateInventory({
        id,
        data: {
          name: values.itemName,
          description: values.itemDescription,
          status: values.status,
        },
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        navigate(-1);
      }
    },
  });

  useEffect(() => {
    if (userData) {
      formik.setValues({
        itemName: userData?.data?.name,
        itemDescription: userData?.data?.description,
        status: userData?.data?.status,
      });
    }
  }, [userData]);

  return (
    <div className={`space-y-10 bg-white p-10 rounded-2xl`}>
      <div
        className={`flex justify-between bg-green-slimy max-w-3xl mx-auto py-3 px-6 rounded`}
      >
        <h3 className={`flex text-2xl text-white space-x-1.5`}>
          <FaPencil />
          <span>Edit Item</span>
        </h3>
        <div
          className={`flex hover:text-white hover:bg-transparent border border-white items-center space-x-1.5 bg-white text-green-slimy cursor-pointer px-3 py-1 rounded transition-colors duration-500`}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back</span>
        </div>
      </div>
      <form
        autoComplete="off"
        className="form-control grid grid-cols-1 gap-4 max-w-3xl mx-auto"
        onSubmit={formik.handleSubmit}
      >
        {/* Item Name */}
        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Item Name"
            name="itemName"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.itemName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.itemName && Boolean(formik.errors.itemName) ? (
            <small className="text-red-600">
              {formik.touched.itemName && formik.errors.itemName}
            </small>
          ) : null}
        </div>
        <div className="flex flex-col gap-3">
          <select
            name="status"
            className="select select-md bg-transparent select-bordered border-gray-500/50 rounded w-full focus:outline-none focus:border-green-slimy"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" selected disabled>
              Status
            </option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          {formik.touched.status && Boolean(formik.errors.status) ? (
            <small className="text-red-600">
              {formik.touched.status && formik.errors.status}
            </small>
          ) : null}
        </div>
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
            disabled={isLoading}
            type="submit"
            className=" btn btn-md  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
          >
            Update
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
  );
};

export default EditInventory;
