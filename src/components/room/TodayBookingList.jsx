import React, { useEffect, useState } from "react";
import { FaDoorOpen, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal.jsx";
import EditBooking from "./EditBooking.jsx";
import {
  useCancelBookingMutation,
  useGetLastActiveBookingQuery,
  useUpdateBookingMutation,
} from "../../redux/room/roomAPI.js";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CheckInModal from "../../pages/room/CheckInModal.jsx";
import CheckInDyn from "../../pages/room/CheckInDyn.jsx";
import AddBooking from "./AddBooking.jsx";
import RefundBookingModal from "./RefundBookingModal.jsx";
import { getFormateDateAndTime, getformatDateTime } from "../../utils/utils.js";
import { bookingDateFormatter, getIndianFormattedDate } from "../../utils/timeZone.js";

const TodayBookingList = ({ bookingList, setCurrentPage, forcePage }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateBooking, { isLoading: isCancelledLoading, error }] =
    useUpdateBookingMutation();
  const [cancelBooking] = useCancelBookingMutation();
  const [bookingId, setBookingId] = useState("");

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };


  const { data: isLastBooking, refetch } =
    useGetLastActiveBookingQuery(bookingId);
  const handleDelete = (id) => {
    setBookingId(id);
    refetch();
  };

  useEffect(() => {
    if (isLastBooking) {
      if (isLastBooking?.success) {
        window.refundPay.showModal();
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "Booking will be Cancel.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#35bef0",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Cancel it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await cancelBooking({
                id: id,
                data: {
                  tran_id: "",
                  payment_method: "",
                },
              });
              if (response) {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Canceled!",
                  showConfirmButton: false,
                  timer: 1500,
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
              }
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          }
        });
      }
    }
  }, [isLastBooking]);

  useEffect(() => {
    if (data && modalOpen) {
      window.ci_modal.showModal();
      setModalOpen(false);
    }
  }, [modalOpen]);

  return (
    <div>
      <div className="overflow-x-auto border">
        <table className="table">
          <thead>
            <tr className={`text-lg`}>
              <th>
                Guest <br /> Name
              </th>

              <th>
                Room <br /> Number
              </th>
              <th>
                Phone <br />
                Number
              </th>
              <th>
                Booking <br /> Date
              </th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {bookingList?.data.docs.map((item, idx) => {
              return (
                <tr
                  className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                  key={item?._id}
                >
                  <td>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">{item.guestName}</div>
                      </div>
                    </div>
                  </td>
                  <td> {item?.room_id?.roomNumber}</td>
                  <td>{item?.mobileNumber}</td>
                  <td>{getformatDateTime(item?.createdAt)}</td>
                  <td className="uppercase">{bookingDateFormatter(item?.from)}</td>
                  <td className="uppercase">{bookingDateFormatter(item?.to)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-10">
        <ReactPaginate
          containerClassName="join rounded-none"
          pageLinkClassName="join-item btn btn-md bg-transparent"
          activeLinkClassName="btn-active !bg-green-slimy text-white"
          disabledLinkClassName="btn-disabled"
          previousLinkClassName="join-item btn btn-md bg-transparent"
          nextLinkClassName="join-item btn btn-md bg-transparent"
          breakLinkClassName="join-item btn btn-md bg-transparent"
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageCount={bookingList?.data?.totalPages}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          renderOnZeroPageCount={null}
          forcePage={forcePage}
        />
      </div>
      <Modal id={`refundPay`}>
        <RefundBookingModal paidAmt={isLastBooking} bookingId={bookingId} />
      </Modal>
    </div>
  );
};

export default TodayBookingList;
