import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
// import BookingLists from "../../components/room/BookingLists.jsx";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal.jsx";
// import AddBooking from "../../components/room/AddBooking.jsx";
import AddBookingSwimming from "../../components/LifeStyle/AddBookingSwimming.jsx";
// import SwimmingLists from "../../components/LifeStyle/SwimmingLists.jsx";

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
	members: yup
		.number()
		.required("capacity Number is required")
		.positive("capacity must be a positive number"),
	perPersonPrice: yup
		.number()
		.required("Item Price is required")
		.positive("Item Price must be a positive number"),
});

const SwimmingBooking = () => {
	const formik = useFormik({
		initialValues: {
			roomNo: "",
			guestName: "",
			status: "",
			poolSelect: "",
			members: "",
			perPersonPrice: "",
		},
		validationSchema,
		onSubmit: async (values) => {
		},
	});

	const [status, setStatus] = useState('');



	const selectOption = [
		{
			name: "DolphinSwimming",
			status: "Available",
		},
		{
			name: "RoyalPools",
			status: "Unavailable",
    },
    {
			name: "NeptunePool",
			status: "Available",
		},
	]

  useEffect(() => {
    
    const value = selectOption.find(i => i.name === formik.values.poolSelect)

		setStatus(value?.status);
  }, [formik.values.poolSelect]);
	return (
		<div
			className={`relative max-w-xl bg-white rounded-2xl mx-auto p-8 pt-10 mt-20`}>
			{/* <div className={`flex justify-end gap-4`}>
        <div className={`flex gap-1.5 `}>
          <button
            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
            onClick={() => window.ab_modal.showModal()}
          >
            <FaPlus />
            <span>Swimming Pool Booking</span>
          </button>
          <div className={`relative sm:min-w-[20rem]`}>
            <input
              type="text"
              placeholder="Search by name..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
              value={formik.values.search}
              onChange={formik.handleChange}
            />
            <button
              type="button"
              className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      <SwimmingLists /> 
       <Modal id={`ab_modal`}>
        <AddBookingSwimming />
      </Modal> */}
			{/* <form method="dialog">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => formik.handleReset()}
        >
          ✕
        </button>
      </form> */}
			<div className=" ">
				<h3 
				  className={`text-center bg-green-slimy max-w-3xl mx-auto py-3 px-6 rounded text-white text-2xl`}
				>
					{" "}
					Swimming Pool Booking{" "}
				</h3>
				<hr />
				<form
					className=" form-control grid grid-cols-1 gap-4 mt-5 "
					onSubmit={formik.handleSubmit}>
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
						{formik.touched.roomNo &&
						Boolean(formik.errors.roomNo) ? (
							<small className="text-red-600">
								{formik.touched.roomNo && formik.errors.roomNo}
							</small>
						) : null}
					</div>
					{/* Guest box */}
					<div className="flex flex-col gap-3">
						<input
							type="text"
							placeholder="Guest name"
							name="guestName"
							className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
							value={formik.values.guestName}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.guestName &&
						Boolean(formik.errors.guestName) ? (
							<small className="text-red-600">
								{formik.touched.guestName &&
									formik.errors.guestName}
							</small>
						) : null}
					</div>
					{/* Status */}

					{/* select Pool Name */}
					<div className="flex flex-col gap-3">
						<select
							name="poolSelect"
							className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
							value={formik.values.poolSelect}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}>
							<option value="" selected disabled>
								Select Pool
              </option>
							<option value="DolphinSwimming">
								Dolphin Swimming
							</option>
							<option value="RoyalPools"> Royal Pools</option>
							<option value="NeptunePool"> Neptune Pool</option>
						</select>

						{formik.touched.poolSelect &&
						Boolean(formik.errors.poolSelect) ? (
							<small className="text-red-600">
								{formik.touched.poolSelect &&
									formik.errors.poolSelect}
							</small>
						) : null}
					</div>

			{	status&&	<div className="flex flex-col gap-3">
						<input
							type="text"
							name="status"
							value={status}
							disabled
							className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
						/>
					</div>}

					{/* Members*/}
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
								{formik.touched.members &&
									formik.errors.members}
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
								{formik.touched.perPersonPrice &&
									formik.errors.perPersonPrice}
							</small>
						) : null}
					</div>

					{/* From */}
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
					{/* Hour of swimming */}
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

					{/* button */}
					<div className={`flex justify-between`}>
						<button
							type={"submit"}
							className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case">
							Confirm
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SwimmingBooking;
