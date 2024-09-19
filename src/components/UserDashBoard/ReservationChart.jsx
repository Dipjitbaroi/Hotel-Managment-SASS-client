import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ReservationChart = ({ userManager, monthlyData,managerId,userId }) => {
  const [chartProps, setChartProps] = useState({
    series: [
      {
        name:userManager? "Check in" :"Sale",
        data: [],
        color: "#359b00",
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: userManager ? "Total Check in" : "Total Sale",
        align: "left",
      },
      grid: {
        row: {
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [],
      },
    },
  });
  useEffect(() => {
    const sortedData = monthlyData?.sort((a, b) => {
      const aDate = new Date(`${a.year}-${a.month_name}`);
      const bDate = new Date(`${b.year}-${b.month_name}`);
      return aDate - bDate;
    });
    const last12Data = sortedData?.slice(-12);
    const getAllMonth = last12Data?.map((data) =>
      data.month_name.substring(0, 3)
    );
    const checkInData = last12Data?.map((data) => data.total_checkin);
    const salesData = last12Data?.map((data) => data.total_sale);
    setChartProps((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        xaxis: {
          ...prev.options.xaxis,
          categories: getAllMonth,
        },
      },
      series: [
        {
          ...prev.series[0],
          data: userManager ? checkInData : salesData,
        },
      ],
    }));
  }, [managerId,userId]);
  return (
    <ReactApexChart
      options={chartProps.options}
      series={chartProps.series}
      type="line"
      height={350}
    />
  );
};

export default ReservationChart;
