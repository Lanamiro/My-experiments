import React from 'react';
import { CareerAnalysis, UserProfile } from '../types';
import { SkillGapChart } from './SkillGapChart';
import { Map, TrendingUp, BookOpen, DollarSign, CheckCircle, Compass, Clock, MonitorPlay } from 'lucide-react';

interface Props {
  profile: UserProfile;
  analysis: CareerAnalysis;
}

export const Dashboard: React.FC<Props> = ({ profile, analysis }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Hello, {profile.name}</h1>
            <p className="text-slate-400 text-lg">Here is your strategic roadmap from <span className="text-blue-400">{profile.currentRole}</span> to <span className="text-emerald-400">{profile.targetRole}</span>.</p>
          </div>
          
          {/* Strategy Pill */}
          <div className="hidden md:flex flex-col gap-2 items-end">
             <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300">
                <Compass className="w-3 h-3 text-blue-400" />
                <span>Path: <span className="text-white font-medium">{profile.careerPath}</span></span>
             </div>
             <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Time: <span className="text-white font-medium">{profile.timeCommitment}</span></span>
             </div>
          </div>
        </div>
        
        <div className="mt-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Executive Summary</h3>
          <p className="text-slate-200 leading-relaxed">{analysis.executiveSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Analysis */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-400 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Skill Gap Analysis</h2>
          </div>
          <SkillGapChart data={analysis.skillGaps} />
          <div className="mt-4 space-y-3">
            {analysis.skillGaps.map((gap, idx) => (
              <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-200">{gap.skill}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${gap.importance === 'High' ? 'bg-red-900/50 text-red-200' : 'bg-slate-700 text-slate-300'}`}>
                    {gap.importance} Priority
                  </span>
                </div>
                <p className="text-sm text-slate-400">{gap.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Map className="text-emerald-400 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Strategic Roadmap</h2>
          </div>
          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-4 before:w-0.5 before:bg-slate-700">
            {analysis.roadmap.map((step, idx) => (
              <div key={idx} className="relative pl-10">
                <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-slate-800 border-2 border-emerald-500 z-10" />
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">{step.phase}</span>
                    <span className="text-xs text-slate-500">{step.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-yellow-400 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Salary & Market Insights</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">{analysis.salaryInsights}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-purple-400 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Recommended Resources</h2>
          </div>
           <div className="mb-3 flex gap-2">
              {profile.learningStyles.map(style => (
                  <span key={style} className="text-xs bg-purple-900/30 text-purple-200 px-2 py-0.5 rounded border border-purple-800/50">
                    {style}
                  </span>
              ))}
          </div>
          <ul className="space-y-3">
            {analysis.recommendedResources.map((resource, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span>{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};