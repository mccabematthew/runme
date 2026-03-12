# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Planned
- Edit and delete runs
- Recharts weekly mileage and pace trends
- Settings page
- Leaderboard

## [2026-03-12]
### Added
- Cognito user pool with email, username, first name, and birthdate attributes
- Custom signup form with email verification flow
- Custom login form with Amplify signIn
- Email confirmation page with Cognito confirmSignUp
- Protected routes — unauthenticated users redirected to login
- Public routes — authenticated users redirected to dashboard
- Session persistence across page reloads
- Sign out functionality in navbar

## [2026-03-11]
### Added
- Run logging with distance, pace, HR, elevation, splits
- Calendar view of logged runs
- Run detail cards
- React + Vite + shadcn frontend deployed to S3/CloudFront
- Go Lambda + DynamoDB + API Gateway backend
- Login and signup pages (frontend only)