import React, { useState } from "react";

const DayPlan = ({ day, plan, details, alternate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    location: false,
    details: false,
    plans: false,
    costs: false,
  });
  const [experiences, setExperiences] = useState("");
  const [photos, setPhotos] = useState(null);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevItems) => ({ ...prevItems, [name]: checked }));
  };

  const handleExperienceChange = (event) => {
    setExperiences(event.target.value);
  };

  const handlePhotoChange = (event) => {
    setPhotos(event.target.files);
  };

  return (
    <div
      className={`flex ${
        alternate ? "flex-row-reverse" : "flex-row"
      } items-start my-4`}
    >
      <div className="w-1/12 font-bold text-xl">{day}</div>
      <div
        className="w-8/12 p-4 border border-gray-500 cursor-pointer"
        onClick={toggleDetails}
      >
        {plan}
      </div>
      {showDetails && (
        <div className="w-full mt-4">
          <div className="p-2 border-b">
            <label>
              <input
                type="checkbox"
                name="location"
                checked={checkedItems.location}
                onChange={handleCheckboxChange}
              />
              Location: {details.location}
            </label>
          </div>
          <div className="p-2 border-b">
            <label>
              <input
                type="checkbox"
                name="details"
                checked={checkedItems.details}
                onChange={handleCheckboxChange}
              />
              Details: {details.details}
            </label>
          </div>
          <div className="p-2 border-b">
            <label>
              <input
                type="checkbox"
                name="plans"
                checked={checkedItems.plans}
                onChange={handleCheckboxChange}
              />
              Plans: {details.plans}
            </label>
          </div>
          <div className="p-2 border-b">
            <label>
              <input
                type="checkbox"
                name="costs"
                checked={checkedItems.costs}
                onChange={handleCheckboxChange}
              />
              Costs: {details.costs}
            </label>
          </div>

          {(checkedItems.location ||
            checkedItems.details ||
            checkedItems.plans ||
            checkedItems.costs) && (
            <div className="mt-4">
              <textarea
                className="w-full p-2 border border-gray-500"
                placeholder="Write your experience..."
                value={experiences}
                onChange={handleExperienceChange}
              ></textarea>
              <input
                type="file"
                multiple
                className="mt-2"
                onChange={handlePhotoChange}
              />
              {photos && (
                <div className="mt-2">
                  <p>Selected Photos:</p>
                  <ul>
                    {Array.from(photos).map((photo, index) => (
                      <li key={index}>{photo.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PlanSchedule = () => {
  const plans = [
    {
      day: 1,
      plan: "Visit the Beach",
      details: {
        location: "Cox's Bazar Beach",
        details: "A beautiful beach known for its sunset views.",
        plans: "Relax on the beach, enjoy local food.",
        costs: "$20",
      },
    },
    {
      day: 2,
      plan: "Explore the Marine Drive",
      details: {
        location: "Cox's Bazar Marine Drive",
        details: "A scenic drive along the coastline.",
        plans: "Drive along the road and stop at scenic points.",
        costs: "$30",
      },
    },
    // Add more days and plans as necessary
  ];

  return (
    <div className="p-8">
      {plans.map((plan, index) => (
        <DayPlan
          key={plan.day}
          day={plan.day}
          plan={plan.plan}
          details={plan.details}
          alternate={index % 2 === 0}
        />
      ))}
    </div>
  );
};

export default PlanSchedule;
