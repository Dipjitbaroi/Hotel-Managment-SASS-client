import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import { MdCurrencyRupee } from "react-icons/md";
import { BiRupee } from "react-icons/bi";
import { getOnlyFormatDate } from "../../utils/utils";

const RestaurantBillsCard = ({ food_bills }) => {
  const allItems = food_bills?.reduce((accumulator, bill) => {
    // Concatenate the items array of each bill to the accumulator array
  
    return accumulator.concat(
      bill.items.map(item => ({
        ...item,
        createdAt: bill.createdAt // Add createdAt property to each item
      }))
    );
  }, []);


 
  
  const totalPrice = allItems?.reduce((total, item) => {
    // Add the price of each item to the total
    return total + item.price * item.quantity;
  }, 0);

  const [managersPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
  });

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.search === 13) {
      formik.handleSubmit();
    }
  };

  // pagination setup for today's expenses
  const itemsPerPage = 6;
  const [currentPageItem, setCurrentPageItem] = useState(0);

  const handlePageChange = ({ selected }) => {
    setCurrentPageItem(selected);
  };
  const totalPage = food_bills && Math.ceil(allItems.length / itemsPerPage);

  const indexOfLastItem = (currentPageItem + 1) * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems =
    food_bills && allItems?.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={`space-y-5 mt-20 `}>
      <div>
        <div className={`bg-white rounded py-4 md:h-full `}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold text-center">
                Restaurant Bills
              </h3>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="table overflow-x-scroll overflow-y-auto">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>

                <tbody>
                  {food_bills &&
                    currentItems?.map((itemBill, idx) => {
                      return (
                        <tr
                          className={
                            idx % 2 === 0 ? "bg-gray-50 hover" : "hover"
                          }
                        >
                          <td>{++idx}</td>
                          <td>
                            {getOnlyFormatDate( itemBill?.createdAt)}
                            {/* {food_bills &&
                              new Date(
                                food_bills[0]?.createdAt
                              ).toLocaleDateString()} */}
                          </td>
                          <td className="whitespace-nowrap">
                            {itemBill?.item}
                          </td>
                          <td>{itemBill?.quantity}</td>
                          <td>{itemBill?.total}</td>
                        </tr>
                      );
                    })}
                  {/* {food_bills?.map((itemBill, idx) => {
                    return (
                      <tr
                        className={
                          idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                        }
                      >
                        <th>{++idx}</th>
                        <td>{new Date(itemBill?.createdAt).toLocaleDateString()}</td>
                        <td>{itemBill?.items?.map((item)=> item?.item)}</td>
                        <td>{itemBill?.items?.map((item)=> item?.quantity)}</td>
                        <td>{itemBill?.items?.map((item)=> item?.price)}</td>
                      </tr>
                    );
                  })} */}
                </tbody>
                {totalPrice ? (
                  <tfoot className={`text-[1.2rem] font-bold`}>
                    <tr>
                      <td colSpan={4} className={`text-end `}>
                        Total :
                      </td>
                      <td>
                        <div className="flex ">
                          <div>
                            <BiRupee />
                          </div>
                          <div>{totalPrice}</div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                ) : (
                  ""
                )}
              </table>
            </div>
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
              pageCount={totalPage}
              pageRangeDisplayed={2}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBillsCard;
