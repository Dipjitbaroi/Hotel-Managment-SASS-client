import React, { useEffect } from "react";

const Preloader = ({ setPreloader }) => {
  useEffect(() => {
    setTimeout(() => {
      setPreloader(false);
    }, 1000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h2 className="text-6xl font-semibold text-green-slimy uppercase animate-pulse">
          Loading...
        </h2>
        <p className="text-2xl text-green-slimy/50">Wait for sometime</p>
      </div>
    </div>
  );
};

export default Preloader;
