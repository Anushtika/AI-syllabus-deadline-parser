import React, { useState } from 'react';
import { Calendar, FileText, Download, Trash2, Upload, Sparkles, Clock, AlertCircle } from 'lucide-react';

export default function SyllabusDeadlineParser() {
  const [syllabusText, setSyllabusText] = useState('');
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    if (file.type === 'application/pdf') {
      setError('PDF parsing coming soon! For now, please copy and paste the text from your syllabus.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSyllabusText(event.target.result);
    };
    reader.readAsText(file);
  };

  const parseSyllabusWithAI = async () => {
    if (!syllabusText.trim()) {
      setError('Please paste your syllabus text or upload a file!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a syllabus parser. Extract ALL deadlines, assignments, exams, and important dates from this syllabus.

SYLLABUS TEXT:
${syllabusText}

Return ONLY a JSON array with this exact format (no markdown, no explanations, just the JSON):
[
  {
    "title": "Assignment 1: Introduction Essay",
    "date": "2026-01-25",
    "type": "assignment",
    "description": "Write a 500-word essay on course topics"
  }
]

Types can be: "assignment", "exam", "quiz", "project", "presentation", "deadline", "other"
Use ISO date format (YYYY-MM-DD). If year is missing, assume 2026. If you can't determine exact date, use your best estimate based on context.
Extract EVERY deadline mentioned, including readings, homework, projects, exams, and submissions.`
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        let jsonText = data.content[0].text.trim();
        
        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        const parsedDeadlines = JSON.parse(jsonText);
        
        // Sort by date
        parsedDeadlines.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setDeadlines(parsedDeadlines);
        
        // Save to storage
        await window.storage.set('syllabus_deadlines', JSON.stringify(parsedDeadlines));
      } else {
        setError('Could not parse syllabus. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to parse syllabus. Make sure the text contains dates and assignments.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedDeadlines = async () => {
    try {
      const result = await window.storage.get('syllabus_deadlines');
      if (result && result.value) {
        const saved = JSON.parse(result.value);
        setDeadlines(saved);
      }
    } catch (error) {
      console.log('No saved deadlines');
    }
  };

  React.useEffect(() => {
    loadSavedDeadlines();
  }, []);

  const exportToICS = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Syllabus Parser//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Course Deadlines
X-WR-TIMEZONE:UTC
`;

    deadlines.forEach((deadline, index) => {
      const date = new Date(deadline.date);
      const dateStr = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      icsContent += `BEGIN:VEVENT
UID:deadline-${index}@syllabusparser.com
DTSTAMP:${dateStr}
DTSTART:${dateStr}
SUMMARY:${deadline.title}
DESCRIPTION:${deadline.description || deadline.title}
STATUS:CONFIRMED
END:VEVENT
`;
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course_deadlines.ics';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const deleteDeadline = async (index) => {
    const updated = deadlines.filter((_, i) => i !== index);
    setDeadlines(updated);
    await window.storage.set('syllabus_deadlines', JSON.stringify(updated));
  };

  const clearAll = async () => {
    setDeadlines([]);
    setSyllabusText('');
    setFileName('');
    await window.storage.delete('syllabus_deadlines');
  };

  const getTypeColor = (type) => {
    const colors = {
      assignment: 'bg-blue-100 text-blue-700 border-blue-300',
      exam: 'bg-red-100 text-red-700 border-red-300',
      quiz: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      project: 'bg-purple-100 text-purple-700 border-purple-300',
      presentation: 'bg-green-100 text-green-700 border-green-300',
      deadline: 'bg-orange-100 text-orange-700 border-orange-300',
      other: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[type] || colors.other;
  };

  const getDaysUntil = (dateStr) => {
    const deadline = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (diff === 0) return { text: 'Today!', color: 'text-red-600 font-bold' };
    if (diff === 1) return { text: 'Tomorrow', color: 'text-orange-600 font-bold' };
    if (diff <= 7) return { text: `${diff} days`, color: 'text-orange-600' };
    return { text: `${diff} days`, color: 'text-gray-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-500 p-3 rounded-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                AI Syllabus Deadline Parser
              </h1>
              <p className="text-gray-600">Powered by Claude AI - Never miss a deadline again!</p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Upload or Paste Your Syllabus
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
              <input
                type="file"
                accept=".txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="w-12 h-12 text-indigo-500" />
                <div>
                  <p className="font-semibold text-gray-700">
                    Click to upload syllabus file
                  </p>
                  <p className="text-sm text-gray-500">TXT or DOC files (PDF text paste for now)</p>
                </div>
                {fileName && (
                  <p className="text-sm text-indigo-600 font-medium">
                    Selected: {fileName}
                  </p>
                )}
              </label>
            </div>

            <div className="text-center text-gray-500 font-medium">OR</div>

            <div>
              <textarea
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder="Paste your syllabus text here...

Example:
Week 1 (Jan 15): Introduction to the course
Assignment 1 due Jan 22: Write a 500-word essay
Midterm Exam on Feb 15
Final Project due March 30"
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={parseSyllabusWithAI}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Parsing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Extract All Deadlines with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {deadlines.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Found {deadlines.length} Deadline{deadlines.length !== 1 ? 's' : ''}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={exportToICS}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export to Calendar
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {deadlines.map((deadline, index) => {
                const daysUntil = getDaysUntil(deadline.date);
                const date = new Date(deadline.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getTypeColor(deadline.type)}`}>
                            {deadline.type.toUpperCase()}
                          </span>
                          <span className={`text-sm font-bold ${daysUntil.color}`}>
                            {daysUntil.text}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {deadline.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          📅 {formattedDate}
                        </p>
                        {deadline.description && (
                          <p className="text-gray-600 text-sm">
                            {deadline.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteDeadline(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}