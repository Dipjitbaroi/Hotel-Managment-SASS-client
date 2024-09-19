import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEye,
  FaPrint,
  FaRegEdit,
  FaSearch,
  FaStreetView,
  FaTrash,
} from "react-icons/fa";
import { GrPowerReset, GrView } from "react-icons/gr";
import { AiFillSetting, AiTwotoneDelete } from "react-icons/ai";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Modal from "../../components/Modal.jsx";
import {
  useDeleteOrderMutation,
  useFoodsQuery,
  useOrdersQuery,
} from "../../redux/restaurant/foodAPI.js";
import { useGetRoomsAndHotelsQuery } from "../../redux/room/roomAPI.js";
import { FcCancel } from "react-icons/fc";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { MdCancel } from "react-icons/md";
import DatePicker from "react-datepicker";
import {
  getConvertedIsoEndDate,
  getConvertedIsoStartDate,
  getFormateDateAndTime,
  getISOStringDate,
  getformatDateTime,
} from "../../utils/utils.js";
import { convertedEndDate, convertedStartDate } from "../../utils/timeZone.js";
// import StatusSettings from "./StatusSettings.jsx";

const OrderList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [ordersPerPage] = useState(10);
  const [forcePage, setForcePage] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);



  const [deleteOrder] = useDeleteOrderMutation();
  const [searchParams, setSearchParams] = useState({
    fromDate: "",
    toDate: "",
    unique_id: "",
  });
  const formik = useFormik({
    initialValues: {
      entries: "",
      search: "",
      startDate: "",
      endDate: "",
      // chooseHotel: "",
    },
    onSubmit: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setSearch(values.search);
      // if (values.search) {
      // }
      setSearchParams((p) => ({
        ...p,
        toDate: p && values.endDate ? convertedEndDate(values.endDate) : "",
        fromDate:
          p && values.startDate ? convertedStartDate(values.startDate) : "",
        unique_id: values.search,
      }));
      
    },
    onReset: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setSearchParams(null);
    },
  });

  const { isLoading, data: orders } = useOrdersQuery({
    ...searchParams,
    cp: currentPage,
    pp: ordersPerPage,
    unique_id: search,
  });
  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Order will be cancel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#35bef0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteOrder(id);
          if (!response.error) {
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
  };
  useEffect(() => {
    setPageCount(orders?.data?.totalPages);
  }, [orders]);

  const pressEnter2 = (e) => {
    if (e.key === "Enter" || e.search === 13) {
      formik.handleSubmit();
    }
  };

  return (
    <div className={`px-5 space-y-5`}>
      <div className={`bg-white p-4 rounded`}>
        <div className="mb-5">
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
        <h3
          className={`bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}
        >
          Order List
        </h3>
        <div className={``}>
          <div className={`flex flex-col md:flex-row gap-3`}>
            <DatePicker
              autoComplete={`off`}
              dateFormat="dd/MM/yyyy"
              name="startDate"
              placeholderText={`From`}
              selected={formik.values.startDate}
              className={`input input-sm input-bordered rounded focus:outline-none`}
              onChange={(date) => formik.setFieldValue("startDate", date)}
              onBlur={formik.handleBlur}
              onKeyUp={(e) => {
                e.target.value === "" ? formik.handleSubmit() : null;
              }}
              onKeyDown={(e) => pressEnter(e)}
            />
            <DatePicker
              autoComplete={`off`}
              dateFormat="dd/MM/yyyy"
              name="endDate"
              placeholderText={`To`}
              selected={formik.values.endDate}
              className={`input input-sm input-bordered rounded focus:outline-none`}
              onChange={(date) => formik.setFieldValue("endDate", date)}
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
                // setSearchParams(null);
              }}
              className="btn btn-sm min-w-[2rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
            >
              <GrPowerReset className="text-green-slimy" />
            </button>

            <button
              type={"button"}
              onClick={() => {
                setCurrentPage(0);
                formik.handleSubmit();
              }}
              disabled={
                formik.values.startDate === "" || formik.values.endDate === ""
                  ? true
                  : false
              }
              className="btn btn-sm min-w-[5rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case mb-4"
            >
              Apply Filter
            </button>
          </div>
          <div className={`relative max-w-xs w-full`}>
            <input
              type="text"
              placeholder="Search by invoice number..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
              value={formik.values.search}
              onChange={formik.handleChange}
              onKeyUp={(e) => {
                e.target.value === "" && setForcePage(1);
                e.target.value === "" && setCurrentPage(0);
                e.target.value === "" ? formik.handleSubmit() : null;
              }}
              onKeyDown={(e) => pressEnter2(e)}
            />
            <button
              onClick={formik.handleSubmit}
              type="button"
              className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
            >
              <FaSearch />
            </button>
          </div>
        </div>
        <hr className={`my-5`} />
        <div className={`space-y-10`}>
          {!isLoading ? (
            orders?.data?.docs?.length ? (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Invoice No</th>
                        <th>Date</th>
                        <th>
                          Room / Table <br /> Number
                        </th>
                        <th>Total Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.data?.docs?.map((order, idx) => {
                        return (
                          <tr
                            className={
                              idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                            }
                          >
                            <th>{++idx}</th>
                            <td>{order?.unique_id}</td>
                            <td>{getformatDateTime(order?.createdAt)}</td>
                            <td>
                              {order?.room_id
                                ? `Room: ${order?.room_id?.roomNumber}`
                                : order?.table_id
                                ? `Table: ${order?.table_id?.table_number}`
                                : ""}
                            </td>
                            <td>{Math.round(order?.grand_total)}</td>
                            <td className={`flex gap-1.5`}>
                              <span
                                onClick={() =>
                                  navigate(
                                    `/dashboard/orderDetails/${order?._id}`
                                  )
                                }
                                className={`btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
                                title={`View`}
                              >
                                <FaEye />
                              </span>
                              {order?.order_status === "CheckedOut" ? (
                                ""
                              ) : (
                                <span
                                  onClick={() => handleDelete(order?._id)}
                                  title={`Cancel`}
                                  className={`btn btn-md hover:bg-red-500 bg-transparent hover:text-white text-red-500 !border-red-500 rounded normal-case`}
                                >
                                  <FaTrash />
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <Modal id={`ol_modal`}>{/* <StatusSettings /> */}</Modal>
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
                    pageRangeDisplayed={1}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageClick}
                    renderOnZeroPageCount={null}
                    forcePage={forcePage}
                  />
                </div>
              </>
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
      </div>
    </div>
  );
};

export default OrderList;
