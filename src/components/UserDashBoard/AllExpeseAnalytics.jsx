import React from "react";
import CustomerReservation from "./CustomerReservation";
import BookingChart from "./BookingChart";
import ReservationChart from "./ReservationChart";
import {
  FaCalendarDay,
  FaDollyFlatbed,
  FaRegCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import { BsClipboard2DataFill } from "react-icons/bs";
import { GiCoins } from "react-icons/gi";
import { MdAutorenew, MdCurrencyRupee } from "react-icons/md";
import { BiDollar } from "react-icons/bi";
import ExpensesChart from "./ExpesesChart";
import ThreeBarChart from "./ThreeBarChart";
import RestaurantDashboardChart from "./RestaurantDashboardChart";

const AllExpeseAnalytics = ({ dashboardData, dummyData, userHotel, user }) => {

  return (
    <div className="mt-10">
      <div>
        <section
          // className={`grid grid-cols-[repeat(auto-fit,_minmax(5.5rem,_1fr))] gap-2.5`}
          className="grid md:grid-cols-4 gap-4 mt-4"
        >
          <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-5">
            <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#f67709] to-[#fe9302] p-3 rounded-md">
              <GiCoins className={`db-currency text-white`} />
            </div>
            <h6 className="text-xs text-slate-400 uppercase">
              Total Restaurant Expense
            </h6>
            <p className="text-2xl font-semibold mt-3">
              <span className="text-end flex justify-end items-center">
                <MdCurrencyRupee />
                {dashboardData?.overall_datas?.total_restaurant_expenses}
              </span>
            </p>
          </div>
          <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-5">
            <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#282884] to-[#1616ff] p-3 rounded-md">
              <GiCoins className={`db-currency text-white`} />
            </div>
            <h6 className="text-xs text-slate-400 uppercase">
              Total Restaurant Sale
            </h6>
            <p className="text-2xl font-semibold mt-3">
              <span className="text-end flex justify-end items-center">
                <MdCurrencyRupee />
                {dashboardData?.overall_datas?.total_restaurant_income}
              </span>
            </p>
          </div>

          {/* Total Amount */}
          <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-5">
            <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#d32a26] to-[#d93935] p-3 rounded-md">
              <GiCoins className={`db-currency text-white`} />
            </div>
            <h6 className="text-xs text-slate-400 uppercase">
              TOTAL Hotel Expense
            </h6>
            <p className="text-2xl font-semibold mt-3">
              <span className="text-end flex justify-end items-center">
                <MdCurrencyRupee />
                {dashboardData?.overall_datas?.total_hotel_expenses}
              </span>
            </p>
          </div>

          <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-5">
            <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#309267] to-[#4ba555] p-3 rounded-md">
              <GiCoins className={`db-currency text-white`} />
            </div>

            <div>
              <h6 className="text-xs text-slate-400 uppercase">
                Total Hotel Revenue
              </h6>
              <p className="text-2xl font-semibold mt-3">
                <span className="text-end flex justify-end items-center">
                  <MdCurrencyRupee />
                  {dashboardData?.overall_datas?.total_hotel_income}
                </span>
              </p>
            </div>
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

        <section className="mt-10 max-w-[25rem] mx-auto">
          <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-5">
            <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#282884] to-[#1616ff] p-3 rounded-md">
              <MdCurrencyRupee />
            </div>
            <h6 className="text-xs text-slate-400 uppercase">Net Profit</h6>
            <p className="text-2xl font-semibold mt-3">
              <span className="text-end flex justify-end items-center">
                <MdCurrencyRupee />
                {dashboardData?.overall_datas?.total_net_profit}
              </span>
            </p>
          </div>
        </section>

        <section className="bg-white p-3 mt-8 rounded shadow hover:shadow-md duration-200">
          <h1 className="text-[1.2rem] text-center font-bold">
            Financial OverView
          </h1>
          {/* <ExpensesChart
            monthlyData={[...dashboardData?.monthly_datas, ...dummyData]}
            userHotel={userHotel}
          /> */}
          <RestaurantDashboardChart
            monthlyData={[...dummyData, ...dashboardData?.monthly_datas]}
          />
        </section>

        <section className="mt-8 grid md:grid-cols-2 gap-5">
          {/* <div className="bg-white p-3 rounded shadow hover:shadow-md duration-200">
            <BookingChart
              daily_datas={dashboardData?.daily_datas}
              permanent_datas={dashboardData?.permanent_datas}
              userManager={userHotel}
            />
          </div> */}
          {/* <div className="bg-white p-3 rounded shadow hover:shadow-md duration-200">
            <ReservationChart
              userManager={userHotel}
              monthlyData={[...dashboardData?.monthly_datas, ...dummyData]}
            />
          </div> */}
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
      </div>
    </div>
  );
};

export default AllExpeseAnalytics;
