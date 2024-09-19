import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { useFormik } from "formik";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import CreateReport from "../../components/pdf/CreateReport.jsx";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";

const SubAdminReport = () => {
  const navigate = useNavigate();
  const [roomsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const formik = useFormik({
    initialValues: {
      entries: "",
      search: "",
      startDate: "",
      endDate: "",
    },
  });

  const exportExcel = async (data, name) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, `${name}.xlsx`);
  };

  return (
    <div className={`mt-20 space-y-5`}>
      <div className={`bg-white px-10 py-5 rounded`}>
        <h3 className={`text-xl font-semibold`}>Search Report</h3>
        <hr className={`my-5`} />
        <div className={`flex gap-3`}>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            name="startDate"
            placeholderText={`From`}
            selected={formik.values.startDate}
            className={`input input-sm input-bordered rounded focus:outline-none`}
            onChange={(date) => formik.setFieldValue("startDate", date)}
            onBlur={formik.handleBlur}
          />
          <DatePicker
            dateFormat="dd/MM/yyyy"
            name="endDate"
            placeholderText={`To`}
            selected={formik.values.endDate}
            className={`input input-sm input-bordered rounded focus:outline-none`}
            onChange={(date) => formik.setFieldValue("endDate", date)}
            onBlur={formik.handleBlur}
          />
          <button
            type={"button"}
            className="btn btn-sm min-w-[5rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
          >
            Search
          </button>
        </div>
      </div>
      <div className={`bg-white px-10 py-5 rounded`}>
        <h3 className={`text-xl font-semibold`}>All Report</h3>
        <hr className={`my-5`} />
        <div className={`space-y-10`}>
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
            <div className={`flex gap-1.5`}>
              <button
                type={"button"}
                className="btn btn-sm min-w-[5rem] bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case"
                onClick={() =>
                  exportExcel([{ name: "test", age: 12 }], "testexcel")
                }
              >
                CSV
              </button>
              <button
                type={"button"}
                className="btn btn-sm min-w-[5rem] bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
              >
                <PDFDownloadLink
                  document={<CreateReport />}
                  fileName={`${new Date().toLocaleDateString()}.pdf`}
                >
                  PDF
                </PDFDownloadLink>
              </button>
            </div>
            <div className={`flex items-center space-x-1.5`}>
              <span>Search: </span>
              <input
                type="text"
                placeholder="Search"
                name="search"
                className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
                value={formik.values.search}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Booking Number</th>
                  <th>Room Number</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Paid Amount</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {[...Array(+formik.values.entries || 10)].map((_, idx) => {
                  return (
                    <tr
                      className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                    >
                      <th>{++idx}</th>
                      <td>1542565</td>
                      <td>104</td>
                      <td>
                        2023-10-21 <br /> 10:00:00
                      </td>
                      <td>
                        2023-10-21 <br /> 10:00:00
                      </td>
                      <td>25000</td>
                      {/* <td className={`space-x-1.5`}>
                        <span
                          className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                          onClick={() =>
                            navigate(`/dashboard/sub-admin-list-view/${idx}`)
                          }
                        >
                          <FaEye />
                        </span>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className={`text-sm`}>
                <tr>
                  <td colSpan={5} className={`text-end`}>
                    Total
                  </td>
                  <td>250000</td>
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
                pageCount={pageCount}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminReport;
