# 💰 SmartSpend

### AI-Powered Personal Finance Management System

SmartSpend is a full-stack personal finance management application designed to help users track, analyze, and manage their income and expenses efficiently.

It goes beyond a basic expense tracker by providing financial analytics, budgeting tools, recurring transactions, savings goals, and intelligent insights to help users make better financial decisions.

---

## 🚀 Features

### 🔐 User Authentication
- User registration and login
- Secure user-specific data management
- User-based transaction and financial records

### 💸 Income & Expense Management
- Add income and expenses
- Update and delete transactions
- Categorize transactions
- View transaction history
- Track spending patterns

### 🔄 Recurring Transactions
- Create recurring income/expense entries
- Supports:
  - Daily
  - Weekly
  - Monthly
  - Yearly
- Automatically processes transactions when they become due
- Set start and end dates
- Activate/deactivate recurring transactions

### 📊 Analytics Dashboard
The dashboard provides visual insights into financial activities, including:

- Total income
- Total expenses
- Current balance
- Category-wise spending
- Monthly spending trends
- Budget utilization
- Remaining budget
- Month-over-month comparison
- Highest spending category
- Savings rate
- Overspending analysis

### 💰 Budget Management
- Create budgets
- Set category-wise spending limits
- Track budget utilization
- Monitor remaining budget
- Identify overspending

### 🎯 Savings Goals
- Create savings goals
- Set target amounts
- Track savings progress
- Monitor progress toward financial targets

### 📈 Reports & Insights
- Analyze financial performance
- Understand spending behavior
- Generate meaningful financial summaries
- Identify spending patterns

### 🤖 AI-Powered Insights
SmartSpend is designed to provide intelligent financial insights such as:

- Spending analysis
- Budget recommendations
- Spending pattern detection
- Personalized financial summaries
- Smart categorization assistance

> AI features focus on personal spending analysis and budgeting rather than executing financial transactions or providing investment advice.

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Chart.js / Recharts
- JavaScript
- HTML5
- CSS3

## Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- REST APIs

## Database

- MySQL

## Development & Testing

- IntelliJ IDEA
- VS Code
- Postman
- Git
- GitHub

---

# 🏗️ System Architecture

```text
                ┌─────────────────────┐
                │       User          │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   React Frontend    │
                │  Dashboard & UI     │
                └──────────┬──────────┘
                           │
                     REST API Calls
                           │
                           ▼
                ┌─────────────────────┐
                │   Spring Boot       │
                │      Backend        │
                ├─────────────────────┤
                │ Controllers         │
                │ Services            │
                │ Repositories        │
                │ Business Logic      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │       MySQL         │
                │      Database       │
                └─────────────────────┘
