import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const BookingChart = ({
  userManager,
  permanent_datas,
  managerId,
  userId,
  daily_datas,
}) => {
  const [chartProps, setChartProps] = useState({
    series: [
      // !userManager && chartData?.total_active_lic,
      // userManager ? chartData?.total_checkin : chartData?.total_renew_lic,
      // userManager ? chartData?.total_checkout : chartData?.total_expired_lic,
      // userManager ? chartData?.total_booking : chartData?.total_suspended_lic,
    ],
    options: {
      chart: {
        type: "donut",
      },
      title: {
        text: `${userManager ? "Total History" : "Current History"}`,
        align: "left",
      },
      labels: userManager
        ? ["Check in", "Checkout", "Booking"]
        : ["New", "Renew", "Expired", "Suspended"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  useEffect(() => {
    if (userManager) {
      setChartProps((prev) => ({
        ...prev,
        series: [
          permanent_datas ? permanent_datas?.total_checkin : 0,
          permanent_datas ? permanent_datas?.total_checkout : 0,
          permanent_datas ? permanent_datas?.total_booking : 0,
          permanent_datas ? permanent_datas?.total_canceled : 0,
        ],
        options: {
          ...prev.options,
          labels: ["Check in", "Checkout", "Booking", "Booking canceled"],
        },
      }));
    } else {
      setChartProps((prev) => ({
        ...prev,
        series: [
          permanent_datas ? permanent_datas?.total_active_lic : 0,
          permanent_datas ? permanent_datas?.total_renew_lic : 0,
          permanent_datas ? Math.abs(permanent_datas?.total_expired_lic) : 0,
          permanent_datas ? permanent_datas?.total_suspended_lic : 0,
        ],
        options: {
          ...prev.options,
          labels: ["New", "Renew", "Expired", "Suspend"],
        },
      }));
    }
  }, [userManager, managerId, userId]);
  return (
    <div className="ml-20 md:ml-0">
      <ReactApexChart
        options={chartProps.options}
        series={chartProps.series}
        type="donut"
      />
    </div>
  );
};

export default BookingChart;
