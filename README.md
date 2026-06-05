# ai-todo-gemini

Task manager ที่ใช้ Gemini วิเคราะห์งานให้อัตโนมัติ จัดลำดับความสำคัญ และแจ้งเตือนผ่าน LINE

## Features

- สร้าง/แก้ไข/ลบ Task พร้อมระบบ login (JWT)
- Gemini วิเคราะห์ priority, category และเวลาที่คาดว่าใช้ทุกครั้งที่สร้าง task
- Dashboard กราฟสรุปสถานะและ AI วิเคราะห์ภาพรวมของงาน
- แจ้งเตือนผ่าน LINE รายคน — สรุปงานเช้า, เตือน overdue, สรุปตอนเย็น
- รองรับหลาย user แยกข้อมูลกันสมบูรณ์

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Backend | FastAPI, SQLAlchemy |
| Database | SQLite (local) / PostgreSQL (production) |
| AI | Google Gemini 2.5 Flash |
| Notification | LINE Messaging API |
| Auth | JWT + bcrypt |
| Scheduler | APScheduler |
| Deploy | Railway |

## Getting Started

### Backend

```bash
cd backend
python -m venv venv_win
venv_win\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# แก้ไข .env ใส่ GEMINI_API_KEY และ LINE_CHANNEL_ACCESS_TOKEN
```

```bash
uvicorn main:app --reload
# http://localhost:8000
# http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

## Environment Variables

```env
DATABASE_URL=sqlite:///./todo.db
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-key
LINE_CHANNEL_ACCESS_TOKEN=your-line-token
```

## Project Structure

```
todo-ai-app/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── routers/        API endpoints
│       ├── services/       Gemini + LINE
│       ├── models/         Database models
│       ├── schemas/        Pydantic schemas
│       └── jobs/           Scheduled tasks
└── frontend/
    └── src/
        ├── App.jsx
        ├── components/
        └── services/
```

## LINE Setup

1. สร้าง Messaging API channel ที่ [developers.line.biz](https://developers.line.biz)
2. คัดลอก Channel access token ใส่ใน `.env`
3. ตั้ง Webhook URL เป็น `https://your-backend/line/webhook`
4. User add bot เป็นเพื่อน แล้วส่งข้อความอะไรก็ได้ — bot จะตอบ User ID กลับมา
5. นำ User ID ไปกรอกตอนสมัครสมาชิก
