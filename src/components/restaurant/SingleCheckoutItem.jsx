import { useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

const SingleCheckoutItem = ({
  showDelete = true,
  item,
  handleDeleteItems,
  index,
}) => {
  
  return (
    <tr>
      <td>{item?.item}</td>
      <td>{item?.serveyor_quantity}</td>

      <td className="flex gap-3 mb-4">{item.quantity}</td>
      {/* <td>{food.quantity * food.price}</td> */}
      <td>{item.price}</td>
      <td>{item.total}</td>
      {showDelete?<td>
        <button
          onClick={() => {
            handleDeleteItems(index,item);
          }}
          type="button"
          className="text-red-600 hover:text-red-400 transition-colors duration-500"
        >
          <FaTrash />
        </button>
      </td>:null}
    </tr>
  );
};

export default SingleCheckoutItem;
