import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const OwnerExpenseAndSalesChart = ({ userHotel, monthlyData }) => {
  const [chartProps, setChartProps] = useState({
    series: [
      {
        name: "Expense",
        type: "column",
        data: [],
        color: "#fe9302",
      },
      {
        name:"Sales",
        type: "line",
        data: [],
        color: "#5c44ab",
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        stacked: true,
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        width: [0, 5],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "70%",
        },
      },
      fill: {
        opacity: [1, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [],
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Total Expense & Sales"
        },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + (userHotel ? " bookings" : " renew");
            }
            return y;
          },
        },
      },
    },
  });

  useEffect(() => {
    const sortedData = monthlyData.sort((a, b) => {
      const aDate = new Date(`${a.year}-${a.month_name}`);
      const bDate = new Date(`${b.year}-${b.month_name}`);
      return aDate - bDate;
    });
    const last12Data = sortedData.slice(-12);
    const convertedDate = [
      ...new Set(
        last12Data.map((data) => {
          const formattedDate = new Date(
            `${data.year}-${data.month_name}-01`
          ).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });
          return formattedDate;
        })
      ),
    ];
    // Extracting data for "Checkin Confirmed" and "Booking"
    const checkinData = last12Data.map((data) => data.total_checkin);
    const bookingData = last12Data.map((data) => data.total_booking);
    const expiredData = last12Data.map((data) => data.total_expired);
    const renewData = last12Data.map((data) => data.total_renew);
    // Update state
    setChartProps((prevProps) => ({
      ...prevProps,
      series: [
        {
          ...prevProps.series[0],
          data: userHotel ? checkinData : expiredData,
        },
        {
          ...prevProps.series[1],
          data: userHotel ? bookingData : renewData,
        },
      ],
      options: {
        ...prevProps.options,
        labels: convertedDate,
      },
    }));
  }, [monthlyData]);

  return (
    <ReactApexChart
      options={chartProps.options}
      series={chartProps.series}
      type="line"
      height={350}
    />
  );
};

export default OwnerExpenseAndSalesChart;
