import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { Redirect } from "expo-router";

/** The first screen of the app. It only decides where to send you */
export default function Index() {
  const signedIn = useAuthStore((s) => s.status === "signedIn");
  const seenOnboarding = useOnboardingStore((s) => s.seen);

  if (signedIn) return <Redirect href="/(tabs)/home" />;

  return (
    <Redirect
      href={seenOnboarding ? "/(auth)/login" : "/(onboarding)/intro-one"}
    />
  );
}
