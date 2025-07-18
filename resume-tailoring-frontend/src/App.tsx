import { useState } from 'react'
import './App.css'

function App() {
  const [jobUrl, setJobUrl] = useState<string>('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className='container'>
      <h1>Resume Tailoring System</h1>
      <form onSubmit={() => {}} className='form'>
        <input
        type='url'
        placeholder="Job Posting URL"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        required
        />
        <input
        type='file'
        accept='application/pdf'
        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {error && <div className='error'>{error}</div>}
      <div className='output'> 
      </div>
    </div>
  )
}

export default App
