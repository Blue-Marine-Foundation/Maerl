"use client";

import { useState } from "react";
import Link from "next/link";
import FormMessages from "@/components/FormMessages";
import Logo from "@/_components/logo";

export default function Login() {
  const [loggingIn, setLoggingIn] = useState(false);

  return (
    <div className="mx-auto w-full max-w-7xl py-4 px-4 lg:py-16 justify-center gap-2">
      <div className="flex flex-wrap justify-between items-start lg:items-stretch gap-4 lg:gap-8">
        <div className="basis-full lg:basis-1/2 bg-blue-300/5 rounded shadow flex flex-col justify-center items-center gap-4 lg:gap-8 px-4 py-12">
          <Logo width={36} />
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Maerl</h2>
            <p className="font-semibold">
              Impact reporting by Blue&nbsp;Marine&nbsp;Foundation
            </p>
          </div>

          <p className="font-light">Log in to get started</p>
        </div>
        <div className="flex-1 bg-blue-300/5 rounded shadow py-4 lg:py-8">
          <form
            className="mx-auto p-4 flex-1 flex flex-col w-full justify-center sm:max-w-md gap-2 text-foreground"
            action="/auth/sign-in"
            method="post"
            onSubmit={() => setLoggingIn(true)}
          >
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <FormMessages />
            <button className="bg-btn-background hover:bg-btn-background-hover transition-all duration-500 text-white rounded-md px-4 py-2 text-foreground mb-2">
              {loggingIn ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto animate-spin text-purple-200"
                >
                  <line x1="12" x2="12" y1="2" y2="6" />
                  <line x1="12" x2="12" y1="18" y2="22" />
                  <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
                  <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
                  <line x1="2" x2="6" y1="12" y2="12" />
                  <line x1="18" x2="22" y1="12" y2="12" />
                  <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
                  <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
                </svg>
              ) : (
                "Log in"
              )}
            </button>
            <p className="mt-4 text-center">
              <Link href="/requestpasswordreset" className="text-sm">
                Reset password <span className="text-xs ml-1">&rarr;</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
