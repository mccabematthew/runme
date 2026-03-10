import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addRun } from '@/api/runs'

const RUN_TYPES = ['easy', 'tempo', 'intervals', 'long', 'race']
const FEEL_OPTIONS = [
  { value: 1, label: 'Terrible' },
  { value: 2, label: 'Bad' },
  { value: 3, label: 'OK' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Great' },
]

// Convert mm:ss string to total seconds
function parseDuration(str) {
  const parts = str.split(':')
  if (parts.length !== 2) return 0
  return parseInt(parts[0]) * 60 + parseInt(parts[1])
}

// Get today's date as YYYY-MM-DD
function today() {
  return new Date().toISOString().split('T')[0]
}

export default function LogRun() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    date: today(),
    distance_miles: '',
    duration: '',         // mm:ss — converted to seconds on submit
    run_type: 'easy',
    feel: 3,
    heart_rate_avg: '',
    heart_rate_max: '',
    elevation_gain_ft: '',
    notes: '',
    // race fields
    race_name: '',
    race_official_distance: '',
    race_finish_time: '',
  })

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setError(null)

    // Basic validation
    if (!form.distance_miles || !form.duration) {
      setError('Distance and duration are required.')
      return
    }

    const runId = new Date(form.date).toISOString()

    const run = {
      runId,
      date: form.date,
      distance_miles: parseFloat(form.distance_miles),
      distance_km: parseFloat((form.distance_miles * 1.60934).toFixed(2)),
      duration_seconds: parseDuration(form.duration),
      run_type: form.run_type,
      feel: parseInt(form.feel),
      heart_rate_avg: form.heart_rate_avg ? parseInt(form.heart_rate_avg) : null,
      heart_rate_max: form.heart_rate_max ? parseInt(form.heart_rate_max) : null,
      elevation_gain_ft: form.elevation_gain_ft ? parseInt(form.elevation_gain_ft) : null,
      notes: form.notes || null,
      race_event: form.run_type === 'race' ? {
        name: form.race_name,
        official_distance: form.race_official_distance,
        finish_time_seconds: parseDuration(form.race_finish_time),
      } : null,
    }

    try {
      setSubmitting(true)
      await addRun(run)
      navigate('/')
    } catch (e) {
      setError('Failed to save run. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="px-4 pt-8 pb-4 md:px-0">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">new entry</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Log a Run</h1>
      </div>

      <div className="px-4 md:px-0 md:max-w-lg space-y-6 pb-24">

        {/* Date + Distance row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Distance (mi)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="4.2"
              value={form.distance_miles}
              onChange={e => set('distance_miles', e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Duration (mm:ss)</Label>
          <Input
            type="text"
            placeholder="39:00"
            value={form.duration}
            onChange={e => set('duration', e.target.value)}
            className="bg-gray-900 border-gray-800 text-white font-mono"
          />
        </div>

        {/* Run type */}
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Run Type</Label>
          <div className="flex gap-2 flex-wrap">
            {RUN_TYPES.map(type => (
              <button
                key={type}
                onClick={() => set('run_type', type)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                  form.run_type === type
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Feel */}
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">How'd it feel?</Label>
          <div className="flex gap-2">
            {FEEL_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => set('feel', opt.value)}
                className={`flex-1 py-2 rounded-xl text-xs border transition-colors ${
                  form.feel === opt.value
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Heart rate */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Avg HR</Label>
            <Input
              type="number"
              placeholder="152"
              value={form.heart_rate_avg}
              onChange={e => set('heart_rate_avg', e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Max HR</Label>
            <Input
              type="number"
              placeholder="171"
              value={form.heart_rate_max}
              onChange={e => set('heart_rate_max', e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />
          </div>
        </div>

        {/* Elevation */}
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Elevation Gain (ft)</Label>
          <Input
            type="number"
            placeholder="180"
            value={form.elevation_gain_ft}
            onChange={e => set('elevation_gain_ft', e.target.value)}
            className="bg-gray-900 border-gray-800 text-white"
          />
        </div>

        {/* Race fields — only shown when run_type is race */}
        {form.run_type === 'race' && (
          <div className="space-y-4 bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">Race Details</p>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Event Name</Label>
              <Input
                type="text"
                placeholder="Austin 10K"
                value={form.race_name}
                onChange={e => set('race_name', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Distance</Label>
                <Input
                  type="text"
                  placeholder="10K"
                  value={form.race_official_distance}
                  onChange={e => set('race_official_distance', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Finish Time</Label>
                <Input
                  type="text"
                  placeholder="52:00"
                  value={form.race_finish_time}
                  onChange={e => set('race_finish_time', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Notes</Label>
          <textarea
            placeholder="how'd it go..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm font-mono">{error}</p>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-2xl text-base"
        >
          {submitting ? 'Saving...' : 'Save Run'}
        </Button>

      </div>
    </div>
  )
}