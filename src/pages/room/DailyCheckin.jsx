import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import BookingLists from "../../components/room/BookingLists.jsx";
import {
  FaArrowLeft,
  FaEye,
  FaPlus,
  FaRupeeSign,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import Modal from "../../components/Modal.jsx";
import DatePicker from "react-datepicker";
import AddBooking from "../../components/room/AddBooking.jsx";
import {
  useGetRoomsAndHotelsQuery,
  useGetBookingsByHotelQuery,
} from "../../redux/room/roomAPI.js";
import { Rings } from "react-loader-spinner";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import ManageCheckinModal from "./MaageCheckinModal.jsx";
import CheckinList from "../../components/room/CheckinList.jsx";
import { convertedEndDate, convertedStartDate } from "../../utils/timeZone.js";
import { useSelector } from "react-redux";

const DailyCheckin = () => {
  const [search, setSearch] = useState("");
  const [forcePage, setForcePage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const navigate = useNavigate();
  const handleOpenModal = () => {
    setIsModalOpen(true);

    // Automatically close the modal after 3 seconds (adjust as needed)
    setTimeout(() => {
      setIsModalOpen(false);
    }, 3000);
  };
  const { user } = useSelector((store) => store.authSlice);
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
    onReset: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setSearchParams("");
    },
  });

  const {
    data: checkinList,
    isLoading,
    refetch,
  } = useGetBookingsByHotelQuery({
    hotel_id: formik.values.hotel_id,
    search: search,
    page: currentPage,
    filter: "CheckedIn",
    fromDate: convertedStartDate(date),
    toDate: convertedEndDate(date),
  });

  // refetch()
  const path = useLocation();
  useEffect(() => {
    refetch();
  }, [path.pathname]);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };
  const { data: hotelsList } = useGetRoomsAndHotelsQuery();
  return (
    <div className={`space-y-10 bg-white p-4 rounded-2xl`}>
      <div>
        <Link to={`/dashboard/manage-checkin `}>
          <button
            type="button"
            className="text-white bg-green-slimy  font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1 "
          >
            <dfn>
              <abbr title="Back">
                <FaArrowLeft />
              </abbr>
            </dfn>

            <span className="tracking-wider font-semibold text-[1rem]"></span>
          </button>
        </Link>
      </div>
      <div
        className={`bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}
      >
        <h1>CheckIn List</h1>
      </div>
      <div className="flex justify-end">
        <div className={`flex flex-col md:flex-row gap-4 `}>
          <button
            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
            onClick={() => window.cci_modal.showModal()}
          >
            <FaPlus />
            <span>Add Check In</span>
          </button>
          <div className={`relative sm:min-w-[20rem]`}>
            <input
              type="number"
              onWheel={(event) => event.currentTarget.blur()}
              placeholder="Search by phone number..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
          <CheckinList
            page={checkinList?.data?.totalPages}
            checkinList={checkinList?.data?.docs}
            handlePageClick={handlePageClick}
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
      <Modal id={`cci_modal`} classNames={`bg-white  sm:max-w-[60%]`}>
        <ManageCheckinModal />
      </Modal>
    </div>
  );
};

export default DailyCheckin;
