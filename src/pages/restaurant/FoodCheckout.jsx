import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "../../redux/restaurant/foodAPI.js";
import { Rings } from "react-loader-spinner";
import SingleCheckoutItem from "../../components/restaurant/SingleCheckoutItem.jsx";
import toast from "react-hot-toast";
import FoodCheckoutPrint from "./FoodCheckoutPrint.jsx";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import {
  calculateDiscountAmount,
  calculatePercentageDiscount,
  getDiscountAmount,
} from "../../utils/utils.js";
import { tr } from "date-fns/locale";
import { useGetHotelByManagerIdQuery } from "../../redux/room/roomAPI.js";
import { useSelector } from "react-redux";
const FoodCheckout = () => {
  const { id } = useParams();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const [orderData, setOrderData] = useState({});
  const [reduceData, setReduceData] = useState([]);
  const [input, setInput] = useState(1);
  const navigate = useNavigate();
  const [updateOrder, isCheckLoader] = useUpdateOrderMutation();

  const [taxPercentage, setTaxPercentage] = useState(0);
  const [serviceTax, setServiceCharge] = useState(0);
  const [discount, setDiscount] = useState("");
  const [calculatedDiscountAmount, setCalculatedDiscountAmount] = useState("");

  const location = useLocation();
  const path = location.pathname;

  const grandTotal = orderData?.data?.items?.reduce(
    (accumulator, item) => accumulator + item.total,
    0
  );
  // const grand_total = orderData?.data?.grand_total;

  const discountTotal = grandTotal - (grandTotal * discount) / 100;

  const taxAmount = (discountTotal * taxPercentage) / 100;

  const serviceChargeTax = (discountTotal * serviceTax) / 100;

  const finalTotal = Math.round(discountTotal + taxAmount + serviceChargeTax);

  const discountAmount = (grandTotal * discount) / 100;
  const serviceChargeAmount = (discountTotal * serviceTax) / 100;
  const taxAmountAfter = (discountTotal * taxPercentage) / 100;
  // checkout information
  const checkOutDiscount = (grandTotal * orderData?.data?.discount) / 100;
  const checkOutAmountAfterDiscount = grandTotal - checkOutDiscount;
  const checkoutServiceCharge =
    (checkOutAmountAfterDiscount * orderData?.data?.service_charge) / 100;
  const checkOutTax =
    (checkOutAmountAfterDiscount * orderData?.data?.tax) / 100;

  const { isUserLoading, user } = useSelector((store) => store.authSlice);
  const {
    data: hotelInfo,
    isLoading: isHotelLoading,
    isSuccess: isHotelSuccess,
  } = useGetHotelByManagerIdQuery(user?._id);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      navigate("/dashboard/add-order");
    },
  });

  const handleDeleteItems = (index, item) => {
    setReduceData([...reduceData, item]);
    setOrderData((prev) => {
      const updatedItems = [...prev?.data?.items];
      updatedItems.splice(index, 1);
      return {
        ...prev,
        data: {
          ...prev?.data,
          items: updatedItems,
        },
      };
    });
  };
  const handleUpdateFood = async () => {
    const totalReduceAmount = reduceData.reduce((acc, current) => {
      return acc + current.total;
    }, 0);

    const checkoutForTable = {
      updateData: {
        paid_amount: 0,
        unpaid_amount: grandTotal,
        total_price: grandTotal,
        items: orderData.data.items,
        current_order: true,
        payment_status: "Pending",
        grand_total: grandTotal,
      },
      // reduced_amount: totalReduceAmount,
    };
    setCheckoutLoading(true);
    const response = await updateOrder({
      data: checkoutForTable,
      id,
    });
    setCheckoutLoading(true);
    if (response?.error) {
      toast.error(response.error.data.message);
      setCheckoutLoading(false);
      setReduceData([]);
    } else {
      toast.success("Order update successfully");
      setCheckoutLoading(false);
      setReduceData([]);
      // handlePrint();
    }
  };
  const handleDiscount = (e) => {
    const inputValue = e.target.value.trim();
    const percentage = Number(inputValue);
    if (!isNaN(percentage) && percentage <= 100) {
      const discountAmount = calculateDiscountAmount(grandTotal, percentage);
      setDiscount(percentage > 0 ? percentage : "");
      setCalculatedDiscountAmount(discountAmount > 0 ? discountAmount : "");
    }
  };
  const handleDiscountAmount = (e) => {
    const inputValue = e.target.value.trim();
    const discountAmount = Number(inputValue);
    if (!isNaN(discountAmount) && discountAmount <= grandTotal) {
      const percentage = calculatePercentageDiscount(
        grandTotal,
        discountAmount
      );
      setCalculatedDiscountAmount(discountAmount > 0 ? discountAmount : "");
      setDiscount(percentage > 0 ? percentage : "");
    }
  };
  const handleCheckout = async () => {
    const totalReduceAmount = reduceData.reduce((acc, current) => {
      return acc + current.total;
    }, 0);
    setCheckoutLoading(true);
    const checkoutForTable = {
      updateData: {
        paid_amount: finalTotal,
        items: orderData.data.items,
        order_status: "CheckedOut",
        current_order: false,
        total_price: grandTotal,
        unpaid_amount: 0,
        payment_status: "Paid",
        grand_total: finalTotal,
        tax: taxPercentage,
        service_charge: serviceTax,
        discount: discount,
      },
      from: orderData?.data?.table_id?.table_number,
    };
    const updateForRoom = {
      updateData: {
        paid_amount: 0,
        unpaid_amount: finalTotal,
        total_price: finalTotal,
        items: orderData.data.items,
        current_order: false,
        payment_status: "Pending",
        grand_total: finalTotal,
      },
      reduced_amount: totalReduceAmount,
    };
    setCheckoutLoading(true);
    const response = await updateOrder({
      data:
        orderData?.data?.dedicated_to === "room"
          ? updateForRoom
          : orderData?.data?.dedicated_to === "table"
          ? checkoutForTable
          : null,
      id,
    });
    setCheckoutLoading(true);
    if (response?.error) {
      toast.error(response.error.data.message);
      setCheckoutLoading(false);
      setReduceData([]);
    } else {
      if (orderData?.data?.dedicated_to === "room") {
        toast.success("Order update successful");
      } else {
        toast.success("Checkout successful");
      }
      setCheckoutLoading(false);
      setReduceData([]);
      // handlePrint();
      if (orderData?.data?.dedicated_to === "table") {
        handlePrint();
      }
    }
  };
  useEffect(() => {
    setOrderData(data);
  }, [data]);

  // for printing
  const componentRef = useRef();

  return (
    <div className={`flex flex-col gap-5 bg-white rounded-lg p-10`}>
      <div>
        <span
          className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-center bg-green-slimy text-white py-2 max-w-[20rem] mx-auto rounded-lg">
          {path.includes("orderDetails") ? "Order details" : "Checkout"}
        </h3>
      </div>
      <hr />
      <div>
        <div className={`flex gap-2`}>
          <span className={``}>
            {orderData?.data?.table_id ? "Table" : "Room"}
          </span>
          <span className="ms-[3.8rem]">:</span>
          <span>
            {orderData?.data?.table_id
              ? orderData?.data?.table_id?.table_number
              : orderData?.data?.room_id?.roomNumber}
          </span>
        </div>
        <div className={`flex items-center gap-3`}>
          <span className={`w-24`}>Invoice No</span>
          <span className="">:</span>
          <span>{orderData?.data?.unique_id}</span>
        </div>
      </div>
      {!isLoading ? (
        <>
          {orderData?.data?.items?.length ? (
            <div className="overflow-x-auto border mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>
                      Surveyor <br /> Quantity
                    </th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>

                    {orderData?.data?.order_status === "CheckedOut" ? null : (
                      <th>Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orderData?.data?.items.map((item, i) => (
                    <SingleCheckoutItem
                      index={i}
                      handleDeleteItems={handleDeleteItems}
                      item={item}
                      orderData={orderData}
                      key={i}
                      showDelete={
                        orderData?.data?.order_status === "CheckedOut"
                          ? false
                          : true
                      }
                    />
                  ))}
                </tbody>
                <tfoot>
                  {orderData?.data?.dedicated_to !== "room" &&
                  orderData?.data?.order_status !== "CheckedOut" ? (
                    <tr className="border-t">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Total</td>
                      <td>{grandTotal}</td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {orderData?.data?.dedicated_to !== "room" &&
                  orderData?.data?.order_status !== "CheckedOut" ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Discount (%)</td>
                      <td>
                        {" "}
                        <span>
                          <input
                            className=" border border-gray-500/80 p-2 lg:-ml-20 md:text-center"
                            placeholder="Discount (%)"
                            type="text"
                            name="addDiscount"
                            id=""
                            value={discount}
                            onChange={handleDiscount}
                          />
                        </span>
                      </td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {orderData?.data?.dedicated_to !== "room" &&
                  orderData?.data?.order_status !== "CheckedOut" ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Discount (Rs)</td>
                      <td>
                        {" "}
                        <span>
                          <input
                            className=" border border-gray-500/80 p-2 lg:-ml-20 md:text-center"
                            placeholder="Discount (Rs)"
                            type="text"
                            name="addDiscount"
                            id=""
                            value={calculatedDiscountAmount}
                            onChange={handleDiscountAmount}
                          />
                        </span>
                      </td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {orderData?.data?.dedicated_to !== "room" &&
                  orderData?.data?.order_status !== "CheckedOut" ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Service Charge (%)</td>
                      <td>
                        {" "}
                        <span>
                          <input
                            className=" border border-gray-500/80 p-2 lg:-ml-20 md:text-center"
                            placeholder="Service Charge"
                            type="number"
                            name="addSrvCrg"
                            id=""
                            onChange={(e) =>
                              setServiceCharge(Number(e.target.value))
                            }
                          />
                        </span>
                      </td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {orderData?.data?.dedicated_to !== "room" &&
                  orderData?.data?.order_status !== "CheckedOut" ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>GST/Tax (%)</td>
                      <td>
                        {" "}
                        <span>
                          <input
                            className="border border-gray-500/80 p-2 lg:-ml-20 md:text-center"
                            placeholder=" GST/Tax"
                            type="number"
                            name="addTax"
                            id=""
                            onChange={(e) =>
                              setTaxPercentage(Number(e.target.value))
                            }
                          />
                        </span>
                      </td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}

                  {orderData?.data?.order_status === "CheckedOut" ? (
                    <tr className="border-t">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Total</td>
                      <td>{grandTotal}</td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}

                  {orderData?.data?.order_status === "CheckedOut" ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Discount</td>
                      <td>{checkOutDiscount}</td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}

                  {orderData?.data?.order_status === "CheckedOut" ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Services Charge</td>
                      <td>{checkoutServiceCharge}</td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {orderData?.data?.order_status === "CheckedOut" ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>GST/Tax</td>
                      <td>{checkOutTax}</td>
                      <td></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {orderData?.data?.order_status === "CheckedOut" ? (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Grand Total</td>
                      <td>{orderData?.data?.grand_total}</td>
                      <td></td>
                    </tr>
                  ) : (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Grand Total</td>
                      <td>{finalTotal}</td>
                      <td></td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          ) : (
            <h3 className={`text-center`}>No data found!</h3>
          )}
        </>
      ) : (
        <Rings
          width="50"
          height="50"
          color="#37a000"
          wrapperClass="justify-center"
        />
      )}

      <div className={`flex gap-4 justify-end mt-4`}>
        <div style={{ display: "none" }}>
          <div className="p-4" ref={componentRef}>
            <FoodCheckoutPrint
              hotelInfo={hotelInfo}
              orderData={orderData}
              finalTotal={finalTotal}
              discountAmount={discountAmount}
              serviceChargeAmount={serviceChargeAmount}
              taxAmountAfter={taxAmountAfter}
              checkOutTax={checkOutTax}
              checkoutServiceCharge={checkoutServiceCharge}
              checkOutDiscount={checkOutDiscount}
            />
          </div>
        </div>
        <ReactToPrint
          trigger={() => (
            <button
              title="please select payment method"
              className="bg-green-slimy text-white px-4 py-1 rounded-md"
            >
              Print
            </button>
          )}
          content={() => componentRef.current}
        />

        {orderData?.data?.dedicated_to !== "room" &&
        orderData?.data?.order_status !== "CheckedOut" ? (
          <div>
            <button
              onClick={handleUpdateFood}
              type="button"
              className="btn btn-sm hover:bg-green-slimy bg-transparent hover:text-white text-green-slimy !border-green-slimy rounded normal-case "
            >
              <>Update</>
              {checkoutLoading ? (
                <span
                  className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                  role="status"
                ></span>
              ) : null}
            </button>
          </div>
        ) : (
          ""
        )}

        {orderData?.data?.order_status === "CheckedOut" ? (
          ""
        ) : (
          <button
            onClick={handleCheckout}
            className="btn btn-sm hover:bg-green-slimy bg-transparent hover:text-white text-green-slimy !border-green-slimy rounded normal-case "
          >
            <>
              {orderData?.data?.dedicated_to === "room"
                ? "Update Order"
                : "Checkout"}
            </>
            {checkoutLoading ? (
              <span
                className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                role="status"
              ></span>
            ) : null}
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCheckout;
