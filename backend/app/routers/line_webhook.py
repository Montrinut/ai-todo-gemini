from fastapi import APIRouter, Request
import httpx
import os

router = APIRouter()

LINE_TOKEN = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")


async def reply_line(reply_token: str, message: str):
    if not LINE_TOKEN:
        return
    async with httpx.AsyncClient() as client:
        await client.post(
            "https://api.line.me/v2/bot/message/reply",
            headers={"Authorization": f"Bearer {LINE_TOKEN}", "Content-Type": "application/json"},
            json={"replyToken": reply_token, "messages": [{"type": "text", "text": message}]},
        )


@router.post("/line/webhook")
async def line_webhook(request: Request):
    body = await request.json()
    for event in body.get("events", []):
        if event.get("type") == "message" and event["message"].get("type") == "text":
            user_id = event["source"]["userId"]
            reply_token = event["replyToken"]
            await reply_line(
                reply_token,
                f"LINE User ID ของคุณคือ:\n{user_id}\n\nคัดลอกไปใส่ในช่อง 'LINE User ID' ตอนสมัครสมาชิกได้เลย"
            )
    return {"status": "ok"}
