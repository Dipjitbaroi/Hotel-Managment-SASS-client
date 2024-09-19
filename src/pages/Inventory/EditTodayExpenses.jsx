import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaEye, FaEyeSlash, FaPlusCircle, FaTrash, FaUpload } from "react-icons/fa";



// form validation
const validationSchema = yup.object({
 
    itemName: yup.string().required("Name is required"),
    quantity: yup.string().required("Quantity is required"),
    price: yup
      .number()
      .required("Price is required")
      .positive("Price must be a positive number")
      .integer("Price must be an integer"),
      password: yup
      .string()
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
    description: yup
      .string()
      .required("Description is required")
      .min(10, "Description at least 10 characters length"),
  });
  
const EditTodayExpenses = () => {
 
    const [showPass, setShowPass] = useState(false);

  const formik = useFormik({
    initialValues: {
        itemName: "",
        quantity: "",
        price: "",
        password:"",
        description: "",

    },
    validationSchema,
    onSubmit: (values) => {
      
    },
  });


  const handleShowPass = () => {
    setShowPass(!showPass);
  };
  return (
    <div className={`space-y-10  p-10 rounded-2xl`}>
     <h1  className={` bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}>Edit Hotel Expenses</h1>
      <form
        className="form-control md:grid-cols-2 gap-4 "
        onSubmit={formik.handleSubmit}
      >
          <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Item Name"
                  name="itemName"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.itemName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.price && Boolean(formik.errors.itemName) ? (
                  <small className="text-red-600">
                    {formik.touched.itemName && formik.errors.itemName}
                  </small>
                ) : null}
              </div>

             <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Quantity"
                  name="quantity"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.price && Boolean(formik.errors.quantity) ? (
                  <small className="text-red-600">
                    {formik.touched.quantity && formik.errors.quantity}
                  </small>
                ) : null}
              </div>
              {/* price box */}
              <div className="flex flex-col gap-3">
                <input
                onWheel={ event => event.currentTarget.blur() }
                  type="number"
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
            {formik.touched.password &&
            Boolean(formik.errors.password) ? (
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
        <button
          type="submit"
          className="col-span-full btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case h-auto p-2"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditTodayExpenses;
