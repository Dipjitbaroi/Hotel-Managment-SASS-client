import React from "react";

const RoomRentDetails = () => {
  return (
    <section className="bg-white p-4 rounded">
      <div className="text-2xl font-semibold text-center mt-3 mb-3">
        Room Rent List
      </div>
      <table className="w-full border border-black/20 text-sm">
        <tbody>
          <tr className="grid grid-cols-3 text-left">
          

            <td className="col-span-7 p-1 overflow-x-auto">
              <table className="bg-[#e5e7eb] w-full">
                <tbody>
                  <tr>
                    <td className="p-2 border border-black/20 align-bottom font-medium text-center">
                      Rent Per Day
                    </td>

                    <td className="p-2 border border-black/20 align-bottom font-medium text-center">
                      Discount
                    </td>
                    <td className="p-2 border border-black/20 align-bottom font-medium text-center">
                      Amount / Advanced Amoun
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td className="p-2 border border-black/20 align-top text-xs text-center">
                      {/* {new Date(data?.[0]?.from).toLocaleDateString()} */}
                      3000
                    </td>
                    <td className="p-2 border border-black/20 align-top text-xs text-center">
                      {/* {new Date(data?.[0]?.to).toLocaleDateString()} */}2500
                    </td>
                    <td className="p-2 border border-black/20 align-top text-xs text-center">
                      {/* {data?.[0]?.no_of_days} */}
                      2100
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default RoomRentDetails;
