import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
// import BookingLists from "../../components/room/BookingLists.jsx";
import { FaArrowLeft, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal.jsx";
// import AddBooking from "../../components/room/AddBooking.jsx";
import AddBookingSwimming from "../../components/LifeStyle/AddBookingSwimming.jsx";
import SwimmingLists from "../../components/LifeStyle/SwimmingLists.jsx";
import GymLits from "../../components/Gym/GymLits.jsx";
import AddBookingGym from "../../components/Gym/AddBookingGym.jsx";
import Select from "react-select";
import { useAddPoolMutation } from "../../redux/Pool/PoolApi.js";
import toast from "react-hot-toast";
import {
  useGetRoomsAndHotelsQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import { Link } from "react-router-dom";
import { customFilterOption } from "../../utils/utils.js";

// form validation
const validationSchema = yup.object({
  // roomNo: yup
  //   .number()
  //   .required("Room number is required")
  //   .positive("Room number must be a positive")
  //   .integer("Room number must be an integer"),
  name: yup.string().required(" Name  is required"),
  poolName: yup.string().required("Pool Name  is required"),
  members: yup.string().required("members  is required"),
  roomNumber: yup.string().required("Room number is required"),

  // packagePrice: yup
  //   .string()
  //   .when(["documentsType"], ([membershipSubscription], schema) => {
  //     if (membershipSubscription !== "normalPackage")
  //       return schema.required("Package Price is required");
  //     else return schema;
  //   }),
  price: yup.number(),

  paidamount: yup.number(),
});

const PoolReservation = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [addPool, { isLoading }] = useAddPoolMutation();
  const [selectedRooms, setSelectedRooms] = useState(null);
  const closeRef = useRef(null);
  const [selectorValue, setSelectorValue] = useState([]);
  const formik = useFormik({
    initialValues: {
      roomNumber: "",
      name: "",
      members: "",
      poolName: "",
      paidamount: "",
      price: "",
      // packagePrice: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      try {
        const data = { ...values };
        const {
          roomNumber: room_id,
          name,
          members,
          poolName: pool_name,
          paidamount: paid_amount,
          price,
        } = data;

        const response = await addPool({
          room_id,
          name,
          members,
          pool_name,
          paid_amount,
          price,
        });

        if (response?.error) {
          toast.error(response.error.data.message);
        } else {
          toast.success(response.data.message);
          formikHelpers.resetForm();
          setSelectorValue([]);
        }
        
      } catch (error) {
        toast.error(error.data.message);
      }
    },
  });

  const { data: rooms } = useRoomsQuery({
    id: formik.values.hotel_id,
    limit: 1000000,
  });

  const transformedRooms = rooms?.data?.docs
    ?.filter((room) => room.status === "CheckedIn")
    .map((room) => ({
      value: room._id,
      label: room.roomNumber,
    }));

  const { data: hotelsList } = useGetRoomsAndHotelsQuery();

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  // Price Validation
  const handlePrice = (e) => {
    const inputValue = e.target.value;
    const fieldName = e.target.price;
    if (inputValue >= 0) {
      // Update the Formik state
      formik.handleChange(e);
    } else if (inputValue === "") {
      e.target.value = 0;
      formik.handleChange(e);
    }
  };
  // Price Validation
  const handlePaidAmount = (e) => {
    const inputValue = e.target.value;
    const fieldName = e.target.price;
    if (inputValue >= 0) {
      // Update the Formik state
      formik.handleChange(e);
    } else if (inputValue === "") {
      e.target.value = 0;
      formik.handleChange(e);
    }
  };

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
      <div
        className={`relative max-w-xl bg-white rounded-2xl mx-auto p-8 pt-10 mt-20`}
      >
        {/* <div className={`flex justify-end gap-4`}>
        <div>
          <select
            name="filter"
            className="select select-sm select-bordered border-green-slimy rounded w-full focus:outline-none"
            value={formik.values.filter}
            onChange={formik.handleChange}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">InActive</option>
            <option value="booked">Booked</option>
          </select>
        </div>
        <div className={`flex gap-1.5 `}>
          <button
            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
            onClick={() => window.ab_modal.showModal()}
          >
            <FaPlus />
            <span>Gym Booking</span>
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
      <GymLits />
      <Modal id={`ab_modal`}>
        <AddBookingGym />
      </Modal> */}

        <div>
          <h3
            className={`text-center bg-green-slimy max-w-3xl mx-auto py-3 px-6 rounded text-white text-2xl`}
          >
            Pool Reservation
          </h3>
          <hr />
          <form
            className=" form-control grid grid-cols-1 gap-4 mt-5 "
            onSubmit={formik.handleSubmit}
          >
            {/* Selet Hotel */}

            <div className="flex flex-col gap-3">
              <Select
                placeholder="Select room"
                name={`roomNumber`}
                defaultValue={formik.values.roomNumber}
                value={selectorValue}
                options={transformedRooms}
                filterOption={customFilterOption}
                isSearchable
                onChange={(e) => {
                  setSelectorValue(e);
                  formik.setFieldValue("roomNumber", e.value)}}
                noOptionsMessage={() => "No room available"}
                classNames={{
                  control: (state) =>
                    `!input !input-md !input-bordered !bg-transparent !rounded !w-full !border-gray-500/50 focus-within:!outline-none ${
                      state.isFocused ? "!shadow-none" : ""
                    }`,
                  valueContainer: () => "!p-0",
                  placeholder: () => "!m-0",
                }}
              />
              {formik.touched.roomNumber &&
              Boolean(formik.errors.roomNumber) ? (
                <small className="text-red-600">
                  {formik.touched.roomNumber && formik.errors.roomNumber}
                </small>
              ) : null}
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Guest Name"
                name="name"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && Boolean(formik.errors.name) ? (
                <small className="text-red-600">
                  {formik.touched.name && formik.errors.name}
                </small>
              ) : null}
            </div>

            {/* Item Name box */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Pool name"
                name="poolName"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
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

            {/* <div className="flex flex-col gap-3">
              <select
                name="membershipSubscription"
                className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
                value={formik.values.membershipSubscription}
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
              {formik.touched.membershipSubscription &&
              Boolean(formik.errors.membershipSubscription) ? (
                <small className="text-red-600">
                  {formik.touched.membershipSubscription &&
                    formik.errors.membershipSubscription}
                </small>
              ) : null}
            </div>
            {formik.values.membershipSubscription &&
            formik.values.membershipSubscription !== "normalPackage" ? (
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
                {formik.touched.packagePrice &&
                Boolean(formik.errors.packagePrice) ? (
                  <small className="text-red-600">
                    {formik.touched.packagePrice && formik.errors.packagePrice}
                  </small>
                ) : null}
              </div>
            ) : null} */}

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Members"
                name="members"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
                value={formik.values.members}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.members && Boolean(formik.errors.members) ? (
                <small className="text-red-600">
                  {formik.touched.members && formik.errors.members}
                </small>
              ) : null}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-3">
              <input
                onWheel={(event) => event.currentTarget.blur()}
                type="number"
                placeholder="Price"
                name="price"
                className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                value={formik.values.price}
                onChange={handlePrice}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && Boolean(formik.errors.price) ? (
                <small className="text-red-600">
                  {formik.touched.price && formik.errors.price}
                </small>
              ) : null}
            </div>
            {/*Paid Amount  */}
            <div className="flex flex-col gap-3">
              <input
                onWheel={(event) => event.currentTarget.blur()}
                type="number"
                placeholder="Paid Amount"
                name="paidamount"
                className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                value={formik.values.paidamount}
                onChange={handlePaidAmount}
                onBlur={formik.handleBlur}
              />
              {formik.touched.paidamount &&
              Boolean(formik.errors.paidamount) ? (
                <small className="text-red-600">
                  {formik.touched.paidamount && formik.errors.paidamount}
                </small>
              ) : null}
            </div>
            {/* button */}
            <div className={`flex justify-between`}>
              <button
                disabled={isLoading}
                type={"submit"}
                className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
              >
                Confirm
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
      </div>
    </>
  );
};

export default PoolReservation;
