import FileResizer from "react-image-file-resizer";
import Swal from "sweetalert2";

export const calculatePercentageDiscount = (totalAmount, discountAmount) => {
  // Calculate the percentage discount
  const percentageDiscount = (discountAmount / totalAmount) * 100;

  return percentageDiscount.toFixed(2);
};
export const calculateDiscountAmount = (totalAmount, percentageDiscount) => {
  // Calculate the discount amount
  const discountAmount = (percentageDiscount / 100) * totalAmount;

  return discountAmount.toFixed(2);
};

export const getFormateDateAndTime = (date) => {
  const rawDate = new Date(date || new Date());
  const day = rawDate.toLocaleString("en-US", { day: "2-digit" });
  const month = rawDate.toLocaleString("en-US", { month: "2-digit" });
  const year = rawDate.toLocaleString("en-US", { year: "numeric" });
  const hourMinuteSecond = rawDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
  const formattedDateTime = `${day}/${month}/${year}, ${hourMinuteSecond}`;
  return formattedDateTime;
};
export const resizeFile = (file, maxWidth, maxHeight, fileType) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      fileType
    );
  });
export const getResizedImage = async (selectedImage) => {
  if (!selectedImage.type.includes("image")) {
    return new Promise((resolve, reject) => {
      resolve(selectedImage);
    });
  } else {
    return new Promise((resolve, reject) => {
      const imageUrl = URL.createObjectURL(selectedImage);

      const image = new Image();
      image.src = imageUrl;

      image.onload = async () => {
        if (image.width > 600) {
          const aspectRatio = image.width / image.height;
          const newMaxWidth = 600;
          const newMaxHeight = newMaxWidth / aspectRatio;
          try {
            const res = await resizeFile(
              selectedImage,
              newMaxWidth,
              newMaxHeight,
              "file"
            );
            resolve(res); // Resolve with the result
          } catch (error) {
            reject(error); // Reject with the error
          }
        } else if (image.width < 600 && image.height > 700) {
          const aspectRatio = image.width / image.height;
          const newMaxHeight = 700;
          const newMaxWidth = newMaxHeight / aspectRatio;
          try {
            const res = await resizeFile(
              selectedImage,
              newMaxWidth,
              newMaxHeight,
              "file"
            );
            resolve(res); // Resolve with the result
          } catch (error) {
            reject(error); // Reject with the error
          }
        } else {
          try {
            const res = await resizeFile(
              selectedImage,
              image.width,
              image.height,
              "file"
            );
            resolve(res); // Resolve with the result
          } catch (error) {
            reject(error); // Reject with the error
          }
        }

        URL.revokeObjectURL(imageUrl); // Release blob URL
      };
    });
  }
};
export const getISOStringDate = (date) => {
  if (date) {
    const originalDate = new Date(date);

    const formattedDate = originalDate.toISOString();
    return formattedDate;
  } else {
    return "";
  }
};

export const getConvertedIsoStartDate = (inputDate) => {
  const date = new Date(inputDate);
  // Adjust for the local time zone
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  // Set time to midnight
  date.setHours(0, 0, 0, 0);

  // Convert to ISO string
  const isoString = date ? date.toISOString() : "";

  return isoString;
};

export const getConvertedIsoEndDate = (inputDate) => {
  // Use the current date if inputDate is not provided
  const date = new Date(inputDate);

  // Adjust for the local time zone
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);

  // Set time to the last millisecond of the day
  date.setHours(23, 59, 59, 999);

  // Convert to ISO string
  const isoString = date.toISOString();

  return isoString;
};
export const getOnlyFormatDate = (date) => {
  const rawDate = new Date(date || new Date());
  const day = rawDate.toLocaleString("en-US", { day: "2-digit" });
  const month = rawDate.toLocaleString("en-US", { month: "2-digit" });
  const year = rawDate.toLocaleString("en-US", { year: "numeric" });
  const formattedDateTime = `${day}/${month}/${year}`;
  return formattedDateTime;
};
export const customFilterOption = (option, inputValue) => {
  const labelString = option.label.toString().toLowerCase();
  const inputString = inputValue.toLowerCase();
  return labelString.includes(inputString);
};

export const getTodayFormateDate = (date) => {
  return date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
};

export const fromDateIsoConverterForAddExpenses = (date) => {
  const fromDate = new Date(date);
  fromDate.setHours(18, 0, 0, 0);
  const isoFromDate = fromDate?.toISOString();
  return isoFromDate;
};

export const fromDateIsoConverter = (date) => {
  const fromDate = new Date(date);
  fromDate.setHours(0, 0, 0, 0);
  const isoFromDate = fromDate.toISOString();
  return isoFromDate;
};

export const checkinListFromDate = (date) => {
  const fromDate = new Date(date);
  fromDate.setHours(11, 30, 0, 0);
  const isoFromDate = fromDate.toISOString();
  return isoFromDate;
};

export const checkinListoDate = (date) => {
  const toDate = new Date(date);
  toDate.setDate(new Date(date).getDate() + 1);
  toDate.setHours(11, 29, 59, 59);

  const isoToDate = toDate.toISOString();
  return isoToDate;
};

export const toDateIsoConverter = (date) => {
  const toDate = new Date(date);
  toDate.setUTCHours(23, 59, 59, 999);
  const isoToDate = toDate.toISOString();
  return isoToDate;
};
export const getLatestDate = (allDate) => {
  if (!allDate || allDate.length === 0) {
    return null; // Return null or handle the case when the array is empty
  }

  // Create a new array before sorting to avoid modifying the original
  const newArray = [...allDate];

  // Sort the new array based on the "to" date in descending order
  const sortedArray = newArray.sort((a, b) => new Date(b.to) - new Date(a.to));

  // Return the first element (the one with the latest "to" date)
  return sortedArray[0];
};
export const getformatDateTime = (date) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  };

  const rawDate = new Date(date || new Date());
  const day = rawDate.toLocaleString("en-US", { day: "2-digit" });
  const month = rawDate.toLocaleString("en-US", { month: "2-digit" });
  const year = rawDate.toLocaleString("en-US", { year: "numeric" });
  const hourMinuteSecond = rawDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  });
  const formattedDateTime = `${day}/${month}/${year}, ${hourMinuteSecond}`;
  return formattedDateTime;
};

export const getNumberOfDays = (fromDate, toDate) => {
  const calculateDays =
    Math.abs(new Date(toDate) - new Date(fromDate)) / (24 * 60 * 60 * 1000);

  return Math.ceil(calculateDays);
};
// const url = window.location.href;
export const isValidUrl = (pageName, pageUrl) => {
  if (pageUrl) {
    return pageUrl.includes(pageName);
  }
};
export function getCurrentDateWithDay() {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDate = new Date();
  const dayOfWeek = daysOfWeek[currentDate.getDay()];

  const formattedDate = `${currentDate.toDateString()}`;

  return formattedDate;
}
export const getDiscountAmount = (originalAmount, discountPercentage) => {
  return Math.ceil(
    originalAmount - originalAmount * (discountPercentage / 100)
  );
};

export const handleImageUrl = (endPoint) => {

  const liveUrl = 'dakhotel-bucket';
  if (endPoint?.includes(liveUrl)) {
    return endPoint;
  } else {
    const baseURL =
      import.meta.env.VITE_URL_STATUS === "development"
        ? "http://localhost:5001"
        : import.meta.env.VITE_URL_STATUS === "production"
        ? "https://v1.dakhotel.com"
        : "";

    const modifyingUrl = `${baseURL}${endPoint}`;

    return modifyingUrl;
  }
};

export const dummyData = [
  {
    month_name: "November",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2022",
  },
  {
    month_name: "December",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2022",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "January",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "February",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "March",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "April",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "May",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "June",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "July",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "August",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "September",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
  {
    month_name: "October",
    total_booking: 0,
    total_checkin: 0,
    total_checkout: 6,
    total_expired: 0,
    total_renew: 0,
    total_sale: 0,
    total_hotel_expenses: 0,
    total_hotel_income: 0,
    total_hotel_profit: 0,
    total_restaurant_expenses: 0,
    total_restaurant_income: 0,
    total_restaurant_profit: 0,
    updatedAt: "2023-11-18T15:46:21.952Z",
    user_id: "65586d2f9250d89c1bac2d5b",
    user_role: "manager",
    year: "2023",
    total_income: 0,
    total_profit: 0,
    total_expense: 0,
  },
];

// DHK Version controller
export const versionControl = "05.1.00";
