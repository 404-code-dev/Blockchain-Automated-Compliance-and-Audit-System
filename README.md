# 🔐 Secure-Academic-Records-using-Blockchain

## 📌 Overview

The **Secure-Academic-Records-using-Blockchain** is a secure and tamper-proof platform designed to manage academic records such as marks, attendance, and result approvals.
It integrates **Blockchain technology** with traditional backend systems to ensure **data integrity, transparency, and security**.

---

## 🚀 Features

* 🔑 **Role-Based Authentication**

  * Admin, Teacher, Student login using JWT

* 📊 **Academic Management**

  * Teachers can update marks & attendance
  * Admin can approve results
  * Students can view their records

* ⛓ **Blockchain Integration**

  * Critical actions are logged on blockchain
  * Ensures tamper-proof and transparent records

* 📜 **Audit Logs**

  * Tracks all actions for verification

* 🔐 **Secure Password Handling**

  * Passwords hashed using bcrypt

---

## 🧠 System Architecture

```
Frontend (React)
        ↓
Backend (FastAPI)
        ↓
MongoDB (Database)
        ↓
Blockchain (Web3 / Ethereum / Ganache)
```

---

## 🛠 Tech Stack

### 💻 Frontend

* React.js
* Axios
* CSS

### ⚙️ Backend

* FastAPI (Python)
* Uvicorn

### 🗄 Database

* MongoDB

### 🔐 Authentication

* JWT (JSON Web Tokens)
* Passlib (bcrypt hashing)

### ⛓ Blockchain

* Web3.py
* Ethereum (Ganache)

### 🧰 Tools & Environment

* VS Code
* Git & GitHub
* Postman / Swagger UI
* Python Virtual Environment (venv)

---

## 📂 Project Structure

```
backend/
  ├── app/
  │   ├── api/
  │   ├── services/
  │   ├── core/
  │   ├── db/
  │   ├── blockchain/
  │   └── main.py

frontend/
  ├── src/
  ├── pages/
  ├── components/
```

---

## 🔧 Setup Instructions

### 1️⃣ Clone Repository

```
git clone <your-repo-link>
cd project-folder
```

### 2️⃣ Backend Setup

```
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔐 Default Test Credentials

### 👨‍💼 Admin

* ID: 99002
* Password: admin123

### 👨‍🎓 Student

* ID: 20210002
* Password: 1234

### 👨‍🏫 Teacher

* ID: 50001
* Password: 1234

---

## 🎯 Use Case

This system is useful for:

* Colleges & Universities
* Secure academic record management
* Preventing data tampering
* Transparent result verification

---

## 🚧 Future Enhancements

* 🌐 Deploy on cloud (AWS / Azure)
* 📱 Mobile app integration
* 🔗 Real Ethereum network integration
* 📊 Advanced analytics dashboard

---

## 👨‍💻 Author

**Vimal ,**
**Sashwat ,**
**Raj ,**

# ⭐ Guide


**Mohammed Ibrahim ,**
**AP/CSE ,**
**SONA COLEGE OF TECHNOLOGY .**

---

## ⭐ Conclusion

This project demonstrates how **Blockchain + Backend Systems** can be combined to create a **secure, transparent, and tamper-proof academic management system**.

