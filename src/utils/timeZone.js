import { addDays, isBefore, set } from "date-fns";
import { getTodayFormateDate } from "./utils";
import moment from "moment-timezone";

export const getFormateDateAndTime = (date) => {
  const formattedDate = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Dhaka", // Set the timezone to Bangladesh
  });
  return formattedDate;
};

export const getISOStringDate = (date) => {
  if (date) {
    const originalDate = new Date(date);
    originalDate.setMinutes(
      originalDate.getMinutes() - originalDate.getTimezoneOffset()
    );
    const formattedDate = originalDate.toISOString();
    return formattedDate;
  } else {
    return "";
  }
};

// Booking Date Format

export const bookingDateFormatter = (date) => {
  const formattedDate = moment(date)
    .utcOffset("+05:30")
    .format("DD/MM/YYYY hh:mm a");
  return formattedDate;
};

// ... (other functions with timezone adjustments)

export const getformatDateTime = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata", // Set the timezone to Bangladesh
  };

  const formattedDateTime = new Date(date || new Date()).toLocaleString(
    "en-US",
    options
  );
  return formattedDateTime;
};

// ... (other functions with timezone adjustments)

export const convertedFromDate = (date) => {
  const fromDate = new Date(date);
  fromDate.setHours(18, 0, 0, 0);
  const isoFromDate = fromDate.toISOString();
  // Check if the selected time is before 11:59 am
  if (
    isBefore(
      date,
      set(date, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 })
    )
  ) {
    // If before 6 am, set check-in date to the previous day at 12:00 pm
    const previousDay = addDays(date, -1);
    previousDay.setHours(18, 0, 0, 0);
    const updatedFromDate = previousDay.toISOString();
    return updatedFromDate;
  } else {
    // Otherwise, set check-in date to the selected date at 12:00 pm
    return isoFromDate;
  }
};

export const getStartDateOFBookingIST = (fromDate) => {
  const inputDate = getTodayFormateDate(fromDate);
  // Parse the input date string
  const [month, day, year] = inputDate.split("/").map(Number);

  // Create a new Date object with the parsed values
  const date = new Date(Date.UTC(year, month - 1, day, 6, 30, 0));

  // Format the date to ISO string
  const isoFormat = date.toISOString();

  return isoFormat;
};

// for booking or checkin we need to select the last date. then we have to call this func. this func will return iso date of indian time 11.59 am
export const getEndDateOfBookingIst = (toDate) => {
  const inputDate = getTodayFormateDate(toDate ? toDate : new Date());
  // Parse the input date string
  const [month, day, year] = inputDate.split("/").map(Number);

  // Create a new Date object with the parsed values
  const date = new Date(Date.UTC(year, month - 1, day, 6, 29, 59, 999));

  // Format the date to ISO string
  const isoFormat = date.toISOString();

  return isoFormat;
};

export const convertedStartDate = (newDate) => {
  const inputDate = getTodayFormateDate(newDate ? newDate : new Date());
  // Parse the input date string
  const [month, day, year] = inputDate.split("/").map(Number);

  // Create a new Date object with the parsed values
  const date = new Date(Date.UTC(year, month - 1, day - 1, 18, 30, 0, 0));
  // Format the date to ISO string
  const isoFormat = date.toISOString();
  return isoFormat;
};
export const convertedEndDate = (newDate) => {
  const inputDate = getTodayFormateDate(newDate ? newDate : new Date());
  // Parse the input date string
  const [month, day, year] = inputDate.split("/").map(Number);

  // Create a new Date object with the parsed values
  const date = new Date(Date.UTC(year, month - 1, day, 18, 29, 59, 999));
  // Format the date to ISO string
  const isoFormat = date.toISOString();
  return isoFormat;
};
export const getIndianTimeForCheckout = (date, time) => {
  const dateTimeString = `${date} ${time}`;

  // Parse the date and time in the given format and specify the input timezone
  const parsedDate = moment.tz(
    dateTimeString,
    "MM/DD/YYYY HH:mm",
    "Asia/Kolkata"
  );

  // Convert to ISO format and specify the output timezone
  const isoDate = parsedDate.toISOString();

  return isoDate;
};
export const convertedToDate = (date) => {
  const newDate = new Date(date);
  newDate.setHours(17, 59, 0, 0);
  const isoToDate = newDate.toISOString();
  return isoToDate;
};

export const getCurrentTime = () => {
  const now = moment().tz("Asia/Kolkata");
  const hours = now.hour();
  const minutes = now.minute();

  return `${hours}:${minutes}`;
};

export const getConvertedLocalDate = (date) => {
  const convertedDate = date ? new Date(date) : new Date();
  const offset = convertedDate.getTimezoneOffset();
  convertedDate.setMinutes(convertedDate.getMinutes() - offset);
  return convertedDate;
};
export const getConvertedIndiaLocalDate = () => {
  const indianTime = moment().tz("Asia/Kolkata");
  // Format the date as ISO
  const isoDate = indianTime.toISOString();

  return isoDate;
};

export const getIndianFormattedDate = (date) => {
  const options = {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    hourCycle: "h23", // Use 24-hour clock format
    ...(Intl.DateTimeFormat().resolvedOptions().locale.startsWith("en") && {
      // Add options only if the locale starts with 'en' (English)
      hourCycle: "h12",
      hour12: true,
    }),
  };

  const formattedDate = new Date(date).toLocaleString("en-IN", options);

  // Convert the AM/PM part to uppercase
  return formattedDate.replace(/\b(?:am|pm)\b/gi, (match) =>
    match.toUpperCase()
  );
};
export const getCurrentTimeInIndia = () => {
  // Get current date and time
  const now = new Date();

  // Set the time zone to India Standard Time (IST)
  const options = { timeZone: "Asia/Kolkata" };

  // Get hours, minutes, and seconds in the specified time zone
  const hours = now.toLocaleString("en-US", {
    ...options,
    hour: "numeric",
    hour12: false,
  });
  const minutes = now.toLocaleString("en-US", {
    ...options,
    minute: "numeric",
  });
  const seconds = now.toLocaleString("en-US", {
    ...options,
    second: "numeric",
  });

  return `${hours}:${minutes}`;
};
