import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useCancelBookingMutation } from "../../redux/room/roomAPI";

// form validation
const validationSchema = yup.object({
  paymentMethod: yup.string().required("Payment method is required"),

  trxID: yup.string().when(["paymentMethod"], ([paymentMethod], schema) => {
    if (paymentMethod === "Card" || paymentMethod === "Mobile_Banking")
      return schema.required("Transaction ID is required");
    else return schema;
  }),

  amount: yup.number(),
});

const RefundPaymentSection = ({ bookingId, closeRef, paidAmt }) => {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();

  const formik = useFormik({
    initialValues: {
      amount: paidAmt?.paid_amount,
      paymentMethod: "",
      trxID: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      console.log({ values });
      const response = await cancelBooking({
        id: bookingId,
        data: {
          tran_id: formik.values.trxID,
          payment_method: formik.values.paymentMethod,
        },
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
  // Price Validation
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
  useEffect(() => {
    // Set the amount field value when paidAmt changes
    formik.setFieldValue("amount", paidAmt?.paid_amount);
  }, [paidAmt]);

  return (
    <div className="relative p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200">
      <div className="max-auto">
        <form
          className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col gap-3">
            <select
              name="paymentMethod"
              className="select select-md bg-transparent select-bordered border-gray-500/50 rounded w-full focus:outline-none"
              value={formik.values.paymentMethod}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {paidAmt?.paymentMethod && paidAmt?.paymentMethod === "Oyo" ? (
                <>
                  <option value="" selected disabled>
                    Payment Method
                  </option>
                  <option value="Oyo">Oyo</option>
                </>
              ) : paidAmt?.paymentMethod && paidAmt?.paymentMethod === "Fab" ? (
                <>
                  <option value="" selected disabled>
                    Payment Method
                  </option>
                  <option value="Fab">Fab</option>
                </>
              ) : (
                <>
                  <option value="" selected disabled>
                    Payment Method
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile_Banking">Mobile Banking</option>
                </>
              )}
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

          {/* advanced amount */}

          <div className="col-span-full flex flex-col gap-3">
            <input
              disabled
              type="number"
              placeholder="Amount"
              name="amount"
              className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
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

          {/* submit button */}
          <div className=" col-span-full text-end mb-5 ">
            <button
              disabled={isLoading}
              type="submit"
              className=" btn btn-sm  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case max-w-xs px-9 h-auto md:me-0"
            >
              Cancel & Refund
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
  );
};

export default RefundPaymentSection;
