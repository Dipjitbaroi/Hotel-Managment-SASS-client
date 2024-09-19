import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { MdOutlineCurrencyRupee } from "react-icons/md";

const generateRandomData = () => {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 1);
};

const HotelDashboardChart = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const options = {
    series: [
      { name: 'Expense', data: generateRandomData() },
      { name: 'Revenue', data: generateRandomData() },
      { name: 'Profit', data: generateRandomData() },
    ],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: months,
    },
    yaxis: {
      title: {
        text: 'Financial Overview',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹" + val + ' thousands';
        },
      },
    },
  };

  return <ReactApexChart options={options} series={options.series} type="bar" height={350} />;
};

export default HotelDashboardChart;
