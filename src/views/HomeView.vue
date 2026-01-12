<template>
  <div class="home-view">
    <section class="hero-section">
      <div class="hero-content">
        <div class="badge-pill">✨ 新增 DeepSeek-V3 & 本地模型支持</div>
        <h1 class="title">
          智能代码<span class="gradient-text">审计与对比</span>平台
        </h1>
        <p class="subtitle">
          不仅仅是代码检查。基于多款大语言模型，支持<span class="highlight">自定义检测维度</span>，
          一键生成深度分析报告，让代码质量评估更精准、更个性化。
        </p>
        
        <div class="cta-group">
          <router-link to="/detection" class="btn btn-primary btn-lg">
            🚀 开始检测
          </router-link>
          <router-link to="/comparison" class="btn btn-secondary btn-lg">
            ⚖️ 代码对比
          </router-link>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-num">5+</span>
            <span class="stat-desc">支持模型</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">100%</span>
            <span class="stat-desc">维度自定义</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">Local</span>
            <span class="stat-desc">隐私安全</span>
          </div>
        </div>
      </div>
      
      <div class="glow-bg glow-1"></div>
      <div class="glow-bg glow-2"></div>
    </section>
    
    <section class="features-section container">
      <h2 class="section-title">核心能力</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="card-icon">🤖</div>
          <h3>多模型驱动</h3>
          <p>集成 DeepSeek、Qwen、GPT 等前沿大模型，亦支持挂载本地私有模型，灵活切换以平衡性能与成本。</p>
        </div>

        <div class="feature-card">
          <div class="card-icon">🎯</div>
          <h3>自定义维度</h3>
          <p>打破传统工具的限制。您可以自由定义检测标准（如"变量命名规范"、"异常处理风格"），让 AI 懂你的规范。</p>
        </div>

        <div class="feature-card">
          <div class="card-icon">⚔️</div>
          <h3>智能 A/B 对比</h3>
          <p>直观的双栏视图，深度分析两段代码在效率、鲁棒性等方面的细微差异，辅助技术选型与重构。</p>
        </div>

        <div class="feature-card">
          <div class="card-icon">🕒</div>
          <h3>历史回溯</h3>
          <p>自动保存每一次检测与对比记录。随时复盘过往分析结果，或一键恢复现场继续编辑。</p>
        </div>

        <div class="feature-card">
          <div class="card-icon">📊</div>
          <h3>报告导出</h3>
          <p>支持将分析结果一键导出为 JSON 数据或 Markdown 文档，便于团队分享与归档。</p>
        </div>

        <div class="feature-card">
          <div class="card-icon">🛡️</div>
          <h3>安全隔离</h3>
          <p>基于 JWT 的用户认证体系，确保您的检测记录与自定义配置仅对自己可见。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 全局容器 */
.home-view {
  overflow-x: hidden;
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  text-align: center;
  padding: 80px 20px 100px;
  background: radial-gradient(circle at top center, rgba(59, 130, 246, 0.08) 0%, transparent 80%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.badge-pill {
  display: inline-block;
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 24px;
  animation: fadeInDown 0.8s ease;
}

.title {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 24px;
  font-weight: 800;
  letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.highlight {
  color: var(--text-primary);
  font-weight: 600;
  border-bottom: 1px dashed var(--border-color);
}

/* 按钮组 */
.cta-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 60px;
}

.btn-lg {
  padding: 14px 40px;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

/* 数据统计行 */
.stats-row {
  display: inline-flex;
  align-items: center;
  background: rgba(22, 27, 34, 0.6);
  backdrop-filter: blur(12px);
  padding: 15px 40px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--border-color);
}

/* 背景光斑 */
.glow-bg {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  opacity: 0.4;
}
.glow-1 { top: -100px; left: 20%; width: 300px; height: 300px; background: var(--primary-color); }
.glow-2 { top: 100px; right: 20%; width: 250px; height: 250px; background: var(--accent-color); }

/* --- Features Section --- */
.features-section {
  padding: 40px 20px 80px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  background: var(--panel-color);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.feature-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
  pointer-events: none;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  width: 60px; height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin: 0 0 12px 0;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

/* 动画 */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .title { font-size: 2.5rem; }
  .stats-row { flex-direction: column; gap: 20px; padding: 20px; width: 80%; }
  .stat-divider { width: 100%; height: 1px; }
  .cta-group { flex-direction: column; }
}
</style>