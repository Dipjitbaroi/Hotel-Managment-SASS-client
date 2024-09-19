import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import * as yup from "yup";
import { useAddInventoryMutation } from "../../redux/inventory/inventoryAPI.js";
import { useGetRoomsAndHotelsQuery } from "../../redux/room/roomAPI.js";
import { Link } from "react-router-dom";

// form validation
const validationSchema = yup.object({
  itemName: yup.string().required("Name is required"),
  // chooseHotel: yup.string().required("Hotel is required"),
  itemDescription: yup
    .string()
    .required("Description is required")
    // .min(20, "Description at least 20 characters length"),
});

const AddInventory = () => {
  const { data: hotelsList } = useGetRoomsAndHotelsQuery();
  const [addInventory, { isLoading }] = useAddInventoryMutation();
  const formik = useFormik({
    initialValues: {
      itemName: "",
      itemDescription: "",
      // chooseHotel: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      const obj = { ...values };
      const {
        itemName: name,
        itemDescription: description,
        chooseHotel: hotel_id,
      } = obj;

      const response = await addInventory({
        hotel_id,
        name,
        description,
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success("Successfully item added");
        formikHelpers.resetForm();
      }
    },
  });

  return (
    <>
      <div className={`space-y-10 bg-white p-10 rounded-2xl`}>
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
        <h3
          className={`flex bg-green-slimy text-2xl text-white max-w-3xl mx-auto py-3 px-6 rounded space-x-1.5`}
        >
          <FaPlusCircle />
          <span>Add Item</span>
        </h3>
        <form
          autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 max-w-3xl mx-auto"
          onSubmit={formik.handleSubmit}
        >
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
                {formik.touched.itemDescription &&
                  formik.errors.itemDescription}
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

export default AddInventory;
