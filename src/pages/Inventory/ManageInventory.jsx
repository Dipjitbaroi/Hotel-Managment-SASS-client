import React, { useState } from "react";
import FoodLists from "../../components/restaurant/FoodLists.jsx";
import Modal from "../../components/Modal.jsx";
import ConfirmOrder from "../../components/inventory/ConfirmOrder.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useFormik } from "formik";
import InventoryLists from "../../components/inventory/InventoryLists.jsx";
import {
  useGetItemsQuery,
  useGetRoomsAndHotelsQuery,
} from "../../redux/room/roomAPI.js";
import { resetFoodOrder } from "../../redux/add-order/addOrderSlice.js";
import { FaArrowsRotate } from "react-icons/fa6";
import { resetInv } from "../../redux/inventory/inventorySlice.js";
import { Link } from "react-router-dom";

const ManageInventory = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const formik = useFormik({
    initialValues: {
      search: "",
      filter: "",
      chooseHotel: "",
    },
    onSubmit: (values) => {
      setCurrentPage(0)
      setKeyword(values.search);
      
    },
  });
  const { data: ItemsData } = useGetItemsQuery();
  const { order } = useSelector((store) => store.inventorySlice);


  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };

  return (
    <div className={`space-y-10 bg-white p-5  rounded-2xl `}>
      <div className="mb-7">
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
      <div
        className={`bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}
      >
        <h1>Manage Items</h1>
      </div>

      <div className={`flex flex-col md:flex-row sm:justify-between gap-3`}>
        <div className={`flex space-x-1.5 gap-2  `}>
          <div className="flex flex-col gap-2">
            <select
              name="filter"
              className="select select-sm select-bordered border-green-slimy rounded focus:outline-none"
              value={formik.values.filter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="all">All</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
            {formik.touched.filter && Boolean(formik.errors.filter) ? (
              <small className="text-red-600">
                {formik.touched.filter && formik.errors.filter}
              </small>
            ) : null}
          </div>
        </div>
        <div className={`flex space-x-1.5 flex-col md:flex-row gap-4`}>
          <button
            onClick={() => dispatch(resetInv())}
            type={`button`}
            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case ${
              !order.items.length ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <span>Reset</span>
            <span>
              <FaArrowsRotate />
            </span>
          </button>
          <button
            onClick={() => window.fp_modal.showModal()}
            type={`button`}
            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case ${
              !order.items.length ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Assign Items
          </button>
          <div className={`relative sm:min-w-[10rem `}>
            <input
              type="text"
              placeholder="Search by name..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
              value={formik.values.search}
              onChange={formik.handleChange}
              onKeyUp={(e) => {
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
      </div>
      <InventoryLists
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        filter={formik.values.filter}
        keyword={keyword}
        chooseHotel={formik.values.chooseHotel}
      />
      <Modal id={`fp_modal`}>
        <ConfirmOrder />
      </Modal>
    </div>
  );
};

export default ManageInventory;
