# Food Track

A React Native (Expo) app for logging meals by photo. Take a picture of food, add a short description, and receive volume and nutrition estimates from the companion [Food Volume Estimation](https://github.com/caleb-cooper2/Food-Volume-Estimation) and [Food Natural Language Processing](https://github.com/caleb-cooper2/Food-Natural-Language-Processing) APIs.

## Prerequisites
- Node.js and npm
- The `Food-Volume-Estimation` API running on a machine reachable from the device
- The `Food-Natural-Language-Processing` API running on a machine reachable from the device
- An Android/iOS device or simulator with camera access 

## Setup

```bash
npm install
```

Create a `.env` file with the API server URL:

```
EXPO_PUBLIC_API_URL=http://<your-ip>:8001
```

Then run:

```bash
npx expo start
```

For a physical device, use the IP address of the computer running the API, not `localhost`. The app submits images to `/api/v1/submit` and polls the job endpoint until the estimate is ready.

## Checks
```bash
npx tsc --noEmit
npm run lint
```

## Structure

- `src/app/` - screens, file-based routing via [expo-router](https://docs.expo.dev/router/introduction/) (capture -> describe -> processing -> log detail/edit)
- `src/components/` - UI components, grouped by screen/feature
- `src/hooks/` - shared state (logs, theme, onboarding), persisted with AsyncStorage
- `src/services/volumeEstimation.ts` - submits and polls volume-estimation jobs
- `src/services/logSubmission.ts` - persists a pending job and maps its result back to a log
- `src/types/` - shared TypeScript types (`Log`, `FoodNutrients`)

Meal logs and captured images are stored locally on the device using AsyncStorage and the app document directory. They are not uploaded anywhere other than the configured estimation API.
