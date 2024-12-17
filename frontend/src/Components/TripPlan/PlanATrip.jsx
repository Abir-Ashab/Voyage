import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { AuthContext } from "../Authentication/AuthProvider";
import { useNavigate } from "react-router-dom";
import Map from "../YourTrip/Map";

const PlanATrip = () => {
    const [step, setStep] = useState(0);
    const [boardingPoint, setBoardingPoint] = useState(null);
    const [destination, setDestination] = useState(null);
    const [company, setCompany] = useState("");
    const [ageConcern, setAgeConcern] = useState([]);
    const [sinceWhen, setSinceWhen] = useState("");
    const [tillWhen, setTillWhen] = useState("");
    const [budgetType, setBudgetType] = useState("");
    const [preferredActivities, setPreferredActivities] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [requirementId, setRequirementId] = useState(null);
    const [submittedData, setSubmittedData] = useState(null); // New state for submitted data

    const { user } = useContext(AuthContext);
    console.log(user._id);

    const navigate = useNavigate();

    const motivationalMessages = [
        "Let's start your journey by setting your boarding location!",
        "Where are you planning to go?",
        "Are you going solo or with company?",
        "Any special age group concerns? Select all that apply.",
        "When are you planning to start your trip?",
        "When will your trip end?",
        "Choose your budget range to help us plan better!",
        "What kind of activities do you enjoy on weekends? Select multiple if you like!",
    ];

    const options = [
        { label: "Solo", value: "solo" },
        { label: "Couple", value: "couple" },
        { label: "Friends", value: "friends" },
        { label: "Family", value: "family" },
    ];

    const ageConcernsOptions = ["Baby", "Child", "Old", "Pets"];
    const budgetOptions = ["Budget", "Mid-range", "Luxury"];
    const activityOptions = ["Hiking", "Beach", "Museum", "Shopping", "Dining"];

    const fetchCityData = async (query) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=6a4330ecce54d6aa71d8aad4bd4ddca6`
            );
            const cityData = {
                cityName: response.data.name,
                latitude: response.data.coord.lat,
                longitude: response.data.coord.lon,
            };
            setCitySuggestions([cityData]);
        } catch (error) {
            console.error("Error fetching city data:", error);
            setCitySuggestions([]);
        }
    };

    const handleCitySelect = (cityData, setter) => {
        setter(cityData);
        setCitySuggestions([]);
    };

    const handleNext = () => {
        if (step < motivationalMessages.length - 1) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleAgeConcernChange = (value) => {
        setAgeConcern((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const handleActivityChange = (value) => {
        setPreferredActivities((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const submitForm = async () => {
        console.log(boardingPoint, destination);

        const requirements = {
            userId: user._id,
            boardingPoint,
            destination,
            company,
            ageConcern,
            sinceWhen,
            tillWhen,
            budgetType,
            preferredActivities,
        };

        try {
            const response = await axios.post(
                "http://localhost:3500/requirements/save-requirement",
                requirements
            );
            console.log("Response:", response.data);
            setRequirementId(response.data._id);
            setSubmittedData(requirements); // Save form data to state
            //   navigate("/home/your-trip", { state: response.data._id });
        } catch (error) {
            console.error("Error saving requirement:", error);
        } finally {
            console.log("Requirement ID: ", requirementId);
        }

        if (user) {
            console.log("User:", user);
        }
    };

    console.log(submittedData);

    // Conditional rendering for the submitted data
    if (submittedData) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 font-poppins text-gray-600 space-y-6">
                <h1 className="text-4xl font-bold text-center">Your Travel Journey</h1>
                <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold">Starting Point:</h2>
                    <p className="text-lg">{submittedData.boardingPoint.cityName} (Lat: {submittedData.boardingPoint.latitude}, Lng: {submittedData.boardingPoint.longitude})</p>

                    <h2 className="text-xl font-semibold mt-4">Your Journey:</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            <p className="text-lg">Prepare for your adventure! You are starting from <strong>{submittedData.boardingPoint.cityName}</strong>.</p>
                            <p className="text-sm text-gray-500">Pack your bags and get ready for an amazing experience!</p>
                        </li>
                        <li>
                            <p className="text-lg">Enjoy the journey towards <strong>{submittedData.destination.cityName}</strong>.</p>
                            <p className="text-sm text-gray-500">Take in the beautiful sights along the way!</p>
                        </li>
                        <li>
                            <p className="text-lg">Arrive in <strong>{submittedData.destination.cityName}</strong>!</p>
                            <p className="text-sm text-gray-500">Welcome to your destination, ready for adventures ahead!</p>
                        </li>
                    </ol>

                    <h2 className="text-xl font-semibold mt-4">Budget Type:</h2>
                    <p className="text-lg">{submittedData.budgetType}</p>

                    <h2 className="text-xl font-semibold mt-4">Preferred Activities:</h2>
                    <ul className="list-disc list-inside">
                        {submittedData.preferredActivities.map((activity, index) => (
                            <li key={index} className="text-lg">{activity}</li>
                        ))}
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">Travel Dates:</h2>
                    <p className="text-lg">{submittedData.sinceWhen} to {submittedData.tillWhen}</p>

                    <h2 className="text-xl font-semibold mt-4">Traveling with:</h2>
                    <p className="text-lg">{submittedData.company}</p>

                    <h2 className="text-xl font-semibold mt-4">Traveling with:</h2>
                    <p className="text-lg">{submittedData.ageConcern.join(', ')}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center mt-20 font-poppins text-gray-600 space-y-4">
            <div className="p-8 rounded-lg space-y-4">
                <h2 className="text-3xl text-center font-semibold mb-4 max-w-xl">
                    {motivationalMessages[step]}
                </h2>

                {step === 0 && (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Boarding Location"
                            onChange={(e) => {
                                fetchCityData(e.target.value);
                            }}
                            className="input input-bordered w-full mb-4"
                        />
                        {citySuggestions.length > 0 && (
                            <ul className="list-none w-full bg-white border rounded-lg shadow-md p-2">
                                {citySuggestions.map((city, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer p-2 hover:bg-gray-200"
                                        onClick={() => handleCitySelect(city, setBoardingPoint)}
                                    >
                                        {city.cityName} (Lat: {city.latitude}, Lon: {city.longitude}
                                        )
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Destination"
                            onChange={(e) => fetchCityData(e.target.value)}
                            className="input input-bordered w-full mb-4"
                        />
                        {citySuggestions.length > 0 && (
                            <ul className="list-none w-full bg-white border rounded-lg shadow-md p-2">
                                {citySuggestions.map((city, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer p-2 hover:bg-gray-200"
                                        onClick={() => handleCitySelect(city, setDestination)}
                                    >
                                        {city.cityName} (Lat: {city.latitude}, Lon: {city.longitude}
                                        )
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div>
                        {step === 2 && (
                            <div>
                                <select
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setCompany(e.target.value); // Update company with selected option value
                                        console.log(company); // Optional: Log the selected company value
                                    }}
                                    className="select select-bordered w-full mb-4"
                                >
                                    {options.map((option) => (
                                        <option key={option.label} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div>
                        {ageConcernsOptions.map((option) => (
                            <label key={option} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="checkbox"
                                    onChange={() => handleAgeConcernChange(option)}
                                    checked={ageConcern.includes(option)}
                                    className="checkbox"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <input
                            type="date"
                            onChange={(e) =>
                                setSinceWhen(format(new Date(e.target.value), "yyyy-MM-dd"))
                            }
                            className="input input-bordered w-full mb-4"
                        />
                    </div>
                )}

                {step === 5 && (
                    <div>
                        <input
                            type="date"
                            onChange={(e) =>
                                setTillWhen(format(new Date(e.target.value), "yyyy-MM-dd"))
                            }
                            className="input input-bordered w-full mb-4"
                        />
                    </div>
                )}

                {step === 6 && (
                    <div>
                        {budgetOptions.map((option) => (
                            <label key={option} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="radio"
                                    name="budget"
                                    value={option}
                                    onChange={(e) => setBudgetType(e.target.value)}
                                    className="radio"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {step === 7 && (
                    <div>
                        {activityOptions.map((option) => (
                            <label key={option} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="checkbox"
                                    onChange={() => handleActivityChange(option)}
                                    checked={preferredActivities.includes(option)}
                                    className="checkbox"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    {step > 0 && (
                        <button className="underline" onClick={handleBack}>
                            Back
                        </button>
                    )}
                    {step < motivationalMessages.length - 1 ? (
                        <button
                            className="btn btn-primary bg-gray-700 rounded-full text-white hover:bg-gray-500 border-none"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            className="btn bg-gradient-to-r from-orange-primary to-orange-secondary text-white"
                            onClick={submitForm}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanATrip;
