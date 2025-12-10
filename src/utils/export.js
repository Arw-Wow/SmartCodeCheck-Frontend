// src/utils/export.js

/**
 * 导出文本文件 (JSON, Markdown, TXT)
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 * @param {string} type - MIME type (e.g., 'application/json')
 */
export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 将检测结果转换为 Markdown 格式
 */
export function generateDetectionMarkdown(result, language) {
  let md = `# 代码质量检测报告\n\n`
  md += `**检测时间**: ${new Date().toLocaleString()}\n`
  md += `**语言**: ${language}\n`
  md += `**综合评分**: ${result.score}\n\n`
  
  md += `## 详细问题列表\n`
  result.issues.forEach((issue, index) => {
    md += `### ${index + 1}. [${issue.type}] ${issue.dimension}\n`
    md += `- **描述**: ${issue.description}\n`
    if (issue.line) md += `- **位置**: Line ${issue.line}\n`
    md += `- **建议**: ${issue.suggestion}\n\n`
  })
  
  return md
}

/**
 * 将对比结果转换为 Markdown 格式
 */
export function generateComparisonMarkdown(result, language) {
  let md = `# 代码质量对比报告\n\n`
  md += `**检测时间**: ${new Date().toLocaleString()}\n`
  md += `**语言**: ${language}\n\n`
  
  md += `## 🏆 总结\n${result.summary}\n\n`
  
  md += `## 评分对比\n`
  md += `| 维度 | 代码 A | 代码 B |\n|---|---|---|\n`
  md += `| **综合** | **${result.score_a}** | **${result.score_b}** |\n`
  
  for (const [dim, scores] of Object.entries(result.dimension_scores)) {
    md += `| ${dim} | ${scores[0]} | ${scores[1]} |\n`
  }
  
  return md
}