<script setup>
import { useGardenStore } from '@/stores/gardenStore';
import { ElLoading,ElMessageBox,ElMessage } from 'element-plus';
import { ref,onMounted } from 'vue';
const gardenStore=useGardenStore()
const gardenForm=ref(null);

onMounted(() => {
  gardenStore.loadData();
});
// 地理验证
const verifyLocation = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在验证地址准确性...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  try {
    const result = await gardenStore.verifyLocation();
    if (!result.success && result.suggestedLat && result.suggestedLng) {
      // 正确处理 ElMessageBox.confirm 的异步返回值
      const action = await ElMessageBox.confirm(
        `${result.message}，是否使用地址解析的经纬度？(经度:${result.suggestedLat},纬度:${result.suggestedLng})`,
        '地址验证提示',
        {
          confirmButtonText: '使用解析值',
          cancelButtonText: '保留原值',
          type: result.warning ? 'warning' : 'error',
        }
      );
      // 根据用户点击的 action 处理
      if (action === 'confirm') {
        gardenStore.$patch(state => {
          state.formData.latitude = result.suggestedLat;
          state.formData.longitude = result.suggestedLng;
        });
      }
    } else if (result.success) {
      ElMessage.success(result.message);
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    // 这里可以处理 ElMessageBox.confirm 取消等错误情况
    console.error('验证地址或弹窗交互出错：', error);
  } finally {
    loading.close();
  }
};
// 处理删除确认
const handleDeleteConfirm = () => {
  ElMessageBox.confirm(
    '删除后相关生产记录将受影响，是否确认删除？',
    '警告',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      const loading = ElLoading.service({
        lock: true,
        text: '正在删除数据...',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      setTimeout(() => {
        loading.close();
        const result = gardenStore.handleDelete()
        ElMessage.success(result.message)
      }, 1000);
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};
// 提交表单
const handleSubmit=()=>{
  gardenForm.value.validate((valid)=>{
    if(!valid){
      return false;
    }
    const loading = ElLoading.service({
      lock:true,
      text:'正在保存数据...',
      background:'rgba(0,0,0,0.7)'
    });

    setTimeout(()=>{
      loading.close();
      const result = gardenStore.submitForm()
      if(result.success){
        ElMessage.success(result.message)
      }else{
        ElMessage.error('请检查无误后重新保存')
      }
      gardenStore.closeDialog()
    },1000)
  })
}
// 分页
const currentPage = ref(1);
const handleCurrentChange = (val) => {
  currentPage.value = val;
};
</script>

<template>
  <div class="gardenform">
    <el-card title="茶园信息管理">
    <el-table
    :data="gardenStore.gardenList.slice((currentPage - 1) * 10, currentPage * 10)"
    border
    :loading="gardenStore.tableLoading"
    stripe
    style="width: 1300px;"
    >
    <el-table-column label="编号" width="70">
      <template #default="scope">
        {{ (currentPage - 1) * 10 + scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="茶园名称" width="120" />
    <el-table-column prop="address" label="详细地址" width="250" />
    <el-table-column prop="status" label="生产状态" width="120">
      <template #default="scope">
        <el-tag
        :type="scope.row.status==='正常生产'?'success':scope.row.status==='休耕'?'info':'warning'">
        {{scope.row.status}}
        </el-tag>
      </template>
    </el-table-column>
     <el-table-column prop="latitude" label="纬度(°N)"/>
    <el-table-column prop="longitude" label="经度(°E)"/>
    <el-table-column prop="area" label="面积(亩)"/>
    <el-table-column prop="variety" label="茶叶品种" />
    <el-table-column prop="plantingYear" label="种植年份"/>
    <el-table-column prop="owner" label="所属单位" width="180" />
    <el-table-column label="操作" width="100">
      <template #default="scope">
        <el-button size="small" type="primary" @click="gardenStore.openEditForm(scope.row)">
          编辑
        </el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- 编辑信息弹窗 -->
     <el-dialog
     :title="gardenStore.dialogTitle"
     v-model="gardenStore.dialogvisible"
     width="600px"
     :before-close="gardenStore.closeDialog"
     >
     <el-form
     ref="gardenForm"
     :model="gardenStore.formData"
     :rules="gardenStore.formRules"
     label-width="120px"
     >
     <el-form-item label="茶园名称" prop="name">
        <el-input
        v-model="gardenStore.formData.name"
        placeholder="请输入茶园名称"
        maxlength="30"
        />
     </el-form-item>
     <el-form-item label="茶园地址" prop="address">
      <el-input
      v-model="gardenStore.formData.address"
      placeholder="请输入详细地址"
      maxlength="60"
      />
     </el-form-item>
     <el-form-item label="生产状态" prop="status">
        <el-select v-model="gardenStore.formData.status" placeholder="请选择生产状态">
          <el-option
          v-for="item in gardenStore.statusOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          ></el-option>
        </el-select>
     </el-form-item>
     <el-form-item label="经纬度" prop="coordinates">
        <div class="coordinates-input">
          <el-input-number
            v-model="gardenStore.formData.latitude"
            :min="-90"
            :max="90"
            :step="0.000001"
            placeholder="纬度"
            style="width: 48%"
            controls-position="right"
          />
          <el-input-number
            v-model="gardenStore.formData.longitude"
            :min="-180"
            :max="180"
            :step="0.000001"
            placeholder="经度"
            style="width: 48%"
            controls-position="right"
          />
        </div>
        <el-button
          type="primary"
          size="small"
          @click="verifyLocation"
        >
          <el-icon><Location /></el-icon>
          验证地址准确性
        </el-button>
      </el-form-item>

      <el-form-item label="面积(亩)" prop="area">
        <el-input-number
          v-model="gardenStore.formData.area"
          :min="0.1"
          :max="10000"
          :step="0.1"
          placeholder="请输入茶园面积"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="茶叶品种" prop="variety">
        <el-select
          v-model="gardenStore.formData.variety"
          placeholder="请选择或输入茶叶品种"
          filterable
          allow-create
        >
          <el-option
            v-for="item in gardenStore.teaVarieties"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="种植年份" prop="plantingYear">
        <el-input-number
          v-model="gardenStore.formData.plantingYear"
          :min="1950"
          :max="new Date().getFullYear()"
          placeholder="请输入种植年份"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="所属单位" prop="owner">
        <el-input
          v-model="gardenStore.formData.owner"
          placeholder="请输入所属公司或农户"
          maxlength="100"
        />
      </el-form-item>
     </el-form>
     <template #footer>
     <el-button @click="gardenStore.closeDialog">取消</el-button>
     <!-- 删除按钮 -->
     <template v-if="gardenStore.isEditMode">
      <el-button
      type="danger"
      @click="handleDeleteConfirm"
      >
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
     </template>
     <!-- 重置按钮 -->
     <template v-else>
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
  :page-size="10"
  :current-page="currentPage"
  :total="gardenStore.gardenList.length"
  @current-change="handleCurrentChange"
  :locale="paginationLocale"    />
  </div>
</template>

<style scoped>
.gardenform{
position: relative;
left: -60px;
}
</style>
