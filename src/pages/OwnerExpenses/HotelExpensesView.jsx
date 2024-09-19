import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRegEdit, FaRegFilePdf, FaRupeeSign } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
// import EditExpensesView from "./EditExpensesView";
import ReactPaginate from "react-paginate";
import EditHotelExpenses from "./EditHotelExpenses";

const HotelExpensesView = () => {

  const [pageCount, setPageCount] = useState(10);

 const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

    const formik = useFormik({
        initialValues: {
          startDate: "",
          endDate: "",
        },
      });
  const navigate = useNavigate();

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
        <div className={`flex`}>
        <button className="btn btn-sm min-w-[5rem] bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case">
          {" "}
          <FaRegFilePdf />
          PDF
        </button>
      </div>
       
      </div>
      <div>
          <h1 className={`text-2xl text-center`}>Hotel Expenses Information</h1>
        </div>
        <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Date</th>
                  <th>Items Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(+formik.values.entries || 5)].map((_, idx) => {
                  return (
                    <tr
                      className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                    >
                      <th>{++idx}</th>
                      <td>23-11-2023</td>
                      <td>Rice</td>
                      <td>25 Kg</td>
                      <td>Nice Product</td>
                      <td>
                        <div className="flex">
                          <div>
                          <FaRupeeSign />
                          </div>
                          <div>
                            <span>5000</span>
                          </div>
                        </div>
                      </td>
                      <td>Remark</td>
                      <td>
                        <button
                          className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case md:mb-2 mb-2 ms-2`}
                          onClick={() =>
                            document.getElementById("my_modal_3").showModal()
                          }
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
                            {/* <EditExpensesView /> */}
                            <EditHotelExpenses/>
                          </div>
                        </dialog>
                      </td>
                     
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
                      <div>
                        {" "}
                        65464
                        {/* {totalItemPrice} */}
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
              
            </table>
           {/* <div className={`flex justify-center md:ms-[20rem] mt-4 gap-2`}>
            <h1>Grand Total :</h1>
           <div className="flex">
                          <div>
                          <FaRupeeSign />
                          </div>
                          <div>
                            <span>25000</span>
                          </div>
                        </div>
           </div> */}
          </div>
          {/* pagination */}
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
  );
};

export default HotelExpensesView;
