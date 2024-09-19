import React, { useEffect, useState } from "react";
import { FaEdit, FaMinusCircle, FaPlusCircle, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { delOrder } from "../../redux/inventory/inventorySlice.js";
import Swal from "sweetalert2";
import { useDeleteFoodMutation } from "../../redux/restaurant/foodAPI.js";
import { useNavigate } from "react-router-dom";
import { useDeleteInventoryMutation } from "../../redux/inventory/inventoryAPI.js";

const InventoryList = ({ idx, list, handleOrder }) => {
  const navigate = useNavigate();
  const [isAdd, setAdd] = useState(false);
  const { order } = useSelector((store) => store.inventorySlice);
  const dispatch = useDispatch();
  const [deleteInventory] = useDeleteInventoryMutation();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Item will be delete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#35bef0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Deleted!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          deleteInventory(id);
        });
      }
    });
  };

  useEffect(() => {
    const findFoodIdx = order.items.findIndex((item) => item._id === list._id);

    if (findFoodIdx !== -1) setAdd(true);
    else setAdd(false);
  }, [order.items]);

  return (
    <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
      <td>
        <div className="font-bold">{list?.name}</div>
      </td>
      <td>
        {list?.status === "Available" ? (
          <div className="badge min-w-[7rem] bg-green-slimy border-green-slimy text-white">
            Available
          </div>
        ) : (
          <div className="badge min-w-[7rem] bg-red-600 border-red-600 text-white">
            Unavailable
          </div>
        )}
      </td>
      <td className={`text-center`}>
        {!isAdd ? (
          <span
            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case ${
              list?.status === "Unavailable" ? "btn-disabled" : ""
            }`}
            title={`Add`}
            onClick={() => {
              handleOrder(list);
            }}
          >
            <FaPlusCircle />
          </span>
        ) : (
          <span
            className={`btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 rounded normal-case`}
            title={`Remove`}
            onClick={() => {
              dispatch(delOrder(list));
            }}
          >
            <FaMinusCircle />
          </span>
        )}
      </td>
      <th className={`flex gap-1.5`}>
        <span
          className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
          onClick={() => navigate(`/dashboard/edit-inventory/${list._id}`)}
          title={`Edit`}
        >
          <FaEdit />
        </span>
        <span
          className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
          title={`Delete`}
          onClick={() => handleDelete(list._id)}
        >
          <FaTrash />
        </span>
      </th>
    </tr>
  );
};

export default InventoryList;
