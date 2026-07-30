/**
 * Tracks whether the user has completed the onboarding, persisted across launches via AsyncStorage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState} from 'react';

const ONBOARDING_STORAGE_KEY = 'onboarding-completed-1'; // number just in case onboarding needs updated and re-viewed by users
const PARTICIPANT_CODE_STORAGE_KEY = 'participant_code';

type OnboardingContextValue = {
  isComplete: boolean;
  completeOnboarding: (participantCode: string) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_STORAGE_KEY).then((value) => {
      setIsComplete(value === 'true');
    });
  }, []);

  const completeOnboarding = useCallback((participantCode: string) => {
    setIsComplete(true);
    AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    AsyncStorage.setItem(PARTICIPANT_CODE_STORAGE_KEY, participantCode);
  }, []);

  // Wait for the persisted value before mounting any routes
  if (isComplete === null) return null;

  return (
      <OnboardingContext.Provider value={{ isComplete, completeOnboarding }}>
        {children}
      </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return context;
}
