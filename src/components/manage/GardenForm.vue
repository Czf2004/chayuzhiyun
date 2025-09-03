<script setup>
import { useGardenStore } from '@/stores/gardenStore';
import { ElLoading, ElMessageBox, ElMessage } from 'element-plus';
import { Plus, Refresh, Check } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';

const gardenStore = useGardenStore()
const gardenForm = ref(null);

onMounted(async () => {
  try {
    await gardenStore.loadData();
  } catch (error) {
    console.error('加载数据失败:', error);
    // 不显示错误消息，因为loadData已经处理了错误情况
  }
});

// 获取部署状态文本
const getDeploymentStatusText = (status) => {
  const statusMap = {
    0: '未部署',
    1: '部署中',
    2: '已部署'
  };
  return statusMap[status] || '未设置';
};

// 处理删除确认
const handleDeleteConfirm = (row) => {
  ElMessageBox.confirm(
    '删除后相关生产记录将受影响，是否确认删除？',
    '警告',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const loading = ElLoading.service({
        lock: true,
        text: '正在删除数据...',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        const result = await gardenStore.handleDelete(row.plantation_id);
        if (result.success) {
          ElMessage.success(result.message);
        } else {
          ElMessage.error(result.message);
        }
      } catch (error) {
        console.error('删除失败:', error);
        ElMessage.error('删除失败');
      } finally {
        loading.close();
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

// 提交表单
const handleSubmit = async () => {
  gardenForm.value.validate(async (valid) => {
    if (!valid) {
      return false;
    }
    
    const loading = ElLoading.service({
      lock: true,
      text: '正在保存数据...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    try {
      const result = await gardenStore.submitForm();
      if (result.success) {
        ElMessage.success(result.message);
        gardenStore.closeDialog();
      } else {
        ElMessage.error(result.message || '请检查无误后重新保存');
      }
    } catch (error) {
      console.error('保存失败:', error);
      ElMessage.error('保存失败');
    } finally {
      loading.close();
    }
  });
};

// 分页
const handleCurrentChange = async (val) => {
  try {
    await gardenStore.handlePageChange(val);
  } catch (error) {
    console.error('分页切换失败:', error);
    ElMessage.error('分页切换失败');
  }
};
</script>

<template>
  <div class="gardenform">
    <el-card title="茶园信息管理">
      <!-- 工具栏 -->
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="gardenStore.openAddForm">
          <el-icon><Plus /></el-icon>
          新增茶园
        </el-button>
      </div>
    <el-table
    :data="gardenStore.gardenList"
    border
    :loading="gardenStore.tableLoading"
    stripe
    style="width: 100%; min-width: 1600px;"
    >
    <el-table-column label="编号" width="80">
      <template #default="scope">
        {{ (gardenStore.pagination.current - 1) * gardenStore.pagination.pageSize + scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column prop="plantation_name" label="茶园名称" min-width="150" />
    <el-table-column label="地址信息" min-width="200">
      <template #default="scope">
        <div>{{ scope.row.country || '未设置' }} {{ scope.row.province || '未设置' }} {{ scope.row.city || '未设置' }} {{ scope.row.district || '' }}</div>
        <div style="color: #666; font-size: 12px;">{{ scope.row.detail_address || '详细地址未填写' }}</div>
      </template>
    </el-table-column>
    <el-table-column label="地理坐标" min-width="150">
      <template #default="scope">
        <div>纬度: {{ scope.row.latitude === 0 ? '未设置' : scope.row.latitude || '未设置' }}</div>
        <div>经度: {{ scope.row.longitude === 0 ? '未设置' : scope.row.longitude || '未设置' }}</div>
        <div>海拔: {{ scope.row.altitude === 0 ? '未设置' : scope.row.altitude || '未设置' }}m</div>
      </template>
    </el-table-column>
    <el-table-column prop="deployment_status" label="部署状态" width="100">
      <template #default="scope">
        <el-tag
        :type="scope.row.deployment_status === 2 ? 'success' : scope.row.deployment_status === 1 ? 'warning' : scope.row.deployment_status === 0 ? 'info' : 'info'">
        {{ getDeploymentStatusText(scope.row.deployment_status) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="设备信息" min-width="160">
      <template #default="scope">
        <div>无人机: {{ scope.row.drone_count === 0 ? '未设置' : scope.row.drone_count || '未设置' }}台 
          (运行: {{ scope.row.drone_running === 0 ? '未设置' : scope.row.drone_running || '未设置' }}台)</div>
        <div>土壤传感器: {{ scope.row.soil_sensors_count === 0 ? '未设置' : scope.row.soil_sensors_count || '未设置' }}个 
          (运行: {{ scope.row.soil_sensors_running === 0 ? '未设置' : scope.row.soil_sensors_running || '未设置' }}个)</div>
      </template>
    </el-table-column>
    <el-table-column label="病虫害状态" width="100">
      <template #default="scope">
        <el-tag :type="scope.row.insect_pests_status === 0 ? 'success' : scope.row.insect_pests_status === null || scope.row.insect_pests_status === undefined ? 'info' : 'danger'">
          {{ scope.row.insect_pests_status === 0 ? '正常' : scope.row.insect_pests_status === null || scope.row.insect_pests_status === undefined ? '未设置' : '异常' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" min-width="140">
      <template #default="scope">
        {{ scope.row.created_at ? new Date(scope.row.created_at).toLocaleString('zh-CN') : '未设置' }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <div style="display: flex; gap: 8px;">
          <el-button size="small" type="primary" @click="gardenStore.openEditForm(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteConfirm(scope.row)">
            删除
          </el-button>
        </div>
      </template>
    </el-table-column>
    </el-table>
    <!-- 编辑信息弹窗 -->
     <el-dialog
     :title="gardenStore.dialogTitle"
     v-model="gardenStore.dialogvisible"
     width="800px"
     :before-close="gardenStore.closeDialog"
     >
     <el-form
     ref="gardenForm"
     :model="gardenStore.formData"
     :rules="gardenStore.formRules"
     label-width="140px"
     >
     <el-form-item label="茶园名称" prop="plantation_name">
        <el-input
        v-model="gardenStore.formData.plantation_name"
        placeholder="请输入茶园名称"
        maxlength="30"
        />
     </el-form-item>
     <el-form-item label="国家" prop="country">
        <el-input
        v-model="gardenStore.formData.country"
        placeholder="请输入国家"
        />
     </el-form-item>
     <el-form-item label="省份" prop="province">
        <el-input
        v-model="gardenStore.formData.province"
        placeholder="请输入省份"
        />
     </el-form-item>
     <el-form-item label="城市" prop="city">
        <el-input
        v-model="gardenStore.formData.city"
        placeholder="请输入城市"
        />
     </el-form-item>
     <el-form-item label="详细地址" prop="detail_address">
      <el-input
      v-model="gardenStore.formData.detail_address"
      placeholder="请输入详细地址"
      maxlength="100"
      />
     </el-form-item>
     <el-form-item label="区县" prop="district">
      <el-input
      v-model="gardenStore.formData.district"
      placeholder="请输入区县"
      />
     </el-form-item>
           <el-form-item label="纬度" prop="latitude">
        <el-input-number
          v-model="gardenStore.formData.latitude"
          :precision="6"
          :step="0.000001"
          placeholder="请输入纬度"
          controls-position="right"
          :min="-90"
          :max="90"
          :clearable="true"
        />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input-number
          v-model="gardenStore.formData.longitude"
          :precision="6"
          :step="0.000001"
          placeholder="请输入经度"
          controls-position="right"
          :min="-180"
          :max="180"
          :clearable="true"
        />
      </el-form-item>
      <el-form-item label="海拔(米)" prop="altitude">
        <el-input-number
          v-model="gardenStore.formData.altitude"
          :precision="2"
          :step="0.01"
          placeholder="请输入海拔"
          controls-position="right"
          :min="-1000"
          :max="10000"
          :clearable="true"
        />
      </el-form-item>
     <el-form-item label="无人机数量" prop="drone_count">
        <el-input-number
          v-model="gardenStore.formData.drone_count"
          :min="0"
          :max="100"
          :step="1"
          placeholder="请输入无人机数量"
          controls-position="right"
          :clearable="true"
        />
      </el-form-item>
      <el-form-item label="土壤传感器数量" prop="soil_sensors_count">
        <el-input-number
          v-model="gardenStore.formData.soil_sensors_count"
          :min="0"
          :max="100"
          :step="1"
          placeholder="请输入土壤传感器数量"
          controls-position="right"
          :clearable="true"
        />
      </el-form-item>
      <el-form-item label="运行中无人机" prop="drone_running">
        <el-input-number
          v-model="gardenStore.formData.drone_running"
          :min="0"
          :max="100"
          :step="1"
          placeholder="请输入运行中无人机数量"
          controls-position="right"
          :clearable="true"
        />
      </el-form-item>
      <el-form-item label="运行中传感器" prop="soil_sensors_running">
        <el-input-number
          v-model="gardenStore.formData.soil_sensors_running"
          :min="0"
          :max="100"
          :step="1"
          placeholder="请输入运行中传感器数量"
          controls-position="right"
          :clearable="true"
        />
      </el-form-item>
      <el-form-item label="病虫害状态" prop="insect_pests_status">
        <el-select v-model="gardenStore.formData.insect_pests_status" placeholder="请选择病虫害状态">
          <el-option label="正常" :value="0" />
          <el-option label="异常" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="部署状态" prop="deployment_status">
        <el-select v-model="gardenStore.formData.deployment_status" placeholder="请选择部署状态">
          <el-option
          v-for="item in gardenStore.deploymentStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          ></el-option>
        </el-select>
     </el-form-item>
     </el-form>
     <template #footer>
     <el-button @click="gardenStore.closeDialog">取消</el-button>
     <!-- 重置按钮 -->
     <template v-if="!gardenStore.isEditMode">
      <el-button
      type="info"
      @click="gardenStore.resetForm"
      >
      <el-icon><Refresh /></el-icon>
      重置
      </el-button>
     </template>
     <el-button type="primary" @click="handleSubmit">
     <el-icon><Check /></el-icon>
     保存
     </el-button>
     </template>
    </el-dialog>
    </el-card>
    <br>
    <!-- 分页 -->
  <el-pagination
  layout="prev, pager, next, jumper, total"
  :page-size="gardenStore.pagination.pageSize"
  :current-page="gardenStore.pagination.current"
  :total="gardenStore.pagination.total"
  @current-change="handleCurrentChange"
  />
  </div>
</template>

<style scoped>
.gardenform{
position: relative;
left: -60px;
}
</style>
