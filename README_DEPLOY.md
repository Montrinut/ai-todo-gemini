# Deploy to Railway

## Backend

1. ไปที่ railway.app → New Project → Deploy from GitHub
2. เลือก folder `backend`
3. Add Plugin → PostgreSQL
4. ตั้งค่า Environment Variables:
   - DATABASE_URL → คัดลอกจาก PostgreSQL plugin
   - SECRET_KEY → random string
   - ANTHROPIC_API_KEY → จาก console.anthropic.com
   - TELEGRAM_BOT_TOKEN → จาก @BotFather
   - TELEGRAM_CHAT_ID → chat id ของคุณ

## Frontend

1. Railway → New Service → Deploy from GitHub
2. เลือก folder `frontend`
3. ตั้งค่า Environment Variables:
   - VITE_API_URL → URL ของ backend (เช่น https://xxx.railway.app)
