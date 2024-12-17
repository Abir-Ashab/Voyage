import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthProvider";

const ImageList = ({ tripId, user }) => {
    const [images, setImages] = useState([]);

    console.log(user);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Make a POST request with userId and tripId in the request body
                const response = await axios.post("http://localhost:5001/all", {
                    userId: user._id, // Pass user._id from AuthContext
                    tripId: tripId // Use tripId passed as prop
                });

                // Set the received images data into the state
                setImages(response.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        // Fetch images on component mount
        fetchImages();
    }, [tripId, user._id]);

    console.log(images);

    return (
        <div className="max-w-5xl mx-auto mt-6 font-poppins">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Gallary:</h2>
            <div className="grid grid-cols-3 gap-4">
                {images.imageUrls && images.imageUrls.map(url => <>
                    <img src={url} alt="gallary image"
                        className="w-64 rounded-lg"
                    />
                </>)}
            </div>
        </div>
    );
};

export default ImageList;
