# Contributing to Society Issue Tracker

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Coding Standards](#coding-standards)

---

## 🤝 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get oriented
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment or discrimination
- Personal attacks or insulting comments
- Trolling or inflammatory remarks
- Any form of abuse

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- Git
- MongoDB (local or cloud)
- Basic knowledge of React, Express, and Node.js

### Fork the Repository
1. Click "Fork" on the GitHub repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/society-issue-tracker.git
cd society-issue-tracker
```

### Add Upstream Remote
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/society-issue-tracker.git
git fetch upstream
```

---

## 💻 Development Setup

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env

# Edit .env with your MongoDB URI
# nano .env (or use your favorite editor)

# Start development server
npm start
```

### Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Both should be running before you start developing.

---

## ✏️ Making Changes

### Creating a Feature Branch
```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Conventions
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `style/description` - UI/styling changes

### Examples
```bash
git checkout -b feature/add-email-notifications
git checkout -b bugfix/fix-socket-connection
git checkout -b docs/update-readme
```

---

## 📝 Commit Guidelines

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring without feature changes
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Dependencies, build process updates

### Examples
```bash
git commit -m "feat: add email notification system"
git commit -m "fix: resolve socket.io connection timeout"
git commit -m "docs: update API documentation"
git commit -m "style: format ResidentDashboard component"
```

### Good Commit Practices
- Write meaningful commit messages
- Make small, logical commits
- Don't commit debug code or console.logs
- Reference issues in commits: `fix: #123`

---

## 📤 Pull Request Process

### Before Submitting PR

1. **Test Your Changes**
```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd client
npm run dev
```

2. **Check for Linting Issues**
```bash
# Frontend
cd client
npm run lint  # if available
```

3. **Update Documentation**
- Update README if needed
- Add comments for complex logic
- Update API docs if endpoints changed

### Creating a Pull Request

1. **Push your changes**
```bash
git push origin feature/your-feature-name
```

2. **Create PR on GitHub**
   - Click "Compare & pull request"
   - Fill in the PR template
   - Reference related issues using `#issue-number`

### PR Title Format
```
[type]: Brief description

e.g., [feature]: Add email notifications
e.g., [bugfix]: Fix socket connection issue
e.g., [docs]: Update installation guide
```

### PR Description Template
```markdown
## Description
Brief explanation of changes

## Related Issues
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes:
1. Step 1
2. Step 2

## Screenshots (if applicable)
Before/After screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.logs in production code
- [ ] Tested in mobile/tablet/desktop
```

### PR Review Process
- Maintainers will review within 48 hours
- May request changes
- Approval required before merge
- May be merged by maintainers after approval

---

## 🐛 Reporting Issues

### Before Creating an Issue
- Check existing issues to avoid duplicates
- Use GitHub search feature
- Read the FAQ in README

### Issue Template
```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node version: v16+
- Backend running: Yes/No

## Screenshots
If applicable, add screenshots

## Additional Context
Any other relevant information
```

---

## 📐 Coding Standards

### JavaScript/React
```javascript
// ✅ Good
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Descriptive variable names
  const ticketData = { ...formData };
  
  // Comments for complex logic
  // Validate age is within reasonable range
  if (ticketData.age < 0 || ticketData.age > 150) {
    return;
  }
};

// ❌ Bad
const x = (e) => {
  e.preventDefault();
  const t = { ...d };
}
```

### React Components
```javascript
// ✅ Good
export default function ResidentDashboard({ user, setUser }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Effect code
  }, [user]);
  
  return <div>{/* JSX */}</div>;
}

// ❌ Avoid
export default function ResidentDashboard() {
  // Avoid using inline styles for complex styling
  // Use useState for state management
}
```

### Node/Express
```javascript
// ✅ Good
app.post('/api/tickets', async (req, res) => {
  try {
    const { residentName, description } = req.body;
    
    // Validate input
    if (!residentName || !description) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Naming Conventions
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **React Components**: PascalCase
- **CSS Classes**: kebab-case

### Comments & Documentation
```javascript
// For complex logic, explain WHY not WHAT
// ✅ Good
// Elderly residents get priority to ensure quick response
if (age >= 65) priority = 'Critical';

// ❌ Bad
// Set priority to critical
priority = 'Critical';
```

---

## 🎯 Areas for Contribution

### High Priority
- [ ] User authentication (JWT)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

### Medium Priority
- [ ] SMS notifications
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Video call feature

### Low Priority
- [ ] Dark/Light mode toggle
- [ ] Additional themes
- [ ] Performance optimizations
- [ ] Code documentation

---

## 📚 Resources

- [GitHub Contributing Guide](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)
- [React Best Practices](https://react.dev/learn)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ⚡ Quick PR Checklist

Before submitting, verify:
- [ ] Code runs without errors
- [ ] Tested on mobile, tablet, desktop
- [ ] No console.logs in production code
- [ ] Comments added for complex logic
- [ ] Commit messages are descriptive
- [ ] PR title and description are clear
- [ ] No unnecessary dependencies added
- [ ] Environment variables documented
- [ ] README updated if needed
- [ ] API documentation updated if needed

---

## 🙏 Thank You!

Your contributions make this project better. We appreciate your time and effort!

---

**Last Updated:** February 28, 2026
**Maintained By:** Society Tracker Team
