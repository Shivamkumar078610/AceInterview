import type { Metadata } from 'next'
import { BookOpen, Trophy, Lock } from 'lucide-react'

export const metadata: Metadata = { title: 'Learning Center | AceInterview AI' }

const TOPICS = [
  { title: 'STAR Method Mastery', desc: 'Learn to structure behavioral answers perfectly', icon: '⭐', level: 'Beginner', available: true },
  { title: 'System Design Fundamentals', desc: 'Scalability, databases, and architecture patterns', icon: '🏗️', level: 'Intermediate', available: true },
  { title: 'Data Structures & Algorithms', desc: 'Arrays, trees, graphs, and dynamic programming', icon: '🧮', level: 'Intermediate', available: true },
  { title: 'Salary Negotiation Tactics', desc: 'How to negotiate and maximize your offer', icon: '💰', level: 'All levels', available: true },
  { title: 'Technical Communication', desc: 'Explaining complex ideas clearly under pressure', icon: '🎯', level: 'Advanced', available: false },
  { title: 'Leadership Stories', desc: 'Crafting compelling leadership narratives', icon: '🚀', level: 'Advanced', available: false },
]

export default function LearningPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-primary" /> Learning Center
        </h1>
        <p className="text-text-secondary mt-1">Structured courses to sharpen your interview skills</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {TOPICS.map(topic => (
          <div
            key={topic.title}
            className={`glass-card transition-all duration-300 ${topic.available ? 'hover:-translate-y-1 cursor-pointer hover:border-white/20' : 'opacity-60 cursor-not-allowed'}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{topic.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{topic.title}</h3>
                  {!topic.available && <Lock className="w-4 h-4 text-text-secondary" />}
                </div>
                <p className="text-text-secondary text-sm mb-2">{topic.desc}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  {topic.level}
                </span>
              </div>
            </div>
            {topic.available && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button className="btn-secondary w-full justify-center text-sm py-2">
                  Start Learning →
                </button>
              </div>
            )}
            {!topic.available && (
              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <span className="text-text-secondary text-xs">Coming Soon</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
