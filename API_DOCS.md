# Stayo API Documentation (Member 1 Scope)

## Authentication

### Register a User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:** `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "role": "guest" }`
- **Response:** `201 Created` - Returns user data.

### Login a User
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:** `{ "email": "john@example.com", "password": "password123" }`
- **Response:** `200 OK` - Returns JWT token and user data.

## Hotels

### Get All Hotels
- **URL:** `/api/hotels`
- **Method:** `GET`
- **Response:** `200 OK` - Returns list of hotels.

### Search Availability
- **URL:** `/api/hotels/search`
- **Method:** `GET`
- **Query Params:** `hotelId`, `checkInDate`, `checkOutDate`, `guests`
- **Response:** `200 OK` - Returns available room types with counts.

### Create Hotel (Admin)
- **URL:** `/api/hotels`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "name": "Grand Hotel", "city": "New York", "amenities": ["Pool", "WiFi"] }`
- **Response:** `201 Created`

## Room Types

### Create Room Type (Admin)
- **URL:** `/api/room-types`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "hotelId": "...", "name": "Deluxe", "basePrice": 200, "totalRooms": 10, "capacity": 2 }`
- **Response:** `201 Created`

### Get Room Types
- **URL:** `/api/room-types`
- **Method:** `GET`
- **Query Params:** `hotelId` (optional)
- **Response:** `200 OK`

## Rooms

### Create Room (Admin)
- **URL:** `/api/rooms`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "roomTypeId": "...", "roomNumber": "101" }`
- **Response:** `201 Created`

### Get Rooms (Admin)
- **URL:** `/api/rooms`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `roomTypeId` (optional)
- **Response:** `200 OK`
