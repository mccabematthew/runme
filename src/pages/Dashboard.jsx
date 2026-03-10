import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getRuns } from '@/api/runs'

// Helper: format seconds to mm:ss
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Helper: format pace from seconds per mile
function formatPace(durationSeconds, distanceMiles) {
  if (!distanceMiles) return '--'
  const paceSeconds = durationSeconds / distanceMiles
  const m = Math.floor(paceSeconds / 60)
  const s = Math.round(paceSeconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}/mi`
}

// Run type badge colors
const runTypeColors = {
  easy: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  tempo: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  long: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  intervals: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  race: 'bg-red-500/20 text-red-300 border-red-500/30',
}

const feelLabels = ['', 'Terrible', 'Bad', 'OK', 'Good', 'Great']

export default function Dashboard() {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedRun, setSelectedRun] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    getRuns()
      .then(setRuns)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const runDates = new Set(runs.map(r => r.date))

  const weekMiles = runs
    .filter(r => {
      const runDate = new Date(r.date)
      const now = new Date()
      const weekAgo = new Date(now.setDate(now.getDate() - 7))
      return runDate >= weekAgo
    })
    .reduce((sum, r) => sum + r.distance_miles, 0)
    .toFixed(1)

  const totalMiles = runs
    .reduce((sum, r) => sum + r.distance_miles, 0)
    .toFixed(1)

  function handleDayClick(day) {
    if (!day) return
    const dateStr = day.toISOString().split('T')[0]
    const run = runs.find(r => r.date === dateStr)
    if (run) {
      setSelectedRun(run)
      setSelectedDate(day)
      setSheetOpen(true)
    }
  }

  const modifiers = {
    hasRun: (date) => runDates.has(date.toISOString().split('T')[0])
  }

  const modifiersClassNames = {
    hasRun: 'bg-emerald-500/30 text-emerald-200 rounded-full font-bold'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 md:px-0">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">your training</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">RunMe</h1>
      </div>

      {/* Stat pills row */}
      <div className="px-4 mb-6 md:px-0 flex gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-2">
          <span className="text-emerald-400 font-mono font-bold text-lg">{weekMiles}</span>
          <span className="text-gray-400 text-sm">miles this week</span>
        </div>
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-2">
          <span className="text-blue-400 font-mono font-bold text-lg">{totalMiles}</span>
          <span className="text-gray-400 text-sm">total miles</span>
        </div>
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-2">
          <span className="text-purple-400 font-mono font-bold text-lg">{runs.length}</span>
          <span className="text-gray-400 text-sm">runs logged</span>
        </div>
      </div>

      {/* Main content — stacks on mobile, side by side on desktop */}
      <div className="px-4 md:px-0 md:grid md:grid-cols-2 md:gap-6 md:items-start">

        {/* Calendar */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600 text-sm font-mono animate-pulse">loading runs...</div>
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onDayClick={handleDayClick}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="w-full"
              classNames={{
                months: 'w-full',
                month: 'w-full',
                table: 'w-full',
                head_cell: 'text-gray-500 font-mono text-xs uppercase w-full text-center',
                cell: 'text-center p-0',
                day: 'h-9 w-9 mx-auto text-sm rounded-full hover:bg-gray-800 transition-colors',
                day_selected: 'bg-emerald-500 text-white hover:bg-emerald-600',
                day_today: 'border border-gray-600 text-white',
                day_outside: 'text-gray-700',
                nav_button: 'text-gray-400 hover:text-white transition-colors',
                caption: 'text-white font-mono text-sm uppercase tracking-widest mb-4',
              }}
            />
          )}
        </div>

        {/* Recent runs */}
        <div className="mt-6 md:mt-0">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-3">recent</p>
          <div className="space-y-2">
            {[...runs].reverse().slice(0, 8).map(run => (
              <button
                key={run.runId}
                onClick={() => { setSelectedRun(run); setSheetOpen(true) }}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between hover:border-gray-700 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-mono text-white">{run.date}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDuration(run.duration_seconds)} · {formatPace(run.duration_seconds, run.distance_miles)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono text-white">{run.distance_miles}</span>
                  <span className="text-xs text-gray-500">mi</span>
                  {run.run_type && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${runTypeColors[run.run_type] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {run.run_type}
                    </span>
                  )}
                </div>
              </button>
            ))}
            {runs.length === 0 && !loading && (
              <p className="text-gray-600 text-sm font-mono text-center py-8">no runs yet — go log one</p>
            )}
          </div>
        </div>
      </div>

      {/* Run detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="bg-gray-900 border-t border-gray-800 rounded-t-2xl text-white h-auto max-h-[80vh]">
          {selectedRun && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-white font-mono text-sm uppercase tracking-widest">
                    {selectedRun.date}
                  </SheetTitle>
                  {selectedRun.run_type && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${runTypeColors[selectedRun.run_type] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {selectedRun.run_type}
                    </span>
                  )}
                </div>
              </SheetHeader>

              {/* Big distance stat */}
              <div className="flex items-end gap-2 mb-6">
                <span className="text-6xl font-bold font-mono tracking-tight text-white">{selectedRun.distance_miles}</span>
                <span className="text-gray-400 mb-2">miles</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">time</p>
                  <p className="text-lg font-mono font-bold">{formatDuration(selectedRun.duration_seconds)}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">pace</p>
                  <p className="text-lg font-mono font-bold">{formatPace(selectedRun.duration_seconds, selectedRun.distance_miles)}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">feel</p>
                  <p className="text-lg font-mono font-bold">{feelLabels[selectedRun.feel] || '--'}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedRun.notes && (
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">notes</p>
                  <p className="text-sm text-gray-300">{selectedRun.notes}</p>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}