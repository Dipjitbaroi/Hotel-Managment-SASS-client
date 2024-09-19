import React from "react";

const PaymentMethodPrint = ({ paymentList }) => {
  return (
    <div>
      {paymentList?.length && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border">
            <thead>
              {paymentList?.map((method, index) => (
                <tr key={index} className=" text-center">
                  {method?.method && <td className=" border py-2">Method</td>}
                  {method?.amount && (
                    <td className="border px-4 py-2">Amount</td>
                  )}
                  {method?.trx && <td className=" border px-4 py-2">Trx</td>}
                  {method?.date && <td className="border px-4 py-2">Date </td>}
                </tr>
              ))}
            </thead>
            <tbody>
              {paymentList &&
                paymentList?.map((method, index) => (
                  <tr key={index} className="bg-white text-center">
                    <td className="border px-4 py-2">{method?.method}</td>
                    <td className="border px-4 py-2">{method?.amount}</td>
                    {method?.trx && (
                      <td className="border px-4 py-2">{method?.trx}</td>
                    )}
                    {method?.date && (
                      <td className="border px-4 py-2">
                        {new Date(method?.date).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodPrint;
