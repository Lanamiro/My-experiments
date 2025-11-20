import React, { useState } from 'react';
import { OnboardingForm } from './components/OnboardingForm';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { AppView, CareerAnalysis, UserProfile } from './types';
import { analyzeCareerProfile } from './services/geminiService';
import { LayoutDashboard, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setIsLoading(true);
    try {
      setUserProfile(profile);
      const result = await analyzeCareerProfile(profile);
      setAnalysis(result);
      setView(AppView.DASHBOARD);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Something went wrong while analyzing your profile. Please ensure you have a valid API Key configured.");
    } finally {
      setIsLoading(false);
    }
  };

  if (view === AppView.ONBOARDING) {
    return <OnboardingForm onComplete={handleOnboardingComplete} isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">CareerPath AI</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setView(AppView.DASHBOARD)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === AppView.DASHBOARD 
                    ? 'bg-slate-800 text-white border border-slate-700' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setView(AppView.CHAT)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === AppView.CHAT 
                    ? 'bg-slate-800 text-white border border-slate-700' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Consultant
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {view === AppView.DASHBOARD && userProfile && analysis && (
          <Dashboard profile={userProfile} analysis={analysis} />
        )}
        {view === AppView.CHAT && userProfile && (
          <ChatInterface profile={userProfile} />
        )}
      </main>
    </div>
  );
};

export default App;