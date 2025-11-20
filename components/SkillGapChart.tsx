import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SkillGap } from '../types';

interface Props {
  data: SkillGap[];
}

export const SkillGapChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(item => ({
    subject: item.skill,
    Current: item.currentScore,
    Target: item.targetScore,
    fullMark: 10,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Current Level"
            dataKey="Current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
          />
          <Radar
            name="Target Level"
            dataKey="Target"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};