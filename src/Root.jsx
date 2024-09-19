import React, { useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Preloader from "./components/Preloader.jsx";

const Root = () => {
  const fullscreenRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [preloader, setPreloader] = useState(true);
  const [isHbMenu, setHbMenu] = useState(true);

  const handleResize = () => {
    if (innerWidth >= 768) setHbMenu(false);
    else setHbMenu(true);
  };

  const enterFullscreen = () => {
    if (fullscreenRef.current) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      } else if (fullscreenRef.current.mozRequestFullScreen) {
        fullscreenRef.current.mozRequestFullScreen();
      } else if (fullscreenRef.current.webkitRequestFullscreen) {
        fullscreenRef.current.webkitRequestFullscreen();
      } else if (fullscreenRef.current.msRequestFullscreen) {
        fullscreenRef.current.msRequestFullscreen();
      }
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  useEffect(() => {
    handleResize();

    addEventListener("resize", handleResize);

    return () => removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   handleResize();
  
  //   window.addEventListener("resize", handleResize);
  
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);
  

  return (
    <>
      {preloader ? (
        <Preloader setPreloader={setPreloader} />
      ) : (
        <div
          ref={fullscreenRef}
          className={`bg-gray-100 ${
            isFullscreen ? "h-screen overflow-y-auto scrollbar-none" : ""
          }`}
        >
          <Outlet
            context={{
              isFullscreen,
              enterFullscreen,
              exitFullscreen,
              isHbMenu,
              setHbMenu,
            }}
          />
        </div>
      )}
      <ScrollRestoration />
    </>
  );
};

export default Root;
