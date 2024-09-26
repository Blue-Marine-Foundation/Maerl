"use client";

import { useSearchParams } from "next/navigation";

export default function FormMessages() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  return (
    <>
      {error && (
        <p className="mb-4 p-2 bg-red-100 border rounded-md border-red-300 text-red-700 text-center dark:bg-red-300 dark:text-red-900">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-4 p-2 bg-blue-100 border-blue-300 rounded-md text-blue-700 text-center ">
          {message}
        </p>
      )}
    </>
  );
}
