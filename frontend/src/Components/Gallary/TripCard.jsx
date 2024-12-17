import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TripCard = ({ trip }) => {
    const [requirement, setRequirement] = useState({});
    const { requirementsId } = trip;
    console.log(requirement);

    useEffect(() => {
        fetch(`http://localhost:3500/requirements/get-requirements/${requirementsId}`)
            .then(res => res.json())
            .then(data => setRequirement(data));
    }, [trip])

    console.log(requirement);
    return (
        <Link to={`/home/trip-details/${trip._id}`}>
            <div className="card bg-base-100 image-full w-96 h-72 shadow-xl">
                <figure>
                    <img
                        src="https://cdn2.iconfinder.com/data/icons/vivid/48/image-512.png"
                        alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title text-2xl text-white">Memory 2024</h2>
                    <p></p>
                    <div className="card-actions justify-end">
                        <button className="btn bg-gradient-to-r from-orange-primary to-orange-secondary border-none text-base-100">View Gallary</button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TripCard;
