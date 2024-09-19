import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaDollyFlatbed,
  FaUsers,
  FaCalendarDay,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { MdAutorenew } from "react-icons/md";
import { BsClipboard2DataFill, BsFillSendCheckFill } from "react-icons/bs";
import CustomerReservation from "./CustomerReservation";
import BookingChart from "./BookingChart";
import ReservationChart from "./ReservationChart";
import TotalBookingAmountAndNumber from "./TotalBookingAmountAndNumber";
import CustomerList from "./CustomerList";
import TodaysBooking from "./TodaysBooking";
import NextBooking from "./NextBooking";
import { useSelector } from "react-redux";
import { GiCoins } from "react-icons/gi";
import { GrCurrency } from "react-icons/gr";
import { useGetDashboardInfoQuery } from "../../redux/dashboard/dashboardApi";
import { Rings } from "react-loader-spinner";
import AllExpeseAnalytics from "./AllExpeseAnalytics";
import OwnerExpeseAnalytics from "./OwnerExpeseAnalytics";
import { dummyData, isValidUrl } from "../../utils/utils";
import { useLocation, useNavigate } from "react-router-dom";
// import { useLocation } from 'react-router-dom';

const UserDashBoard = ({ managerId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.authSlice);
  const { pathname } = useLocation();
  const {
    data: dashboardData,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardInfoQuery(managerId ? managerId : user?._id);
  const [userHotel, setUserHotel] = useState(
    user?.role === "manager" || user?.role === "owner"
  );
  useEffect(() => {
    refetch();
  }, [location.pathname]);

  if (isLoading || isError) {
    return (
      <Rings
        width="50"
        height="50"
        color="#37a000"
        wrapperClass="justify-center"
      />
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <section
          // className={`grid grid-cols-[repeat(auto-fit,_minmax(5.5rem,_1fr))] gap-2.5 `}
          className="grid md:grid-cols-4 gap-4 mt-4"
        >
          <div
            className={`relative bg-white p-3  text-right rounded shadow hover:shadow-md duration-200  mb-4 ${
              userHotel ? "" : "pb-14 "
            }`}
          >
            <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#f67709] to-[#fe9302] p-3 rounded-md ">
              {userHotel ? <FaCalendarDay /> : <FaDollyFlatbed />}
            </div>
            <div
              onClick={() =>
                navigate(
                  user?.role === "manager"
                    ? "todays-checkin-list"
                    : user?.role === "owner"
                    ? `/dashboard/owner-todays-checkin-list?manager_id=${managerId}`
                    : ""
                )
              }
              className={
                user?.role === "manager" || user?.role === "owner"
                  ? "cursor-pointer"
                  : ""
              }
            >
              <h6 className="text-xs text-slate-400 ">
                {userHotel ? "TODAY'S CHECK IN" : "TOTAL SELL"}
              </h6>
              <p className="text-2xl font-semibold mt-3">
                {Math.floor(
                  userHotel
                    ? dashboardData?.daily_datas[0]
                      ? dashboardData?.daily_datas[0]?.today_checkin
                      : 0
                    : dashboardData?.permanent_datas
                    ? dashboardData?.permanent_datas?.total_sell_lic
                    : 0
                )}
                {}
              </p>
            </div>
            <hr />
            {userHotel ? (
              <div
                onClick={() =>
                  navigate(
                    user?.role === "manager"
                      ? "/dashboard/today-checkouts"
                      : user?.role === "owner"
                      ? `/dashboard/owner-todays-checkout-list?manager_id=${managerId}`
                      : ""
                  )
                }
                className="cursor-pointer"
              >
                <h6 className="text-xs text-slate-400 mt-4">
                  TODAY'S CHECK OUT
                </h6>
                <p className="text-2xl font-semibold mt-4">
                  {Math.floor(
                    dashboardData?.daily_datas[0]?.today_checkout || 0
                  )}
                </p>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {user?.role === "manager" || user?.role === "owner" ? (
            <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
              <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#282884] to-[#1616ff] p-3 rounded-md">
                <BsClipboard2DataFill />
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  navigate(
                    user?.role === "manager"
                      ? "/dashboard/today-bookings"
                      : user?.role === "owner"
                      ? `/dashboard/owner-today-bookings-list?manager_id=${managerId}`
                      : ""
                  )
                }
              >
                <h6 className="text-xs text-slate-400 uppercase">
                  TODAY'S Booking
                </h6>
                <p className="text-2xl font-semibold mt-3">
                  {Math.floor(
                    dashboardData?.daily_datas[0]?.today_booking || 0
                  )}
                </p>
              </div>
              <hr />
              <div
                className="cursor-pointer"
                onClick={() =>
                  navigate(
                    user?.role === "manager"
                      ? "/dashboard/today-cancel-bookings"
                      : user?.role === "owner"
                      ? `/dashboard/owner-today-bookings-cancel?manager_id=${managerId}`
                      : ""
                  )
                }
              >
                <h6 className="text-xs text-slate-400 mt-4">
                  TODAY'S CANCELED BOOKING
                </h6>
                <p className="text-2xl font-semibold mt-4">
                  {Math.floor(
                    dashboardData?.daily_datas[0]?.today_canceled_bookings || 0
                  )}
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Total Amount */}
          <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
            <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#309267] to-[#4ba555] p-3 rounded-md">
              {/* <FaDollarSign /> */}
              <GiCoins className={`db-currency text-white`} />
            </div>
            <h6 className="text-xs text-slate-400 ">TOTAL AMOUNT</h6>
            <p className="text-2xl font-semibold mt-4">
              {Math.floor(dashboardData?.permanent_datas?.total_amount || 0)}
            </p>
            <hr />
          </div>
          {user.role === "admin" || user.role === "subadmin" ? (
            <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
              <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#d32a26] to-[#d93935] p-3 rounded-md">
                <FaUsers />
              </div>
              <div>
                <h6 className="text-xs text-slate-400">TOTAL CUSTOMER</h6>
                <p className="text-2xl font-semibold mt-4">
                  {dashboardData?.permanent_datas?.total_customer || 0}
                </p>
                <hr />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200  mb-5">
            <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#23c4d8] to-[#03aec3] p-3 rounded-md ">
              {userHotel ? <FaRegCalendarAlt /> : <MdAutorenew />}
            </div>
            <h6 className="text-xs text-slate-400 ">
              TOTAL {userHotel ? "CHECK IN" : "RENEW"}
            </h6>
            <p className="text-2xl font-semibold mt-4">
              {Math.floor(
                userHotel
                  ? dashboardData?.permanent_datas?.total_checkin || 0
                  : dashboardData?.permanent_datas?.total_renew_lic || 0
              )}
            </p>
            <hr />
            {userHotel ? (
              <div>
                <h6 className="text-xs text-slate-400 mt-4">
                  TOTAL {userHotel ? "  CHECK OUT" : "Renew "}
                </h6>
                <p className="text-2xl font-semibold mt-4">
                  {Math.floor(
                    dashboardData?.permanent_datas?.total_checkout || 0
                  )}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mt-3">
        <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#23c4d8] to-[#03aec3] p-3 rounded-md">
          {userHotel ? <BsFillSendCheckFill /> : <MdAutorenew />}
        </div>
        <h6 className="text-xs text-slate-400">
          TOTAL {userHotel ? "CHECK Out" : "RENEW"}
        </h6>
        <p className="text-2xl font-semibold mb-5">750</p>
        <hr />
      </div> */}
        </section>

        <section className="bg-white p-3 mt-8 rounded shadow hover:shadow-md duration-200">
          <CustomerReservation
            monthlyData={[...dashboardData?.monthly_datas, ...dummyData]}
            userHotel={userHotel}
            managerId={managerId}
            userId={user?._id}
          />
        </section>

        <section className="mt-8 grid md:grid-cols-2 gap-5">
          <div className="bg-white max-w-[100%] p-3 rounded shadow hover:shadow-md duration-200">
            <BookingChart
              daily_datas={dashboardData?.daily_datas}
              permanent_datas={dashboardData?.permanent_datas}
              userManager={userHotel}
              managerId={managerId}
              userId={user?._id}
            />
          </div>
          <div className="bg-white p-3 rounded shadow hover:shadow-md duration-200">
            <ReservationChart
              userManager={userHotel}
              monthlyData={[...dashboardData?.monthly_datas, ...dummyData]}
              managerId={managerId}
              userId={user?._id}
            />
          </div>
        </section>

        <section className="mt-8 grid md:grid-cols-2 gap-5">
          {/* <div className="bg-white p-3 rounded shadow hover:shadow-md duration-200">
        <TotalBookingAmountAndNumber />
      </div> */}

          {/* customer list */}
          {/* <div className="bg-white p-3 rounded shadow hover:shadow-md duration-200">
        <CustomerList />
      </div> */}
          {/* </section> */}

          {/* <section className="mt-8 grid md:grid-cols-2 gap-5"> */}
          {/* <div className="bg-white p-3 rounded shadow hover:shadow-md duration-200">
        <TodaysBooking />
      </div> */}

          {/* NextBooking box */}
          {/* {userHotel && (
        <div className="bg-white p-3 rounded shadow hover:shadow-md duration-200">
          <NextBooking />
        </div>
      )} */}
        </section>

        {user?.role === "manager" ||
        isValidUrl("dashboard/finance", pathname) ? (
          <section>
            <AllExpeseAnalytics
              user={user}
              userHotel={userHotel}
              dashboardData={dashboardData}
              dummyData={dummyData}
            />
          </section>
        ) : null}
        {!isValidUrl("dashboard/finance", pathname) &&
        user?.role === "owner" ? (
          <section>
            <OwnerExpeseAnalytics
              user={user}
              userHotel={userHotel}
              dashboardData={dashboardData}
              dummyData={dummyData}
            />
          </section>
        ) : null}
      </div>
    </>
  );
};

export default UserDashBoard;
