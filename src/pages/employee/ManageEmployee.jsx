import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  useGetRoomsAndHotelsQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import {
  useDeleteEmployeeMutation,
  useEmployeeQuery,
} from "../../redux/employee/employeeAPI.js";
import Swal from "sweetalert2";
import { useGetUsersQuery } from "../../redux/admin/subadmin/subadminAPI.js";
import store from "../../redux/store.js";
import { useUpdateLicenseStatusMutation } from "../../redux/admin/sls/slsAPI.js";
import { handleImageUrl } from "../../utils/utils.js";

const ManageEmployee = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(null);
  const { data: hotelList } = useGetRoomsAndHotelsQuery();
  const [employeesPerPage] = useState(10);
  const [forcePage, setForcePage] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const parentId = store.getState().authSlice.user._id;
  const [updateLicenseStatus] = useUpdateLicenseStatusMutation();
  const formik = useFormik({
    initialValues: {
      filter: "",
      search: "",
    },
    onSubmit: (values) => {
      setCurrentPage(0)
      setForcePage(0)
      setKeyword(values.search);
      // if(values.search){
      // }
    },
  });
  const { isLoading, data: employees } = useGetUsersQuery({
    cp: currentPage,
    filter: formik.values.filter,
    search: keyword,
    role: "employee",
    parentId,
  });

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };

  const handleDelete = (owner) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Employee will be delete.",
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
          const { user_id, status } = owner;
          updateLicenseStatus({ user_id, status });
        });
      }
    });
  };

  useEffect(() => {
    if (employees) setPageCount(employees.totalPages);
  }, [employees]);

  return (
    <div className={`space-y-8 bg-white p-4 rounded-2xl`}>
      <div className="mb-7">
              <Link to={`/dashboard `}>
                <button
                  type="button"
                  className="text-white bg-green-slimy  font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1 "
                >
                    <dfn>
                      <abbr title="Back"><FaArrowLeft /></abbr>
                    </dfn>
                 
                  <span className="tracking-wider font-semibold text-[1rem]"></span>
                </button>
              </Link>
            </div>
            <div  className={`bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}>
        <h1>Manage Employee</h1>
      </div>
      <div className={`flex justify-end gap-4`}>
      
        <div className={`relative sm:min-w-[20rem]`}>
        <input style={{ display: 'none' }} type="text" name="fakeUsernameremembered"/>
          <input
            type="text"
            placeholder="Search by name..."
            name="search"
            className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none "
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
            onClick={() => formik.handleSubmit()}
            type="button"
            className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
          >
            <FaSearch />
          </button>
        </div>
      </div>
      {employees?.docs?.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="table border">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Emergency Contact</th>
                  <th>Shift</th>
                  <th>Salary</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees?.docs?.map((employee, idx) => {
                  const {
                    _id,
                    name,
                    designation,
                    shift,
                    salary,
                    address,
                    emergency_contact,
                    status,
                    images,
                  } = employee;

                  return (
                    <tr
                      className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                    >
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={handleImageUrl(images?.profile_img)} alt="" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{name}</div>
                            <div className="text-sm opacity-50">
                              {designation}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{emergency_contact}</td>
                      <td>{shift}</td>
                      <td>{salary}</td>
                      <td>{address}</td>
                      <td>
                        {status === "Active" ? (
                          <div className="badge min-w-[7rem] bg-green-slimy border-green-slimy text-white">
                            Active
                          </div>
                        ) : status === "Deactive" || status === "Deleted" ? (
                          <div className="badge min-w-[7rem] bg-red-600 border-red-600 text-white">
                            {status}
                          </div>
                        ) : status === "Suspended" ? (
                          <div className="badge min-w-[7rem] bg-red-500 border-red-500 text-white">
                            Suspended
                          </div>
                        ) : (
                          <div className="badge min-w-[7rem] bg-orange-600 border-orange-600 text-white">
                            Expired
                          </div>
                        )}
                      </td>
                      <td className={`flex flex-wrap gap-1.5`}>
                        <Link to={`${_id}`}>
                          <span
                            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                          >
                            <FaEye />
                          </span>
                        </Link>
                        <span
                          className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                          onClick={() =>
                            navigate(`/dashboard/edit-employee/${_id}`)
                          }
                        >
                          <FaEdit />
                        </span>
                        <span
                          className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
                          onClick={() =>
                            handleDelete({
                              user_id: _id,
                              status: "Deleted",
                            })
                          }
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
              forcePage={forcePage}
            />
          </div>
        </>
      ) : (
        <h3 className={`text-center`}>No data found!</h3>
      )}
    </div>
  );
};

export default ManageEmployee;
