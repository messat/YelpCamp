# YelpCamp

## Project Title
YelpCamp: Explore and share campgrounds worldwide.

## Project Description
YelpCamp is a global platform designed for campground enthusiasts. It allows users to explore, share, and manage campgrounds through an intuitive interface. Users can view campgrounds on an interactive map or browse detailed listings. Features like user authentication, image uploads, and map integration create a comprehensive experience for users.

### Why This Project?
This project was built to provide a centralised platform for camping enthusiasts to share and discover campgrounds. 

### Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js
- **File Storage**: Cloudinary
- **Map Integration**: Mapbox

### Challenges and Future Features
- **Challenges Faced**: Implementing secure image uploads and map integration.
- **Future Features**:
  - Advanced search and filtering options.
  - User reviews and rating system.
  - Offline access to campground data.
  - Implementing accessibility features to ensure it is usable for all users

## Table of Contents
1. [Project Title](#project-title)
2. [Project Description](#project-description)
3. [Table of Contents](#table-of-contents)
4. [How to Install and Run the Project](#how-to-install-and-run-the-project)
5. [How to Use the Project](#how-to-use-the-project)
6. [Contributing](#contributing)

## How to Install and Run the Project

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)
- Mapbox account (for map API access)

### Installation Steps

1. **Clone the Repository**:
   ```CLI
   git clone https://github.com/messat/yelpcamp.git
   cd yelpcamp
   ```

2. **Install Dependencies**:
   ```CLI
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root of the project and add the following:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   MAPBOX_TOKEN=your_mapbox_token
   DATABASE_URL=mongodb://localhost:27017/yelpcamp
   ```

4. **Get Your Cloudinary API Credentials**:
   - Sign up at [Cloudinary](https://cloudinary.com/) and log in to your account.
   - Navigate to the **Dashboard** to find your **Cloud Name**, **API Key**, and **API Secret**.
   - Use these values to populate the `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` fields in your `.env` file.

5. **Get Your Mapbox API Token**:
   - Sign up at [Mapbox](https://mapbox.com/) and log in to your account.
   - Navigate to the **Account** section to create a new API token.
   - Copy the generated token and add it to the `MAPBOX_TOKEN` field in your `.env` file.

6. **Run MongoDB**:
   If you're using a local MongoDB, start the MongoDB server:
   ```CLI
   mongosh
   ```

7. **Seed the Database (Optional)**:
   Populate the database with sample data:
   ```CLI
   node seeds/index.js
   ```

8. **Start the Development Server**:
   Run the application locally:
   ```CLI
   npm run dev
   ```
   Access the application at `http://localhost:3000`.

## How to Use the Project

1. **Explore Campgrounds**:
   - Use the interactive map or browse the list of campgrounds.

2. **Add a Campground**:
   - Register or log in to create your own campground entries.

3. **Edit or Delete Campgrounds**:
   - Manage your added campgrounds after logging in.

### Visual Aids
- **Map Integration**: Interactive map powered by Mapbox.
- **Campground Details**: View detailed campground information, including images and descriptions.

## Contributing
Contributions are welcome! Follow these steps to contribute:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.