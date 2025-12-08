# SmartCodeCheck-Frontend

### 项目结构

```
SmartCodeCheck-Frontend/
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/          // 静态资源（CSS, images, fonts）
│   ├── components/      // 可复用的UI组件
│   │   ├── common/
│   │   │   ├── AppHeader.vue      // 顶栏导航组件
│   │   │   └── AppFooter.vue      // 底部信息组件
│   │   ├── analysis/
│   │   │   ├── DimensionSelector.vue  // 维度选择多选框
│   │   │   ├── CodeEditor.vue       // 代码输入/粘贴编辑器（Monaco集成）
│   │   │   └── AnalysisResults.vue  // 结果展示面板（按维度分类）
│   │   └── comparison/
│   │       ├── ComparisonChart.vue    // 对比雷达图组件
│   │       └── ComparisonDetails.vue  // 详细对比表格/摘要
│   ├── router/          // 路由配置
│   │   └── index.js
│   ├── views/           // 页面级组件
│   │   ├── HomeView.vue         // 主页
│   │   ├── DetectionView.vue    // 质量问题检测页（核心）
│   │   └── ComparisonView.vue   // 代码对比页（核心）
│   ├── App.vue          // 根组件
│   └── main.js          // 应用入口文件
├── index.html       // HTML入口文件
└── package.json
```

### 运行后端

1.  **安装依赖**:

    ```bash
    ```

2.  **启动服务**:

    ```bash
    npm run dev
    ```