import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import BookingLists from "../../components/room/BookingLists.jsx";
import { FaArrowLeft, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal.jsx";
import AddBooking from "../../components/room/AddBooking.jsx";
import {
  useGetRoomsAndHotelsQuery,
  useGetBookingsByHotelQuery,
  useMakePaymentMutation,
  useGetDailyBookingDataQuery,
  useGetDailyCheckInDataQuery,
} from "../../redux/room/roomAPI.js";
import { Rings } from "react-loader-spinner";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import CheckinList from "../../components/room/CheckinList.jsx";
import { MdOutlineHail } from "react-icons/md";
import ReactPaginate from "react-paginate";
import {
  checkinListFromDate,
  checkinListoDate,
  getConvertedIsoEndDate,
  getConvertedIsoStartDate,
  getFormateDateAndTime,
  getTodayFormateDate,
  getformatDateTime,
} from "../../utils/utils.js";
import {
  bookingDateFormatter,
  convertedEndDate,
  convertedStartDate,
  getIndianFormattedDate,
} from "../../utils/timeZone.js";
import { useSelector } from "react-redux";

const TodaysCheckinList = () => {
  const [search, setSearch] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [forcePage, setForcePage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const managerId = searchParams.get("manager_id");
  const { user } = useSelector((store) => store.authSlice);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      filter: "",
      search: "",
      // hotel_id: "",
    },
    onSubmit: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setSearch(values.search);
    },
  });

  const {
    data: checkinList,
    isLoading,
    refetch,
  } = useGetDailyCheckInDataQuery({
    search: search,
    page: currentPage,
    fromDate: convertedStartDate(),
    toDate: convertedEndDate(),
    manager_id: managerId === "undefined" ? "" : managerId,
    limit: 10,
  });
  // "65794401b015daaae34ae94a"
  useEffect(() => {
    if (checkinList) setPageCount(checkinList?.data?.totalPages);
  }, [checkinList]);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  // refetch()
  const path = useLocation();
  useEffect(() => {
    refetch();
  }, [path.pathname]);

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };
  const { data: hotelsList } = useGetRoomsAndHotelsQuery();
  return (
    <div className={`space-y-10 bg-white p-4 rounded-2xl`}>
      <h1 className="bg-green-slimy text-center text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7">
        Today's Check In{" "}
      </h1>
      <div>
        {/* <Link to={`/dashboard `}> */}
        <button
          type="button"
          className="text-white bg-green-slimy  font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1 "
          onClick={() => navigate(-1)}
        >
          <dfn>
            <abbr title="Back">
              <FaArrowLeft />
            </abbr>
          </dfn>

          <span className="tracking-wider font-semibold text-[1rem]"></span>
        </button>
        {/* </Link> */}
      </div>
      <div className="flex justify-end">
        <div className={`flex flex-col md:flex-row gap-4 `}>
          <div className={`relative sm:min-w-[20rem]`}>
            <input
              type="number"
              placeholder="Search by phone number..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
              value={formik.values.search}
              onChange={formik.handleChange}
              onKeyUp={(e) => {
                e.target.value === "" && setForcePage(1);
                e.target.value === "" && setCurrentPage(0);
                e.target.value === "" ? formik.handleSubmit() : null;
              }}
              onKeyDown={(e) => pressEnter(e)}
            />
            <button
              type="button"
              onClick={formik.handleSubmit}
              className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      {!isLoading ? (
        checkinList?.data?.docs?.length ? (
          <div>
            <div className="overflow-x-auto border">
              <table className="table">
                <thead>
                  <tr className={`text-lg`}>
                    <th>
                      Guest <br /> Name
                    </th>
                    <th>
                      Room <br />
                      Number
                    </th>
                    <th>
                      Phone <br />
                      Number
                    </th>
                    {/* <th>Booking <br />Date
                    </th> */}
                    <th>Checked In</th>
                    <th>From</th>
                    <th>To</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {checkinList?.data?.docs?.map((item, idx) => {
              
                    return (
                      <tr
                        className={
                          idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                        }
                      >
                        <td>
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-bold">{item?.guestName}</div>
                              {/* <div className="text-sm opacity-50">
                                Rooms: {item?.room_ids?.map((i) => i.roomNumber)}
                              </div> */}
                            </div>
                          </div>
                        </td>
                        <td>{item?.room_id?.roomNumber}</td>
                        <td>{item?.mobileNumber}</td>
                        {/* <td>{item?.paid_amount}</td> */}
                        {/* <td>{new Date(item?.createdAt).toLocaleString()}</td> */}
                        <td>{getformatDateTime(item?.checkin_date)}</td>
                        <td className="uppercase">{bookingDateFormatter(item?.from)}</td>
                        <td className="uppercase">{bookingDateFormatter(item?.to)}</td>

                        {/* <td className={`flex flex-wrap gap-1.5`}>
                          <span
                            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
                            title={`View`}
                            onClick={() => navigate(`/dashboard/manage-checkin/${item._id}`)}
                          >
                            <FaEye />
                          </span>
      
                          <Link
                            onClick={()=> navigate(`/dashboard/checkout?room=${item?.room_id?._id}`)}
                            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
                          >
                            <MdOutlineHail />
                          </Link>
                      
                        </td> */}

                        {/* <span
                            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
                          >
                            <FaEdit />
                          </span> */}
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
                pageCount={pageCount}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                renderOnZeroPageCount={null}
                forcePage={forcePage}
              />
            </div>
            {/* <Modal id={`eb_modal`}>
              {editBookedData && <EditBooking data={editBookedData} />}
            </Modal>
            <Modal id={`ci_modal`}>
              <CheckInDyn data={data} />
            </Modal> */}
          </div>
        ) : (
          <h3 className={`text-center`}>No data found!</h3>
        )
      ) : (
        <Rings
          width="50"
          height="50"
          color="#37a000"
          wrapperClass="justify-center"
        />
      )}
    </div>
  );
};

export default TodaysCheckinList;
