import React, { useState } from "react";

const TripDetailsBox = ({ details }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className=" bg-gray-50 p-10 flex justify-center items-center">
      <div className={`max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-300 p-4 text-justify ${showMore ? 'h-auto' : 'h-[150px]'}`}>
        <p className="leading-relaxed">
          {showMore ? details : `${details.slice(0, 100)}...`}
        </p>
        <button
          onClick={toggleShowMore}
          className="mt-2 text-blue-500 hover:underline"
        >
          {showMore ? "See Less" : "See More"}
        </button>
      </div>
    </div>
  );
};

export default TripDetailsBox;
