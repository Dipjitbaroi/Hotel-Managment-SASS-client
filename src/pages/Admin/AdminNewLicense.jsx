import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaPlusCircle,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { TbReplaceFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { validationSchema } from "../../components/Yup/AdminNewLicenseVal.jsx";
import { useAddLicenseMutation } from "../../redux/admin/sls/slsAPI.js";
import { useUploadMutation } from "../../redux/baseAPI.js";
import { Link } from "react-router-dom";
import { convertedEndDate, convertedStartDate } from "../../utils/timeZone.js";
import { getResizedImage } from "../../utils/utils.js";

const AdminNewLicense = () => {
  const [isLoading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [utilitiesFiles, setUtilitiesFiles] = useState([]);
  const [tradeLicensesFiles, setTradeLicensesFiles] = useState([]);
  const [panCardFiles, setPanCardFiles] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);

  const [images, setImages] = useState({});
  const [addLicense] = useAddLicenseMutation();
  const [upload, { isError }] = useUploadMutation();
  const { user } = useSelector((store) => store.authSlice);
  const [showPass, setShowPass] = useState(false);
  const [docTypeCount, setDocTypeCount] = useState(1);

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
      address: "",
      email: "",
      phoneNumber: "",
      emerContact: "",
      billInformation: "",
      fromDate: "",
      toDate: "",
      numberOfHotel: "",
      paymentMethod: "",
      trxID: "",
      amount: "",
      remarks: "",
      utilities: null,
      tradeLicenses: null,
      panCard: null,
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      setLoading(true);

      const obj = { ...values };
      const {
        name,
        username,
        password,
        address,
        email,
        phoneNumber: phone_no,
        emerContact: emergency_contact,
        billInformation: bill_info,
        fromDate: bill_from,
        toDate: bill_to,
        numberOfHotel: maxHotels,
        paymentMethod: payment_method,
        trxID: tran_id,
        amount,
        remarks: remark,
      } = obj;
      const tempImages = {
        trade_lic_img: [],
        utilities: [],
        pancard: [],
      };

      const formData1 = new FormData();
      const formData2 = new FormData();
      const formData3 = new FormData();

      selectedImages.map((selectImage) => {
        if (selectImage.name === "utilities") {
          const photoName = selectImage.file.name.substring(
            0,
            selectImage.file.name.lastIndexOf(".")
          );
          formData1.append(photoName, selectImage.file);
        } else if (selectImage.name === "tradeLicenses") {
          const photoName = selectImage.file.name.substring(
            0,
            selectImage.file.name.lastIndexOf(".")
          );
          formData2.append(photoName, selectImage.file);
        } else if (selectImage.name === "panCard") {
          const photoName = selectImage.file.name.substring(
            0,
            selectImage.file.name.lastIndexOf(".")
          );
          formData3.append(photoName, selectImage.file);
        }
      });

      await upload(formData1).then(
        (result) => (tempImages.utilities = result.data.imageUrls)
      );
      await upload(formData2).then(
        (result) => (tempImages.trade_lic_img = result.data.imageUrls)
      );
      await upload(formData3).then(
        (result) => (tempImages.pancard = result.data.imageUrls)
      );

      if (!isError) {
        const response = await addLicense({
          name,
          username,
          password,
          address,
          email,
          phone_no,
          emergency_contact,
          bill_info,
          bill_from: convertedStartDate(bill_from),
          bill_to: convertedEndDate(bill_to),
          maxHotels,
          payment_method,
          tran_id,
          amount,
          remark,
          images: tempImages,
        });

        if (response?.error) {
          toast.error(response.error.data.message);
        } else {
          toast.success(response.data.message);
          formikHelpers.resetForm();
          setUtilitiesFiles([]);
          setTradeLicensesFiles([]);
          setPanCardFiles([]);
          setSelectedImages([]);
        }
      } else {
        toast.error("Image is not uploaded");
      }

      setLoading(false);
    },
    enableReinitialize: false,
  });
  const handlePaymentChange = (e) => {
    const paymentMethod = e.target.value;
    if (paymentMethod === "Card" || paymentMethod === "Mobile_Banking") {
      formik.setFieldValue("paymentMethod", paymentMethod);
    } else {
      formik.setFieldValue("paymentMethod", paymentMethod);
      formik.setFieldValue("trxID", "");
    }
  };

  const handleDelete = (idx, image) => {
    const tempImgs = [...selectedImages];
    tempImgs.splice(idx, 1);
    if (image.name === "utilities") {
      setUtilitiesFiles((prev) => {
        const prevState = [...prev];
        prevState.splice(image.index, 1);
        return prevState;
      });
    } else if (image.name === "tradeLicenses") {
      setTradeLicensesFiles((prev) => {
        const prevState = [...prev];
        prevState.splice(image.index, 1);
        return prevState;
      });
    } else if (image.name === "panCard") {
      setPanCardFiles((prev) => {
        const prevState = [...prev];
        prevState.splice(image.index, 1);
        return prevState;
      });
    }

    const dataTransfer = new DataTransfer();

    for (const file of tempImgs) {
      dataTransfer.items.add(file.file);
    }

    setSelectedImages(tempImgs);
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
   fileInputRef2.current ? (fileInputRef2.current.value = '') : null;
   fileInputRef3.current ? (fileInputRef3.current.value = '') : null;
  };

  const handleChange = async (idx, newFile, image) => {
    if (newFile) {
      const updatedImages = [...selectedImages];
      const resizedUploadedFile = await getResizedImage(newFile);
      updatedImages.splice(idx, 1, {
        name: image.name,
        file: resizedUploadedFile,
        index: image.index,
      });
      // updatedImages[idx] = newFile;
      if (image.name === "utilities") {
        const updatedUtilitiesImage = [...utilitiesFiles];
        updatedUtilitiesImage.splice(image.index, 1, resizedUploadedFile);
        setUtilitiesFiles(updatedUtilitiesImage);
      } else if (image.name === "tradeLicenses") {
        const updatedTradeLicensesImage = [...tradeLicensesFiles];
        updatedTradeLicensesImage.splice(image.index, 1, resizedUploadedFile);
        setTradeLicensesFiles(updatedTradeLicensesImage);
      } else if (image.name === "panCard") {
        const updatedPanCardImage = [...panCardFiles];
        updatedPanCardImage.splice(image.index, 1, resizedUploadedFile);
        setPanCardFiles(updatedPanCardImage);
      }

      const dataTransfer = new DataTransfer();

      for (const file of updatedImages) {
        dataTransfer.items.add(file.file);
      }

      setSelectedImages(updatedImages);
    }
   fileInputRef.current ? (fileInputRef.current.value = '') : null;
   fileInputRef2.current ? (fileInputRef2.current.value = '') : null;
   fileInputRef3.current ? (fileInputRef3.current.value = '') : null;
  };

  useEffect(() => {
    const updatedUtilities = async () => {
      if (formik.values.utilities?.length) {
        const utilitiesArray = Array.from(formik.values.utilities); //01
        const resizedUploadedFile = await getResizedImage(utilitiesArray[0]);
        const allUtilitiesFiles = [...utilitiesFiles, resizedUploadedFile];
        setUtilitiesFiles(allUtilitiesFiles);

        setSelectedImages((prevFiles) => [
          ...prevFiles,

          ...allUtilitiesFiles
            .filter(
              (file) => !prevFiles.some((prevFile) => prevFile.file === file)
            )
            .map((file, Index) => ({
              name: "utilities",
              file: file,
              Index: allUtilitiesFiles.indexOf(file),
            })),
        ]);
      }
     fileInputRef.current ? (fileInputRef.current.value = '') : null;
     fileInputRef2.current ? (fileInputRef2.current.value = '') : null;
     fileInputRef3.current ? (fileInputRef3.current.value = '') : null;
    };
    updatedUtilities();
  }, [formik.values.utilities]);

  useEffect(() => {
    const updateTradLicense = async () => {
      if (formik.values.tradeLicenses) {
        const tradeLicensesArray = Array.from(formik.values.tradeLicenses);
        const resizedUploadedFile = await getResizedImage(
          tradeLicensesArray[0]
        );
        const allTradeLicenses = [...tradeLicensesFiles, resizedUploadedFile];
        setTradeLicensesFiles(allTradeLicenses);

        const tradeLicensesArrayMap = tradeLicensesArray.map((name, index) => ({
          name: "tradeLicenses",
          Index: index,
          file: name,
        }));

        setSelectedImages((prevFiles) => [
          ...prevFiles,

          ...allTradeLicenses
            .filter(
              (file) => !prevFiles.some((prevFile) => prevFile.file === file)
            )
            .map((file, Index) => ({
              name: "tradeLicenses",
              file: file,
              Index: allTradeLicenses.indexOf(file),
            })),
        ]);
      }
     fileInputRef.current ? (fileInputRef.current.value = '') : null;
     fileInputRef2.current ? (fileInputRef2.current.value = '') : null;
     fileInputRef3.current ? (fileInputRef3.current.value = '') : null;
    };
    updateTradLicense();
  }, [formik.values.tradeLicenses]);

  useEffect(() => {
    const updatePanCard = async () => {
      if (formik.values.panCard) {
        const panCardArray = Array.from(formik.values.panCard);
        const resizedUploadedFile = await getResizedImage(panCardArray[0]);
        const allPanCardFiles = [...panCardFiles, resizedUploadedFile];

        setPanCardFiles(allPanCardFiles);

        const panCardArrayMap = panCardArray.map((name, index) => ({
          name: "panCard",
          Index: index,
          file: name,
        }));

        setSelectedImages((prevFiles) => [
          ...prevFiles,

          ...allPanCardFiles
            .filter(
              (file) => !prevFiles.some((prevFile) => prevFile.file === file)
            )
            .map((file, Index) => ({
              name: "panCard",
              file: file,
              Index: allPanCardFiles.indexOf(file),
            })),
        ]);
      }
     fileInputRef.current ? (fileInputRef.current.value = '') : null;
     fileInputRef2.current ? (fileInputRef2.current.value = '') : null;
     fileInputRef3.current ? (fileInputRef3.current.value = '') : null;
    };
    updatePanCard();
  }, [formik.values.panCard]);

  return (
    <div className={`space-y-10 bg-white p-10 rounded-2xl`}>
      <div>
        <Link to={`/dashboard `}>
          <button
            type="button"
            className="text-white bg-green-slimy  font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1 "
          >
            <dfn>
              <abbr title="Back">
                <FaArrowLeft />
              </abbr>
            </dfn>

            <span className="tracking-wider font-semibold text-[1rem]"></span>
          </button>
        </Link>
      </div>
      <h3
        className={`flex bg-green-slimy text-2xl text-white max-w-3xl mx-auto py-3 px-6 rounded space-x-1.5`}
      >
        <FaPlusCircle />
        <span>New License</span>
      </h3>
      <form
        autoComplete="off"
        className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
        onSubmit={formik.handleSubmit}
      >
        {selectedImages.length ? (
          <div className={`relative col-span-full`}>
            <div className="swiper-controller absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-between w-full px-4 z-10">
              <div className="swiper-er-button-prev flex justify-center items-center bg-green-slimy text-white w-6 h-6 rounded-full cursor-pointer">
                <MdOutlineKeyboardArrowLeft />
              </div>
              <div className="swiper-er-button-next flex justify-center items-center bg-green-slimy text-white w-6 h-6 rounded-full cursor-pointer">
                <MdOutlineKeyboardArrowRight />
              </div>
            </div>
            <Swiper
              modules={[Navigation]}
              navigation={{
                enabled: true,
                prevEl: ".swiper-er-button-prev",
                nextEl: ".swiper-er-button-next",
                disabledClass: "swiper-er-button-disabled",
              }}
              slidesPerView={1}
              spaceBetween={50}
            >
              {selectedImages?.length
                ? selectedImages?.map((image, idx) => {
                    return (
                      <SwiperSlide key={idx} className="h-auto">
                        <div className={`relative h-full`}>
                          <div className={`absolute top-3 right-3 space-x-1.5`}>
                            <label className="relative btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy normal-case rounded">
                              <TbReplaceFilled />
                              <input
                               ref={(el) => (fileInputRef.current = el)}
                                type="file"
                                accept="image/*"
                                className="absolute left-0 top-0  overflow-hidden h-0"
                                onChange={(e) =>
                                  handleChange(
                                    idx,
                                    e.currentTarget.files[0],
                                    image
                                  )
                                }
                              />
                            </label>
                            <button
                              type="button"
                              className="btn btn-sm bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
                              onClick={() => handleDelete(idx, image)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <div className="flex justify-center items-center h-full">
                            <img
                              key={idx}
                              src={URL.createObjectURL(image.file)}
                              alt=""
                              className={`mx-auto max-h-[40em] rounded`}
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })
                : null}
            </Swiper>
          </div>
        ) : null}
        {/*Client name box */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            autoComplete="off"
            placeholder="Client Name"
            name="name"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && Boolean(formik.errors.name) ? (
            <small className="text-red-600">
              {formik.touched.name && formik.errors.name}
            </small>
          ) : null}
        </div>
        {/*Client username box */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Client Username"
            name="username"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && Boolean(formik.errors.username) ? (
            <small className="text-red-600">
              {formik.touched.username && formik.errors.username}
            </small>
          ) : null}
        </div>
        {/*Phone Number box */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Client Phone Number"
            name="phoneNumber"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber) ? (
            <small className="text-red-600">
              {formik.touched.phoneNumber && formik.errors.phoneNumber}
            </small>
          ) : null}
        </div>
        {/*Email box */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Client Email"
            name="email"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && Boolean(formik.errors.email) ? (
            <small className="text-red-600">
              {formik.touched.email && formik.errors.email}
            </small>
          ) : null}
        </div>
        {/*Password box */}
        <div
          className={`flex flex-col gap-3 ${
            (!formik.values.paymentMethod && !formik.values.documentsType) ||
            formik.values.paymentMethod === "Cash"
              ? "col-span-full"
              : ""
          }`}
        >
          <div className={`relative`}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Client Password"
              autoComplete="off"
              name="password"
              className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {showPass ? (
              <span
                className={`absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer`}
                onClick={() => setShowPass(false)}
              >
                <FaEyeSlash />
              </span>
            ) : (
              <span
                className={`absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer`}
                onClick={() => setShowPass(true)}
              >
                <FaEye />
              </span>
            )}
          </div>
          {formik.touched.password && Boolean(formik.errors.password) ? (
            <small className="text-red-600">
              {formik.touched.password && formik.errors.password}
            </small>
          ) : null}
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Emergency Contact"
            name="emerContact"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.emerContact}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.emerContact && Boolean(formik.errors.emerContact) ? (
            <small className="text-red-600">
              {formik.touched.emerContact && formik.errors.emerContact}
            </small>
          ) : null}
        </div>
        {/*Billing Information box */}
        <div className={`flex flex-col gap-3`}>
          <input
            type="text"
            placeholder="Bill Information"
            name="billInformation"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.billInformation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.billInformation &&
          Boolean(formik.errors.billInformation) ? (
            <small className="text-red-600">
              {formik.touched.billInformation && formik.errors.billInformation}
            </small>
          ) : null}
        </div>
        {/*Billing From box */}
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

        {/*Billing To box */}
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

        {/*Number Of Hotels box */}
        <div className="flex flex-col gap-3">
          <input
            onWheel={(event) => event.currentTarget.blur()}
            type="number"
            placeholder="Hotel Limit"
            name="numberOfHotel"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.numberOfHotel}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.numberOfHotel &&
          Boolean(formik.errors.numberOfHotel) ? (
            <small className="text-red-600">
              {formik.touched.numberOfHotel && formik.errors.numberOfHotel}
            </small>
          ) : null}
        </div>

        {/* payment method box */}
        <div className={`flex flex-col gap-3`}>
          <select
            name="paymentMethod"
            className="select select-md bg-transparent select-bordered border-gray-500/50 p-2 rounded w-full focus:outline-none"
            value={formik.values.paymentMethod}
            onChange={handlePaymentChange}
            onBlur={formik.handleBlur}
          >
            <option value="" selected disabled>
              Payment Method
            </option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Mobile_Banking">Mobile Banking</option>
          </select>
          {formik.touched.paymentMethod &&
          Boolean(formik.errors.paymentMethod) ? (
            <small className="text-red-600">
              {formik.touched.paymentMethod && formik.errors.paymentMethod}
            </small>
          ) : null}
        </div>
        {(formik.values.paymentMethod &&
          formik.values.paymentMethod === "Card") ||
        formik.values.paymentMethod == "Mobile_Banking" ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Transaction ID"
              name="trxID"
              className="input input-md input-bordered bg-transparent rounded w-full border-gray-500/50 focus:outline-none p-2"
              value={formik.values.trxID}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.trxID && Boolean(formik.errors.trxID) ? (
              <small className="text-red-600">
                {formik.touched.trxID && formik.errors.trxID}
              </small>
            ) : null}
          </div>
        ) : null}

        {/* Amount box */}
        <div className="flex flex-col gap-3">
          <input
            onWheel={(event) => event.currentTarget.blur()}
            type="number"
            placeholder="Amount"
            name="amount"
            className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.amount && Boolean(formik.errors.amount) ? (
            <small className="text-red-600">
              {formik.touched.amount && formik.errors.amount}
            </small>
          ) : null}
        </div>

        <div className={`flex space-x-1.5`}>
          <div className="flex flex-col gap-3 w-full">
            <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
              {formik.values.utilities ? (
                <span>{"Utilities " + utilitiesFiles.length + " files"}</span>
              ) : (
                <span className={`flex items-baseline space-x-1.5`}>
                  <FaUpload />
                  <span>Choose Utilities</span>
                </span>
              )}
              <input
                type="file"
               ref={(el) => (fileInputRef.current = el)}
                accept="image/*"
                multiple={false}
                name="utilities"
                className="absolute left-0 top-0  overflow-hidden h-0"
                onChange={async (e) =>
                  formik.setFieldValue("utilities", e.currentTarget.files)
                }
                onBlur={formik.handleBlur}
              />
            </label>
            {formik.touched.utilities && Boolean(formik.errors.utilities) ? (
              <small className="text-red-600">
                {formik.touched.utilities && formik.errors.utilities}
              </small>
            ) : null}
          </div>
        </div>
        <div className={`flex space-x-1.5`}>
          <div className="flex flex-col gap-3 w-full">
            <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
              {formik.values.tradeLicenses ? (
                <span>
                  {"Trade Licenses " + tradeLicensesFiles.length + " files"}
                </span>
              ) : (
                <span className={`flex items-baseline space-x-1.5`}>
                  <FaUpload />
                  <span>Choose Trade Licenses</span>
                </span>
              )}
              <input
                type="file"
               ref={(el) => (fileInputRef2.current = el)}
                accept="image/*"
                name="tradeLicenses"
                className="absolute left-0 top-0  overflow-hidden h-0"
                onChange={(e) =>
                  formik.setFieldValue("tradeLicenses", e.currentTarget.files)
                }
                onBlur={formik.handleBlur}
              />
            </label>
            {formik.touched.tradeLicenses &&
            Boolean(formik.errors.tradeLicenses) ? (
              <small className="text-red-600">
                {formik.touched.tradeLicenses && formik.errors.tradeLicenses}
              </small>
            ) : null}
          </div>
        </div>

        <div className={`flex space-x-1.5`}>
          <div className="flex flex-col gap-3 w-full">
            <label className="relative input input-md input-bordered flex items-center border-gray-500/50 rounded  focus:outline-none bg-transparent">
              {formik.values.panCard ? (
                <span>{"Pan card " + panCardFiles.length + " files"}</span>
              ) : (
                <span className={`flex items-baseline space-x-1.5`}>
                  <FaUpload />
                  <span>Choose Pan Card</span>
                </span>
              )}
              <input
                type="file"
               ref={(el) => (fileInputRef3.current = el)}
                accept="image/*"
                name="panCard"
                className="absolute left-0 top-0  overflow-hidden h-0"
                onChange={(e) =>
                  formik.setFieldValue("panCard", e.currentTarget.files)
                }
                onBlur={formik.handleBlur}
              />
            </label>
            {formik.touched.panCard && Boolean(formik.errors.panCard) ? (
              <small className="text-red-600">
                {formik.touched.panCard && formik.errors.panCard}
              </small>
            ) : null}
          </div>
        </div>
        {/* Hotel Address box */}
        <div className="flex flex-col gap-3">
          <textarea
            placeholder="Address"
            name="address"
            className="textarea textarea-md bg-transparent textarea-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy resize-none w-full"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address && Boolean(formik.errors.address) ? (
            <small className="text-red-600">
              {formik.touched.address && formik.errors.address}
            </small>
          ) : null}
        </div>

        {/* Remarks box */}
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
        {/* submit button */}
        <button
          disabled={isLoading}
          type="submit"
          className="col-span-full btn btn-md w-full bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case h-auto p-2"
        >
          <span>Create License</span>
          {isLoading ? (
            <span
              className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
              role="status"
            ></span>
          ) : null}
        </button>
      </form>
    </div>
  );
};

export default AdminNewLicense;
