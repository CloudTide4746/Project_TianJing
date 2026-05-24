# 刻迹 — 时空刻迹数字藏品

> 拍照即锚定坐标·时间·天气，AI 将此刻炼成不可篡改的时空刻迹。

## 一句话

**每张照片，都是一块时空琥珀。** 拍照自动锚定 GPS + 时间 + 天气 + AQI，AI 生成风格化影像与叙事，铸造成可收藏、可分享的数字刻迹。

## 解决了什么问题

| 痛点 | 刻迹的解法 |
|------|-----------|
| 随手拍照，拍完即忘 | 每张照片带上时空证明，成为"不可复现的此刻" |
| 照片缺乏上下文 | GPS/天气/时间/AQI 自动锚定，无需手动输入 |
| 没有收藏仪式感 | AI 生成故事 + 古风视觉，把照片变成藏品 |
| 分享缺乏差异化 | 一键生成带时空印记的分享卡片 |

## 核心体验闭环

```
打开 App → 拍照 → GPS/天气/时间自动锚定 → AI 生成刻迹 → 查看结果 → 收藏/分享
```

全程 **零手动输入**，评委/用户 3 分钟内能理解全部价值。

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Expo SDK 56 + React Native 0.85 + TypeScript |
| 路由 | Expo Router (file-based routing) |
| 后端 | FastAPI (Python) |
| 数据库 | SQLite (WAL mode) |
| AI 生成 | 对接图像生成 + 文本生成 API |
| 部署 | 前端 Expo Go / 后端 Render |

## 项目结构

```
text/
├── src/
│   ├── app/                  # 页面 (Expo Router)
│   │   ├── (tabs)/
│   │   │   ├── index.tsx     # 首页 — 精选 + 最近刻迹
│   │   │   ├── create.tsx    # 创作 — 拍照 + 自动锚定
│   │   │   └── explore.tsx   # 探索 — 时间线 + 地图 + 筛选
│   │   ├── generating.tsx    # 生成中 — 进度轮询
│   │   ├── result/[id].tsx   # 结果 — 刻迹详情
│   │   └── share/[id].tsx    # 分享 — 海报 + 渠道
│   ├── components/           # 组件
│   ├── services/             # API 客户端
│   ├── types/                # TypeScript 类型
│   └── constants/            # 主题 & 常量
├── backend/
│   ├── main.py               # FastAPI 入口
│   ├── database.py           # SQLite 数据层
│   ├── routers/              # API 路由 (collectibles, generate, location, qrcode)
│   ├── services/             # AI 生成 / 天气 / 地理编码
│   └── models.py             # 数据模型
└── assets/                   # 图片 & 字体
```

## 快速开始

### 前端

```bash
npm install
npx expo start
```

用 Expo Go 扫码，或在模拟器中运行。

### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

后端服务地址：`https://tianjing-backend.onrender.com`

## 黑客松思路

基于以下原则构建：

1. **有人真的痛** — 拍照无感，回忆缺乏仪式感
2. **非伪需求** — 人人拍照，但没人给照片做"时空公证"
3. **方案明显更好** — 零手动输入，GPS/天气/时间全自动锚定，AI 出故事
4. **能快速被感知** — 打开→拍照→3分钟看到 AI 生成结果
5. **最小闭环跑通** — 拍照→上传→生成→结果→分享，完整链路
6. **核心体验成立** — 即使去掉所有辅助功能，"拍照→看结果"两个功能已足够成立

## 生成参数

支持自定义 AI 生成风格：

| 维度 | 选项 |
|------|------|
| 艺术风格 | 水墨意境 / 敦煌壁画 / 油画厚重 / 木刻版画 / 水彩记忆 / 赛博霓虹 |
| 色调 | 暖土色 / 冷玉色 / 旧照片 / 黑白灰 |
| 时间质感 | 千年风化 / 百年斑驳 / 当代清新 / 未来光泽 |
| 情绪 | 孤独 / 热闹 / 宁静 / 壮阔 / 神秘 / 浪漫 / 悲壮 / 希望 |
| 叙事视角 | 第三人称纪实 / 第一人称日记 / 考古报告体 / 诗歌体 |
| 朝代拼贴 | 秦 / 汉 / 唐 / 宋 / 明 / 清 |
