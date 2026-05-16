Development Agent Rules
Overview
This document defines coding standards, architecture rules, security guidelines, and development workflows for all developers and AI agents working on the Income-Expense-Trucker System.
The purpose is to maintain:
•	Clean code
•	Scalable architecture
•	Consistent structure
•	Secure development
•	Maintainable codebase
•	Team collaboration standards
________________________________________
General Development Rules
1. Clean Code Principles
•	Use meaningful variable names
•	Avoid duplicated code
•	Keep functions reusable
•	Maintain readable code structure
•	Follow modular architecture
________________________________________
2. Frontend Rules
Frontend technologies:
•	Next.js
•	TypeScript
•	Tailwind CSS
•	shadcn/ui
Rules:
•	Use reusable components
•	Maintain responsive design
•	Follow TypeScript safety
•	Use clean folder structure
•	Keep components modular
________________________________________
3. Backend Rules
Backend technologies:
•	Node.js
•	Express.js
•	JavaScript (.js)
Rules:
•	Follow REST API conventions
•	Separate controllers and services
•	Use middleware properly
•	Handle errors consistently
•	Validate all requests
________________________________________
4. Database Rules
Database technology:
•	PostgreSQL
Rules:
•	Use normalized tables
•	Maintain relationships properly
•	Prevent SQL injection
•	Use transactions where necessary
•	Maintain data consistency
________________________________________
Recommended Project Structure
Frontend Structure
•	app/
•	components/
•	hooks/
•	services/
•	types/
•	lib/
•	utils/
•	styles/
________________________________________
Backend Structure
•	controllers/
•	routes/
•	middleware/
•	services/
•	models/
•	utils/
•	config/
________________________________________
API Development Rules
•	Use RESTful API structure
•	Return proper HTTP status codes
•	Use centralized error handling
•	Validate request bodies
•	Protect private routes
________________________________________
Authentication Rules
•	Use JWT authentication
•	Hash passwords securely
•	Protect sensitive routes
•	Validate user roles
•	Never expose sensitive information
________________________________________
Security Rules
•	Use environment variables
•	Prevent XSS attacks
•	Prevent CSRF attacks
•	Sanitize user inputs
•	Never store plaintext passwords
________________________________________
Tailwind CSS Rules
•	Use utility classes properly
•	Avoid unnecessary custom CSS
•	Maintain responsive breakpoints
•	Keep styling consistent
________________________________________
shadcn/ui Rules
•	Reuse components when possible
•	Maintain accessibility
•	Avoid rebuilding existing components
•	Keep UI clean and modern
________________________________________
Error Handling Rules
•	Handle all possible errors
•	Return meaningful messages
•	Avoid exposing server details
•	Log backend errors properly
________________________________________
Git Workflow Rules
Branch Naming
Examples:
•	feature/dashboard
•	feature/authentication
•	fix/api-bug
•	chore/update-packages
________________________________________
Commit Message Standards
Examples:
•	feat: add dashboard analytics
•	fix: resolve login validation issue
•	refactor: optimize API structure
•	docs: update project documentation
________________________________________
Code Review Rules
Before merging code:
•	Review all changes
•	Remove console logs
•	Ensure APIs work correctly
•	Validate authentication flows
•	Test critical functionalities
________________________________________
Performance Rules
•	Optimize database queries
•	Avoid unnecessary frontend re-renders
•	Minimize API response size
•	Use lazy loading when necessary
________________________________________
Testing Rules
•	Test authentication system
•	Test API endpoints
•	Validate role permissions
•	Test financial calculations
•	Verify dashboard functionality
________________________________________
Documentation Rules
•	Document APIs properly
•	Maintain README files
•	Update feature documentation
•	Keep setup instructions updated
________________________________________
Deployment Rules
•	Secure environment variables
•	Validate production builds
•	Monitor server logs
•	Maintain backup strategies
________________________________________
AI Agent Rules
AI assistants must:
•	Follow existing project architecture
•	Maintain TypeScript standards in frontend
•	Maintain JavaScript (.js) standards in backend
•	Avoid duplicate logic
•	Use reusable components
•	Follow naming conventions
•	Maintain security standards
________________________________________
Naming Conventions
Variables
Use camelCase.
Examples:
•	totalIncome
•	expenseAmount
•	currentBalance
________________________________________
Components
Use PascalCase.
Examples:
•	DashboardCard
•	ExpenseTable
•	IncomeChart
________________________________________
File Names
Use kebab-case.
Examples:
•	dashboard-card.tsx
•	expense-service.js
•	transaction-controller.js
________________________________________
Conclusion
Following these development rules ensures the Income-Expense-Trucker System remains scalable, maintainable, secure, and production-ready. All developers and AI agents should strictly follow these guidelines during development.
