"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/lib/auth";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const result = await getUser();
      if (result.success && result.data) {
        router.replace("/dashboard");
      }
    })();
  }, [router]);

  return null;
}
