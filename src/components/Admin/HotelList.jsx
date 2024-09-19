import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router-dom";
import { Rings } from "react-loader-spinner";
import { useFormik } from "formik";
import { useHotelsQuery } from "../../redux/Owner/hotelsAPI.js";

const HotelList = ({hotels}) => {
 
  return (
    <div className="card w-full bg-white shadow-xl">
      <div className="card-body">
        <h1 className="bg-green-slimy text-2xl text-center text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 mt-5">Hotel List</h1>
        {hotels?.length ? (
          <div className=" h-[29em] overflow-y-scroll">
            <div className="overflow-x-auto">
              <table className="table border">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Name</th>
                    <th>Branch Name</th>
                    {/* <th> Address </th> */}
                    {/* <th className="text-center">Email</th> */}
                    <th>Phone Number</th>
                    {/* <th>License <br /> Number</th> */}
                    {/* <th> Manager</th> */}
                  </tr>
                </thead>
                <tbody>
                  {hotels?.map((hotel, idx) => {
                    return (
                      <tr
                        className={
                          idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                        }
                      >
                        <th>{++idx}</th>
                        <td>{hotel?.name}</td>
                        <td>{hotel?.branch_name}</td>
                        {/* <td>Kolkata</td> */}
                        {/* <td>jondoe@gmail.com</td> */}
                        <td>{hotel?.phone_no}</td>
                        {/* <td>123456</td> */}
                        {/* <td>Manager 1</td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* <div className="flex justify-center mt-10">
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
              </div> */}
          </div>
        ) : (
          <h3 className={`text-center mt-10`}>No data found!</h3>
        )}
      </div>
    </div>
  );
};

export default HotelList;
