import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Briefcase, User, Target, Award, Upload, FileText, Loader2, Compass, Clock, BookOpen, Zap, Users, Cpu, Rocket } from 'lucide-react';
import { extractProfileFromCV } from '../services/geminiService';

interface Props {
  onComplete: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const OnboardingForm: React.FC<Props> = ({ onComplete, isLoading }) => {
  // Step 0: CV Upload, 1: Personal, 2: Skills, 3: Preferences, 4: Goals/Final
  const [step, setStep] = useState(0);
  const [isAnalyzingCV, setIsAnalyzingCV] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    currentRole: '',
    yearsExperience: 0,
    targetRole: '',
    skills: [],
    bio: '',
    careerPath: 'Technical Expert',
    learningStyles: ['Hands-on Projects'],
    timeCommitment: 'Moderate (3-5 hours/week)'
  });
  const [skillInput, setSkillInput] = useState('');

  const handleNext = () => setStep(p => p + 1);
  const handleBack = () => setStep(p => p - 1);

  const handleSubmit = () => {
    onComplete(formData);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const toggleLearningStyle = (style: string) => {
    setFormData(prev => {
      if (prev.learningStyles.includes(style)) {
        return { ...prev, learningStyles: prev.learningStyles.filter(s => s !== style) };
      } else {
        return { ...prev, learningStyles: [...prev.learningStyles, style] };
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingCV(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const mimeType = file.type;

        try {
          const extractedData = await extractProfileFromCV(base64Data, mimeType);
          setFormData(prev => ({
            ...prev,
            ...extractedData, // Only overwrites shared fields, preserves defaults for preferences
            skills: extractedData.skills || prev.skills,
          }));
          setStep(1);
        } catch (err) {
          console.error("CV Analysis failed", err);
          alert("Could not analyze CV. Please enter details manually.");
        } finally {
          setIsAnalyzingCV(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File reading failed", error);
      setIsAnalyzingCV(false);
    }
  };

  const skipUpload = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Career Consultant Setup</h2>
          <p className="text-slate-400">Let's build your profile to identify growth opportunities.</p>
          {step > 0 && (
            <div className="flex mt-4 space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= i ? 'bg-blue-500' : 'bg-slate-700'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Step 0: Upload CV */}
        {step === 0 && (
          <div className="space-y-8 animate-fade-in">
            <div 
              className="border-2 border-dashed border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-slate-700/30 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {isAnalyzingCV ? (
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-blue-400" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isAnalyzingCV ? "Analyzing CV..." : "Upload your CV"}
              </h3>
              <p className="text-slate-400 text-center max-w-xs">
                {isAnalyzingCV 
                  ? "Extracting skills, role, and experience." 
                  : "Upload a PDF or Image of your resume to auto-fill your profile."}
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,image/*" 
                onChange={handleFileUpload}
                disabled={isAnalyzingCV}
              />
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute w-full border-t border-slate-700"></div>
              <span className="relative bg-slate-800 px-4 text-sm text-slate-500">OR</span>
            </div>

            <button 
              onClick={skipUpload}
              disabled={isAnalyzingCV}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <FileText className="w-5 h-5" />
              Enter Details Manually
            </button>
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Current Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Software Engineer"
                    value={formData.currentRole}
                    onChange={e => setFormData({...formData, currentRole: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Years of Experience</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="3"
                  value={formData.yearsExperience || ''}
                  onChange={e => setFormData({...formData, yearsExperience: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Skills & Target */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Target Role</label>
              <div className="relative">
                <Target className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Senior Product Manager"
                  value={formData.targetRole}
                  onChange={e => setFormData({...formData, targetRole: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Your Top Skills</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Award className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="React, Leadership, Python..."
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                  />
                </div>
                <button onClick={addSkill} className="bg-slate-700 hover:bg-slate-600 text-white px-4 rounded-lg">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-800 flex items-center gap-2">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-white">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Growth Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <Compass className="w-4 h-4" /> Preferred Career Path
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Technical Expert', icon: Cpu, label: 'Technical Expert' },
                  { id: 'Management', icon: Users, label: 'Management' },
                  { id: 'Entrepreneurial', icon: Rocket, label: 'Entrepreneurial' }
                ].map((path) => (
                  <div 
                    key={path.id}
                    onClick={() => setFormData({...formData, careerPath: path.id})}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                      formData.careerPath === path.id 
                        ? 'bg-blue-900/30 border-blue-500 text-white' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <path.icon className={`w-6 h-6 ${formData.careerPath === path.id ? 'text-blue-400' : ''}`} />
                    <span className="text-sm font-medium">{path.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
               <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Learning Styles (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-3">
                {['Video Courses', 'Reading/Books', 'Hands-on Projects', 'Mentorship'].map(style => (
                  <button
                    key={style}
                    onClick={() => toggleLearningStyle(style)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      formData.learningStyles.includes(style)
                        ? 'bg-emerald-900/30 border-emerald-500 text-emerald-200'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

             <div className="space-y-3">
               <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Weekly Time Commitment
              </label>
              <div className="bg-slate-900 p-1 rounded-lg flex">
                {['Casual (< 3h)', 'Moderate (3-7h)', 'Intensive (7+h)'].map(time => (
                  <button
                    key={time}
                    onClick={() => setFormData({...formData, timeCommitment: time})}
                    className={`flex-1 py-2 text-sm rounded-md transition-all ${
                      formData.timeCommitment === time
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Context & Goals */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
             <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Career Goals & Context</label>
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                placeholder="I want to move into management within 2 years. I'm currently struggling with visibility in my organization..."
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              />
            </div>
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 flex gap-3 items-start">
              <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-200 mb-1">Ready to Analyze</h4>
                <p className="text-xs text-blue-300">
                  We'll generate a plan for a <span className="text-white font-semibold">{formData.careerPath}</span> path, 
                  tailored for <span className="text-white font-semibold">{formData.timeCommitment}</span> study time, 
                  prioritizing <span className="text-white font-semibold">{formData.learningStyles.join(', ')}</span> resources.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
          {/* Navigation Buttons */}
          {step > 1 ? (
             <button onClick={handleBack} className="text-slate-400 hover:text-white px-6 py-2">
               Back
             </button>
          ) : step === 1 ? (
             <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white px-6 py-2">
               Back to Start
             </button>
          ) : (
             // Placeholder for alignment on step 0
             <div></div>
          )}
          
          {step > 0 && step < 4 && (
            <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-colors">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Generate Plan'} 
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};