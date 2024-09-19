import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useFormik } from "formik";
import { AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai";
import PaymentMethod from "./PaymentMethod.jsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF.jsx";
import { jsPDF } from "jspdf";
import ReactToPrint from "react-to-print";
import CheckOutPrint from "./CheckOutPrint.jsx";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../components/Modal.jsx";
import RefundPaymentModal from "./RefundPaymentModal.jsx";
import { setCalculateCollectedAmount } from "../../../redux/checkoutInfoCal/checkoutInfoCalSlice.js";
import { useNavigate } from "react-router-dom";

const PaymentSection = ({
  pBill,
  formik,
  paymentList,
  setPaymentList,
  data,
  isHotelSuccess,
  hotelInfo,
  roomData,
  addCheckOutLoading,
  totalPayableAmount,
  componentRef,
  trxError,
  invoiceNumber,
}) => {
  const [PDF, setPDF] = useState([]);
  const [colAmount, setColAmount] = useState(0);
  const [checkoutBtn, setCheckoutBtn] = useState(true);
  const [remainAmount, setRemainAmount] = useState(5493.0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookingInfo, calculateBalance } = useSelector(
    (state) => state.checkoutInfoCalSlice
  );
  const totalRefund =
    data?.room_ids?.length === 1 ? data?.total_balance + colAmount - pBill : 0;
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "amount") {
      if (
        calculateBalance < 0 &&
        Number(value) <= Math.ceil(pBill - bookingInfo?.total_balance)
      ) {
        const list = [...paymentList];
        list[index][name] = value;
        setPaymentList(list);
        dispatch(setCalculateCollectedAmount(value));
      }
    } else if (name === "method" && value === "Cash") {
      const list = [...paymentList];
      list[index][name] = value;
      list[index]["trx"] = "";
      setPaymentList(list);
    } else {
      const list = [...paymentList];
      list[index][name] = value;
      setPaymentList(list);
    }
  };

  const handleRemove = (index) => {
    const list = [...paymentList];
    list.splice(index, 1);
    setPaymentList(list);
  };
  const handleAdd = () => {
    setPaymentList([
      ...paymentList,
      { method: "", amount: "", trx: "", date: "" },
    ]);
  };
  useEffect(() => {
    const totalCol = paymentList.reduce(
      (total, current) =>
        total + (Boolean(current.amount) ? +current.amount : 0),
      0
    );

    setColAmount(totalCol);
  }, [paymentList]);

  // for printing

  return (
    <section>
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left Side */}
        <div className="bg-white rounded pb-4">
          {/* bill statement */}
          <h3 className="p-5 text-xl mt-5">Bill Statement</h3>
          <hr />
          <PaymentMethod
            paymentList={paymentList}
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            handleChange={handleChange}
            totalRefund={totalRefund}
            pBill={pBill}
            roomData={roomData}
            trxError={trxError}
          />
        </div>
        {/* Right Side */}
        <div className="bg-white rounded">
          <h3 className="p-5 text-xl mt-5">Balance Details</h3>
          <hr />

          <div className="p-5 grid sm:grid-cols-2 grid-cols-1 items-center text-sm font-semibold">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-10">
                <p>Remain Amount</p>
                <p>
                  {calculateBalance > 0
                    ? 0
                    : Math.ceil(pBill - bookingInfo?.total_balance)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <p>Refund Amount</p>
                <p>{totalRefund < 0 ? 0 : totalRefund}</p>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <p>Collected Amount</p>

                <p>{Math.ceil(colAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <ReactToPrint
          trigger={() => (
            <button
              title="please select payment method"
              className="bg-green-slimy text-white px-2 rounded-sm"
            >
              Print
            </button>
          )}
          content={() => componentRef.current}
        />
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <CheckOutPrint
              invoiceNumber={invoiceNumber}
              pBill={pBill}
              colAmount={colAmount}
              data={data}
              paymentList={paymentList}
              isHotelSuccess={isHotelSuccess}
              hotelInfo={hotelInfo}
              roomData={roomData}
            />
          </div>
        </div>

        <button
          disabled={addCheckOutLoading}
          type={`button`}
          onClick={() => formik.handleSubmit()}
          className={`btn btn-md bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case 
          ${
            addCheckOutLoading
              ? "btn-disabled"
              : calculateBalance < 0 &&
                colAmount !== Math.ceil(pBill - bookingInfo?.total_balance)
              ? "btn-disabled"
              : ""
          }
          `}
        >
          {totalRefund < 1
            ? "Checkout"
            : data?.room_ids?.length == 1
            ? "Checkout & Refund"
            : "Checkout"}
          {addCheckOutLoading ? (
            <span
              className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
              role="status"
            ></span>
          ) : null}
        </button>
      </div>
    </section>
  );
};

export default PaymentSection;
