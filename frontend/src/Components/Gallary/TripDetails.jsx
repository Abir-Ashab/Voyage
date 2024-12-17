import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthProvider";
import axios from "axios";
import ImageList from "./ImageList";

const TripDetails = () => {
    const { tripId } = useParams();
    const { user } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [element, setElement] = useState("upload");
    const [searchPrompt, setSearchPrompt] = useState("");
    const [searchMessage, setSearchMessage] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image to upload.");
            return;
        }

        setLoading(true);

        const uploadImage = new FormData();
        uploadImage.append("image", image);
        uploadImage.append("userId", user._id);
        uploadImage.append("tripId", tripId);
        uploadImage.append("description", `User ${user._id} uploaded image to trip ${tripId}`);
        uploadImage.append("album", tripId);

        try {
            const response = await axios.post("http://localhost:5001/upload", uploadImage, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadMessage("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploadMessage("Error uploading image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchPrompt) {
            alert("Please enter a search prompt.");
            return;
        }

        setLoading(true);
        setSearchMessage(""); // Reset previous messages
        setSearchResult(null);

        try {
            const response = await axios.post("http://localhost:5001/search", {
                userId: user._id,
                tripId: tripId,
                prompt: searchPrompt,
            });

            setSearchResult(response.data.imageUrl); // Assuming the API response contains an imageUrl
            setSearchMessage("Image found! You can download it below.");
        } catch (error) {
            console.error("Error searching for image:", error);
            setSearchMessage("Error searching for image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // console.log(tripId)

    return (
        <div className="">
            <div className="flex gap-2 justify-center">
                <button
                    className={`text-md p-2 border-b ${element === "upload" ? "underline" : ""}`}
                    onClick={() => setElement("upload")}
                >
                    Upload Image
                </button>
                <button
                    className={`${element === "search" ? "underline" : ""}`}
                    onClick={() => setElement("search")}
                >
                    Search Image
                </button>
            </div>

            {/* Upload Mode */}
            {element === "upload" ? (
                <div className="max-w-5xl mx-auto mt-6 p-4 border border-gray-200 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Upload Images to Your Trip Gallery</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Select an image to upload:
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        className="btn bg-blue-600 text-white px-4 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload Image"}
                    </button>

                    {loading && (
                        <div className="flex justify-center mt-4">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}

                    {uploadMessage && <p className="mt-4 text-lg text-green-600">{uploadMessage}</p>}
                </div>
            ) : (
                // Search Mode
                <div className="max-w-5xl mx-auto mt-6 p-4 border border-gray-200 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Search for an Image</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Enter a search prompt:
                        </label>
                        <input
                            type="text"
                            value={searchPrompt}
                            onChange={(e) => setSearchPrompt(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter search terms..."
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="btn bg-blue-600 text-white px-4 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search Image"}
                    </button>

                    {loading && (
                        <div className="flex justify-center mt-4">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}

                    {searchMessage && <p className="mt-4 text-lg text-green-600">{searchMessage}</p>}

                    {searchResult && (
                        <div className="mt-4">
                            <img src={searchResult} alt="janina" className="w-96" />
                            <a
                                href={searchResult}
                                download
                                className="btn bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                                Download Image
                            </a>
                        </div>
                    )}
                </div>
            )}
            <div className="">
                <ImageList tripId={tripId} user={user} />
            </div>
        </div>
    );
};

export default TripDetails;
