"use client";

import { useEffect } from "react";
import { TamboProvider, useTamboContextHelpers } from "@tambo-ai/react";
import { tamboComponents, calendarTools } from "./registry";

function UserContextInjector({ userId }: { userId: string }) {
  const { addContextHelper } = useTamboContextHelpers();

  useEffect(() => {
    if (userId) {
      addContextHelper("currentUserId", () =>
        `The current logged-in user's ID is: ${userId}. Always use this userId when calling calendar tools that require a userId parameter.`
      );
    }
  }, [userId, addContextHelper]);

  return null;
}

export default function TamboWrapper({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={tamboComponents}
      tools={calendarTools}
    >
      <UserContextInjector userId={userId} />
      {children}
    </TamboProvider>
  );
}
