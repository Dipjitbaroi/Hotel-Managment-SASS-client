import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useFormik } from "formik";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaArrowLeft, FaFileDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { useGetTransactionlogsQuery } from "../../redux/admin/ownerlist/ownerListAPI.js";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rings } from "react-loader-spinner";
import { GrPowerReset } from "react-icons/gr";
import {
  getConvertedIsoEndDate,
  getConvertedIsoStartDate,
  getOnlyFormatDate,
} from "../../utils/utils.js";
import { convertedEndDate, convertedStartDate } from "../../utils/timeZone.js";

const LicenseHistory = () => {
  const [historyPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { user } = useSelector((store) => store.authSlice);

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
    onSubmit: (values) => {
      setSearchParams((p) => ({
        ...p,
        toDate: values.endDate ? convertedEndDate(values.endDate) : "",
        // p ? convertedEndDate(values.endDate) : "",
        fromDate: values.startDate ? convertedStartDate(values.startDate) : "",
        // p ? convertedStartDate(values.startDate) : "",
        search: values.search,
      }));
    },
    onReset: (values) => {
      setSearchParams({ ...searchParams, fromDate: "", toDate: "" });
    },
  });

  const [searchParams, setSearchParams] = useState({
    id: user._id,
    fromDate: "",
    toDate: "",
    cp: currentPage,
  });
  const { data, error, isLoading, isSuccess } =
    useGetTransactionlogsQuery(searchParams);
  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (data) setPageCount(data.totalPages);
  }, [data]);

  useEffect(() => {
    if (data) {
      const total = data.docs.reduce(
        (total, current) => total + current.amount,
        0
      );

      setTotalAmount(total);
    }
  }, [data]);

  return (
    <>
      <div className="card w-full bg-white shadow-xl">
        <div className="p-3">
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
        <div className="card-body space-y-10 min-h-screen">
          <h1 className="text-center text-2xl bg-green-slimy w-52 mx-auto text-white p-1 rounded-md">
            License History
          </h1>
          <div
            className={`flex justify-between flex-wrap gap-1.5 flex-col md:flex-row `}
          >
            <div className={`flex flex-col md:flex-row gap-4`}>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                name="startDate"
                placeholderText={`From`}
                selected={formik.values.startDate}
                className={`input input-sm input-bordered rounded focus:outline-none`}
                onChange={(date) => {
                  return formik.setFieldValue("startDate", date);
                }}
                onBlur={formik.handleBlur}
              />
              <DatePicker
                dateFormat="dd/MM/yyyy"
                name="endDate"
                placeholderText={`To`}
                selected={formik.values.endDate}
                className={`input input-sm input-bordered rounded focus:outline-none`}
                onChange={(date) => {
                  return formik.setFieldValue("endDate", date);
                }}
                onBlur={formik.handleBlur}
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
          </div>
          {!isLoading ? (
            data?.docs?.length ? (
              <div className="overflow-x-auto !mt-5">
                <table className="table border">
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Date</th>
                      <th>Transaction Id</th>
                      <th>Payment Method</th>
                      <th>License Duration</th>
                      <th>Payment For</th>
                      <th>Amount</th>

                      {/*<th>Action</th>*/}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.docs.map((item, idx) => {
                      return (
                        <tr
                          className={
                            idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                          }
                        >
                          <th>{++idx}</th>
                          <td>
                            {" "}
                            {getOnlyFormatDate(item?.createdAt)}
                            {/* {new Date(item?.createdAt).toLocaleDateString()} */}
                          </td>
                          <td>{item.tran_id}</td>
                          <td>{item?.payment_method}</td>
                          <td>
                          {  Math.ceil( Math.abs( (new Date(item?.bill_to) - new
                            Date(item?.bill_from)) / (24 * 60 * 60 * 1000) ) )}
                            {/* {Math.ceil(
                              Math.abs(
                                new Date(item?.bill_from) -
                                  new Date(item?.bill_to)
                              )
                            ) /
                              (24 * 60 * 60 * 1000)} */}
                          </td>
                          <td>{item?.payment_for}</td>
                          <td>{item?.amount}</td>

                          {/*<td className={`space-x-1.5`}>*/}
                          {/*  <span*/}
                          {/*    className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ms-2`}*/}
                          {/*    onClick={() =>*/}
                          {/*      navigate(`/dashboard/adminowner-view/${idx}`)*/}
                          {/*    }*/}
                          {/*  >*/}
                          {/*    <FaEye />*/}
                          {/*  </span>*/}
                          {/*</td>*/}
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className={`text-sm`}>
                    <tr>
                      <td colSpan={5}></td>
                      <td>Total</td>
                      <td>{totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
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
                    pageCount={data?.totalPages}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={2}
                    onPageChange={handlePageClick}
                    renderOnZeroPageCount={null}
                  />
                </div>
              </div>
            ) : (
              <h3 className={`mt-10 text-center`}>No data found!</h3>
            )
          ) : (
            <Rings
              width="50"
              height="50"
              color="#37a000"
              wrapperClass="justify-center"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LicenseHistory;
