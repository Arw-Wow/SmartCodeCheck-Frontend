# 🚀 SmartCodeCheck - 智能代码审计与对比平台（Frontend）

![Vue.js](https://img.shields.io/badge/vue.js-3.5-4FC08D?style=flat&logo=vue.js)
![Vite](https://img.shields.io/badge/vite-7.2-646CFF?style=flat&logo=vite)
![ECharts](https://img.shields.io/badge/echarts-6.0-AA2828?style=flat&logo=apache-echarts)

SmartCodeCheck 是一个基于大语言模型的现代化代码质量分析平台，支持**多维度代码审计**与 **A/B 代码深度对比**，帮助研究者从正确性、安全性、可维护性与效率等角度系统性评估代码质量。

本仓库为 **前端实现**，采用 **Vue 3 + Vite** 构建，整体 UI 风格为暗色玻璃拟态，强调专业感与可视化表达。

---

## ✨ 核心功能

- **⚡ 智能代码检测**
  - 支持 Python / Java / C++ / JavaScript / Go 等主流语言  
  - 基于 LLM 的多维度质量分析（安全性、鲁棒性、可读性等）

- **⚔️ A/B 代码对比**
  - 双栏代码编辑器
  - 雷达图 + 柱状图直观呈现差异

- **🛠️ 高度可配置**
  - **模型切换**：DeepSeek、GPT-5、Qwen 等先进模型，**并允许使用本地模型**（Ollama / vLLM）
  - **检测维度定制**：支持用户**自定义分析维度**（如变量命名、异常处理风格）

- **📂 现代化代码编辑体验**
  - 基于 CodeMirror 6
  - 支持语法高亮、文件拖拽上传

- **📊 可视化分析报告**
  - 分数环形图、对比雷达图
  - 支持导出 JSON / Markdown 报告

- **🕒 历史记录管理**
  - 自动保存检测与对比历史
  - 支持一键恢复分析现场

---

## 🛠️ 技术栈

- **核心框架**：Vue 3（Composition API）
- **构建工具**：Vite
- **状态管理**：Pinia + `pinia-plugin-persistedstate`
- **路由**：Vue Router 4
- **UI & 可视化**
  - 编辑器：`vue-codemirror`（CodeMirror 6）
  - 图表：ECharts
  - 样式：原生 CSS3（CSS Variables / Flex / Grid）
- **网络请求**：Axios（内置 JWT 拦截器）

---

## 📂 项目结构

```bash
src/
├── api/                 # Axios 封装与后端接口
├── assets/              # 静态资源
├── components/
│   ├── analysis/        # 检测页组件
│   ├── comparison/     # 对比页组件（雷达图等）
│   └── common/          # 通用组件
├── router/              # 路由与导航守卫
├── stores/              # Pinia 状态仓库
├── utils/               # 工具函数（报告导出等）
├── views/               # 页面视图
├── App.vue
└── main.js
````

---

## 🚀 快速开始

### 1. 环境要求

* Node.js ≥ 18（推荐 20）

### 2. 安装依赖

```bash
npm install
```

### 

### 3. 配置后端地址（默认端口为 8000）

修改 `src/api/index.js`：

```js
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
})
```

### 4. 启动开发环境

```bash
npm run dev
```

访问：`http://localhost:5173`

### 5. 构建生产版本

```bash
npm run build
```

---

## 📸 项目截图

### 网站首页
<img width="3771" height="1770" alt="image" src="https://github.com/user-attachments/assets/a776cdec-afeb-49df-9e1f-0c60aa9f6374" />

### 深度分析结果
<img width="3767" height="1768" alt="image" src="https://github.com/user-attachments/assets/8aa09b1f-ebe8-4840-8cb3-d641f163fb2a" />

### 对比分析结果
<img width="3752" height="1761" alt="image" src="https://github.com/user-attachments/assets/d57a8465-8975-418c-b88d-bafd51cef65a" />

---

## 🗺️ Roadmap（Planned Features）

SmartCodeCheck 后续将进行以下更新：

- **IDE 级交互体验**
  - 行内问题高亮与注释（Inline Decorations）
  - 一键应用修复建议（One-Click Fix）

- **交互与可解释性增强**
  - 检测报告的多轮追问与对话（Follow-up Chat）
  - 流式分析输出（Streaming via SSE）

- **研究与规模化评估支持**
  - 批量代码评估模式（Batch Evaluation）
  - 结果汇总与实验数据导出

- **模型与知识增强**
  - 审计角色 / 场景化提示词预设（Persona Presets）
  - 自定义规范文档驱动的 RAG 检测（Custom Knowledge Base）

👉 详细设计与阶段性计划请见 [`ROADMAP.md`](./ROADMAP.md)

---

## 🤝 贡献与反馈

欢迎提交 Issue 或 Pull Request。

---

Designed with ❤️ for Developers
