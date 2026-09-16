# Bloomora Deployment Plan

Version: 1.0

Status: Draft

Last Updated: July 2026

---

# Purpose

This document defines the production deployment architecture for Bloomora.

The objective is to provide a secure, scalable, highly available platform that supports future expansion from Rajahmundry to international markets.

---

# Deployment Philosophy

Build Once.

Deploy Anywhere.

Scale Without Rebuilding.

Monitor Everything.

Recover Quickly.

---

# Infrastructure

Frontend

Next.js

Hosted on Vercel

---

Backend

Next.js Server Actions

API Routes

Future Microservices

---

Database

PostgreSQL

Hosted on Neon

Automatic Backups

---

ORM

Prisma

---

File Storage

Cloudinary

Stores

Product Images

Bouquet Photos

Review Images

Partner Uploads

---

Domain

Primary

bloomora.com

Future

in.bloomora.com

my.bloomora.com

---

SSL

HTTPS Required

Auto Renewal

HSTS Enabled

---

Environment Variables

Production

Staging

Development

Secrets never stored inside source code.

---

Authentication

JWT

Google OAuth

OTP Login

Future

Apple Login

---

Payment Gateway

India

Razorpay

UPI

Cards

Net Banking

Future Malaysia

FPX

GrabPay

Touch 'n Go

---

Email Service

Resend

SMTP Backup

Templates

Welcome

Order

Invoice

Password Reset

Reminder

---

Notification Services

Email

WhatsApp

Push Notification

Future SMS

---

Maps

Google Maps API

Partner Locations

Delivery Tracking

Address Selection

---

Analytics

Google Analytics

Microsoft Clarity

Internal Analytics Dashboard

---

SEO

Dynamic Metadata

Structured Data

Sitemap

Robots

Open Graph

Twitter Cards

---

Caching

Browser Cache

Image Cache

CDN Cache

API Cache

Future Redis

---

Security

HTTPS

Rate Limiting

CSRF Protection

Input Validation

XSS Protection

SQL Injection Prevention

CORS

Helmet Headers

Audit Logs

---

Monitoring

Application Logs

API Logs

AI Logs

Payment Logs

Delivery Logs

Partner Logs

---

Error Tracking

Production Errors

Unhandled Exceptions

Payment Failures

AI Failures

Notification Failures

---

Backups

Daily Database Backup

Weekly Full Backup

Monthly Archive

Cloud Storage Backup

---

Recovery Plan

Server Failure

↓

Restore Database

↓

Redeploy Backend

↓

Verify Payments

↓

Resume Service

---

Deployment Environments

Development

Developer Testing

---

Staging

QA Testing

Real API Simulation

---

Production

Customer Facing

---

Release Strategy

Feature Branch

↓

Development

↓

QA

↓

Staging

↓

Production

---

CI/CD

GitHub

↓

Automatic Testing

↓

Automatic Build

↓

Deployment

---

Performance Goals

Homepage

Below 2 Seconds

AI Response

Below 5 Seconds

Checkout

Below 3 Seconds

API

Below 500ms

---

Scaling Plan

Stage 1

Rajahmundry

Single Region

---

Stage 2

Andhra Pradesh

Multiple Cities

---

Stage 3

India

Multi Region

---

Stage 4

Malaysia

Separate Region

Multi Currency

Multi Language

---

Monitoring Dashboard

Server Health

Database Health

Payment Status

Partner Availability

Delivery Success

AI Usage

Revenue

Orders

Errors

---

Business Continuity

Every important operation should have a backup.

If one partner rejects an order,

assign another.

If one payment fails,

offer another method.

If one delivery partner is unavailable,

find another.

Never allow a customer journey to stop unexpectedly.

---

Deployment Checklist

Domain Connected

SSL Enabled

Database Connected

Payments Verified

Images Working

AI Working

Analytics Working

Emails Working

Notifications Working

SEO Verified

Security Verified

Backup Enabled

Monitoring Enabled

---

Success Criteria

99.9% Uptime

Fast Performance

Secure Payments

Reliable AI

Scalable Architecture

Excellent Customer Experience

---

END OF DOCUMENT
