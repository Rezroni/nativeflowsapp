'use client'

import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950 p-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800">
          <WifiOff className="h-12 w-12 text-purple-600 dark:text-purple-300" />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          You&apos;re Offline
        </h1>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry,
          you can still view previously loaded content.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-md bg-purple-600 px-4 py-3 text-white font-medium hover:bg-purple-700 transition-colors shadow-sm"
          >
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-purple-100 dark:border-purple-800">
          <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
            Tips while offline:
          </h2>
          <ul className="space-y-2 text-left text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
              Previously viewed pages are available
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
              Cached images and resources will load
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
              Your work will sync when you&apos;re back online
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
