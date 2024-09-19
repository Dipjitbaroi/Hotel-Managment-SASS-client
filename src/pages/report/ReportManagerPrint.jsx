import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import {
  useGetCheckoutDataByBookingIdQuery,
  useGetHotelByManagerIdQuery,
} from "../../redux/room/roomAPI";
import {
  getFormateDateAndTime,
  getIndianFormattedDate,
} from "../../utils/timeZone";
import {
  getOnlyFormatDate,
  getformatDateTime,
  versionControl,
} from "../../utils/utils";

const ReportManagerPrint = ({ data, roomNumber, managerId }) => {
  const { user } = useSelector((state) => state.authSlice);
  const {
    data: hotelInfo,
    isLoading: isHotelLoading,
    isSuccess: isHotelSuccess,
  } = useGetHotelByManagerIdQuery(
    user.role === "manager" ? user?._id : user?.role === "owner" ? managerId : ""
  );

  const total = Math.ceil(
    data?.total_rent_after_dis +
      data?.total_additional_charges +
      data?.total_service_charges +
      data?.room_posted_bills +
      data?.total_tax
  );

  return (
    <div>
      <div>
        <div className={`text-center mb-6`}>
          <img className="w-24 h-24 mx-auto p-2" src={logo} alt="logo" />
          <span>Customer Receipt</span> <br />
          <span>Issue Date : {getformatDateTime()}</span> <br />
          <span>Invoice Number : {data?.invoice_no}</span>
        </div>
      </div>

      {/* invoice From */}
      <div className="">
        <div>
          <div className="grid grid-cols-2 gap-24 px-5 mr-5">
            <div className="py-2">
              <h2 className="font-bold">Invoice From</h2>
              <div className="flex items-center">
                <div>
                  <div className="flex gap-[2.1rem]">
                    <p>Hotel Name</p>
                    <p> : {hotelInfo ? hotelInfo[0]?.name : ""}</p>
                  </div>
                  <div className="flex gap-[1.5rem]">
                    <p>Branch Name</p>
                    <p> : {hotelInfo ? hotelInfo[0]?.branch_name : ""}</p>
                  </div>

                  <div className="flex gap-[5.1rem]">
                    <p>Email</p>
                    <p className="break-all">
                      {" "}
                      : {hotelInfo ? hotelInfo[0]?.email : ""}
                    </p>
                  </div>

                  <div className="flex gap-[4.7rem]">
                    <p>Phone</p>
                    <p> : {hotelInfo ? hotelInfo[0]?.phone_no : ""}</p>
                  </div>

                  <div className="flex gap-[4rem]">
                    <p>Address</p>
                    <p>: {hotelInfo ? hotelInfo[0]?.address : ""}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-2 ">
              <h2 className="font-bold">Invoice To</h2>
              <div className="flex items-center">
                <div>
                  <div className="flex gap-[4.5rem]">
                    <p>Name </p>
                    <p> : {data?.guestName}</p>
                  </div>
                  <div className="flex gap-[4.3rem]">
                    <p>Phone</p>
                    <p> : {data?.mobileNumber}</p>
                  </div>
                  <div className="flex gap-[3.6rem]">
                    <p>Address</p>
                    <p> : {data?.address}</p>
                  </div>
                  <div className="flex gap-[1.3rem]">
                    <p>CheckIn Date </p>
                    <p> : {getIndianFormattedDate(data?.checkin_date)}</p>
                  </div>
                  <div className="flex gap-[0.5rem]">
                    <p>CheckOut Date </p>
                    <p> : {getIndianFormattedDate(data?.to)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* payment method */}
      <section className="bg-white p-4 rounded">
        <table className="w-full border border-black/20 text-sm">
          <thead className="bg-[#e5e7eb] border border-black/20">
            <tr className="grid grid-cols-8 items-center text-left">
              <th className="py-1 px-3 text-black text-sm font-medium border-r border-black/20">
                Room No
              </th>
              <th className="col-span-7 text-center text-black text-sm font-medium">
                Room Rent List
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="grid grid-cols-8 text-left">
              <td className="py-1 px-3 border-r border-black/20">
                {roomNumber}
              </td>

              <td className="col-span-7 p-1 overflow-x-auto">
                <table className="bg-[#e5e7eb] w-full">
                  <tbody>
                    <tr>
                      <td className="p-2 border border-black/20 align-bottom font-medium">
                        From Date
                      </td>
                      <td className="p-2 border border-black/20 align-bottom font-medium">
                        To Date
                      </td>
                      <td className="p-2 border border-black/20 align-bottom font-medium">
                        NoD
                      </td>
                      <td className="p-2 border border-black/20 align-bottom font-medium">
                        (Rs.) Rent/Day
                      </td>
                      <td className="p-2 border border-black/20 align-bottom font-medium">
                        (Rs.) Total Rent
                      </td>
                      <td className="p-2 border border-black/20 align-bottom font-medium">
                        (Rs.) Discount/Room
                      </td>
                      <td className="p-2 border border-black/20 align-bottom font-medium">
                        (Rs.) Amount After Discount
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-black/20 align-top text-xs">
                        {getOnlyFormatDate(data?.from)}
                      </td>
                      <td className="p-2 border border-black/20 align-top text-xs">
                        {getOnlyFormatDate(data?.to)}
                      </td>
                      <td className="p-2 border border-black/20 align-top text-xs">
                        {data?.no_of_days}
                      </td>
                      <td className="p-2 border border-black/20 align-top text-xs">
                        {data?.rent_per_day}
                      </td>
                      <td className="p-2 border border-black/20 align-top text-xs">
                        {data?.total_room_rent}
                      </td>
                      <td className="p-2 border border-black/20 align-top text-xs">
                        {data?.room_discount} %
                      </td>
                      <td className="p-2 border border-black/20 align-top text-xs">
                        {data?.total_rent_after_dis}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Billing section */}
      <section>
        <div className=" grid grid-cols-4 px-5">
          <div className="space-y-2">
            <p>SubTotal</p>
            {/* <p>Tax</p> */}
            <p>Additional Changes</p>
            <p>Service Charge</p>
            <p>Room Posted Bill</p>
            <p>Tex Amount</p>
            <p className="text-lg font-bold">GrandTotal</p>
          </div>
          <div className="space-y-2">
            <p>: Rs. {data?.total_rent_after_dis}</p>
            <p>: Rs. {data?.total_additional_charges}</p>
            <p>: Rs. {data?.total_service_charges}</p>
            <p>: Rs. {data?.room_posted_bills}</p>
            <p>: Rs. {data?.total_tax}</p>
            <p>: Rs. {total}</p>
          </div>
        </div>
      </section>
      {/* Billing section */}

      <div className="text-xs px-4 mt-5">
        <h1 className="font-semibold">TERMS & CONDITIONS</h1>
        <ol className="list-decimal p-4 text-gray-500">
          <li>
            Terms of Use Our Site may use "cookies"to enhance User experience
          </li>
          <li>
            User's web browser places cookies on their hard drive for
            record-keeping purposes and sometimes to track information about
            them
          </li>
          <li>
            User may choose to set their web browser to refuse cookies, or to
            alert you when cookies are being sen
          </li>
          <li>
            If they do so, note that some parts of the Site may not function
            properly
          </li>
        </ol>
      </div>
      <div className="absolute bottom-0 w-full my-10">
        <div className="p-4 flex justify-between">
          <div>
            <p>__________________</p>
            <p>Guest Signature</p>
          </div>
          <div>
            <p>_______________________</p>
            <p>Authorized Signature</p>
          </div>
        </div>
      </div>
      <h1 className="text-center absolute bottom-0 pb-2 w-full">
        Powered by <span className="text-xl text-green-slimy">JS Encoder</span>.
        Copyright © 2023. All rights reserved.Version {versionControl}
        {/* {versionControl} */}
      </h1>
    </div>
  );
};
export default ReportManagerPrint;
