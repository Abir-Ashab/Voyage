const express = require('express');
const mongoose = require('mongoose');
const Minio = require('minio');
const multer = require('multer');
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const Image = require('./models/Image');

const app = express();
app.use(express.json());
app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
});


minioClient.bucketExists(process.env.MINIO_BUCKET, (err) => {
    if (err) {
        minioClient.makeBucket(process.env.MINIO_BUCKET, '', (err) => {
            if (err) console.log('Error creating bucket.', err);
            else console.log('Bucket created successfully');
        });
    } else {
        console.log('Bucket already exists');
    }
});


app.post('/search', async (req, res) => {
    const { userId, tripId, prompt } = req.body;
    console.log(userId, tripId);
   
    if (!userId || !tripId || !prompt) {
        return res.status(400).send('UserId, TripId, and prompt are required.');
    }
    try {
        const images = await Image.find({ userId, tripId }, 'llmResponse url');
       
        if (images.length === 0) {
            return res.status(404).json({ message: 'No images found for the given userId and tripId.' });
        }


        const responses = images.map((image, index) => `${index}. ${image.llmResponse}`);
        const formattedResponses = responses.join('\n\n');


        const ollamaResponse = await axios.post('http://localhost:11434/api/chat', {
            model: "llama3.2",
            "messages": [
                {
                    "role": "user",
                    "content": `Find the number in Based on the following numbered descriptions, which one best matches this prompt: "${prompt}"? Only return the best-fit index number.\n\nDescriptions:\n\n${formattedResponses}`
                }
            ],
            "stream": false
        });


        console.log('Ollama Response:', JSON.stringify(ollamaResponse.data, null, 2));


        const responseText = ollamaResponse.data.message.content
        console.log(responseText);
        regex = /(\d+)/;
        const match = responseText.match(regex);
        let number = 0
        if (match && match[1]) {
            number = parseInt(match[1], 10);
        }
        const bestFitImage = images[number];


        if (bestFitImage) {
            res.status(200).json({ imageUrl: bestFitImage.url });
        } else {
            res.status(404).json({ message: 'No matching image found.' });
        }
    } catch (error) {
        console.error('Error searching for image:', error);
        res.status(500).send('Error searching for image.');
    }
});

app.post('/upload', upload.single('image'), async (req, res) => {
    const { userId, tripId, description, album } = req.body;

    if (!userId || !tripId || !description || !req.file) {
        return res.status(400).send('UserId, TripId, description, and image are required.');
    }


    const fileName = `${Date.now()}_${req.file.originalname}`;
    minioClient.putObject(process.env.MINIO_BUCKET, fileName, req.file.buffer, req.file.size, async (err) => {
        if (err) {
            return res.status(500).send('Error uploading image to MinIO.');
        }


        const imageUrl = `http://localhost:9000/${process.env.MINIO_BUCKET}/${fileName}`;
        const imagePath = fileName;


        try {
            const response = await axios({
                method: 'get',
                url: imageUrl,
                responseType: 'stream',
            });


            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);


            writer.on('finish', async () => {
                const imgPath = `D:/Web-Development/BCF_Final/Voyage/backend2/${fileName}`;
                const imageBuffer = fs.readFileSync(imgPath);
                const imageBase64 = imageBuffer.toString('base64');


                try {
                    const output = await axios.post('http://localhost:11434/api/generate', {
                        "model": "llava",
                        "prompt":"Tell me about the image (in 1-2 line)",
                        "images": [imageBase64],
                        "stream": false
                    });
                    const newImage = new Image({
                        url: imageUrl,
                        description,
                        album: album || '',
                        userId,   // Save userId
                        tripId,   // Save tripId
                        llmResponse: output.data.response
                    });


                    await newImage.save();


                    res.status(201).json({
                        message: 'Image uploaded and analyzed successfully!',
                        imageUrl: imageUrl,
                        analysis: output.data.response
                    });


                } catch (error) {
                    console.log('Error:', error);
                    res.status(500).send('Error analyzing the image.');
                }
            });


            writer.on('error', (error) => {
                console.error('Error writing file:', error);
                res.status(500).send('Error saving the image locally.');
            });
        } catch (error) {
            console.error('Error fetching image:', error);
            res.status(500).send('Error downloading image from MinIO.');
        }
    });
});


app.post('/all', async (req, res) => {
    const { userId, tripId } = req.body;
    if (!userId || !tripId) {
        return res.status(400).json({ message: 'userId and tripId are required.' });
    }
    try {
        const images = await Image.find({ userId, tripId }, 'url'); // Only select the 'url' field
        if (images.length === 0) {
            return res.status(404).json({ message: 'No images found for the given userId and tripId.' });
        }
        const imageUrls = images.map(image => image.url);
        return res.status(200).json({ imageUrls });
    } catch (error) {
        console.error('Error fetching images:', error);
        return res.status(500).json({ message: 'Error fetching images.' });
    }
});


const YOUTUBE_API_KEY = 'AIzaSyBnEDS6HnY98qOA5I0OYw8U-eIWmjaYCRY';

app.get('/generateVlog', async (req, res) => {
    try {
        const userId = "671a24b6d8f65bc188503167";
        const tripId = "671aec610bd0b0fbae15534c";
        const images = await Image.find({ userId, tripId }, 'llmResponse url'); 
        if (images.length === 0) {
            return res.status(404).json({ message: 'No images found for the given userId and tripId.' });
        }
        const allResponsesText = images.map((image, index) => `${index + 1}. ${image.llmResponse}`).join('\n\n');
        const imageUrls = images.map(image => image.url);
        const ollamaResponse = await axios.post('http://localhost:11434/api/chat', {
            model: "llama3.2",
            messages: [
                {
                    role: "user",
                    content: `Analyze the following image descriptions to determine the overall mood (good/nice/romantic/adventurus/horror/happiness) of the trip:\n\n${allResponsesText}`
                }
            ],
            stream: false
        });
        const mood = ollamaResponse.data.message.content.trim();
        const vlogResponse = await axios.post('http://localhost:11434/api/chat', {
            model: "llama3.2",
            messages: [
                {
                    role: "user",
                    content: `Create a vlog for a ${mood} mood  trip based on the following description(These are actually the response of the images I took in a vlog):\n\n${allResponsesText}. `
                }
            ],
            stream: false
        });

        const vlog = vlogResponse.data.message.content;
        const searchQuery = `songs for ${mood} mood`;
        const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: searchQuery,
                type: 'video',
                maxResults: 5,
                key: YOUTUBE_API_KEY
            }
        });
        const videos = youtubeResponse.data.items.map(item => ({
            title: item.snippet.title,
            description: item.snippet.description,
            videoId: item.id.videoId,
            thumbnail: item.snippet.thumbnails.default.url
        }));

        // Send vlog, image URLs, and YouTube videos as the response
        res.status(200).json({
            vlog,
            mood,
            imageUrls,
            videos
        });

    } catch (error) {
        console.error('Error generating vlog:', error);
        res.status(500).json({ error: 'Error generating vlog and fetching related videos.' });
    }
});


const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoibmlsb3kxMzE1IiwiYSI6ImNtMm11NzNxZzByNG8yanNna25tMnEzeHcifQ.ZziuaEr21WcrTMfjQf58Ww';

app.use(cors());

const directionsService = mbxDirections({ accessToken: MAPBOX_ACCESS_TOKEN });
const geocodingService = mbxGeocoding({ accessToken: MAPBOX_ACCESS_TOKEN });

const generateHighwayCoordinates = (start, end) => {
    return [
        { latitude: start.latitude, longitude: start.longitude },
        { latitude: (start.latitude + end.latitude) / 2, longitude: (start.longitude + end.longitude) / 2 },
        { latitude: end.latitude, longitude: end.longitude },
    ];
};

app.get('/api/route', async (req, res) => {
    try {
        const { sourceLat, sourceLng, destLat, destLng } = req.query;

        if (!sourceLat || !sourceLng || !destLat || !destLng) {
            return res.status(400).json({ error: 'Please provide source and destination coordinates' });
        }

        const start = { latitude: parseFloat(sourceLat), longitude: parseFloat(sourceLng) };
        const end = { latitude: parseFloat(destLat), longitude: parseFloat(destLng) };

        const highwayCoordinates = generateHighwayCoordinates(start, end);

        console.log('Fetching directions...');
        const response = await directionsService.getDirections({
            profile: 'driving',
            waypoints: highwayCoordinates.map(coord => ({
                coordinates: [coord.longitude, coord.latitude], // Mapbox requires [lng, lat]
            })),
        }).send();

        console.log(response);
        console.log('Directions response:', response.body);

        if (!response.body.routes || response.body.routes.length === 0) {
            return res.status(404).json({ error: 'No routes found' });
        }

        res.json(response.body.routes[0]);
    } catch (err) {
        console.error('Error fetching directions:', err);
        res.status(500).json({ error: 'Error fetching directions' });
    }
});

app.get('/api/place', async (req, res) => {
    try {
        const places = [];
        const { sourceLat, sourceLng, destLat, destLng } = req.query;

        const highwayCoordinates = generateHighwayCoordinates(
            { latitude: parseFloat(sourceLat), longitude: parseFloat(sourceLng) },
            { latitude: parseFloat(destLat), longitude: parseFloat(destLng) }
        );

        for (const coord of highwayCoordinates) {
            console.log(coord.longitude, coord.latitude);
            const response = await geocodingService.forwardGeocode({
                query: 'hotel, restaurant, Bangladesh', 
                proximity: [coord.longitude, coord.latitude],
                limit: 5,
            }).send();

            console.log(response);
            places.push(...response.body.features);
        }

        const uniquePlaces = Array.from(new Set(places.map(place => place.id)))
            .map(id => places.find(place => place.id === id));

        res.json(uniquePlaces);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching places' });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
