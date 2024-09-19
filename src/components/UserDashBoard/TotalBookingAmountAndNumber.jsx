import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const TotalBookingAmountAndNumber = () => {
    const [chartProps, setChartProps] = useState(
        {
            series: [
                {
                    name: 'Net Profit',
                    data: [0, 20]
                },
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                },
                colors: '#9bcf7f',
                title: {
                    text: 'Total Booking Amount vs Total Number of Booking',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: ['January-23', 'February-23', 'March-23', 'April-23', 'May-23', 'Jun-23', 'July-23', 'August-23', 'September-23', 'October-23'],
                    labels: {
                        rotate: -45
                    },
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "Total Amount: " + val
                        }
                    }
                }
            },
        }
    )
    return (
        <ReactApexChart options={chartProps.options} series={chartProps.series} type="bar" height={350} />
    );
};

export default TotalBookingAmountAndNumber;