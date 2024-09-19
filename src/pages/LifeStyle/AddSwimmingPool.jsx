import { useFormik } from "formik";
import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import * as yup from "yup";

// form validation
const validationSchema = yup.object({
  // guestName: yup.string().required("Guest Name  is required"),
  // roomNumber: yup
  //   .number()
  //   .required("Room number is required")
  //   .positive("Room number must be a positive")
  //   .integer("Room number must be an integer"),
    poolName: yup.string().required("Pool Name  is required"),
    typeOfName: yup.string().required("Type Of Name  is required"),
    status: yup.string().required("Status is required"),
    members: yup
    .number()
    .required("Capacity is required")
    .positive("Capacity must be a positive"),
    perPersonPrice: yup
    .number()
    .required("Per Perso Price is required")
    .positive("Per Person Price must be a positive number")
    .integer("Per Person Price must be an integer"),
  poolDetails: yup
    .string()
    .required("Description is required"),
   
 
});

const AddSwimmingPool = () => {
  const formik = useFormik({
    initialValues: {
      // guestName: "",
      // roomNumber: "",
      poolName: "",
      typeOfName: "",
      status:"",
      members: "",
      perPersonPrice: "",
      poolDetails: "",
     
    },
    validationSchema,
    onSubmit: (values) => {
      },
  });

  return (
    <div className={`space-y-10 bg-white p-10 rounded-2xl`}>
      <h3
        className={`flex bg-green-slimy text-2xl text-white max-w-3xl mx-auto py-3 px-6 rounded space-x-1.5`}
      >
        <FaPlusCircle />
        <span>Add Swimming Pool </span>
      </h3>
      <form autoComplete="off"
        className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
        onSubmit={formik.handleSubmit}
      >
        {/*Guest Name box */}
        {/* <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Guest Name"
            name="guestName"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.guestName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.guestName && Boolean(formik.errors.guestName) ? (
            <small className="text-red-500">
              {formik.touched.guestName && formik.errors.guestName}
            </small>
          ) : null}
        </div> */}
        {/*Room Number box */}
        {/* <div className="flex flex-col gap-5">
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
        </div> */}
        {/* Pool Name  */}
        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Pool Name"
            name="poolName"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.poolName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.poolName && Boolean(formik.errors.poolName) ? (
            <small className="text-red-600">
              {formik.touched.poolName && formik.errors.poolName}
            </small>
          ) : null}
        </div>
        {/* Type Of Name */}
        <div className="flex flex-col gap-3">
                <select
                  name="typeOfName"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.typeOfName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" selected disabled>
                    Type Of Name
                  </option>
                  <option value="CommercialSwimmigPools ">Commercial Swimmig Pools</option>
                  <option value="ResidentialSwimmingPools">Residential Swimming Pools</option>
                  <option value="CompetitionPools">Competition Pools</option>
                  <option value="IndoorSwimmingPools"> Indoor Swimming Pools</option>
                 
                </select>
                {formik.touched.typeOfName && Boolean(formik.errors.typeOfName) ? (
                  <small className="text-red-600">
                    {formik.touched.typeOfName && formik.errors.typeOfName}
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
                  <option value=" Active">Active</option>
                  <option value="InActive">InActive </option>
                  <option value="Bookded"> Bookded</option>
                  <option value="UnderMaintenence">Under Maintenence</option>
                </select>
                {formik.touched.status && Boolean(formik.errors.status) ? (
                  <small className="text-red-600">
                    {formik.touched.status && formik.errors.status}
                  </small>
                ) : null}
              </div>
        
        {/* Pool Name Select */}
        {/* <div className="flex flex-col gap-3">
                <select
                  name="poolSelect"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  value={formik.values.poolSelect}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" selected disabled>
                   Select Pool
                  </option>
                  <option value=" DolphinSwimming">Dolphin Swimming</option>
                  <option value="RoyalPools"> Royal Pools</option>
                  <option value="NeptunePool"> Neptune Pool</option>
                </select>
                {formik.touched.status && Boolean(formik.errors.status) ? (
                  <small className="text-red-600">
                    {formik.touched.status && formik.errors.status}
                  </small>
                ) : null}
              </div> */}

      
        {/* Capacity*/}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Members"
            name="members"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.members}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.members &&
          Boolean(formik.errors.members) ? (
            <small className="text-red-600">
              {formik.touched.members && formik.errors.members}
            </small>
          ) : null}
        </div>
       
        {/* Price */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Per Person Price"
            name="perPersonPrice"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.perPersonPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.perPersonPrice &&
          Boolean(formik.errors.perPersonPrice) ? (
            <small className="text-red-600">
              {formik.touched.perPersonPrice && formik.errors.perPersonPrice}
            </small>
          ) : null}
        </div>
          {/* From Date */}
          {/* <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="From  MM/DD/YYY"
            name="fromDate"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.fromDate}
            onChange={formik.handleChange}
            onBlur={(e) => {
              e.target.type = "text";
              formik.handleBlur;
            }}
            onFocus={(e) => (e.target.type = "date")}
          />
          {formik.touched.fromDate && Boolean(formik.errors.fromDate) ? (
            <small className="text-red-600">
              {formik.touched.fromDate && formik.errors.fromDate}
            </small>
          ) : null}
        </div> */}
        {/* To box */}
        {/* <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="To  MM/DD/YYY"
            name="toDate"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.toDate}
            onChange={formik.handleChange}
            onBlur={(e) => {
              e.target.type = "text";
              formik.handleBlur;
            }}
            onFocus={(e) => (e.target.type = "date")}
          />
          {formik.touched.toDate && Boolean(formik.errors.toDate) ? (
            <small className="text-red-600">
              {formik.touched.toDate && formik.errors.toDate}
            </small>
          ) : null}
        </div> */}
         {/* Hour Price */}
         {/* <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Hour Of Swimming Pool"
            name="hourOfSwimmingPool"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.hourOfSwimmingPool}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.hourOfSwimmingPool &&
          Boolean(formik.errors.hourOfSwimmingPool) ? (
            <small className="text-red-600">
              {formik.touched.hourOfSwimmingPool && formik.errors.hourOfSwimmingPool}
            </small>
          ) : null}
        </div> */}
        
        {/* Pool Details */}
        <div className="col-span-full flex flex-col gap-3">
          <textarea
            placeholder="Pool Details......."
            name="poolDetails"
            className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
            value={formik.values.poolDetails}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.poolDetails &&
          Boolean(formik.errors.poolDetails) ? (
            <small className="text-red-600">
              {formik.touched.poolDetails && formik.errors.poolDetails}
            </small>
          ) : null}
        </div>
        {/* submit button */}
        <div className=" col-span-full text-end mt-5 ">
          <button
            type="submit"
            className=" btn btn-md  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[7rem]"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSwimmingPool;
