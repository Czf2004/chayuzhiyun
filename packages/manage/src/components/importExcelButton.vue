<template>
  <div class="import-container">
    <el-button
      type="success"
      @click="showImportDialog = true"
      class="import-btn"
    >
      <el-icon><Upload /></el-icon>
      批量导入
    </el-button>

    <!-- 导入对话框 -->
    <el-dialog
      title="批量导入茶园信息"
      v-model="showImportDialog"
      width="700px"
      @close="resetImportState"
    >
      <el-upload
        ref="upload"
        class="upload-excel"
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :show-file-list="true"
        :multiple="true"
        accept=".xlsx, .xls"
      >
        <el-button type="primary">选择Excel文件</el-button>
        <template #tip>
          <div class="el-upload__tip text-muted">
            支持.xlsx、.xls格式文件，可选择多个文件，<a href="#" @click.prevent="downloadTemplate">下载模板</a>
          </div>
        </template>
      </el-upload>

      <!-- 已选文件列表 -->
      <div v-if="selectedFiles.length > 0" class="file-list">
        <h4>已选择 {{ selectedFiles.length }} 个文件（共 {{ totalImportCount }} 条数据）</h4>
        <el-tag
          v-for="file in selectedFiles"
          :key="file.uid"
          closable
          :disable-transitions="false"
          @close="handleFileRemove({uid: file.uid})"
        >
          {{ file.name }} ({{ file.data.length }}条)
        </el-tag>
      </div>

      <!-- 重复项提示 -->
      <div v-if="showDuplicateTable" class="duplicate-section">
        <h4>
          重复数据检测
          <span class="small-text">( {{ duplicateGardens.length }} 条重复数据)</span>
        </h4>
        <el-table
         ref="gardenTableRef"
          :data="duplicateGardens"
          border
          size="small"
          style="width: 100%; margin-top: 10px"
          @selection-change="handleDuplicateSelection"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="茶园名称" width="150" />
          <el-table-column prop="address" label="详细地址" width="200" />
          <el-table-column prop="duplicateReason" label="重复原因" />
        </el-table>

        <div class="duplicate-actions" v-if="duplicateGardens.length > 0">
          <el-button
            type="text"
            @click="toggleSelectAll"
            size="small"
          >
            {{ allSelected ? '取消全选' : '一键全选' }}
          </el-button>
          <span class="selected-count">已选择 {{ selectedDuplicates.length }} 条</span>
        </div>
      </div>

      <template #footer>
        <el-button @click="resetImportState">取消</el-button>
        <el-button
          type="primary"
          @click="handleImport"
          :loading="importLoading"
          :disabled="selectedFiles.length === 0 || getImportableCount === 0"
        >
          确认导入（导入 {{ getImportableCount }} 条）
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { useGardenStore } from '../stores/gardenStore';
import { Upload } from '@element-plus/icons-vue';
import * as XLSX from 'xlsx';


const gardenStore = useGardenStore();
const showImportDialog = ref(false);
const selectedFiles = ref([]);
const importLoading = ref(false);
const duplicateGardens = ref([]);
const showDuplicateTable = ref(false);
const selectedDuplicates = ref([]);
const upload = ref(null);

// 导入数据总条数
const totalImportCount = computed(() => {
  return selectedFiles.value.reduce((total, file) => total + file.data.length, 0);
});
const gardenTableRef = ref(null);

// 文件是否重复
const isFileDuplicate = (file) => {
  return selectedFiles.value.some(
    f => f.name === file.name && f.size === file.size
  );
};

// 处理文件选择
const handleFileChange = (file) => {
  // 检测文件是否重复
  if (isFileDuplicate(file)) {
    ElMessage.warning(`文件 "${file.name}" 已存在（名称和大小相同），请不要重复上传`);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // 格式化数据
      const formattedData = jsonData.map(item => ({
        name: (item['茶园名称'] || '').trim(),
        address: (item['详细地址'] || '').trim(),
        latitude: Number(item['纬度(°N)']) || null,
        longitude: Number(item['经度(°E)']) || null,
        area: Number(item['面积(亩)']) || null,
        variety: item['茶叶品种'] || '',
        plantingYear: Number(item['种植年份']) || null,
        owner: item['所属单位'] || '',
        status: item['生产状态'] || '正常生产'
      }));

      // 添加/更新文件
      const existingIndex = selectedFiles.value.findIndex(f => f.uid === file.uid);
      if (existingIndex > -1) {
        selectedFiles.value[existingIndex] = { ...file, data: formattedData };
      } else {
        selectedFiles.value.push({ ...file, data: formattedData });
      }

      // 检测重复数据
      checkDuplicates();
    } catch {
      ElMessage.error(`文件${file.name}解析失败，请检查格式`);
    }
  };
  reader.readAsArrayBuffer(file.raw);
};

// 处理文件移除
const handleFileRemove = (file) => {
  selectedFiles.value = selectedFiles.value.filter(f => f.uid !== file.uid);
  checkDuplicates(); // 重新检测重复
};

// 检测重复数据
const checkDuplicates = () => {
  // 收集所有导入数据
  const allImportData = selectedFiles.value.flatMap(file => file.data);
  const importCount = allImportData.length;

  // 重置重复数据状态
  duplicateGardens.value = [];
  showDuplicateTable.value = false;

  if (importCount === 0) return;

  // 现有茶园数据
  const existingGardens = gardenStore.gardenList;
  const existingNames = new Set(existingGardens.map(item => item.name.trim()));
  const existingAddresses = new Set(existingGardens.map(item => item.address.trim()));

  // 存储导入数据中每条记录的重复状态
  const duplicateMap = new Map();

  // 检测重复逻辑
  allImportData.forEach(item => {
    const key = `${item.name}-${item.address}`;
    if (duplicateMap.has(key)) return; // 避免重复记录

    // 优先检测名称+地址组合重复
    const isExistingCombination = existingGardens.some(
      g => g.name.trim() === item.name.trim() && g.address.trim() === item.address.trim()
    );

    if (isExistingCombination) {
      duplicateMap.set(key, {
        ...item,
        duplicateReason: '与现有茶园信息一致'
      });
      return; // 找到组合重复就不再检测单独字段
    }

    // 检测表格内名称+地址组合重复
    const sameCombinationCount = allImportData.filter(
      i => i.name.trim() === item.name.trim() && i.address.trim() === item.address.trim()
    ).length;

    if (sameCombinationCount > 1) {
      duplicateMap.set(key, {
        ...item,
        duplicateReason: '与表格中其他茶园信息一致'
      });
      return; // 找到组合重复就不再检测单独字段
    }
    const reasons = [];

    // 检测与现有茶园重复
    if (existingNames.has(item.name)) {
      reasons.push('与现有茶园名称一致');
    }
    if (existingAddresses.has(item.address)) {
      reasons.push('与现有茶园地址一致');
    }

    // 检测与导入表格中其他茶园重复
    const sameNameCount = allImportData.filter(i => i.name.trim() === item.name.trim()).length;
    const sameAddressCount = allImportData.filter(i => i.address.trim() === item.address.trim()).length;

    if (sameNameCount > 1) {
      reasons.push('与表格中其他茶园名称一致');
    }
    if (sameAddressCount > 1) {
      reasons.push('与表格中其他茶园地址一致');
    }

    // 有重复原因才记录
    if (reasons.length > 0) {
      reasons.forEach(reason => {
        duplicateMap.set(`${key}-${reason}`, {
          ...item,
          duplicateReason: reason
        });
      });
    }
  });

  // 转换为数组并确保数量不超过导入数据量
  const duplicatesArray = Array.from(duplicateMap.values());
  // 限制重复数据最多与导入数据量相同
  const limitedDuplicates = duplicatesArray.slice(0, importCount);

  // 更新重复数据状态
  duplicateGardens.value = limitedDuplicates;
  showDuplicateTable.value = limitedDuplicates.length > 0;
  selectedDuplicates.value = []; // 重置选择
};

// 处理重复项选择（用户勾选需要导入的重复数据）
const handleDuplicateSelection = (selection) => {
  selectedDuplicates.value = selection;
};

// 全选/取消全选
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedDuplicates.value = [];
  } else {
    selectedDuplicates.value = [...duplicateGardens.value];
  }
  if (gardenTableRef.value) {
      gardenTableRef.value.toggleAllSelection();
    }
};

// 计算属性：是否全选
const allSelected = computed(() => {
  return selectedDuplicates.value.length === duplicateGardens.value.length &&
         duplicateGardens.value.length > 0;
});

// 计算可导入数量（勾选的重复项将被导入）
const getImportableCount = computed(() => {
  // 总导入数据 - 未勾选的重复数据
  const total = totalImportCount.value;
  const unselectedDuplicates = duplicateGardens.value.length - selectedDuplicates.value.length;
  return total - unselectedDuplicates;
});

// 处理导入
const handleImport = () => {
  importLoading.value = true;
  const loading = ElLoading.service({
    lock: true,
    text: '正在导入数据...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  // 收集所有导入数据
  const allImportData = selectedFiles.value.flatMap(file => file.data);

  // 计算需要排除的重复数据（未勾选的重复项）
  const selectedKeys = new Set(
    selectedDuplicates.value.map(item => `${item.name}-${item.address}-${item.duplicateReason}`)
  );

  const excludeKeys = new Set(
    duplicateGardens.value
      .filter(item => !selectedKeys.has(`${item.name}-${item.address}-${item.duplicateReason}`))
      .map(item => `${item.name}-${item.address}`)
  );

  // 过滤数据：保留非重复数据和勾选的重复数据
  const finalData = allImportData.filter(item => {
    const isDuplicate = duplicateGardens.value.some(
      d => d.name === item.name && d.address === item.address
    );

    // 如果是重复数据且未被勾选，则排除
    if (isDuplicate && excludeKeys.has(`${item.name}-${item.address}`)) {
      return false;
    }
    return true;
  });

  setTimeout(() => {
    try {
      // 生成新ID
      const maxId = Math.max(...gardenStore.gardenList.map(g => Number(g.id)), 0);
      const newGardens = finalData.map((item, index) => ({
        id: String(maxId + 1 + index),
        ...item
      }));

      // 保存到Pinia
      gardenStore.gardenList.push(...newGardens);

      loading.close();
      importLoading.value = false;
      ElMessage.success(`成功导入${newGardens.length}条茶园信息`);
      resetImportState(); // 重置状态并关闭弹窗
    } catch (error) {
      loading.close();
      importLoading.value = false;
      ElMessage.error('导入失败：' + error.message);
    }
  }, 1500);
};

// 下载模板
const downloadTemplate = () => {
  const templateData = [
    {
      '茶园名称': '示例茶园',
      '详细地址': '福建省武夷山市星村镇',
      '纬度(°N)': 27.76,
      '经度(°E)': 117.9,
      '面积(亩)': 80.5,
      '茶叶品种': '大红袍',
      '种植年份': 2010,
      '所属单位': '武夷山岩茶合作社',
      '生产状态': '正常生产'
    }
  ];
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '茶园信息模板');
  XLSX.writeFile(workbook, '茶园信息导入模板.xlsx');
};

// 重置导入状态（关闭弹窗时调用）
const resetImportState = () => {
  showImportDialog.value = false;
  selectedFiles.value = [];
  duplicateGardens.value = [];
  showDuplicateTable.value = false;
  selectedDuplicates.value = [];
  if (upload.value) upload.value.clearFiles();
};
</script>

<style scoped>

.file-list {
  margin: 15px 0;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-list .el-tag {
  margin: 0 5px 5px 0;
}

.duplicate-section {
  margin: 15px 0;
  padding: 10px;
  background-color: #fef0f0;
  border-radius: 4px;
}

.duplicate-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-count {
  color: #f56c6c;
  font-size: 12px;
}

h4 {
  margin: 0 0 10px 0;
  color: #2a2121;
  font-size: 14px;
}

.small-text {
  font-size: 12px;
  color: #606266;
  font-weight: normal;
}
</style>
