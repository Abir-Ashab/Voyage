import React, { useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkdownIt from "markdown-it";
import TripDetailsBox from "./TripDetailsBox";
import { AuthContext } from "../Authentication/AuthProvider";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Map from "./Map";
import Form from "./form";

const genAI = new GoogleGenerativeAI("AIzaSyA4yQdMZoyFNQT7QS5d0ERQNHBBEGBeVkg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const YourTrip = () => {
    const [itinerary, setItinerary] = useState("");
    const [loading, setLoading] = useState(false);
    const [tripDetails, setTripDetails] = useState(null);
    const [requirement, setRequirement] = useState(null); // New state for requirement data
    const { user } = useContext(AuthContext);
    const userId = user?._id;

    const location = useLocation();
    const requirementId = location.state;

    console.log("Requirement ID:", requirementId);

    useEffect(() => {
        // Fetch the trip details for the logged-in user
        const fetchTripDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3500/trip-details/get`,
                    {
                        params: { userId },
                    }
                );

                if (response.status === 200) {
                    setTripDetails(response.data);
                    console.log("Trip details:", response.data);
                } else {
                    console.error("Failed to fetch trip details.");
                }
            } catch (error) {
                console.error("Error fetching trip details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTripDetails();
    }, [userId]);

    useEffect(() => {
        // Fetch the requirement data using requirementId
        const fetchRequirement = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3500/requirements/get-requirements/${requirementId}`
                );

                if (response.status === 200) {
                    setRequirement(response.data); // Set the requirement data to the state
                    console.log("Requirement data:", response.data);
                } else {
                    console.error("Failed to fetch requirement data.");
                }
            } catch (error) {
                console.error("Error fetching requirement data:", error);
            }
        };

        if (requirementId) {
            fetchRequirement(); // Call API only if requirementId is available
        }
    }, [requirementId]);

    const tripData = {
        ageConcern: requirement?.ageConcern || ["Baby", "Old"],
        boardingPoint: requirement?.boardingPoint || {
            cityName: "DHA",
            latitude: 32.5077,
            longitude: 74.5249,
        },
        budgetType: requirement?.budgetType || "Luxury",
        company: requirement?.company || "friends",
        destination: requirement?.destination || {
            cityName: "Khulna",
            latitude: 22.8373,
            longitude: 89.5400,
        },
        preferredActivities: requirement?.preferredActivities || ["Beach", "Museum"],
        sinceWhen: requirement?.sinceWhen || "2024-10-17",
        tillWhen: requirement?.tillWhen || "2024-10-11",
    };

    function cleanHTML(htmlString) {
        const blockTags = /<\/(h1|h2|h3|h4|h5|h6|p|div|li|ul|ol)>/gi;
        htmlString = htmlString.replace(blockTags, "</$1>\n");

        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlString;

        let cleanedText = tempElement.textContent || tempElement.innerText || "";
        cleanedText = cleanedText.replace(/\s+\n\s+/g, "\n").trim();

        return cleanedText;
    }

    // Function to generate itinerary using the AI model
    const generateItinerary = async () => {
        setLoading(true);

        // Create the prompt based on trip data
        const query = `
      "Generate a detailed trip itinerary for a group of ${tripData.company
            } from ${tripData.boardingPoint?.cityName} to ${tripData.destination?.cityName
            }.
      The trip starts on ${tripData.sinceWhen} and ends on ${tripData.tillWhen
            }. In this trip, ${tripData.ageConcern?.join(", ")} will also join.
      Please consider their comfort and mobility while planning.
      The trip should be planned with a ${tripData.budgetType
            } budget, and the preferred activities are ${tripData.preferredActivities?.join(
                ", "
            )}.
      Please provide an overview of the destination, a daily itinerary plan, including activities, places to visit, and suggestions for each day.
      End the trip with a summary of the final day. If any requirement does not match with the location, just ignore it."
      Generate a plan according to the given requirements.
    `;

        try {
            const result = await model.generateContent(query);
            const generatedText = result.response.text();
            const md = new MarkdownIt();
            const renderedMarkdown = md.render(generatedText);
            setItinerary(cleanHTML(renderedMarkdown));
        } catch (error) {
            console.error("Error generating itinerary:", error);
            setItinerary("Failed to generate the itinerary. Please try again.");
        } finally {
            setLoading(false);
        }

        try {
            const response = await axios.post(
                "http://localhost:3500/trip-details/details",
                {
                    userId: user._id,
                    requirementsId: requirementId,
                    details: itinerary,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("Trip details successfully sent:", response.data);
            } else {
                console.error("Failed to send trip details:", response.statusText);
            }
        } catch (error) {
            console.error("Error while sending trip details:", error);
        }
    };

    return (
        <div className="container mx-auto mt-8 p-6 rounded-md shadow-lg bg-white grid grid-cols-3 gap-2">
            <div className="">
                <button
                    onClick={generateItinerary}
                    className="btn bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Itinerary"}
                </button>
                {loading && (
                    <p className="mt-4 text-lg">
                        Please wait while we generate your trip itinerary...
                    </p>
                )}
                {itinerary && (
                    <div className="border-t">
                        <TripDetailsBox details={itinerary} />
                    </div>
                )}
            </div>
            <div className="col-span-2 h-96">
                <Map 
                lat1={23.8041}
                long1={90.4152}
                lat2={22.8373}
                long2={89.5400}
                />
            </div>
           <Form></Form>
        </div>
    );
};

export default YourTrip;
