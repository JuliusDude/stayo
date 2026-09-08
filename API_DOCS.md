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

---

# Member 2 Scope: Booking Workflow, Dynamic Pricing, Status Management, Check-in/Check-out

## Pricing Rules

### Create Pricing Rule (Admin)
- **URL:** `/api/pricing-rules`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "roomTypeId": "...", "season": "weekend", "multiplier": 1.5, "startDate": "2026-12-05", "endDate": "2026-12-07" }`
- **Response:** `201 Created`

### Get Pricing Rules
- **URL:** `/api/pricing-rules`
- **Method:** `GET`
- **Query Params:** `roomTypeId` (optional)
- **Response:** `200 OK`

### Update / Delete Pricing Rule (Admin)
- **URL:** `/api/pricing-rules/:id`
- **Method:** `PUT` / `DELETE`
- **Headers:** `Authorization: Bearer <token>`

## Bookings

### Create Booking (Guest)
- **URL:** `/api/bookings`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "roomTypeId": "...", "checkInDate": "2026-12-04", "checkOutDate": "2026-12-08" }`
- **Behavior:** Auto-assigns an available room of the requested type (rejecting with `409` if none are free for the date range), calculates `totalAmount` via any matching Dynamic Pricing rules, creates the booking with status `Reserved`.
- **Response:** `201 Created`

### Get All Bookings (Staff/Admin)
- **URL:** `/api/bookings`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `status`, `hotelId` (optional)
- **Response:** `200 OK`

### Get Booking By Id
- **URL:** `/api/bookings/:id`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Owner guest, or staff/admin. Others get `403`.

### Confirm Booking (Staff/Admin)
- **URL:** `/api/bookings/:id/confirm`
- **Method:** `PUT`
- **Valid transition:** `Reserved → Confirmed`

### Check-in (Staff)
- **URL:** `/api/bookings/:id/checkin`
- **Method:** `PUT`
- **Valid transition:** `Confirmed → Checked-in` (sets `actualCheckInAt`)

### Check-out (Staff)
- **URL:** `/api/bookings/:id/checkout`
- **Method:** `PUT`
- **Valid transition:** `Checked-in → Checked-out` (sets `actualCheckOutAt`)

### Cancel Booking (Owner Guest, Staff, or Admin)
- **URL:** `/api/bookings/:id/cancel`
- **Method:** `PUT`
- **Body:** `{ "reason": "Change of plans" }` (optional)
- **Valid transitions:** `Reserved → Cancelled`, `Confirmed → Cancelled`
- **Note:** Sets `cancellation.cancelledAt` and `cancellation.reason`. `refundAmount` is intentionally left unset — that calculation belongs to Member 3's Cancellation & Refund Policy Engine module.

Invalid status transitions (e.g. checking out a `Reserved` booking) return `409` with `errorCode: "..."` and a message naming the invalid transition, rather than silently applying it.

