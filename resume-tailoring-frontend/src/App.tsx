import { useState } from 'react'
import './App.css'
import Markdown from 'react-markdown'
import Navbar from './components/Navbar'
import { Check, Copy, Upload, Link, Maximize2, Minimize2 } from 'lucide-react'

function App() {
  const [jobUrl, setJobUrl] = useState<string>('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(false)

  const handleCopied = async () => {
    try{
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 gap-8 p-6 lg:p-8 max-w-none mx-auto overflow-hidden">
        
        {/* Left Panel - Form */}
        <div className={`flex-shrink-0 transition-all duration-300 ${
          expanded ? 'w-80' : 'w-full lg:w-[420px]'
        }`}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5 rounded-2xl overflow-hidden h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h1 className="text-xl font-semibold tracking-tight">Resume Tailoring</h1>
              <p className="text-blue-100 text-sm mt-1 font-medium">Optimize your resume for any job posting</p>
            </div>
            
            {/* Form Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Job URL Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Job Posting URL
                </label>
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    placeholder="https://company.com/job-posting"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200 placeholder:text-gray-400"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Resume (PDF)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    id="resume-upload"
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                    <div className="text-sm">
                      {resumeFile ? (
                        <span className="text-blue-600 font-medium">{resumeFile.name}</span>
                      ) : (
                        <>
                          <span className="text-gray-600 font-medium">Click to upload</span>
                          <span className="text-gray-400"> or drag and drop</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">PDF files only</p>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || !jobUrl || !resumeFile}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Resume'
                )}
              </button>
              
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                  <div className="font-medium">Error</div>
                  <div className="mt-1">{error}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className={`transition-all duration-300 min-w-0 ${
          expanded ? 'flex-1' : 'flex-1 lg:max-w-4xl'
        }`}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5 rounded-2xl h-full flex flex-col overflow-hidden relative group">
            
            {/* Action Buttons */}
            {output && (
              <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-2.5 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  aria-label={expanded ? "Collapse panel" : "Expand panel"}
                >
                  {expanded ? (
                    <Minimize2 size={16} className="text-gray-600" />
                  ) : (
                    <Maximize2 size={16} className="text-gray-600" />
                  )}
                </button>
                
                {/* Copy Button */}
                <button
                  onClick={handleCopied}
                  className="p-2.5 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  disabled={copied}
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-600" />
                  )}
                </button>
              </div>
            )}
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-slate-50/50 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
                Tailored Resume Analysis
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                AI-generated recommendations and optimizations
              </p>
            </div>
            
            {/* Content - Scrollable */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {output ? (
                <div className="h-full overflow-y-auto">
                  <div className="p-6">
                    <div className="prose prose-slate max-w-none 
                      prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                      prose-h1:text-3xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-gray-200
                      prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-blue-800 prose-h2:bg-gradient-to-r prose-h2:from-blue-50 prose-h2:to-indigo-50 prose-h2:px-4 prose-h2:py-3 prose-h2:rounded-lg prose-h2:border prose-h2:border-blue-100
                      prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800 prose-h3:font-semibold
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                      prose-ul:space-y-2 prose-li:text-gray-700 prose-li:leading-relaxed
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-em:text-blue-700 prose-em:font-medium prose-em:not-italic
                      prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-medium prose-code:border prose-code:border-blue-200
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:border prose-pre:border-gray-700
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 prose-blockquote:text-blue-900 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:my-6
                      prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <Markdown
                        components={{
                          h2: ({children}) => (
                            <h2 className="flex items-center gap-3 text-xl font-bold text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-100 mt-8 mb-4">
                              <span className="text-blue-600">▶</span>
                              {children}
                            </h2>
                          ),
                          h3: ({children}) => (
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mt-6 mb-3 pb-2 border-b border-gray-200">
                              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                              {children}
                            </h3>
                          ),
                          ul: ({children}) => (
                            <ul className="space-y-3 my-4">
                              {children}
                            </ul>
                          ),
                          li: ({children}) => (
                            <li className="flex items-start gap-3 text-gray-700 leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{children}</span>
                            </li>
                          ),
                          strong: ({children}) => (
                            <strong className="font-semibold text-gray-900 bg-yellow-100 px-1 py-0.5 rounded">
                              {children}
                            </strong>
                          ),
                          code: ({children}) => (
                            <code className="text-blue-700 bg-blue-50 px-2 py-1 rounded-md text-sm font-medium border border-blue-200">
                              {children}
                            </code>
                          )
                        }}
                      >
                        {output}
                      </Markdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                      <div className="text-3xl">📊</div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Ready to analyze
                    </h3>
                    <p className="text-gray-500 leading-relaxed">
                      Upload your resume and job URL to get personalized recommendations and tailoring suggestions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App