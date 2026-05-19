import { useState } from "react"
import axios from "axios"
import SummaryApi, { baseURL } from "../common/summaryApi"

const tones = ["Professional", "Casual", "Humorous", "Inspirational", "Educational"]
const lengths = ["Short (300 words)", "Medium (600 words)", "Long (1000 words)"]

const BlogPage = () => {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("Professional")
  const [length, setLength] = useState("Medium (600 words)")
  const [keywords, setKeywords] = useState("")
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setBlog(null)

    try {
      const token = localStorage.getItem("token")
      const { data } = await axios({
        url: `${baseURL}/api/blog/generate`,
        method: "post",
        data: { topic, tone, length, keywords },
        headers: { token },
        withCredentials: true,
      })
      if (data.success) setBlog(data.blog)
    } catch (err) {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!blog) return
    navigator.clipboard.writeText(`${blog.title}\n\n${blog.content}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-4xl">✍️</span>
          <h1 className="text-3xl font-semibold mt-3 text-gray-900">Blog Generator</h1>
          <p className="text-gray-500 mt-2">Generate SEO-friendly blog posts on any topic in seconds</p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5 space-y-4">

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blog Topic <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. The future of AI in healthcare"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                    tone === t
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
            <div className="flex flex-wrap gap-2">
              {lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                    length === l
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Keywords <span className="text-gray-400 font-normal">(optional, comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AI, machine learning, healthcare"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || loading}
            className="w-full py-3 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Generating blog post..." : "✍️ Generate Blog Post"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="text-gray-500 text-sm">Writing your blog post...</p>
          </div>
        )}

        {/* Blog Output */}
        {blog && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            {/* Blog Meta */}
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 leading-snug">{blog.title}</h2>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full">{tone}</span>
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{length}</span>
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{blog.wordCount} words</span>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Blog Meta Description */}
            {blog.metaDescription && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-blue-700 mb-1">SEO Meta Description</p>
                <p className="text-sm text-blue-800">{blog.metaDescription}</p>
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
              {blog.content}
            </div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Suggested tags</p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Regenerate */}
            <button
              onClick={handleGenerate}
              className="mt-5 w-full py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-all"
            >
              🔄 Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage