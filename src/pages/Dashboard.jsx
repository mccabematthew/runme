import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getRuns } from '@/api/runs'

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatPace(durationSeconds, distanceMiles) {
  if (!distanceMiles) return '--'
  const paceSeconds = durationSeconds / distanceMiles
  const m = Math.floor(paceSeconds / 60)
  const s = Math.round(paceSeconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}/mi`
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
    hasRun: 'bg-primary/20 text-primary font-bold rounded-full'
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="px-4 pt-8 pb-4 md:px-0">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">your training</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">RunMe</h1>
      </div>

      {/* Stat cards row */}
      <div className="px-4 mb-6 md:px-0 grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">this week</p>
            <p className="text-2xl font-bold font-mono mt-1">{weekMiles}</p>
            <p className="text-xs text-muted-foreground">miles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">total</p>
            <p className="text-2xl font-bold font-mono mt-1">{totalMiles}</p>
            <p className="text-xs text-muted-foreground">miles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">runs</p>
            <p className="text-2xl font-bold font-mono mt-1">{runs.length}</p>
            <p className="text-xs text-muted-foreground">logged</p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="px-4 md:px-0 md:grid md:grid-cols-2 md:gap-6 md:items-start">

        {/* Calendar */}
        <Card>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground text-sm font-mono animate-pulse">loading runs...</p>
              </div>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onDayClick={handleDayClick}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="w-full"
              />
            )}
          </CardContent>
        </Card>

        {/* Recent runs */}
        <div className="mt-6 md:mt-0 space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-3">recent</p>
          {[...runs].reverse().slice(0, 8).map(run => (
            <Card
              key={run.runId}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => { setSelectedRun(run); setSheetOpen(true) }}
            >
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono">{run.date}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDuration(run.duration_seconds)} · {formatPace(run.duration_seconds, run.distance_miles)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono">{run.distance_miles}</span>
                  <span className="text-xs text-muted-foreground">mi</span>
                  {run.run_type && <Badge variant="secondary">{run.run_type}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
          {runs.length === 0 && !loading && (
            <p className="text-muted-foreground text-sm font-mono text-center py-8">no runs yet — go log one</p>
          )}
        </div>
      </div>

      {/* Run detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl h-auto max-h-[80vh]">
          {selectedRun && (
            <div className="px-4 pb-6">
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between pr-8">
                  <SheetTitle className="font-mono text-sm uppercase tracking-widest">
                    {selectedRun.date}
                  </SheetTitle>
                  {selectedRun.run_type && <Badge variant="secondary">{selectedRun.run_type}</Badge>}
                </div>
              </SheetHeader>

              {/* Big distance stat */}
              <div className="flex items-end gap-2 mb-6">
                <span className="text-6xl font-bold font-mono tracking-tight">{selectedRun.distance_miles}</span>
                <span className="text-muted-foreground mb-2">miles</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Card>
                  <CardContent className="pt-3 pb-3">
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">time</p>
                    <p className="text-lg font-mono font-bold">{formatDuration(selectedRun.duration_seconds)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-3 pb-3">
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">pace</p>
                    <p className="text-lg font-mono font-bold">{formatPace(selectedRun.duration_seconds, selectedRun.distance_miles)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-3 pb-3">
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">feel</p>
                    <p className="text-lg font-mono font-bold">{feelLabels[selectedRun.feel] || '--'}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              {selectedRun.notes && (
                <Card>
                  <CardContent className="pt-3 pb-3">
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">notes</p>
                    <p className="text-sm">{selectedRun.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}