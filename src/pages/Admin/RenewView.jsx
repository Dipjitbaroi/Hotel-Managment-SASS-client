import React from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useGetUserQuery } from "../../redux/admin/subadmin/subadminAPI.js";
import { Rings } from "react-loader-spinner";
import {
  getLatestDate,
  getOnlyFormatDate,
  getformatDateTime,
} from "../../utils/utils.js";
import { getIndianFormattedDate } from "../../utils/timeZone.js";

const RenewView = () => {
  const { id } = useParams();
  const { isLoading, data } = useGetUserQuery(id);

  const navigate = useNavigate();

  function calculateRemainingDays(targetDate) {
    const oneDay = 24 * 60 * 60 * 1000; // one day in milliseconds
    const currentDate = new Date();
    const targetDateObj = new Date(targetDate);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = targetDateObj - currentDate;

    // Convert the difference to days
    const remainingDays = Math.floor(differenceInMilliseconds / oneDay);
    if (remainingDays < 0) {
      return 0;
    }
    return remainingDays;
  }

  const bill_to =
    !isLoading && data?.status === "Suspended"
      ? data?.extended_time[0]?.to
      : data?.bill_to;

  // Now latestObject contains the object with the latest "to" date
  const oneDay = 24 * 60 * 60 * 1000;
  const remainingDays = Math.floor(
    (new Date(
      data?.extended_time?.length
        ? getLatestDate(data?.extended_time).to
        : data?.bill_to
    ) -
      new Date()) /
      oneDay
  );
  return (
    <div>
      <div className="card w-full bg-white shadow-xl p-5">
        <div>
          <span
            className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </span>
        </div>
        {!isLoading ? (
          <div className="card-body grid grid-cols xl:grid-cols-2 ">
            <div className="">
              <h2 className="card-title mb-3">Client Information</h2>
              <table className="table-auto overflow-x-auto ">
                <tbody>
                  <tr>
                    <th className="text-start">User Name </th>
                    <td className="pl-2">:</td>
                    <td className="break-all pl-5">{data?.username}</td>
                  </tr>
                  <tr>
                    <th className="text-start">Name</th>
                    <td className="pl-2">:</td>
                    <td className="break-all pl-5"> {data?.name}</td>
                  </tr>
                  <tr>
                    <th className="text-start">Address</th>
                    <td className="pl-2">:</td>
                    <td className="break-all pl-5">
                      <span>{data?.address}</span>
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Contact No</th>
                    <td className="pl-2">:</td>
                    <td className="break-all">
                      <span className="break-all pl-5">{data?.phone_no}</span>
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Emergency No</th>
                    <td className="pl-2">:</td>
                    <td className="break-all">
                      <span className="break-all pl-5">
                        {data?.emergency_contact}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th className="text-start">Email</th>
                    <td className="pl-2">:</td>
                    <td className="break-all pl-5">
                      <span>{data?.email}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="">
              <h2 className="card-title mb-3">License Information </h2>

              <table>
                <tbody>
                  <tr>
                    <th className="text-start">License Key</th>
                    <td className="pl-3">:</td>
                    <td className="break-all pl-5">
                      <span>{data?.license_key}</span>
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Purchase Date</th>
                    <td className="pl-3">:</td>
                    <td className=" break-all pl-5">
                      {getformatDateTime(data?.createdAt)}
                    </td>
                  </tr>
                  {data?.bill_from && (
                    <tr>
                      <th className="text-start">Renew Date</th>
                      <td className="pl-3">:</td>
                      <td className=" break-all pl-5">
                        {data?.extended_time?.length
                          ? getIndianFormattedDate(
                              getLatestDate(data?.extended_time).from
                            )
                          : getIndianFormattedDate(data?.bill_from)}
                        {/* <h6>
                     {" "}
                     Renew Date :
                     {new Date(data?.renew_date).toLocaleDateString()}{" "}
                   </h6> */}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th className="text-start">Expire Date</th>
                    <td className="pl-3">:</td>
                    <td className=" break-all pl-5">
                      {" "}
                      {data?.extended_time?.length
                        ? getIndianFormattedDate(
                            getLatestDate(data?.extended_time).to
                          )
                        : getIndianFormattedDate(data?.bill_to)}
                      {/* {getOnlyFormatDate(data?.bill_to)} */}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start">Remain Days</th>
                    <td className="pl-3">:</td>
                    <td className=" break-all pl-5">
                      {/* {" "}
                   {Math.floor(
                     Math.abs(new Date(data?.bill_to) - new Date()) /
                       (24 * 60 * 60 * 1000)
                   )}{" "}
                   Days */}
                      {remainingDays < 0 ? 0 : remainingDays} Days
                    </td>
                  </tr>
                  <tr>
                    <th className="text-start"> Status</th>
                    <td className="pl-3">:</td>
                    <td className=" break-all pl-5">{data?.status}</td>
                  </tr>

                  <tr>
                    <th className="text-start">Number Of Hotels</th>
                    <td className="pl-3">:</td>
                    <td className="flex gap-2 items-center mt-4 md:mt-0">
                      {" "}
                      <span className=" pl-5">{data?.maxHotels}</span>
                      <span
                        className={`cursor-pointer`}
                        onClick={() => window.hle_modal.showModal()}
                      ></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
  );
};

export default RenewView;
