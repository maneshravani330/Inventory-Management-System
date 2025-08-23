# Inventory Management System

> **Complete Full-Stack Inventory Management Solution with React Frontend and Spring Boot Backend**

A modern, responsive inventory management system built with React 18.2.0 (TypeScript) frontend and Spring Boot backend, featuring comprehensive POS functionality and Indian Rupee (₹) currency support.

## 🚀 Latest Updates (v2.0.0)

- ✅ **Complete migration** from Angular to React with TypeScript
- ✅ **Currency localization** from USD to Indian Rupee (₹)
- ✅ **Enhanced POS system** with real-time cart functionality
- ✅ **Material-UI design system** for professional interface
- ✅ **Improved dashboard** with statistics and charts

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Axios** for API communication
- **React Context** for state management

### Backend
- **Spring Boot 3.3.5** with Java
- **Spring Security** with JWT authentication
- **JPA/Hibernate** for database operations
- **MySQL** database
- **Maven** for dependency management

## ✨ Key Features

### 🏪 Point of Sale (POS) System
- Real-time shopping cart with quantity controls
- Dynamic pricing with editable unit prices
- Stock validation to prevent overselling
- Customer information capture
- Bulk transaction processing

### 📦 Inventory Management
- Product CRUD operations with image upload
- Category and supplier management
- Stock level monitoring with alerts
- Low stock notifications

### 📊 Dashboard & Analytics
- Real-time statistics display
- Recent transactions overview
- Monthly transaction charts
- Category-wise product distribution

### 👥 User Management
- Role-based access control (Admin/User)
- JWT-based authentication
- Protected routes and components
- User profile management

### 💰 Financial Management
- Indian Rupee (₹) currency support
- Purchase order management
- Sales transaction tracking
- Transaction history and details

## ⚡ Quick Start (TL;DR)

```bash
# 1. Clone repository
git clone https://github.com/navingohite/Inventory_Management_System.git
cd Inventory_Management_System

# 2. Setup MySQL database
mysql -u root -p -e "CREATE DATABASE inventory_db;"

# 3. Configure backend (edit backend/src/main/resources/application.properties)
# Update database credentials

# 4. Start backend
cd backend && mvn spring-boot:run &

# 5. Start frontend
cd ../frontend && npm install && npm start

# 6. Access application at http://localhost:3000
# Login: admin@gmail.com / admin123
```

## 🚀 Getting Started

### Prerequisites
Before starting, ensure you have the following installed on your system:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Java JDK** (v11 or higher) - [Download here](https://adoptium.net/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Maven** (v3.6 or higher) - [Download here](https://maven.apache.org/download.cgi)
- **Git** - [Download here](https://git-scm.com/downloads)

### 📋 Step-by-Step Installation Guide

#### Step 1: Clone the Repository
```bash
# Clone the repository
git clone https://github.com/navingohite/Inventory_Management_System.git

# Navigate to project directory
cd Inventory_Management_System
```

#### Step 2: Database Setup
```bash
# 1. Start MySQL service (varies by OS)
# Windows: net start mysql
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql

# 2. Login to MySQL
mysql -u root -p

# 3. Create database
CREATE DATABASE inventory_db;

# 4. Create a user (optional but recommended)
CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON inventory_db.* TO 'inventory_user'@'localhost';
FLUSH PRIVILEGES;

# 5. Exit MySQL
EXIT;

# 6. Optional: Load sample data
mysql -u root -p inventory_db < dummy_data.sql
```

#### Step 3: Backend Configuration
```bash
# Navigate to backend directory
cd backend

# Configure database connection
# Edit src/main/resources/application.properties
```

**Update `application.properties` with your database credentials:**
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=inventory_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=false

# Server Configuration
server.port=5050

# JWT Configuration (keep this secret secure)
secreteJwtString=your-super-secret-jwt-key-minimum-32-characters

# CORS Configuration
cors.allowed.origins=http://localhost:3000
```

#### Step 4: Start Backend Server
```bash
# Install dependencies and compile
mvn clean install

# Start Spring Boot application
mvn spring-boot:run

# Alternative: Run with specific profile
# mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend server will start on:** `http://localhost:5050`

**Verify backend is running:**
- Open browser and go to `http://localhost:5050/api/products/all`
- You should see a 401 Unauthorized response (this is expected without authentication)

#### Step 5: Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start React development server
npm start
```

**Frontend application will start on:** `http://localhost:3000`

**The browser should automatically open. If not, manually navigate to:**
`http://localhost:3000`

#### Step 6: First Login
Use these default credentials to access the system:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- **Role:** `ADMIN`

### 🔧 Troubleshooting Common Issues

#### Database Connection Issues
```bash
# Check if MySQL is running
# Windows: sc query mysql
# macOS/Linux: sudo systemctl status mysql

# Test database connection
mysql -u inventory_user -p inventory_db -e "SELECT 1;"
```

#### Backend Issues
```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Clean and rebuild
mvn clean compile

# Check if port 5050 is available
netstat -an | grep 5050
```

#### Frontend Issues
```bash
# Check Node.js version
node -v
npm -v

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is available
netstat -an | grep 3000
```

### 🌐 Alternative Database Setup (Using Docker)
```bash
# Run MySQL in Docker container
docker run --name inventory-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=inventory_db \
  -e MYSQL_USER=inventory_user \
  -e MYSQL_PASSWORD=your_password \
  -p 3306:3306 \
  -d mysql:8.0

# Wait for container to start (about 30 seconds)
# Then load sample data
docker exec -i inventory-mysql mysql -u inventory_user -pyour_password inventory_db < dummy_data.sql
```

### 🔄 Development Workflow

#### Starting the Application
1. **Start MySQL** (if not running)
2. **Start Backend:** `cd backend && mvn spring-boot:run`
3. **Start Frontend:** `cd frontend && npm start`
4. **Access Application:** `http://localhost:3000`

#### Making Changes
- **Backend changes:** Server auto-restarts with Spring Boot DevTools
- **Frontend changes:** Hot reload enabled by default
- **Database changes:** Use Hibernate DDL auto-update or manual migrations

### 📱 Production Deployment

#### Backend Deployment
```bash
# Build production JAR
mvn clean package -DskipTests

# Run production JAR
java -jar target/inventory-management-*.jar
```

#### Frontend Deployment
```bash
# Build production files
npm run build

# Serve with any web server (example with serve)
npx serve -s build -l 3000
```

### 🔐 Environment Variables

#### Backend Environment Variables
```bash
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/inventory_db
DB_USERNAME=inventory_user
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Server Configuration
SERVER_PORT=5050

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

#### Frontend Environment Variables
Create `.env` file in frontend directory:
```bash
# API Base URL
REACT_APP_API_URL=http://localhost:5050/api

# App Configuration
REACT_APP_NAME=Inventory Management System
REACT_APP_VERSION=2.0.0
```

### 🔧 Configuration Files

#### Backend Configuration (`application.properties`)
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=false

# Server Configuration
server.port=5050

# JWT Configuration
secreteJwtString=your-super-secret-jwt-key-minimum-32-characters

# CORS Configuration
cors.allowed.origins=http://localhost:3000
```

### ✅ Verification Steps

#### Backend Health Check
```bash
# Check if backend is running
curl http://localhost:5050/api/products/all

# Expected response: 401 Unauthorized (normal without auth)
```

#### Frontend Health Check
```bash
# Check if frontend is accessible
curl http://localhost:3000

# Expected response: HTML content of React app
```

#### Database Health Check
```bash
# Test database connection
mysql -u inventory_user -p inventory_db -e "SHOW TABLES;"

# Expected response: List of database tables
```

### 💡 Helpful Tips

#### Development Tips
- **Hot Reload**: Both frontend and backend support hot reload during development
- **Database Tools**: Use MySQL Workbench or phpMyAdmin for easier database management
- **API Testing**: Use Postman or curl to test API endpoints
- **Debugging**: Enable `spring.jpa.show-sql=true` to see SQL queries in backend logs

#### Common Commands
```bash
# Backend commands
mvn clean install          # Clean and build
mvn spring-boot:run       # Start development server
mvn test                  # Run tests
mvn package              # Build production JAR

# Frontend commands
npm start                # Start development server
npm run build           # Build for production
npm test                # Run tests
npm run lint            # Check code quality
```

#### Port Information
- **Frontend (React)**: http://localhost:3000
- **Backend (Spring Boot)**: http://localhost:5050
- **Database (MySQL)**: localhost:3306

#### Default Admin Access
After successful setup, you can access the admin panel with:
- **URL**: http://localhost:3000
- **Username**: admin@gmail.com
- **Password**: admin123

## 📁 Project Structure

```
Inventory_Management_System/
├── .gitignore              # Git ignore patterns
├── CHANGELOG.md           # Version history and changes
├── DUMMY_DATA_README.md   # Sample data documentation
├── README.md             # Project documentation (this file)
├── dummy_data.sql        # Sample database data
├── setup_db.sql         # Database schema setup
├── backend/             # Spring Boot Backend
│   ├── .mvn/           # Maven wrapper
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/    # Java source code
│   │   │   └── resources/ # Configuration files
│   │   └── test/       # Test files
│   ├── mvnw           # Maven wrapper script (Unix)
│   ├── mvnw.cmd       # Maven wrapper script (Windows)
│   ├── pom.xml        # Maven dependencies
│   └── HELP.md        # Spring Boot help
└── frontend/           # React Frontend
    ├── public/         # Static assets
    │   ├── index.html  # Main HTML template
    │   ├── favicon.ico # App icon
    │   └── manifest.json # PWA manifest
    ├── src/
    │   ├── components/ # Reusable React components
    │   │   ├── Layout/          # Main layout component
    │   │   └── ProtectedRoute/  # Route protection
    │   ├── contexts/   # React Context providers
    │   │   └── AuthContext.tsx  # Authentication context
    │   ├── pages/      # Page-level components
    │   │   ├── Dashboard/       # Dashboard page
    │   │   ├── Products/        # Product management
    │   │   ├── Sell/           # POS system
    │   │   ├── Purchase/       # Purchase management
    │   │   ├── Transactions/   # Transaction history
    │   │   ├── Categories/     # Category management
    │   │   ├── Suppliers/      # Supplier management
    │   │   ├── Login/          # Login page
    │   │   ├── Register/       # Registration page
    │   │   └── Profile/        # User profile
    │   ├── services/   # API service layer
    │   │   └── apiService.ts   # Main API client
    │   ├── App.tsx     # Main React component
    │   ├── index.tsx   # React entry point
    │   └── index.css   # Global styles
    ├── package.json    # NPM dependencies
    └── tsconfig.json   # TypeScript configuration
```

## 🔐 Default Login Credentials

- **Email**: admin@gmail.com
- **Password**: admin123
- **Role**: ADMIN

## 🌟 Features Overview

### Admin Dashboard
- Total products, categories, suppliers, transactions
- Recent transactions with INR currency formatting
- Monthly transaction trends
- Low stock alerts

### Product Management
- Add/Edit products with image upload
- Category assignment and management
- Stock quantity tracking
- Price management in Indian Rupees

### Sales & Purchase
- Complete POS interface for sales
- Bulk purchase order processing
- Real-time stock validation
- Transaction history tracking

### Reports & Analytics
- Transaction filtering and search
- Monthly/yearly reports
- Category-wise analytics
- Stock level reports

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products/all` - Get all products
- `POST /api/products/add` - Add new product
- `PUT /api/products/update/{id}` - Update product
- `DELETE /api/products/delete/{id}` - Delete product

### Transactions
- `POST /api/transactions/sell` - Create sale transaction
- `POST /api/transactions/purchase` - Create purchase transaction
- `GET /api/transactions/all` - Get all transactions
- `GET /api/transactions/by-month-year` - Get monthly transactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

**Navin Gohite**
- GitHub: [@navingohite](https://github.com/navingohite)
- Email: navingohite@gmail.com

---

⭐ **Star this repository if you found it helpful!**
