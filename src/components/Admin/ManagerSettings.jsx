import { useFormik } from "formik";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useUpdateLicenseStatusMutation } from "../../redux/admin/sls/slsAPI.js";

// form validation
const validationSchema = yup.object({
  remarks: yup.string().when(["status"], ([status], schema) => {
    if (status !== "active") return schema.required("Remarks is required");
    else return schema;
  }),
});

const ManagerSettings = ({ owner }) => {
  const navigate = useNavigate();
  const closeRef = useRef(null);
  const [updateLicenseStatus, { isLoading }] = useUpdateLicenseStatusMutation();
  const formik = useFormik({
    initialValues: {
      remarks: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const obj = { ...values };
      const { remarks: remark } = obj;

      const response = await updateLicenseStatus({
        user_id: owner?.id,
        status:
          owner?.status === "Deactive" || owner?.status === "Deleted"
            ? "Active"
            : owner?.status === "Active"
            ? "Deactive"
            : null,
        extended_time: [
          {
            from: "",
            to: "",
          },
        ],
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
        <h3 className={`text-2xl font-semibold mb-3`}>
          Change Status to{" "}
          {owner?.status === "Deactive" || owner?.status === "Deleted" ? (
            <span className={`text-green-500`}>In Duty</span>
          ) : owner?.status === "Active" ? (
            <span className={`text-red-500`}>Resign</span>
          ) : null}
        </h3>
        <hr />
        <form
          autoComplete="off"
          className="form-control grid grid-cols-1 gap-4 mt-5"
          onSubmit={formik.handleSubmit}
        >
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
            <span>Confirm</span>
            {isLoading ? (
              <span
                className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                role="status"
              ></span>
            ) : null}
          </button>
        </form>
      </div>
    </>
  );
};

export default ManagerSettings;
