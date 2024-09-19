import React, { useState } from "react";
import RoomThumbsSlider from "../../components/room/RoomThumbsSlider.jsx";
import RoomTabs from "../../components/room/RoomTabs.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Modal from "../../components/Modal.jsx";
import RoomBookingEdit from "../../components/room/RoomBookingEdit.jsx";
import { useGetBookingsByRoomsQuery, useGetHotelByManagerIdQuery, useRoomQuery } from "../../redux/room/roomAPI.js";
import { Rings } from "react-loader-spinner";
import AddBooking from "../../components/room/AddBooking.jsx";
import AddBookingSelect from "../../components/room/AddBookingSelect.jsx";
import CheckInModal from "./CheckInModal.jsx";
import { DateTimePicker } from "react-datetime-picker";
import { useSelector } from "react-redux";
import { bookingDateFormatter } from "../../utils/timeZone.js";
import ReactPaginate from "react-paginate";


const ManageSingleRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forcePage, setForcePage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { isLoading, data: room } = useRoomQuery(id);

  const { isUserLoading, user } = useSelector((store) => store.authSlice);

  const {
    data: hotelInfo,
    isLoading: isHotelLoading,
    isSuccess: isHotelSuccess,
  } = useGetHotelByManagerIdQuery(user?._id);

  const hotelId = hotelInfo && isHotelSuccess && hotelInfo[0]?._id;


  const {data:getBookingsByRooms}=useGetBookingsByRoomsQuery({
    page:currentPage,
    hotelId:hotelId,
    roomId:room?.data?._id,
    limit:10
  },{skip:!hotelId || !room?.data?._id})

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };


  return (
    <>
      <div
        className={`bg-white max-w-6xl mx-auto rounded-3xl p-10 space-y-10 mb-4`}
      >
        <div>
          <span
            className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </span>
        </div>
        {!isLoading ? (
          <>
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-10 !mt-5`}>
              <RoomThumbsSlider images={room?.data?.images} />
              <div className={`lg:col-span-2`}>
                <h2 className="card-title">Room - {room?.data?.roomNumber}</h2>

                {/* Room Table */}
                <div className={`mt-4`}>
                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem]  px-2 border-t border-l border-r border-gray-500 ">
                    <h6>Category </h6>
                    <h6 className=" border-l px-2 border-gray-600">
                      {room?.data?.category}
                    </h6>
                  </div>
                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem] px-2 border-t border-l border-r border-gray-600">
                    <h6>Type </h6>
                    <h6 className="border-l px-2 border-gray-600">
                      {room?.data?.type}
                    </h6>
                  </div>

                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem] px-2 border-t border-l border-r border-gray-600">
                    <h6 className="">Capacity </h6>
                    <h6 className="border-l px-2 border-gray-600">
                      {room?.data?.capacity}
                    </h6>
                  </div>
                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem] px-2 border-t border-l border-r border-gray-600">
                    <h6 className="">Price </h6>
                    <h6 className="border-l px-2 border-gray-600">
                      {room?.data?.price}
                    </h6>
                  </div>
                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem] px-2 border-t border-l border-r border-gray-600">
                    <h6 className="">Ac </h6>
                    <h6 className="border-l px-2 border-gray-600">
                      {room?.data?.air_conditioned ? "Yes" : "No"}
                    </h6>
                  </div>
                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem] px-2 border-t border-l border-r border-gray-600">
                    <h6 className="">Bed Size </h6>
                    <h6 className="border-l px-2 border-gray-600">
                      {room?.data?.bedSize}
                    </h6>
                  </div>
                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem] px-2 border-t border-l border-r border-gray-600">
                    <h6 className="">Floor Number </h6>
                    <h6 className="border-l px-2 border-gray-600">
                      {room?.data?.floorNumber}
                    </h6>
                  </div>
                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem] px-2 border-t border-l border-r border-gray-600">
                    <h6 className="">Room Number </h6>
                    <h6 className=" border-l px-2 border-gray-600">
                      {" "}
                      {room?.data?.roomNumber}
                    </h6>
                  </div>
                  <div className="grid grid-cols-2 w-[17rem] md:w-[18rem] px-2 border-b border-t border-l border-r border-gray-600">
                    <h6 className="">Status </h6>
                    <h6 className=" border-l px-2 border-gray-600">
                      {room?.data?.status}
                    </h6>
                  </div>
                </div>
                {/* ===== */}
               
                   
                 

                {/* ===== */}
                <div
                  className={`grid grid-cols-[repeat(auto-fit,_minmax(5.5rem,_1fr))] gap-2.5 mt-6`}
                >
                  {room?.data?.status === "Available" ? (
                    
                    <>
                     <button
                        className={`btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[2rem]`}
                        onClick={() => window.ab_modal.showModal()}
                      >
                        Booking
                      </button>
                      <button
                        className={`btn btn-md bg-green-slimy hover:bg-transparent text-white font-bold hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[2rem] `}
                        onClick={() => window.ci_modal.showModal()}
                      >
                        CheckIn
                      </button>
                      <button
                    className={`btn btn-md bg-green-slimy hover:bg-transparent text-white font-bold hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[2rem] `}
                    onClick={() =>
                      navigate(`/dashboard/edit-room/${room?.data?._id}`)
                    }
                  >
                    Edit
                  </button>
                   
                    </>
                  ) : room?.data?.status === "CheckedIn" ? 			
                   (
                    <>
                    <button
                      onClick={() =>
                        navigate(`/dashboard/checkout?room=${room?.data?._id}`)
                      }
                      className={`btn btn-md bg-yellow-400 hover:bg-yellow-300 text-black font-bold hover:text-black-300 !border-yellow-400 rounded normal-case min-w-[2rem]`}
                    >
                      CheckOut
                    </button>
                       <button
                       className={`btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[2rem]`}
                       onClick={() => window.ab_modal.showModal()}
                     >
                       Booking
                     </button>
                        <button
                        className={`btn btn-md bg-green-slimy hover:bg-transparent text-white font-bold hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[2rem] `}
                        onClick={() =>
                          navigate(`/dashboard/edit-room/${room?.data?._id}`)
                        }
                      >
                        Edit
                      </button>
                      </>
                   ):(
                    <>
                      <button
                        className={`btn btn-md bg-green-slimy hover:bg-transparent text-white font-bold hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[2rem] `}
                        onClick={() => window.ci_modal.showModal()}
                      >
                        CheckIn
                      </button>
                      <button
                       className={`btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[2rem]`}
                       onClick={() => window.ab_modal.showModal()}
                     >
                       Booking
                     </button>
                        <button
                        className={`btn btn-md bg-green-slimy hover:bg-transparent text-white font-bold hover:text-green-slimy !border-green-slimy rounded normal-case min-w-[2rem] `}
                        onClick={() =>
                          navigate(`/dashboard/edit-room/${room?.data?._id}`)
                        }
                      >
                        Edit
                      </button>
                    </>
                   )
                  }
                  
               
                </div>
              </div>
            </div>
            <div>
              <RoomTabs description={room?.data?.description} />
            </div>

            {/* Modal Booking */}
            <Modal id={`ab_modal`} classNames={`bg-white  sm:max-w-[60%]`}>
              <AddBookingSelect room={room} />
            </Modal>

            <Modal id={`ci_modal`} classNames={`bg-white  sm:max-w-[60%]`}>
              <CheckInModal room={room} />
            </Modal>
          </>
        ) : (
          <Rings
            width="50"
            height="50"
            color="#37a000"
            wrapperClass="justify-center"
          />
        )}
      </div>
      <div className={`bg-white max-w-6xl mx-auto rounded-3xl p-10 space-y-10`}>
        <div
          className={`bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}
        >
          <h2>All Booking Information</h2>
        </div>
        <div className="overflow-x-auto border mt-3 px-2">
        <table className="table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Status</th>
                <th>From Date</th>
                <th>To Date</th>
              </tr>
            </thead>
            <tbody>
              {
                getBookingsByRooms?.data?.docs?.map((bookingsRoom,idx)=>{
                  
                  return  <tr>
                  <th>{++idx}</th>
                  <td>
                    {bookingsRoom.status === "Active" ? (
                      <div className="badge min-w-[6rem] bg-orange-600 border-orange-600 text-white">
                        Booked
                      </div>
                    ) : (
                      <div className="badge min-w-[6rem] bg-red-600 border-red-600 text-white">
                        Checked In
                      </div>
                    )}
                  </td>
                  <td className="uppercase">{bookingDateFormatter(bookingsRoom.from)}</td>
                  <td className="uppercase">{bookingDateFormatter(bookingsRoom.to)}</td>
                  
                </tr>
                })
              }
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
                  pageCount={getBookingsByRooms?.data?.totalPages}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageClick}
                  renderOnZeroPageCount={null}
                  forcePage={forcePage}
                />
              </div>
      </div>
    </>
  );
};

export default ManageSingleRoom;
