# 🎓 AI Syllabus Deadline Parser

An AI-powered tool that automatically extracts deadlines, assignments, and exams from course syllabi using Claude AI.

## ✨ Features

- 🤖 AI-powered syllabus parsing using Claude Sonnet 4
- 📅 Automatic deadline extraction and organization
- ⏰ Countdown timers for upcoming deadlines
- 📥 Export to calendar (.ics format)
- 💾 Persistent storage - saves your deadlines
- 🎨 Beautiful, responsive UI with Tailwind CSS

## 🚀 Live Demo

[View Live Demo](https://your-username.github.io/syllabus-deadline-parser)

## 📸 Screenshots

![Screenshot](screenshot.png)

## 🛠️ Tech Stack

- React 18
- Tailwind CSS
- Claude AI API (Anthropic)
- Lucide React Icons
- LocalStorage API

## 💻 How to Use

1. **Paste your syllabus** text or upload a .txt file
2. Click **"Extract All Deadlines with AI"**
3. Review the extracted deadlines
4. **Export to Calendar** for Google Calendar, Apple Calendar, or Outlook
5. Never miss a deadline again! 🎉

## 🏃 Running Locally

1. Clone the repository:
```bash
   git clone https://github.com/your-username/syllabus-deadline-parser.git
   cd syllabus-deadline-parser
```

2. Open `index.html` in your browser or use a local server:
```bash
   python -m http.server 8000
   # OR
   npx serve
```

3. Navigate to `http://localhost:8000`

## 📝 Examples

The parser can extract:
- **Assignments**: "Assignment 1 due Jan 22"
- **Exams**: "Midterm Exam on Feb 15"
- **Projects**: "Final Project submission March 30"
- **Presentations**: "Group presentation Week 8"
- And more!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 👨‍💻 Author

[Your Name](https://github.com/your-username)

## 🙏 Acknowledgments

- Built with [Claude AI](https://www.anthropic.com/claude) by Anthropic
- Icons by [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

⭐ Star this repo if you found it helpful!
```

**`.gitignore`**:
```
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# Editor directories
.vscode/
.idea/