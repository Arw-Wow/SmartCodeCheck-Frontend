<template>
  <div class="container home-view">
    <div class="hero">
      <h1 class="title">LLM 代码质量<span class="highlight">多维检测</span>平台</h1>
      <p class="subtitle">专为研究者设计，深度评估正确性、安全性与运行效率</p>
      <div class="cta-buttons">
        <router-link to="/detection" class="btn btn-primary btn-lg">立即检测</router-link>
        <router-link to="/comparison" class="btn btn-secondary btn-lg">代码对比</router-link>
      </div>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <h3>🔍 深度审计</h3>
        <p>基于微调模型，自动识别代码质量问题。</p>
      </div>
      <div class="feature-card">
        <h3>⚖️ A/B 对比</h3>
        <p>直观呈现两段不同代码的差异。</p>
      </div>
      <div class="feature-card">
        <h3>📊 详细报告</h3>
        <p>生成详细检测报告，支持导出 JSON 文件。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view { text-align: center; padding-top: 60px; }
.title { font-size: 3rem; margin-bottom: 20px; }
.highlight { color: var(--primary-color); }
.subtitle { color: var(--text-secondary); font-size: 1.2rem; margin-bottom: 40px; }
.cta-buttons { display: flex; gap: 20px; justify-content: center; margin-bottom: 80px; }
.btn-lg { padding: 15px 40px; font-size: 1.1rem; }
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.feature-card { background: var(--panel-color); padding: 30px; border-radius: 12px; border: 1px solid var(--border-color); }
</style>