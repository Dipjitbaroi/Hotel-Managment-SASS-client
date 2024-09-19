import React from "react";
import { useSelector } from "react-redux";
import COIBarItem from "./COIBarItem";


const ConfirmOrderBar = ({formik}) => {
  const { order, orderCalc } = useSelector((store) => store.addOrderSlice);

  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>

      <div>
        <h3 className={`text-2xl font-semibold mb-3`}>Confirm Order</h3>
        <hr />
        {order.foods.length ? (
          <div className="overflow-x-auto w-full mt-10">
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.foods.map((food, idx) => (
                  <COIBarItem key={idx} idx={idx} food={food} />
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

export default ConfirmOrderBar;
