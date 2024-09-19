import React from "react";
import { useState } from "react";
import { FaDollarSign, FaUsers } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { SiSellfy } from "react-icons/si";
import { MdOutlineLastPage } from "react-icons/md";
import { LiaSellsy } from "react-icons/lia";
import { GrMoney } from "react-icons/gr";
import { useFormik } from "formik";
import { BiDollar,BiRupee } from "react-icons/bi";
import HotelDashboardChart from "../../components/UserDashBoard/HotelDashboardChart";


const HotelDashboard = () => {
  const formik = useFormik({
    initialValues: {
      filter: "",
      search: "",
      // hotel_id: "",
    },
    onSubmit: (values) => {
      setKeyword(values.search);
    },
  });
  return (
    <>
      <div
        // className={`grid grid-cols-[repeat(auto-fit,_minmax(5.5rem,_1fr))] gap-3 mb-20`}
        className="grid md:grid-cols-3 gap-4 mb-20"
      >
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#309267] to-[#06724c] p-3 rounded-md text-white">
            <GiExpense />
          </div>
          <h6 className="text-xs text-slate-400 ">TODAY EXPENSES</h6>
          <p className="text-2xl font-semibold mt-4">
              <div className="flex justify-end">
              <div>
              <BiRupee />
              </div>
              <div>
                <span>850</span>
              </div>
              </div>
              </p>
          <hr />
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#d32a26] to-[#d93935] p-3 rounded-md">
            <SiSellfy />
          </div>
          <div>
            <h6 className="text-xs text-slate-400">TODAY'S CHECKOUT REVENUE</h6>
            <p className="text-2xl font-semibold mt-4">
              <div className="flex justify-end">
              <div>
              <BiRupee />
              </div>
              <div>
                <span>850</span>
              </div>
              </div>
              </p>
            <hr />
          </div>
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#0f874d] to-[#15d251] p-3 rounded-md">
          <BiRupee />
          </div>
          <div>
            <h6 className="text-xs text-slate-400">TODAY'S PROFIT</h6>
            <p className="text-2xl font-semibold mt-4">
              <div className="flex justify-end">
              <div>
              <BiRupee />
              </div>
              <div>
                <span>850</span>
              </div>
              </div>
              </p>
            <hr />
          </div>
        </div>
      </div>

      {/* <div className={`flex justify-center mb-20 mt-20`}>
        <div>
          <select
            name="filter"
            className="select select-sm select-bordered border-green-slimy rounded focus:outline-none"
            value={formik.values.filter}
            onChange={formik.handleChange}
          >
            <option value="">All</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastMonth3">Last 3 Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
      </div> */}

      <div
        // className={`grid grid-cols-[repeat(auto-fit,_minmax(5.5rem,_1fr))] gap-2.5`}
        className="grid md:grid-cols-3 gap-4 mb-20"
      >
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#309267] to-[#e5e50b] p-3 rounded-md text-white">
            <GiExpense />
          </div>
          <h6 className="text-xs text-slate-400 ">LAST WEEK EXPENSES</h6>
          <p className="text-2xl font-semibold mt-4">
              <div className="flex justify-end">
              <div>
              <BiRupee />
              </div>
              <div>
                <span>850</span>
              </div>
              </div>
              </p>
          <hr />
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#453092] to-[#5c08a5] p-3 rounded-md text-white">
            <LiaSellsy />
          </div>
          <h6 className="text-xs text-slate-400 ">LAST WEEK CHECKOUT REVENUE</h6>
          <p className="text-2xl font-semibold mt-4">
              <div className="flex justify-end">
              <div>
              <BiRupee />
              </div>
              <div>
                <span>850</span>
              </div>
              </div>
              </p>
          <hr />
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#079758] to-[#1eae2f] p-3 rounded-md text-white">
          <BiRupee />
          </div>
          <h6 className="text-xs text-slate-400 ">PROFIT</h6>
          <p className="text-2xl font-semibold mt-4">
              <div className="flex justify-end">
              <div>
              <BiRupee />
              </div>
              <div>
                <span>850</span>
              </div>
              </div>
              </p>
          <hr />
        </div>
      </div>

      <div>
      <section className="bg-white p-3 mt-8 rounded shadow hover:shadow-md duration-200">
        <h1  className='text-[1.2rem] text-center font-bold'>Financial Overview</h1>
       
         <HotelDashboardChart/>
        </section>
      </div>
    </>
  );
};

export default HotelDashboard;
