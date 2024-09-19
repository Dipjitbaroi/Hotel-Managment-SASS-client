import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup.string().required("Client name is required"),
  username: yup
    .string()
    .required("Client username is required")
    .matches(
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      "Client name must start with a character and can include characters and numbers"
    ),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Client password is required"),
  address: yup.string().required("Client address is required"),
  phoneNumber: yup
    .string()
    .required("Client phone is required")
    .matches(
      /^(\+\d+|\d+)$/,
      "Client phone must start with a '+' or be numeric"
    ),
  emerContact: yup
    .string()
    .required("Emergency contact is required")
    .matches(
      /^(\+\d+|\d+)$/,
      "Emergency contact must start with a '+' or be numeric"
    ),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Client email is required"),
  billInformation: yup.string().required("Client bill info is required"),
  fromDate: yup.date().required("From Date is required"),
  toDate: yup.date().required("To Date is required"),
  numberOfHotel: yup
    .number()
    .required("Hotel limits are required")
    .positive("Hotel limits must be a positive number")
    .integer("Hotel limits must be an integer"),

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
  // documentsType: yup.string().required("Type of documents are required"),
  // documents: yup.mixed().when(["documentsType"], ([documentsType], schema) => {
  //   if (documentsType) return schema.required(`${documentsType} are required`);
  //   else return schema;
  // }),
  utilities: yup.string().required("Utilities are required"),
  tradeLicenses: yup.string().required("Trade licenses are required"),
  panCard: yup.string().required("Pan card are required"),
  remarks: yup
    .string()
    .matches(
      /^[a-zA-Z][a-zA-Z0-9\s]*$/,
      "Remarks must start with a character and can include characters and numbers"
    )
    .when([], {
      is: (remarks) => remarks && remarks.length > 0,
      then: yup.string().required("Remarks is required"),
    }),
});
