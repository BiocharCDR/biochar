export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">You are offline</h1>
      <p className="text-gray-600 text-center">
        Please check your internet connection and try again. Some features may
        be limited while offline.
      </p>
    </div>
  );
}