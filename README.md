# Food Track

A React Native (Expo) app for logging meals by photo. Take a picture of the food, add a short description, and get a volume/nutrition estimate back from the [volume-estimation](https://github.com/caleb-cooper2/volume-estimation) API

## Setup

```bash
npm install
```

Create a `.env` file with the API server URL:

```
EXPO_PUBLIC_API_URL=http://<your-ip>:8000
```

Then run:

```bash
npx expo start
```

## Structure

- `src/app/` - screens, file-based routing via [expo-router](https://docs.expo.dev/router/introduction/) (capture -> describe -> processing -> log detail/edit)
- `src/components/` - UI components, grouped by screen/feature
- `src/hooks/` - shared state (logs, theme, onboarding), persisted with AsyncStorage
- `src/services/volumeEstimation.ts` - calls the volume-estimation API
- `src/types/` - shared TypeScript types (`Log`, `FoodNutrients`)
