import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import Select from "react-select";
import * as yup from "yup";
import {
  useAddBookingMutation,
  useGetRoomsAndHotelsQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import DatePicker from "react-datepicker";
import store from "../../redux/store.js";
import toast from "react-hot-toast";
import { fromDateIsoConverter, toDateIsoConverter } from "../../utils/utils.js";
import RefundPaymentSection from "./RefundPaymentSection.jsx";

const RefundBookingModal = ({ bookingId, paidAmt }) => {
  const closeRef = useRef();
  return (
    <>
      <form className="" autoComplete="off" method="dialog">
        <button
          ref={closeRef}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>

      <div>
        <h3 className={`text-2xl font-semibold mb-3`}>Refund Payment</h3>
        <hr />
        <RefundPaymentSection
          paidAmt={paidAmt}
          closeRef={closeRef}
          bookingId={bookingId}
        />
      </div>
    </>
  );
};

export default RefundBookingModal;
