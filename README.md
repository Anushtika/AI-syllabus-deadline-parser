# 🎓 AI Syllabus Deadline Parser

An AI-powered web application that automatically extracts deadlines, assignments, and exams from course syllabi using Claude AI.

![Demo Screenshot](screenshot.png)

## ✨ Features

- 🤖 **AI-Powered Parsing** - Uses Claude Sonnet 4 to intelligently extract all deadlines
- 📅 **Smart Organization** - Automatically categorizes and sorts deadlines by date
- ⏰ **Countdown Timers** - See how many days until each deadline
- 📥 **Calendar Export** - Download .ics file for Google Calendar, Apple Calendar, or Outlook
- 💾 **Persistent Storage** - Your deadlines are saved locally in your browser
- 🎨 **Beautiful UI** - Clean, responsive design with Tailwind CSS
- 🔒 **Privacy First** - API key stored only in your browser, never sent to our servers

## 🚀 Live Demo

**[Try it now!](https://your-username.github.io/syllabus-deadline-parser/)**

## 🔑 Setup Instructions

### Get Your Free API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up for a free account (get $5 in free credits!)
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-...`)

### Use the App

1. Click the **Settings ⚙️** icon in the top right
2. Paste your API key and click **Save**
3. Upload or paste your syllabus text
4. Click **"Extract All Deadlines with AI"**
5. Export to your calendar! 🎉

## 💻 Running Locally
```bash
# Clone the repository
git clone https://github.com/your-username/syllabus-deadline-parser.git
cd syllabus-deadline-parser

# Open with a local server (choose one):
python -m http.server 8000
# OR
npx serve
# OR simply open index.html in your browser

# Navigate to http://localhost:8000
```

## 🛠️ Tech Stack

- **Frontend**: React 18 (via CDN)
- **Styling**: Tailwind CSS
- **AI API**: Anthropic Claude Sonnet 4
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage

## 📸 Example Usage

The parser can automatically extract:
```
Input Syllabus:
"Week 1 (Jan 15): Course Introduction
Assignment 1 due Jan 22: Write a 500-word essay
Midterm Exam on Feb 15
Final Project submission March 30"

Output:
✓ Assignment 1: Introduction Essay (Jan 22, 2026)
✓ Midterm Exam (Feb 15, 2026)  
✓ Final Project (Mar 30, 2026)
```

## 🔒 Privacy & Security

- ✅ Your API key is stored **only in your browser** (localStorage)
- ✅ No data is sent to any third-party servers (except Anthropic's API)
- ✅ All processing happens client-side
- ✅ Your syllabus data is never stored on our servers

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] PDF file upload support
- [ ] Google Calendar direct integration
- [ ] Multiple syllabus support
- [ ] Recurring deadline patterns
- [ ] Email reminders
- [ ] Mobile app version

## 📄 License

MIT License - feel free to use this for your own projects!

## 👨‍💻 Author

**[Your Name]**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Powered by [Anthropic Claude AI](https://www.anthropic.com/)
- Icons by [Lucide](https://lucide.dev/)
- UI components with [Tailwind CSS](https://tailwindcss.com/)

## 💡 Use Cases

Perfect for:
- 📚 College students managing multiple courses
- 👨‍🏫 Teachers organizing their syllabus
- 📊 Project managers tracking deadlines
- 🎯 Anyone who needs to extract dates from documents

---

⭐ **Star this repo if you found it helpful!**

📧 Questions? Open an issue or reach out!
```

#### **4. `.gitignore`**
```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment files
.env
.env.local
.env.development
.env.production

# OS files
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# Editor directories
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Build outputs
dist/
build/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Temporary files
.tmp/
temp/