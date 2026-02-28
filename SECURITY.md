# 🔒 Security Policy

Security is a top priority for Society Issue Tracker. This document outlines our security practices and guidelines.

## 📋 Table of Contents
- [Reporting Security Issues](#reporting-security-issues)
- [Security Best Practices](#security-best-practices)
- [Vulnerability Management](#vulnerability-management)
- [Data Protection](#data-protection)
- [Authentication & Authorization](#authentication--authorization)
- [API Security](#api-security)
- [Frontend Security](#frontend-security)
- [Infrastructure Security](#infrastructure-security)
- [Compliance](#compliance)

---

## 🚨 Reporting Security Issues

**Please do NOT create public GitHub issues for security vulnerabilities.**

### Responsible Disclosure

If you discover a security vulnerability, please email:

📧 **security@societytracker.com**

**Include:**
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Response Timeline
- **24 hours:** Initial acknowledgment
- **72 hours:** Assessment and action plan
- **30 days:** Security patch released

---

## 🛡 Security Best Practices

### 1. Code Security

```javascript
// ❌ BAD: Hardcoded credentials
const MONGO_URI = "mongodb://user:password@localhost:27017/db";

// ✅ GOOD: Use environment variables
const MONGO_URI = process.env.MONGO_URI;
```

```javascript
// ❌ BAD: SQL/NoSQL injection risk
app.get('/users/:name', (req, res) => {
  db.find({ name: req.params.name }); // Vulnerable!
});

// ✅ GOOD: Mongoose with schema validation
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
```

### 2. Input Validation

```javascript
// ✅ GOOD: Validate and sanitize input
const { residentName, age, description } = req.body;

// Validate types
if (typeof residentName !== 'string' || residentName.length > 100) {
  return res.status(400).json({ error: 'Invalid name' });
}

// Validate number range
if (!Number.isInteger(age) || age < 0 || age > 150) {
  return res.status(400).json({ error: 'Invalid age' });
}
```

### 3. XSS Prevention

```javascript
// ❌ BAD: Directly render user input
<div>{userInput}</div>

// ✅ GOOD: React automatically escapes
// React escapes all interpolated values by default
const [userInput, setUserInput] = useState('');
<div>{userInput}</div>

// If HTML is needed, use DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userInput)}} />
```

### 4. CSRF Protection

```javascript
// ✅ GOOD: Verify origin for state-changing operations
app.use((req, res, next) => {
  // Check request origin
  if (req.method !== 'GET' && req.headers.origin !== process.env.CORS_ORIGIN) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  next();
});
```

---

## 🔍 Vulnerability Management

### Dependency Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Update dependencies safely
npm update

# List outdated packages
npm outdated
```

### Security Scanning

```bash
# Using Snyk (requires account)
npm install -g snyk
snyk test

# Using npm audit
npm audit --json
```

### Regular Reviews

- Monthly security audits
- Quarterly penetration testing
- Annual security assessment

---

## 🔐 Data Protection

### Personal Information Handling

```javascript
// ✅ GOOD: Minimal data collection
// Only collect essential information
const ticket = {
  residentName,      // Required
  residentAge,       // Required for priority
  description,       // Required
  location,          // Required for technician dispatch
  // Do NOT collect: SSN, Bank details, Medical records, etc.
};

// ✅ GOOD: Secure data storage
// Hash sensitive data
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// Encrypt sensitive fields
const encrypted = cipher.update(ssn);
```

### Data Retention

- **Tickets:** Retained for 2 years then archived
- **User Data:** Deleted upon account closure
- **Logs:** Retained for 90 days

---

## 🔑 Authentication & Authorization

### Implement JWT Authentication

```javascript
// ✅ GOOD: Use JWT for stateless authentication
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Protect routes
app.post('/api/tickets', verifyToken, (req, res) => {
  // Only authenticated users can create tickets
});
```

### Role-Based Access Control

```javascript
// ✅ GOOD: Implement RBAC
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Usage
app.get('/api/admin/stats', verifyToken, authorize(['admin']), getStats);
app.get('/api/tickets', verifyToken, authorize(['resident', 'admin', 'technician']), getTickets);
```

### Secure Password Requirements

```javascript
// ✅ GOOD: Enforce strong passwords
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  if (password.length < minLength || 
      !hasUpperCase || !hasLowerCase || 
      !hasNumbers || !hasSpecialChar) {
    throw new Error('Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters');
  }
};
```

---

## 🌐 API Security

### CORS Configuration

```javascript
// ✅ GOOD: Restrict CORS to known origins
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

### Rate Limiting

```javascript
// ✅ GOOD: Implement rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### HTTPS Enforcement

```javascript
// ✅ GOOD: Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### Security Headers

```javascript
// ✅ GOOD: Add security headers
const helmet = require('helmet');

app.use(helmet());
// This sets:
// - Content-Security-Policy
// - X-Frame-Options
// - X-Content-Type-Options
// - X-XSS-Protection
// - Strict-Transport-Security
```

---

## 🎨 Frontend Security

### Environment Variables

```env
# ✅ GOOD: Prefix public variables
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Society Issue Tracker

# ❌ NEVER: Put secrets in frontend env
VITE_API_KEY=secret_key_123
```

### Secure Local Storage

```javascript
// ❌ BAD: Never store sensitive data in localStorage
localStorage.setItem('token', jwtToken);

// ✅ GOOD: Use httpOnly cookies or sessionStorage
// Server sets httpOnly cookie - not accessible via JavaScript
// Or use memory storage + clear on logout
const [authToken, setAuthToken] = useState(null);
```

### Content Security Policy (CSP)

```html
<!-- ✅ GOOD: Add CSP header -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

---

## 🖥 Infrastructure Security

### Environment Variables Protection

```bash
# ✅ GOOD: Use .env.local (never commit)
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key

# Add to .gitignore
*.env
*.env.local
.env.production
```

### Database Security

```javascript
// ✅ GOOD: Use MongoDB encrypted connections
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db?retryWrites=true&w=majority

// Enable authentication
db.createUser({
  user: "app_user",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "society-tracker" }]
});
```

### Network Security

```bash
# ✅ GOOD: Configure firewall rules
# Allow: HTTPS (443), SSH (22), Custom API port
# Block: Everything else

# MongoDB Atlas network access
# Add IP whitelist or VPC peering
```

### Backup Security

```bash
# ✅ GOOD: Encrypt backups
mongodump --archive=backup.archive --gzip

# Store in secure location
# Test restore regularly
```

---

## 📋 Compliance

### GDPR Compliance

- [ ] User consent for data collection
- [ ] Right to data access
- [ ] Right to data deletion
- [ ] Data processing agreements
- [ ] Privacy policy

### Data Privacy

- [ ] Encrypt data in transit (HTTPS)
- [ ] Encrypt data at rest (DB encryption)
- [ ] Minimal data collection
- [ ] Regular security audits
- [ ] Incident response plan

### Security Certifications

- [ ] OWASP Top 10 compliance
- [ ] CWE/SANS Top 25 review
- [ ] Regular penetration testing

---

## 🔍 Security Checklist

### Development
- [ ] No hardcoded credentials
- [ ] Input validation on all forms
- [ ] SQL/NoSQL injection protection
- [ ] XSS prevention measures
- [ ] CSRF token implementation
- [ ] Security headers configured

### Testing
- [ ] Run npm audit
- [ ] Dependency scanning
- [ ] Static code analysis
- [ ] OWASP ZAP scan
- [ ] Penetration testing

### Deployment
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] WAF (Web Application Firewall) enabled
- [ ] Monitoring and alerting setup
- [ ] Backup tested

### Operations
- [ ] Monitor error logs
- [ ] Track security updates
- [ ] Update dependencies monthly
- [ ] Incident response practiced
- [ ] Security training for team

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SANS Top 25](https://www.sans.org/top25-software-errors/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security](https://snyk.io/learn/react-security/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

## 🚀 Security Updates

- **Critical:** Applied within 24 hours
- **High:** Applied within 1 week
- **Medium:** Applied within 2 weeks
- **Low:** Applied monthly

---

**Last Updated:** February 28, 2026
**Version:** 1.0.0
**Next Review:** 30 days
