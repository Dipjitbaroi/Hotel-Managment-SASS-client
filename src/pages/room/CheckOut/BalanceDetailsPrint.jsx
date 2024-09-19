import React from "react";

const BalanceDetailsPrint = ({ pBill, colAmount }) => {
  return (
    <div>
      <div className="bg-white rounded">
        <div className=" grid grid-cols-2 items-center text-sm font-semibold">
          <div className="space-y-3">
            <p>Remain Amount</p>
            <p>Collected Amount</p>
            <p>Change Amount</p>
          </div>
          <div className="space-y-3 space-x-4">
            <p className="ml-4">
              {pBill > colAmount ? Math.abs(Math.ceil(pBill - colAmount)) : 0}
            </p>
            <p>{colAmount}</p>
            <p>
              {pBill < colAmount ? Math.abs(Math.ceil(pBill - colAmount)) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceDetailsPrint;
