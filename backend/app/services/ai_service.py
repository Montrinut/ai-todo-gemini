from google import genai
import json
import os

_client = None

def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return _client

async def analyze_task(title: str, description: str = "", deadline: str = "") -> dict:
    """ให้ Gemini วิเคราะห์ task และกำหนด priority, category, suggestion"""
    try:
        prompt = f"""วิเคราะห์ task นี้และตอบเป็น JSON เท่านั้น ห้ามมี text อื่น:
Task: {title}
รายละเอียด: {description}
Deadline: {deadline}

ตอบในรูปแบบนี้เท่านั้น:
{{
    "priority": "high หรือ medium หรือ low",
    "category": "work หรือ personal หรือ health หรือ other",
    "estimatedHours": จำนวนชั่วโมงที่คาดว่าใช้ (ตัวเลขเท่านั้น),
    "suggestion": "คำแนะนำสั้นๆ ภาษาไทย ไม่เกิน 2 ประโยค"
}}"""

        response = get_client().models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())

    except Exception as e:
        print(f"AI analyze error: {e}")
        return {
            "priority": "medium",
            "category": "other",
            "estimatedHours": 1,
            "suggestion": "ไม่สามารถวิเคราะห์ได้ในขณะนี้"
        }


async def analyze_dashboard(tasks: list) -> dict:
    """ให้ Gemini วิเคราะห์ภาพรวม dashboard และให้คำแนะนำ"""
    if not tasks:
        return {
            "summary": "ยังไม่มี task ในระบบ ลองเพิ่ม task แรกของคุณได้เลย!",
            "top_priority": [],
            "suggestions": ["เริ่มต้นด้วยการสร้าง task แรก", "กำหนด deadline เพื่อให้ AI ช่วยจัดลำดับได้"],
            "risk": None,
        }

    task_list = "\n".join([
        f"- [{t.status}] {t.title} | priority:{t.priority} | category:{t.category} | deadline:{t.deadline or 'ไม่ระบุ'}"
        for t in tasks
    ])
    total = len(tasks)
    done  = sum(1 for t in tasks if t.status == "done")
    doing = sum(1 for t in tasks if t.status == "doing")

    try:
        prompt = f"""วิเคราะห์ภาพรวม task ของผู้ใช้และตอบเป็น JSON เท่านั้น ห้ามมี text อื่น:

สถิติ: ทั้งหมด {total} task | เสร็จแล้ว {done} | กำลังทำ {doing}

รายการ task:
{task_list}

ตอบในรูปแบบนี้เท่านั้น:
{{
  "summary": "สรุปภาพรวมสั้นๆ ภาษาไทย 1-2 ประโยค",
  "top_priority": ["task ที่ควรทำก่อนสุด 1", "task ที่ควรทำก่อน 2", "task ที่ควรทำก่อน 3"],
  "suggestions": ["คำแนะนำ 1", "คำแนะนำ 2", "คำแนะนำ 3"],
  "risk": "ความเสี่ยงหรือปัญหาที่น่าเป็นห่วง หรือ null ถ้าไม่มี"
}}"""

        response = get_client().models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())

    except Exception as e:
        print(f"AI dashboard analyze error: {e}")
        return {
            "summary": "ไม่สามารถวิเคราะห์ได้ในขณะนี้",
            "top_priority": [],
            "suggestions": [],
            "risk": None,
        }


async def generate_daily_summary(tasks: list) -> str:
    """ให้ Gemini สรุปงานของวันนี้เป็น message ส่ง Telegram"""
    if not tasks:
        return "✅ วันนี้ไม่มีงานค้างอยู่ ดีมากครับ!"

    task_list = "\n".join([
        f"- {t.title} (Priority: {t.priority}, Deadline: {t.deadline})"
        for t in tasks
    ])

    try:
        response = get_client().models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""สรุปงานต่อไปนี้เป็นข้อความแจ้งเตือนสั้นๆ ภาษาไทย สำหรับส่ง Telegram:
{task_list}

ให้รวมคำแนะนำการจัดลำดับงานด้วย ความยาวไม่เกิน 5 บรรทัด""",
        )
        return response.text

    except Exception as e:
        print(f"AI summary error: {e}")
        task_titles = "\n".join([f"• {t.title}" for t in tasks])
        return f"📋 งานวันนี้:\n{task_titles}"
