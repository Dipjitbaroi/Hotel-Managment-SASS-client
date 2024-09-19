import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import COItem from "./COItem.jsx";
import { setOrder } from "../../redux/add-order/addOrderSlice.js";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  useGetRoomsAndHotelsQuery,
  useRoomNumbersQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import toast from "react-hot-toast";
import { useAddOrderMutation } from "../../redux/restaurant/foodAPI.js";
import Select from "react-select";
import { customFilterOption } from "../../utils/utils.js";

// form validation
const validationSchema = yup.object({
  // roomNumber: yup.string().required("Room number is required"),
  chooseHotel: yup.string().required("Hotel is required"),
});

const ConfirmOrder = () => {
  const closeRef = useRef();
  const [selectedOption, setSelectedOption] = useState(null);
  const [addOrder] = useAddOrderMutation();
  const { order, orderCalc } = useSelector((store) => store.addOrderSlice);
  const formik = useFormik({
    initialValues: {
      roomNumber: "",
      chooseHotel: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const obj = { ...order };
      const items = [...obj.foods];

      const arr = items.map((item) => ({
        item: item.food_name,
        price: item.price,
        serveyor_quantity: item.serveyor_quantity,
        quantity: item.quantity,
        total: item.quantity * item.price,
      }));

      const response = await addOrder({
        room_id: selectedOption?.value,
        hotel_id: values.chooseHotel,
        items: arr,
        grand_total: orderCalc.grandTotal,
      });
      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        closeRef.current.click();
        toast.success(response.data.message);
      }
    },
  });
  const dispatch = useDispatch();
  const { isLoading, data: rooms } = useRoomsQuery({
    id: formik.values.chooseHotel,
    cp: "0",
    filter: "",
    search: "",
  });
  const { data: hotelList } = useGetRoomsAndHotelsQuery();

  useEffect(() => {
    if (formik.values.roomNumber)
      dispatch(setOrder({ ...order, roomNumber: formik.values.roomNumber }));
  }, [formik.values.roomNumber]);

  const transformedRooms = rooms?.data?.docs?.map((room) => ({
    value: room.roomNumber,
    label: `${room.roomNumber} - ${room.category}`,
  }));

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
        <h3 className={`text-2xl font-semibold mb-3`}>Confirm Order</h3>
        <hr />
        <div className={`flex justify-between mt-5`}>
          <div className="flex flex-col gap-3">
            <select
              name="chooseHotel"
              className="input input-md h-8 bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
              value={formik.values.chooseHotel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                Choose Hotel
              </option>

              {hotelList?.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
            {formik.touched.chooseHotel &&
            Boolean(formik.errors.chooseHotel) ? (
              <small className="text-red-600">
                {formik.touched.chooseHotel && formik.errors.chooseHotel}
              </small>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            <Select
              placeholder="Select room"
              name={`roomNumber`}
              defaultValue={selectedOption}
              options={transformedRooms}
              filterOption={customFilterOption}
              isSearchable
              closeMenuOnSelect={false}
              onChange={setSelectedOption}
              noOptionsMessage={() => "No room available"}
              classNames={{
                control: (state) =>
                  `!input !input-md !h-8 !input-bordered !bg-transparent !rounded !w-full !border-gray-500/50 focus-within:!outline-none ${
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
        {order.foods.length ? (
          <div className="overflow-x-auto w-full mt-5">
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>
                    Surveyor <br />
                    Quantity
                  </th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.foods.map((food, idx) => (
                  <COItem key={idx} idx={idx} food={food} />
                ))}
              </tbody>
              <tfoot className={`text-sm`}>
                <tr>
                  <td colSpan={5}>
                    <div className="mt-3">
                      <div className="pl-2 mb-4 w-[70%] text-md font-semibold">
                        <p className="flex justify-between">
                          Total Price : <span>{orderCalc.total}</span>
                        </p>
                        <p className="flex justify-between">
                          Tax : <span>{orderCalc.tax}</span>
                        </p>
                        <p className="flex justify-between">
                          Grand Total: <span>{orderCalc.grandTotal}</span>
                        </p>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => formik.handleSubmit()}
                          className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                        >
                          Place Order
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
