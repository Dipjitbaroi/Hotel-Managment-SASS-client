import React, { useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const SwimmingPoolList = () => {
  const navigate = useNavigate();
  const [hotelsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const formik = useFormik({
    initialValues: {
      search: "",
      filter: "",
    },
  });

  return (
    <div className={`space-y-10 bg-white rounded-2xl p-10`}>
      <h1 className={`text-center text-2xl`}>Swimming Pool List</h1>
      <div className={`flex justify-between gap-4`}>
        <div>
          <select
            name="filter"
            className="select select-sm select-bordered border-green-slimy rounded w-full focus:outline-none"
            value={formik.values.filter}
            onChange={formik.handleChange}
          >
            <option value="all">All</option>
            <option value=" Active">Active</option>
            <option value="InActive">InActive </option>
            <option value="Bookded"> Bookded</option>
            <option value="UnderMaintenence">Under Maintenence</option>
          </select>
        </div>
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
      <div className="overflow-x-auto">
        <table className="table border">
          <thead>
            <tr>
              <th>Sl</th>
              <th>
                Pool <br /> Name
              </th>
              <th>
                Type OF <br />
                Name
              </th>
              <th>Status</th>
              <th>Capacity</th>
              <th>
                Per Person <br />
                Price
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(1)].map((_, idx) => {
              return (
                <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
                  <th> {++idx}</th>
                  <td>Neptune Pool</td>
                  <td>
                    Comercial Swimming <br /> Pool
                  </td>
                  <td>Active</td>
                  <td>02</td>
                  <td>200</td>
                  <td className={`space-x-1.5`}>
                    {/* <span
                          className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ms-2`}
                          onClick={() =>
                            navigate(`/dashboard/swimming-pool-list/${idx}`)
                          }
                        >
                          <FaEye />
                        </span> */}
                    <span
                      className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ms-2`}
                      onClick={() => navigate(`/dashboard/swimming-edit/${idx}`)}
                    >
                      <FaEdit />
                    </span>
                    <span
                      className={`btn btn-sm bg-red-500 hover:bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case mt-2`}
                    >
                      <FaTrash />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

export default SwimmingPoolList;
