<template>
  <div class="device-management">
    <div class="page-header">
      <h1>设备管理</h1>
      <p>查看与管理茶园中的各类设备</p>
    </div>

    <div class="action-bar">
      <div class="filters">
        <el-select v-model="filters.device_type" placeholder="设备类型" clearable style="width: 200px">
          <el-option label="无人机" value="drone" />
          <el-option label="土壤传感器" value="soil_sensor" />
          <el-option label="气象站" value="weather_station" />
          <el-option label="灌溉控制器" value="irrigation_controller" />
        </el-select>
        <el-select v-model="filters.status" placeholder="状态" clearable style="width: 200px">
          <el-option label="活跃" value="active" />
          <el-option label="未激活" value="inactive" />
          <el-option label="维护中" value="maintenance" />
          <el-option label="离线" value="offline" />
        </el-select>
        <el-input v-model="filters.plantation" placeholder="茶园ID(可选)" style="width: 260px" />
        <el-button type="primary" :loading="loading" @click="fetchList(1)">
          查询
        </el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>
      <div class="actions">
        <el-button type="primary" @click="showCreate = true">
          <el-icon><Plus /></el-icon> 新建设备
        </el-button>
      </div>
    </div>

    <el-card>
      <el-table :data="devices" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="device_id" label="设备ID" min-width="220" />
        <el-table-column prop="device_type" label="类型" width="140">
          <template #default="{ row }">
            <el-tag type="info">{{ mapType(row.device_type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="140">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ mapStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="plantation" label="所属茶园" min-width="200" />
        <el-table-column label="操作" min-width="260" fixed="right">
          <template #default="{ row }">
            <el-space wrap size="8">
              <el-button size="small" @click="viewDetail(row)">详情</el-button>
              <el-button size="small" type="primary" @click="startEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pagination.per_page"
          :page-sizes="[10, 20, 50]"
          :current-page="pagination.page"
          :total="pagination.count"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新建设备 -->
    <el-dialog v-model="showCreate" title="新建设备" width="520px" :close-on-click-modal="false">
      <el-form ref="createRef" :model="createForm" label-width="120px">
        <el-form-item label="设备类型" prop="device_type" required>
          <el-select v-model="createForm.device_type" placeholder="请选择类型">
            <el-option label="无人机" value="drone" />
            <el-option label="土壤传感器" value="soil_sensor" />
            <el-option label="气象站" value="weather_station" />
            <el-option label="灌溉控制器" value="irrigation_controller" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属茶园ID" prop="plantation">
          <el-input v-model="createForm.plantation" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="createForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="未激活" value="inactive" />
            <el-option label="维护中" value="maintenance" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>

    <!-- 编辑设备 -->
    <el-dialog v-model="showEdit" title="编辑设备" width="520px" :close-on-click-modal="false">
      <el-form ref="editRef" :model="editForm" label-width="120px">
        <el-form-item label="设备ID">
          <el-input v-model="editForm.device_id" disabled />
        </el-form-item>
        <el-form-item label="设备类型" prop="device_type">
          <el-select v-model="editForm.device_type" placeholder="请选择类型">
            <el-option label="无人机" value="drone" />
            <el-option label="土壤传感器" value="soil_sensor" />
            <el-option label="气象站" value="weather_station" />
            <el-option label="灌溉控制器" value="irrigation_controller" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属茶园ID" prop="plantation">
          <el-input v-model="editForm.plantation" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="未激活" value="inactive" />
            <el-option label="维护中" value="maintenance" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEdit = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { listDevices, createDevice, getDevice, patchDevice, deleteDevice } from '@/api/devices'

const loading = ref(false)
const devices = ref([])
const pagination = reactive({ count: 0, page: 1, per_page: 10 })

const filters = reactive({ device_type: '', status: '', plantation: '' })

const showCreate = ref(false)
const showEdit = ref(false)
const creating = ref(false)
const saving = ref(false)

const createRef = ref()
const editRef = ref()

const createForm = reactive({ device_type: '', status: 'inactive', plantation: '' })
const editForm = reactive({ device_id: '', device_type: '', status: '', plantation: '' })

const mapType = (t) => ({
  drone: '无人机',
  soil_sensor: '土壤传感器',
  weather_station: '气象站',
  irrigation_controller: '灌溉控制器'
}[t] || t)

const mapStatus = (s) => ({
  active: '活跃',
  inactive: '未激活',
  maintenance: '维护中',
  offline: '离线'
}[s] || s)

const statusType = (s) => ({
  active: 'success',
  inactive: 'info',
  maintenance: 'warning',
  offline: 'danger'
}[s] || 'info')

const fetchList = async (page = pagination.page) => {
  try {
    loading.value = true
    const data = await listDevices({
      device_type: filters.device_type || undefined,
      status: filters.status || undefined,
      plantation: filters.plantation || undefined,
      page,
      per_page: pagination.per_page
    })
    // 兼容 { count, results } 结构
    pagination.count = data?.count || 0
    pagination.page = page
    devices.value = Array.isArray(data?.results) ? data.results : []
  } catch (e) {
    console.error('获取设备列表失败:', e)
    ElMessage.error('获取设备列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  pagination.per_page = size
  fetchList(1)
}
const handlePageChange = (page) => fetchList(page)

const resetFilters = () => {
  filters.device_type = ''
  filters.status = ''
  filters.plantation = ''
  fetchList(1)
}

const viewDetail = async (row) => {
  try {
    const data = await getDevice(row.device_id)
    ElMessageBox.alert(
      `<pre style="white-space: pre-wrap; word-break: break-all;">${JSON.stringify(data, null, 2)}</pre>`,
      '设备详情',
      { dangerouslyUseHTMLString: true }
    )
  } catch (e) {
    ElMessage.error('获取设备详情失败')
  }
}

const startEdit = (row) => {
  editForm.device_id = row.device_id
  editForm.device_type = row.device_type
  editForm.status = row.status
  editForm.plantation = row.plantation || ''
  showEdit.value = true
}

const handleCreate = async () => {
  try {
    creating.value = true
    await createDevice({ ...createForm })
    ElMessage.success('创建成功')
    showCreate.value = false
    Object.assign(createForm, { device_type: '', status: 'inactive', plantation: '' })
    fetchList(1)
  } catch (e) {
    ElMessage.error('创建失败')
  } finally {
    creating.value = false
  }
}

const handleSave = async () => {
  try {
    saving.value = true
    await patchDevice(editForm.device_id, {
      device_type: editForm.device_type || undefined,
      status: editForm.status || undefined,
      plantation: editForm.plantation || undefined
    })
    ElMessage.success('保存成功')
    showEdit.value = false
    fetchList(pagination.page)
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const remove = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除设备 ${row.device_id} 吗？`, '删除确认', { type: 'warning' })
    await deleteDevice(row.device_id)
    ElMessage.success('删除成功')
    fetchList(pagination.page)
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(() => fetchList(1))
</script>

<style scoped>
.device-management {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}
.page-header { margin-bottom: 16px; }
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
}
.filters { display: flex; gap: 12px; flex-wrap: wrap; }
.actions { display: flex; gap: 12px; }
.pagination { display: flex; justify-content: flex-end; padding: 12px 0; }
</style>


