import React from "react";
import { getOnlyFormatDate, versionControl } from "../../utils/utils";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import { useGetHotelByManagerIdQuery } from "../../redux/room/roomAPI";

const ConfirmOrderPrint = ({ success, orderCalc }) => {
  const currentYear = new Date().getFullYear();
  // current date
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const { user } = useSelector((store) => store.authSlice);
  const { data: hotelInfo } = useGetHotelByManagerIdQuery(user?._id);

  return (
    <div>
      <div className={`text-center mb-6`}>
        <h6 className="text-gray-400 text-right text-[15px]">
          Service provided by Dak Hospitality Ltd
        </h6>
        <img className="w-24 h-24 mx-auto p-2" src={logo} alt="logo" />
        {/* <h1 className="font-bold text-2xl">DAK Hospital LTD</h1> */}
        <div>
          <h1 className="text-2xl ">Hotel Name : {hotelInfo ? hotelInfo[0]?.name : ""}</h1>
          <h4>Branch Name : {hotelInfo? hotelInfo[0]?.branch_name : ""}</h4>
        </div>
        <span>Customer Receipt</span> <br />
        <span>Issue Date: {getOnlyFormatDate()} </span>
      </div>
      <div className="overflow-x-auto border mt-3">
        <table className="table ">
          <thead>
            <tr className={`text-lg`}>
              <th>Name</th>
              <th>
                Surveyor <br /> Quantity
              </th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {success?.map((food, idx) => (
              <tr>
                <td>{food?.item}</td>
                <td>{food?.serveyor_quantity}</td>
                <td>{food?.price}</td>
                <td>{food?.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className={`text-sm bt-0`}>
            <tr className="border-t">
              <td colSpan={5}>
                <div className="mt-3">
                  <div className="pl-2 mb-4 w-[70%] text-[1rem] font-semibold">
                    <p className="flex gap-3  ">
                      Total Price :<span> {orderCalc.total}</span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        <div>
          <div className="mt-10">
            {/* <div className=" w-full mb-10 signature">
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
            </div> */}
          </div>
          <h1 className="text-center pl-10 page-footer">
            Powered by{" "}
            <span className="text-xl text-green-slimy">JS Encoder</span>.
            Copyright © {currentYear}. All rights reserved.Version{" "}
            {versionControl}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPrint;
