import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalDataStore = defineStore(
  "initial-data",
  () => {
    const customDefinitions = ref({});
    // 检测页状态
    const detection = ref({
      language: "Python",
      code: 'def example():\n    print("Hello World")',
      modelName: "deepseek-v3.1",
      selectedDimensions: ["correctness", "security"],
      generationInstruction: "",
      results: null,
    });

    // 对比页状态
    const comparison = ref({
      language: "Python",
      codeA: "",
      codeB: "",
      modelName: "deepseek-v3.1",
      selectedDimensions: ["correctness", "efficiency"],
      generationInstruction: "",
      results: null,
    });

    // 方法
    // 1. 添加用户自定义维度
    const addCustomDefinition = (newDefinition) => {
      Object.assign(customDefinitions.value, newDefinition)
    }

    // 2. 删除用户自定义维度
    const deleteCustomDefinition = (keyName) => {
      delete customDefinitions.value[keyName]
    }

    return {
      customDefinitions,
      detection,
      comparison,
      addCustomDefinition,
      deleteCustomDefinition
    };
  },
  {
    persist: {
      key: "initial-data-store",
      storage: localStorage,
      paths: ["customDefinitions"],
    },
  }
);
