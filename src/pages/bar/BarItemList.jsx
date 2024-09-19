import React, { useState } from "react";
import { FaWineGlass,FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useFormik } from "formik";
import * as yup from "yup";

import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Modal from "../../components/Modal";

const validationSchema = yup.object({
  roomNumber: yup.string().required("Room number is required"),
});

const BarItemList = () => {
  const navigate = useNavigate();
  const [renewPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  // const formik = useFormik({
  //   initialValues: {
  //     roomNumber: "",
  //     search: "",
  //   },
  //   validationSchema,
  //   onSubmit: () => {
  //   },
  // });

  return (
    <div className={`space-y-8 bg-white p-10 rounded-2xl`}>
        {/* <div
        className={`flex flex-col-reverse sm:flex-row gap-3 sm:justify-between`}
      >
        <div className="flex flex-col gap-3">
          <select
            name="roomNumber"
            className="select select-sm select-bordered border-green-slimy rounded focus:outline-none"
            value={formik.values.roomNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" selected disabled>
              Room Number
            </option>
            <option value="room1">101 </option>
            <option value="room2"> 201 </option>
            <option value="room3"> 301 </option>

          </select>
          {formik.touched.roomNumber && Boolean(formik.errors.roomNumber) ? (
            <small className="text-red-600">
              {formik.touched.roomNumber && formik.errors.roomNumber}
            </small>
          ) : null}
        </div>

        <div className={`flex space-x-1.5`}>
          <button
            onClick={() => window.fp_modal.showModal()}
            type={`button`}
            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case $`}
          >
            Confirm Order
          </button>
          <div className={`relative sm:min-w-[20rem]`}>
            <input
              type="text"
              placeholder="Search by name..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
              value={formik.values.search}
              onChange={formik.handleChange}
            />
            <button
              type="button"
              className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div> */}
      <div className={`text-2xl text-center`}>
    Bar Item List
      </div>
      <div className="overflow-x-auto">
        <table className="table border">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Brand Name</th>
              <th>Type Of <br /> Alcohol</th>
              <th>Surveyor <br /> Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, idx) => {
              return (
                <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
                  <th>{++idx}</th>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                      </div>
                      <div>
                        <div className="font-bold">Carew & co</div>
                      </div>
                    </div>
                  </td>
                  <td>Votkha</td>
                  <td>3 Pack</td>
                  <td>1500</td>
                  <td className={`space-x-1.5`}>
                    <span
                     className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case mb-2 ms-2`}
                      onClick={() => navigate(`/dashboard/barItem-listView/${idx}`)}
                    >
                      <FaWineGlass />
                    </span>
                    <span
                     className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case mb-2 ms-2`}
                      onClick={() => navigate(`/dashboard/edit-bar/${idx}`)}
                    >
                      <FaEdit />
                    </span>
                    <span
                      className={`btn btn-sm bg-red-500 hover:bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case`}
                      onClick={() => navigate(`/dashboard/${idx}`)}
                    >
                      <MdDelete />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal id={`fp_modal`}>
        {/* <ConfirmOrder 
        formik={formik} /> */}
      </Modal>
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
        />
      </div>
    </div>
  );
};

export default BarItemList;
