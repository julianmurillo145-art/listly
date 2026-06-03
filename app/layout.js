import "./globals.css";

export const metadata = {
  title: "Listly",
  description: "Turn inventory into Marketplace listings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">

        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-white border-r p-6">
            <h1 className="text-2xl font-semibold mb-8">
              Listly
            </h1>

            <nav className="space-y-2 text-sm">

  <a
    href="/"
    className="block px-3 py-2 rounded-lg text-black hover:bg-gray-100"
  >
    Dashboard
  </a>

  <a
    href="/generate"
    className="block px-3 py-2 rounded-lg text-black hover:bg-gray-100"
  >
    Generate
  </a>

  <a
    href="/history"
    className="block px-3 py-2 rounded-lg text-black hover:bg-gray-100"
  >
    History
  </a>

  <a
    href="/settings"
    className="block px-3 py-2 rounded-lg text-black hover:bg-gray-100"
  >
    Settings
  </a>

</nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-10">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}