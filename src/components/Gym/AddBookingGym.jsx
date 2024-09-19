import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import { useAddBookingMutation, useRoomsQuery } from "../../redux/room/roomAPI.js";

// form validation
const validationSchema = yup.object({
  roomNo: yup
  .number()
  .required("Room Number is required")
  .positive("Room Number must be a positive number")
  .integer("Room Number must be an integer"),
  guestName: yup.string().required("Name is required"),
  status: yup.string().required("Status is required"),
  poolSelect: yup.string().required("pool Select is required"),
  capacity: yup
    .number()
    .required("capacity Number is required")
    .positive("capacity must be a positive number"),
  ItemPrice: yup
    .number()
    .required("Item Price is required")
    .positive("Item Price must be a positive number"),
    fromDate: yup.string().required("From Date is required"),
    hourOfSwimmingPool: yup.string().required(" Hour Of SwimmingPool is required"),
    documentsType: yup.string().required("Document Number is required"),
    documentsNumber: yup.string().when(["documentsType"], ([documentsType], schema) => {
      if (documentsType !== "normalPackage")
        return schema.required("Transaction ID is required");
      else return schema;
    }),

});

const AddBookingGym = () => {
  const { isLoading, data: rooms } = useRoomsQuery();
  const [addBooking] = useAddBookingMutation();
  const [selectedRooms, setSelectedRooms] = useState([]);

  const formik = useFormik({
    initialValues: {
      roomNo: "",
      guestName: "",
      status:"",
      poolSelect: "",
      capacity: "",
      ItemPrice: "",
      fromDate: "",
      hourOfSwimmingPool: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      const obj = { ...values };
      obj.roomNumber = 101


      const response = await addBooking(obj);
  
    },
  });

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const transformedRooms = rooms?.data?.map(room => ({
    value: room.roomNumber,
    label: `${room.roomNumber} - ${room.category}`
  }));

  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => formik.handleReset()}
        >
          ✕
        </button>
      </form>
      <div>
        <h3 className={`text-2xl font-semibold mb-3`}>Booking</h3>
        <hr />
        <form autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 mt-5"
          onSubmit={formik.handleSubmit}
        >
          {/* Room Number */}
          {/* <div className="flex flex-col gap-3">
            <Select
              placeholder="Room number"
              defaultValue={selectedRooms}
              options={transformedRooms}
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              onKeyDown={handleKeyDown}
              onChange={setSelectedRooms}
              noOptionsMessage={() => "No room available"}
              classNames={{
                control: (state) =>
                  `!input !input-md !min-h-[3rem] !h-auto !input-bordered !bg-transparent !rounded !w-full !border-gray-500/50 focus-within:!outline-none ${
                    state.isFocused ? "!shadow-none" : ""
                  }`,
                valueContainer: () => "!p-0",
                placeholder: () => "!m-0",
              }}
            />
          </div> */}

          {/* Room Number box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Room Number"
              name="roomNo"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.roomNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.roomNo && Boolean(formik.errors.roomNo) ? (
              <small className="text-red-600">
                {formik.touched.roomNo && formik.errors.roomNo}
              </small>
            ) : null}
          </div>
          {/* Guest box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="name"
              name="providerName"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.providerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.providerName && Boolean(formik.errors.providerName) ? (
              <small className="text-red-600">
                {formik.touched.providerName && formik.errors.providerName}
              </small>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
          <select
            name="documentsType"
            className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
            value={formik.values.documentsType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" selected disabled>
              Membership Subscription
            </option>
            <option value="normalPackage">Normal Package</option>
            <option value="singlePackage">single Package</option>
            <option value="couplePackage">Couple Package</option>
            <option value="familypackage">Family package</option>
          </select>
          {formik.touched.documentsType &&
          Boolean(formik.errors.documentsType) ? (
            <small className="text-red-600">
              {formik.touched.documentsType && formik.errors.documentsType}
            </small>
          ) : null}
        </div>
        {formik.values.documentsType &&
        formik.values.documentsType !== "normalPackage" ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Package Price"
              name="packagePrice"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.packagePrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.packagePrice && Boolean(formik.errors.packagePrice) ? (
              <small className="text-red-600">
                {formik.touched.packagePrice && formik.errors.packagePrice}
              </small>
            ) : null}
          </div>
        ) : null}

              {/* Price */}
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
                  Attendance Tracking
                  </option>
                  <option value=" daily">Daily</option>
                  <option value="weekly">weekly </option>
                  <option value="monthly">Monthly</option>
                  
                </select>
                {formik.touched.status && Boolean(formik.errors.status) ? (
                  <small className="text-red-600">
                    {formik.touched.status && formik.errors.status}
                  </small>
                ) : null}
              </div>
                 {/* select Pool Name */}
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
                {formik.touched.poolSelect && Boolean(formik.errors.poolSelect) ? (
                  <small className="text-red-600">
                    {formik.touched.poolSelect && formik.errors.poolSelect}
                  </small>
                ) : null}
              </div> */}
                {/* Capacity*/}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Capacity"
            name="capacity"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.capacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.capacity &&
          Boolean(formik.errors.capacity) ? (
            <small className="text-red-600">
              {formik.touched.capacity && formik.errors.capacity}
            </small>
          ) : null}
        </div>
      
       
          {/* From */}
          <div className="flex flex-col gap-3">
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
          </div>
          {/* FrToom */}
          <div className="flex flex-col gap-3">
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
          </div>
        {/* Hour of swimming */}
  <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Hour Of Gym"
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
        </div>

          {/* button */}
          <div className={`flex justify-between`}>
            <button
              type={"submit"}
              className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBookingGym;
