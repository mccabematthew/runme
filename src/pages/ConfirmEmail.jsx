import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { confirmSignUp } from 'aws-amplify/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

export default function ConfirmEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await confirmSignUp({ username: email, confirmationCode: code })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm px-4">
        <FieldGroup>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the code sent to {email}</p>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Field>
            <FieldLabel htmlFor="code">Confirmation Code</FieldLabel>
            <Input
              id="code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)} />
          </Field>
          <Button type="submit">Verify</Button>
        </FieldGroup>
      </form>
    </div>
  )
}