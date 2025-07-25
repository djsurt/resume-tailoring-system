import { useState } from 'react'
import './App.css'
import Markdown from 'react-markdown'
import Navbar from './components/Navbar'
import { Check, Copy } from 'lucide-react'

function App() {
  const [jobUrl, setJobUrl] = useState<string>('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopied = async () => {
    try{
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
    } catch(err) {
      console.error('Failed to copy text: ', err)
      setError('Failed to copy text to clipboard')
    }
  }

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
      setError(err.message)
    } finally{
      setLoading(false)
    }
  }

  return (
    /* Main container with proper height constraints */
    <div className="h-screen flex flex-col bg-green-50">
      <Navbar />
      
      {/* Main content area with flex-1 and overflow hidden */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 p-3 md:p-6 min-h-0">
        
        {/* Left Panel - Form with proper scrolling */}
        <div className="w-full lg:w-96 lg:flex-shrink-0 flex-shrink-0 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col">
          <div className="p-6 flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Resume Tailoring System</h1>
            
            <div className="space-y-4">
              <div>
                <input
                  type="url"
                  placeholder="Job Posting URL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <input
                  type="file"
                  accept="application/pdf"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </div>
              
              <div>
                <button 
                  type="submit" 
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Output with proper overflow handling */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-0 lg:min-h-0">
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            {output ? (
              <div className="flex-1 overflow-y-auto prose max-w-none">

                <Markdown>{output}</Markdown>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-center">
                <div>
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-lg">Generated content will appear here after analysis</p>
                </div>
              </div>
            )}
          </div>
          {output ? 
                  <button
                  onClick={handleCopied}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  disabled={copied}
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              : null}
        </div>
      </div>
    </div>
  )
}

export default App