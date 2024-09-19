import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
// import BookingLists from "../../components/room/BookingLists.jsx";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal.jsx";
// import AddBooking from "../../components/room/AddBooking.jsx";
import AddBookingSwimming from "../../components/LifeStyle/AddBookingSwimming.jsx";
// import SwimmingLists from "../../components/LifeStyle/SwimmingLists.jsx";
import Select from "react-select";
import {
  useGetRoomsAndHotelsQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import { useAddBarMutation } from "../../redux/bar/barAPI.js";
import toast from "react-hot-toast";

// form validation
const validationSchema = yup.object({
  //   chooseHotel: yup.string().required("Choose Hotel is required"),
  roomNumber: yup.string().required("Room number is required"),
  chooseHotel: yup.string().required("Hotel is required"),
  itemName: yup.string().required("Item Name is required"),
  price: yup.string().required("Price is required"),

  typeOfAlcohol: yup.string().required("Type Of Alcohol is required"),
  surveyorQuantity: yup
    .number()
    .required("Quantity is required")
    .positive("Quantity must be a positive number")
    .integer("Quantity must be an integer"),
});

const OrderBarItem = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [addBar] = useAddBarMutation();
  const formik = useFormik({
    initialValues: {
      chooseHotel: "",
      roomNumber: "",
      itemName: "",
      typeOfAlcohol: "",
      surveyorQuantity: "",
      price: "",
      paid_amount: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      const obj = { ...values };

      const {
        chooseHotel: hotel_id,
        roomNumber: room_id,
        itemName: name,
        typeOfAlcohol: type_of_alcohol,
        surveyorQuantity: surveyor_quantity,
        price,
        paid_amount,
      } = obj;

      const response = await addBar({
        hotel_id,
        room_id,
        name,
        type_of_alcohol,
        surveyor_quantity,
        price,
        paid_amount,
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        formikHelpers.resetForm();
      }
    },
  });
  const { data: hotelList } = useGetRoomsAndHotelsQuery();
  const { isLoading, data: rooms } = useRoomsQuery({
    id: formik.values.chooseHotel,
    cp: "0",
    filter: "",
    search: "",
    limit: 1000000,
  });
  const transformedRooms = rooms?.data?.docs?.map((room) => ({
    value: room._id,
    label: room.roomNumber,
  }));

  // const [status, setStatus] = useState("");

  // const selectOption = [
  //   {
  //     name: "DolphinSwimming",
  //     status: "Available",
  //   },
  //   {
  //     name: "RoyalPools",
  //     status: "Unavailable",
  //   },
  //   {
  //     name: "NeptunePool",
  //     status: "Available",
  //   },
  // ];

  // useEffect(() => {


  //   const value = selectOption.find((i) => i.name === formik.values.poolSelect);

  //   setStatus(value?.status);
  // }, [formik.values.poolSelect]);
 
  return (
    <div
      className={`relative max-w-xl bg-white rounded-2xl mx-auto p-8 pt-10 mt-20`}
    >
      <div className=" ">
        <h3
          className={`text-center bg-green-slimy max-w-3xl mx-auto py-3 px-6 rounded text-white text-2xl`}
        >
          Order Bar Item
        </h3>
        <hr />
        <form
          className=" form-control grid grid-cols-1 gap-4 mt-5 "
          onSubmit={formik.handleSubmit}
        >
          {/* Choose Hotel  Name */}
          <div className="flex flex-col gap-3">
            <select
              name="chooseHotel"
              className="input input-md h-10 bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
              value={formik.values.chooseHotel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Choose Hotel
              </option>

              {hotelList?.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
            {formik.touched.chooseHotel &&
            Boolean(formik.errors.chooseHotel) ? (
              <small className="text-red-600">
                {formik.touched.chooseHotel && formik.errors.chooseHotel}
              </small>
            ) : null}
          </div>

          {/* Room Number box */}

          <div className="flex flex-col gap-3">
            <Select
              placeholder="Select room"
              name={`roomNumber`}
              defaultValue={formik.values.roomNumber}
              options={transformedRooms}
              isSearchable
              onChange={(e) => formik.setFieldValue("roomNumber", e.value)}
              noOptionsMessage={() => "No room available"}
              classNames={{
                control: (state) =>
                  `!input !input-md !h-4 !input-bordered !bg-transparent !rounded !w-full !border-gray-500/50 focus-within:!outline-none ${
                    state.isFocused ? "!shadow-none" : ""
                  }`,
                valueContainer: () => "!p-0",
                placeholder: () => "!m-0",
              }}
            />
            {formik.touched.roomNumber && Boolean(formik.errors.roomNumber) ? (
              <small className="text-red-600">
                {formik.touched.roomNumber && formik.errors.roomNumber}
              </small>
            ) : null}
          </div>

          {/* Item Name box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Item name"
              name="itemName"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
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
          {/* Type Of Alcohol Pack */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Type Of Alcohol"
              name="typeOfAlcohol"
              className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
              value={formik.values.typeOfAlcohol}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.typeOfAlcohol &&
            Boolean(formik.errors.typeOfAlcohol) ? (
              <small className="text-red-600">
                {formik.touched.typeOfAlcohol && formik.errors.typeOfAlcohol}
              </small>
            ) : null}
          </div>

          {/* surveyor Quantity */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Surveyor Quantity"
              name="surveyorQuantity"
              className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
              value={formik.values.surveyorQuantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.surveyorQuantity &&
            Boolean(formik.errors.surveyorQuantity) ? (
              <small className="text-red-600">
                {formik.touched.surveyorQuantity &&
                  formik.errors.surveyorQuantity}
              </small>
            ) : null}
          </div>
          {/* Price */}

          {/*Paid Amount  */}
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
          <div className="flex flex-col gap-3">
            <input
            onWheel={ event => event.currentTarget.blur() }
              type="number"
              placeholder="Paid Amount"
              name="paid_amount"
              className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
              value={formik.values.paid_amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.paid_amount &&
            Boolean(formik.errors.paid_amount) ? (
              <small className="text-red-600">
                {formik.touched.paid_amount && formik.errors.paid_amount}
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
    </div>
  );
};

export default OrderBarItem;
