import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { isValidUrl } from "../../utils/utils";
import { useLocation } from "react-router-dom";

const generateRandomData = () => {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 1);
};
const RestaurantDashboardChart = ({ monthlyData }) => {
  const location = useLocation();
  const { pathname } = location;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [options, setOptions] = useState({
    series: [
      { name: "Expense", data: generateRandomData() },
      { name: "sales", data: generateRandomData() },
      { name: "Profit", data: generateRandomData() },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: months,
    },
    yaxis: {
      title: {
        text: "Financial Overview",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹" + val;
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

    const allMonth = last12Data.map((data) => data.month_name.substring(0, 3));
    const hotelIncome = last12Data.map((data) => data.total_hotel_income);
    const hotelExpense = last12Data.map((data) => data.total_hotel_expenses);
    const restaurantIncome = last12Data.map(
      (data) => data.total_restaurant_income
    );
    const restaurantExpense = last12Data.map(
      (data) => data.total_restaurant_expenses
    );
    const restaurantProfit = last12Data.map(
      (data) => data.total_restaurant_profit
    );
    const hotelProfit = last12Data.map((data) => data.total_hotel_profit);
    const total_income = last12Data.map((data) => data.total_income);
    const total_expense = last12Data.map((data) => data.total_expense);
    const total_profit = last12Data.map((data) => data.total_profit);

    // Update state
    setOptions((prevProps) => ({
      ...prevProps,
      series: [
        {
          ...prevProps.series[0],
          data:
            !isValidUrl("dashboard/hotel", pathname) &&
            !isValidUrl("dashboard/restaurant", pathname) &&
            isValidUrl("dashboard", pathname)
              ? total_expense
              : isValidUrl("dashboard/hotel", pathname)
              ? hotelExpense
              : restaurantExpense,
        },
        {
          ...prevProps.series[1],
          data:
            !isValidUrl("dashboard/hotel", pathname) &&
            !isValidUrl("dashboard/restaurant", pathname) &&
            isValidUrl("dashboard", pathname)
              ? total_income
              : isValidUrl("dashboard/hotel", pathname)
              ? hotelIncome
              : restaurantIncome,
        },
        {
          ...prevProps.series[2],
          data:
            !isValidUrl("dashboard/hotel", pathname) &&
            !isValidUrl("dashboard/restaurant", pathname) &&
            isValidUrl("dashboard", pathname)
              ? total_profit
              : isValidUrl("dashboard/hotel", pathname)
              ? hotelProfit
              : restaurantProfit,
        },
      ],
      xaxis: {
        categories: allMonth,
      },
    }));
  }, [monthlyData, pathname]);
  return (
    <ReactApexChart
      options={options}
      series={options.series}
      type="bar"
      height={350}
    />
  );
};

export default RestaurantDashboardChart;
