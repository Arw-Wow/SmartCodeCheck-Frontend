import { defineStore } from "pinia";
import { ref } from "vue";
import api from '@/api';

export const useGlobalDataStore = defineStore("initial-data", () => {
    // --- 定义初始状态常量 (用于 Reset) ---
    const initialDetection = {
      language: "Python",
      code: 'def example():\n    print("Hello World")',
      modelName: "deepseek-v3.1",
      selectedDimensions: ["correctness", "security"],
      generationInstruction: "",
      results: null,
    };

    const initialComparison = {
      language: "Python",
      codeA: "",
      codeB: "",
      modelName: "deepseek-v3.1",
      selectedDimensions: ["correctness", "efficiency"],
      generationInstruction: "",
      results: null,
    };

    // --- State ---
    const customDefinitions = ref({});
    const historyList = ref([]);
    
    // 使用深拷贝初始化，避免引用污染
    const detection = ref(JSON.parse(JSON.stringify(initialDetection)));
    const comparison = ref(JSON.parse(JSON.stringify(initialComparison)));

    // --- Actions ---

    // 1. 从后端同步数据 (初始化时调用)
    const fetchDefinitions = async () => {
      try {
        const res = await api.getDimensions();
        const map = {};
        res.data.forEach(item => {
          map[item.name] = item.description;
        });
        customDefinitions.value = map;
      } catch (error) {
        console.error("Failed to fetch dimensions", error);
      }
    };

    // 2. 添加维度
    const addCustomDefinition = async (newDefinitionObj) => {
      const name = Object.keys(newDefinitionObj)[0];
      const description = newDefinitionObj[name];
      await api.createDimension({ name, description });
      Object.assign(customDefinitions.value, newDefinitionObj);
    };

    // 3. 删除维度
    const deleteCustomDefinition = async (keyName) => {
      await api.deleteDimension(keyName);
      delete customDefinitions.value[keyName];
    };

    // 4. 获取历史记录
    const fetchHistory = async (type) => {
      try {
        const res = await api.getHistory(type);
        historyList.value = res.data;
      } catch (error) {
        console.error("Fetch history failed", error);
      }
    };

    // 5. 保存当前状态到历史
    const saveToHistory = async (type) => {
      try {
        const stateData = type === 'detection' ? detection.value : comparison.value;
        const payload = {
          type,
          data: JSON.parse(JSON.stringify(stateData))
        };
        await api.createHistory(payload);
        await fetchHistory(type);
      } catch (error) {
        console.error("Save history failed", error);
      }
    };

    // 6. 恢复历史记录
    const restoreHistory = (record) => {
      // 深度拷贝以断开引用
      const data = JSON.parse(JSON.stringify(record.data));
      if (record.type === 'detection') {
        detection.value = data;
      } else if (record.type === 'comparison') {
        comparison.value = data;
      }
    };

    // 7. 删除历史
    const removeHistory = async (id, type) => {
        await api.deleteHistory(id);
        await fetchHistory(type);
    }

    // 8. 重置所有状态 (登出时调用)
    const resetState = () => {
      detection.value = JSON.parse(JSON.stringify(initialDetection));
      comparison.value = JSON.parse(JSON.stringify(initialComparison));
      historyList.value = [];
      customDefinitions.value = {};
    };

    return {
      customDefinitions,
      detection,
      comparison,
      historyList,
      fetchDefinitions,
      addCustomDefinition,
      deleteCustomDefinition,
      fetchHistory,
      saveToHistory,
      restoreHistory,
      removeHistory,
      resetState
    };
});