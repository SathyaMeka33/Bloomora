# Bloomora API Design

Version: 1.0

Status: Draft

Last Updated: July 2026

---

# Purpose

This document defines all backend APIs used by Bloomora.

All APIs must follow RESTful standards.

Every response should be consistent.

Every API should support authentication, validation, and error handling.

---

# API Standards

Protocol

HTTPS

Format

JSON

Authentication

JWT

Response Format

{
  success: true,
  message: "",
  data: {}
}

Error Format

{
  success: false,
  message: "",
  error: {}
}

---

# Authentication APIs

POST /api/auth/register

Register Customer

---

POST /api/auth/login

Login

---

POST /api/auth/google

Google Login

---

POST /api/auth/logout

Logout

---

POST /api/auth/forgot-password

Forgot Password

---

POST /api/auth/reset-password

Reset Password

---

GET /api/auth/profile

Get Logged User

---

PUT /api/auth/profile

Update Profile

---

# AI APIs

POST /api/ai/gift-finder

Purpose

Generate personalized gift recommendations.

Input

Relationship

Occasion

Budget

Age

Gender

Preferences

Output

Recommended Gifts

Confidence Score

Reason

---

POST /api/ai/chat

AI Chat Assistant

---

POST /api/ai/greeting-message

Generate greeting message.

---

POST /api/ai/gift-combination

Generate complete gift combination.

---

GET /api/ai/history

Previous recommendations.

---

# Category APIs

GET /api/categories

All Categories

---

GET /api/categories/:id

Category Details

---

POST /api/categories

Admin Only

---

PUT /api/categories/:id

Update

---

DELETE /api/categories/:id

Delete

---

# Product APIs

GET /api/products

All Products

Supports

Search

Filters

Sorting

Pagination

---

GET /api/products/:id

Product Details

---

POST /api/products

Partner/Admin

---

PUT /api/products/:id

Update

---

DELETE /api/products/:id

Delete

---

GET /api/products/trending

Trending Products

---

GET /api/products/recommended

Recommended Products

---

# Cart APIs

GET /api/cart

Get Cart

---

POST /api/cart

Add Product

---

PUT /api/cart/:id

Update Quantity

---

DELETE /api/cart/:id

Remove Product

---

DELETE /api/cart

Clear Cart

---

# Wishlist APIs

GET /api/wishlist

POST /api/wishlist

DELETE /api/wishlist/:id

---

# Checkout APIs

POST /api/checkout

Create Checkout Session

---

POST /api/payment

Create Payment

---

POST /api/payment/verify

Verify Payment

---

GET /api/payment/history

Payment History

---

# Order APIs

GET /api/orders

Customer Orders

---

GET /api/orders/:id

Order Details

---

POST /api/orders

Create Order

---

PUT /api/orders/:id/cancel

Cancel Order

---

PUT /api/orders/:id/refund

Refund

---

GET /api/orders/track/:id

Track Order

---

# Review APIs

POST /api/reviews

Create Review

---

GET /api/reviews/:productId

Product Reviews

---

DELETE /api/reviews/:id

Delete

---

# Reminder APIs

GET /api/reminders

POST /api/reminders

PUT /api/reminders/:id

DELETE /api/reminders/:id

---

# Notification APIs

GET /api/notifications

PUT /api/notifications/read

DELETE /api/notifications

---

# Partner APIs

POST /api/partner/register

Partner Registration

---

GET /api/partner/orders

Partner Orders

---

PUT /api/partner/orders/:id/accept

Accept Order

---

PUT /api/partner/orders/:id/reject

Reject Order

---

PUT /api/partner/orders/:id/ready

Ready For Pickup

---

GET /api/partner/products

Partner Products

---

POST /api/partner/products

Add Product

---

PUT /api/partner/products/:id

Update Product

---

# Delivery APIs

GET /api/delivery/orders

Available Orders

---

PUT /api/delivery/accept

Accept Delivery

---

PUT /api/delivery/picked

Picked Up

---

PUT /api/delivery/delivered

Delivered

---

GET /api/delivery/history

Delivery History

---

# Admin APIs

GET /api/admin/dashboard

Dashboard

---

GET /api/admin/users

Users

---

GET /api/admin/orders

Orders

---

GET /api/admin/partners

Partners

---

GET /api/admin/products

Products

---

GET /api/admin/reports

Reports

---

GET /api/admin/analytics

Analytics

---

POST /api/admin/coupons

Coupons

---

PUT /api/admin/settings

Settings

---

# Search APIs

GET /api/search

Universal Search

---

GET /api/search/suggestions

Suggestions

---

# Analytics APIs

GET /api/analytics/revenue

GET /api/analytics/orders

GET /api/analytics/customers

GET /api/analytics/products

GET /api/analytics/partners

GET /api/analytics/ai

---

# Support APIs

POST /api/support

Create Ticket

---

GET /api/support

User Tickets

---

PUT /api/support/:id

Update Ticket

---

# Health APIs

GET /api/health

Server Status

---

GET /api/version

Current Version

---

# Future APIs

Voice AI

AR Preview

Corporate Dashboard

Affiliate

Wallet

Subscriptions

Gift Cards

Malaysia Marketplace

International Shipping

---

END OF DOCUMENT