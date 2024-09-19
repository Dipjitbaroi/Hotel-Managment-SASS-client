import React, { useEffect, useState } from "react";
import { delOrder } from "../../redux/inventory/inventorySlice.js";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";

const COItem = ({ idx, food }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    setInput(food.quantity);
  }, [refetch]);

  return (
    <tr key={idx}>
      <th>{++idx}</th>
      <td>{food.name}</td>
      <td>
        <button
          type="button"
          className="text-red-600 hover:text-red-400 transition-colors duration-500"
          onClick={() => {
            dispatch(delOrder(food));
          }}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default COItem;
