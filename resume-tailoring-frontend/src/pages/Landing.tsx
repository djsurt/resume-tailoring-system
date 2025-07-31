import { ArrowRight, Zap, Target, CheckCircle, Star, Upload, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">TailResume</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
            <Link to="/analyze" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 blur-3xl rounded-full opacity-30"></div>
            <h1 className="relative text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Tailor Your Resume
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                with AI Precision
              </span>
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Powered by Mistral AI, our intelligent platform analyzes job descriptions and customizes 
            your resume to match exactly what employers are looking for. Land more interviews with AI-optimized resumes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/analyze" className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-xl hover:shadow-2xl">
              <span>Start Tailoring Now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-purple-600 mb-2">✨</div>
              <div className="text-gray-700">AI-Powered Optimization</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-2">⚡</div>
              <div className="text-gray-700">Lightning Fast Results</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">🎯</div>
              <div className="text-gray-700">Perfect Job Matching</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our Mistral AI integration analyzes thousands of data points to create the perfect resume for each job application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-purple-300">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                AI analyzes job descriptions to identify key requirements and automatically adjusts your resume content to match.
              </p>
            </div>

            <div className="group bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-blue-300">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your tailored resume in seconds, not hours. Our optimized AI processes your information instantly.
              </p>
            </div>

            <div className="group bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-green-300">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ATS Optimized</h3>
              <p className="text-gray-600 leading-relaxed">
                Ensures your resume passes Applicant Tracking Systems with the right keywords and formatting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to your perfect, AI-tailored resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <div className="bg-purple-200 w-8 h-0.5 mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Resume</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your existing resume and paste the job application link you're applying for.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="bg-blue-200 w-8 h-0.5 mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Mistral AI analyzes both documents and intelligently tailors your resume content.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Download className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download & Apply</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your perfectly tailored resume and apply with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-purple-100 mb-12 leading-relaxed">
            Transform your job search with cutting-edge AI technology. Get perfectly tailored resumes in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/analyze" className="group bg-white text-purple-600 px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:shadow-3xl">
              <span>Get Started Free</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">TailResume</span>
          </div>
          <p className="text-gray-600">
            Powered by Mistral AI • Tailoring resumes for success
          </p>
        </div>
      </footer>
    </div>
  );
}