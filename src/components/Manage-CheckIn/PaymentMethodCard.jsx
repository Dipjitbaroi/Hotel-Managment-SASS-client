import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaEyeSlash } from "react-icons/fa";
import { useMakePaymentMutation } from "../../redux/room/roomAPI";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

// form validation
const validationSchema = yup.object({
  paymentMethod: yup.string().required("Payment method is required"),

  trxID: yup.string().when(["paymentMethod"], ([paymentMethod], schema) => {
    if (paymentMethod !== "Cash")
      return schema.required("Transaction ID is required");
    else return schema;
  }),

  amount: yup.number(),
  description: yup.string().required("Description is required"),
});

const PaymentMethodCard = (booking) => {
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams();
  const { user } = useSelector((state) => state.authSlice);
  const [makePayment] = useMakePaymentMutation();
  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };
  const formik = useFormik({
    initialValues: {
      amount: "",
      description: "",
      paymentMethod: "",
      trxID: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      setLoading(true);
      const response = await makePayment({
        manager_id: user._id,
        booking_id: id,
        amount: Number(values.amount),
        paymentMethod: values.paymentMethod,
        tran_id: values.trxID,
        remark: values.description,
        payment_for: "Deposit",
      });
      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        setLoading(false);
        formikHelpers.resetForm();
        toast.success(response.data.message);
      }
    },
  });

  const handlePaymentChange = (e) => {
    const paymentMethod = e.target.value;
    if (paymentMethod === "Card" || paymentMethod === "Mobile_Banking") {
      formik.setFieldValue("paymentMethod", paymentMethod);
    } else {
      formik.setFieldValue("paymentMethod", paymentMethod);
      formik.setFieldValue("trxID", "");
    }
  };

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

  return (
    <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200">
      <div className="text-2xl text-center">
        <h2>Make Payment </h2>
      </div>
      <hr className={`my-5`} />

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
              onChange={handlePaymentChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Payment Method
              </option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Mobile_Banking">Mobile Banking</option>
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

          <div className="flex flex-col gap-3">
            <input
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

          <div className="col-span-full flex flex-col gap-3">
            <textarea
              placeholder="Remark...."
              name="description"
              className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description &&
            Boolean(formik.errors.description) ? (
              <small className="text-red-600">
                {formik.touched.description && formik.errors.description}
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
              Pay
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

export default PaymentMethodCard;
