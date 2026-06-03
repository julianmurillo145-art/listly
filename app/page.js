export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">
        Dashboard
      </h1>

      <p className="text-gray-600 mb-6">
        Welcome to Listly — generate Marketplace-ready vehicle listings from inventory.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <a
          href="/generate"
          className="p-6 bg-white rounded-xl border hover:shadow block"
        >
          <h2 className="font-semibold">Generate Listings</h2>
          <p className="text-sm text-gray-500">
            Create Marketplace ads from inventory URLs
          </p>
        </a>

        <a
          href="/history"
          className="p-6 bg-white rounded-xl border hover:shadow block"
        >
          <h2 className="font-semibold">History</h2>
          <p className="text-sm text-gray-500">
            View saved listings
          </p>
        </a>

        <a
          href="/settings"
          className="p-6 bg-white rounded-xl border hover:shadow block"
        >
          <h2 className="font-semibold">Settings</h2>
          <p className="text-sm text-gray-500">
            Yelp link and preferences
          </p>
        </a>

      </div>
    </div>
  );
}