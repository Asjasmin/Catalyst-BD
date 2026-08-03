import { Presentation, Building2, Link as LinkIcon, Calendar } from "lucide-react";

export default function Home() {
  const mockClients = [
    { id: 1, name: "Gojek", status: "Current Client", industry: "Tech", contact: "Budi Santoso", logo: "https://logo.clearbit.com/gojek.com" },
    { id: 2, name: "Indofood", status: "Approaching", industry: "FMCG", contact: "Siti Aminah", logo: "https://logo.clearbit.com/indofood.com" },
    { id: 3, name: "Bank Mandiri", status: "Potential", industry: "Financial", contact: "TBA", logo: "https://logo.clearbit.com/bankmandiri.co.id" },
  ];

  const mockProjects = [
    { id: 1, name: "Summer Festival Activation", client: "Gojek", deadline: "Oct 15, 2026", pitchDate: "Oct 20, 2026" },
    { id: 2, name: "Q1 Tech Summit Booth", client: "Tokopedia", deadline: "Nov 1, 2026", pitchDate: "Nov 5, 2026" },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catalyst BD Hub</h1>
            <p className="text-gray-500 text-sm">Welcome back. Here is your active pipeline.</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            BD
          </div>
        </div>

        {/* The Hunter Module */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center min-w-[600px]">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> The Hunter (Clients)
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              + New Lead
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img src={client.logo} alt={client.name} className="w-8 h-8 rounded-full border border-gray-100" />
                    <span className="font-medium text-gray-900">{client.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${client.status === 'Current Client' ? 'bg-green-100 text-green-800' : 
                        client.status === 'Approaching' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.industry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* The Pitcher Module */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center min-w-[600px]">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Presentation className="w-5 h-5" /> The Pitcher (Active Projects)
            </h2>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
              + New Pitch
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deck</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Presentation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{project.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                      <LinkIcon className="w-4 h-4" /> View Deck
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    {project.pitchDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
