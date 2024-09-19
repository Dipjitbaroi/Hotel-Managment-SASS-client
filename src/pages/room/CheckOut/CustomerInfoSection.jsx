import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  getIndianTimeForCheckout,
  convertedToDate,
  getConvertedLocalDate,
  getCurrentTime,
  getCurrentTimeInIndia,
  getIndianFormattedDate,
} from "../../../utils/timeZone";
import {
  setCalculateAmountAfterDis,
  setCalculateNOD,
  setCalculatePayableAmount,
  setCalculateTotalRent,
  setCalculateUnpaidAmount,
  setToDate,
} from "../../../redux/checkoutInfoCal/checkoutInfoCalSlice";
import DateTimePicker from "react-datetime-picker";
import { parseISO } from "date-fns/esm";
import {
  getDiscountAmount,
  getFormateDateAndTime,
  getTodayFormateDate,
} from "../../../utils/utils";

const CustomerInfoSection = ({ data }) => {
  const {
    refundAmount,
    additionalCharge,
    serviceCharge,
    texAmount,
    toDate,
    fromDate,
    roomInfo,
    bookingInfo,
    calculatePayableAmount,
    calculateAmountAfterDis,
    calculateBalance,
    calculateCollectedAmount,
  } = useSelector((state) => state.checkoutInfoCalSlice);
  const dispatch = useDispatch();

  //select check out time
  const [time, setTime] = useState(getCurrentTime());

  // set new updated checkout date.
  const [updatedDate, setUpdatedDate] = useState(null);

  const totalPayableAmount =
    calculatePayableAmount + additionalCharge + serviceCharge + texAmount;

  // after change the checkout date we need to update the payable amount. this func will do this.
  const updatePayableAmount = (no_of_days) => {
    const afterDisPrice = getDiscountAmount(
      roomInfo?.total_room_rent,
      bookingInfo?.room_discount
    );
    const updatedDiscount = getDiscountAmount(
      Math.ceil(no_of_days * roomInfo?.rent_per_day),
      bookingInfo?.room_discount
    );
    const oldPayableAmount = data?.total_payable_amount - afterDisPrice;

    const updatedPayableAmount = oldPayableAmount + updatedDiscount;
    dispatch(setCalculatePayableAmount(updatedPayableAmount));
    dispatch(
      setCalculateUnpaidAmount(updatedPayableAmount - data?.paid_amount)
    );
  };

  // after change the checkout date we need to update the total room rent. this func will do this.
  const updatedTotalRent = (NOD) => {
    const totalRentWithOutSelectedRoom =
      data?.total_rent - roomInfo?.total_room_rent;
    const newTotalSelectedRoomRent = NOD * roomInfo?.rent_per_day;
    const updatedTotalRoomRent =
      totalRentWithOutSelectedRoom + newTotalSelectedRoomRent;
    dispatch(setCalculateTotalRent(updatedTotalRoomRent));
    const updatedTotalRentAfterDis = getDiscountAmount(
      updatedTotalRoomRent,
      bookingInfo?.room_discount
    );
    dispatch(setCalculateAmountAfterDis(updatedTotalRentAfterDis));
  };

  // when we are update the check out date we have to call this with new date
  const updateCheckoutDate = (newDate, hours, minutes) => {
    const checkInDate = new Date(fromDate);
    const checkOutDate = new Date(newDate);
    const new_no_of_days = Math.ceil(
      Math.abs(checkInDate - checkOutDate) / (24 * 60 * 60 * 1000)
    );
    const newToDate = checkOutDate.toISOString();
    dispatch(setToDate(newToDate));
    dispatch(
      setCalculateNOD(
        hours === 12 &&
          minutes <= 30 &&
          getTodayFormateDate(newDate) !== getTodayFormateDate(fromDate) &&
          new_no_of_days > 1
          ? new_no_of_days - 1
          : new_no_of_days
      )
    );
    updatePayableAmount(
      hours === 12 &&
        minutes <= 30 &&
        getTodayFormateDate(newDate) !== getTodayFormateDate(fromDate) &&
        new_no_of_days > 1
        ? new_no_of_days - 1
        : new_no_of_days
    );
    updatedTotalRent(
      hours === 12 &&
        minutes <= 30 &&
        getTodayFormateDate(newDate) !== getTodayFormateDate(fromDate) &&
        new_no_of_days > 1
        ? new_no_of_days - 1
        : new_no_of_days
    );
  };

  // initially check out time is 11.49 am if manager change the time then this func will call and update the new time and this function will check if the time is more then 3 pm then it will add one day more.
  const updateCheckoutTime = (newTime, newDate) => {
    // const selectedDate = new Date(newDate);

    const [hours, minutes] = newTime.split(":");

    // selectedDate.setHours(hours, minutes, 0, 0);
    const hoursNumeric = parseInt(hours, 10);
    const minutesNumeric = parseInt(minutes, 10);
    const selectedDate = getIndianTimeForCheckout(
      getTodayFormateDate(newDate),
      newTime
    );
    updateCheckoutDate(selectedDate, hoursNumeric, minutesNumeric);
  };

  // when we are change the checkout date then this func will call
  const handleToDateChange = (newDate) => {
    setUpdatedDate(parseISO(newDate));
    if (time) {
      updateCheckoutTime(time, newDate);
    } else {
      updateCheckoutDate(newDate, 11.49, 0);
    }
  };

  // this func will call when update the time.
  const handleTime = (value) => {
    if (value) {
      updateCheckoutTime(value, updatedDate);
    }
    setTime(value);
  };

  // set the initial checkout date to the state
  useEffect(() => {
    setUpdatedDate(toDate);
  }, [toDate]);
  return (
    <section className="bg-white rounded">
      <h3 className="p-5 text-xl">Customer Details</h3>
      <hr />
      <div className="p-5 grid md:grid-cols-2 grid-cols-1 items-center text-sm font-semibold ">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap">Name :</p>
            <p className=" break-all">{data?.guestName}</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap">Room No :</p>
            <p className="break-all">
              {data?.room_ids?.map((i) => i?.roomNumber).join(", ")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap">Mobile No :</p>
            <p className="break-all">{data?.mobileNumber}</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap break-all">Address :</p>
            <p className=" break-words">{data?.address}</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap">Total Payable Amount :</p>
            <p className=" break-all">{totalPayableAmount}</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap">Total Paid Amount :</p>
            <p className="break-all">{data?.paid_amount}</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap">Total Unpaid Amount :</p>
            <p className="break-all">
              {totalPayableAmount - data?.paid_amount < 0
                ? 0
                : totalPayableAmount - data?.paid_amount}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap">Total Balance:</p>
            <p className="whitespace-nowrap break-all">{data?.total_balance}</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <p className="whitespace-nowrap">Current Balance:</p>
            <p className="whitespace-nowrap break-all">
              {calculateBalance + +calculateCollectedAmount}
            </p>
          </div>
          <hr />
          <div className="grid grid-cols-2">
            <p className="whitespace-nowrap break-all">Select Checkout Date</p>
            <div className="w-fll flex flex-col">
              <ReactDatePicker
                dateFormat="dd/MM/yyyy"
                name="from"
                placeholderText={`From`}
                selected={toDate ? parseISO(toDate) : ""}
                className={`ml-8 input input-md bg-transparent input-bordered border-gray-500 rounded focus:outline-none focus:border-green-slimy w-[80%] p-1`}
                onChange={handleToDateChange}
              />

              <div className="timePicker">
                <TimePicker
                  amPmAriaLabel="Select AM/PM"
                  format="h:m:s a"
                  value={time}
                  clockIcon={false}
                  onChange={handleTime}
                  clearIcon={false}
                  disableClock={true}
                  className={`timePickers  ml-8 input border--500/50 input-md bg-transparent rounded  focus:border-green-slimy w-[80%] mt-3 p-0  focus-within:outline-none`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerInfoSection;
