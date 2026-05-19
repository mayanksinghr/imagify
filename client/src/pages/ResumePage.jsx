import { useState, useRef } from "react"
import axios from "axios"
import SummaryApi, { baseURL } from "../common/summaryApi"

const ResumePage = () => {
  const [file, setFile] = useState(null)
  const [jobRole, setJobRole] = useState("")
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (f && (f.type === "application/pdf" || f.type.includes("word"))) {
      setFile(f)
      setAnalysis(null)
    } else {
      alert("Please upload a PDF or Word file")
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyse = async () => {
    if (!file) return
    setLoading(true)
    setAnalysis(null)

    const formData = new FormData()
    formData.append("resume", file)
    if (jobRole) formData.append("jobRole", jobRole)

    try {
      const token = localStorage.getItem("token")
      const { data } = await axios.post(
        `${baseURL}/api/resume/analyse`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
          withCredentials: true,
        }
      )
      if (data.success) setAnalysis(data.analysis)
    } catch (err) {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-4xl">📄</span>
          <h1 className="text-3xl font-semibold mt-3 text-gray-900">Resume Analyser</h1>
          <p className="text-gray-500 mt-2">Upload your resume and get AI-powered feedback instantly</p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
          {/* Drop Zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div>
                <p className="text-2xl mb-2">✅</p>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setAnalysis(null) }}
                  className="mt-3 text-xs text-red-400 hover:text-red-600 underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-3">☁️</p>
                <p className="text-gray-600 font-medium">Drag & drop your resume here</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                <p className="text-xs text-gray-400 mt-3">Supports PDF, DOC, DOCX</p>
              </div>
            )}
          </div>

          {/* Job Role Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Job Role <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer, Data Scientist..."
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Analyse Button */}
          <button
            onClick={handleAnalyse}
            disabled={!file || loading}
            className="w-full mt-4 py-3 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Analysing your resume..." : "Analyse Resume"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="text-gray-500 text-sm">AI is reviewing your resume...</p>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-5">

            {/* Score */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overall Score</p>
                <h2 className="text-4xl font-bold text-gray-900">{analysis.score}<span className="text-xl text-gray-400">/100</span></h2>
              </div>
              <div className={`px-5 py-3 rounded-xl border font-semibold text-lg ${scoreColor(analysis.score)}`}>
                {analysis.score >= 80 ? "Excellent" : analysis.score >= 60 ? "Good" : "Needs Work"}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-2">📋 Summary</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-3">✅ Strengths</h3>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-3">🔧 Areas to Improve</h3>
              <ul className="space-y-2">
                {analysis.improvements.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-amber-500 mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            {analysis.missingKeywords?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-3">🔑 Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-semibold text-blue-800 mb-1">💡 Pro Tip</h3>
              <p className="text-blue-700 text-sm">{analysis.tip}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default ResumePage