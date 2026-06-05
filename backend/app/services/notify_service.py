import os
import httpx

LINE_TOKEN = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")


async def send_line(message: str, user_id: str):
    """ส่งข้อความผ่าน LINE Messaging API ไปหา user คนนั้น"""
    if not LINE_TOKEN or not user_id:
        return
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://api.line.me/v2/bot/message/push",
                headers={
                    "Authorization": f"Bearer {LINE_TOKEN}",
                    "Content-Type": "application/json",
                },
                json={
                    "to": user_id,
                    "messages": [{"type": "text", "text": message}],
                },
                timeout=10,
            )
            res.raise_for_status()
            print(f"[LINE] sent to {user_id}")
    except Exception as e:
        print(f"[LINE] error: {e}")


async def notify_task_created_line(task, line_id: str):
    """แจ้งเตือนเมื่อสร้าง task ใหม่"""
    emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(task.priority, "⚪")
    msg = (
        f"✅ สร้าง Task ใหม่แล้ว!\n\n"
        f"📌 {task.title}\n"
        f"{emoji} Priority: {task.priority}\n"
        f"📂 Category: {task.category}\n"
        f"⏱ คาดว่าใช้เวลา: {task.estimated_hours} ชั่วโมง\n"
        f"💡 {task.ai_suggestion}"
    )
    await send_line(msg, line_id)


async def notify_overdue_line(tasks: list, line_id: str):
    """แจ้งเตือนงาน overdue ของ user คนนั้น"""
    if not tasks:
        return
    lines = []
    for t in tasks:
        emoji = "🔴" if t.priority == "high" else "🟡" if t.priority == "medium" else "🟢"
        lines.append(f"{emoji} {t.title}\n   ⏰ หมดเวลา: {t.deadline.strftime('%d/%m/%Y %H:%M')}")
    msg = "⚠️ งานที่เกิน Deadline!\n\n" + "\n\n".join(lines)
    await send_line(msg, line_id)


async def notify_daily_summary_line(tasks: list, summary: str, line_id: str):
    """ส่งสรุปงานประจำวันให้ user คนนั้น"""
    msg = f"🌅 สรุปงานวันนี้\n\n{summary}"
    await send_line(msg, line_id)


async def notify_evening_line(tasks: list, line_id: str):
    """แจ้งเตือนตอนเย็น งานที่ยังค้างอยู่ของ user คนนั้น"""
    remaining = [t for t in tasks if t.status != "done"]
    if not remaining:
        return
    names = "\n".join([f"• {t.title}" for t in remaining])
    msg = f"🌆 งานที่ยังค้างอยู่วันนี้\n\n{names}\n\n💪 ยังมีเวลาทำเพิ่มได้นะ!"
    await send_line(msg, line_id)
