import { useState } from 'react'
import './App.css'
import Markdown from 'react-markdown'

function App() {
  const [jobUrl, setJobUrl] = useState<string>('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOutput('')
    setError(null)
    setLoading(true)
    console.log("Submitting")
    console.log(loading)
    const formData = new FormData()
    formData.append('job_url', jobUrl)
    if(resumeFile){
      formData.append('resume', resumeFile)
    }

    try{
      const response = await fetch('http://127.0.0.1:8000/analyze/', {
        method: 'POST',
        body: formData,
      })

      if(!response.body) throw new Error('No response body')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while(!done){
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if(value) setOutput((prev) => prev + decoder.decode(value))
      }
    } catch(err: any){
      setError(err.nessage)
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <h1>Resume Tailoring System</h1>
      <form onSubmit={handleSubmit} className='form'>
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
        <Markdown>{output}</Markdown>
      </div>
    </div>
  )
}

export default App
