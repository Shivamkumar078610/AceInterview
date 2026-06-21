'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Brain, CheckCircle, XCircle, Loader2, Code2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-text-secondary">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading editor…
    </div>
  ),
})

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'ruby', label: 'Ruby' },
]

const STARTER: Record<string, string> = {
  javascript: `// Two Sum - return indices of two numbers that add to target
function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) return [map.get(complement), i]
    map.set(nums[i], i)
  }
  return []
}

console.log(twoSum([2, 7, 11, 15], 9)) // [0, 1]`,
  python: `# Two Sum - return indices of two numbers that add to target
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]`,
  typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) return [map.get(complement)!, i]
    map.set(nums[i], i)
  }
  return []
}

console.log(twoSum([2, 7, 11, 15], 9))`,
  go: `package main
import "fmt"

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, n := range nums {
        if j, ok := seen[target-n]; ok {
            return []int{j, i}
        }
        seen[n] = i
    }
    return nil
}

func main() {
    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9))
}`,
}

const PROBLEMS = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

**Example:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: `Given a string s containing '(', ')', '{', '}', '[', ']', determine if the input string is valid.

Open brackets must be closed by the same type of brackets in the correct order.

**Example:**
Input: s = "()[]{}"
Output: true`,
  },
  {
    id: '3',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

**Example:**
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.`,
  },
  {
    id: '4',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    description: `Given an array of intervals, merge all overlapping intervals, and return an array of the non-overlapping intervals.

**Example:**
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]`,
  },
  {
    id: '5',
    title: 'LRU Cache',
    difficulty: 'Hard',
    description: `Design a data structure that follows the Least Recently Used (LRU) cache constraints.

Implement the LRUCache class:
- LRUCache(int capacity) initializes the cache with positive capacity.
- int get(int key) returns the value if the key exists, otherwise -1.
- void put(int key, int value) updates or inserts the key. If full, evict the LRU key.

Both operations must run in O(1) average time complexity.`,
  },
]

interface ExecutionResult {
  stdout: string
  stderr: string
  exitCode: number
}

interface ReviewResult {
  score: number
  timeComplexity: string
  spaceComplexity: string
  bugs: string[]
  suggestions: string[]
  explanation: string
}

export function CodingInterview() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(STARTER.javascript)
  const [problem, setProblem] = useState(PROBLEMS[0])
  const [output, setOutput] = useState<ExecutionResult | null>(null)
  const [running, setRunning] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [review, setReview] = useState<ReviewResult | null>(null)
  const [showOutput, setShowOutput] = useState(false)

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    setCode(STARTER[lang] || `// Write your ${lang} solution here\n`)
    setOutput(null)
    setReview(null)
  }

  const handleRun = async () => {
    if (!code.trim()) { toast.error('Write some code first!'); return }
    setRunning(true)
    setShowOutput(true)
    setOutput(null)
    try {
      const res = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, version: '*' }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Execution failed'); return }
      setOutput(data)
    } catch {
      toast.error('Code execution failed')
    } finally {
      setRunning(false)
    }
  }

  const handleReview = async () => {
    if (!code.trim()) { toast.error('Write some code first!'); return }
    setReviewing(true)
    try {
      const res = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, problem: problem.description }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Review failed'); return }
      setReview(data)
      toast.success('AI code review complete!')
    } catch {
      toast.error('Code review failed')
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      {/* Toolbar */}
      <div className="glass-card py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-primary" />
          <select
            value={problem.id}
            onChange={(e) =>
              setProblem(PROBLEMS.find((p) => p.id === e.target.value) || PROBLEMS[0])
            }
            className="input-glass text-sm py-1.5 w-48"
          >
            {PROBLEMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              problem.difficulty === 'Easy'
                ? 'bg-success/20 text-success'
                : problem.difficulty === 'Medium'
                ? 'bg-warning/20 text-warning'
                : 'bg-error/20 text-error'
            }`}
          >
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="input-glass text-sm py-1.5 w-36"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <button onClick={handleRun} disabled={running} className="btn-primary text-sm py-2">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run
          </button>
          <button onClick={handleReview} disabled={reviewing} className="btn-secondary text-sm py-2">
            {reviewing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            AI Review
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 grid lg:grid-cols-2 gap-4 min-h-0">
        {/* Left: Problem + Output + Review */}
        <div className="flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* Problem */}
          <div className="glass-card">
            <h2 className="font-bold font-heading text-lg mb-3">{problem.title}</h2>
            <pre className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {problem.description}
            </pre>
          </div>

          {/* Output */}
          <AnimatePresence>
            {showOutput && (
              <motion.div
                className="glass-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Output</h3>
                  {output && (
                    <span
                      className={`flex items-center gap-1 text-xs ${
                        output.exitCode === 0 ? 'text-success' : 'text-error'
                      }`}
                    >
                      {output.exitCode === 0 ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {output.exitCode === 0 ? 'Success' : 'Error'}
                    </span>
                  )}
                </div>
                {running ? (
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Executing…
                  </div>
                ) : output ? (
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-xs">
                    {output.stdout && <div className="text-success">{output.stdout}</div>}
                    {output.stderr && <div className="text-error">{output.stderr}</div>}
                    {!output.stdout && !output.stderr && (
                      <div className="text-text-secondary">No output</div>
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review */}
          <AnimatePresence>
            {review && (
              <motion.div
                className="glass-card border border-primary/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  AI Code Review
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="glass rounded-lg p-2 text-center">
                    <div className="text-xl font-bold text-primary">{review.score}/100</div>
                    <div className="text-xs text-text-secondary">Score</div>
                  </div>
                  <div className="glass rounded-lg p-2 text-center">
                    <div className="text-sm font-mono text-accent">{review.timeComplexity}</div>
                    <div className="text-xs text-text-secondary">Time</div>
                  </div>
                  <div className="glass rounded-lg p-2 text-center">
                    <div className="text-sm font-mono text-success">{review.spaceComplexity}</div>
                    <div className="text-xs text-text-secondary">Space</div>
                  </div>
                </div>
                {review.suggestions.slice(0, 3).map((s, i) => (
                  <p key={i} className="text-text-secondary text-xs mb-1">
                    • {s}
                  </p>
                ))}
                <button
                  onClick={() => setReview(null)}
                  className="text-xs text-text-secondary hover:text-white mt-2 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Editor */}
        <div className="glass-card p-0 overflow-hidden min-h-[400px]">
          <MonacoEditor
            language={language}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: 2,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              formatOnPaste: true,
            }}
            className="h-full min-h-[400px]"
          />
        </div>
      </div>
    </div>
  )
}
