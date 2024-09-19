import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  useHotelsQuery,
  useUpdateHotelMutation,
} from "../../redux/Owner/hotelsAPI.js";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const HotelLists = () => {
  const { user } = useSelector((store) => store.authSlice);
  const navigate = useNavigate();
  const [hotelsPerPage] = useState(10);
  const [forcePage, setForcePage] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [updateHotel] = useUpdateHotelMutation();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      
    },
  });

  const { isLoading, data: hotels } = useHotelsQuery({
    cp: formik.values.search ? 0 : currentPage,
    search: formik.values.search,
    uid: user._id,
    pid: "",
    filter: "Active",
  });
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Hotel will be delete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#35bef0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Deleted!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          updateHotel({ id, data: { status: "Deleted" } });
        });
      }
    });
  };

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };

  useEffect(() => {
    if (hotels) setPageCount(hotels.totalPages);
  }, [hotels]);

  return (
    <div className={`space-y-10 bg-white rounded-2xl p-4 min-h-screen`}>
      <div>
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
      <div>
        <h1 className="text-center text-2xl bg-green-slimy w-48 mx-auto text-white p-1 rounded-md">
          Hotel List{" "}
        </h1>
      </div>

      <div className={`flex justify-end gap-4`}>
        {/* <div>
          <select
            name="filter"
            className="select select-sm select-bordered border-green-slimy rounded w-full focus:outline-none"
            value={formik.values.filter}
            onChange={formik.handleChange}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="deactive">deActive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div> */}
        <div className={`relative sm:min-w-[20rem]`}>
        <input style={{ display: 'none' }} type="text" name="fakeUsernameremembered"/>
          <input
            type="text"
            placeholder="Search by name..."
            name="search"
            className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
            value={formik.values.search}
            onChange={formik.handleChange}
            onKeyUp={(e) => {
              e.target.value === "" &&  setForcePage(1)
              e.target.value === "" && setCurrentPage(0)
              e.target.value === "" ? formik.handleSubmit() : null;
            }}
            onKeyDown={(e) => pressEnter(e)}
          />
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
          >
            <FaSearch />
          </button>
        </div>
      </div>
      {!isLoading ? (
        hotels?.docs?.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="table border">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Name</th>
                    <th>Branch Name</th>
                    <th>Username</th>
                    {/* <th> Address </th> */}
                    {/* <th className="text-center">Email</th> */}
                    <th>Phone Number</th>
                    {/* <th>License <br /> Number</th> */}
                    {/* <th> Manager</th> */}
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels?.docs?.map((hotel, idx) => {
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
                        <td>{hotel?.manager_acc?.username}</td>
                        <td>{hotel?.phone_no}</td>
                        {/* <td>{hotel?.status}</td> */}
                        <td>
                          {hotel?.status === "Active" ? (
                            <div className="badge min-w-[7rem] bg-green-slimy border-green-slimy text-white">
                              Active
                            </div>
                          ) : (
                            <div className="badge min-w-[7rem] bg-red-600 border-red-600 text-white">
                              Deleted
                            </div>
                          )}
                        </td>
                        {/* <td>123456</td> */}
                        {/* <td>Manager 1</td> */}
                        <td className={`space-x-1.5`}>
                          <span
                            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ml-1.5 mb-2`}
                            onClick={() =>
                              navigate(
                                `/dashboard/hotelList-view/${hotel?._id}`
                              )
                            }
                          >
                            <FaEye />
                          </span>
                          <span
                            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case `}
                            onClick={() =>
                              navigate(`/dashboard/hotel-edit/${hotel?._id}`)
                            }
                          >
                            <FaEdit />
                          </span>
                          {hotel?.status !== "Deleted" ? (
                            <span
                              className={`btn btn-sm bg-red-500 hover:bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case mt-2`}
                              onClick={() => handleDelete(hotel?._id)}
                            >
                              <FaTrash />
                            </span>
                          ) : null}
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
                forcePage={forcePage}
              />
            </div>
          </>
        ) : (
          <h3 className="text-center">No Data Found !!</h3>
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
  );
};

export default HotelLists;
