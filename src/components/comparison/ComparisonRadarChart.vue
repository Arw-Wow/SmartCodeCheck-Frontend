<template>
  <div ref="chartRef" class="radar-chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 数据格式: { "正确性": [80, 90], "安全性": [70, 85], ... }
  dimensionScores: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let myChart = null

// 定义配色 (与 ComparisonView.vue 中的 CSS 变量保持一致)
const COLOR_A = '#3B82F6' // Primary Blue
const COLOR_B = '#8B5CF6' // Accent Purple

const initChart = () => {
  if (!chartRef.value) return
  
  myChart = echarts.init(chartRef.value)
  updateChartOption()
  
  window.addEventListener('resize', handleResize)
}

const updateChartOption = () => {
  if (!myChart) return

  const dimensions = Object.keys(props.dimensionScores)
  const dataA = dimensions.map(dim => props.dimensionScores[dim][0])
  const dataB = dimensions.map(dim => props.dimensionScores[dim][1])

  // 构建 Radar 指标配置
  // 假设满分是 100，这里 max 设为 100
  const indicators = dimensions.map(dim => ({
    name: dim,
    max: 100
  }))

  const option = {
    // 提示框
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(22, 27, 34, 0.9)',
      borderColor: '#30363D',
      textStyle: { color: '#E6EDF3' }
    },
    // 图例
    legend: {
      data: ['Code A', 'Code B'],
      bottom: 0,
      textStyle: { color: '#8B949E' },
      itemGap: 20
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#8B949E',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: [
            'rgba(255, 255, 255, 0.05)', 
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.05)', 
            'rgba(255, 255, 255, 0.1)' 
          ].reverse()
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    series: [
      {
        name: 'Code A vs Code B',
        type: 'radar',
        data: [
          {
            value: dataA,
            name: 'Code A',
            itemStyle: { color: COLOR_A },
            lineStyle: { width: 2 },
            areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(59, 130, 246, 0.4)'}, {offset: 1, color: 'rgba(59, 130, 246, 0.05)'}]) }
          },
          {
            value: dataB,
            name: 'Code B',
            itemStyle: { color: COLOR_B },
            lineStyle: { width: 2 },
            areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(139, 92, 246, 0.4)'}, {offset: 1, color: 'rgba(139, 92, 246, 0.05)'}]) }
          }
        ]
      }
    ]
  }

  myChart.setOption(option)
}

const handleResize = () => {
  myChart && myChart.resize()
}

// 监听数据变化，动态更新
watch(() => props.dimensionScores, () => {
  updateChartOption()
}, { deep: true })

onMounted(() => {
  // 稍微延迟确保 DOM 渲染完成
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (myChart) myChart.dispose()
})
</script>

<style scoped>
.radar-chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>