import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import COItem from "./COItem.jsx";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  useGetRoomsAndHotelsQuery,
  useRoomNumbersQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import { useAddOrderMutation } from "../../redux/restaurant/foodAPI.js";
import toast from "react-hot-toast";
import Select from "react-select";
import { useOrderInventoryMutation } from "../../redux/inventory/inventoryAPI.js";
import { resetInv, setOrder } from "../../redux/inventory/inventorySlice.js";
import { customFilterOption } from "../../utils/utils.js";

// form validation
const validationSchema = yup.object({
  roomNumber: yup.string().required("Room number is required"),
});

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const { order, orderCalc } = useSelector((store) => store.inventorySlice);
  const closeRef = useRef();
  const [orderInventory, { isLoading: inventoryLoading }] =
    useOrderInventoryMutation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectorValue, setSelectorValue] = useState([]);
  const formik = useFormik({
    initialValues: {
      roomNumber: "",
      chooseHotel: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const obj = { ...order };
      const items = [...obj.items];

      const arr = items.map((item) => item._id);

      const response = await orderInventory({
        room_id: values.roomNumber,
        item_ids: arr,
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        dispatch(resetInv());
        closeRef.current.click();
        setSelectorValue([]);
        toast.success(response.data.message);
      }
    },
  });

  const { data: hotelList } = useGetRoomsAndHotelsQuery();
  const { isLoading, data: rooms } = useRoomsQuery({
    cp: "0",
    filter: "",
    search: "",
    limit: 1000000,
  });

  const transformedRooms = rooms?.data?.docs
    ?.filter((room) => room.status === "CheckedIn")
    .map((room) => ({
      value: room._id,
      label: room.roomNumber,
    }));

  useEffect(() => {
    if (formik.values.roomNumber)
      dispatch(setOrder({ ...order, roomNumber: formik.values.roomNumber }));
  }, [formik.values.roomNumber]);

  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          ref={closeRef}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>

      <div>
        <h3 className={`text-2xl font-semibold mb-3`}>Assign Items</h3>
        <hr />
        <div className={`flex justify-between mt-5`}>
          <div className="flex flex-col gap-3">
            <Select
              placeholder="Select room"
              name={`roomNumber`}
              defaultValue={formik.values.roomNumber}
              value={selectorValue}
              filterOption={customFilterOption}
              options={transformedRooms}
              isSearchable
              onChange={(e) => {
                setSelectorValue(e);
                formik.setFieldValue("roomNumber", e.value)}}
              noOptionsMessage={() => "No room available"}
              classNames={{
                control: (state) =>
                  `!input !input-md !h-4 !input-bordered !bg-transparent min-w-[10rem] !rounded !w-full !border-gray-500/50 focus-within:!outline-none ${
                    state.isFocused ? "!shadow-none" : ""
                  }`,
                valueContainer: () => "!p-0",
                placeholder: () => "!m-0",
              }}
            />
            {formik.touched.roomNumber && Boolean(formik.errors.roomNumber) ? (
              <small className="text-red-600">
                {formik.touched.roomNumber && formik.errors.roomNumber}
              </small>
            ) : null}
          </div>
        </div>
        {order.items.length ? (
          <div className="overflow-x-auto w-full mt-5">
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((food, idx) => (
                  <COItem key={idx} idx={idx} food={food} />
                ))}
              </tbody>
              <tfoot className={`text-sm`}>
                <tr>
                  <td colSpan={5}>
                    <div className="mt-3">
                      <div className="flex">
                        <button
                          disabled={inventoryLoading}
                          type="submit"
                          onClick={() => formik.handleSubmit()}
                          className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                        >
                          Assign Items
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <h3 className={`mt-10`}>Empty</h3>
        )}
      </div>
    </>
  );
};

export default ConfirmOrder;
