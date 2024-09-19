import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

// form validation
const validationSchema = yup.object({
  password: yup.string().required("Password is required"),
  status: yup.string().required("Status is required"),
  branchName: yup.string().when(["status"], ([status], schema) => {
    if (status == "transfer")
      return schema.required("Branch Name is required");
    else return schema;
  }),
  remarks: yup.string().when(["status"], ([status],
     schema) => {
    if (status !== "induty") return schema.required("Feedback is required");
    else return schema;
  }),
});

const StatusSettings = () => {
  const formik = useFormik({
    initialValues: {
      status: "",
      branchName:"",
      password: "",
      remarks: "",
    },
    validationSchema,
    onSubmit: (values) => {
    },
  });

  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => formik.handleReset()}
        >
          ✕
        </button>
      </form>
      <div>
        <h3 className={`text-2xl font-semibold mb-3`}>Change Status</h3>
        <hr />
        <form autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 mt-5"
          onSubmit={formik.handleSubmit}
        >
          {/* <div className="flex flex-col gap-3">
            <select
              name="status"
              className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="locked">Locked</option>
            </select>
          </div> */}
               <div className="flex flex-col gap-3">
          <select
            name="status"
            className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" selected disabled>
              Status
            </option>
            <option value="induty">InDuty</option>
            <option value="transfer">Transfer</option>
            <option value="resign">Resign</option>
          </select>
          {formik.touched.status &&
          Boolean(formik.errors.status) ? (
            <small className="text-red-600">
              {formik.touched.status && formik.errors.status}
            </small>
          ) : null}
        </div>
        {formik.values.status &&
        formik.values.status == "transfer" ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Branch Name"
              name="branchName"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.branchName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.branchName && Boolean(formik.errors.branchName) ? (
              <small className="text-red-600">
                {formik.touched.branchName && formik.errors.branchName}
              </small>
            ) : null}
          </div>
        ) : null}

        {/* password box */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter password"
              name="password"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && Boolean(formik.errors.password) ? (
              <small className="text-red-600">
                {formik.touched.password && formik.errors.password}
              </small>
            ) : null}
          </div>

          {/* remark box */}
          <div className="flex flex-col gap-3">
            <textarea
              placeholder="Remarks"
              name="remarks"
              className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
              value={formik.values.remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.remarks && Boolean(formik.errors.remarks) ? (
              <small className="text-red-600">
                {formik.touched.remarks && formik.errors.remarks}
              </small>
            ) : null}
          </div>
          <button
            type={"submit"}
            className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
          >
            Confirm
          </button>
        </form>
      </div>
    </>
  );
};

export default StatusSettings;
