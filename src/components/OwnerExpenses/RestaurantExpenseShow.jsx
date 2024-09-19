import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEye,
  FaRegEdit,
  FaRegFilePdf,
  FaRupeeSign,
} from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { AiTwotoneDelete } from "react-icons/ai";
import { useFormik } from "formik";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";

import {
  useGetExpensesQuery,
  useGetHotelByManagerIdQuery,
} from "../../redux/room/roomAPI";
import { useSelector } from "react-redux";
import {
  fromDateIsoConverter,
  getConvertedIsoEndDate,
  getConvertedIsoStartDate,
  getISOStringDate,
  getOnlyFormatDate,
  getTodayFormateDate,
  getformatDateTime,
} from "../../utils/utils";
import EditExpenses from "../../components/inventory/EditExpenses";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { BsFileEarmarkPdfFill } from "react-icons/bs";
import ExpensesHistoryReport from "../../pages/report/ExpensesHistoryReport";
import RestaurantExpenseReport from "../../pages/report/RestaurantExpenseReport";

import { convertedEndDate, convertedStartDate } from "../../utils/timeZone";

const RestaurantExpenseShow = ({
  hotelId,
  managerID,
  hotelName,
  branchName,
}) => {
  const [forcePage, setForcePage] = useState(null);
  const [PDF, setPdf] = useState([]);
  const navigate = useNavigate();
  const [hotelsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [editItemData, setEditItemData] = useState(null);
  const { isUserLoading, user } = useSelector((store) => store.authSlice);


  const [searchParams, setSearchParams] = useState({
    fromDate: "",
    toDate: "",
  });

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
    onSubmit: (values) => {
      setSearchParams((p) => ({
        ...p,
        toDate: p ? convertedEndDate(values.endDate) : "",
        fromDate: p ? convertedStartDate(values.startDate) : "",
      }));
      setCurrentPage(0);
      setForcePage(0);
    },
    onReset: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setSearchParams("");
    },
  });

  const {
    data: filteredExpenses,
    isLoading: isFilterDataLoading,
    isSuccess: filterExSuccess,
  } = useGetExpensesQuery({
    ...searchParams,
    cp: currentPage,
    fromDate: searchParams?.fromDate,
    toDate: searchParams?.toDate,
    hotel_id: hotelId,
    spendedfor: "restaurant",
    limit: formik.values.entries,
  });

  const {
    data: RestaurantExpenses,
    isLoading,
    isSuccess,
  } = useGetExpensesQuery({
    fromDate: convertedStartDate(),
    toDate: convertedEndDate(),
    hotel_id: hotelId,
    spendedfor: "restaurant",
  });
  useEffect(() => {
    if (filteredExpenses) setPageCount(filteredExpenses?.totalPages);
  }, [filteredExpenses]);

  useEffect(() => {
    setPdf(RestaurantExpenses?.docs[0]?.items);
  }, [RestaurantExpenses]);

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.search === 13) {
      formik.handleSubmit();
    }
  };

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const isTodayItems = RestaurantExpenses?.docs?.filter((item) => {
    const itemDate = item.date;

    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");

    // Check if the item's date is the same as the current date
    return itemDate === formattedCurrentDate;
  });

  // pagination setup for today's expenses
  const itemsPerPage = 10;
  const [currentPageItem, setCurrentPageItem] = useState(0);

  const handlePageChange = ({ selected }) => {
    setCurrentPageItem(selected);
  };
  const totalPage =
    RestaurantExpenses &&
    Math.ceil(RestaurantExpenses?.docs[0]?.items.length / itemsPerPage);

  const indexOfLastItem = (currentPageItem + 1) * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = RestaurantExpenses?.docs[0]?.items.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalItemPrice =
    isTodayItems &&
    currentItems?.reduce((total, item) => {
      // Add the price of each item to the total
      return total + (item?.price || 0);
    }, 0);
  const handleScrollToTop = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalExpenses = RestaurantExpenses?.docs[0]?.total_amount;




  // const [searchParam] = useSearchParams();
  // const hotelId = searchParam.get("hotelId");
  // const managerID = searchParam.get("managerID");

  // const { data: hotelInfo } = useGetHotelByManagerIdQuery(
  //   user.role === "manager" ? user?._id : user.role === "owner" ? managerID : ""
  // );


  return (
    <div className={` space-y-5`}>
      <div className={`bg-white  p-4 rounded`}>
        <div>
          <div>
            <div>
              <h3
                className={` bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}
              >
                Today Expenses
              </h3>
            </div>

            <div className={`flex justify-end  mr-5 mb-5`}>
              {currentItems?.length ? (
                <PDFDownloadLink
                  document={
                    <RestaurantExpenseReport
                      date={RestaurantExpenses?.docs[0]?.date}
                      values={RestaurantExpenses?.docs[0]?.items}
                      header={{
                        // title: "DAK Hospitality LTD",
                        title: `${hotelName}`,
                        subTitle: `${branchName}`,
                        name: "Today's Restaurant Expenses",
                      }}
                    />
                  }
                  fileName={`${new Date().toLocaleDateString()}.pdf`}
                  className="btn btn-sm min-w-[5rem] bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                >
                  <BsFileEarmarkPdfFill />
                  PDF
                </PDFDownloadLink>
              ) : null}
            </div>

            <div>
              {/* 3rd commit  */}

              {/* {RestaurantExpenses&& RestaurantExpenses?.docs[0]?.items.length ? */}
              {currentItems?.length ? (
                <div className=" overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Items Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Remark</th>
                        {/* {RestaurantExpenses?.docs[0]?.items?.map(
                        (item, idx) => item?.remark && <th>Remark</th>
                      )} */}
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {RestaurantExpenses &&
                        currentItems?.map((item, idx) => {
                          return (
                            <tr
                              className={
                                idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                              }
                            >
                              <th>{++idx}</th>
                              <td>{item?.name}</td>
                              <td>{item?.description}</td>
                              <td>{item?.quantity}</td>
                              <td>
                                <FaRupeeSign className="inline" />
                                <span>{item?.price}</span>
                              </td>
                              <td>{item?.remark ? item?.remark : ""}</td>
                              {/* <td>
                            <button
                              className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case md:mb-2 mb-2 ms-2`}
                              onClick={() => {
                                setEditItemData(item);
                                document
                                  .getElementById("my_modal_3")
                                  .showModal();
                              }}
                            >
                              <FaRegEdit />
                            </button>
                            <dialog id="my_modal_3" className="modal">
                              <div className="modal-box">
                                <form method="dialog">
                                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                    ✕
                                  </button>
                                </form>
                                <EditExpenses data={editItemData} />
                              </div>
                            </dialog>
                          </td>  */}
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot className={`text-[1.2rem] font-bold`}>
                      <tr>
                        <td
                          colSpan={4}
                          className={`text-end text-md font-bold`}
                        >
                          Total :
                        </td>
                        <td>
                          <div className="flex">
                            <div>
                              <FaRupeeSign />
                            </div>
                            <div>{totalExpenses}</div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="text-center my-44">No expense</p>
              )}
            </div>
          </div>

          {/* pagination */}

          <div
            onClick={handleScrollToTop}
            className="flex justify-center mt-10"
          >
            {currentItems?.length && (
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
                pageCount={totalPage}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                renderOnZeroPageCount={null}
                forcePage={currentPage}
              />
            )}
          </div>
        </div>

        {/* Restaurant Expenses */}

        <div className={`mb-10 mt-20 mr-5`}>
          <div>
            <h3
              className={` bg-green-slimy text-2xl text-white max-w-3xl mx-auto py-3 px-4 rounded space-x-1.5 mb-7 text-center`}
            >
              Restaurant Expenses History
            </h3>
          </div>
          <div className="flex justify-end">
            {filteredExpenses?.docs?.length ? (
              <PDFDownloadLink
                document={
                  <ExpensesHistoryReport
                    date={RestaurantExpenses?.docs[0]?.date}
                    values={filteredExpenses?.docs}
                    header={{
                      // title: "DAK Hospitality LTD",  
                      title:`${hotelName}`,
                      subTitle: `${branchName}`,
                      name: "Restaurant Expenses History",
                    }}
                  />
                }
                fileName={`${new Date().toLocaleDateString()}.pdf`}
                className="btn btn-sm min-w-[5rem] bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
              >
                <BsFileEarmarkPdfFill />
                PDF
              </PDFDownloadLink>
            ) : null}
          </div>
        </div>
        <div className={`flex justify-between my-5`}>
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
        <div className={`flex flex-col md:flex-row gap-3 `}>
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
            // onClick={() => {
            //   setCurrentPage(0);
            //   setForcePage(0);
            //   formik.handleSubmit();
            // }}
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
        <hr className={`my-5 mb-4`} />
        <div className={`space-y-10`}>
          <div className="overflow-x-auto">
            {filteredExpenses && filteredExpenses?.docs?.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses?.docs.map((item, idx) => {
                    return (
                      <tr
                        className={
                          idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                        }
                      >
                        <th>{++idx}</th>
                        <td>
                          {getOnlyFormatDate(item?.date)}
                          {/* {new Date(item?.date).toLocaleDateString()} */}
                        </td>
                        <td>
                          <FaRupeeSign className="inline" />
                          <span>{item?.total_amount}</span>
                        </td>
                        <td className={`space-x-1.5`}>
                          <span
                            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ms-2`}
                            onClick={() =>
                              navigate(
                                `/dashboard/restaurant-expenses/${item?._id}?hotelId=${hotelId}&managerID=${managerID}`
                              )
                            }
                          >
                            <FaEye />
                          </span>
                          {/* <span
                            className={`btn btn-sm bg-red-500 hover:bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case`}
                          >
                            <AiTwotoneDelete />
                          </span> */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-center my-16">No Expenses yet !</p>
            )}
          </div>

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
    </div>
  );
};

export default RestaurantExpenseShow;
