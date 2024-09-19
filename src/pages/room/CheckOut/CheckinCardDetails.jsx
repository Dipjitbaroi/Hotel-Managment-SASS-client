import React from "react";
import { BiRupee } from "react-icons/bi";
import { GiExpense } from "react-icons/gi";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { SiSellfy } from "react-icons/si";
import { FcPaid } from "react-icons/fc";
import { TbCalendarDue } from "react-icons/tb";
import { MdOutlineAccountBalance } from "react-icons/md";
import { LuWallet } from "react-icons/lu";

const CheckinCardDetails = ({ data }) => {
  let totalDueAmount;

  if (
    data?.paid_amount !== undefined &&
    data?.total_payable_amount !== undefined
  ) {
    totalDueAmount = Math.max(data.total_payable_amount - data.paid_amount, 0);
  }

  return (
    <div>
      <div
        // className={`grid grid-cols-[repeat(auto-fit,_minmax(5.5rem,_1fr))] gap-3 mb-20`}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
      >
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#309267] to-[#06724c] p-2 rounded-md text-white">
            <HiOutlineCurrencyRupee />
          </div>
          <h6 className="text-xs text-slate-400 ">TOTAL PAID AMOUNT</h6>
          <p className="text-2xl font-semibold mt-4">
            <div className="flex justify-end">
              <div>
                <BiRupee />
              </div>
              <div>
                <span>{data?.paid_amount}</span>
              </div>
            </div>
          </p>
          <hr />
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#d32a26] to-[#d93935] p-3 rounded-md">
            <LuWallet />
          </div>
          <div>
            <h6 className="text-xs text-slate-400">TOTAL BILL</h6>
            <p className="text-2xl font-semibold mt-4">
              <div className="flex justify-end">
                <div>
                  <BiRupee />
                </div>
                <div>
                  <span>{Math.ceil(data?.total_payable_amount)}</span>
                </div>
              </div>
            </p>
            <hr />
          </div>
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#32cf8b] to-[#0d835a] p-3 rounded-md text-white">
            <TbCalendarDue />
          </div>
          <h6 className="text-xs text-slate-400 ">TOTAL DUE AMOUNT</h6>
          <p className="text-2xl font-semibold mt-4">
            <div className="flex justify-end">
              <div>
                <BiRupee />
              </div>
              <div>
                <span>
                  {data?.paid_amount < data?.total_payable_amount
                    ? Math.ceil(data?.total_payable_amount - data?.paid_amount)
                    : 0}
                </span>
              </div>
            </div>
          </p>
          <hr />
        </div>
        <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-4">
          <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#c6c624] to-[#4e7107] p-3 rounded-md text-white">
            <MdOutlineAccountBalance />
          </div>
          <h6 className="text-xs text-slate-400 ">AVAILABLE BALANCE</h6>
          <p className="text-2xl font-semibold mt-4">
            <div className="flex justify-end">
              <div>
                <BiRupee />
              </div>
              <div>
                <span>
                  {data?.paid_amount > data?.total_payable_amount
                    ? (data?.paid_amount - data?.total_payable_amount).toFixed(
                        2
                      )
                    : 0}
                </span>
              </div>
            </div>
          </p>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default CheckinCardDetails;
