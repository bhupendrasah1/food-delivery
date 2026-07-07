# 🍔 Vingo - Full Stack Food Delivery Application

Vingo is a modern full-stack food delivery web application that connects customers, restaurant owners, and delivery partners on one platform. Users can browse restaurants, order food, track orders, while restaurant owners manage menus and delivery partners handle deliveries.

---

# ✨ Features

## 👤 User Features
- 🔐 Secure Authentication (Google OAuth + JWT)
- 🍕 Browse restaurants and food items
- 🔍 Search and filter food
- 🛒 Add items to cart
- 💳 Place food orders
- 📦 Track order status
- ❤️ Save favorite restaurants
- 👤 Manage profile

## 🍽 Restaurant Owner Features
- Restaurant dashboard
- Add, edit, and delete food items
- Upload food images
- Manage incoming orders
- Update order status
- View sales information

## 🚚 Delivery Partner Features
- Delivery dashboard
- View assigned orders
- Accept delivery requests
- Update delivery status
- Mark orders as delivered

## 🛡 Admin Features
- Manage users
- Manage restaurants
- Manage food items
- Manage orders
- View platform statistics

---

# 🚀 Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React Icons

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL
- Neon PostgreSQL

## Authentication
- Google OAuth 2.0
- JWT Authentication

## File Upload
- Multer
- Cloudinary (optional)

## Deployment
- Frontend: Vercel
- Backend: Vercel
- Database: Neon PostgreSQL

---

# 📁 Project Structure

```
food-delivery/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├
│   │   
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/vingo.git
cd vingo
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

DATABASE_URL=your_neon_postgresql_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:5173
```


## Start Backend

```bash
npm run dev
```

Backend will run at

```
http://localhost:5000
```

---

# Frontend Setup

Navigate to frontend

```bash
cd ../frontend
```

Install packages

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend

```bash
npm run dev
```

Frontend will run at

```
http://localhost:5173
```

---

# 🗄 Database

This project uses

- PostgreSQL
- Neon Serverless PostgreSQL



# 🔐 Authentication

The project supports

- Google OAuth Login
- JWT Authentication
- Protected Routes
- Role-Based Authorization

Roles include

- User
- Restaurant Owner
- Delivery Partner
- Admin

---

# 📦 API Modules

- Authentication
- Users
- Restaurants
- Foods
- Categories
- Cart
- Orders
- Payments
- Delivery
- Reviews
- Favorites

---

# 🌍 Deployment

## Frontend

Deploy using

- Vercel

## Backend

Deploy using

- Vercel

## Database

Hosted on

- Neon PostgreSQL

---

# 🛠 Future Improvements

- Online payment integration
- Real-time order tracking
- Push notifications
- Live delivery location
- Coupons and discounts
- Restaurant analytics
- Rating & review system
- AI food recommendations

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Bhupendra Sah**

If you like this project, don't forget to ⭐ star the repository!

```

### This README includes

- ✅ Professional GitHub style
- ✅ Easy for beginners to understand
- ✅ PostgreSQL + Neon 
- ✅ Clear installation steps
- ✅ Project structure
- ✅ Environment variable examples
- ✅ Deployment instructions
- ✅ Future roadmap
- ✅ Contribution guide
- ✅ Clean formatting suitable for GitHub
```