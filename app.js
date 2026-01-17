const e = React.createElement;
const { useState, useEffect } = React;

function App() {
    const [syllabusText, setSyllabusText] = useState('');
    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('gemini_api_key');
        if (saved) setApiKey(saved);
        
        const savedDeadlines = localStorage.getItem('deadlines');
        if (savedDeadlines) {
            try {
                setDeadlines(JSON.parse(savedDeadlines));
            } catch (err) {
                console.log('No saved deadlines');
            }
        }
    }, []);

    const saveApiKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey);
            setShowSettings(false);
            alert('✓ API key saved!');
        }
    };

    const parseWithAI = async () => {
        if (!syllabusText.trim()) {
            setError('Please paste your syllabus!');
            return;
        }
        if (!apiKey.trim()) {
            setError('Please add API key in settings!');
            setShowSettings(true);
            return;
        }

        setLoading(true);
        setError('');

        const prompt = `Extract all deadlines from this syllabus. Return ONLY valid JSON array, no markdown:

${syllabusText}

Format: [{"title":"Assignment 1","date":"2026-01-25","type":"assignment","description":"Details"}]
Types: assignment, exam, quiz, project, presentation, deadline
Date format: YYYY-MM-DD (assume 2026 if year missing)`;

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.2, maxOutputTokens: 2000 }
                    })
                }
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || 'API request failed');
            }

            const data = await res.json();
            let text = data.candidates[0].content.parts[0].text;
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const parsed = JSON.parse(text);
            parsed.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            setDeadlines(parsed);
            localStorage.setItem('deadlines', JSON.stringify(parsed));
            
        } catch (err) {
            console.error(err);
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setDeadlines([]);
        setSyllabusText('');
        localStorage.removeItem('deadlines');
    };

    const exportCal = () => {
        let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
        deadlines.forEach((d, i) => {
            const dt = new Date(d.date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            ics += `BEGIN:VEVENT\nUID:${i}\nDTSTART:${dt}\nSUMMARY:${d.title}\nEND:VEVENT\n`;
        });
        ics += 'END:VCALENDAR';
        
        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'deadlines.ics';
        a.click();
    };

    const getDays = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        today.setHours(0,0,0,0);
        d.setHours(0,0,0,0);
        const diff = Math.ceil((d - today) / 86400000);
        
        if (diff < 0) return { text: 'Overdue', color: 'text-red-600' };
        if (diff === 0) return { text: 'Today!', color: 'text-red-600 font-bold' };
        if (diff <= 7) return { text: `${diff} days`, color: 'text-orange-600' };
        return { text: `${diff} days`, color: 'text-gray-600' };
    };

    const getColor = (type) => {
        const colors = {
            assignment: 'bg-blue-100 text-blue-700',
            exam: 'bg-red-100 text-red-700',
            quiz: 'bg-yellow-100 text-yellow-700',
            project: 'bg-purple-100 text-purple-700',
            presentation: 'bg-green-100 text-green-700',
            deadline: 'bg-orange-100 text-orange-700'
        };
        return colors[type] || 'bg-gray-100 text-gray-700';
    };

    return e('div', { className: 'min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6' },
        e('div', { className: 'max-w-5xl mx-auto' },
            e('div', { className: 'bg-white rounded-2xl shadow-xl p-8 mb-6' },
                e('div', { className: 'flex justify-between items-center mb-6' },
                    e('div', null,
                        e('h1', { className: 'text-3xl font-bold text-gray-800 mb-2' }, '🎓 AI Syllabus Deadline Parser'),
                        e('p', { className: 'text-gray-600' }, 'Powered by Google Gemini AI')
                    ),
                    e('button', {
                        onClick: () => setShowSettings(!showSettings),
                        className: 'px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 font-semibold'
                    }, '⚙️ Settings')
                ),

                showSettings && e('div', { className: 'mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl' },
                    e('h3', { className: 'font-bold mb-3' }, '🔑 Gemini API Key'),
                    e('p', { className: 'text-sm text-gray-600 mb-3' },
                        'Get free key: ',
                        e('a', { href: 'https://makersuite.google.com/app/apikey', target: '_blank', className: 'text-blue-600 underline' }, 'Google AI Studio')
                    ),
                    e('div', { className: 'flex gap-3' },
                        e('input', {
                            type: 'password',
                            value: apiKey,
                            onChange: (ev) => setApiKey(ev.target.value),
                            placeholder: 'AIza...',
                            className: 'flex-1 px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none'
                        }),
                        e('button', {
                            onClick: saveApiKey,
                            className: 'px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold'
                        }, 'Save')
                    )
                ),

                e('textarea', {
                    value: syllabusText,
                    onChange: (ev) => setSyllabusText(ev.target.value),
                    placeholder: 'Paste syllabus here...\n\nExample:\nWeek 1 (Jan 15): Introduction\nAssignment 1 due Jan 22\nMidterm Feb 15',
                    className: 'w-full h-64 p-4 border-2 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none font-mono text-sm'
                }),

                error && e('div', { className: 'p-4 rounded-lg mb-4 bg-red-50 text-red-700' }, error),

                e('button', {
                    onClick: parseWithAI,
                    disabled: loading,
                    className: 'w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50'
                }, loading ? '⏳ Parsing...' : '✨ Extract Deadlines')
            ),

            deadlines.length > 0 && e('div', { className: 'bg-white rounded-2xl shadow-xl p-8' },
                e('div', { className: 'flex justify-between items-center mb-6' },
                    e('h2', { className: 'text-2xl font-bold' }, `📅 Found ${deadlines.length} Deadlines`),
                    e('div', { className: 'flex gap-3' },
                        e('button', {
                            onClick: exportCal,
                            className: 'px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold'
                        }, '📥 Export'),
                        e('button', {
                            onClick: clearAll,
                            className: 'px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold'
                        }, '🗑️ Clear')
                    )
                ),

                e('div', { className: 'space-y-4' },
                    deadlines.map((d, i) => {
                        const days = getDays(d.date);
                        const formatted = new Date(d.date).toLocaleDateString('en-US', {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                        });

                        return e('div', { key: i, className: 'border-2 rounded-xl p-5 hover:shadow-md transition' },
                            e('div', { className: 'flex items-center gap-3 mb-2' },
                                e('span', { className: `px-3 py-1 ${getColor(d.type)} rounded-full text-xs font-bold uppercase` }, d.type),
                                e('span', { className: `text-sm font-bold ${days.color}` }, days.text)
                            ),
                            e('h3', { className: 'text-lg font-bold text-gray-800 mb-1' }, d.title),
                            e('p', { className: 'text-gray-600 text-sm' }, `📅 ${formatted}`),
                            d.description && e('p', { className: 'text-gray-600 text-sm mt-2' }, d.description)
                        );
                    })
                )
            )
        )
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
