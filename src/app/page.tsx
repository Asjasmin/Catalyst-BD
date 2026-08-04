"use client";

import { useState, useEffect, useRef } from "react";
import { Presentation, Building2, Link as LinkIcon, Calendar, X, Plus, Trash2, Search, MessageSquare, Linkedin, Phone, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini (Ensure NEXT_PUBLIC_GEMINI_API_KEY is set in Vercel)
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6LFeuXe193h-QPYxxr8WvYiDEWbjUCyrisSzkSpeuqqWQ" });
interface Client {
  id: number;
  name: string;
  status: "Potential" | "Approaching" | "Current Client";
  industry: string;
  contact_name: string;
  contact_phone: string;
  contact_linkedin: string;
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
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Search States
  const [hunterSearch, setHunterSearch] = useState("");
  const [pitcherSearch, setPitcherSearch] = useState("");

  // Modal States
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // AI Strategist States
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiTargetClient, setAiTargetClient] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Form States
  const [newClient, setNewClient] = useState({ name: "", domain: "", industry: "Tech", status: "Potential" as const, contact_name: "", contact_phone: "", contact_linkedin: "", previewLogo: "" });
  const [newProject, setNewProject] = useState({ name: "", client: "", deckLink: "", pitchDate: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: clientsData } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    
    if (clientsData) setClients(clientsData);
    if (projectsData) setProjects(projectsData);
    setLoading(false);
  };

  // --- Auto-Fill Feature ---
  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const guessedDomain = name ? `${name.toLowerCase().replace(/\s+/g, '')}.com` : "";
    const guessedLogo = name ? `https://logo.clearbit.com/${guessedDomain}` : "";
    
    setNewClient({ ...newClient, name, domain: guessedDomain, previewLogo: guessedLogo });
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    const { data, error } = await supabase.from('clients').insert([
      { 
        name: newClient.name, 
        industry: newClient.industry, 
        status: newClient.status, 
        contact_name: newClient.contact_name || "TBA", 
        contact_phone: newClient.contact_phone,
        contact_linkedin: newClient.contact_linkedin,
        logo: newClient.previewLogo 
      }
    ]).select();

    if (data) setClients([data[0], ...clients]);
    setNewClient({ name: "", domain: "", industry: "Tech", status: "Potential", contact_name: "", contact_phone: "", contact_linkedin: "", previewLogo: "" });
    setIsClientModalOpen(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client) return;

    const { data, error } = await supabase.from('projects').insert([
      { name: newProject.name, client: newProject.client, deckLink: newProject.deckLink || "#", pitchDate: newProject.pitchDate || "TBA" }
    ]).select();

    if (data) setProjects([data[0], ...projects]);
    setNewProject({ name: "", client: "", deckLink: "", pitchDate: "" });
    setIsProjectModalOpen(false);
  };

  const handleDeleteClient = async (clientId: number, clientName: string) => {
    if(!confirm(`Are you sure you want to delete ${clientName}?`)) return;
    await supabase.from('clients').delete().eq('id', clientId);
    setClients(clients.filter(client => client.id !== clientId));
  };

  const handleDeleteProject = async (projectId: number) => {
    await supabase.from('projects').delete().eq('id', projectId);
    setProjects(projects.filter(project => project.id !== projectId));
  };

  // --- AI Strategist Chatbot ---
  const generateStrategy = async (clientName: string) => {
    if (!clientName) return;
    setIsAiThinking(true);
    setIsAIOpen(true);
    setAiResponse("");

    try {
      const prompt = `Act as an expert Business Development Strategist in Indonesia. I am pitching to the company: ${clientName}. 
      Give me a brief 3-point strategy for a brand activation or event we could pitch to them next year. 
      Focus on realistic, modern marketing trends (like Gen-Z engagement, O2O, or sustainability). Keep it concise and formatted clearly.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAiResponse(response.text || "No strategy generated.");
    } catch (error) {
      setAiResponse("Error connecting to Strategy AI. Please check your API key.");
    } finally {
      setIsAiThinking(false);
    }
  };

  // Filters
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(hunterSearch.toLowerCase()) || c.industry.toLowerCase().includes(hunterSearch.toLowerCase()));
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(pitcherSearch.toLowerCase()) || p.client.toLowerCase().includes(pitcherSearch.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-bold text-blue-600">Loading Pipeline...</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Main Content Area */}
      <div className={`flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300 ${isAIOpen ? 'md:mr-96' : ''}`}>
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catalyst <span className="text-blue-600">BD</span></h1>
              <p className="text-gray-500 mt-1">Your comprehensive pipeline and pitching dashboard.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsAIOpen(!isAIOpen)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" /> AI Strategist
              </button>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border-2 border-blue-200">BD</div>
            </div>
          </div>

          {/* STAGE 1: THE HUNTER */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                  Stage: The Hunter
                </h2>
                <p className="text-sm text-gray-500 mt-1">Research, identify, and categorize potential leads.</p>
              </div>
              <button onClick={() => setIsClientModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <Plus className="w-4 h-4" /> Add Lead
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search clients or industry..." value={hunterSearch} onChange={(e) => setHunterSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Industry</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Key Contact</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                          <img src={client.logo} alt={client.name} onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + client.name + "&background=random"; }} className="w-10 h-10 rounded-lg border border-gray-200 object-cover shadow-sm" />
                          <span className="font-bold text-gray-900">{client.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-md border
                            ${client.status === 'Current Client' ? 'bg-green-50 text-green-700 border-green-200' : 
                              client.status === 'Approaching' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                              'bg-orange-50 text-orange-700 border-orange-200'}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{client.industry}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">{client.contact_name || "No Contact"}</span>
                            <div className="flex gap-2 mt-1">
                              {client.contact_phone && <a href={`https://wa.me/${client.contact_phone}`} target="_blank" className="text-green-600 hover:text-green-700"><Phone className="w-4 h-4" /></a>}
                              {client.contact_linkedin && <a href={client.contact_linkedin} target="_blank" className="text-blue-600 hover:text-blue-700"><Linkedin className="w-4 h-4" /></a>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                          <button onClick={() => {setAiTargetClient(client.name); generateStrategy(client.name);}} className="text-slate-400 hover:text-slate-900 transition-colors" title="AI Strategy"><Sparkles className="w-5 h-5 inline" /></button>
                          <button onClick={() => handleDeleteClient(client.id, client.name)} className="text-gray-300 hover:text-red-500 transition-colors" title="Delete Client"><Trash2 className="w-5 h-5 inline" /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredClients.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No clients found in The Hunter pipeline.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* STAGE 2: THE PITCHER */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                  Stage: The Pitcher
                </h2>
                <p className="text-sm text-gray-500 mt-1">Manage active proposals, deck creation, and meeting timelines.</p>
              </div>
              <button onClick={() => setIsProjectModalOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm">
                <Plus className="w-4 h-4" /> Add Pitch
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search pitches or clients..." value={pitcherSearch} onChange={(e) => setPitcherSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Focus</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Client</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Creative Deck</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pitch Date</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-purple-50/30 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{project.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold">{project.client}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={project.deckLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-semibold hover:bg-blue-100 transition-colors">
                            <LinkIcon className="w-4 h-4" /> Open Deck
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md inline-flex">
                            <Calendar className="w-4 h-4 text-purple-600" /> {project.pitchDate || "TBA"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button onClick={() => handleDeleteProject(project.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Delete Project"><Trash2 className="w-5 h-5 inline" /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredProjects.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No active pitches in the pipeline.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* --- AI STRATEGIST SIDEBAR --- */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${isAIOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-200 bg-slate-900 text-white flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-400" /> AI Strategist</h2>
          <button onClick={() => setIsAIOpen(false)} className="text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 bg-slate-50 border-b border-gray-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Target Client</label>
          <div className="flex gap-2">
            <input type="text" value={aiTargetClient} onChange={(e) => setAiTargetClient(e.target.value)} placeholder="e.g. Tokopedia" className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-slate-900" />
            <button onClick={() => generateStrategy(aiTargetClient)} disabled={isAiThinking} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 font-medium">
              {isAiThinking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-white prose prose-sm">
          {aiResponse ? (
            <div className="text-slate-800 whitespace-pre-wrap">{aiResponse}</div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <MessageSquare className="w-12 h-12 opacity-20" />
              <p className="text-center font-medium">Enter a brand name above to generate a 3-point pitching strategy.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* Add Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Lead to Hunter</h3>
              <button onClick={() => setIsClientModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-600" /></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-5">
              
              <div className="flex gap-4 items-end">
                {newClient.previewLogo && <img src={newClient.previewLogo} alt="Preview" className="w-12 h-12 rounded-lg border border-gray-200 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                  <input type="text" required value={newClient.name} onChange={handleClientNameChange} placeholder="e.g. TechCorp" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Industry</label>
                  <select value={newClient.industry} onChange={(e) => setNewClient({...newClient, industry: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                    <option value="Tech">Tech</option><option value="Telecommunication">Telecommunication</option><option value="Financial">Financial</option><option value="FMCG">FMCG & Consumer</option><option value="Government">Government</option><option value="Automotive">Automotive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pipeline Status</label>
                  <select value={newClient.status} onChange={(e) => setNewClient({...newClient, status: e.target.value as any})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                    <option value="Potential">Potential</option><option value="Approaching">Approaching</option><option value="Current Client">Current Client</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Key Contact Information</h4>
                <div className="space-y-3">
                  <input type="text" value={newClient.contact_name} onChange={(e) => setNewClient({...newClient, contact_name: e.target.value})} placeholder="Full Name & Role" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-green-500" />
                      <input type="tel" value={newClient.contact_phone} onChange={(e) => setNewClient({...newClient, contact_phone: e.target.value})} placeholder="WhatsApp Number" className="w-full pl-9 border border-gray-300 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div className="relative flex-1">
                      <Linkedin className="w-4 h-4 absolute left-3 top-3 text-blue-500" />
                      <input type="url" value={newClient.contact_linkedin} onChange={(e) => setNewClient({...newClient, contact_linkedin: e.target.value})} placeholder="LinkedIn URL" className="w-full pl-9 border border-gray-300 rounded-lg p-2.5 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 mt-2">Save Lead to Pipeline</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Pitch Project</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-600" /></button>
            </div>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pitch Title / Project Name</label>
                <input type="text" required value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} placeholder="e.g. Q4 Mega Sale Activation" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Target Client</label>
                <select required value={newProject.client} onChange={(e) => setNewProject({...newProject, client: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white">
                  <option value="">-- Assign a Lead from The Hunter --</option>
                  {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Creative Deck Link</label>
                <input type="url" value={newProject.deckLink} onChange={(e) => setNewProject({...newProject, deckLink: e.target.value})} placeholder="Google Slides / Canva URL" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Scheduled Pitch Date</label>
                <input type="date" value={newProject.pitchDate} onChange={(e) => setNewProject({...newProject, pitchDate: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
              </div>
              <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 mt-4">Save Pitch to Pipeline</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
