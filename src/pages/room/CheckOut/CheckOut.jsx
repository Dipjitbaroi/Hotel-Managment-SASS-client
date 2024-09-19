import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import CustomerInfoSection from "./CustomerInfoSection";
import RoomDetailsSection from "./RoomDetailsSection";
import BillingSection from "./BillingSection";
import PaymentSection from "./PaymentSection";
import { BiReset } from "react-icons/bi";
import {
  useAddCheckoutDataMutation,
  useAddCheckoutMutation,
  useGetCOInfoQuery,
  useGetCheckoutDataByBookingIdQuery,
  useGetCheckoutMutation,
  useGetHotelByManagerIdQuery,
  useGetRoomsAndHotelsQuery,
  useRoomNumbersQuery,
  useRoomsQuery,
} from "../../../redux/room/roomAPI";
import { useFormik, yupToFormErrors } from "formik";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CheckOutPrint from "./CheckOutPrint";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCheckoutCalSlice,
  setBookingInfo,
  setCalculateAmountAfterDis,
  setCalculateBalance,
  setCalculateCollectedAmount,
  setCalculateNOD,
  setCalculatePayableAmount,
  setCalculateTotalRent,
  setCalculateUnpaidAmount,
  setFromDate,
  setRefundAmount,
  setRoomInfo,
  setTexAmount,
  setToDate,
  updateAdditionalCharge,
  updateServiceCharge,
  updateSubTotal,
} from "../../../redux/checkoutInfoCal/checkoutInfoCalSlice";
import { FaArrowLeft } from "react-icons/fa";
import * as yup from "yup";
import {
  customFilterOption,
  getFormateDateAndTime,
  getISOStringDate,
} from "../../../utils/utils";
import { clearAddOrderSlice } from "../../../redux/add-order/addOrderSlice";
import Modal from "../../../components/Modal";
import RefundPaymentModal from "./RefundPaymentModal";
import { useReactToPrint } from "react-to-print";
import {
  getConvertedIndiaLocalDate,
  getIndianFormattedDate,
} from "../../../utils/timeZone";

const CheckOut = () => {
  const [getCheckout, { data: checkout, isSuccess, isLoading }] =
    useGetCheckoutMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomFromQuery = searchParams.get("room");
  const [addCheckout] = useAddCheckoutMutation();
  const [addCheckoutData, { isLoading: addCheckoutDataLoading }] =
    useAddCheckoutDataMutation();
  const [showRooms, setShowRooms] = useState(false);
  const [totalBilling, setTotalBilling] = useState(0);
  const [fetch, setFetch] = useState(null);
  const [pBill, setPBill] = useState(0);
  const [addCheckOutLoading, setCheckOutLoading] = useState(false);
  const [saveCheckoutDataObj, setSaveCheckoutDataOj] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [additionalChargeComment, setComment] = useState("");

  const { isUserLoading, user } = useSelector((store) => store.authSlice);
  const {
    data: hotelInfo,
    isLoading: isHotelLoading,
    isSuccess: isHotelSuccess,
  } = useGetHotelByManagerIdQuery(user?._id);
  const { bookingId } = useSelector((store) => store.addOrderSlice);
  const componentRef = useRef();

  // set errormessage for trx
  const [trxError, setTrxError] = useState(false);

  const checkin_date = checkout?.data?.room_bookings[0].checkin_date;

  const {
    refundAmount,
    additionalCharge,
    serviceCharge,
    texAmount,
    calculatePayableAmount,
    calculateNOD,
    toDate,
    calculateTotalRent,
    calculateAmountAfterDis,
    calculateBalance,
    calculateCollectedAmount,
    selectedRoomAmountAfterDiscount,
    roomPostedBill,
  } = useSelector((state) => state.checkoutInfoCalSlice);
  const totalRefund =
    checkout?.data?.booking_info?.room_ids?.length === 1 && calculateBalance > 0
      ? calculateBalance + +calculateCollectedAmount
      : 0;
  const totalPayableAmount =
    calculatePayableAmount + additionalCharge + serviceCharge + texAmount;

  const [paymentList, setPaymentList] = useState([
    { method: "", amount: "", trx: "", date: "" },
  ]);
  const handleResetCheckout = () => {
    setShowRooms(false);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      // dispatch(updateServiceCharge(0));
      // dispatch(updateAdditionalCharge(0));
      // dispatch(setTexAmount(0));
      dispatch(clearCheckoutCalSlice);
      navigate("/dashboard/report");
    },
  });
  // Todo work

  // add Checkout data collection
  const room_Ids = checkout?.data?.room_bookings[0].room_id?._id;
  const hotel_id = user?.assignedHotel[0];
  const booking_info_id = checkout?.data?.booking_info?._id;
  const booking_id = checkout?.data?.booking_info?.booking_ids[0];
  const food_order_ids = checkout?.data?.food_bills?.map((fId) => fId?._id);
  const pool_bill_ids = checkout?.data?.pool_bills?.map((fId) => fId?._id);
  const gym_bill_ids = checkout?.data?.gym_bills?.map((fId) => fId?._id);
  const guestName = checkout?.data?.booking_info?.guestName;
  const address = checkout?.data?.booking_info?.address;
  const mobileNumber = checkout?.data?.booking_info?.mobileNumber;
  const emergency_contact = checkout?.data?.booking_info?.emergency_contact;
  const adult = checkout?.data?.booking_info?.adult;
  const children = checkout?.data?.booking_info?.children;
  // const bookingMethod=
  const total_rent = checkout?.data?.booking_info?.total_rent;
  const room_discount = checkout?.data?.booking_info?.room_discount;
  const total_rent_after_dis =
    checkout?.data?.booking_info?.total_rent_after_dis;
  const total_posted_bills = checkout?.data?.booking_info?.total_posted_bills;
  const total_tax = checkout?.data?.booking_info?.total_tax;
  const total_additional_charges =
    checkout?.data?.booking_info?.total_additional_charges;
  const nationality = checkout?.data?.booking_info?.nationality;
  const doc_number = checkout?.data?.booking_info?.doc_number;

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      hotel_id: "",
      roomNumber: "",
    },
    onSubmit: async () => {
      setCheckOutLoading(true);
      const room_numbers = checkout?.data?.room_bookings?.map(
        (i) => i?.room_id?.roomNumber
      );
      const initialPaidAmount =
        checkout?.data?.booking_info?.paid_amount +
        Number(paymentList[0].amount);
      const initialUnpaidAmount = totalPayableAmount - initialPaidAmount;

      const new_total_room_rent =
        calculateNOD * checkout?.data?.room_bookings[0]?.rent_per_day;
      const selectedRoomFoodBill = checkout?.data?.food_bills?.reduce(
        (accumulator, currentValue) => accumulator + currentValue.unpaid_amount,
        0
      );
      const selectedRoomPoolBill = checkout?.data?.pool_bills?.reduce(
        (accumulator, currentValue) => accumulator + currentValue.unpaid_amount,
        0
      );
      const selectedRoomGymBill = checkout?.data?.gym_bills?.reduce(
        (accumulator, currentValue) => accumulator + currentValue.unpaid_amount,
        0
      );
      const new_total_posted_bills = Math.ceil(
        checkout?.data?.booking_info?.total_posted_bills -
          selectedRoomFoodBill -
          selectedRoomPoolBill -
          selectedRoomGymBill
      );
      const new_total_paid_amount =
        checkout?.data?.booking_info?.total_balance > pBill
          ? checkout?.data?.booking_info?.paid_amount
          : initialPaidAmount;
      const new_total_balance =
        checkout?.data?.booking_info?.total_balance > pBill
          ? checkout?.data?.booking_info?.total_balance - pBill
          : checkout?.data?.booking_info?.total_balance +
            Number(paymentList[0].amount) -
            pBill;

      const paid_amount =
        calculateBalance < 0 ? Number(paymentList[0]?.amount) : 0;
      const balance_refunded =
        totalRefund > 0 && checkout?.data?.booking_info?.room_ids?.length === 1
          ? totalRefund
          : 0;

      const balance_deducted =
        checkout?.data?.booking_info?.total_balance > pBill
          ? pBill
          : checkout?.data?.booking_info?.total_balance;
      if (
        calculateBalance < 0 &&
        (paymentList[0]?.method === "Card" ||
          paymentList[0]?.method === "Mobile_Banking") &&
        paymentList[0]?.trx === ""
      ) {
        setTrxError(true);
        setCheckOutLoading(false);
        return;
      } else {
        const invoice = Math.floor(Math.random() * 9000000000) + 1000000000;
        setInvoiceNumber(`${invoice}`);
        const saveCheckoutInfoObj = {
          room_id: room_Ids,
          hotel_id: hotel_id,
          booking_info_id: booking_info_id,
          booking_id: bookingId,
          food_order_ids: food_order_ids,
          pool_bill_ids: pool_bill_ids,
          gym_bill_ids: gym_bill_ids,
          guestName: guestName,
          address: address,
          mobileNumber: mobileNumber,
          emergency_contact: emergency_contact,
          adult: adult,
          children: children,
          bookingMethod: checkout?.data?.booking_info?.bookingMethod
            ? checkout?.data?.booking_info?.bookingMethod
            : "Offline",
          total_rent: calculateTotalRent,
          room_discount: room_discount,
          total_rent_after_dis: selectedRoomAmountAfterDiscount,
          total_posted_bills: total_posted_bills,
          room_posted_bills: roomPostedBill,
          total_tax: texAmount,
          total_additional_charges: additionalCharge,
          total_service_charges: serviceCharge,
          total_payable_amount: totalPayableAmount,
          paid_amount: paid_amount,
          total_unpaid_amount: initialUnpaidAmount,
          total_balance: new_total_balance,
          refunded_amount: balance_refunded,
          deleted: false,
          nationality: nationality,
          doc_number: doc_number,
          from: checkout?.data?.room_bookings[0]?.from,
          checkin_date: checkin_date,
          to: toDate,
          no_of_days: calculateNOD,
          rent_per_day: checkout?.data?.room_bookings[0]?.rent_per_day,
          total_room_rent: new_total_room_rent,
          total_additional_charge_comment: additionalChargeComment,
        };
        setSaveCheckoutDataOj(saveCheckoutInfoObj);
        const response = await addCheckout({
          booking_id: bookingId,
          new_total_room_rent,
          new_no_of_days: calculateNOD,
          to: toDate,
          new_total_rent: calculateTotalRent,
          new_total_rent_after_dis: calculateAmountAfterDis,
          new_total_posted_bills,
          new_total_payable_amount: totalPayableAmount,
          new_total_paid_amount,
          new_total_unpaid_amount: initialUnpaidAmount,
          new_total_balance,
          new_total_tax: checkout?.data?.booking_info?.total_tax + texAmount,
          new_total_additional_charges:
            checkout?.data?.booking_info?.total_additional_charges +
            additionalCharge,
          new_total_service_charges:
            checkout?.data?.booking_info?.total_service_charges + serviceCharge,
          balance_refunded,
          balance_deducted,
          guestName: checkout?.data?.booking_info?.guestName,
          room_numbers,
          payment_method: paymentList[0].method
            ? paymentList[0].method
            : "Cash",

          tran_id: paymentList[0].trx ? paymentList[0].trx : "",
          checked_in: checkin_date,
          checked_out: toDate,
          paid_amount,
          total_checkout_bills: pBill,
          restaurant_income: selectedRoomFoodBill,
          room_rent_after_dis: calculateAmountAfterDis,
          room_poolBills: selectedRoomPoolBill,
          room_gymBills: selectedRoomGymBill,
        });
        if (response?.error) {
          toast.error(response.error.data.message);
          setCheckOutLoading(false);
        } else {
          setTrxError(false);
          toast.success("Checkout Successful");

          // navigate("/dashboard/checkout");
          if (
            totalRefund > 0 &&
            checkout?.data?.booking_info?.room_ids?.length === 1
          ) {
            window.refundPayment.showModal();
          } else {
            const response = addCheckoutData({
              ...saveCheckoutInfoObj,
              invoice_no: `${invoice}`,
            });
            if (response?.error) {
              toast.error(response.error.data.message);
            } else {
              dispatch(clearCheckoutCalSlice());
              setCheckOutLoading(false);
              handlePrint();
              // toast.success(response?.success?.data.message);
            }
          }
        }
      }
    },
  });

  const { data: rooms } = useRoomsQuery({
    cp: "0",
    filter: "",
    search: "",
    limit: 1000000,
  });

  const roomIds = [];
  roomIds.push(formik.values.roomNumber);

  const handleGetRooms = () => {
    getCheckout({ room_ids: roomIds });
    setFetch(formik.values.roomNumber);
    setShowRooms(true);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };
  const updateNodFun = (toDate) => {
    const targetDate = new Date(toDate);
    const targetHours = targetDate.getHours();
    const targetMinute = targetDate.getMinutes();

    const updatedNod = Math.ceil(
      Math.abs(
        new Date(checkout?.data?.room_bookings[0]?.from) - new Date(toDate)
      ) /
        (24 * 60 * 60 * 1000)
    );

    dispatch(
      setCalculateNOD(
        targetHours === 12 && targetMinute <= 30 && updatedNod > 1
          ? updatedNod - 1
          : updatedNod
      )
    );
  };

  const updateCheckoutTime = () => {
    const updatedToDate = getConvertedIndiaLocalDate();
    dispatch(setToDate(updatedToDate));
    updateNodFun(updatedToDate);
  };
  const transformedRooms = rooms?.data?.docs
    ?.filter((room) => room.status === "CheckedIn")
    ?.map((room) => ({
      value: room._id,
      label: `${room.roomNumber} - ${room.category}`,
    }));
  useEffect(() => {
    if (roomFromQuery?.length) {
      getCheckout({ room_ids: roomFromQuery });
      setShowRooms(true);
    }
  }, [roomFromQuery]);
  useEffect(() => {
    dispatch(clearAddOrderSlice());
    dispatch(clearCheckoutCalSlice());
  }, [fetch]);
  // set subtotal amount
  useEffect(() => {
    if (isSuccess) {
      dispatch(updateSubTotal(totalBilling));
      updateCheckoutTime();
      dispatch(setFromDate(checkout?.data?.room_bookings[0]?.from));
      dispatch(setBookingInfo(checkout?.data?.booking_info));
      dispatch(setCalculateTotalRent(checkout?.data?.booking_info?.total_rent));
      dispatch(
        setCalculateAmountAfterDis(
          checkout?.data?.booking_info?.total_rent_after_dis
        )
      );

      dispatch(
        setCalculatePayableAmount(
          checkout?.data?.booking_info?.total_payable_amount
        )
      );
      dispatch(
        setCalculateUnpaidAmount(
          checkout?.data?.booking_info?.total_unpaid_amount
        )
      );
      dispatch(setRoomInfo(checkout?.data?.room_bookings[0]));
      dispatch(
        setRefundAmount(
          checkout?.data?.booking_info?.total_unpaid_amount < 1
            ? Math.ceil(
                checkout?.data?.booking_info?.paid_amount -
                  checkout?.data?.booking_info?.total_payable_amount
              )
            : 0
        )
      );
    }
  }, [checkout, hotelInfo]);
  useEffect(() => {
    setPaymentList([{ method: "", amount: "", trx: "", date: "" }]);
    dispatch(setCalculateCollectedAmount(0));
  }, [pBill]);
  useEffect(() => {
    setTrxError(false);
  }, [paymentList[0].trx]);

  return (
    <div className="space-y-8">
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
        <h1>Check-Out</h1>
      </div>
      <div className="max-w-3xl mx-auto gap-5 items-center justify-center flex flex-col md:flex-row">
        <div className="">
          <Select
            placeholder="Select room"
            name={`roomNumber`}
            defaultValue={formik.values.roomNumber}
            options={transformedRooms}
            filterOption={customFilterOption}
            isSearchable
            onChange={(e) => formik.setFieldValue("roomNumber", e.value)}
            noOptionsMessage={() => "No room available"}
            classNames={{
              control: (state) =>
                `!input !input-md !h-auto !min-h-[3rem] min-w-[20rem] !input-bordered !bg-transparent !rounded !w-full !border-gray-500/50 focus-within:!outline-none ${
                  state.isFocused ? "!shadow-none" : ""
                }`,
              valueContainer: () => "!p-0",
              placeholder: () => "!m-0",
            }}
          />
        </div>
        <button
          onClick={handleGetRooms}
          className={`btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case ${
            !formik.values.roomNumber ? "btn-disabled" : ""
          }`}
        >
          Go
          {isLoading ? (
            <span
              className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
              role="status"
            ></span>
          ) : null}
        </button>
        <button
          onClick={handleResetCheckout}
          className={`btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case ${
            !formik.values.roomNumber ? "btn-disabled" : ""
          }`}
        >
          {" "}
          <BiReset className="text-xl text-white mb-1" /> Reset
        </button>
      </div>

      {/* Customer Info and Set them to default */}
      {showRooms && checkout && isHotelSuccess ? (
        <>
          <div>
            <CustomerInfoSection data={checkout?.data?.booking_info} />
            {checkout?.data?.room_bookings?.length
              ? checkout?.data?.room_bookings?.map((roomInfo, i) => (
                  <RoomDetailsSection
                    roomData={roomInfo}
                    data={roomInfo}
                    key={i}
                    bookingInfo={checkout?.data?.booking_info}
                  />
                ))
              : null}
            <div className="my-5">
              <BillingSection
                data={checkout?.data}
                setComment={setComment}
                totalBilling={totalBilling}
                setTotalBilling={setTotalBilling}
                setPBill={setPBill}
              />
            </div>
            <PaymentSection
              invoiceNumber={invoiceNumber}
              data={checkout?.data?.booking_info}
              paymentList={paymentList}
              setPaymentList={setPaymentList}
              pBill={pBill}
              formik={formik}
              hotelInfo={hotelInfo}
              isHotelSuccess={isHotelSuccess}
              roomData={checkout?.data?.room_bookings}
              addCheckOutLoading={addCheckOutLoading}
              totalPayableAmount={totalPayableAmount}
              totalRefund={totalRefund}
              componentRef={componentRef}
              trxError={trxError}
            />
            <Modal id={`refundPayment`}>
              <RefundPaymentModal
                totalRefund={totalRefund}
                data={checkout?.data?.booking_info}
                handlePrintOpen={handlePrint}
                saveCheckoutDataObj={{
                  ...saveCheckoutDataObj,
                  invoice_no: invoiceNumber,
                }}
                setCheckOutLoading={setCheckOutLoading}
              />
            </Modal>
          </div>
        </>
      ) : (
        <p className="hidden lg:flex absolute top-[50%] left-[54%]">
          {" "}
          "Please select the room"
        </p>
      )}
    </div>
  );
};

export default CheckOut;
