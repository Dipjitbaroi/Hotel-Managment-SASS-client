import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  useRemoveExpensesMutation,
  useUpdateExpensesItemMutation,
} from "../../redux/expensesAndSales/expensesAndSalesApi";
import toast from "react-hot-toast";

// form validation
const validationSchema = yup.object({
  name: yup.string(),
  price: yup.number(),
  remark: yup.string().required("remark is required"),
  password: yup.string().required("Password is required"),
});

const RemoveExpenses = ({ data, allItems, index }) => {
  const [removeExpenses, { isLoading }] = useRemoveExpensesMutation();
  const [showPass, setShowPass] = useState(false);
  const closeRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      price: 0,
      password: "",
      remark: "",
    },

    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      const formValue = {
        _id: data?._id,
        name: data?.name,
        description: data?.description,
        price: 0,
        quantity: data?.quantity,
        remark: values.remark,
      };
      const updatedData = [...allItems.items];
      updatedData.splice(index, 1, formValue);
      const requestValue = {
        items: updatedData,
        password: values.password,
        reduced_amount: data?.price,
      };
      const response = await removeExpenses({
        id: allItems?._id,
        data: requestValue,
      });
      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        formik.resetForm();
        closeRef.current.click();
        toast.success(response.data.message);
      }
    },
  });

  useEffect(() => {
    if (data) {
      formik.setValues((p) => ({
        ...p,
        price: data.price,
      }));
    }
  }, [data]);
  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  return (
    <div className={`space-y-10  px-10 rounded-2xl`}>
      <form autoComplete="off" method="dialog">
        <button
          ref={closeRef}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>
      <h1
        className={` bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}
      >
        Remove Expenses
      </h1>

      <form
        className="form-control md:grid-cols-2 gap-4 "
        onSubmit={formik.handleSubmit}
      >
        {/* price box */}
        <div className="flex flex-col gap-3">
          <h3 className={`font-semibold`}>Price</h3>
          <input
            onWheel={(event) => event.currentTarget.blur()}
            type="number"
            placeholder="Price"
            name="price"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.price}
            disabled
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && Boolean(formik.errors.price) ? (
            <small className="text-red-600">
              {formik.touched.price && formik.errors.price}
            </small>
          ) : null}
        </div>
        <div className="flex flex-col gap-3">
          <h3 className={`font-semibold`}>New Price</h3>
          <input
            onWheel={(event) => event.currentTarget.blur()}
            type="number"
            placeholder="Price"
            name="new_price"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={0}
            disabled
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && Boolean(formik.errors.price) ? (
            <small className="text-red-600">
              {formik.touched.price && formik.errors.price}
            </small>
          ) : null}
        </div>

        <div>
          <h3 className={`font-semibold`}>Password</h3>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter New Password"
              name="password"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && Boolean(formik.errors.password) ? (
              <small className="text-red-600">
                {formik.touched.password && formik.errors.password}
              </small>
            ) : null}

            {!showPass ? (
              <FaEyeSlash
                onClick={handleShowPass}
                className="absolute right-0 top-4 text-green-slimy text-lg mr-3 cursor-pointer"
              />
            ) : (
              <FaEye
                onClick={handleShowPass}
                className="absolute right-0 top-4 text-green-slimy text-lg mr-3 cursor-pointer"
              />
            )}
          </div>
        </div>

        <div className="col-span-full flex flex-col gap-3">
          <textarea
            placeholder="Remark...."
            name="remark"
            className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
            value={formik.values.remark}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.remark && Boolean(formik.errors.remark) ? (
            <small className="text-red-600">
              {formik.touched.remark && formik.errors.remark}
            </small>
          ) : null}
        </div>

        {/* submit button */}
        <button
          disabled={isLoading}
          type="submit"
          className="col-span-full btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case h-auto p-2"
        >
          Remove
          {isLoading ? (
            <span
              className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
              role="status"
            ></span>
          ) : null}
        </button>
      </form>
    </div>
  );
};

export default RemoveExpenses;
