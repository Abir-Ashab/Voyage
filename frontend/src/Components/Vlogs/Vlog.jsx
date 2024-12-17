import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Vlog = () => {
    const [vlogData, setVlogData] = useState(null);

    useEffect(() => {
        const fetchVlogData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/generateVlog');
                setVlogData(response.data);
            } catch (error) {
                console.error('Error fetching vlog data:', error);
            }
        };
        fetchVlogData();
    }, []);

    if (!vlogData) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="p-10 max-w-7xl mx-auto">
            {/* Vlog Description */}
            <h1 className="text-3xl font-bold text-center mb-4">Vlog </h1>
            <p className="text-gray-700 text-lg mb-6 text-center">{vlogData.vlog}</p>

            <h2 className="text-2xl font-semibold text-center mb-4">Trip Photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {vlogData.imageUrls.map((url, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src={url} alt={`Trip photo ${index + 1}`} className="w-full h-48 object-cover"/>
                    </div>
                ))}
            </div>

            {/* YouTube Videos */}
            <h2 className="text-2xl font-semibold text-center mb-4">Suggested Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vlogData.videos.map((video, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <iframe
                            className="w-full h-48"
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg">{video.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{video.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vlog;
