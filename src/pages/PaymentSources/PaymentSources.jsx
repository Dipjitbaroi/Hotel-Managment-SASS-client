import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Link, useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { GrPowerReset } from "react-icons/gr";
import DatePicker from "react-datepicker";
import { useGetPaymentSourcesQuery } from "../../redux/report/reportAPI.js";
import { Rings } from "react-loader-spinner";
import { getformatDateTime, isValidUrl } from "../../utils/utils.js";
import { useGetHotelByManagerIdQuery } from "../../redux/room/roomAPI.js";
import { useSelector } from "react-redux";
import { convertedEndDate, convertedStartDate } from "../../utils/timeZone.js";
import ManagerReport from "../report/ManagerReport.jsx";
const desiredHeaders = [
  "Serial No",
  "createdAt",
  "payment_method",
  "tran_id",
  "amount",
  "payment_for",
];
const tableHeaders = [
  "Serial No",
  "Date",
  "Payment method",
  "Transaction Id",
  "Amount",
  "Remark",
];
const PaymentSources = ({ managerId }) => {
  let location = useLocation();
  const [selectedBtn, setSelectedBtn] = useState("today");
  const [isLoading, setIsLoading] = useState(false);
  const [forcePage, setForcePage] = useState();
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [PDF, setPDF] = useState([]);
  const [searchParams, setSearchParams] = useState({
    fromDate: convertedStartDate(new Date()),
    toDate: convertedEndDate(new Date()),
  });
  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
    setForcePage(page);
  };
  const { user } = useSelector((state) => state.authSlice);

  const { data: hotelInfo } = useGetHotelByManagerIdQuery(
    isValidUrl("owner/payment-sources", location.pathname)
      ? managerId
      : user?._id
  );
  const formik = useFormik({
    initialValues: {
      entries: "",
      startDate: "",
      endDate: "",
      payment_method: "",
    },
    onSubmit: (values) => {
      setSelectedBtn("filter");
      setCurrentPage(0);
      setForcePage(0);
      setSearchParams((p) => ({
        ...p,
        toDate: p && values.endDate ? convertedEndDate(values.endDate) : "",
        fromDate:
          p && values.startDate ? convertedStartDate(values.startDate) : "",
      }));
    },
    onReset: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setSearchParams(null);
    },
  });

  const {
    isLoading: paymentSourceLoading,
    isFetching,
    data: paymentData,
  } = useGetPaymentSourcesQuery({
    cp: currentPage,
    toDate: searchParams.toDate,
    fromDate: searchParams.fromDate,
    limit: formik.values.entries,
    user_id: isValidUrl("owner/payment-sources", location.pathname)
      ? managerId
      : user?._id,
    dedicated_to: "hotel",
    payment_method: formik.values.payment_method,
  });
  const handleResetForm = () => {
    setCurrentPage(0);
    setForcePage(0);
    formik.resetForm();
    handleTodayClick();
  };
  const handleTodayClick = () => {
    setForcePage(0);
    setSelectedBtn("today");
    const date = new Date();
    setCurrentPage(0);

    setSearchParams((p) => ({
      ...p,
      fromDate: convertedStartDate(date),
      toDate: convertedEndDate(date),
    }));
    formik.setFieldValue("startDate", "");
    formik.setFieldValue("endDate", "");
  };
  const handleLastWeekClick = () => {
    setSelectedBtn("lastWeek");
    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    setForcePage(0);
    setCurrentPage(0);
    setSearchParams((p) => ({
      ...p,
      fromDate: convertedStartDate(lastWeek),
      toDate: convertedEndDate(today),
    }));
    formik.setFieldValue("startDate", "");
    formik.setFieldValue("endDate", "");
  };
  const handleLastMonthClick = () => {
    setSelectedBtn("lastMonth");
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    setCurrentPage(0);
    setForcePage(0);
    setSearchParams((p) => ({
      ...p,
      fromDate: convertedStartDate(lastMonth),
      toDate: convertedEndDate(today),
    }));
    formik.setFieldValue("startDate", "");
    formik.setFieldValue("endDate", "");
  };
  // press enter button
  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };
  useEffect(() => {
    if (paymentData) setPageCount(paymentData?.data?.totalPages);
  }, [paymentData]);

  useEffect(() => {
    if (paymentData) {
      setPDF(paymentData?.data?.docs);
    }
  }, [paymentData]);

  useEffect(() => {
    !paymentSourceLoading && setIsLoading(isFetching);
  }, [isFetching]);
  useEffect(() => {
    setIsLoading(paymentSourceLoading);
  }, [paymentSourceLoading]);
  return (
    <div className={` space-y-5`}>
      <div className={`bg-white p-5 py-5 rounded `}>
        {isValidUrl("owner/payment-sources", location.pathname) ? (
          <></>
        ) : (
          <>
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
                className={`bg-green-slimy text-2xl text-white max-w-[15rem]  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}
              >
                Payment Sources
              </h3>
            </div>
          </>
        )}
        <div
          className={`flex flex-wrap gap-1.5 justify-end flex-col md:flex-row `}
        >
          <div className="flex gap-1.5">
            <div className={`flex gap-1.5`}>
              {PDF.length ? (
                <PDFDownloadLink
                  document={
                    <ManagerReport
                      tableHeaders={tableHeaders}
                      desiredHeaders={desiredHeaders}
                      values={PDF}
                      header={{
                        title: `${hotelInfo ? hotelInfo[0]?.name : ""}`,
                        subTitle: `${
                          hotelInfo ? hotelInfo[0]?.branch_name : ""
                        }`,
                        name: "Payment sources",
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
        {isValidUrl("owner/payment-sources", location.pathname) ? (
          ""
        ) : (
          <hr className={`my-5`} />
        )}
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
              onClick={formik.handleSubmit}
              disabled={
                formik.values.startDate === "" || formik.values.endDate === ""
                  ? true
                  : false
              }
              className={`btn btn-sm min-w-[5rem] hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ${
                selectedBtn === "filter"
                  ? "bg-green-slimy text-white"
                  : "bg-transparent"
              }`}
            >
              Apply Filter
            </button>
            <button
              onClick={handleTodayClick}
              type={"button"}
              className={`btn btn-sm min-w-[5rem]  hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ${
                selectedBtn === "today"
                  ? "bg-green-slimy text-white"
                  : "bg-transparent"
              }`}
            >
              Today
            </button>
            <button
              onClick={handleLastWeekClick}
              type={"button"}
              className={`btn btn-sm min-w-[5rem] hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ${
                selectedBtn === "lastWeek"
                  ? "bg-green-slimy text-white"
                  : "bg-transparent"
              }`}
            >
              Last week
            </button>
            <button
              onClick={handleLastMonthClick}
              type={"button"}
              className={`btn btn-sm min-w-[5rem]  hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ${
                selectedBtn === "lastMonth"
                  ? "bg-green-slimy text-white"
                  : "bg-transparent"
              }`}
            >
              Last month
            </button>
            <select
              name="payment_method"
              className="select select-sm select-bordered border-green-slimy rounded focus:outline-none"
              value={formik.values.payment_method}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value={""}>All</option>
              <option value={"Cash"}>Cash</option>
              <option value={"Card"}>Card</option>
              <option value={"Mobile_Banking"}>Mobile Banking</option>
              <option value={"Oyo"}>Oyo</option>
              <option value={"Fab"}>Fab</option>
            </select>
            <button
              type={"button"}
              onClick={handleResetForm}
              className="btn btn-sm min-w-[2rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
            >
              <GrPowerReset className="text-green-slimy" />
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
                  <th>Date</th>
                  <th>Payment method</th>
                  <th>Transaction Id</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Remark</th>

                  {/*<th>Deposit By</th>*/}
                </tr>
              </thead>
              <tbody>
                {paymentData?.data?.docs?.map((report, idx) => {
                  return (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                    >
                      <th>{++idx}</th>
                      <td>{getformatDateTime(report?.createdAt)}</td>

                      <td>{report?.payment_method}</td>
                      <td>{report?.tran_id ? report?.tran_id : "--"}</td>
                      <td className="text-end">
                        {report?.payment_for === "BookingCanceled" ||
                        report?.payment_for === "CashBack" ? (
                          <span className="text-red-600">
                            -{report?.amount}
                          </span>
                        ) : (
                          report?.amount
                        )}
                      </td>
                      <td className="text-end">
                        {report?.payment_for === "BookingCanceled" ||
                        report?.payment_for === "CashBack" ? (
                          <span className="text-red-600">
                            {report?.payment_for}
                          </span>
                        ) : (
                          report?.payment_for || "--"
                        )}
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
                  <td className="text-end flex flex-col min-w-[200px] md:min-w-full">
                    <span className="grid grid-cols-2">
                      <span>Total income :</span>
                      <span>{paymentData?.data?.total_income}</span>
                    </span>

                    <span className="grid grid-cols-2">
                      <span>Total disbursement :</span>
                      <span className="text-red-600">
                        {paymentData?.data?.total_disbursement}
                      </span>
                    </span>
                    <span className="grid grid-cols-2">
                      <span> Total amount : </span>
                      <span> {paymentData?.data?.total_amount}</span>
                    </span>
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
            pageRangeDisplayed={3}
            marginPagesDisplayed={3}
            onPageChange={handlePageClick}
            renderOnZeroPageCount={null}
            forcePage={forcePage}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSources;
