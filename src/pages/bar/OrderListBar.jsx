import React, { useState } from "react";
import { FaEye, FaRegEdit, FaStreetView } from "react-icons/fa";
import { GrView } from "react-icons/gr";
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
import {useDeleteBarOrderMutation, useOrdersBarQuery} from "../../redux/bar/barAPI.js";
// import StatusSettings from "./StatusSettings.jsx";

const OrderListBar = () => {
  const navigate = useNavigate();
  const [ordersPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const { data: hotelList } = useGetRoomsAndHotelsQuery();
  const [deleteBarOrder] = useDeleteBarOrderMutation();

  const formik = useFormik({
    initialValues: {
      entries: "",
      search: "",
      startDate: "",
      endDate: "",
      chooseHotel: "",
    },
  });

  const { isLoading, data: orders } = useOrdersBarQuery({
    id: formik.values.chooseHotel,
    cp: currentPage,
    pp: ordersPerPage,
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
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Deleted!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          deleteBarOrder(id);
        });
      }
    });
  };

  return (
    <div className={`px-5 space-y-5`}>
      <div className={`bg-white px-10 py-5 rounded`}>
        <h3 className={`text-2xl font-semibold text-center`}>Order List</h3>
        <div className={`flex `}>
          <div className="flex flex-col gap-3">
            <select
              name="chooseHotel"
              className="input input-md h-8 bg-transparent input-bordered border-green-slimy rounded focus:outline-none focus:border-green-slimy"
              value={formik.values.chooseHotel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Choose Hotel
              </option>
              {hotelList?.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
            {formik.touched.chooseHotel &&
            Boolean(formik.errors.chooseHotel) ? (
              <small className="text-red-600">
                {formik.touched.chooseHotel && formik.errors.chooseHotel}
              </small>
            ) : null}
          </div>
        </div>
        <hr className={`my-5`} />
        <div className={`space-y-10`}>
          {formik.values.chooseHotel ? (
            orders?.data?.docs?.length ? (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Date</th>
                        <th>Room Number</th>
                        <th>Paid Amount</th>
                        <th>Unpaid Amount</th>
                        <th>Status</th>
                        <th>Total</th>
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
                            <td>
                              {new Date(order?.createdAt).toLocaleString()}
                            </td>
                            <td>{order?.room_id?.roomNumber}</td>
                            <td>{order?.paid_amount}</td>
                            <td>{order?.unpaid_amount}</td>
                            <td>{order?.status}</td>
                            <td>{order?.price}</td>
                            <td>
                              <span
                                onClick={() => handleDelete(order?._id)}
                                className={`btn btn-sm bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case`}
                              >
                                <FcCancel />
                              </span>
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
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={2}
                    onPageChange={handlePageClick}
                    renderOnZeroPageCount={null}
                  />
                </div>
              </>
            ) : (
              <h3 className={`text-center`}>No data found!</h3>
            )
          ) : (
            <h3 className={`text-center`}>Please choose a hotel</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListBar;
