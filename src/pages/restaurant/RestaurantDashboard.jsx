import React, { useEffect } from "react";
import { useState } from "react";
import { FaArrowLeft, FaDollarSign, FaUsers } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { SiSellfy } from "react-icons/si";
import { MdAttachMoney, MdOutlineLastPage } from "react-icons/md";
import { LiaSellsy } from "react-icons/lia";
import { GrMoney } from "react-icons/gr";
import { useFormik } from "formik";
import { TbCurrencyTaka } from "react-icons/tb";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { BiRupee } from "react-icons/bi";
import RestaurantDashboardChart from "../../components/UserDashBoard/RestaurantDashboardChart";
import { useGetSubDashBoardInfoQuery } from "../../redux/expensesAndSales/expensesAndSalesApi";
import { useSelector } from "react-redux";
import { Rings } from "react-loader-spinner";
import { dummyData, isValidUrl } from "../../utils/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbSquareRoundedLetterC } from "react-icons/tb";

const RestaurantDashboard = ({ managerId }) => {

  const { user } = useSelector((state) => state.authSlice);
  const { data, isLoading, isError } = useGetSubDashBoardInfoQuery(
    managerId ? managerId : user._id
  );
  const [profit, setProfit] = useState(false);
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      setKeyword(values.search);
    },
  });

  if (isLoading || isError) {
    return (
      <div>
        <Rings
          width="50"
          height="50"
          color="#37a000"
          wrapperClass="justify-center"
        />
      </div>
    );
  }

  const location = useLocation();
  const { pathname } = location;

  return (
    <>
     <span>
  {isValidUrl("restaurant-dashboard", pathname) ? (
    <div className="mb-20">
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
  ) : isValidUrl("hotel-dashboard", pathname) ? (
    <div className="mb-20">
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
  ) : (
    ""
  )}
</span>

      <div
        className="grid md:grid-cols-3 gap-4 mb-20"
      >
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#cedc4e] to-[#a0c528] p-3 rounded-md text-white">
            <GiExpense />
          </div>
          <h6 className="text-xs text-slate-400 ">TODAY'S EXPENSES</h6>
          <p className="text-2xl font-semibold mt-4">
            <div className="flex justify-end">
              <div>
                <BiRupee />
              </div>
              <div>
                <span>
                  {isValidUrl("restaurant", pathname)
                    ? data?.daily_datas[0]?.today_restaurant_expenses || 0
                    : data?.daily_datas[0]?.today_hotel_expenses || 0}
                </span>
              </div>
            </div>
          </p>
          <hr />
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#26d360] to-[#44c60c8a] p-3 rounded-md">
            <TbSquareRoundedLetterC />
          </div>
          <div>
            <h6 className="text-xs text-slate-400">
              TODAY'S{" "}
              {isValidUrl("restaurant", pathname)
                ? "SALES"
                : "CHECKOUT REVENUE"}
            </h6>
            <p className="text-2xl font-semibold mt-4">
              <div className="flex justify-end">
                <div>
                  <BiRupee />
                </div>
                <div>
                  <span>
                    {isValidUrl("restaurant", pathname)
                      ? data?.daily_datas[0]?.today_restaurant_income || 0
                      : data?.daily_datas[0]?.today_hotel_income || 0}
                  </span>
                </div>
              </div>
            </p>
            <hr />
          </div>
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#1ca167] to-[#11ad77] p-3 rounded-md text-white">
            <HiOutlineCurrencyRupee />
          </div>
          <h6 className="text-xs text-slate-400 ">TODAY'S PROFIT</h6>
          <p className="text-2xl font-semibold mt-4">
            <div className="flex justify-end">
              <div>
                <BiRupee />
              </div>
              <div>
                <span>
                  {isValidUrl("restaurant", pathname)
                    ? data?.daily_datas[0]?.today_restaurant_profit || 0
                    : data?.daily_datas[0]?.today_hotel_profit || 0}
                </span>
              </div>
            </div>
          </p>
          <hr />
        </div>
      </div>

      <div
        className="grid md:grid-cols-3 gap-4 mt-4"
      >
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#16b36f] to-[#0be554] p-3 rounded-md text-white">
            <GiExpense />
          </div>
          <h6 className="text-xs text-slate-400 ">LAST WEEK EXPENSES</h6>
          <p className="text-2xl font-semibold mt-4">
            <div className="flex justify-end">
              <div>
                <BiRupee />
              </div>
              <div>
                <span>
                  {isValidUrl("restaurant", pathname)
                    ? data?.last_week_data?.last_week_restaurant_expenses
                    : data?.last_week_data?.last_week_hotel_expenses}
                </span>
              </div>
            </div>
          </p>
          <hr />
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#453092] to-[#5c08a5] p-3 rounded-md text-white">
            <LiaSellsy />
          </div>
          <h6 className="text-xs text-slate-400 ">
            LAST WEEK{" "}
            {isValidUrl("restaurant", pathname) ? "SALES" : "CHECKOUT REVENUE"}
          </h6>
          <p className="text-2xl font-semibold mt-4">
            <div className="flex justify-end">
              <div>
                <BiRupee />
              </div>
              <div>
                <span>
                  {isValidUrl("restaurant", pathname)
                    ? data?.last_week_data?.last_week_restaurant_income
                    : data?.last_week_data?.last_week_hotel_income}
                </span>
              </div>
            </div>
          </p>
          <hr />
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#e00d54] to-[#f70d57] p-3 rounded-md text-white">
            <HiOutlineCurrencyRupee />
          </div>

          <h6 className="text-xs text-slate-400 ">PROFIT</h6>
          <p className="text-2xl font-semibold mt-4">
            <div className="flex justify-end">
              <div>
                <BiRupee />
              </div>
              <div>
                <span>
                  {isValidUrl("restaurant", pathname)
                    ? data?.last_week_data?.last_week_restaurant_profit
                    : data?.last_week_data?.last_week_hotel_profit}
                </span>
              </div>
            </div>
          </p>
          <hr />
        </div>
      </div>
      <div>
        <section className="bg-white p-3 mt-8 rounded shadow hover:shadow-md duration-200 mb-4">
          <h1 className="text-[1.2rem] text-center font-bold">
            Financial Overview
          </h1>

          <RestaurantDashboardChart
            monthlyData={[...dummyData, ...data?.monthly_datas]}
          />
        </section>
      </div>
    </>
  );
};

export default RestaurantDashboard;
