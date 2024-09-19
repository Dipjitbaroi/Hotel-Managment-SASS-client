import React, { useEffect, useState } from "react";
import { AiFillPrinter } from "react-icons/ai";
import {
  updateSubTotal,
  updateTax,
  updateServiceCharge,
  updateAdditionalCharge,
  updateDiscountOffer,
  setGrandTotal,
  setRoomPostedBill,
  setExtraDiscount,
  setTexAmount,
  setCalculateBalance,
} from "../../../redux/checkoutInfoCal/checkoutInfoCalSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const BillingSection = ({
  data,
  totalBilling,
  setTotalBilling,
  setPBill,
  setComment,
}) => {
  const [discount, setDiscount] = useState(false);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [breakAmt, setBreakAmt] = useState(0);
  const [billing, setBilling] = useState([{ amount: "" }, { amount: "" }]);
  const [poolBill, setPollBill] = useState(0);
  const [foodBill, setFoodBill] = useState(0);
  const [gymBill, setGymBill] = useState(0);
  const { amountAfterDiscount } = useSelector((state) => state.addOrderSlice);
  const { additionalCharge } = useSelector(
    (state) => state.checkoutInfoCalSlice
  );
  const dispatch = useDispatch();
  // const billingState = useSelector((state) => state.checkoutInfoCalSlice);
  // const { subTotals } = billingState;

  const totalUnpaidAmount = amountAfterDiscount + poolBill + gymBill + foodBill;
  const handleDiscountChange = (val) => {
    const newValue = Math.min(Math.max(val, 0), 100);
    const amount = (totalUnpaidAmount * newValue) / 100;

    setDiscountAmt(amount);
    dispatch(setExtraDiscount(val));
  };
  // discount ammount
  dispatch(updateDiscountOffer(Math.ceil(discountAmt)));
  // dispatch(updateSubTotal(totalUnpaidAmount));

  const handleAmountChange = (idx, val) => {
    const arr = [...billing];
    arr.splice(idx, 1, { amount: val });
    setBilling(arr);
    dispatch(updateServiceCharge(val));
  };

  const handleTaxChange = (idx, val) => {
    const arr = [...billing];
    const amount = (totalUnpaidAmount * val) / 100;
    dispatch(setTexAmount(Math.ceil(amount)));
    arr.splice(idx, 1, { amount });
    setBilling(arr);

    const taxMoney = (subTotals * val) / 100;
    dispatch(updateTax(taxMoney));
  };

  useEffect(() => {
    const totalBilling = billing.reduce(
      (total, current) =>
        total + (Boolean(current?.amount) ? +current.amount : 0),
      0
    );

    setTotalBilling(totalBilling);
  }, [billing]);

  useEffect(() => {
    if (data) {
      setPollBill(
        data?.pool_bills?.reduce(
          (total, current) => total + current?.unpaid_amount,
          0
        )
      );
      setFoodBill(
        data?.food_bills?.reduce(
          (total, current) => total + current?.unpaid_amount,
          0
        )
      );
      setGymBill(
        data?.gym_bills?.reduce(
          (total, current) => total + current?.unpaid_amount,
          0
        )
      );
    }
  }, [data]);

  useEffect(() => {
    const totalRoomPostedBill = poolBill + foodBill + gymBill;
    dispatch(setRoomPostedBill(totalRoomPostedBill));
    if (data) {
      const total = Math.ceil(totalUnpaidAmount + totalBilling + breakAmt);
      setPBill(Math.ceil(total));
    }
  }, [
    data,
    poolBill,
    foodBill,
    gymBill,
    totalBilling,
    discount,
    discountAmt,
    breakAmt,
    totalUnpaidAmount,
  ]);

  useEffect(() => {
    const total =
      data?.booking_info?.paid_amount >=
      Math.ceil(
        totalUnpaidAmount +
          totalBilling +
          breakAmt -
          (discount ? discountAmt : 0) -
          data?.booking_info?.paid_amount
      )
        ? 0
        : Math.ceil(
            totalUnpaidAmount +
              totalBilling +
              breakAmt -
              (discount ? discountAmt : 0) -
              data?.booking_info?.paid_amount
          );
    dispatch(setGrandTotal(total));
  }, [
    data,
    totalBilling,
    discount,
    discountAmt,
    breakAmt,
    poolBill,
    gymBill,
    foodBill,
  ]);
  useEffect(() => {
    const totalBill = Math.ceil(totalUnpaidAmount + totalBilling + breakAmt);
    dispatch(
      setCalculateBalance(
        Math.ceil(data?.booking_info?.total_balance - totalBill)
      )
    );
  }, [totalUnpaidAmount, totalBilling, breakAmt, data]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  return (
    <section className="grid lg:grid-cols-3 gap-5">
      <div className="bg-white rounded">
        <h3 className="p-5 text-xl">Billing Details</h3>
        <hr />
        <table className="text-sm font-semibold m-5">
          <tbody>
            <tr>
              <td>Overall Room Bills</td>
              <td className="pl-2">{Math.ceil(totalUnpaidAmount)}</td>
            </tr>
            <div className={`mt-5`}></div>
            <tr>
              <td>Service Charge</td>
              <td className="align-top pb-2">
                <div className={`flex gap-1 items-center`}>
                  <span>Rs.</span>
                  <input
                    onWheel={(event) => event.currentTarget.blur()}
                    type="number"
                    className={`outline-none border rounded mr-1 pl-2 text-slate-500`}
                    onChange={(e) => handleAmountChange(0, +e.target.value)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>Tax</td>
              <td className="align-top pl-2 pb-2">
                <div className={`flex gap-1 items-center`}>
                  <span>%</span>
                  <input
                    onWheel={(event) => event.currentTarget.blur()}
                    type="number"
                    className={`outline-none border rounded mr-1 pl-2 text-slate-500`}
                    onChange={(e) => handleTaxChange(1, +e.target.value)}
                  />
                </div>
              </td>
            </tr>
            {/* <tr>
              <td>Payable Amount</td>
              <td className="align-top pl-2 pb-2">
                {Math.ceil(totalUnpaidAmount + totalBilling + additionalCharge)}
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded">
        <h3 className="p-5 text-xl">Additional Charges</h3>
        <hr />
        <table className="text-sm font-semibold m-5">
          <tbody>
            <tr>
              <td className="align-top">Additional Charges</td>
              <td className="pl-5">
                <input
                  onWheel={(event) => event.currentTarget.blur()}
                  type="number"
                  className="mb-3 border rounded-md p-2 outline-none"
                  onChange={(e) => {
                    setBreakAmt(+e?.target?.value);
                    dispatch(updateAdditionalCharge(+e?.target?.value));
                  }}
                />
              </td>
            </tr>
            <tr>
              <td className="align-top">Additional Charges Comments</td>
              <td className="pl-5">
                <textarea
                  onChange={handleCommentChange}
                  className="border rounded-md p-[6px] bg-transparent outline-none resize-none"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="p-5 text-xl mt-8">Payment Details</h3>
        <hr />
        <table className="text-sm font-semibold m-5">
          <tbody className="flex flex-col gap-3">
            <tr>
              <td className="pr-2">Total Room Bills</td>
              <td> {Math.ceil(totalUnpaidAmount + totalBilling + breakAmt)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded">
        <h3 className="p-5 text-xl">Room Posted Bill</h3>
        <hr />
        <div className="text-sm font-semibold p-5">
          <div className="grid grid-cols-4 gap-2 border-y border-black/20 p-2">
            <p className="col-span-2">Bill Type</p>
            <p>(Rs.) Total</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 opacity-80 font-extralight border-b border-black/20 pb-2 px-2">
            <p className="capitalize whitespace-nowrap col-span-2">Pool</p>
            <p>{poolBill}</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 opacity-80 font-extralight border-b border-black/20 pb-2 px-2">
            <p className="capitalize whitespace-nowrap col-span-2">
              Restaurant
            </p>
            <p>{foodBill}</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 opacity-80 font-extralight pb-2 px-2">
            <p className="capitalize whitespace-nowrap col-span-2">Gym</p>
            <p>{gymBill}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BillingSection;
