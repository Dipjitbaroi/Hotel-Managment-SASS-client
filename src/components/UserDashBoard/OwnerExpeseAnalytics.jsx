import React from "react";
import { GiCoins } from "react-icons/gi";
import { MdCurrencyRupee } from "react-icons/md";
import ExpensesChart from "./ExpesesChart";
import OwnerExpenseAndSalesChart from "./OwnerExpneseAndSalesChart";
import { BiRupee } from "react-icons/bi";
import ThreeBarChart from "./ThreeBarChart";
import RestaurantDashboardChart from "./RestaurantDashboardChart";
import { isValidUrl } from "../../utils/utils";
import { useLocation } from "react-router-dom";

const OwnerExpeseAnalytics = ({
  monthlyData,
  userHotel,
  dashboardData,
  dummyData,
}) => {

  const { pathname } = useLocation();
  return (
    <div>
      <div className="mt-10">
        <div>
          <section
             className="grid md:grid-cols-3 gap-4 mt-4"
          >
            <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-3">
              <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#f67709] to-[#fe9302] p-3 rounded-md ">
                <GiCoins className={`db-currency text-white`} />
              </div>
              <h6 className="text-xs text-slate-400">TOTAL EXPENSES</h6>
              <p className="text-2xl font-semibold mt-3">
                <div className="flex justify-end">
                  <div>
                    <BiRupee />
                  </div>
                  <div>
                    <span>
                      {isValidUrl("dashboard/finance", pathname) ||
                      isValidUrl("dashboard", pathname)
                        ? dashboardData?.permanent_datas?.total_expense
                        : dashboardData?.total_expense}
                    </span>
                  </div>
                </div>
              </p>
            </div>
            <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-3">
              <div className="absolute -top-[20px] text-3xl text-white bg-gradient-to-tr from-[#282884] to-[#1616ff] p-3 rounded-md">
                <GiCoins className={`db-currency text-white`} />
              </div>
              <h6 className="text-xs text-slate-400">TOTAL REVENUE</h6>
              <p className="text-2xl font-semibold mt-3">
                <div className="flex justify-end">
                  <div>
                    <BiRupee />
                  </div>
                  <div>
                    <span>
                      {isValidUrl("dashboard/finance", pathname) ||
                      isValidUrl("dashboard", pathname)
                        ? dashboardData?.permanent_datas?.total_revenue
                        : dashboardData?.total_revenue}
                    </span>
                  </div>
                </div>
              </p>
            </div>

            {/* Total Amount */}
            <div className="relative bg-white p-3 pb-14 text-right rounded shadow hover:shadow-md duration-200 mb-3">
              <div className="absolute -top-[20px] text-3xl bg-gradient-to-tr from-[#309267] to-[#4ba555] p-3 rounded-md">
                <GiCoins className={`db-currency text-white`} />
              </div>
              <h6 className="text-xs text-slate-400">NET PROFIT</h6>
              <p className="text-2xl font-semibold mt-3">
                <div className="flex justify-end">
                  <div>
                    <BiRupee />
                  </div>
                  <div>
                    <span>
                      {isValidUrl("dashboard/finance", pathname) ||
                      isValidUrl("dashboard", pathname)
                        ? dashboardData?.permanent_datas?.net_profit
                        : dashboardData?.net_profit}
                    </span>
                  </div>
                </div>
              </p>
            </div>
          </section>

          <section className="bg-white p-3 mt-8 rounded shadow hover:shadow-md duration-200">
            <RestaurantDashboardChart
              monthlyData={[...dummyData, ...dashboardData?.monthly_datas]}
            />
          </section>

          <section className="mt-8 grid md:grid-cols-2 gap-5"></section>
        </div>
      </div>
    </div>
  );
};

export default OwnerExpeseAnalytics;
