export default function Communities() {
  return (
    <div id="communities" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Operating Energy Communities
          </h2>
          <p className="text-xl text-gray-600">
            Community-owned renewable energy systems in the UK
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Water Lilies Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-w-2 aspect-h-1 bg-gray-200">
              <img
                src="/wlce-droneshot.png"
                alt="Water Lilies Community - Aerial view of sustainable homes"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Water Lilies Community
              </h3>
              <p className="text-gray-600 mb-6">
                A 33-home sustainable development in Bristol transformed their
                energy system with 120kW solar, 444kWh battery storage, and 7 EV
                charge points. The community achieved energy independence
                through innovative local grid infrastructure.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Bristol, UK</span>
                </div>
                <a
                  href="https://www.waterlilies.energy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Visit Website
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Hazelmead Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-w-2 aspect-h-1 bg-gray-200">
              <img
                src="/hazelmead-people.jpg"
                alt="Hazelmead Development - Community housing with solar panels"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hazelmead Development
              </h3>
              <p className="text-gray-600 mb-6">
                A 54-home community in Dorset achieved net-zero status through
                210kW solar generation, 1,609kWh battery storage, and 10
                community EV charging posts. Nearly £1 million invested in
                sustainable infrastructure.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Bridport, UK</span>
                </div>
                <a
                  href="https://www.hazelmead.energy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Visit Website
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
