import React, { useEffect, useState } from "react";
import { FaDoorOpen, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
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
import {
  bookingDateFormatter,
  getIndianFormattedDate,
} from "../../utils/timeZone.js";
import Modal from "../Modal.jsx";

const BookingLists = ({ bookingList, setCurrentPage, forcePage }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();
  const [bookingId, setBookingId] = useState("");

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };


  const {
    data: isLastBooking,
    isSuccess,
    refetch,
  } = useGetLastActiveBookingQuery(bookingId, { skip: bookingId === "" });
  const handleDelete = (id) => {
    setBookingId((previousID) => {
      if (previousID === id) {
        refetch();
        cancelBookingFunction();
        return previousID;
      } else {
        return id;
      }
    });
  };
  const cancelBookingFunction = () => {
    if (isLastBooking && isSuccess) {
      if (isLastBooking?.success && isLastBooking?.paid_amount > 0) {
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
                id: bookingId,
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
  };
  useEffect(() => {
    cancelBookingFunction();
  }, [isLastBooking]);

  useEffect(() => {
    if (data && modalOpen) {
      window.ci_modal.showModal();
      setModalOpen(false);
    }
  }, [modalOpen]);

  const LoadingModal = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
        <div className=" max-w-96 w-96 h-64 rounded-md flex justify-center items-center">
          <span className="loading loading-spinner text-green-slimy w-16"></span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {isLoading && <LoadingModal />} {/* Use the LoadingModal component */}
      <div className="overflow-x-auto border">{/* Rest of your code */}</div>
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
              <th>Action</th>
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
                  <td className="uppercase">
                    {bookingDateFormatter(item?.from)}
                  </td>
                  <td className="uppercase">
                    {bookingDateFormatter(item?.to)}
                  </td>

                  <td className={`flex flex-wrap gap-1.5`}>
                    <span
                      className={`btn btn-sm bg-green-slimy text-[1.1rem] hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
                      title={`View`}
                      onClick={() => navigate(`${item._id}`)}
                    >
                      <FaEye />
                    </span>
                    <button
                      onClick={() => {
                        handleDelete(item?._id);
                      }}
                      className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
                      title={`Cancel`}
                    >
                      <MdOutlineCancel className="text-[17px]" />
                    </button>
                  </td>
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

export default BookingLists;
