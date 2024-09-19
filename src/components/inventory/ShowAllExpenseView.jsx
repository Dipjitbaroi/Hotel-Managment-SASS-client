import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaRegEdit,
  FaRegFilePdf,
  FaRupeeSign,
  FaTrash,
} from "react-icons/fa";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useFormik } from "formik";
import EditExpensesView from "./EditExpensesView";
import ReactPaginate from "react-paginate";
import {
  useGetExpenseByIdQuery,
  useGetHotelByManagerIdQuery,
} from "../../redux/room/roomAPI";
import FoodCheckoutPrint from "../../pages/restaurant/FoodCheckoutPrint";
import ReactToPrint from "react-to-print";
import ShowAllExpenseViewPrint from "./ShowAllExpenseViewPrint";
import { FaPrint } from "react-icons/fa6";
import AddBooking from "../room/AddBooking";
import Modal from "../Modal";
import RemoveExpenses from "./RemoveExpenses";
import { getOnlyFormatDate, isValidUrl } from "../../utils/utils";
import { useSelector } from "react-redux";

const ShowAllExpenseView = () => {
  const componentRef = useRef();

  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const { id } = useParams();

  const { data: itemExpense } = useGetExpenseByIdQuery(id);

  function calculateTotalPrice(items) {
    // Ensure items is not null or undefined
    if (!items) {
      return 0;
    }

    // Use the reduce function to sum up the prices
    const totalPrice = items.reduce((total, item) => {
      // Ensure each item has a price property
      if (item && item.price) {
        return total + item.price;
      }
      // If item or price is missing, return total without adding anything
      return total;
    }, 0);

    return totalPrice;
  }

  let totalItemsAmount = calculateTotalPrice(itemExpense?.items);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };
  const navigate = useNavigate();
  const handle = () => {};

  const [editItemData, setEditItemData] = useState(null);

  const [index, setIndex] = useState();

  const currentDate = new Date();
  const formattedCurrentDate = currentDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  // pagination setup for today's expenses
  const itemsPerPage = 10;
  const [currentPageItem, setCurrentPageItem] = useState(0);

  const handlePageChange = ({ selected }) => {
    setCurrentPageItem(selected);
  };
  const totalPage =
    itemExpense && Math.ceil(itemExpense?.items.length / itemsPerPage);

  const indexOfLastItem = (currentPageItem + 1) * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = itemExpense?.items.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleScrollToTop = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const location = useLocation();
  const { pathname } = location;

  const [searchParams] = useSearchParams();
  const managerID = searchParams.get("managerID");


  const { user } = useSelector((store) => store.authSlice);
  const { data: hotelInfo } = useGetHotelByManagerIdQuery(
    user.role === "manager" ? user?._id : user.role === "owner" ? managerID : ""
  );

 

  return (
    <div className={`bg-white p-10 rounded-2xl space-y-8`}>
      <div className={`flex justify-between `}>
        <div
          className={`inline-flex bg-green-slimy text-white border border-green-slimy items-center space-x-1.5 hover:bg-transparent hover:text-green-slimy cursor-pointer px-3 py-1 rounded transition-colors duration-500`}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back</span>
        </div>
        {/* Pdf */}
        <div className={`flex gap-4 justify-end mt-4`}>
          <div style={{ display: "none" }}>
            <div className="p-4" ref={componentRef}>
              <ShowAllExpenseViewPrint
                itemExpense={itemExpense}
                totalItemsAmount={totalItemsAmount}
                hotelName={hotelInfo ? hotelInfo[0]?.name : ""}
                hotelBranchName={hotelInfo? hotelInfo[0]?.branch_name : ""}
              
              />
            </div>
          </div>
        </div>
        <ReactToPrint
          trigger={() => (
            <button
              title="please select payment method"
              className="bg-green-slimy text-white px-2 rounded-sm"
            >
              <FaPrint className="inline" /> Print
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
      <div>
        {/* <h1 className="text-center text-2xl bg-green-slimy w-72 md:w-60 mx-auto text-white p-1 rounded-md">
          {" "}
          Expenses Information
        </h1> */}
        <h1 className="text-center text-2xl bg-green-slimy w-[17rem] mx-auto text-white p-1 rounded-md mt-7">
          Expenses Information
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Date</th>
              <th>Items Name</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Price</th>
              <th>Remark</th>
              {/* <th>Action</th> */}
              {isValidUrl("dashboard/show-all-expense", pathname) ||
              isValidUrl("dashboard/all-hotel-expense", pathname) ? (
                <th>Action</th>
              ) : (
                ""
              )}
            </tr>
          </thead>
          <tbody>
            {itemExpense?.items &&
              currentItems.map((item, idx) => {
                return (
                  <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
                    <th>{idx + 1}</th>
                    <td>
                      {getOnlyFormatDate(itemExpense?.date)}
                      {/* {new Date(itemExpense?.date).toLocaleDateString()} */}
                    </td>
                    <td>{item?.name}</td>
                    <td>{item?.quantity}</td>
                    <td>{item?.description}</td>
                    <td>
                      <FaRupeeSign className="inline" />
                      <span>{item?.price}</span>
                    </td>
                    <td>{item?.remark ? item?.remark : ""}</td>
                    {/* <td className="flex gap-2">
                      <button
                        className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case md:mb-2 mb-2 ms-2`}
                        onClick={() => {
                          setEditItemData(item);
                          window.eb_modal.showModal();
                          setIndex(idx);
                        }}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn btn-sm hover:bg-red-600 bg-transparent hover:text-white text-red-600 !border-red-600 normal-case rounded"
                        title={`Cancel`}
                        onClick={() => {
                          setEditItemData(item);
                          window.remove_expenses.showModal();
                          setIndex(idx);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td> */}
                    <span>
                      {isValidUrl("dashboard/show-all-expense", pathname) ||
                      isValidUrl("dashboard/all-hotel-expense", pathname) ? (
                        <td className="flex gap-2">
                          <button
                            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case md:mb-2 mb-2 ms-2`}
                            onClick={() => {
                              setEditItemData(item);
                              window.eb_modal.showModal();
                              setIndex(idx);
                            }}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="btn btn-sm hover:bg-red-600 bg-transparent hover:text-white text-red-600 !border-red-600 normal-case rounded"
                            title={`Cancel`}
                            onClick={() => {
                              setEditItemData(item);
                              window.remove_expenses.showModal();
                              setIndex(idx);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      ) : (
                        ""
                      )}
                    </span>
                  </tr>
                );
              })}
          </tbody>
          <tfoot className={`text-[1.2rem] font-bold`}>
            <tr>
              <td colSpan={5} className={`text-end text-md font-bold`}>
                Total :
              </td>
              <td>
                <div className="flex">
                  <div>
                    <FaRupeeSign />
                  </div>
                  <div> {totalItemsAmount}</div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Modal id={`eb_modal`}>
        <EditExpensesView
          index={index}
          allItems={itemExpense}
          data={editItemData}
        />
      </Modal>
      <Modal id={`remove_expenses`}>
        <RemoveExpenses
          index={index}
          allItems={itemExpense}
          data={editItemData}
        />
      </Modal>
      {/* pagination */}
      <div className="flex justify-center mt-10" onClick={handleScrollToTop}>
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
      </div>
    </div>
  );
};

export default ShowAllExpenseView;
