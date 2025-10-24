import React from "react";
import CircularLoader from "@/components/ui/CircularLoader";

const MainLoading = () => {
  return (
    <div className='flex h-screen w-screen flex-col content-center items-center'>
      <div className='flex h-full items-center justify-center space-x-2'>
        <p className='font-medium'>Loading</p>
        <CircularLoader />
      </div>
    </div>
  );
};

export default MainLoading;
