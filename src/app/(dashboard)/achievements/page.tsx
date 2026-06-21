import type { Metadata } from 'next'
import { Trophy } from 'lucide-react'

export const metadata: Metadata = { title: 'Achievements | AceInterview AI' }

const ACHIEVEMENTS = [
  { title: 'First Interview', desc: 'Complete your first practice interview', icon: '🎯', earned: false, xp: 100 },
  { title: 'Consistent Learner', desc: 'Practice 7 days in a row', icon: '🔥', earned: false, xp: 300 },
  { title: 'Perfect Score', desc: 'Achieve 100/100 in an interview', icon: '💯', earned: false, xp: 500 },
  { title: 'Code Warrior', desc: 'Complete 10 coding challenges', icon: '⚔️', earned: false, xp: 400 },
  { title: 'Resume Master', desc: 'Analyze 5 resumes', icon: '📄', earned: false, xp: 200 },
  { title: 'Networking Pro', desc: 'Match resume to 10 job descriptions', icon: '🤝', earned: false, xp: 350 },
  { title: 'Voice Champion', desc: 'Complete 5 voice interviews', icon: '🎤', earned: false, xp: 250 },
  { title: 'Interview Veteran', desc: 'Complete 50 practice sessions', icon: '🏆', earned: false, xp: 1000 },
]

export default function AchievementsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
          <Trophy className="w-7 h-7 text-warning" /> Achievements
        </h1>
        <p className="text-text-secondary mt-1">Earn XP and badges by completing challenges</p>
      </div>

      <div className="glass-card text-center py-8 mb-2">
        <div className="text-5xl mb-2">0</div>
        <div className="text-text-secondary">of {ACHIEVEMENTS.length} achievements earned</div>
        <div className="w-64 h-2 rounded-full bg-white/10 mx-auto mt-4">
          <div className="h-full rounded-full bg-warning/60" style={{ width: '0%' }} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map(achievement => (
          <div
            key={achievement.title}
            className={`glass-card flex items-center gap-4 ${achievement.earned ? '' : 'opacity-50'}`}
          >
            <div className={`text-4xl ${achievement.earned ? '' : 'grayscale'}`}>{achievement.icon}</div>
            <div className="flex-1">
              <div className="font-semibold">{achievement.title}</div>
              <div className="text-text-secondary text-xs mt-0.5">{achievement.desc}</div>
              <div className="text-warning text-xs mt-1">+{achievement.xp} XP</div>
            </div>
            {achievement.earned && (
              <div className="w-8 h-8 rounded-full bg-success/20 border border-success/30 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-success" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
