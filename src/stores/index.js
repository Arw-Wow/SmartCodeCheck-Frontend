import { defineStore } from "pinia";
import { ref } from "vue";
import api from '@/api';

export const useGlobalDataStore = defineStore(
  "initial-data",
  () => {
    const customDefinitions = ref({});
    
    const detection = ref({
      language: "Python",
      code: 'def example():\n    print("Hello World")',
      modelName: "deepseek-v3.1",
      selectedDimensions: ["correctness", "security"],
      generationInstruction: "",
      results: null,
    });

    const comparison = ref({
      language: "Python",
      codeA: "",
      codeB: "",
      modelName: "deepseek-v3.1",
      selectedDimensions: ["correctness", "efficiency"],
      generationInstruction: "",
      results: null,
    });

    // --- Actions ---

    // 1. 从后端同步数据 (初始化时调用)
    const fetchDefinitions = async () => {
      try {
        const res = await api.getDimensions();
        // 将后端返回的数组 [{name, description}, ...] 转换为对象 {name: description, ...}
        const map = {};
        res.data.forEach(item => {
          map[item.name] = item.description;
        });
        customDefinitions.value = map;
      } catch (error) {
        console.error("Failed to fetch dimensions", error);
        // 如果未登录或失败，这里保持为空或不做处理
      }
    };

    // 2. 添加维度 (API -> Local)
    const addCustomDefinition = async (newDefinitionObj) => {
      // newDefinitionObj 结构: { "维度名": "描述" }
      const name = Object.keys(newDefinitionObj)[0];
      const description = newDefinitionObj[name];

      // 调接口
      await api.createDimension({ name, description });
      
      // 接口成功后更新本地
      Object.assign(customDefinitions.value, newDefinitionObj);
    };

    // 3. 删除维度 (API -> Local)
    const deleteCustomDefinition = async (keyName) => {
      // 调接口
      await api.deleteDimension(keyName);
      
      // 接口成功后更新本地
      delete customDefinitions.value[keyName];
    };

    return {
      customDefinitions,
      detection,
      comparison,
      fetchDefinitions,
      addCustomDefinition,
      deleteCustomDefinition
    };
  },
  {
    persist: {
      key: "initial-data-store",
      storage: localStorage,
      // 不再持久化 customDefinitions，因为它现在归数据库管
      // 我们可以只持久化 detection 和 comparison 的临时状态，防止刷新丢失
      paths: ["detection", "comparison"], 
    },
  }
);