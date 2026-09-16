# Bloomora Database Design

Version: 1.0

Status: Draft

Last Updated: July 2026

---

# Purpose

This document defines the database architecture for Bloomora.

The database should support:

• Multi Vendor Marketplace

• AI Recommendations

• Gift Personalization

• Same Day Delivery

• Future International Expansion

• High Scalability

---

# Database Type

PostgreSQL

ORM

Prisma ORM

---

# Database Principles

Normalize Data

Avoid Duplication

Scalable Design

Secure Relationships

Fast Queries

Easy Expansion

---

# Core Database Modules

Authentication

Users

Products

Categories

Orders

Payments

Partners

Delivery

AI

Notifications

Analytics

Reviews

Coupons

Wishlist

---

# Entity Relationship Overview

Users

↓

Orders

↓

Order Items

↓

Products

↓

Categories

↓

Partner Shops

↓

Delivery Partner

↓

Payments

↓

Reviews

---

# Tables

---

## Users

Purpose

Store customer information.

Fields

id

fullName

email

phone

password

googleId

profileImage

role

createdAt

updatedAt

---

## User Addresses

id

userId

receiverName

phone

address

landmark

city

state

country

postalCode

latitude

longitude

isDefault

---

## Categories

id

name

slug

image

description

status

---

## Products

id

partnerId

categoryId

name

slug

description

price

discountPrice

stock

thumbnail

gallery

status

createdAt

---

## Product Variants

id

productId

size

color

wrapping

price

stock

---

## Product Images

id

productId

imageUrl

displayOrder

---

## Product Tags

id

productId

tag

---

## AI Gift Profiles

Purpose

Stores AI recommendation information.

Fields

id

relationship

occasion

budget

ageGroup

gender

favoriteColor

favoriteChocolate

giftStyle

recommendedProducts

createdAt

---

## AI Conversations

id

userId

conversation

recommendation

timestamp

---

## Cart

id

userId

createdAt

---

## Cart Items

id

cartId

productId

quantity

customization

giftMessage

---

## Wishlist

id

userId

productId

createdAt

---

## Orders

id

userId

partnerId

deliveryPartnerId

status

paymentStatus

subtotal

deliveryFee

discount

tax

total

deliveryDate

deliveryTime

createdAt

---

## Order Items

id

orderId

productId

quantity

price

customization

giftMessage

---

## Payments

id

orderId

method

transactionId

amount

status

paidAt

---

## Coupons

id

code

discountType

discountValue

minimumAmount

expiryDate

status

---

## Notifications

id

userId

title

message

type

isRead

createdAt

---

## Reviews

id

userId

productId

rating

review

images

createdAt

---

## Partner Shops

id

shopName

ownerName

phone

email

city

state

country

latitude

longitude

rating

status

createdAt

---

## Partner Products

id

partnerId

productId

stock

availability

price

---

## Delivery Partners

id

name

phone

vehicleType

currentLocation

availability

rating

---

## Delivery Tracking

id

orderId

deliveryPartnerId

pickupTime

startTime

deliveryTime

currentLatitude

currentLongitude

status

---

## Gift Reminders

id

userId

receiverName

occasion

date

notificationSent

---

## Gift Occasions

Birthday

Anniversary

Graduation

Wedding

Valentine

Mother's Day

Father's Day

Baby Shower

Congratulations

Festival

Corporate

Friendship

Custom

---

## AI Recommendations

id

userId

recommendation

confidenceScore

accepted

createdAt

---

## Analytics

Revenue

Orders

Customers

Partners

Products

AI Usage

Traffic

Conversion

---

## Support Tickets

id

userId

orderId

subject

description

status

createdAt

---

## Audit Logs

Every important action inside the system should be stored.

Login

Payment

Order

Partner

Admin

AI

Delivery

---

# Relationships

User

↓

Many Orders

↓

Many Order Items

↓

Products

↓

Partner Shop

↓

Delivery Partner

↓

Payment

↓

Review

---

# Security

Password Hashing

Encrypted Tokens

Role Based Access

Secure Foreign Keys

Database Backup

Audit Logs

---

# Future Tables

Corporate Accounts

Subscriptions

Gift Cards

Loyalty Points

Wallet

Invoices

Affiliate Program

Referral Rewards

AR Preview

Voice AI

International Shipping

---

END OF DOCUMENT
Recipient Profiles

id

userId

nickname

relationship

birthday

favoriteColor

favoriteFlowers

favoriteChocolate

favoriteBrands

favoriteInterests

allergies

notes

createdAt