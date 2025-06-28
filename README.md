# 🌾 Agri-Data API

A modern RESTful API for comprehensive agricultural data management, designed for producers, fields, observations, and yield reports.

## 📋 Table of Contents

- [🚀 Key Features](#-key-features)
- [🛠️ Technologies](#️-technologies)
- [⚙️ Configuration](#️-configuration)
- [🔗 API Endpoints](#-api-endpoints)
- [🔐 Authentication](#-authentication)
- [📝 Available Scripts](#-available-scripts)
- [🗂️ Project Structure](#-project-structure)

## 🚀 Key Features

✅ **Producer Management** - Registration and management of agricultural producers  
✅ **Field Management** - Creation and management of georeferenced fields  
✅ **Observations** - Field observation recording with image support  
✅ **Task System** - Planning and tracking of agricultural tasks  
✅ **Yield Reports** - Productivity analysis and reporting  
✅ **JWT Authentication** - Secure authentication and authorization system  
✅ **File Upload** - Support for images and documents  

## 🛠️ Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | Latest | JavaScript Runtime |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | ^5.1.0 | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | 5.5 | Primary Database |
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) | ^2.50.1 | Additional Services |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | ^9.0.2 | Authentication |

### Main Dependencies
- **Express.js** - Minimalist and flexible web framework
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password encryption
- **jsonwebtoken** - JWT token handling
- **multer** - File upload
- **cors** - CORS configuration
- **dotenv** - Environment variables

## ⚙️ Configuration

Create a `.env` file in the project root with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/agri-data
DB_NAME=agri-data

# JWT
JWT_SECRET=your_very_secure_jwt_secret
JWT_EXPIRES_IN=7d

# Supabase (optional)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Port
PORT=4000
```

## 🔗 API Endpoints

### 🔐 Authentication
```
POST /api/login              # Login
POST /api/refresh-token      # Refresh token
```

### 👨‍🌾 Producers
```
GET    /api/producers        # Get all producers
POST   /api/producers        # Create new producer
GET    /api/producers/:id    # Get producer by ID
```

### 🌾 Fields
```
GET    /api/fields           # Get all fields
POST   /api/fields           # Create new field (requires authentication)
GET    /api/fields/search/:name # Search fields by name
```

### 📊 Observations
```
POST   /api/observations                    # Create new observation (requires authentication + file upload)
PUT    /api/observations/:observationId    # Update observation (requires authentication + file upload)
DELETE /api/observations/:observationId    # Delete observation (requires authentication)
GET    /api/observations/field/:fieldId    # Get observations by field (requires authentication)
```

> **Note:** Observation endpoints support multiple file uploads for images using `multipart/form-data`

### ✅ Tasks
```
POST   /api/tasks                          # Create new task (requires authentication)
PUT    /api/tasks/:taskId/status           # Update task status (requires authentication)
DELETE /api/tasks/:taskId                  # Delete task (requires authentication)
GET    /api/tasks/field/:fieldId           # Get tasks by field (requires authentication)
GET    /api/tasks/:taskId                  # Get task by ID (requires authentication)
```

### 📈 Yield Reports
```
POST   /api/yields                         # Create new yield report (requires authentication)
PUT    /api/yields/:yieldId                # Update yield report (requires authentication)
DELETE /api/yields/:yieldId                # Delete yield report (requires authentication)
GET    /api/yields/field/:fieldId          # Get yields by field (requires authentication)
```

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### Authentication process:
1. Send credentials to `/api/login`
2. Receive a JWT token
3. Include the token in the `Authorization: Bearer <token>` header

### Usage example:
```javascript
// Login
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token } = await response.json();

// Use token in subsequent requests
const fields = await fetch('/api/fields', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🗂️ Project Structure

```
TP2-Agri-Data-Api/
├── 📁 src/
│   ├── 📁 config/          # Configurations
│   │   ├── db.js           # MongoDB connection
│   │   └── supabase.js     # Supabase configuration
│   ├── 📁 controllers/     # Business logic
│   ├── 📁 middlewares/     # Custom middlewares
│   ├── 📁 models/          # Data models
│   └── 📁 routes/          # API routes
├── 📄 server.js            # Entry point
├── 📄 package.json         # Dependencies and scripts
└── 📄 README.md           # This file
```

## 📞 Contact

**Developer:** [JoacoDarquier](https://github.com/JoacoDarquier)  
**Repository:** [TP2-Agri-Data-Api](https://github.com/JoacoDarquier/TP2-Agri-Data-Api)

---

<div align="center">
  <p>⭐ Don't forget to star the project if you found it useful! ⭐</p>
  <p>Made with ❤️ for the agricultural community</p>
</div>