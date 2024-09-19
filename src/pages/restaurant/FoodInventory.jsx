import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  useDeleteFoodMutation,
  useFoodsQuery,
} from "../../redux/restaurant/foodAPI.js";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";

const FoodInventory = () => {
  const [keyword, setKeyword] = useState(null);

  const formik = useFormik({
    initialValues: {
      search: "",
      entries: "",
    },
    onSubmit: (values) => {
      setKeyword(values.search);
    },
  });

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [foodsPerPage, setFoodsPerPage] = useState(10);
  const { isLoading, data: foods } = useFoodsQuery({
    cp: currentPage,
    pp: foodsPerPage,
    search: keyword,
  });
  const [deleteFood] = useDeleteFoodMutation();
  const [pageCount, setPageCount] = useState(1);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Food will be delete.",
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
          deleteFood(id);
        });
      }
    });
  };

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (formik.values.entries) setFoodsPerPage(formik.values.entries);
  }, [formik.values.entries]);

  useEffect(() => {
    if (foods) setPageCount(foods.pagination.totalPages);
  }, [foods]);

  return (
    <div className={`space-y-8 bg-white p-10 rounded-2xl`}>
      <div className={`flex justify-between`}>
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
        <div className={`relative sm:min-w-[20rem]`}>
          <input
            type="text"
            placeholder="Search by food name..."
            name="search"
            className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
            value={formik.values.search}
            onChange={formik.handleChange}
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
      {!isLoading ? (
        <>
          <div className="overflow-x-auto">
            <table className="table border">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  <th>Sell</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {foods?.data?.map((food, idx) => {
                  const {
                    _id,
                    food_name,
                    quantity,
                    price,
                    description,
                    images,
                    sell,
                  } = food;

                  return (
                    <tr
                      className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                    >
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={images[0]} alt="" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{food_name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {quantity ? (
                          <div className="badge min-w-[7rem] bg-green-slimy border-green-slimy text-white">
                            Available
                          </div>
                        ) : (
                          <div className="badge min-w-[7rem] bg-red-600 border-red-600 text-white">
                            Not available
                          </div>
                        )}
                      </td>
                      <td>{sell}</td>
                      <td>{price}</td>
                      <td className={`space-x-1.5`}>
                        <span
                          className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
                          onClick={() =>
                            navigate(`/dashboard/edit-food/${_id}`)
                          }
                          title={`Edit`}
                        >
                          <FaEdit />
                        </span>
                        <span
                          className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
                          title={`Delete`}
                          onClick={() => handleDelete(_id)}
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
        </>
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

export default FoodInventory;
