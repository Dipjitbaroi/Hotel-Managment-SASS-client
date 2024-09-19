import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

// form validation
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  age: yup
    .number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be an integer"),
  adult: yup
    .number()
    .required("Adult is required")
    .positive("Adult must be a positive number")
    .integer("Adult must be an integer"),
  paymentMethod: yup.string().required("Payment method is required"),
  trxID: yup.string().when(["paymentMethod"], ([paymentMethod], schema) => {
    if (paymentMethod !== "Cash")
      return schema.required("Transaction ID is required");
    else return schema;
  }),
  fromDate: yup.string().required("From Date is required"),
  toDate: yup.string().required("To Date is required"),
});

const RoomBookingEdit = () => {
  const handleSearchRoom = (e) => {
    const rooms = e.map((i) => i.value);
    setSelectedRooms(rooms);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      adult: "",
      children: "",
      paymentMethod: "",
      trxID: "",
      discount: "",
      fromDate: "",
      toDate: "",
    },
    validationSchema,
    onSubmit: (values) => {},
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
        <form
          autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 mt-5"
          onSubmit={formik.handleSubmit}
        >
          {/* name box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Guest name"
              name="name"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
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
          {/* age box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Age"
              name="age"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.age && Boolean(formik.errors.age) ? (
              <small className="text-red-600">
                {formik.touched.age && formik.errors.age}
              </small>
            ) : null}
          </div>
          {/* adult box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Adult"
              name="adult"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
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
              type="text"
              placeholder="Children"
              name="children"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.children}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.children && Boolean(formik.errors.children) ? (
              <small className="text-red-600">
                {formik.touched.children && formik.errors.children}
              </small>
            ) : null}
          </div>
          {/* payment method box */}
          <div className="flex flex-col gap-3">
            <select
              name="paymentMethod"
              className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
              value={formik.values.paymentMethod}
              onChange={handlePaymentChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Payment Method
              </option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mfs">Mobile Banking</option>
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
                className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
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
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Discount"
              name="discount"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.discount && Boolean(formik.errors.discount) ? (
              <small className="text-red-600">
                {formik.touched.discount && formik.errors.discount}
              </small>
            ) : null}
          </div>
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
          {/*Billing To box */}
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

export default RoomBookingEdit;
