import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Authentication/AuthProvider";
import TripCard from "./TripCard";

const GallaryPage = () => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      fetch(`http://localhost:3500/trip-details/search?userId=${user._id}`)
        .then(res => res.json())
        .then(data => setTrips(data))
        .catch(error => {
          console.log('Error fetching trips data', error);
        });
    }
  }, [user]);

//   console.log(trips);

  return (
    <div className="max-w-5xl flex justify-center font-poppins mx-auto mt-6">
      <h2 className="text-gray-600">
        {/* <span className="text-xl font-semibold">Explore the Moments:</span> */}
      </h2>
      <div className="mt-6">
        {trips.length > 0? (
          trips.map((trip) => (
            <TripCard key={trip._id} trip = {trip} />
          ))
        ) : (
          <p>No trips available to display</p>
        )}
      </div>
    </div>
  );
};

export default GallaryPage;
