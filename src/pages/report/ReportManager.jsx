import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useFormik } from "formik";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { GrPowerReset } from "react-icons/gr";
import DatePicker from "react-datepicker";
import { useGetManagerReportQuery } from "../../redux/report/reportAPI.js";
import { Rings } from "react-loader-spinner";
import { getformatDateTime } from "../../utils/utils.js";
import ManagerReport from "./ManagerReport.jsx";
import { useReactToPrint } from "react-to-print";
import { useGetHotelByManagerIdQuery } from "../../redux/room/roomAPI.js";
import ReportPrint from "./ReportPrint.jsx";
import { useSelector } from "react-redux";
import {
  convertedEndDate,
  convertedStartDate,
  getIndianFormattedDate,
} from "../../utils/timeZone.js";
const desiredHeaders = [
  "Serial No",
  "guestName",
  "room_numbers",
  "checked_in",
  "checked_out",
  "paid_amount",
  "balance_deducted",
  "balance_refunded",
];
const tableHeaders = [
  "Serial No",
  "Guest Name",
  "Room Numbers",
  "Checked In",
  "Checked Out",
  "Paid Amount",
  "Deducted From Balance",
  "Refund Amount",
];
const ReportManager = () => {
  const componentRef = useRef();
  const [forcePage, setForcePage] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [PDF, setPDF] = useState([]);
  const [keyword, setKeyword] = useState(null);
  const [searchParams, setSearchParams] = useState({
    fromDate: "",
    toDate: "",
    search: "",
  });
  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };
  const { user } = useSelector((state) => state.authSlice);

  const {
    data: hotelInfo,
    isLoading: isHotelLoading,
    isSuccess: isHotelSuccess,
  } = useGetHotelByManagerIdQuery(user?._id);
  const formik = useFormik({
    initialValues: {
      entries: "",
      search: "",
      filter: "",
      startDate: "",
      endDate: "",
    },
    onSubmit: (values) => {
      setKeyword(values.search);
      if (values.search) {
        setCurrentPage(0);
      }
      setSearchParams((p) => ({
        ...p,
        toDate: p && values.endDate ? convertedEndDate(values.endDate) : "",
        fromDate:
          p && values.startDate ? convertedStartDate(values.startDate) : "",
        search: values.search,
      }));
    },
    onReset: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setSearchParams(null);
    },
  });
  const { isLoading, data: reports } = useGetManagerReportQuery({
    ...searchParams,
    cp: currentPage,
    filter: formik.values.filter,
    limit: formik.values.entries,
    search: keyword,
  });

  const exportExcel = async (data, name) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, `${name}.xlsx`);
  };

  useEffect(() => {
    if (reports) setPageCount(reports?.data?.totalPages);
  }, [reports]);

  useEffect(() => {
    if (reports) {
      const total = reports?.data?.docs?.reduce(
        (total, current) => total + current.paid_amount,
        0
      );
      setPDF(reports?.data?.docs);
    }
  }, [reports]);

  // press enter button
  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };

  return (
    <div className={` space-y-5`}>
      <div className={`bg-white p-5 py-5 rounded `}>
        <div className="mb-7">
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
        <div>
          <h3
            className={`bg-green-slimy text-2xl text-white max-w-[12rem]  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}
          >
            All Report
          </h3>
        </div>
        <div
          className={`flex flex-wrap gap-1.5 justify-end flex-col md:flex-row `}
        >
          <div className="flex gap-1.5">
            <div className={`flex gap-1.5`}>
              <button
                type={"button"}
                className="btn btn-sm min-w-[5rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
                onClick={() => exportExcel(reports?.data?.docs, "testexcel")}
              >
                CSV
              </button>
              {PDF.length ? (
                <PDFDownloadLink
                  document={
                    <ManagerReport
                      desiredHeaders={desiredHeaders}
                      tableHeaders={tableHeaders}
                      values={PDF}
                      header={{
                        title: `${hotelInfo ? hotelInfo[0]?.name : ""}`,
                        subTitle: `${
                          hotelInfo ? hotelInfo[0]?.branch_name : ""
                        }`,
                        name: "All Report",
                      }}
                    />
                  }
                  fileName={`${new Date().toLocaleDateString()}.pdf`}
                  className="btn btn-sm min-w-[5rem] bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                >
                  PDF
                </PDFDownloadLink>
              ) : null}
            </div>
          </div>
        </div>
        <hr className={`my-5`} />
        <div className={`flex flex-col gap-5`}>
          <div className={`flex justify-between`}>
            <div className={`space-x-1.5`}>
              <span>Show</span>
              <select
                name="entries"
                className="select select-sm select-bordered border-green-slimy rounded focus:outline-none"
                value={formik.values.entries}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>
          <div className={`flex flex-col md:flex-row gap-4`}>
            <DatePicker
              autoComplete={`off`}
              dateFormat="dd/MM/yyyy"
              name="startDate"
              placeholderText={`From`}
              selected={formik.values.startDate}
              className={`input input-sm input-bordered rounded focus:outline-none`}
              onChange={(date) => formik.setFieldValue("startDate", date)}
              onBlur={formik.handleBlur}
              onKeyUp={(e) => {
                e.target.value === "" ? formik.handleSubmit() : null;
              }}
              onKeyDown={(e) => pressEnter(e)}
            />
            <DatePicker
              autoComplete={`off`}
              dateFormat="dd/MM/yyyy"
              name="endDate"
              placeholderText={`To`}
              selected={formik.values.endDate}
              className={`input input-sm input-bordered rounded focus:outline-none`}
              onChange={(date) => formik.setFieldValue("endDate", date)}
              onBlur={formik.handleBlur}
              onKeyUp={(e) => {
                e.target.value === "" ? formik.handleSubmit() : null;
              }}
              onKeyDown={(e) => pressEnter(e)}
            />
            <button
              type={"button"}
              onClick={() => {
                formik.resetForm();
                formik.handleSubmit();
              }}
              className="btn btn-sm min-w-[2rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
            >
              <GrPowerReset className="text-green-slimy" />
            </button>
            <button
              type={"button"}
              onClick={formik.handleSubmit}
              disabled={
                formik.values.startDate === "" || formik.values.endDate === ""
                  ? true
                  : false
              }
              className="btn btn-sm min-w-[5rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
            >
              Apply Filter
            </button>
          </div>
          <div className={`relative max-w-xs`}>
            <input
              type="text"
              placeholder="Search by Guest Name..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
              value={formik.values.search}
              onChange={formik.handleChange}
              onKeyUp={(e) => {
                e.target.value === "" && setForcePage(0);
                e.target.value === "" && setCurrentPage(0);
                e.target.value === "" ? formik.handleSubmit() : null;
              }}
              onKeyDown={(e) => pressEnter(e)}
            />
            <button
              onClick={formik.handleSubmit}
              type="button"
              className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
            >
              <FaSearch />
            </button>
          </div>
        </div>
        {!isLoading ? (
          <div className="overflow-x-auto mt-10">
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  {/* <th>Booking Number</th> */}
                  <th>Guest Name</th>
                  <th>Room Numbers</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th className="text-end">Paid Amount</th>
                  {/* balance_deducted */}
                  <th className="text-end">Deducted From Balance</th>
                  <th className="text-end">Refund Amount</th>
                  <th className="">Action</th>
                  {/*<th>Deposit By</th>*/}
                </tr>
              </thead>
              <tbody>
                {reports?.data?.docs?.map((report, idx) => {
                  return (
                    <tr
                      className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                    >
                      <th>{++idx}</th>
                      <td>{report.guestName}</td>
                      <td>{report?.room_numbers.join(",")}</td>
                      <td>{getformatDateTime(report?.checked_in)}</td>

                      <td>{getIndianFormattedDate(report?.checked_out)}</td>
                      <td className="text-end">{report?.paid_amount}</td>
                      <td className="text-end">{report?.balance_deducted}</td>
                      <td className="text-end">{report?.balance_refunded}</td>
                      <td className={`space-x-1.5`}>
                        <ReportPrint
                          hotelInfo={hotelInfo && hotelInfo[0]}
                          booking_id={report?.booking_ids[0]}
                          roomNumber={report?.room_numbers}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className={`text-sm`}>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-end">
                    Total : {reports?.data?.total_paid_amount}
                  </td>
                  <td className="text-end">
                    Total : {reports?.data?.total_balance_deducted}
                  </td>
                  <td className="text-end">
                    Total : {reports?.data?.total_balance_refunded}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <Rings
            width="50"
            height="50"
            color="#37a000"
            wrapperClass="justify-center"
          />
        )}
        <div className="flex justify-center mt-10">
          <ReactPaginate
            containerClassName="join rounded-none"
            pageLinkClassName="join-item btn btn-md bg-transparent"
            activeLinkClassName="btn-active !bg-green-slimy text-white"
            disabledLinkClassName="btn-disabled"
            previousLinkClassName="join-item btn btn-md bg-transparent"
            nextLinkClassName="join-item btn btn-md bg-transparent"
            breakLinkClassName="join-item btn btn-md bg-transparent"
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            pageCount={pageCount}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            onPageChange={handlePageClick}
            renderOnZeroPageCount={null}
            forcePage={forcePage}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportManager;
