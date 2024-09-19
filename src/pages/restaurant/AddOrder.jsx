import React, { useEffect, useState } from "react";
import FoodLists from "../../components/restaurant/FoodLists.jsx";
import Modal from "../../components/Modal.jsx";
import ConfirmOrder from "../../components/restaurant/ConfirmOrder.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import * as Yup from "yup";

import { useFormik } from "formik";
import {
  useGetRoomsAndHotelsQuery,
  useGetTablesQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import {
  resetFoodOrder,
  setRoomId,
  setTableId,
} from "../../redux/add-order/addOrderSlice.js";
import { FaArrowsRotate } from "react-icons/fa6";
import Select from "react-select";
import { Link } from "react-router-dom";

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Please choose the type"),
  roomId: Yup.string().when("type", {
    is: "Room",
    then: Yup.string().required("Room ID is required when type is Room"),
    otherwise: Yup.string().notRequired(),
  }),
  tableId: Yup.string().when("type", {
    is: "Table",
    then: Yup.string().required("Table ID is required when type is Table"),
    otherwise: Yup.string().notRequired(),
  }),
  search: Yup.string(),
  method: Yup.string(),
});

const AddOrder = () => {
  const [keyword, setKeyword] = useState(null);
  const [reset, setReset] = useState(false);
  const [forcePage, setForcePage] = useState(null);
  const [error, setError] = useState("");
  const [tableIdRequired, setTableIdRequired] = useState("");
  const [roomIdRequired, setRoomIdRequired] = useState("");

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      search: "",
      method: "",
      type: "",
      roomId: "",
      tableId: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // setForcePage(1)
      // setKeyword(values.search);
    },
  });
  const { order } = useSelector((store) => store.addOrderSlice);

  const { data: hotelList } = useGetRoomsAndHotelsQuery();

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };

  const { isLoading, data: rooms } = useRoomsQuery({
    cp: "0",
    filter: "",
    search: "",
    limit: 1000000,
  });

  const { data: tables } = useGetTablesQuery();
  const transformedRooms =
    rooms?.data?.docs
      ?.filter((room) => room.status === "CheckedIn")
      .map((room) => ({
        value: room._id,
        label: room.roomNumber,
      })) || [];
  const transformedTables = tables?.data?.map((table) => ({
    value: table._id,
    label: table.table_number,
  }));
  const customFilterOption = (option, inputValue) => {
    const labelString = option.label.toString().toLowerCase();
    const inputString = inputValue.toLowerCase();
    return labelString.includes(inputString);
  };
  const handleConfirmOrder = () => {
    if (formik.values.type && formik.values.type === "Table") {
      dispatch(setTableId(formik.values.tableId));
      if (!formik.values.tableId) {
        setTableIdRequired("Select the table!");
        return;
      } else {
        setTableIdRequired("");
        window.fp_modal.showModal();
      }

      setError("");
    } else if (formik.values.type && formik.values.type === "Room") {
      dispatch(setRoomId(formik.values.roomId));
      if (!formik.values.roomId) {
        setRoomIdRequired("Select the room");
        return;
      } else {
        setRoomIdRequired("");
        window.fp_modal.showModal();
      }

      setError("");
    } else {
      setError(" please Choose the type");
    }
  };
  useEffect(() => {
    formik.values.type.length && setError("");
  }, [formik.values.type]);

  return (
    <div className={`space-y-10 bg-white rounded-2xl p-5`}>
      <div>
        <Link to={`/dashboard `}>
          <button
            type="button"
            className="text-white bg-green-slimy  font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1 mb-6"
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
        <h1>Add-Order</h1>
      </div>
      <div className={`flex flex-col md:flex-row justify-between`}>
        <div className={`flex flex-col md:flex-row gap-4 mb-4`}>
          <div className=" flex flex-col">
            <select
              name="type"
              className="select select-sm bg-transparent select-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy !h-[2.35rem]"
              value={formik.values.type}
              onChange={formik.handleChange}
            >
              <option value="" selected disabled>
                Choose Type
              </option>
              <option value="Room">Room</option>
              <option value="Table">Table</option>
            </select>
            {error && (
              <span className="text-red-600 ms-2">
                <small>{error}</small>
              </span>
            )}
          </div>

          {formik.values.type && formik.values.type === "Room" ? (
            <div className="flex flex-col gap-3">
              <Select
                placeholder="Select room"
                name={`roomId`}
                filterOption={customFilterOption}
                options={transformedRooms}
                isSearchable
                onChange={(e) => {
                  formik.setFieldValue("roomId", e.value);
                }}
                noOptionsMessage={() => "No room available"}
                classNames={{
                  control: (state) =>
                    `!input !input-md !h-auto !min-w-[12rem] !input-bordered !bg-transparent !rounded !border-gray-500/50 focus-within:!outline-none ${
                      state.isFocused ? "!shadow-none" : ""
                    }`,
                  valueContainer: () => "!p-0",
                  placeholder: () => "!m-0",
                }}
              />
              {roomIdRequired && (
                <span className="text-red-600 ms-2">
                  <small>{roomIdRequired}</small>
                </span>
              )}
            </div>
          ) : null}
          {formik.values.type && formik.values.type === "Table" ? (
            <div className="flex flex-col gap-3">
              <Select
                placeholder="Select table"
                name={`tableId`}
                filterOption={customFilterOption}
                options={transformedTables}
                isSearchable
                onChange={(e) => formik.setFieldValue("tableId", e.value)}
                noOptionsMessage={() => "No table available"}
                classNames={{
                  control: (state) =>
                    `!input !input-md !h-auto !min-w-[12rem] !input-bordered !bg-transparent !rounded !border-gray-500/50 focus-within:!outline-none ${
                      state.isFocused ? "!shadow-none" : ""
                    }`,
                  valueContainer: () => "!p-0",
                  placeholder: () => "!m-0",
                }}
              />
              {tableIdRequired && (
                <span className="text-red-600 ms-2">
                  <small>{tableIdRequired}</small>
                </span>
              )}
            </div>
          ) : null}
        </div>

        <div className={`flex flex-col md:flex-row gap-6`}>
          <button
            onClick={() => {
              dispatch(resetFoodOrder());
              setReset(true);
              formik.resetForm();
              setTableIdRequired("");
              setRoomIdRequired("");
            }}
            type={`button`}
            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
          >
            <span>Reset</span>
            <span>
              <FaArrowsRotate />
            </span>
          </button>
          <button
            onClick={handleConfirmOrder}
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
              onChange={(e) => {
                setForcePage(0);
                formik.handleChange(e);
              }}
            />
          </div>
        </div>
      </div>
      <FoodLists
        formik={formik}
        reset={reset}
        setReset={setReset}
        keyword={keyword}
        chooseHotel={formik.values.chooseHotel}
        setForcePage={setForcePage}
        forcePage={forcePage}
      />
      <Modal id={`fp_modal`} classNames={`w-full max-w-3xl`}>
        <ConfirmOrder />
      </Modal>
    </div>
  );
};

export default AddOrder;
