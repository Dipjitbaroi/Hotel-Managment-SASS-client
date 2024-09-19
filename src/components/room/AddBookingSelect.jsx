import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import * as yup from "yup";
import {
  useAddBookingMutation,
  useGetAvailableRoomsByDateQuery,
  useGetRoomsAndHotelsQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import DatePicker from "react-datepicker";
import store from "../../redux/store.js";
import toast from "react-hot-toast";
import {
  calculateDiscountAmount,
  calculatePercentageDiscount,
  fromDateIsoConverter,
  getNumberOfDays,
  getTodayFormateDate,
  toDateIsoConverter,
} from "../../utils/utils.js";
import {
  convertedEndDate,
  convertedStartDate,
  getEndDateOfBookingIst,
  getStartDateOFBookingIST,
} from "../../utils/timeZone.js";
import { useSelector } from "react-redux";

// form validation
const validationSchema = yup.object({
  room_arr: yup.array().required("Room IDs are required"),
  guestName: yup.string().required("Guest name is required"),
  address: yup.string().required("Address is required"),
  mobileNumber: yup.string().required("Mobile number is required"),
  emergency_contact: yup.string().required("Emergency contact is required"),
  adult: yup
    .number()
    .required("Adult is required")
    .positive("Adult must be a positive number")
    .integer("Adult must be an integer"),

  children: yup.number(),
  discount: yup.number(),

  paymentMethod: yup.string().when(["amount"], (amount, schema) => {
    if (amount.length > 1 || (amount > 0 && amount !== undefined)) {
      return schema.required("Payment method is required");
    } else {
      return schema;
    }
  }),
  amount: yup.number(),
  trxID: yup.string().when(["paymentMethod"], (paymentMethod, schema) => {
    if (
      paymentMethod.includes("Card") ||
      paymentMethod.includes("Mobile_Banking")
    ) {
      return schema.required("Transaction ID is required");
    } else {
      return schema;
    }
  }),

  from: yup.string().required("From Date is required"),
  to: yup.string().required("To Date is required"),
  nationality: yup.string().required("Nationality is required"),
  bookingMethod: yup.string().required("Booking method is required"),
});

const AddBookingSelect = ({ room }) => {
  const [totalRoomRent, setTotalRoomRent] = useState(0);
  const [calculateNOD, setCalculateNOD] = useState(0);
  const [restrictedToDate, setRestrictedToDate] = useState(null);
  const [addBooking, { isLoading }] = useAddBookingMutation();
  const closeRef = useRef(null);
  const { isUserLoading, user } = useSelector((store) => store.authSlice);

  const [error, setError] = useState("");

  // Get the current date
  const currentDates = new Date();

  // Create a new date for the next day
  const nextDate = new Date(currentDates);
  nextDate.setDate(currentDates.getDate() + 1);

  const [sameDateError, setSameDateError] = useState("");

  const formik = useFormik({
    initialValues: {
      room_arr: [],
      // hotel_id: "",
      guestName: "",
      address: "",
      mobileNumber: "",
      emergency_contact: "",
      adult: "",
      children: "",
      paymentMethod: "",
      trxID: "",
      from: new Date(),
      to: "",
      amount: "",
      discount: "",
      discountAmount: "",
      nationality: "",
      bookingMethod: "",
      status: "Active",
    },

    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      const obj = {
        ...values,
        from: getStartDateOFBookingIST(values.from),
        to: getEndDateOfBookingIst(values.to),
      };

      if (!obj.discount) obj.discount = 0;

      let room_ids = [];
      if (room) {
        room_ids.push(room?.data?._id);
      }

      // const room_ids = obj.room_arr?.map((elem) => elem.value);
      const no_of_days = getNumberOfDays(obj.from, obj.to);
      const rent_per_day = room?.data?.price;
      const total_rent = no_of_days * rent_per_day;
      const discount = (total_rent * obj.discount) / 100;
      const amount_after_dis = total_rent - discount;

      const response = await addBooking({
        hotel_id: obj.hotel_id,
        room_ids,
        bookingMethod: obj.bookingMethod,
        guestName: obj.guestName,
        address: obj.address,
        mobileNumber: obj.mobileNumber,
        emergency_contact: obj.emergency_contact,
        adult: obj.adult,
        children: obj.children,
        paymentMethod: obj.paymentMethod,
        transection_id: obj.trxID,
        from: obj.from,
        to: obj.to,
        no_of_days,
        room_discount_amt: parseFloat(obj.discountAmount),
        // rent_per_day,
        // total_rent,
        room_discount: obj.discount,
        paid_amount: typeof obj.amount === "number" ? obj.amount : 0,
        // total_unpaid_amount: amount_after_dis - obj.amount,
        nationality: obj.nationality,
        remark: "Advance payment for booking",
        status: "Active",
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        formikHelpers.resetForm();
        closeRef.current.click();
        toast.success(response.data.message);
      }
    },
  });
  const {
    data: availableRooms,
    isSuccess,
    isLoading: availableRoomsLoading,
  } = useGetAvailableRoomsByDateQuery(
    {
      hotel_id: user?.assignedHotel[0],
      fromDate: formik.values.from
        ? getStartDateOFBookingIST(formik.values.from)
        : "",
      toDate: formik.values.to ? getEndDateOfBookingIst(formik.values.to) : "",
    },
    { skip: !formik.values.to }
  );

  const roomsId = availableRooms?.data?.map((room_id) => room_id._id);

  const isAvailableRoom = roomsId?.includes(room?.data._id);

  const fromDate = new Date(formik.values.from).toLocaleDateString();
  const toDate = new Date(formik.values.to).toLocaleDateString();
  const handlePaymentChange = (e) => {
    const paymentMethod = e.target.value;
    if (paymentMethod === "Card" || paymentMethod === "Mobile_Banking") {
      formik.setFieldValue("paymentMethod", paymentMethod);
    } else {
      formik.setFieldValue("paymentMethod", paymentMethod);
      formik.setFieldValue("trxID", "");
    }
  };

  const handleAmount = (e) => {
    const inputValue = e.target.value;
    const fieldName = e.target.amount;

    if (inputValue >= 0) {
      // Update the Formik state
      formik.handleChange(e);
    } else if (inputValue === "") {
      e.target.value = 0;
      formik.handleChange(e);
    }
  };

  // Price Validation
  const handleChildren = (e) => {
    const inputValue = e.target.value;
    const fieldName = e.target.children;
    if (inputValue >= 0) {
      // Update the Formik state
      formik.handleChange(e);
    } else if (inputValue === "") {
      e.target.value = 0;
      formik.handleChange(e);
    }
  };

  const handleAmountDiscount = (e) => {
    if (room?.data?.price && totalRoomRent > 0) {
      const amountValue = Number(e.target.value);

      if (amountValue <= totalRoomRent) {
        formik.setFieldValue(
          "discountAmount",
          amountValue > 0 ? amountValue : ""
        );
        const percentage = calculatePercentageDiscount(
          totalRoomRent,
          amountValue
        );
        formik.setFieldValue("discount", percentage > 0 ? percentage : "");
      } else {
        formik.setFieldError(
          "discountAmount",
          "Discount amount can't be greater then total room rent"
        );
      }
    } else {
      formik.setFieldError(
        "discountAmount",
        "Please select from and to date first"
      );
    }
  };

  const handlePercentageDiscount = (e) => {
    if (room?.data?.price > 0 && totalRoomRent > 0) {
      const inputValue = Number(e.target.value);
      if (inputValue > 100 || inputValue < 0 || isNaN(inputValue)) {
        formik.setFieldError(
          "discount",
          "Please enter a number between 0 and 100"
        );
      } else {
        formik.setFieldValue("discount", inputValue > 0 ? inputValue : "");
        const discountAmount = calculateDiscountAmount(
          totalRoomRent,
          Number(e.target.value)
        );

        formik.setFieldValue(
          "discountAmount",
          discountAmount > 0 ? discountAmount : ""
        );
      }
    } else {
      formik.setFieldError("discount", "Please select from and to date first");
    }
  };

  useEffect(() => {
    if (isAvailableRoom === false) {
      setError("The room is not available");
    } else if (isAvailableRoom === true) {
      setError("");
    }
  }, [availableRooms]);

  const updateToDate = (fromDate) => {
    const nextDay = new Date(fromDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setRestrictedToDate(nextDay);
  };

  // calculate per day room rent and total room rent
  useEffect(() => {
    if (calculateNOD && room?.data?.price) {
      setTotalRoomRent(room?.data?.price * calculateNOD);
    }
  }, [room, calculateNOD]);

  //calculate nod
  useEffect(() => {
    if (formik.values.from !== "" && formik.values.to !== "") {
      const nod = Math.ceil(
        Math.abs(new Date(formik.values.from) - new Date(formik.values.to)) /
          (24 * 60 * 60 * 1000)
      );
      setCalculateNOD(nod);
    }
  }, [formik.values.from, formik.values.to]);

  useEffect(() => {
    if (fromDate === toDate) {
      setSameDateError("From date and To date can't be same");
    } else {
      setSameDateError("");
    }

    formik.setFieldValue("discount", "");
    formik.setFieldValue("discountAmount", "");
  }, [fromDate, toDate]);

  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          ref={closeRef}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            formik.handleReset();
            setError("");
            setRestrictedToDate(null);
            setCalculateNOD(0);
            setTotalRoomRent(0);
          }}
        >
          ✕
        </button>
      </form>

      <div>
        <h3 className={`text-2xl font-semibold mb-3`}>Booking</h3>
        <hr />
        <form
          autoComplete="off"
          className="form-control md:grid md:grid-cols-2 gap-4 mt-5"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col gap-3">
            <select
              name="bookingMethod"
              className="select select-md bg-transparent select-bordered border-gray-500/50 rounded w-full focus:outline-none"
              value={formik.values.bookingMethod}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Booking Method
              </option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            {formik.touched.bookingMethod && formik.errors.bookingMethod ? (
              <small className="text-red-600">
                {formik.errors.bookingMethod}
              </small>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            <select
              name="room_arr"
              className="select select-md select-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.room_arr}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                {room.data.roomNumber + " - " + room.data.category}
              </option>
            </select>
          </div>

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
            {formik.touched.guestName && Boolean(formik.errors.guestName) ? (
              <small className="text-red-600">
                {formik.touched.guestName && formik.errors.guestName}
              </small>
            ) : null}
          </div>
          {/* Address box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Address"
              name="address"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.address && Boolean(formik.errors.address) ? (
              <small className="text-red-600">
                {formik.touched.address && formik.errors.address}
              </small>
            ) : null}
          </div>
          {/* mobileNumber box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Mobile number"
              name="mobileNumber"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.mobileNumber &&
            Boolean(formik.errors.mobileNumber) ? (
              <small className="text-red-600">
                {formik.touched.mobileNumber && formik.errors.mobileNumber}
              </small>
            ) : null}
          </div>
          {/* emergency  box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Emergency Number"
              name="emergency_contact"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.emergency_contact}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.emergency_contact &&
            Boolean(formik.errors.emergency_contact) ? (
              <small className="text-red-600">
                {formik.touched.emergency_contact &&
                  formik.errors.emergency_contact}
              </small>
            ) : null}
          </div>

          {/* adult box */}
          <div className="flex flex-col gap-3">
            <input
              onWheel={(event) => event.currentTarget.blur()}
              type="number"
              placeholder="Adult"
              name="adult"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.adult}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.adult && Boolean(formik.errors.adult) ? (
              <small className="text-red-600">
                {formik.touched.adult && formik.errors.adult}
              </small>
            ) : null}
          </div>

          {/* children box */}
          <div className="flex flex-col gap-3">
            <input
              onWheel={(event) => event.currentTarget.blur()}
              type="number"
              placeholder="Children"
              name="children"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.children}
              onChange={handleChildren}
              onBlur={formik.handleBlur}
            />
            {formik.touched.children && Boolean(formik.errors.children) ? (
              <small className="text-red-600">
                {formik.touched.children && formik.errors.children}
              </small>
            ) : null}
          </div>

          {/* advanced amount */}
          <div className="flex flex-col gap-3">
            <input
              onWheel={(event) => event.currentTarget.blur()}
              type="number"
              placeholder="Advanced Amount"
              name="amount"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.amount}
              onChange={handleAmount}
              onBlur={formik.handleBlur}
            />
            {formik.touched.amount && Boolean(formik.errors.amount) ? (
              <small className="text-red-600">
                {formik.touched.amount && formik.errors.amount}
              </small>
            ) : null}
          </div>

          {/* payment method box */}
          <div className="flex flex-col gap-3">
            <select
              name="paymentMethod"
              className="select select-md bg-transparent select-bordered border-gray-500/50 rounded w-full focus:outline-none"
              value={formik.values.paymentMethod}
              onChange={handlePaymentChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Payment Method
              </option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Mobile_Banking">Mobile Banking</option>
              <option value="Oyo">Oyo</option>
              <option value="Fab">Fab</option>
            </select>
            {formik.touched.paymentMethod &&
            Boolean(formik.errors.paymentMethod) ? (
              <small className="text-red-600">
                {formik.touched.paymentMethod && formik.errors.paymentMethod}
              </small>
            ) : null}
          </div>
          {(formik.values.paymentMethod &&
            formik.values.paymentMethod === "Card") ||
          formik.values.paymentMethod == "Mobile_Banking" ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Transaction ID"
                name="trxID"
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
                value={formik.values.trxID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.trxID && Boolean(formik.errors.trxID) ? (
                <small className="text-red-600">
                  {formik.touched.trxID && formik.errors.trxID}
                </small>
              ) : null}
            </div>
          ) : null}

          {/* Date */}
          <div className="flex flex-col gap-3">
            <DatePicker
              dateFormat="dd/MM/yyyy"
              name="from"
              placeholderText={`From`}
              minDate={new Date()}
              selected={formik.values.from}
              className={`input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full`}
              onChange={(date) => {
                formik.setFieldValue("from", date);
                updateToDate(date);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.from && Boolean(formik.errors.from) ? (
              <small className="text-red-600">
                {formik.touched.from && formik.errors.from}
              </small>
            ) : null}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-3">
            <DatePicker
              dateFormat="dd/MM/yyyy"
              name="to"
              placeholderText={`To`}
              minDate={
                restrictedToDate === null || !formik.values.from
                  ? nextDate
                  : restrictedToDate
              }
              selected={formik.values.to}
              className={`input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full`}
              onChange={(date) => formik.setFieldValue("to", date)}
              onBlur={formik.handleBlur}
            />
            {formik.touched.to && Boolean(formik.errors.to) ? (
              <small className="text-red-600">
                {formik.touched.to && formik.errors.to}
              </small>
            ) : null}
          </div>
          
          <div className="flex flex-col gap-3">
            <input
              type="number"
              placeholder="Discount in percentage (%)"
              name="discount"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.discount}
              onChange={handlePercentageDiscount}
              onBlur={formik.handleBlur}
            />
            {formik.errors.discount && (
              <small className="text-red-600">{formik.errors.discount}</small>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="number"
              placeholder="Discount in Amount (Rs)"
              name="discountAmount"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.discountAmount}
              onChange={handleAmountDiscount}
              onBlur={formik.handleBlur}
            />
            {formik.errors.discountAmount && (
              <small className="text-red-600">
                {formik.errors.discountAmount}
              </small>
            )}
          </div>
          {/* Nationality box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nationality"
              name="nationality"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none"
              value={formik.values.nationality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.nationality &&
            Boolean(formik.errors.nationality) ? (
              <small className="text-red-600">
                {formik.touched.nationality && formik.errors.nationality}
              </small>
            ) : null}
          </div>

          {/* button */}
          <div className="flex col-span-2 mx-auto text-red-600 mt-2">
            {error && <p>{error}</p>}
          </div>
          <p className="flex col-span-2 mx-auto text-red-600 mt-2">
            {sameDateError}
          </p>
          <div
            className={`flex justify-between col-span-2 mx-auto md:w-[60%] w-full`}
          >
            <button
              disabled={isLoading || isAvailableRoom === false || sameDateError}
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
    </>
  );
};

export default AddBookingSelect;
