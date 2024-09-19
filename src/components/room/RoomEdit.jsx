import { useFormik } from "formik";
import React from "react";
import { FaUpload } from "react-icons/fa";
import * as yup from "yup";

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
    roomDescription: yup.string().required("Room Description is required"),
  photos: yup.mixed().required("Photos are required"),
});

const RoomEdit = () => {
  const formik = useFormik({
    initialValues: {
      category: "",
      type: "",
      capacity: "",
      price: "",
      bedSize: "",
      floorNumber: "",
      roomNumber: "",
      roomDescription:"",
      photos: null,
    },
    validationSchema,
    onSubmit: (values) => {
  
    },
  });

  return (
    <>
      <div className={`space-y-10`}>
        <div >
          <div >
          <h1 className="text-2xl text-center m-2">Edit Room Update</h1>
          <hr className={`my-3 `}/>
            <form autoComplete="off"
              className="form-control grid grid-cols-1 gap-4 max-w-3xl w-full mx-auto"
              onSubmit={formik.handleSubmit}
            >
              {/* category box */}
              <div className="flex flex-col gap-3">
                <select
                  name="category"
                  className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" selected disabled>
                    Category
                  </option>
                  <option value="general">General</option>
                  <option value="deluxe">Deluxe</option>
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
                  <option value="ac">AC</option>
                  <option value="non-ac">Non AC</option>
                </select>
                {formik.touched.type && Boolean(formik.errors.type) ? (
                  <small className="text-red-600">
                    {formik.touched.type && formik.errors.type}
                  </small>
                ) : null}
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
                  <option value="sm">SM</option>
                  <option value="lg">LG</option>
                  <option value="xl">XL</option>
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
                onWheel={ event => event.currentTarget.blur() }
                  type="number"
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
                onWheel={ event => event.currentTarget.blur() }
                  type="number"
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
                    {formik.values.photos ? (
                      <span>{formik.values.photos.length + " files"}</span>
                    ) : (
                      <span className={`flex items-baseline space-x-1.5`}>
                        <FaUpload />
                        <span>Choose photos</span>
                      </span>
                    )}
                    <input
                      type="file"
                      multiple
                      name="photos"
                      className="absolute left-0 top-0  overflow-hidden h-0"
                      onChange={(e) =>
                        formik.setFieldValue("photos", e.currentTarget.files)
                      }
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
                 {/* Description box */}
                 <div className="col-span-full flex flex-col gap-3">
          <textarea
            placeholder="Room Description"
            name="roomDescription"
            className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
            value={formik.values.roomDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.roomDescription &&
          Boolean(formik.errors.roomDescription) ? (
            <small className="text-red-600">
              {formik.touched.roomDescription && formik.errors.roomDescription}
            </small>
          ) : null}
        </div>
              {/* submit button */}
              <div className=" col-span-full text-end mt-5">
                <button
                  type="submit"
                  className=" btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomEdit;
