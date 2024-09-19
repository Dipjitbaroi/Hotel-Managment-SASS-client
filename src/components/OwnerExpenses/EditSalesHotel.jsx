import React from "react";
import { useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import CheckOutPrint from "../../pages/room/CheckOut/CheckOutPrint";

const EditSalesHotel = () => {
  const navigate = useNavigate();
    // for printing
    const componentRef = useRef();
  return (
    <div>
      {/* Customer details */}
      <div>
        <section className="bg-white rounded">
          <div className="flex justify-between p-5">
            <div>
              <span
                className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
              </span>
            </div>
            <div className="btn btn-sm min-w-[5rem] bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case">
              <button>Print</button>
            </div>
                  {/* <ReactToPrint
          trigger={() => (
            <button
              title="please select payment method"
              className="bg-green-slimy text-white px-2 rounded-sm"
            >
              Print
            </button>
          )}
          content={() => componentRef.current}
        /> */}
        {/* <div style={{ display: "none" }}>
          <div ref={componentRef}>
            <CheckOutPrint
              pBill={pBill}
              colAmount={colAmount}
              data={data}
              paymentList={paymentList}
              isHotelSuccess={isHotelSuccess}
              hotelInfo={hotelInfo}
            />
          </div>
        </div> */}


{/* Checkout information */}
          </div>
          <h1 className="text-2xl text-center mt-2 mb-2">
            CheckOut Information
          </h1>
          <hr />
          <div className="p-5 text-sm font-semibold">
            <div className="flex justify-around">
              <div className="space-y-3">
                <h3 className="p-5 text-xl">Invoice From</h3>
                <p className="text-center">
                  Name <span>: Jon doe</span>
                </p>
                <p className="text-center">
                  Email <span>:jondoe@xyz.com</span>
                </p>

                <p className="text-center">
                  Phone <span>:+99946546</span>
                </p>
                <p className="text-center">
                  Address <span>:Kolkata</span>{" "}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="p-5 text-xl">Invoice To</h3>
                <p className="text-center">
                  Name <span>:sumit</span>
                </p>
                <p className="text-center">
                  Phone <span>:+945485</span>
                </p>
                <p className="text-center">
                  Address <span>:India,kolkata</span>{" "}
                </p>
              </div>
            </div>
     
          </div>
        </section>
      </div>
      {/* Room table list */}
      <div>
        <section className="bg-white p-4 rounded">
          <table className="w-full border border-black/20 text-sm">
            <thead className="bg-[#e5e7eb] border border-black/20">
              <tr className="grid grid-cols-8 items-center text-left">
                <th className="py-1 px-3 text-black text-sm font-medium border-r border-black/20">
                  Room No.
                </th>
                <th className="col-span-7 text-center text-black text-sm font-medium">
                  Room Rent List
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="grid grid-cols-8 text-left">
                <td className="py-1 px-3 border-r border-black/20">
                  {/* {data?.[0]?.room_ids
                ?.map((i) => `${i?.roomNumber} - ${i?.category}`)
                .join(", ")} */}
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
                          (Rs.) Discount
                        </td>
                        <td className="p-2 border border-black/20 align-bottom font-medium">
                          (Rs.) Paid Amount
                        </td>
                        <td className="p-2 border border-black/20 align-bottom font-medium">
                          (Rs.) Unpaid Amount
                        </td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-black/20 align-top text-xs">
                          {/* {new Date(data?.[0]?.from).toLocaleDateString()} */}
                        </td>
                        <td className="p-2 border border-black/20 align-top text-xs">
                          {/* {new Date(data?.[0]?.to).toLocaleDateString()} */}
                        </td>
                        <td className="p-2 border border-black/20 align-top text-xs">
                          {/* {data?.[0]?.no_of_days} */}
                        </td>
                        <td className="p-2 border border-black/20 align-top text-xs">
                          {/* {data?.[0]?.rent_per_day.toFixed(2)} */}
                        </td>
                        <td className="p-2 border border-black/20 align-top text-xs">
                          {/* {data?.[0]?.total_rent.toFixed(2)} */}
                        </td>
                        <td className="p-2 border border-black/20 align-top text-xs">
                          {/* {data?.[0]?.discount.toFixed(2)} */}
                        </td>
                        <td className="p-2 border border-black/20 align-top text-xs">
                          {/* {data?.[0]?.paid_amount.toFixed(2)} */}
                        </td>
                        <td className="p-2 border border-black/20 align-top text-xs">
                          {/* {data?.[0]?.total_unpaid_amount.toFixed(2)} */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
      <div>
        <div>
          <section className="bg-white rounded">
            {/* <h3 className="p-5 text-xl">Customer Details</h3> */}
            <hr />
            <div className="p-5 grid grid-cols-4 items-center text-sm font-semibold">
              <div className="space-y-3">
                <p>
                  Sub Total <span>: </span>
                </p>
                <p>
                  Tax <span>:</span>
                </p>

                <p>
                  Additional Changes <span>:</span>
                </p>
                <p>
                  Service Charge <span>:</span>
                </p>
                <p>
                  Extra Discount<span>:</span>
                </p>
                <p>
                  Room Posted Bill <span>:</span>
                </p>
                <p className="text-[1.3rem] font-bold">
                  Grand Total <span>:</span>
                </p>
              </div>
              <div className="col-span-3 space-y-3">
                <p>{/* {data?.[0]?.guestName} */}</p>
                <p>
                  {/* {data?.[0]?.room_ids?.map((i) => i?.roomNumber).join(", ")} */}
                </p>
                {/*<p>dev.tajkir@gmail.com</p>*/}
                <p>{/* {data?.[0]?.mobileNumber} */}</p>
                <p>{/* {data?.[0]?.address} */}</p>
     
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EditSalesHotel;
