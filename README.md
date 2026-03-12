# RunMe

A personal running log. Log runs, view them on a calendar, and track details like pace, HR, and elevation.

## Stack

- React + Vite + Tailwind + shadcn
- Deployed to S3 + CloudFront

## Local Development
```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root:
```
VITE_API_URL=your_api_gateway_url
```

## Deployment

Deployed via GitHub Actions on merge to `main`. Builds to `/dist` and syncs to S3.