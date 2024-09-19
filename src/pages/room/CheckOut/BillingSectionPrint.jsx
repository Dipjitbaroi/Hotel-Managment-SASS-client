import React, { useEffect, useState } from "react";
import { AiFillPrinter } from "react-icons/ai";
import { useSelector } from "react-redux";

const BillingSectionPrint = ({
  data,
  totalBilling,
  setTotalBilling,
  setPBill,
}) => {
  const billingState = useSelector((state) => state.checkoutInfoCalSlice);
  const {
    subTotals,
    extraDiscount,
    tax,
    serviceCharge,
    additionalCharge,
    discountOffer,
    grandTotal,
    roomPostedBill,
    texAmount,
    calculatePayableAmount,
  } = billingState;
  return (
    <section>
      <div className=" grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <p>SubTotal</p>
          {/* <p>Tax</p> */}
          <p>Additional Changes</p>
          <p>Service Charge</p>
          <p>Room Posted Bill</p>
          <p>Tex Amount</p>
          <p className="text-lg font-bold">GrandTotal</p>
        </div>
        <div className="space-y-4">
          <p>: Rs.{" " + subTotals}</p>
          {/* <p>: (Rs.){tax}</p> */}
          <p>: Rs.{" " + additionalCharge}</p>
          <p>: Rs.{" " + serviceCharge}</p>
          <p>: Rs.{" " + roomPostedBill}</p>
          <p>: Rs.{" " + texAmount}</p>
          <p>
            : Rs.
            {" " +
              (subTotals +
                additionalCharge +
                serviceCharge +
                roomPostedBill +
                texAmount)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BillingSectionPrint;
