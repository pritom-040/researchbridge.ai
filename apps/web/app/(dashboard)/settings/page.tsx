"use client";

import { useState, useEffect } from "react";
import { Save, User, BookOpen, FileText, Upload, Plus, Trash2, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("academic");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [papers, setPapers] = useState([
    { id: 1, title: "", url: "" }
  ]);

  const addPaper = () => {
    setPapers([...papers, { id: Date.now(), title: "", url: "" }]);
  };

  const removePaper = (id: number) => {
    setPapers(papers.filter(p => p.id !== id));
  };

  const [cgpa, setCgpa] = useState("3.8");
  const [major, setMajor] = useState("Computer Science (Machine Learning / AI)");
  const [ielts, setIelts] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8000/api/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.cgpa) setCgpa(data.cgpa.toString());
          if (data.major) setMajor(data.major);
          
          let testScoresObj = data.testScores;
          if (typeof testScoresObj === 'string') {
            try { testScoresObj = JSON.parse(testScoresObj); } catch(e) {}
          }
          if (testScoresObj && testScoresObj.IELTS) {
            setIelts(testScoresObj.IELTS.toString());
          }
          if (data.user?.email) {
            setEmail(data.user.email);
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      setIsSaving(false);
      return;
    }
    
    try {
      await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          cgpa, 
          major, 
          testScores: ielts ? { IELTS: parseFloat(ielts) } : undefined 
        })
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your academic background, account details, and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-1 flex-shrink-0">
          <button 
            onClick={() => setActiveTab("academic")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "academic" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"}`}
          >
            <BookOpen className="w-5 h-5" /> Academic Profile
          </button>
          <button 
            onClick={() => setActiveTab("account")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "account" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"}`}
          >
            <User className="w-5 h-5" /> Account Details
          </button>
          <button 
            onClick={() => setActiveTab("preferences")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "preferences" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"}`}
          >
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "security" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"}`}
          >
            <Shield className="w-5 h-5" /> Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === "academic" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold">Academic Background</h2>
                  <p className="text-sm text-slate-500 mt-1">This information is used by our AI to find your perfect scholarship matches.</p>
                </div>
                {isSaved && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium animate-in slide-in-from-top-2">
                    Saved & Matches Updated!
                  </span>
                )}
              </div>

              <div className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cumulative GPA (CGPA)</label>
                    <input 
                      type="text" 
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 3.8" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grading Scale</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <option>Out of 4.0</option>
                      <option>Out of 5.0</option>
                      <option>Out of 10.0</option>
                      <option>Percentage (%)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">IELTS Score (Optional)</label>
                    <input 
                      type="text" 
                      value={ielts}
                      onChange={(e) => setIelts(e.target.value)}
                      placeholder="e.g. 7.5" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Research Area</label>
                    <select 
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="Computer Science (Machine Learning / AI)">Computer Science (Machine Learning / AI)</option>
                      <option value="Computer Science (Systems & Security)">Computer Science (Systems & Security)</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Biology & Bioinformatics">Biology & Bioinformatics</option>
                      <option value="Physics & Mathematics">Physics & Mathematics</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Research Papers & Publications</label>
                    <button onClick={addPaper} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Paper
                    </button>
                  </div>
                  
                  {papers.map((paper, index) => (
                    <div key={paper.id} className="flex gap-3">
                      <input type="text" placeholder="Paper Title" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      <input type="url" placeholder="URL (optional)" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      <button onClick={() => removePaper(paper.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-sm font-medium">Resume / CV</label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500 mt-1">PDF, DOCX up to 5MB</p>
                  </div>
                </div>

              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating AI Matches...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Profile
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Account Details
              </h2>
              
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed outline-none" 
                  />
                  <p className="text-xs text-slate-500 mt-1">To change your email address, please contact support.</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-sm font-medium">Password</label>
                  <div className="flex gap-4">
                    <input 
                      type="password" 
                      value="********"
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed outline-none" 
                    />
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors whitespace-nowrap">
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center text-slate-500">
              <p>Preferences section is under construction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
