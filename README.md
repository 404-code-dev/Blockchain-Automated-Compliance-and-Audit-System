# Blockchain-Based Compliance and Audit System

A full-stack application designed to ensure **secure, transparent, and tamper-proof academic data management** using **Blockchain, FastAPI, MongoDB, and React**.

---

## Overview

This system provides a role-based platform for managing academic operations such as **marks, attendance, and result approval**, while ensuring **compliance enforcement and auditability**.

Every critical action is:

* Validated using a **Compliance Engine**
*  Logged as an **Audit Record**
*  Secured using **SHA-256 hashing**
*  Stored on **Blockchain (Ganache + Solidity)** for immutability

---

##  Features

###  Authentication & Security

* JWT-based authentication
* Password hashing using bcrypt
* Role-Based Access Control (Student, Teacher, Admin)

###  Core Functionalities

* Students can view marks, attendance, and profile
* Teachers can update marks and attendance
* Admins can approve results and manage users

###  Compliance Engine

* Enforces predefined rules before any action
* Blocks unauthorized actions
* Ensures backend-level security

###  Audit Logging

* Logs every action (ALLOWED / BLOCKED)
* Includes actor, role, action, rule, timestamp
* Generates SHA-256 hash for integrity

###  Blockchain Integration

* Uses Ganache (local Ethereum network)
* Smart contract stores audit log hashes
* Ensures tamper-proof records

###  Verification Module

* Recalculates hash from database
* Compares with blockchain hash
* Returns:

  * ✅ VERIFIED
  * ❌ TAMPERED

---

## Tech Stack

**Frontend:**

* React (Vite)
* JavaScript
* Axios

**Backend:**

* FastAPI (Python)
* JWT Authentication
* bcrypt

**Database:**

* MongoDB

**Blockchain:**

* Ganache (Ethereum local blockchain)
* Solidity Smart Contract
* Web3.py

---

##  System Architecture

```
React Frontend
      ↓
FastAPI Backend
      ↓
Compliance Engine
      ↓
MongoDB + Blockchain (Ganache)
      ↓
Audit Logs (Hash + Transaction ID)
```

---

##  Workflow

1. User logs in → JWT generated
2. Role-based dashboard is loaded
3. User performs action (marks/attendance update)
4. Compliance Engine validates action
5. Action is ALLOWED or BLOCKED
6. Audit log is created
7. SHA-256 hash is generated
8. Hash stored in MongoDB + Blockchain
9. Admin can view logs
10. Verification checks integrity (VERIFIED / TAMPERED)

---

##  Installation & Setup

### 1️ Clone Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️ Backend Setup

```bash
cd Backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4️ Blockchain Setup

* Start Ganache on port **7545**
* Deploy smart contract
* Update `.env` with:

  * CONTRACT_ADDRESS
  * PRIVATE_KEY

---

##  Environment Variables

`.env` file in backend:

```
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_secret_key
BLOCKCHAIN_URL=http://127.0.0.1:7545
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address

---

##  License

This project is developed for academic purposes.

---

##  Acknowledgement

This project was developed as part of a final year engineering project to demonstrate the integration of **Blockchain technology with compliance systems** for secure and transparent data management.
