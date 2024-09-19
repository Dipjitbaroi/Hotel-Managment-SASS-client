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
  useMakePaymentMutation,
  useGetDailyDataQuery,
  useGetDailyHotelDataQuery,
} from "../../redux/room/roomAPI.js";
import { Rings } from "react-loader-spinner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckInModal from "./CheckInModal.jsx";
import ManageCheckinModal from "./MaageCheckinModal.jsx";
import CheckinList from "../../components/room/CheckinList.jsx";
import { convertedEndDate, convertedStartDate } from "../../utils/timeZone.js";
import { useSelector } from "react-redux";
import { getOnlyFormatDate } from "../../utils/utils.js";
import { GrPowerReset } from "react-icons/gr";
import ReactPaginate from "react-paginate";

const ManageCheckin = () => {
  const [forcePage, setForcePage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    fromDate: "",
    toDate: "",
  });

  const { user } = useSelector((store) => store.authSlice);
  const {
    data: checkInData,
    error,
    isLoading,
  } = useGetDailyHotelDataQuery({
    // ...searchParams,
    page: currentPage,
    fromDate: searchParams?.fromDate
      ? convertedStartDate(searchParams.fromDate)
      : "",
    toDate: searchParams?.toDate ? convertedEndDate(searchParams.toDate) : "",
    manager_id: user._id,
    limit: 10,
    filter: "checkin",
  });
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
    },
    onSubmit: (values) => {
      setSearchParams({ fromDate: values.fromDate, toDate: values.toDate });
    },
  });
  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };
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
        <h1>Manage CheckIn</h1>
      </div>
      <div className={`flex flex-col md:flex-row gap-3`}>
        <DatePicker
          autoComplete={`off`}
          dateFormat="dd/MM/yyyy"
          name="fromDate"
          placeholderText={`From`}
          selected={formik.values.fromDate}
          className={`input input-sm input-bordered rounded focus:outline-none`}
          onChange={(date) => formik.setFieldValue("fromDate", date)}
          onBlur={formik.handleBlur}
          onKeyUp={(e) => {
            e.target.value === "" ? formik.handleSubmit() : null;
          }}
          onKeyDown={(e) => pressEnter(e)}
        />
        <DatePicker
          autoComplete={`off`}
          dateFormat="dd/MM/yyyy"
          name="toDate"
          placeholderText={`To`}
          selected={formik.values.toDate}
          className={`input input-sm input-bordered rounded focus:outline-none`}
          onChange={(date) => formik.setFieldValue("toDate", date)}
          onBlur={formik.handleBlur}
          onKeyUp={(e) => {
            e.target.value === "" ? formik.handleSubmit() : null;
          }}
          onKeyDown={(e) => pressEnter(e)}
        />
        <button
          type={"button"}
          onClick={() => {
            formik.resetForm();
            formik.handleSubmit();
          }}
          className="btn btn-sm min-w-[2rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
        >
          <GrPowerReset className="text-green-slimy" />
        </button>
        <button
          type={"button"}
          onClick={() => {
            setCurrentPage(0);
            setForcePage(0);
            formik.handleSubmit();
          }}
          disabled={
            formik.values.startDate === "" || formik.values.endDate === ""
              ? true
              : false
          }
          className="btn btn-sm min-w-[5rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
        >
          Apply Filter
        </button>
        <div className={`flex flex-col md:flex-row gap-5  `}>
          <button
            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
            onClick={() => window.cci_modal.showModal()}
          >
            <FaPlus />
            <span>Add Check In</span>
          </button>
        </div>
      </div>

      {/* <div className="flex justify-end"></div> */}
      {!isLoading ? (
        checkInData?.data?.docs?.length ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Date</th>
                  <th>Number of CheckIn</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {checkInData &&
                  checkInData?.data?.docs?.map((item, idx) => {
                    return (
                      <tr
                        className={
                          idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                        }
                      >
                        <th>{++idx}</th>
                        <td>
                          {getOnlyFormatDate(item?.date)}
                          {/* {new Date(item?.date).toLocaleDateString()} */}
                        </td>
                        <td>
                          <div className="flex">
                            <div>
                              <span>{item?.today_remaining_checkin}</span>
                            </div>
                          </div>
                        </td>
                        <td className={`space-x-1.5`}>
                          <span
                            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ms-2`}
                            onClick={() =>
                              navigate(
                                `/dashboard/daily-checkin?date=${item?.date}`
                              )
                            }
                          >
                            <FaEye />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {checkInData?.data?.docs?.length && (
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
                  pageCount={checkInData?.data?.totalPages}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageClick}
                  renderOnZeroPageCount={null}
                  forcePage={forcePage}
                />
              </div>
            )}
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
      <Modal id={`cci_modal`} classNames={`bg-white  sm:max-w-[60%]`}>
        <ManageCheckinModal />
      </Modal>
    </div>
  );
};

export default ManageCheckin;
