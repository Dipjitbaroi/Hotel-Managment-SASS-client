import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import COItem from "./COItem.jsx";
import {
  resetFoodOrder,
  setOrder,
  setOrderCalc,
} from "../../redux/add-order/addOrderSlice.js";
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
import FoodList from "./FoodList.jsx";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import RestaurantPDF from "../../pages/restaurant/RestaurantPDF.jsx";
import { versionControl } from "../../utils/utils.js";
import { FaPrint } from "react-icons/fa";
import ConfirmOrderPrint from "./ConfirmOrderPrint.jsx";

// current year
// form validation
const validationSchema = yup.object({
  roomNumber: yup.string().required("Room number is required"),
  chooseHotel: yup.string().required("Hotel is required"),
});

const ConfirmOrder = ({ selectRoomId, selectTableId }) => {
  const componentRef = useRef();
  const closeRef = useRef();
  const [success, setSuccess] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const dispatch = useDispatch();
  const [addOrder, { isLoading }] = useAddOrderMutation();
  const { order, orderCalc } = useSelector((store) => store.addOrderSlice);
  const formik = useFormik({
    initialValues: {
      roomNumber: "",
      chooseHotel: "",
    },
    validationSchema,
    onSubmit: async (values) => {},
  });
  const handlePlaceOrder = async () => {
    const obj = { ...order };
    const items = [...obj.foods];

    const arr = items.map((item) => ({
      item: item.food_name,
      price: item.price,
      serveyor_quantity: item.serveyor_quantity,
      quantity: item.quantity,
      total: item.quantity * item.price,
    }));
    const orderForRoom = {
      room_id: obj.roomId,
      items: arr,
      paid_amount: 0,
      current_order: false,
      dedicated_to: "room",
    };
    const orderForTable = {
      table_id: obj.tableId,
      items: arr,
      paid_amount: 0,
      current_order: true,
      dedicated_to: "table",
    };
    const response = await addOrder(
      obj.tableId.length
        ? orderForTable
        : obj.roomId.length
        ? orderForRoom
        : null
    );
    if (response?.error) {
      toast.error(response.error.data.message);
    } else {
      dispatch(resetFoodOrder());
      // closeRef.current.click();
      toast.success(response.data.message);
      setSuccess(arr);
    }
  };
  const { data: rooms } = useRoomsQuery({
    id: formik.values.chooseHotel,
    cp: "0",
    filter: "",
    search: "",
    limit: 1000000,
  });
  const { data: hotelList } = useGetRoomsAndHotelsQuery();

  useEffect(() => {

    if (formik.values.roomNumber) dispatch(setOrder({ ...order }));
   
  }, [formik.values.roomNumber]);

  // const transformedRooms = rooms?.data?.docs?.map((room) => ({
  //   value: room._id,
  //   label: room.roomNumber,
  // }));
  const [isheaderHide, setHeaderHide] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Call multiple functions here
  const handleButtonClick = () => {
    // Call multiple functions here
    setHeaderHide(true);

    // Introduce a delay before calling handlePrint
    setTimeout(() => {
      handlePrint();
    }, 1000); // Replace 1000 with the desired delay in milliseconds
  };

  // current date
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  
// useEffect(()=>{
//   dispatch(setOrderCalc())
// },[dispatch])


  
  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          ref={closeRef}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setSuccess(null)}
        >
          ✕
        </button>
      </form>
      {!success ? (
        <div>
          <h3 className={`text-2xl font-semibold mb-3`}>Confirm Order</h3>
          <hr />
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

                <tfoot lassName={`text-[2rem] font-bold`}>
                  <tr>
                    <td colSpan={6}>
                      <div className="mt-3">
                        <div className="pl-2 mb-4 w-[70%] text-[1rem] font-semibold">
                          <p className="flex gap-4">
                            Total Price : <span>{orderCalc.total}</span>
                          </p>
                        </div>
                        <div className="flex">
                          <button
                            disabled={isLoading}
                            onClick={handlePlaceOrder}
                            className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                          >
                            Place Order
                            {isLoading ? (
                              <span
                                className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                                role="status"
                              ></span>
                            ) : null}
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
      ) : (
        <div>
          <h3 className={`mb-5 font-bold text-2xl `}>
            Order placed successfully.
          </h3>
          <div
            className={`overflow-x-auto border ${isheaderHide ? "p-5" : ""}`}
          >
            <div>
              <table className="table">
                <thead>
                  <tr className={`text-lg`}>
                    <th>Name</th>
                    <th>
                      Surveyor <br /> Quantity
                    </th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {success?.map((food, idx) => (
                    <tr>
                      <td>{food?.item}</td>
                      <td>{food?.serveyor_quantity}</td>
                      <td>{food?.price}</td>
                      <td>{food?.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={`text-sm`}>
                  <tr>
                    <td colSpan={5}>
                      <div className="mt-3">
                        <div className="pl-2 mb-4 w-[70%] text-[1rem] font-semibold">
                          <p className="flex gap-3">
                            Total Price :<span> {orderCalc.total}</span>
                          </p>
                          {/* <p className="flex justify-between">
                            Tax : <span>{orderCalc.tax}</span>
                          </p>
                          <p className="flex justify-between font-bold">
                            Grand Total: <span>{orderCalc.grandTotal}</span>
                          </p> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className={`mt-5 text-end`}>
            <div style={{ display: "none" }}>
              <div className="p-4" ref={componentRef}>
                <ConfirmOrderPrint success={success} orderCalc={orderCalc} />
              </div>
            </div>
            <ReactToPrint
              trigger={() => (
                <button
                  title="please select payment method"
                  className="bg-green-slimy text-white p-2 rounded-sm"
                >
                  <FaPrint className="inline" /> Print
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmOrder;
