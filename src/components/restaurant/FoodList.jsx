import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaMinus,
  FaMinusCircle,
  FaPlus,
  FaPlusCircle,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  delOrder,
  manipulateQuantity,
  removeAction,
  setOrderCalc,
  setQuantity,
} from "../../redux/add-order/addOrderSlice.js";
import Swal from "sweetalert2";
import { useDeleteFoodMutation } from "../../redux/restaurant/foodAPI.js";
import { useNavigate } from "react-router-dom";
import { handleImageUrl } from "../../utils/utils.js";

const FoodList = ({ idx, food, handleOrder, reset, setReset }) => {

  const navigate = useNavigate();
  const [isAdd, setAdd] = useState(false);
  const { order } = useSelector((store) => store.addOrderSlice);
  const dispatch = useDispatch();
  const [deleteFood] = useDeleteFoodMutation();
  const [input, setInput] = useState(1);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Food will be delete.",
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
          deleteFood(id);
        });
      }
    });
  };

  useEffect(() => {
    const findFoodIdx = order?.foods?.findIndex(
      (item) => item?._id === food?._id
    );

    if (findFoodIdx !== -1) setAdd(true);
    else setAdd(false);
  }, [order.foods]);

  useEffect(() => {
    dispatch(manipulateQuantity({ food, quantity: input }));
    setOrderCalc && dispatch(setOrderCalc());
  }, [input]);

  // useEffect(()=>{
  //   dispatch(removeAction())
  // },[])

  useEffect(() => {
    if (reset) {
      setInput(1);
      setReset(false);
    }
  }, [reset]);

  return (
    <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-16 h-16">
              <img src={handleImageUrl(food?.images[0])} alt="" />
            </div>
          </div>
          <div>
            <div className="font-bold">{food?.food_name}</div>
          </div>
        </div>
      </td>
      <td>
        {food?.status === "Available" ? (
          <div className="badge min-w-[7rem] bg-green-slimy border-green-slimy text-white">
            Available
          </div>
        ) : (
          <div className="badge min-w-[7rem] bg-red-600 border-red-600 text-white">
            Unavailable
          </div>
        )}
      </td>
      <td>{food?.serveyor_quantity}</td>
      <td>{food?.price}</td>
      <td className="flex gap-1">
        <button
          type="button"
          className={input === 1 ? "btn-disabled opacity-50" : ""}
          onClick={() => {
            input > 1 ? setInput((prevState) => --prevState) : null;
          }}
        >
          <FaMinus />
        </button>
        <input
          onWheel={(event) => event.currentTarget.blur()}
          type="number"
          value={input}
          className="input-hide_Arrows w-12 flex outline-none text-center rounded-md p-1 placeholder:text-black border focus:border-green-slimy"
          onChange={(e) => {
            if (e.target.value > 0 || e.target.value === "")
              setInput(e.target.value);
          }}
          // onBlur={(e) => {
          //   dispatch(setQuantity({ food, quantity: +e.target.value }));
          // }}
          disabled={food?.status === "Unavailable"}
        />
        <button
          type="button"
          onClick={() => setInput((prevState) => ++prevState)}
        >
          <FaPlus />
        </button>
      </td>
      <td className={`text-center`}>
        {!isAdd ? (
          <span
            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case 
            ${food?.status === "Unavailable" ? "btn-disabled" : ""}
            `}
            title={`Add`}
            onClick={() => {
              handleOrder({ food, input });
            }}
          >
            <FaPlusCircle />
          </span>
        ) : (
          <span
            className={`btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 rounded normal-case`}
            title={`Remove`}
            onClick={() => {
              dispatch(delOrder(food));
              dispatch(removeAction({ quantity: input, price: food?.price }));
            }}
          >
            <FaMinusCircle />
          </span>
        )}
      </td>
      <th className={`flex gap-1.5 mt-3.5`}>
        <span
          className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
          onClick={() => navigate(`/dashboard/edit-food/${food._id}`)}
          title={`Edit`}
        >
          <FaEdit />
        </span>
        <span
          className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
          title={`Delete`}
          onClick={() => handleDelete(food._id)}
        >
          <FaTrash />
        </span>
      </th>
    </tr>
  );
};

export default FoodList;
