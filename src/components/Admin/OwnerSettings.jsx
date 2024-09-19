import { useFormik } from "formik";
import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useUpdateLicenseStatusMutation } from "../../redux/admin/sls/slsAPI.js";
import { convertedEndDate, convertedStartDate } from "../../utils/timeZone.js";

// form validation
const validationSchema = yup.object({
  remarks: yup.string().when(["status"], ([status], schema) => {
    if (status !== "active") {
      return schema.when([], {
        is: (remarks) => remarks && remarks.length > 0,
        then: yup.string().required("Remarks is required"),
      });
    } else return schema;
  }),
  fromDate: yup.string().when(["status"], ([status], schema) => {
    if (status === "Suspend") return schema.required("From date is required");
    else return schema;
  }),
  toDate: yup.string().when(["status"], ([status], schema) => {
    if (status === "Suspend") return schema.required("To date is required");
    else return schema;
  }),
});

const OwnerSettings = ({ owner }) => {
  const closeRef = useRef(null);
  const [updateLicenseStatus, { isLoading }] = useUpdateLicenseStatusMutation();
  const formik = useFormik({
    initialValues: {
      status: "",
      remarks: "",
      fromDate: "",
      toDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const obj = { ...values };
      const { status, remarks: remark, fromDate: from, toDate: to } = obj;

      const response = await updateLicenseStatus({
        user_id: owner?.id,
        status,
        extended_time: [
          ...owner.extended_time,
          {
            from: from ? convertedStartDate(from) : "",
            to: to ? convertedEndDate(to) : "",
          },
        ],
        new_extended_time: {
          from: from ? convertedStartDate(from) : "",
          to: to ? convertedEndDate(to) : "",
        },
        remark,
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        closeRef.current.click();
        toast.success(response.data.message);
      }
    },
  });

  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          ref={closeRef}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            formik.handleReset();
          }}
        >
          x
        </button>
      </form>
      <div>
        <h3 className={`text-2xl font-semibold mb-3`}>Change Status</h3>
        <hr />
        <form
          autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 mt-5"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col gap-3">
            <select
              name="status"
              className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" selected disabled>
                {owner?.status}
              </option>
              {owner?.status === "Active" ? (
                <option value="Deactive">Deactivate</option>
              ) : null}
              {owner?.status === "Deleted" || owner?.status === "Deactive" ? (
                <option value="Active">Activate</option>
              ) : null}
              {owner?.status === "Suspended" ? (
                <option value="Renew">Renew</option>
              ) : null}
              {owner?.status === "Expired" ? (
                <>
                  <option value="Renew">Renew</option>
                  <option value="Suspended">Suspend</option>
                </>
              ) : null}
            </select>
          </div>
          {formik.values.status === "Renew" ? (
            <Link
              to={`/dashboard/edit-renew/${owner?.id}`}
              className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
            >
              Go to Renew
            </Link>
          ) : null}
          {formik.values.status === "Active" ||
          formik.values.status === "Deactive" ? (
            <>
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
                disabled={isLoading}
                type={"submit"}
                className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
              >
                <span>Confirm</span>
                {isLoading ? (
                  <span
                    className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                    role="status"
                  ></span>
                ) : null}
              </button>
            </>
          ) : null}
          {formik.values.status === "Suspended" ? (
            <>
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
              {/* From box */}
              <div className="flex flex-col gap-3">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  name="fromDate"
                  placeholderText={`From`}
                  selected={formik.values.fromDate}
                  className={`input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full`}
                  onChange={(date) => formik.setFieldValue("fromDate", date)}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fromDate && Boolean(formik.errors.fromDate) ? (
                  <small className="text-red-600">
                    {formik.touched.fromDate && formik.errors.fromDate}
                  </small>
                ) : null}
              </div>
              {/* To box */}
              <div className="flex flex-col gap-3">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  name="toDate"
                  placeholderText={`To`}
                  selected={formik.values.toDate}
                  className={`input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full`}
                  onChange={(date) => formik.setFieldValue("toDate", date)}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.toDate && Boolean(formik.errors.toDate) ? (
                  <small className="text-red-600">
                    {formik.touched.toDate && formik.errors.toDate}
                  </small>
                ) : null}
              </div>
              <button
                disabled={isLoading}
                type={"submit"}
                className="btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
              >
                <span>Confirm</span>
                {isLoading ? (
                  <span
                    className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                    role="status"
                  ></span>
                ) : null}
              </button>
            </>
          ) : null}
        </form>
      </div>
    </>
  );
};

export default OwnerSettings;
