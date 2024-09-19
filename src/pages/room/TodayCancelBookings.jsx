import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import BookingLists from "../../components/room/BookingLists.jsx";
import { FaArrowLeft, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal.jsx";
import AddBooking from "../../components/room/AddBooking.jsx";
import {
  useGetRoomsAndHotelsQuery,
  useGetBookingsByHotelQuery,
  useGetDailyCheckInDataQuery,
  useGetDailyCancelBookingDataQuery,
} from "../../redux/room/roomAPI.js";
import { Rings } from "react-loader-spinner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TodayCancelBookingList from "./TodayCancelBookingList.jsx";
import {
  checkinListFromDate,
  checkinListoDate,
  getConvertedIsoEndDate,
  getConvertedIsoStartDate,
  getTodayFormateDate,
} from "../../utils/utils.js";
import { convertedEndDate, convertedStartDate } from "../../utils/timeZone.js";
import { useSelector } from "react-redux";

const TodayCancelBookings = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [forcePage, setForcePage] = useState(null);
  const navigate = useNavigate();
  const conditionIsMet = true;

  const [searchParams] = useSearchParams();
  const managerId = searchParams.get("manager_id");
  const { user } = useSelector((store) => store.authSlice);

  const formik = useFormik({
    initialValues: {
      search: "",
      // hotel_id: "",
    },
    onSubmit: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setSearch(values.search);
    },
  });

  const { data: bookingList, isLoading } = useGetDailyCancelBookingDataQuery({
    search: search,
    page: currentPage,
    fromDate: convertedStartDate(),
    toDate: convertedEndDate(),
    manager_id: managerId === "undefined" ? "" : managerId,
    limit: 10,
  });

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
    if (formik.values.search.length === 0) {
      formik.handleSubmit();
    }
  };
  const { data: hotelsList } = useGetRoomsAndHotelsQuery();
  return (
    <div className={`space-y-10 bg-white p-4 rounded-2xl`}>
      <h1 className="bg-green-slimy text-center text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7">
        Today's Canceled Booking{" "}
      </h1>
      {/* <div>
        <Link to={`/dashboard `}>
          <button
            type="button"
            className="text-white bg-green-slimy  font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1 "
            onClick={()=>navigate(-1)}
          >
            <dfn>
              <abbr title="Back">
                <FaArrowLeft />
              </abbr>
            </dfn>

            <span className="tracking-wider font-semibold text-[1rem]"></span>
          </button>
        </Link>
      </div> */}
      <div>
        {conditionIsMet ? (
          <button
            type="button"
            className="text-white bg-green-slimy font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1"
            onClick={() => navigate(-1)}
          >
            <dfn>
              <abbr title="Back">
                <FaArrowLeft />
              </abbr>
            </dfn>
            <span className="tracking-wider font-semibold text-[1rem]"></span>
          </button>
        ) : (
          <Link to="/dashboard">
            <button
              type="button"
              className="text-white bg-green-slimy font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1"
            >
              <dfn>
                <abbr title="Dashboard">
                  <FaDashboard />
                </abbr>
              </dfn>
              <span className="tracking-wider font-semibold text-[1rem]"></span>
            </button>
          </Link>
        )}
      </div>
      <div className="flex justify-end">
        <div className={`flex flex-col md:flex-row gap-4`}>
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
        bookingList?.data?.docs?.length ? (
          <TodayCancelBookingList
            bookingList={bookingList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            forcePage={forcePage}
          />
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

export default TodayCancelBookings;
