# 🤖 AI Todo/Task Manager

Full-stack Task Manager พร้อม AI วิเคราะห์งานอัตโนมัติ และแจ้งเตือนผ่าน Telegram

## ✨ Features

- ✅ CRUD Tasks พร้อม authentication (JWT)
- 🤖 AI วิเคราะห์ priority, category, คาดเวลา (Claude API)
- 📱 แจ้งเตือนผ่าน **Telegram** และ **LINE**
- ⏰ Cron job สรุปงานทุกเช้า 8:00 น. และเตือน overdue ทุกชั่วโมง
- 🌐 Frontend React + Tailwind CSS

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Python + FastAPI |
| Database | PostgreSQL + SQLAlchemy |
| AI | Claude API (Anthropic) |
| Notification | Telegram Bot / LINE |
| Scheduler | APScheduler |

## 🚀 วิธีติดตั้ง

### 1. Clone & Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

cp .env.example .env
# แก้ไข .env ใส่ค่าจริง
```

### 2. ตั้งค่า Database

```bash
# สร้าง database PostgreSQL ชื่อ tododb ก่อน
alembic upgrade head
```

### 3. รัน Backend

```bash
uvicorn main:app --reload
# เปิดที่ http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### 4. Setup Frontend

```bash
cd frontend
npm install
npm start
# เปิดที่ http://localhost:3000
```

## 🔑 ตั้งค่า Telegram Bot

1. เปิด Telegram แล้วคุยกับ **@BotFather**
2. พิมพ์ `/newbot` แล้วตั้งชื่อ bot
3. คัดลอก **token** ที่ได้ใส่ใน `.env`
4. คุยกับ bot แล้วไปที่ `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. คัดลอก **chat_id** ใส่ใน `.env`

## 📁 Project Structure

```
todo-ai-app/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── routers/     ← API endpoints
│       ├── services/    ← AI + Notification
│       ├── models/      ← Database models
│       ├── schemas/     ← Pydantic schemas
│       └── jobs/        ← Cron jobs
└── frontend/
    └── src/
        ├── App.jsx
        ├── components/
        └── services/
```

## 📸 Demo

> _เพิ่ม screenshot หรือ video demo ที่นี่_

## 📄 License

MIT
