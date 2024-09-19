import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaDoorOpen, FaEdit } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditBooking from "../../components/room/EditBooking.jsx";
import Modal from "../../components/Modal.jsx";
import {
  useGetBookingByIdQuery,
  useGetBookingInfoByIdQuery,
  useGetRoomPostedBillsQuery,
} from "../../redux/room/roomAPI.js";
import CheckInDyn from "./CheckInDyn.jsx";
import CheckinCardDetails from "./CheckOut/CheckinCardDetails.jsx";
import TransactionHistoryCard from "../../components/Manage-CheckIn/TransactionHistoryCard.jsx";
import PaymentMethodCard from "../../components/Manage-CheckIn/PaymentMethodCard.jsx";
import RoomRentDetails from "../../components/Manage-CheckIn/RoomRentDetails.jsx";
import TransactionHistory from "../../components/Admin/TransactionHistory.jsx";
import RestaurantBillsCard from "../../components/Manage-CheckIn/RestaurantBillsCard.jsx";
import GymBills from "../../components/Manage-CheckIn/GymBills.jsx";
import PoolsBill from "../../components/Manage-CheckIn/PoolsBill.jsx";
import { MdOutlineHail } from "react-icons/md";
import { getOnlyFormatDate } from "../../utils/utils.js";

const CheckinPersonInfo = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: booking, isLoading } = useGetBookingInfoByIdQuery(id);

  useEffect(() => {
    const roomId = booking?.data?.room_id?._id;
    setRoomId(roomId);
  }, [booking]);

  const {
    data: postedBill,
    error,
    isLoadingPostedBill,
  } = useGetRoomPostedBillsQuery(roomId);

  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (data && modalOpen) {
      window.ci_modal.showModal();
      setModalOpen(false);
    }
  }, [modalOpen]);

  const documentTypes = {
    driving_lic_img: booking?.data?.doc_images?.driving_lic_img,
    nid: booking?.data?.doc_images?.nid,
    passport: booking?.data?.doc_images?.passport,
  };

  const validDocumentTypeKey = Object.keys(documentTypes).find(
    (key) => documentTypes[key] && documentTypes[key].length !== 0
  );

  const validDocumentType =
    documentTypes[validDocumentTypeKey]?.filter((value) => value !== "") || [];

  return (
    <>
      <div className={`bg-white p-10 rounded-2xl space-y-8`}>
        <div className={`flex justify-between`}>
          <div
            className={`inline-flex bg-green-slimy text-white border border-green-slimy items-center space-x-1.5 hover:bg-transparent hover:text-green-slimy cursor-pointer px-3 py-1 rounded transition-colors duration-500`}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            <span>Back</span>
          </div>
          <div className={`space-x-1.5`}>
            <span
              onClick={() => navigate(`/dashboard/checkout?room=${roomId}`)}
            >
              <span
                className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                title={`Check In`}
              >
                <MdOutlineHail />
              </span>
            </span>
            
          </div>
        </div>
        <div
          className={`flex justify-around flex-col lg:flex-row gap-10 lg:gap-16`}
        >
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
                  <td className={`w-6 text-center`}>:</td>
                  <td>{booking?.data?.emergency_contact}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
          <div>
            <h3 className={`text-2xl font-semibold mb-3`}>
              CheckIn Information
            </h3>
            <table>
              <tbody>
                

                <tr>
                  <th className={`text-start`}>Room No</th>
                  <td className={`w-4 text-center`}>:</td>
                  <td>{booking?.data?.room_id?.roomNumber}</td>
                </tr>
                <tr>
                  <th className={`text-start`}>Floor No</th>
                  <td className={`w-4 text-center`}>:</td>
                  <td>{booking?.data?.room_id?.floorNumber}</td>
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
                    {getOnlyFormatDate(booking?.data?.from)}
                    </td>
                </tr>
                <tr>
                  <th className={`text-start`}>To</th>
                  <td className={`w-4 text-center`}>:</td>
                  <td>{getOnlyFormatDate(booking?.data?.to)}
                    </td>
                </tr>
                <tr>
                  <th className={`text-start`}>Status</th>
                  <td className={`w-4 text-center`}>:</td>
                  <td>{booking?.data?.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Modal id={`ci_modal`}>
          <CheckInDyn data={data} />
        </Modal>
        <Modal id={`eb_modal`}>
          {booking?.data && <EditBooking data={booking?.data} />}
        </Modal>
      </div>
      <Modal id={`ci_modal`}>
        <CheckInDyn data={data} />
      </Modal>
      <Modal id={`eb_modal`}>
        {booking?.data && <EditBooking data={booking?.data} />}
      </Modal>
      <div className="mb-20 mt-10">
        <CheckinCardDetails data={booking?.data} />
      </div>
      {/* payment system */}
      <div>
        <PaymentMethodCard booking={booking?.data} isLoading={isLoading} />
      </div>
     

      {/*  Bill system*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-10">
        <div className="flex-1 h-full bg-white">
          <RestaurantBillsCard food_bills={postedBill?.data?.food_bills} />
        </div>
        <div className="flex-1 h-full bg-white">
          <GymBills GymBill={postedBill?.data?.gym_bills} />
        </div>
        <div className="flex-1 h-full bg-white">
          <PoolsBill poolBills={postedBill?.data?.pool_bills} />
        </div>
      </div>
    </>
  );
};

export default CheckinPersonInfo;
