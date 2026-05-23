<!-- @format -->

# 遗址数字藏品 App - 主页 UI 设计规范（浅色水墨风）

## 1. 核心视觉风格 (Visual Style)

- **主题风格**: 中国文旅、东方美学、极致水墨画风格 (Oriental aesthetics, Chinese cultural tourism, Traditional Chinese Ink Painting style, light theme).
- **背景基调 (Background)**:
  - 以**素雅的米白色/宣纸白 (Rice paper white, #f5f0e8)**为主背景，营造出铺开画卷般的清透质感。
  - 背景中隐约可见淡淡的水墨晕染 (subtle ink wash effect) 与细微的纸张纹理 (paper texture)，避免大面积纯白带来的刺眼感。
- **组件材质与阴影**:
  - 卡片与浮动组件采用**半透明的磨砂玻璃/琉璃质感 (Frosted glass/Glaze effect)**，背景色为略带暖意的浅灰色 (`#faf8f5`)。
  - 放弃生硬的深色边框，采用类似水墨勾勒的**柔和晕染阴影 (soft ink-like drop shadows)**。
- **专属点缀色 (Accent Colors)**:
  在素雅的水墨基调上，使用以下三种传统中国色作为点缀（用于按钮、标签、卡片微光或关键文字）：
  - **黛蓝 (Ink Blue)**: `#4a7ab0` - 象征远山与记忆结晶。
  - **朱砂 (Cinnabar Red)**: `#c75040` - 象征历史的印记与印章，用于高亮与重要提示。
  - **赭石 (Ocher Gold)**: `#c4956a` - 象征废墟的岁月痕迹与鎏金纹理。
- **排版与字体**:
  - 标题文字使用优雅的宋体/楷体字效，字色采用浓墨色 (Deep ink black, `#2c2c2c`)。
  - 留白 (Negative space)：大量使用传统水墨画的“计白当黑”手法，界面布局通透、呼吸感强。

## 2. 主页结构架构 (Home Page Layout)

从上到下的视觉层级与元素分布如下：

### 2.1 顶部 Hero Banner (时间的回响)

- **画面内容**: 一幅气韵生动的水墨山水与中国古建筑相融合的插画。建筑可以是隐没在云雾中的亭台楼阁或残垣断壁，笔触要有中国画的写意感 (Freehand brushwork)。
- **文字排版**: 主标题“时间的回响” (Echoes of Time) 采用竖排或优雅的古风排版，旁边配有一方红色的朱砂印章作为点缀。
- **过渡处理**: Banner 底部不要生硬切断，而是像墨迹溶入水中一样，自然地羽化渐变 (fade out) 过渡到下方的米白色背景中。

### 2.2 中部 核心玩法区 (三种藏品 Type Selector)

- **模块标题**: “三种方式，与历史对话”。
- **卡片设计**: 三张并排的琉璃质感卡片。
  - 卡片 1（废墟重建）：水墨晕染中透出一点赭石金。
  - 卡片 2（遗址遗言）：水墨基底，配以朱砂红的标签或微光。
  - 卡片 3（记忆结晶）：清透水墨，带有黛蓝色的光泽。
- **交互提示**: 卡片边缘有如毛笔勾勒般若有若无的线条，呈现出轻盈的高级感。

### 2.3 下部 近期藏品区 (Recent Collectibles)

- **列表形式**: 一个横向滑动的画卷式列表 (Horizontal scroll list like unrolling a scroll)。
- **展示内容**: 生成的数字文物缩略图（如青铜器、青花瓷、古卷轴等）。这些文物本身也带有淡雅的水墨渲染背景，仿佛是从古籍中走出来的珍品。
- **卡片细节**: 缩略图下方配有娟秀的宋体文字描述，背景卡片极简，几乎与主背景融为一体，仅靠淡淡的墨影区分层级。

### 2.4 底部导航栏 (Bottom Tab Bar)

- **视觉效果**: 悬浮在屏幕底部的半透明琉璃/玉石材质面板 (Translucent jade-like floating bar)。
- **图标设计**: 包含“首页”、“创作”、“我的收藏”三个图标。图标设计为极简的线面结合风格，当前选中的“首页”图标呈现浓墨色，并伴有一个小小的朱砂红圆点作为选中状态。

## 3. 渲染指令 (Prompt Requirements)

- Mobile app UI design for a Chinese cultural tourism app, iOS screen.
- Traditional Chinese Ink Painting style, watercolor wash, rice paper texture.
- Light theme, elegant, clean, abundant negative space (计白当黑).
- Translucent glassmorphism cards with soft ink-like shadows.
- Accent colors: Cinnabar red, Ink blue, Ocher gold.
- UI/UX, Dribbble trending, 8k resolution, highly detailed, masterpiece, elegant oriental typography.
