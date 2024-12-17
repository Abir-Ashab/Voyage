import React, { useState } from 'react';
import Map from './Map';

const Form = () => {
  // Initialize states for latitude and longitude
  const [lat1, setLat1] = useState(23.8103); // Default: Dhaka latitude
  const [long1, setLong1] = useState(90.4125); // Default: Dhaka longitude
  const [lat2, setLat2] = useState(22.3475); // Default: Chittagong latitude
  const [long2, setLong2] = useState(91.8123); // Default: Chittagong longitude
  const [done, setdone] = useState(false);


  // Handle input changes
  const handleLat1Change = (e) => setLat1(Number(e.target.value));
  const handleLong1Change = (e) => setLong1(Number(e.target.value));
  const handleLat2Change = (e) => setLat2(Number(e.target.value));
  const handleLong2Change = (e) => setLong2(Number(e.target.value));

  return (
    <div >
      <div>
        <div className='mt-[30%]'>
          <h2  className="text-xl font-semibold">Source (Lat1, Long1)</h2>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Latitude for Source"
            value={lat1}
            onChange={handleLat1Change}
          />
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Longitude for Source"
            value={long1}
            onChange={handleLong1Change}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Destination (Lat2, Long2)</h2>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Latitude for Destination"
            value={lat2}
            onChange={handleLat2Change}
          />
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Longitude for Destination"
            value={long2}
            onChange={handleLong2Change}
          />
        </div>
      </div>
      <button
        className="mt-4 ml-[45%] px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={() => setdone(true)}
      >
        Search
      </button>

      {done && (
        <div>
          <Map lat1={lat1} long1={long1} lat2={lat2} long2={long2} />
        </div>
      )}
    </div>
  );
};

export default Form;
