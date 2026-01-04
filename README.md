# 📚 Book Finder

A full-stack book management system built with React (Vite), Laravel 12, and Nginx, all orchestrated with Docker Compose.

## 🏗 Architecture Overview

The project uses a containerized microservices architecture:

- **Frontend**: React + TypeScript (Vite) running on port `5173`
- **Backend API**: Laravel 11 (PHP-FPM) running on port `9000`
- **Web Server / Proxy**: Nginx acting as a reverse proxy on port `8080`
- **Database**: MySQL 8.0 running on port `3307`

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Desktop
- Node.js (for local linting/types)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/wailman24/book-finder.git
cd book-finder
```

2. **Environment Setup:**

Create `.env` files in both directories.

- Frontend (`/front/.env`):

```env
VITE_API_URL=http://localhost:8080/api
```

- Backend (root folder) (`.env`):

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=book_finder
DB_USERNAME=xxxx
DB_PASSWORD=password
```

1. **Build and Run:**

```bash
docker compose up -d --build
```

1. **Database Migration**

```bash
docker exec bookfinder-app-1 php artisan migrate
```

## 🛠 API Endpoints

The Nginx proxy routes all `/api` requests to the Laravel container.

| Method | Endpoint              | Description                                      | Auth Required |
| ------ | --------------------- | ------------------------------------------------ | ------------- |
| `POST` | `/api/login`          | Authenticate user & return Sanctum token         | No            |
| `POST` | `/api/register`       | Create a new user account                        | No            |
| `GET`  | `/api/getbooks`       | Search books via query params (Google Books API) | Yes (Bearer)  |
| `POST` | `/api/savebook`       | Save a book to the database                      | Yes (Bearer)  |
| `GET`  | `/api/listbooks`      | Get paginated list of saved books                | Yes (Bearer)  |
| `GET`  | `/api/listfavorites`  | Get user's favorite books                        | Yes (Bearer)  |
| `POST` | `/api/togglefavorite` | Add/remove book from favorites                   | Yes (Bearer)  |

## 🔐 Authentication Flow

1. **Login**: Frontend sends credentials to `/api/login`
2. **Token**: Laravel validates and returns a Plain Text Token (Sanctum)
3. **Storage**: Frontend stores the token in `localStorage` and `AuthContext`
4. **Requests**: All subsequent API calls must include the header:
   ```
   Authorization: Bearer <token>
   ```

## 🐳 Docker Services Configuration

### Nginx (Reverse Proxy)

Nginx is configured to handle CORS preflight requests and pass `.php` requests to the app container.

```nginx
location ~ \.php$ {
    fastcgi_pass bookfinder-app-1:9000;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

## 🔧 Troubleshooting

- **502 Bad Gateway**: Check if `bookfinder-app-1` is running and the name matches in `nginx.conf`
- **401 Unauthorized**: Ensure the `Authorization` header is not `undefined` in the browser Network tab
- **CORS Error**: Ensure Nginx is sending `Access-Control-Allow-Origin: http://localhost:5173`
- **Module not found**: Run `npm install` in the frontend directory
- **Database connection failed**: Verify database credentials in backend `.env` match docker-compose settings

## 📦 Project Structure

```
.
├── book-finder/            # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # API Controllers
│   │   │   └── Resources/    # API Resources
│   │   └── Models/           # Eloquent Models
│   ├── routes/
│   │   └── api.php          # API Route definitions
│   ├── database/
│   │   └── migrations/      # Database migrations
│   └── .env
├── front/              # React Frontend
│   ├── src/
│   │   ├── components/      # UI Components (Shadcn)
│   │   │   ├── ui/          # Shadcn base components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── BooksPage.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   └── AdminBookSearchPage.tsx
│   │   ├── contexts/        # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── routes/          # Route configuration
│   │   │   └── index.tsx
│   │   └── types/           # TypeScript types
│   └── .env
├── .env  #db
├── nginx.conf          # Nginx configuration
└── docker-compose.yml      # Container orchestration
```

## 👥 User Roles

### Regular User

- View all saved books
- Add books to favorites
- View their favorites list

### Admin User

- All regular user permissions
- Search for books using Google Books API
- Add new books to the database

## 🧪 Testing

The backend includes comprehensive feature tests using PHPUnit and Laravel's testing framework.

### Running Tests

```bash
# Run all tests
docker exec bookfinder-app-1 php artisan test

# Run specific test file
docker exec bookfinder-app-1 php artisan test tests/Feature/FavoriteBooksTest.php
```

### Test Coverage

- **Favorite Books Feature Tests**: Validates that authenticated users can list their favorites and unauthenticated users receive 401 responses
- **Authentication Testing**: Ensures Sanctum middleware properly protects routes
- **Database Relationships**: Tests many-to-many relationships between users and favorite books
- All tests use `RefreshDatabase` trait for isolated test environments

## 🎨 Frontend Features

- **Authentication System**: Login/Register with JWT tokens
- **Protected Routes**: Role-based access control
- **Responsive Design**: Mobile-first using Tailwind CSS
- **shadcn/ui Components**: Modern, accessible UI components
- **Pagination**: Efficient browsing of large book collections
- **Error Handling**: User-friendly error messages

