# Stayo — Hotel Booking & Property Management Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68A063?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-black?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT Auth](https://img.shields.io/badge/JWT-Stateless%20Auth-000000?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Postman Tested](https://img.shields.io/badge/Postman-Verified%20Collections-FF6C37?style=flat&logo=postman&logoColor=white)](https://www.postman.com/)

**Stayo** is a production-grade, all-in-one hospitality reservation and property management backend platform. It connects guests searching for curated accommodations with hotel operators managing inventory, staff check-in workflows, dynamic seasonal pricing, housekeeping operations, itemized invoicing, and business intelligence reporting.

---

## 📌 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [System Roles & Access Control](#-system-roles--access-control)
- [Feature Modules Breakdown](#-feature-modules-breakdown)
- [Booking State Machine](#-booking-state-machine)
- [Database Schema & Relationships](#-database-schema--relationships)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Installation & Getting Started](#-installation--getting-started)
- [Testing with Postman](#-testing-with-postman)
- [Project Structure](#-project-structure)
- [Security & Validation](#-security--validation)
- [Contributors](#-contributors)

---

## 🏛 Overview & Architecture

Stayo strictly adheres to the **Model-View-Controller (MVC)** architectural pattern, enforcing separation of concerns, defensive programming, and centralized error handling across all requests.

```
Client / Postman / Mobile App
             │
             ▼
      routes/*.js              <── express-validator & HTTP routing
             │
             ▼
    middleware/auth.js         <── JWT verification & RBAC authorization
             │
             ▼
   controllers/*.js            <── Request lifecycle & response formatting
             │
             ▼
     utils/*.js                <── Pure business domain math (pricing & refunds)
             │
             ▼
     models/*.js               <── Mongoose schemas & MongoDB indexing
             │
             ▼
       MongoDB Atlas           <── Persistent cloud database
```

---

## 👥 System Roles & Access Control

Role-Based Access Control (RBAC) is implemented via cryptographically signed JWT tokens:

| Role | Permissions & Scope |
|---|---|
| **Guest** | Search room availability, create reservations, view personal booking history, cancel bookings, view generated invoices. |
| **Hotel Staff** | Process guest check-ins with immutable timestamps, execute check-outs, update real-time room housekeeping statuses (`clean`, `dirty`, `maintenance`). |
| **Admin** | Register hotel properties, configure room types & capacities, manage physical room inventories, define dynamic seasonal pricing rules, view occupancy & revenue reports. |

---

## 🚀 Feature Modules Breakdown

All **13 functional modules** are fully implemented, validated, and tested:

| # | Module | Core Capability | Responsible Controller / Utility |
|---|---|---|---|
| **1** | **Guest Registration & Auth** | Salted bcrypt password hashing, stateless JWT issuance, profile retrieval | `controllers/authController.js` |
| **2** | **Hotel Management** | Property CRUD, geographical mapping, amenity tagging, rating metrics | `controllers/hotelController.js` |
| **3** | **Inventory Management** | Room type definition, base rates, room mapping, capacity enforcement | `controllers/roomTypeController.js`, `roomController.js` |
| **4** | **Availability Search** | Non-overlapping date range boundary checks, guest count capacity matching | `controllers/availabilityController.js` |
| **5** | **Reservation Workflow** | Double-booking prevention, stay rate multi-night calculation | `controllers/bookingController.js` |
| **6** | **Dynamic Pricing** | Date-bounded multiplier rules applied per room type during reservation | `utils/pricingCalculator.js` |
| **7** | **Booking Lifecycle** | Strict finite state machine governing status progression | `controllers/bookingController.js` |
| **8** | **Check-in / Check-out** | Physical arrival/departure timestamping (`actualCheckInAt`, `actualCheckOutAt`) | `controllers/bookingController.js` |
| **9** | **Housekeeping Tracking** | Operational room cleanliness toggling (`clean` / `dirty` / `maintenance`) | `controllers/housekeepingController.js` |
| **10** | **Cancellation & Refunds** | Automated tiered refund calculation based on days to check-in (100% / 50% / 0%) | `utils/refundCalculator.js` |
| **11** | **Guest Booking History** | Isolated personal reservation history for authenticated guests | `controllers/historyController.js` |
| **12** | **Invoice Generation** | Itemized breakdown of stay cost, dynamic taxes (10%), add-ons, and net refund | `controllers/invoiceController.js` |
| **13** | **Admin Analytics Reports** | Property-level occupancy percentage and revenue aggregation | `controllers/reportController.js` |

---

## 🔄 Booking State Machine

Reservations follow a strictly enforced lifecycle state machine:

```text
               ┌───────────┐
               │ Reserved  │
               └─────┬─────┘
                     │ (Staff/Admin Confirmation)
                     ▼
               ┌───────────┐
               │ Confirmed │
               └─────┬─────┘
                     │ (Physical Guest Arrival)
                     ▼
               ┌───────────┐
               │Checked-in │
               └─────┬─────┘
                     │ (Departure & Room marked Dirty)
                     ▼
               ┌───────────┐
               │Checked-out│
               └───────────┘

  * Any state before 'Checked-in' can transition to ──> [ Cancelled ]
    (Triggers tiered refund calculation)
```

---

## 🗄 Database Schema & Relationships

Persistent data modeling is managed using **MongoDB Atlas** and **Mongoose ODM**:

- **User**: `name`, `email` (unique, indexed), `passwordHash`, `role` (`guest` | `staff` | `admin`)
- **Hotel**: `name` (indexed), `city` (indexed), `amenities[]`, `rating`
- **RoomType**: `hotelId` (ref: Hotel, indexed), `name`, `basePrice`, `capacity`, `totalRooms`
- **Room**: `roomTypeId` (ref: RoomType, indexed), `roomNumber` (unique), `housekeepingStatus` (`clean` | `dirty` | `maintenance`)
- **PricingRule**: `roomTypeId` (ref: RoomType), `multiplier`, `startDate`, `endDate`
- **Booking**: `guestId` (ref: User), `hotelId` (ref: Hotel), `roomTypeId` (ref: RoomType), `roomId` (ref: Room), `checkInDate`, `checkOutDate`, `status`, `totalAmount`, `taxes`, `addOns`, `refundAmount`, `actualCheckInAt`, `actualCheckOutAt`

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new guest or staff user
- `POST /api/auth/login` — Authenticate and receive signed JWT

### Hotels & Inventory (`/api/hotels`, `/api/room-types`, `/api/rooms`)
- `GET /api/hotels` — List all registered hotels
- `POST /api/hotels` — Create a new hotel *(Admin)*
- `GET /api/hotels/:id` — Retrieve hotel profile by ID
- `PUT /api/hotels/:id` — Update hotel details *(Admin)*
- `DELETE /api/hotels/:id` — Delete hotel *(Admin)*
- `GET /api/hotels/search` — Search real-time room availability by city, dates, and guests
- `GET /api/room-types` — Retrieve room types (optional `?hotelId=`)
- `POST /api/room-types` — Create a room type with base rate and capacity *(Admin)*
- `GET /api/rooms` — List physical rooms *(Staff / Admin)*
- `POST /api/rooms` — Register a physical room into inventory *(Admin)*
- `DELETE /api/rooms/:id` — Remove physical room *(Admin)*

### Reservations & Lifecycle (`/api/bookings`)
- `POST /api/bookings` — Create a new room booking *(Guest)*
- `GET /api/bookings/history` — Get personal booking history *(Guest)*
- `PUT /api/bookings/:id/confirm` — Confirm reservation *(Staff / Admin)*
- `PUT /api/bookings/:id/checkin` — Check-in guest & timestamp arrival *(Staff)*
- `PUT /api/bookings/:id/checkout` — Check-out guest & mark room dirty *(Staff)*
- `PUT /api/bookings/:id/cancel` — Cancel reservation & calculate tiered refund *(Guest / Staff)*

### Invoices, Housekeeping & Business Intelligence
- `GET /api/invoices/:bookingId` — Generate itemized invoice summary *(Owner / Staff)*
- `PUT /api/rooms/:id/housekeeping` — Update room housekeeping status *(Staff)*
- `POST /api/pricing-rules` — Configure dynamic seasonal pricing multiplier *(Admin)*
- `GET /api/reports/occupancy` — Property occupancy percentage calculation *(Admin)*
- `GET /api/reports/revenue` — Aggregate revenue reporting by hotel *(Admin)*

---

## 💻 Installation & Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB Atlas** account or local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/JuliusDude/stayo.git
cd stayo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/stayo?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Start the Application
```bash
# Start server
node server.js
```
The server will boot and connect to MongoDB at `http://localhost:5000`.

---

## 🧪 Testing with Postman

Complete Postman collections are included in the repository for automated end-to-end testing:

1. Import the Postman files:
   - `stayo_member1.postman_collection.json`
   - `stayo_member2.postman_collection.json`
   - `stayo_member3.postman_collection.json`
   - `B_Stayo_Postman_Environment.json`
2. Set the active environment to **Stayo Environment**.
3. Run the requests sequentially from Registration & Login to Booking, Lifecycle Transitions, Invoicing, and Reports.

Alternatively, run the built-in automated test suite:
```bash
node test-api.js
```

---

## 📂 Project Structure

```text
stayo/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── authController.js     # User registration & JWT authentication
│   ├── availabilityController.js # Overlapping date search logic
│   ├── bookingController.js  # Booking creation & state transitions
│   ├── historyController.js  # Guest reservation history
│   ├── hotelController.js    # Hotel property management
│   ├── housekeepingController.js # Room sanitation tracking
│   ├── invoiceController.js  # Itemized invoice generation
│   ├── pricingRuleController.js  # Dynamic rate multipliers
│   ├── reportController.js   # Occupancy & revenue BI reports
│   ├── roomController.js     # Physical room inventory
│   └── roomTypeController.js # Room type specifications
├── middleware/
│   ├── auth.js               # JWT bearer token verification
│   ├── errorHandler.js       # Centralized error shielding
│   ├── role.js               # Role-based authorization (RBAC)
│   └── validate.js           # express-validator result handler
├── models/
│   ├── Booking.js
│   ├── Hotel.js
│   ├── PricingRule.js
│   ├── Room.js
│   ├── RoomType.js
│   └── User.js
├── public/                   # Prototype frontend interface
├── routes/                   # RESTful API route definitions
├── utils/
│   ├── pricingCalculator.js  # Nightly multiplier calculations
│   └── refundCalculator.js   # Tiered cancellation refund math
├── .env.example              # Environment variables template
├── API_DOCS.md               # API endpoint documentation
├── package.json
└── server.js                 # Express application entrypoint
```

---

## 🛡 Security & Validation

- **Password Hashing:** Passwords are cryptographically salted and hashed with `bcrypt` (10 rounds).
- **Stateless Authentication:** Secure JWT tokens with signature validation and role claims.
- **Request Sanitization:** All incoming endpoints validate inputs via `express-validator` prior to execution.
- **Safe Error Shielding:** Global error middleware intercepts unhandled exceptions to prevent stack trace leakage and server termination.
- **Data Isolation:** Queries enforce user ID matching to prevent horizontal privilege escalation.

---

## 👨‍💻 Contributors

Developed for **Advanced JavaScript Backend Frameworks (Node.js & Express JS)**:

- **Julius B Thomas** (2462095)
- **Kripa Maria Jestin** (2462100)
- **Kuragayala Rachel** (2462106)
- **Joshua Kuriakose Mathew** (2462092)

---

## 📄 License

This project is licensed under the ISC License.