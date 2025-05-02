# Student Registration App

a full-stack student registration system

## Features

- two user roles: student and administrator
- students can sign up, edit profile, register or drop courses
- admins can manage users, courses and filter/search

## Tech stack

- Next.js with React
- Express.js server
- authentication with bcrypt, passport and jwt
- MongoDB or Postgres
- env vars for ports, urls and secrets
- logging with morgan or winston

## Setup

1. clone this repo
2. cd server && npm install
3. cd client && npm install
4. copy `.env.example` to `.env` and fill in your values
5. in server folder run `npm run dev`
6. in client folder run `npm run dev`

## Env vars

- PORT
- DB_URI
- JWT_SECRET
- CLIENT_URL
