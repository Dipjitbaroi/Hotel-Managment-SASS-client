const AuthoInfoPrint = ({ hotelInfo, isHotelSuccess }) => {
  // if (!hotelInfo || hotelInfo.length === 0 || !hotelInfo[0]) {
  //   return <div>Loading...</div>; // Or handle the loading state appropriately
  // }

  const info = isHotelSuccess && hotelInfo[0] ? hotelInfo[0] : [];


  return (
    <div className="py-2">
      <h2 className="font-bold">Invoice From</h2>
      <div className="flex items-center">
        <div>
          <div className="flex gap-[2.1rem]">
            <p>Hotel Name</p>
            <p>: {info?.name}</p>
          </div>

          <div className="flex gap-[1.5rem]">
            <p>Branch Name</p>
            <p className="">: {info?.branch_name}</p>
          </div>
          <div className="flex gap-[5.1rem]">
            <p>Email</p>
            <p className="">: {info?.email}</p>
          </div>

          <div className="flex gap-[4.7rem]">
            <p>Phone</p>
            <p>: {info?.phone_no}</p>
          </div>

          <div className="flex gap-[4rem]">
            <p>Address</p>
            <p>: {info?.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthoInfoPrint;
