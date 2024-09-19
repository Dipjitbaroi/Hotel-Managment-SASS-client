import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useAddTableMutation } from "../../redux/restaurant/foodAPI.js";
import * as yup from "yup";
import { Link } from "react-router-dom";
// form validation
const validationSchema = yup.object({
  number: yup.string().required("Table number is required"),
});

const AddTable = () => {
  const [addTable, { isLoading }] = useAddTableMutation();
  const formik = useFormik({
    initialValues: {
      number: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      const data = {
        table_number: values.number,
        capacity: 0,
        description: "add table",
      };
      const res = await addTable(data);
      if (res?.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success(res.data.message);
        formikHelpers.resetForm();
        setSelectedImages([]);
      }
    },
  });

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
          className={`flex justify-between bg-green-slimy max-w-3xl mx-auto py-3 px-6 rounded `}
        >
          <h3 className={`flex text-2xl text-white space-x-1.5 `}>
            <FaPlus />
            <span>Add Table</span>
          </h3>
        </div>
        <form
          autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 mt-5"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Table number"
              name="number"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.number && Boolean(formik.errors.number) ? (
              <small className="text-red-600">
                {formik.touched.number && formik.errors.number}
              </small>
            ) : null}
          </div>
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

export default AddTable;
