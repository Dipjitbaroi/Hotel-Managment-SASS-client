import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import Modal from "../Modal.jsx";
import HotelLimitEdit from "../../pages/Admin/HotelLimitEdit.jsx";
import HotelList from "./HotelList.jsx";
import TransactionHistory from "./TransactionHistory.jsx";
import StatusHistory from "./StatusHistory.jsx";
import { useGetUserQuery } from "../../redux/admin/subadmin/subadminAPI.js";
import store from "../../redux/store.js";
import { useSelector } from "react-redux";
import {
  getLatestDate,
  getOnlyFormatDate,
  getformatDateTime,
} from "../../utils/utils.js";
import { getIndianFormattedDate } from "../../utils/timeZone.js";

const AdminOwnerView = () => {
  const navigate = useNavigate();
  const [roomsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const user_id = store?.getState()?.authSlice?.user?._id;
  const { id } = useParams();
  const { data, isLoading, error } = useGetUserQuery(id);

  const { user } = useSelector((store) => store.authSlice);
  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };
  const countDays = Math.ceil(
    (new Date(
      data?.extended_time?.length
        ? getLatestDate(data?.extended_time).to
        : data?.bill_to
    ) -
      new Date()) /
      (24 * 60 * 60 * 1000)
  );
  return (
    <>
      <div className={`space-y-10 container`}>
        <div className="card w-full max-w-full bg-white shadow-xl p-2 sm:p-5">
          <div>
            <span
              className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </span>
          </div>
          <div>
            <h1 className="bg-green-slimy text-2xl text-center text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 mt-5">
              Client Information
            </h1>
          </div>
          <div className="card-body grid grid-cols xl:grid-cols-2 gap-4">
            <div className="">
              <h2 className="card-title mb-3">Client Information </h2>

              <table className="table-auto overflow-x-auto">
                <tbody>
                  <tr>
                    <th className="text-start">User Name</th>
                    <td className="pl-3">:</td>
                    <td className="break-all pl-4">{data?.username}</td>
                  </tr>
                  <tr>
                    <th className="text-start">Name</th>
                    <td className="pl-3">:</td>
                    <td className="break-all pl-4"> {data?.name}</td>
                  </tr>
                  <tr>
                    <th className="text-start">Address</th>
                    <td className="pl-3">:</td>
                    <td className="break-all pl-4">
                      <span>{data?.address}</span>
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Contact No</th>
                    <td className="pl-3">:</td>
                    <td className="break-all">
                      <span className="break-all pl-4">{data?.phone_no}</span>
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Emergency No</th>
                    <td className="pl-3">:</td>
                    <td className="break-all">
                      <span className="break-all pl-4">
                        {data?.emergency_contact}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th className="text-start">Email</th>
                    <td className="pl-3">:</td>
                    <td className="break-all pl-4">
                      <span>{data?.email}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="card-title mb-3">License Information </h2>

              <table>
                <tbody>
                  <tr>
                    <th className="text-start">License Key</th>
                    <td className="pl-5">:</td>
                    <td className="md:pl-2 max-w-[200px] sm:max-w-full sm:text-xs md:text-sm lg:text-base xl:text-lg break-all pl-5">
                      {data?.license_key}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Purchase Date</th>
                    <td className="pl-5">:</td>
                    <td className="md:pl-2 break-all pl-5">
                      {getformatDateTime(data?.createdAt)}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Renew Date</th>
                    <td className="pl-5">:</td>
                    <td className="md:pl-2 break-all pl-5">
                      {data?.extended_time?.length
                        ? getIndianFormattedDate(
                            getLatestDate(data?.extended_time).from
                          )
                        : getIndianFormattedDate(data?.bill_from)}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Expire Date</th>
                    <td className="pl-5">:</td>
                    <td className="md:pl-2 break-all pl-5">
                      {" "}
                      {data?.extended_time?.length
                        ? getIndianFormattedDate(
                            getLatestDate(data?.extended_time).to
                          )
                        : getIndianFormattedDate(data?.bill_to)}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Remain Days</th>
                    <td className="pl-5">:</td>
                    <td className="md:pl-2 break-all pl-5">
                      {" "}
                      {countDays < 0 ? 0 : countDays} Days
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start"> Status</th>
                    <td className="pl-5">:</td>
                    <td className="md:pl-2 break-all pl-5">{data?.status}</td>
                  </tr>

                  <tr>
                    <th className="text-start">Number Of Hotels</th>
                    <td className="pl-5">:</td>
                    <td className="flex gap-2 items-center mt-4 md:mt-0">
                      {" "}
                      <span className="md:pl-2 pl-5">
                        {data?.maxHotels}
                      </span>{" "}
                      <span
                        className={`cursor-pointer`}
                        onClick={() => window.hle_modal.showModal()}
                      >
                        <FaEdit />
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

             
            </div>
          </div>
        </div>

        <HotelList hotels={data?.assignedHotel} />
        <TransactionHistory />
        <StatusHistory />
      </div>
      <Modal id={`hle_modal`}>
        <HotelLimitEdit data={data} hotels={data?.maxHotels} />
      </Modal>
    </>
  );
};

export default AdminOwnerView;
