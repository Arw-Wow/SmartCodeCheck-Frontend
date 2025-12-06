<template>
  <header class="site-header">
    <div class="container header-inner">
      <div class="logo">
        <span class="logo-icon">⚡</span> SmartCodeCheck
      </div>
      <nav>
        <router-link to="/" active-class="active">首页</router-link>
        <router-link to="/detection" active-class="active">代码检测</router-link>
        <router-link to="/comparison" active-class="active">代码对比</router-link>
      </nav>
      <div class="actions">
        <!-- TODO: 之后改成后端模型的github获取链接，而不是前端代码的链接 -->
        <a href="https://github.com/Arw-Wow/SmartCodeCheck" target="_blank" class="github-link">GitHub 项目链接</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--panel-color);
  border-bottom: 1px solid var(--border-color);
  padding: 15px 0;
}
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.2rem; font-weight: bold; display: flex; align-items: center; gap: 8px; }
nav { display: flex; gap: 20px; }
nav a { color: var(--text-secondary); transition: color 0.2s; }
nav a:hover, nav a.active { color: var(--primary-color); }
</style>