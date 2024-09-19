import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRegEdit, FaRegFilePdf, FaRupeeSign } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import ReactPaginate from "react-paginate";
import EditRestaurantSales from "./EditRestaurantSales";
import { useGetOrdersByDateQuery } from "../../redux/room/roomAPI";
import { useSelector } from "react-redux";

const RestaurantSalesView = () => {

  const [pageCount, setPageCount] = useState(10);

  const [searchParams] = useSearchParams();



  const dateParam = searchParams.get('date');
  const hotelId = searchParams.get("hotel")

  const { user } = useSelector((store) => store.authSlice);


// query by searchParams
  const { data:orderedDataByDate, error:orderError, isLoading:orderItemSuccess } = useGetOrdersByDateQuery({
    date: new Date(dateParam).toLocaleDateString(),
    order_status: 'CheckedOut',
    hotel_id:hotelId,
  });


 const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

 
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
          <h1 className={`text-2xl text-center`}>Sales Information</h1>
        </div>
        <div className="overflow-x-auto">
            {orderedDataByDate && orderedDataByDate?.length?<table className="table">
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
                {orderedDataByDate?.data?.map((_, idx) => {
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
                        65464 fake data
                        {/* {totalItemPrice} */}
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table> :<p className="text-center my-16">No Sales yet!</p>}
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

export default RestaurantSalesView;
