import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaDoorOpen, FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import EditBooking from "../../components/room/EditBooking.jsx";
import Modal from "../../components/Modal.jsx";
import { useGetBookingInfoByIdQuery } from "../../redux/room/roomAPI.js";
import CheckInDyn from "./CheckInDyn.jsx";
import { getOnlyFormatDate } from "../../utils/utils.js";
import { bookingDateFormatter } from "../../utils/timeZone.js";
import moment from "moment";
import toast from "react-hot-toast";

const BookingView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: booking,
    isLoading,
    isSuccess,
  } = useGetBookingInfoByIdQuery(id);
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (data && modalOpen && isSuccess) {
      window.ci_modal.showModal();
      setModalOpen(false);
    }
  }, [modalOpen]);

  // fromDate validation
  const targetDate = moment(booking?.data?.from);
  // Set the time to 10:00 AM
  targetDate.set({ hour: 10, minute: 0, second: 0, millisecond: 0 });
  // Get the current date and time
  const currentDate = moment();
  // Compare the two dates
  const isCurrentDateGreaterThanTarget = currentDate.isAfter(targetDate);

  // to Date validation
  const toTargetDate = moment(booking?.data?.to);
  toTargetDate.set({ hour: 15, minute: 0, second: 0, millisecond: 0 });
  const toCurrentDate = moment();
  const isToCurrentDteLessThanTarget = toCurrentDate.isBefore(toTargetDate);

  const handleError = () => {
    if (isCurrentDateGreaterThanTarget === false) {
      toast.error("Please wait until the scheduled date.");
    } else if (isToCurrentDteLessThanTarget === false) {
      toast.error("The booking period for this reservation has ended.");
    }
  };

  const [restrictedError, setRestrictedError] = useState("");
  useEffect(() => {
    if (isCurrentDateGreaterThanTarget === false) {
      setRestrictedError("Please wait until the scheduled date.");
    } else if (isToCurrentDteLessThanTarget === false) {
      setRestrictedError("The booking period for this reservation has ended.");
    } else {
      setRestrictedError("");
    }
  }, [isCurrentDateGreaterThanTarget, isToCurrentDteLessThanTarget]);

  return (
    <div className={`bg-white p-10 rounded-2xl space-y-8`}>
      {/* {restrictedError && (
            <small className="text-red-500 min-w-min ml-2 px-4 py-2 flex justify-center  pt-3  pb-2 mb-2 rounded-md ">
            <span  className="bg-slate-100 px-4 py-2 rounded-md shadow-lg">{restrictedError}</span>
            </small>
          )} */}
      <div className={`flex justify-between`}>
        <div
          className={`inline-flex bg-green-slimy text-white border border-green-slimy items-center space-x-1.5 hover:bg-transparent hover:text-green-slimy cursor-pointer px-3 py-1 rounded transition-colors duration-500`}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back</span>
        </div>
        {/* {restrictedError && (
            <small className="text-red-500 min-w-min ml-2 shadow-lg bg-slate-100 px-4 py-2 inline-block pt-3  pb-2 mb-2 rounded-md ">
              {restrictedError}
            </small>
          )} */}
        <div className={`space-x-1.5 space-y-1`}>
          <span
            className="cursor-pointer pl-[6px]"
            onClick={() => {
              if (isCurrentDateGreaterThanTarget === false) {
                handleError();
              } else if (isToCurrentDteLessThanTarget === false) {
                handleError();
              }
            }}
          >
            <button
              className={`  btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
              title={`Check In`}
              type="button"
              disabled={
                isCurrentDateGreaterThanTarget === true &&
                isToCurrentDteLessThanTarget === true
                  ? false
                  : true
              }
              onClick={() => {
                setData(booking?.data);
                setModalOpen(true);
              }}
            >
              <FaDoorOpen />
            </button>
          </span>
          <span
            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
            title={`Edit`}
            onClick={() => window.eb_modal.showModal()}
          >
            <FaEdit />
          </span>
        </div>
      </div>
      {restrictedError && (
        <p className="text-red-500 min-w-min ml-2 px-4 py-2 flex justify-center  pt-3  pb-2 mb-2 rounded-md ">
          <span className="bg-slate-100 px-4 py-2 rounded-md shadow-lg text-center font-semibold">
            {restrictedError}
          </span>
        </p>
      )}
      <div className={`flex flex-col lg:flex-row gap-10 lg:gap-16`}>
        <div>
          <h3 className={`text-2xl font-semibold mb-3`}>
            Customer Information
          </h3>
          <table>
            <tbody>
              <tr>
                <th className={`text-start`}>Name</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.guestName}</td>
              </tr>
              <tr>
                <th className={`text-start`}>Phone</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.mobileNumber}</td>
              </tr>
              <tr>
                <th className={`text-start`}>
                  Emergency <br /> Contact
                </th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.emergency_contact}</td>
              </tr>
              <tr>
                <th className={`text-start`}>Total Paid Amount</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.paid_amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 className={`text-2xl font-semibold mb-3`}>Booking Information</h3>
          <table>
            <tbody>
              <tr>
                <th className={`text-start`}>Booking Mathod</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.bookingMethod}</td>
              </tr>
              <tr>
                <th className={`text-start`}>Booking Date</th>
                <td className={`w-4 text-center`}>:</td>
                <td>
                  {getOnlyFormatDate(booking?.data?.createdAt)}
                  {/* {new Date(booking?.data?.createdAt).toLocaleString()} */}
                </td>
              </tr>
              {/* <tr>
                <th className={`text-start`}>Booking No</th>
                <td className={`w-4 text-center`}>:</td>
                {/* <td>{data?.data?._id}</td>  
              </tr> */}

              <tr>
                <th className={`text-start`}>Room No</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.room_id?.roomNumber}</td>
              </tr>
              <tr>
                <th className={`text-start`}>Number of Days</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.no_of_days}</td>
              </tr>
              <tr>
                <th className={`text-start`}>Rent per day</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.rent_per_day}</td>
              </tr>
              <tr>
                <th className={`text-start`}>Total Room Rent</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.total_room_rent}</td>
              </tr>
              <tr>
                <th className={`text-start`}>Adult</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.adult}</td>
              </tr>
              <tr>
                <th className={`text-start`}>Children</th>
                <td className={`w-4 text-center`}>:</td>
                <td>{booking?.data?.children}</td>
              </tr>

              <tr>
                <th className={`text-start`}>From</th>
                <td className={`w-4 text-center`}>:</td>
                <td>
                  {bookingDateFormatter(booking?.data?.from)}
                  {/* {new Date(booking?.data?.from).toLocaleDateString()} */}
                </td>
              </tr>
              <tr>
                <th className={`text-start`}>To</th>
                <td className={`w-4 text-center`}>:</td>
                <td>
                  {bookingDateFormatter(booking?.data?.to)}
                  {/* {new Date(booking?.data?.to).toLocaleDateString()} */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Modal id={`ci_modal`}>
        <CheckInDyn data={booking?.data} />
      </Modal>
      <Modal id={`eb_modal`}>
        {booking?.data && <EditBooking bookingId={id} data={booking?.data} />}
      </Modal>
    </div>
  );
};

export default BookingView;
