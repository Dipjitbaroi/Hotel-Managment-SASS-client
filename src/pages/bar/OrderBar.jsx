import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import FoodLists from "../../components/restaurant/FoodLists.jsx";
import Modal from "../../components/Modal.jsx";
import ConfirmOrder from "../../components/restaurant/ConfirmOrder.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { setOrder } from "../../redux/add-order/addOrderSlice.js";
import {useRoomNumbersQuery, useRoomsQuery} from "../../redux/room/roomAPI.js";

// form validation
const validationSchema = yup.object({
  roomNumber: yup.string().required("Room number is required"),
});

const OrderBar = () => {
  const { isLoading, data: rooms } = useRoomNumbersQuery();
  const { order } = useSelector((store) => store.addOrderSlice);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      roomNumber: "",
    },
    validationSchema,
    onSubmit: () => {
    },
  });

  useEffect(() => {
    if (formik.values.roomNumber)
      dispatch(setOrder({ ...order, roomNumber: formik.values.roomNumber }));
  }, [formik.values.roomNumber]);

  return (
    <div className={`space-y-10 bg-white p-16 rounded-2xl mx-10`}>
      <div
        className={`flex flex-col-reverse sm:flex-row gap-3 sm:justify-between`}
      >
        <div className="flex flex-col gap-3">
          <select
            name="roomNumber"
            className="select select-sm select-bordered border-green-slimy rounded focus:outline-none"
            value={formik.values.roomNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" selected disabled>
              Room Number
            </option>
            {rooms?.data?.map((room) => (
              <option key={room?._id} value={room?._id}>{room?.roomNumber}</option>
            ))}
          </select>
          {formik.touched.roomNumber && Boolean(formik.errors.roomNumber) ? (
            <small className="text-red-600">
              {formik.touched.roomNumber && formik.errors.roomNumber}
            </small>
          ) : null}
        </div>
        <div className={`flex space-x-1.5`}>
          <button
            onClick={() => window.fp_modal.showModal()}
            type={`button`}
            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case ${
              !order.foods.length ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Confirm Order
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
      <FoodLists />
      <Modal id={`fp_modal`}>
        <ConfirmOrder formik={formik} />
      </Modal>
    </div>
  );
};

export default OrderBar;
