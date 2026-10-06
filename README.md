# 💰 SmartSpend

### Personal Finance Management System with Intelligent Spending Insights

SmartSpend is a full-stack personal finance management application designed to help users track, analyze, and manage their income and expenses efficiently.

It goes beyond a basic expense tracker by providing budgeting, recurring transactions, savings goals, financial analytics, notifications, and intelligent spending insights.

---

## 🚀 Features

### 🔐 User Authentication

- User registration and login
- JWT-based authentication
- Protected frontend routes
- User-specific financial data
- Secure password handling with BCrypt
- Automatic logout and session handling

### 💸 Income & Expense Management

- Add income and expenses
- Update transactions
- Delete transactions
- Categorize transactions
- View transaction history
- Track total income and expenses
- Calculate current balance

### 🗂️ Category Management

- Create custom categories
- Update categories
- Delete categories
- Separate income and expense categories
- User-specific categories

### 💰 Budget Management

- Create category-wise budgets
- Set spending limits
- Track budget utilization
- Calculate remaining budget
- Detect budget warnings
- Detect exceeded budgets
- Budget analysis based on transaction data

### 🎯 Savings Goals

- Create savings goals
- Set target amounts
- Track current savings
- Monitor progress toward financial targets
- Update savings goals
- Mark completed goals

### 🔄 Recurring Transactions

- Create recurring income and expense entries
- Supports:
  - Daily
  - Weekly
  - Monthly
  - Yearly
- Automatically processes due transactions
- Set start and end dates
- Activate/deactivate recurring transactions
- Automatically creates normal transactions when recurring entries become due

### 🔔 Notifications

- View financial notifications
- Budget warning notifications
- Budget exceeded notifications
- Mark individual notifications as read
- Mark all notifications as read
- Delete notifications
- Filter notifications by type and read status

### 📊 Analytics Dashboard

- Total income
- Total expenses
- Current balance
- Savings rate
- Total transactions
- Category-wise expense analysis
- Highest spending category
- Income vs expense comparison
- Spending category breakdown
- Visual spending insights

### 📈 Dashboard

The SmartSpend dashboard provides a quick overview of the user's financial activity.

- Total income
- Total expenses
- Current balance
- Savings rate
- Total transactions
- Top spending category
- Budget status
- Active savings goals
- Unread notifications

### 🤖 Intelligent Spending Insights

SmartSpend currently provides rule-based spending analysis using the user's transaction data.

The system can:

- Identify the highest spending category
- Calculate spending in the highest category
- Generate spending-related recommendations
- Store generated insights
- View previous insights
- Delete previous insights

> The current insight engine is rule-based. It does not use an external generative AI API yet.

### 📱 Responsive User Interface

- Responsive desktop layout
- Tablet support
- Mobile-friendly interface
- Responsive navigation bar
- Mobile hamburger menu
- Consistent UI across application modules

---

# 🛠️ Tech Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Axios

## Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- REST APIs
- JWT Authentication
- BCrypt Password Hashing
- JUnit 5
- Mockito

## Database

- MySQL

## Development & Testing

- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git
- GitHub

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    React Frontend   │
                         │                     │
                         │ Dashboard           │
                         │ Transactions        │
                         │ Categories          │
                         │ Budgets             │
                         │ Savings Goals       │
                         │ Recurring           │
                         │ Notifications       │
                         │ Analytics           │
                         │ AI Insights         │
                         └──────────┬──────────┘
                                    │
                              REST API + JWT
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
                         │ Authentication      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       MySQL         │
                         │      Database       │
                         └─────────────────────┘
