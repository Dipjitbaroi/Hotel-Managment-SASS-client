import React from "react";
import { getIndianFormattedDate } from "../../../utils/timeZone";
import { useSelector } from "react-redux";
import { getOnlyFormatDate } from "../../../utils/utils";


const CustomerInfoPrint = ({ data, roomData }) => {
  const billingState = useSelector((state) => state.checkoutInfoCalSlice);

  return (
    <div className="py-2 ">
      <h2 className="font-bold"> Invoice To</h2>
      <div className="flex gap- items-center">
        <div className="grid grid-cols-2">
          <p>Name</p>
          <p>: {data.guestName}</p>
          <p>Phone</p>
          <p>: {data.mobileNumber}</p>
          <p>Address</p>
          <p>: {data.address}</p>
          <p>CheckIn</p>
          <p>: {getIndianFormattedDate(roomData[0]?.checkin_date)}
            
            </p>
          <p>CheckOut</p>
          <p>:    {getIndianFormattedDate(billingState?.toDate)}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CustomerInfoPrint;
