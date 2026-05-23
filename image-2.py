from openai import OpenAI
import base64
import os
from datetime import datetime

# ===== 配置 =====
API_KEY = "sk-你的Token"
BASE_URL = ""

# ===== 初始化客户端 =====
client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL,
)

# ===== 输入提示词 =====
prompt = input("请输入图片提示词: ")

# ===== 可选尺寸 =====
# 1024x1024
# 1792x1024
# 2048x2048
# 3840x2160

size = input("请输入图片尺寸(默认 1024x1024): ").strip()

if not size:
    size = "1024x1024"

print("\n正在生成图片，请等待...\n")

try:
    # ===== 调用接口 =====
    res = client.images.generate(
        model="gpt-image-2",
        prompt=prompt,
        size=size,
        quality="hd",
    )

    # ===== 解析 Base64 =====
    image_base64 = res.data[0].b64_json
    image_bytes = base64.b64decode(image_base64)

    # ===== 自动文件名 =====
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"generated_{timestamp}.png"

    # ===== 保存到当前目录 =====
    with open(filename, "wb") as f:
        f.write(image_bytes)

    current_path = os.path.abspath(filename)

    print("图片生成成功 ✅")
    print(f"保存位置: {current_path}")

except Exception as e:
    print("生成失败 ❌")
    print(e)