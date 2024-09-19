import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import BookingLists from "../../components/room/BookingLists.jsx";
import { FaArrowLeft, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal.jsx";
import AddBooking from "../../components/room/AddBooking.jsx";
import {
  useGetRoomsAndHotelsQuery,
  useGetBookingsByHotelQuery,
} from "../../redux/room/roomAPI.js";
import { Rings } from "react-loader-spinner";
import { Link } from "react-router-dom";

const ManageBooking = () => {
  const [search, setSearch] = useState("");
  const [forcePage, setForcePage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
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

  const { data: bookingList, isLoading } = useGetBookingsByHotelQuery({
    hotel_id: formik.values.hotel_id,
    page: currentPage,
    search: formik.values.search,
    filter: "Active",
  });

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
    // if (formik.values.search.length === 0) {
    //   formik.handleSubmit();
    // }
  };

  const { data: hotelsList } = useGetRoomsAndHotelsQuery();
  return (
    <div className={`space-y-10 bg-white p-4 rounded-2xl`}>
      <div>
        <Link to={`/dashboard `}>
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
        <h1>Manage Booking</h1>
      </div>
      <div className="flex justify-end">
        <div className={`flex flex-col md:flex-row gap-4`}>
          <button
            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
            onClick={() => window.ab_modal.showModal()}
          >
            <FaPlus />
            <span>Add Booking</span>
          </button>
          <div className={`relative sm:min-w-[20rem]`}>
            <input
              type="number"
              onWheel={(event) => event.currentTarget.blur()}
              placeholder="Search by phone number..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={formik.values.search}
              onChange={(e) => {
                setCurrentPage(0), setForcePage(1), formik.handleChange(e);
              }}
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
          <BookingLists
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
      <Modal id={`ab_modal`} classNames={`bg-white  sm:max-w-[60%]`}>
        <AddBooking />
      </Modal>
    </div>
  );
};

export default ManageBooking;
