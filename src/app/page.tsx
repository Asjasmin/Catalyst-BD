"use client";

import { useState } from "react";
import { Presentation, Building2, Link as LinkIcon, Calendar, X, Plus } from "lucide-react";

interface Client {
  id: number;
  name: string;
  status: "Potential" | "Approaching" | "Current Client";
  industry: string;
  contact: string;
  logo: string;
}

interface Project {
  id: number;
  name: string;
  client: string;
  deckLink: string;
  pitchDate: string;
}

export default function Home() {
  // Initial Mock State
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: "Gojek", status: "Current Client", industry: "Tech", contact: "Budi Santoso", logo: "https://logo.clearbit.com/gojek.com" },
    { id: 2, name: "Indofood", status: "Approaching", industry: "FMCG", contact: "Siti Aminah", logo: "https://logo.clearbit.com/indofood.com" },
    { id: 3, name: "Bank Mandiri", status: "Potential", industry: "Financial", contact: "TBA", logo: "https://logo.clearbit.com/bankmandiri.co.id" },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "Summer Festival Activation", client: "Gojek", deckLink: "https://figma.com", pitchDate: "2026-10-20" },
    { id: 2, name: "Q1 Tech Summit Booth", client: "Tokopedia", deckLink: "https://slides.google.com", pitchDate: "2026-11-05" },
  ]);

  // Modal Visibility States
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: "",
    domain: "",
    industry: "Tech",
    status: "Potential" as const,
    contact: "",
  });

  // New Project Form State
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    deckLink: "",
    pitchDate: "",
  });

  // Handle Adding Client
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    const domainClean = newClient.domain ? newClient.domain.replace(/(http:\/\/|https:\/\/)/, '') : `${newClient.name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const clientToAdd: Client = {
      id: Date.now(),
      name: newClient.name,
      industry: newClient.industry,
      status: newClient.status,
      contact: newClient.contact || "TBA",
      logo: `https://logo.clearbit.com/${domainClean}`,
    };

    setClients([clientToAdd, ...clients]);
    setNewClient({ name: "", domain: "", industry: "Tech", status: "Potential", contact: "" });
    setIsClientModalOpen(false);
  };

  // Handle Adding Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client) return;

    const projectToAdd: Project = {
      id: Date.now(),
      name: newProject.name,
      client: newProject.client,
      deckLink: newProject.deckLink || "#",
      pitchDate: newProject.pitchDate || "TBA",
    };

    setProjects([projectToAdd, ...projects]);
    setNewProject({ name: "", client: "", deckLink: "", pitchDate: "" });
    setIsProjectModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catalyst BD Hub</h1>
            <p className="text-gray-500 text-sm">Welcome back. Manage your deals and pipeline live.</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            BD
          </div>
        </div>

        {/* The Hunter Module */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center min-w-[600px]">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> The Hunter (Clients)
            </h2>
            <button 
              onClick={() => setIsClientModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> New Lead
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
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img 
                      src={client.logo} 
                      alt={client.name} 
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + client.name; }}
                      className="w-8 h-8 rounded-full border border-gray-200 object-cover" 
                    />
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
              <Presentation className="w-5 h-5 text-purple-600" /> The Pitcher (Active Projects)
            </h2>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> New Pitch
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
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{project.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={project.deckLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                      <LinkIcon className="w-4 h-4" /> Deck Link
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

      {/* Modal: Add Client */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Add New Lead (The Hunter)</h3>
              <button onClick={() => setIsClientModalOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Tokopedia"
                  value={newClient.name} 
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Website Domain (For Logo)</label>
                <input 
                  type="text" 
                  placeholder="e.g. tokopedia.com"
                  value={newClient.domain} 
                  onChange={(e) => setNewClient({...newClient, domain: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select 
                  value={newClient.industry}
                  onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white">
                  <option value="Tech">Tech</option>
                  <option value="Telecommunication">Telecommunication</option>
                  <option value="Financial">Financial</option>
                  <option value="FMCG">FMCG & Consumer</option>
                  <option value="Government">Government</option>
                  <option value="Automotive">Automotive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select 
                  value={newClient.status}
                  onChange={(e) => setNewClient({...newClient, status: e.target.value as any})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white">
                  <option value="Potential">Potential</option>
                  <option value="Approaching">Approaching</option>
                  <option value="Current Client">Current Client</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sarah J. (Marketing Head)"
                  value={newClient.contact} 
                  onChange={(e) => setNewClient({...newClient, contact: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsClientModalOpen(false)} className="px-4 py-2 border text-sm text-gray-700 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Project */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Add New Pitch (The Pitcher)</h3>
              <button onClick={() => setIsProjectModalOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Brand Activation 2026"
                  value={newProject.name} 
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Client</label>
                <select 
                  required
                  value={newProject.client}
                  onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white">
                  <option value="">-- Choose Client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deck Link (Figma/Google Slides)</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={newProject.deckLink} 
                  onChange={(e) => setNewProject({...newProject, deckLink: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Presentation Date</label>
                <input 
                  type="date" 
                  value={newProject.pitchDate} 
                  onChange={(e) => setNewProject({...newProject, pitchDate: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 border text-sm text-gray-700 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">Save Pitch</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
