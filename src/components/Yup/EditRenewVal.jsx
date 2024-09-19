import * as yup from "yup";

export const validationSchema = yup.object({
  fromDate: yup.string().required("From date is required"),
  toDate: yup.string().required("To date is required"),
  // status: yup.string().required("Status is required"),
  // paymentFor: yup.string().required("Payment for is required"),
  paymentMethod: yup.string().required("Payment method is required"),
  trxID: yup.string().when(["paymentMethod"], ([paymentMethod], schema) => {
    if (paymentMethod !== "Cash")
      return schema.required("Transaction ID is required");
    else return schema;
  }),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be a positive number")
    .integer("Amount must be an integer"),
  remarks: yup.string().when([], {
    is: (remarks) => remarks && remarks.length > 0,
    then: yup.string().required("Remarks is required"),
  }),
});
