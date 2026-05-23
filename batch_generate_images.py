from openai import OpenAI
import base64
import os
from datetime import datetime

# ===== 配置 =====
API_KEY = 'sk-m0Qp8Jg6j0n1iL8X2k7tpFgWPSvTiD4RrSmhA5pfEhvZpSaC'
BASE_URL = 'https://api.aipaibox.com/v1'

# ===== 初始化客户端 =====
client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL,
    timeout=180.0,
)

# ===== 五张 UI 组件图的配置 =====
# (文件名, 提示词, 尺寸)
IMAGE_CONFIGS = [
    (
        "poster-spacetime-imprint.png",
        "A tall vertical magazine-editorial product poster (9:16) for Chinese AI photo app '刻迹'. Warm aged-paper (#f6f2e9), gold accents (#b08a59), museum-spotlight feel. DO NOT arrange elements in numbered horizontal rows. Instead use an asymmetric editorial layout — elements staggered left-right, some overlapping, like a premium art magazine spread. Key elements to place organically across the canvas: [HEADER] Top area, offset slightly right: large Chinese calligraphy '刻迹' in burnished gold, beneath it small subtitle '拍照锚定 · 风格转绘 · 刻成珍藏'. [CAPTURE SCENE] Mid-upper area, placed left: a smartphone showing photo capture UI, surrounded by floating small labels — GPS pin '坐标', clock '时间', cloud '天气' — to show auto-anchor. A tiny note nearby: '也可自写内容'. [BEFORE-AFTER] Center-right, slightly overlapping: left half a plain lake photo, golden arrow, right half the same scene in ink-wash painting style. Below it staggered 6 mini style swatches labeled 水墨/敦煌/油画/木刻/水彩/赛博. [COLLECTIBLE CARD] Lower-mid area, left side, presented at a slight angle like a card on a table: a beautiful card with AI-stylized image, location name, a golden verse line, coordinate stamp. [FLOW DIAGRAM] Bottom-right area, small and subtle: 4 connected circles with icons — '拍摄'→'选风格'→'AI铸造'→'分享'. [COLLECTION] Bottom-left, three mini cards fanned like a hand. No QR codes, no human faces, no linear section numbering. Layout should feel like an editorial spread — airy, staggered, sophisticated.",
        "1024x1792",
    ),
    (
        "create-banner.png",
        "A horizontal digital illustration, 1372x240 pixels. The style fuses archaeological manuscript with classical ink wash painting. Across the frame: a translucent ancient stone stele fragment on the left, drifting gold dust particles through the center, a floating ethereal brush on the right. Warm cream background (#f6f2e9). Muted gold (#b08a59) and faded ink (#5f564e) fine-line accents. The mood is quiet digital artifact restoration workbench - focused, slightly mysterious. No text, no UI elements. Soft vignette fade at the edges. Very low contrast, atmospheric.",
        "1792x1024",
    ),
    (
        "upload-placeholder-bg.png",
        "An atmospheric background for a photo upload area, 1372x772 pixels, 16:9 aspect ratio. The center is a soft, bright empty zone (deliberate negative space). Surrounding the center: extremely faint pencil sketches of ancient ruin walls, barely-visible pottery shard motifs, and a subtle golden glow radiating outward. The overall feel is an archaeological record sheet waiting to be filled in. Warm grey-to-cream gradient, very low contrast so that foreground text remains readable. No text anywhere. Decorative elements only at the outer edges. The center 60% of the image should be nearly blank with just a faint warm glow.",
        "1792x1024",
    ),
    (
        "icon-ruin.png",
        "A square icon, 128x128 pixels, theme ruin reconstruction. Minimalist archaeological line-art style. The subject is a contour line drawing of an ancient stone structure, rendered in muted gold (#b08a59) lines on a warm aged-paper textured background. The line style sits between architectural sketch and ancient cartography, with a slightly mottled, timeworn texture. A faint beam of light shines down from above at the center, suggesting the ruin is being digitally restored. No text. Square composition.",
        "1024x1024",
    ),
    (
        "icon-message.png",
        "A square icon, 128x128 pixels, theme ruin message / memorial fragment. Style between ancient pottery shard and emotional letter. The subject is a broken shard of clay or stone with faint handwritten text traces visible on its surface, rendered in warm rust (#9a5547) lines. The shard has irregular broken edges with subtle glowing cracks, suggesting a message embedded in the fragment. Background is a soft warm grey-rose tone with fine paper-fiber texture. No text other than the faint illegible traces on the shard. Square composition.",
        "1024x1024",
    ),
    (
        "icon-crystal.png",
        "A square icon, 128x128 pixels, theme memory crystal. Style between mineral crystal formation and light refraction. The subject is a cluster of translucent crystal structures rendered in teal (#5e8783) and pale jade (#8fb6af). The crystal facets refract soft cool light in multiple directions. Background is a pale grey-green with subtle mist/water-vapor texture. Tiny glowing light particles are suspended inside the crystal like sealed memory fragments. The overall feel is cool, translucent, and lustrous. Square composition. No text.",
        "1024x1024",
    ),
]


def generate_images():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(current_dir, "assets", "art")
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        print(f"Created: {assets_dir}")

    print(f"Generating {len(IMAGE_CONFIGS)} images...")

    for filename, prompt, size in IMAGE_CONFIGS:
        print(f"\n--- Generating [{filename}] ---")
        print(f"Size: {size}")

        try:
            res = client.images.generate(
                model="gpt-image-2",
                prompt=prompt,
                size=size,
                quality="hd",
            )

            image_base64 = res.data[0].b64_json
            image_bytes = base64.b64decode(image_base64)

            file_path = os.path.join(assets_dir, filename)

            with open(file_path, "wb") as f:
                f.write(image_bytes)

            print(f"OK: {file_path}")

        except Exception as e:
            print(f"FAILED [{filename}]: {e}")


if __name__ == "__main__":
    generate_images()
