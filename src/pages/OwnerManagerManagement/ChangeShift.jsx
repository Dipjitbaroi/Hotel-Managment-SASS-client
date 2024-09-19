import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useFormik } from "formik";
import { AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai";

const ChangeShift = () => {
  const animatedComponents = makeAnimated();

  const [paymentList, setPaymentList] = useState(1);
  const [selectCashPayment, setSelectCashPayment] = useState(true);
  const [checkoutBtn, setCheckoutBtn] = useState(true);
  const [remainAmount, setRemainAmount] = useState(5493.0);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(collectedAmount);

  const formik = useFormik({
    initialValues: {
      startDate: "",
    },
  });

  const paymentModeList = [
    { value: "null", label: "Jobber" },
    { value: "akber", label: "Akber" },
    { value: "josim", label: "Josim" },
    { value: "namir", label: "Namir " },
  ];

  // BackDoor -----> After adding more than 1 payment method all filed are using same state...
  const handlePaymentMode = (e) => {
    let value = e.value;

    if (value === "Mobile Banking") {
      setSelectCashPayment(false);
    } else if (value === "Cash Payment" || value === "null") {
      setSelectCashPayment(true);
    } else {
      setSelectCashPayment(false);
    }
  };

  const handleAmount = (e) => {
    const parseValue = parseFloat(e.target.value);
    const fixedValue = parseValue.toFixed(2);
    const value = parseFloat(fixedValue);
    setCollectedAmount(value);
    setChangeAmount(value - remainAmount);

    if (value >= remainAmount) {
      setCheckoutBtn(false);
    } else {
      setCheckoutBtn(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  return (
    <section>
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left Side */}
        <div className="bg-white rounded">
        

{/* bill statement */}
          <h3 className="p-5 text-xl mt-5">Change Shift</h3>
          <hr />
          <div className="grid grid-cols-7 gap-2 p-5">
            <div className="col-span-4 space-y-5">
              <div className="border-b border-black/20 py-1 mb-5">
                Manager
              </div>
              {[...Array(paymentList)].map((_, index) => (
                <React.Fragment key={index}>
                  <div>
                    <Select
                      components={animatedComponents}
                      options={paymentModeList}
                      onKeyDown={handleKeyDown}
                      onChange={handlePaymentMode}
                      placeholder="Manage Name"
                      className={`text-xs ${selectCashPayment && "mb-[70px]"}`}
                    />
                  </div>
                  <div>
                    {!selectCashPayment && (
                      <input
                      onWheel={ event => event.currentTarget.blur() }
                        type="number"
                        required
                        placeholder="Transaction ID"
                        className={`hide-number-arrow-input input-hide_Arrows w-full outline-none border focus:border-green-slimy rounded mr-1 p-1 text-slate-500`}
                      />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="col-span-2 space-y-5">
              <div className="border-b border-black/20 py-1 mb-5">Amount</div>
              {[...Array(paymentList)].map((_, index) => (
                <React.Fragment key={index}>
                  <div>
                    <input
                    onWheel={ event => event.currentTarget.blur() }
                      type="number"
                      required
                      placeholder="Amount"
                      onChange={handleAmount}
                      className={`w-full outline-none border focus:border-green-slimy rounded mr-1 p-1 text-slate-500 hide-number-arrow-input`}
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      name={`startDate`}
                      className={`input input-sm input-bordered rounded focus:outline-none w-full mt-1`}
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="col-span-1 text-center">
              <div className="border-b border-black/20 py-1 mb-5">Action</div>
              {[...Array(paymentList)].map((_, index) => (
                <button
                  key={index}
                  disabled={paymentList === 1}
                  onClick={() => setPaymentList((prev) => prev - 1)}
                  className={`mb-20 ${
                    paymentList === 1 && "opacity-40"
                  } border border-green-slimy hover:bg-green-slimy text-green-slimy hover:text-white duration-300 text-xl p-1 rounded w-fit`}
                >
                  <AiOutlineCloseCircle />
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 flex justify-end">
            <button
              onClick={() => setPaymentList((prev) => prev + 1)}
              disabled={paymentList === 3}
              className={`border border-green-slimy hover:bg-green-slimy text-3xl text-green-slimy hover:text-white duration-300 rounded ${
                paymentList === 3 && "opacity-40"
              }`}
            >
              <AiOutlinePlus />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangeShift;
