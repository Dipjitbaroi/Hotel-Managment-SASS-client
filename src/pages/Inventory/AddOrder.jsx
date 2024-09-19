import React from "react";
import FoodLists from "../../components/restaurant/FoodLists.jsx";
import Modal from "../../components/Modal.jsx";
import ConfirmOrder from "../../components/restaurant/ConfirmOrder.jsx";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { useFormik } from "formik";

const AddOrder = () => {
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: () => {
    },
  });
  const { order } = useSelector((store) => store.addOrderSlice);

  return (
    <div className={`space-y-10 bg-white p-16 rounded-2xl mx-10`}>
      <div className={`flex flex-col-reverse sm:flex-row gap-3 sm:justify-end`}>
        <div className={`flex space-x-1.5`}>
          <button
            onClick={() => window.fp_modal.showModal()}
            type={`button`}
            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case ${
              !order.foods.length ? "opacity-50 pointer-events-none" : ""
            }`}
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
      </div>
      <FoodLists />
      <Modal id={`fp_modal`}>
        <ConfirmOrder />
      </Modal>
    </div>
  );
};

export default AddOrder;
