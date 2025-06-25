# E-Commerce API Documentation

## Base URL
`http://localhost:8000/api/`

## Authentication

### Register User
- **URL**: `/auth/register/`
- **Method**: `POST`
- **Description**: Create a new user account
- **Request Body**:
  {
    "username": "string (required, unique)",
    "email": "string (required, valid email)",
    "password": "string (required, min 8 chars)"
  }
Success Response: 201 Created


{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com"
}
Error Responses:

400 Bad Request - Invalid data or missing fields

409 Conflict - Username or email already exists

Login
URL: /auth/login/

Method: POST

Description: Authenticate and receive JWT tokens

Request Body:


{
  "username": "string (required)",
  "password": "string (required)"
}
Success Response: 200 OK


{
  "refresh": "string (JWT refresh token)",
  "access": "string (JWT access token)"
}
Error Responses:

400 Bad Request - Missing credentials

401 Unauthorized - Invalid credentials

Products
List Products
URL: /products/

Method: GET

Description: Get all available products

Success Response: 200 OK


[
  {
    "id": 1,
    "name": "Product 1",
    "description": "Product description",
    "price": "10.00",
    "category": 1,
    "average_rating": 4.5
  }
]
Rate Product
URL: /products/{id}/rate/

Method: POST

Description: Submit a rating for a product

Headers:

Authorization: Bearer {access_token}

Request Body:


{
  "rating": "integer (required, 1-5)"
}
Success Response: 200 OK


{
  "id": 1,
  "name": "Product 1",
  "average_rating": 4.5
}
Error Responses:

400 Bad Request - Invalid rating value

401 Unauthorized - Missing/invalid token

404 Not Found - Product not found

Orders & Cart
Add to Cart
URL: /orders/cart/add/

Method: POST

Description: Add product to user's cart

Headers:

Authorization: Bearer {access_token}

Request Body:


{
  "product": "integer (required, product ID)",
  "quantity": "integer (optional, default 1)"
}
Success Response: 201 Created


{
  "id": 1,
  "product": 1,
  "quantity": 2,
  "price": "10.00"
}
Create Order
URL: /orders/

Method: POST

Description: Convert cart items to an order

Headers:

Authorization: Bearer {access_token}

Success Response: 201 Created


{
  "id": 1,
  "total": "20.00",
  "status": "pending",
  "items": [
    {
      "product": 1,
      "quantity": 2,
      "price": "10.00"
    }
  ]
}
Error Responses:

400 Bad Request - Cart is empty

401 Unauthorized - Missing/invalid token