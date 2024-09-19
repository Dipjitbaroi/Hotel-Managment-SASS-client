import React from "react";
import SingleCheckoutItem from "../../components/restaurant/SingleCheckoutItem";
import logo from "../../assets/logo.png";
import {
  getOnlyFormatDate,
  getformatDateTime,
  versionControl,
} from "../../utils/utils";

const FoodCheckoutPrint = ({
  orderData,
  finalTotal,
  discountAmount,
  serviceChargeAmount,
  taxAmountAfter,
  checkOutTax,
  checkoutServiceCharge,
  checkOutDiscount,
  hotelInfo,
}) => {
  const grandTotal = orderData?.data?.items?.reduce(
    (accumulator, item) => accumulator + item.total,
    0
  );

  //current date
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return (
    <div>
      <div>
        <div>
          <div className={`text-center mb-6`}>
            <img className="w-24 h-24 mx-auto p-2" src={logo} alt="logo" />
            <h1 className="font-bold text-2xl">{/* DAK Hospital LTD */}</h1>
            <span>Customer Receipt</span> <br />
        
            <span>Issue Date : {getformatDateTime()} </span>
          </div>
        </div>
      </div>
      <section>
        <div className="grid grid-cols-2">
          <div>
            <div>
              <span className={`w-3`}>Restaurant Name</span>
              <span className="ml-5 mr-2">:</span>
              <span>{hotelInfo ? hotelInfo[0]?.name : ""}</span>
            </div>
            <div>
              <span className={`w-3`}>Branch Name</span>
              <span className="ml-12 mr-2">:</span>
              <span>{hotelInfo ? hotelInfo[0]?.branch_name : ""}</span>
            </div>
            <div>
              <span className={`w-3`}>Phone Number</span>
              <span className="ml-9 mr-2">:</span>
              <span>{hotelInfo ? hotelInfo[0]?.phone_no : ""}</span>
            </div>
            <div>
              <span className={`w-3`}>Email</span>
              <span className="ml-[105px] mr-2">:</span>
              <span>{hotelInfo ? hotelInfo[0]?.email : ""}</span>
            </div>
            <div className="grid grid-cols-2">
              <div>
                {" "}
                <span className={`w-3`}>Address</span>
                <span className="ml-[83px]">:</span>
              </div>
              <span className="-ml-9">
                {hotelInfo ? hotelInfo[0]?.address : ""}
              </span>
            </div>

            {/* {orderData?.data?.order_status === "CheckedOut" && (
              <div className="grid grid-cols-2">
                <div>
                  {" "}
                  <span className={`w-3`}>CheckOut Date</span>
                  <span className="ml-[83px]">:</span>
                </div>
                <span className="-ml-9">
                  {hotelInfo ? hotelInfo[0]?.updatedAt : ""}
                </span>
              </div>
            )} */}
          </div>
          <div>
            <span className={`w-26`}>
              {orderData?.data?.table_id ? "Table" : "Room"}
            </span>
            <span className="ml-[108px] mr-8">:</span>
            <span>
              {orderData?.data?.table_id
                ? orderData?.data?.table_id?.table_number
                : orderData?.data?.room_id?.roomNumber}
            </span>
            {/* {orderData?.data?.room_id && <span>{orderData?.data?.room_id}</span>} */}
            <br />
            <span className={`w-26`}>Invoice No</span>
            <span className="ml-[70px] mr-8">:</span>
            <span>{orderData?.data?.unique_id}</span>
          </div>
        </div>
        <div className="overflow-x-auto border mt-3 ">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>
                  Surveyor <br /> Quantity
                </th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData?.data?.items.map((item, i) => (
                <tr>
                  <td>{item?.item}</td>
                  <td>{item?.serveyor_quantity}</td>

                  <td className="flex gap-3 mb-4">{item.quantity}</td>
                  {/* <td>{food.quantity * food.price}</td> */}
                  <td>{item.price}</td>
                  <td>{item.total}</td>
                </tr>
              ))}

              <tr className="border-none">
                <td></td>
                <td></td>
                <td></td>
                <td>Total</td>
                <td>
                  {grandTotal}
                  {/* {orderData?.data?.total_price} */}
                </td>
                <td></td>
              </tr>
              <tr className="border-none">
                <td></td>
                <td></td>
                <td></td>
                <td>Discount</td>
                <td>
                  {orderData?.data?.order_status === "CheckedOut"
                    ? checkOutDiscount
                    : discountAmount}
                </td>
                <td></td>
              </tr>
              <tr className="border-none">
                <td></td>
                <td></td>
                <td></td>
                <td>Service Charge</td>
                <td>
                  {orderData?.data?.order_status === "CheckedOut"
                    ? checkoutServiceCharge
                    : serviceChargeAmount}
                </td>
                <td></td>
              </tr>
              <tr className="border-none">
                <td></td>
                <td></td>
                <td></td>
                <td>GST/Tax </td>
                <td>
                  {orderData?.data?.order_status === "CheckedOut"
                    ? checkOutTax
                    : taxAmountAfter}
                </td>
                <td></td>
              </tr>
              {orderData?.data?.order_status === "CheckedOut" ? (
                <tr className="border-none">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Grand Total</td>
                  <td>{orderData?.data?.grand_total}</td>
                  <td></td>
                </tr>
              ) : (
                <tr className="border-none">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Grand Total</td>
                  <td>{finalTotal}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <div>
        <div className="mt-10">
          <div className=" w-full mb-10 signature">
            <div className="mx-8 flex justify-between ">
              <div>
                <p>__________________</p>
                <p>Guest Signature</p>
              </div>
              <div>
                <p>_____________________</p>
                <p>Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-center page-footer">
          Powered by{" "}
          <span className="text-xl text-green-slimy">JS Encoder</span>.
          Copyright © 2023. All rights reserved.Version {versionControl}
        </h1>
      </div>
    </div>
  );
};

export default FoodCheckoutPrint;
