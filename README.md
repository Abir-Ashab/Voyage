# Voyage  

## Overview  
**Voyage** is a web application that integrates multiple APIs like **Ollama**, **Firebase**, **MinIO**, **Mapleaf**, **Weather API**, and **YouTube API** to provide seamless features for managing travel images, tours, and blog generation.  

---

## Features  
1. **Image Management**  
   - Upload and store images on the **MinIO** server.  
   - Save image URLs in **MongoDB**.  

2. **User Authentication**  
   - Implemented a secure authentication system using **Firebase**.  

3. **Search Images by Text**  
   - Search uploaded images using text queries powered by the **Ollama Vision Model**.  

4. **Tour Planning**  
   - Calculate distances, estimated travel costs, and find hotels & restaurants between the source and destination using the **Mapleaf API**.  

5. **Weather Updates**  
   - Get real-time weather updates for your selected destination using the **Weather API**.  

6. **Blog Generation**  
   - Automatically generate tour blogs using the **Ollama** language model.  

7. **Music Suggestions**  
   - Suggest music based on the images uploaded during your tour using the **YouTube API**.  

---

## Technologies Used  
- **Frontend:** React, Tailwind  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Storage:** MinIO  
- **Authentication:** Firebase  
- **APIs:** Ollama, Mapleaf, Weather API, YouTube API  

---

## Setup Instructions  
1. Clone the repository.  
   ```bash
   git clone https://github.com/Abir-Ashab/Voyage.git
   cd voyage
   ```  
2. Install dependencies.  
   ```bash
   npm install
   ```  
3. Add environment variables for your API keys and configurations.  
4. Start the development server.  
   ```bash
   npm start
   ```  

---

## Future Enhancements  
- Improve the blog generation feature with advanced customization options.  
- Add a trip-sharing functionality for users.  
- Integrate more map providers for better coverage.  

---

## Author  
[**Your Name**](https://github.com/Abir-Ashab/)  

---