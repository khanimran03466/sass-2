# API Documentation

Base URL: `http://localhost:8080/api`

## Authentication

### `POST /auth/register`

Registers a new user and returns JWT plus sanitized user object.

Request body:

```json
{
  "name": "Aarav Mehta",
  "email": "aarav@example.com",
  "password": "StrongPass@123",
  "phone": "9876543210"
}
```

### `POST /auth/login`

Logs in an existing user.

### `GET /auth/me`

Protected route. Returns the authenticated profile.

### `POST /auth/logout`

Clears cookie-based session token.

## Rent

### `POST /rent/landlords`

Creates a landlord record for the authenticated user.

### `GET /rent/landlords`

Lists all saved landlords.

### `POST /rent/payments`

Creates a Razorpay order for rent payment.

Request body:

```json
{
  "landlordId": "cuid",
  "amount": 25000,
  "month": "April 2026",
  "remarks": "Tower A apartment"
}
```

Response highlights:

- `paymentId`
- `revenue`
- `order`

### `GET /rent/payments`

Lists rent transactions and landlord references.

### `GET /rent/payments/:paymentId/receipt`

Downloads text receipt after payment exists in the system.

## Credit card bill payment

### `POST /credit-card/payments`

Creates a convenience-fee-backed payment order.

```json
{
  "cardIssuer": "HDFC Bank",
  "cardLast4": "1234",
  "dueAmount": 18500
}
```

### `GET /credit-card/payments`

Lists customer credit card payment attempts and statuses.

## Flights

### `GET /flights/search`

Search structure ready for Amadeus integration.

Query params:

- `origin`
- `destination`
- `departureDate`
- `travellers`

### `POST /flights/bookings`

Creates a pending flight booking and associated payment order.

### `GET /flights/bookings`

Lists booked flight records.

## Hotels

### `GET /hotels/search`

Search structure ready for Expedia Partner API integration.

Query params:

- `city`
- `checkIn`
- `checkOut`
- `guests`

### `POST /hotels/bookings`

Creates a pending hotel booking and associated payment order.

### `GET /hotels/bookings`

Lists booked hotel records.

## Recharge

### `GET /recharge/plans/:operator`

Returns mocked plan inventory and can later be backed by operator/provider APIs.

### `POST /recharge/transactions`

Creates a recharge payment order.

```json
{
  "operator": "Airtel",
  "mobileNumber": "9876543210",
  "planCode": "Airtel-399",
  "amount": 399
}
```

### `GET /recharge/transactions`

Lists recharge transactions.

## Bill payments

### `POST /bills/payments`

Creates a bill payment order.

```json
{
  "category": "ELECTRICITY",
  "providerName": "BESCOM",
  "consumerNumber": "RR123456789",
  "amount": 1450
}
```

### `GET /bills/payments`

Lists bill payments.

## Admin

All admin endpoints require an authenticated `ADMIN` user.

### `GET /admin/analytics`

Returns:

- user count
- payment count
- gross volume
- total revenue
- module-wise revenue breakdown
- recent successful payments

### `GET /admin/users`

Lists platform users.

### `GET /admin/transactions`

Lists platform transactions with linked user metadata.

### `GET /admin/transactions/export`

Downloads transaction CSV for finance operations.

### `POST /admin/transactions/:paymentId/refund`

Triggers Razorpay refund and marks the payment as refunded.

## Webhooks

### `POST /webhooks/razorpay`

Mandatory webhook verification endpoint.

Behavior:

- validates `x-razorpay-signature`
- logs the raw payload into `WebhookLog`
- marks the main `Payment` row after signature verification
- updates the child module record only after event processing

Supported event flows in current scaffold:

- `payment.captured`
- `payment.failed`
- `refund.processed`

## Error format

```json
{
  "success": false,
  "message": "Validation failed"
}
```

Validation errors include an `errors` array from Zod.
