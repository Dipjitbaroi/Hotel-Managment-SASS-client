import React, { useState } from "react";
import { MdOutlineClear } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
// const [discount, setDiscount] = useState(false);

const PaymentMethod = ({
  paymentList,
  handleAdd,
  handleRemove,
  handleChange,
  totalRefund,
  pBill,
  roomData,
  trxError,
}) => {
  const [isRequired, setRequired] = useState("");

  const paymentSchema = yup.object({
    trx: yup.string().when(["method"], ([method], schema) => {
      if (method === "Card" || method === "Mobile_Banking")
        return schema.required("Transaction ID is required");
      else return schema;
    }),

    // date: yup.date().required("Date is required"),
  });

  const formik = useFormik({
    initialValues: paymentList,
    validationSchema: yup.array().of(paymentSchema),
  });
  return (
    <div className={`mt-5 space-y-3`}>
      {paymentList.map((elem, idx) => {
        return (
          <>
            <div className="relative grid grid-cols-2 gap-4 pt-2 px-14">
              <div className="flex flex-col gap-3">
                <select
                  name={`method`}
                  className="select select-sm bg-transparent select-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                  onChange={(e) => handleChange(e, idx)}
                  value={elem.method}
                >
                  <option value="" selected disabled>
                    Payment Method
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile_Banking">Mobile Banking</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  value={elem.amount}
                  onWheel={(event) => event.currentTarget.blur()}
                  disabled={!elem?.method}
                  placeholder="Amount"
                  name="amount"
                  className={`input input-sm input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2 
                  ${!elem?.method ? "cursor-not-allowed" : ""}
                  `}
                  onChange={(e) => handleChange(e, idx)}
                />
              </div>
              {(elem?.method && elem?.method === "Card") ||
              elem?.method == "Mobile_Banking" ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Trx ID"
                    value={elem.trx}
                    name="trx"
                    className="input input-sm input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
                    onChange={(e) => handleChange(e, idx)}
                  />
                  {Boolean(trxError) ? (
                    <small className="text-red-600">Trx ID is Required</small>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  name="date"
                  placeholderText={`Date`}
                  selected={elem.date}
                  className={`input input-sm bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full`}
                  onChange={(date) =>
                    handleChange({ target: { name: "date", value: date } }, idx)
                  }
                />
              </div>
              {paymentList.length !== 1 && (
                <div
                  className={`absolute top-1/2 -translate-y-1/2 right-5 flex justify-end text-red-600 hover:text-green-slimy cursor-pointer transition-colors duration-500 `}
                  onClick={() => handleRemove(idx)}
                >
                  <FaTrash />
                </div>
              )}
            </div>
            {/* <div className={`px-14 pb-4`}>
              {paymentList.length - 1 === idx && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case w-fit mt-4"
                >
                  Add more
                </button>
              )}
            </div> */}
          </>
        );
      })}
    </div>
  );
};

export default PaymentMethod;
