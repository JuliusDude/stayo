# Stayo — Hotel / Property Management & Reservation System

A backend system for managing hotel properties, room inventory, dynamic pricing, and the full guest reservation lifecycle (booking → confirmation → check‑in → check‑out / cancellation), built with **Node.js, Express, and MongoDB (Mongoose)**.

> This README consolidates the work of Members 1–3 and was compiled by Member 4 from their Postman collections and controller code. Sections marked **⚠️ TO CONFIRM** need a quick check with the relevant member before submission — they aren't guesses, they're gaps in what was shared with Member 4.

---

## 1. Project Overview

Stayo lets **Guests** search room availability, book rooms, and manage their reservations; **Hotel Staff** manage check‑in/check‑out and (eventually) housekeeping; and **Admins** manage hotel properties, room types, and pricing.

| Role | Responsibility |
|---|---|
| Guest | Searches rooms, books/cancels reservations, views booking history |
| Hotel Staff | Manages room inventory, check‑in/check‑out, housekeeping status |
| Admin | Manages hotel properties, room types, and pricing |

## 2. Features / Modules

| # | Module | Status |
|---|---|---|
| 1 | Guest Registration & Authentication | ✅ Implemented |
| 2 | Hotel & Property Management | ✅ Create/Get implemented |
| 3 | Room Type & Inventory Management | ⚠️ Only "Delete Room" implemented in the shared collection — Create/Get/Update endpoints for Room & RoomType are **not yet present** |
| 4 | Availability Search Engine | ✅ Implemented |
| 5 | Reservation Booking Workflow | ✅ Implemented (`bookingController.js`) |
| 6 | Dynamic Pricing Rules | ✅ CRUD implemented; calculation logic (`pricingCalculator.js`) not shared with Member 4 for review |
| 7 | Booking Status Management | ✅ Implemented as a finite state machine (`STATUS_TRANSITIONS`) |
| 8 | Check‑in / Check‑out | ✅ Implemented |
| 9 | Housekeeping Status Tracking | ❌ Not yet implemented |
| 10 | Cancellation & Refund Policy Engine | ⚠️ Cancellation implemented; refund math (`refundCalculator.js`) not shared with Member 4 for review |
| 11 | Guest Booking History | ❌ No dedicated endpoint yet (could extend `GET /api/bookings` with a guest filter) |
| 12 | Invoice Generation Summary | ❌ Not yet implemented |
| 13 | Admin Occupancy Reports | ❌ Not yet implemented |

## 3. Technologies Used

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT bearer tokens (`Authorization: Bearer <token>`), role-based access (`guest` / `staff` / `admin`)
- **API testing:** Postman (collection + environment in this repo)

⚠️ **TO CONFIRM (Member 1/2):** password hashing library (assumed bcrypt), JWT library/expiry settings — not verifiable from the Postman collections alone.

## 4. Project Structure

```
stayo/
├── models/
│   ├── User.js            # ⚠️ TO CONFIRM — not shared with Member 4, inferred from usage
│   ├── Hotel.js            # ⚠️ TO CONFIRM
│   ├── RoomType.js         # ⚠️ TO CONFIRM
│   ├── Room.js              # ⚠️ TO CONFIRM
│   ├── PricingRule.js
│   └── Booking.js
├── controllers/
│   ├── authController.js    # ⚠️ TO CONFIRM (Member 1)
│   ├── hotelController.js   # ⚠️ TO CONFIRM (Member 1)
│   ├── roomController.js    # ⚠️ TO CONFIRM (Member 1)
│   └── bookingController.js # ✅ shared — see Member 3
├── routes/
├── middleware/
│   └── auth.js              # role/JWT middleware — ⚠️ TO CONFIRM
├── utils/
│   ├── pricingCalculator.js # ⚠️ referenced but not shared with Member 4
│   └── refundCalculator.js  # ⚠️ referenced but not shared with Member 4
├── postman/
│   ├── B_Stayo_Postman_Collection.json
│   └── B_Stayo_Postman_Environment.json
├── .env
└── server.js
```

See **`A_Database_Schema_Design.md`** for the full data model and ER diagram.

## 5. Prerequisites

- Node.js 18+
- MongoDB (local instance or Atlas)
- Postman (Desktop app or web) for API testing

## 6. Installation / Setup

```bash
git clone <repo-url>
cd stayo
npm install
```

## 7. Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stayo
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

⚠️ **TO CONFIRM (Member 1):** exact `.env` variable names used in the actual `server.js` / `config/db.js` — the collection's `baseUrl` variable (`http://localhost:5000`) confirms the port, the rest is a standard convention.

## 8. Database Setup

1. Install/start MongoDB locally, or create a free MongoDB Atlas cluster.
2. Set `MONGO_URI` in `.env`.
3. No seed script was shared — the Postman collection creates its own test data (`Register` → `Login` → `Create Hotel` → …) so no manual seeding is required to run through the flows.

Full schema, relationships, indexes, and business rules: **`A_Database_Schema_Design.md`**.

## 9. Running the Backend

```bash
npm run dev     # if a dev script with nodemon exists
# or
node server.js
```

The API will be available at `http://localhost:5000`.

## 10. API Usage

Base URL: `{{baseUrl}}` = `http://localhost:5000`

| Group | Method | Endpoint | Auth |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | Public |
| Auth | POST | `/api/auth/login` | Public |
| Hotels | POST | `/api/hotels` | Admin |
| Hotels | GET | `/api/hotels` | Public |
| Rooms | DELETE | `/api/rooms/:roomId` | Admin |
| Availability | GET | `/api/hotels/search?hotelId&checkInDate&checkOutDate&guests` | Public |
| Pricing Rules | POST/GET/PUT/DELETE | `/api/pricing-rules` | Admin (write) |
| Bookings | POST | `/api/bookings` | Guest |
| Bookings | GET | `/api/bookings` | Staff/Admin |
| Bookings | GET | `/api/bookings/:id` | Owner / Staff / Admin |
| Bookings | PUT | `/api/bookings/:id/confirm` | Staff/Admin |
| Bookings | PUT | `/api/bookings/:id/checkin` | Staff |
| Bookings | PUT | `/api/bookings/:id/checkout` | Staff |
| Bookings | PUT | `/api/bookings/:id/cancel` | Owner / Staff / Admin |

**Error format** (from `bookingController.js`): `{ "success": false, "message": "...", "errorCode": "NOT_FOUND" | "INVALID_DATE_RANGE" | "ROOM_UNAVAILABLE" | "FORBIDDEN" | "INVALID_STATUS_TRANSITION" }`

**Booking status flow:**
```
Reserved → Confirmed → Checked-in → Checked-out
   ↓            ↓
Cancelled   Cancelled
```

⚠️ **Known gap:** Room & RoomType only have a `Delete` endpoint in the current collection — there's no way to create a hotel's inventory through the API yet. This needs to be built before the system is demoable end‑to‑end.

## 11. Postman Testing Instructions

1. Import **`B_Stayo_Postman_Collection.json`** into Postman.
2. Import **`B_Stayo_Postman_Environment.json`** and select it as the active environment.
3. Set `baseUrl` to wherever the server is running (defaults to `http://localhost:5000`).
4. Run folders **in order** (top to bottom) — later requests depend on variables (`adminToken`, `hotelId`, `roomTypeId`, `bookingId`, etc.) saved by earlier ones via test scripts:
   1. **Auth** — registers admin/staff/guest and logs in each, saving their tokens.
   2. **Hotels** — creates a hotel, saves `hotelId`.
   3. **Room & Room Type Management** — ⚠️ contains **placeholder** Create requests since Member 1's collection didn't include them; update the URLs once the real endpoints exist, or manually set `roomTypeId`/`roomId` in the environment to seed data created another way.
   4. **Availability Search**
   5. **Pricing Rules** — creates/updates/deletes a pricing rule.
   6. **Bookings** — full lifecycle: create → confirm → check‑in → check‑out, plus a separate cancel flow and negative/edge cases.
5. Use **Collection Runner** to execute the whole folder tree at once and get a pass/fail summary, or run request‑by‑request while presenting/demoing.

Each request has built‑in `pm.test()` assertions (status code + key response fields). Requests explicitly marked **(negative)** are expected to fail with a specific error code — that's the correct/passing behavior for those requests, not a bug.

### Testing Report Template

Fill this in **after actually running the collection** — do not mark anything PASS without executing it.

| # | Module | Request | Expected | Actual | Result | Notes |
|---|---|---|---|---|---|---|
| 1 | Auth | Register Admin | 201 | | ☐ Pass ☐ Fail | |
| 2 | Auth | Login Admin | 200 + token | | ☐ Pass ☐ Fail | |
| 3 | Hotels | Create Hotel | 201 | | ☐ Pass ☐ Fail | |
| 4 | Bookings | Create Booking | 201, status=Reserved | | ☐ Pass ☐ Fail | |
| 5 | Bookings | Overlapping booking | 409 ROOM_UNAVAILABLE | | ☐ Pass ☐ Fail | |
| 6 | Bookings | Invalid transition (checkin before confirm) | 409 | | ☐ Pass ☐ Fail | |
| 7 | Bookings | Cancel Booking | 200 + refund object | | ☐ Pass ☐ Fail | |
| … | | | | | | *(extend with every request in the collection)* |

**Environment tested:** ______  **Date:** ______  **Tested by:** ______  **Backend commit/version:** ______

## 12. Team / Member Responsibilities

| Member | Sprint Focus | Deliverables in this repo |
|---|---|---|
| Member 1 | Guest Registration & Authentication, Hotel & Property Management, Room Type & Inventory Management, Availability Search Engine | Auth/Hotel/Room/Search endpoints |
| Member 2 | Reservation Booking Workflow, Dynamic Pricing Rules, Booking Status Management, Check‑in/Check‑out (API design) | Pricing Rules + Bookings API contract |
| Member 3 | Housekeeping Status Tracking, Cancellation & Refund Policy Engine, Guest Booking History, Invoice Generation Summary, Admin Occupancy Reports (per sprint plan) — **also implemented** `bookingController.js` (booking creation, status transitions, check‑in/out, cancellation) | `bookingController.js` |
| Member 4 (this doc) | Database schema design, Postman testing, README, PPT consolidation | This README, unified Postman collection, DB schema doc, PPT content |

⚠️ **Note for the viva:** the sprint‑plan role split says Member 2 owns "Reservation Booking Workflow / Booking Status / Check‑in‑out", but the actual controller implementing those was supplied by Member 3. Every member should be ready to explain `bookingController.js` regardless of whose "sprint slot" it falls under, per the submission instructions (all members must explain modules outside their own ownership area).

---

**See also:** `A_Database_Schema_Design.md` (schema + ER diagram + gap list), `B_Stayo_Postman_Collection.json` / `B_Stayo_Postman_Environment.json` (importable tests), `D_PPT_Content.md` (final presentation outline).
