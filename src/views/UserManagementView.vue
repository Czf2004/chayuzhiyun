<template>
  <div class="user-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>用户管理</h1>
      <p>管理系统中的所有用户账户</p>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名、昵称或手机号"
          prefix-icon="Search"
          clearable
          @input="handleSearch"
          style="width: 300px"
        />
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          创建用户
        </el-button>
        <el-button @click="refreshUsers">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 用户统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ totalUsers }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ adminUsers }}</div>
          <div class="stat-label">管理员</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ normalUsers }}</div>
          <div class="stat-label">普通用户</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ totalPlantations }}</div>
          <div class="stat-label">总茶园数</div>
        </div>
      </el-card>
    </div>

    <!-- 用户列表 -->
    <el-card class="user-list-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-tag type="info">{{ filteredUsers.length }} 个用户</el-tag>
        </div>
      </template>

      <el-table
        :data="filteredUsers"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="user_id" label="用户ID" width="180" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="40" :src="getAvatar(row)">
                {{ row.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <div class="user-details">
                <div class="user-name">{{ row.nickname }}</div>
                <div class="user-username">@{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="230" />
        <el-table-column prop="role" label="角色" width="200">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
              {{ row.role === 'admin' ? '管理员' : '用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="茶园数量" width="200">
          <template #default="{ row }">
            <el-tag type="info">{{ row.plantations?.length || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bio" label="简介" min-width="350" show-overflow-tooltip />
        <el-table-column prop="contact_info" label="联系方式" width="450" show-overflow-tooltip />
        <el-table-column label="操作" min-width="280" fixed="right">
          <template #default="{ row }">
            <el-space wrap size="8">
              <el-button size="small" @click="viewUserDetail(row)">查看</el-button>
              <el-button size="small" type="primary" @click="editUser(row)">编辑</el-button>
              <el-button 
                size="small" 
                type="warning" 
                @click="resetPassword(row)"
                :disabled="row.user_id === currentUserId"
              >
                重置密码
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDeleteUser(row)"
                :disabled="row.user_id === currentUserId"
              >
                删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建用户对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建新用户"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="createForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="createForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="createForm.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="createForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="createForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="个人简介" prop="bio">
          <el-input 
            v-model="createForm.bio" 
            type="textarea" 
            :rows="3"
            placeholder="请输入个人简介"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="contact_info">
          <el-input v-model="createForm.contact_info" placeholder="请输入邮箱地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreateUser" :loading="creating">
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑用户信息"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="用户ID">
          <el-input v-model="editForm.user_id" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="个人简介" prop="bio">
          <el-input 
            v-model="editForm.bio" 
            type="textarea" 
            :rows="3"
            placeholder="请输入个人简介"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="contact_info">
          <el-input v-model="editForm.contact_info" placeholder="请输入邮箱地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditUser" :loading="editing">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="用户详情"
      width="600px"
    >
      <div v-if="selectedUser" class="user-detail">
        <div class="detail-header">
          <el-avatar :size="80" :src="getAvatar(selectedUser)">
            {{ selectedUser.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <div class="detail-info">
            <h3>{{ selectedUser.nickname }}</h3>
            <p>@{{ selectedUser.username }}</p>
            <el-tag :type="selectedUser.role === 'admin' ? 'danger' : 'success'">
              {{ selectedUser.role === 'admin' ? '管理员' : '用户' }}
            </el-tag>
          </div>
        </div>
        
        <el-divider />
        
        <div class="detail-content">
          <div class="detail-item">
            <span class="label">用户ID：</span>
            <span class="value">{{ selectedUser.user_id }}</span>
          </div>
          <div class="detail-item">
            <span class="label">手机号：</span>
            <span class="value">{{ selectedUser.phone }}</span>
          </div>
          <div class="detail-item">
            <span class="label">邮箱：</span>
            <span class="value">{{ selectedUser.contact_info || '未设置' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">个人简介：</span>
            <span class="value">{{ selectedUser.bio || '未设置' }}</span>
          </div>
        </div>
        
        <el-divider />
        
        <div class="plantations-section">
          <h4>茶园列表 ({{ selectedUser.plantations?.length || 0 }})</h4>
          <div v-if="selectedUser.plantations?.length" class="plantations-list">
            <div 
              v-for="plantation in selectedUser.plantations" 
              :key="plantation.plantation_id"
              class="plantation-item"
            >
              <div class="plantation-name">{{ plantation.plantation_name }}</div>
              <div class="plantation-date">
                创建时间：{{ formatDate(plantation.created_at) }}
              </div>
            </div>
          </div>
          <div v-else class="no-plantations">
            该用户暂无茶园
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { getUsers, createUser, deleteUser as deleteUserApi, updateUser, resetUserPassword } from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { images } from '@/assets/images.js'

// 状态管理
const userStore = useUserStore()
const loading = ref(false)
const creating = ref(false)
const editing = ref(false)
const users = ref([])
const searchQuery = ref('')
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const selectedUser = ref(null)

// 表单引用
const createFormRef = ref()
const editFormRef = ref()

// 当前用户ID
const currentUserId = computed(() => userStore.getUserInfo.userId)

// 创建用户表单
const createForm = ref({
  username: '',
  nickname: '',
  password: '',
  phone: '',
  role: 'user',
  bio: '',
  contact_info: ''
})

// 编辑用户表单
const editForm = ref({
  user_id: '',
  username: '',
  nickname: '',
  phone: '',
  role: '',
  bio: '',
  contact_info: ''
})

// 表单验证规则
const createRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const editRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 计算属性
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    (user.username || '').toLowerCase().includes(query) ||
    (user.nickname || '').toLowerCase().includes(query) ||
    String(user.phone || '').includes(query)
  )
})

const totalUsers = computed(() => users.value.length)
const adminUsers = computed(() => users.value.filter(u => u.role === 'admin').length)
const normalUsers = computed(() => users.value.filter(u => u.role === 'user').length)
const totalPlantations = computed(() => 
  users.value.reduce((sum, user) => sum + (user.plantations?.length || 0), 0)
)

// 方法
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await getUsers()
    // 兼容 axios 原始响应已在拦截器中转为 data
    const list = response?.results || response?.users || []
    users.value = Array.isArray(list) ? list : []
    ElMessage.success('用户列表获取成功')
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const refreshUsers = () => {
  fetchUsers()
}

const handleSearch = () => {
  // 搜索功能已通过计算属性实现
}

const handleCreateUser = async () => {
  if (!createFormRef.value) return
  
  try {
    await createFormRef.value.validate()
    creating.value = true
    
    await createUser(createForm.value)
    ElMessage.success('用户创建成功')
    showCreateDialog.value = false
    resetCreateForm()
    fetchUsers()
  } catch (error) {
    console.error('创建用户失败:', error)
    ElMessage.error('创建用户失败')
  } finally {
    creating.value = false
  }
}

const editUser = (user) => {
  editForm.value = {
    user_id: user.user_id,
    username: user.username,
    nickname: user.nickname,
    phone: user.phone,
    role: user.role,
    bio: user.bio || '',
    contact_info: user.contact_info || ''
  }
  showEditDialog.value = true
}

const handleEditUser = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    editing.value = true
    
    const { user_id, ...updateData } = editForm.value
    await updateUser(user_id, updateData)
    ElMessage.success('用户信息更新成功')
    showEditDialog.value = false
    fetchUsers()
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新用户信息失败')
  } finally {
    editing.value = false
  }
}

const handleDeleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.nickname}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await deleteUserApi(user.user_id)
    ElMessage.success('用户删除成功')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }
}

const resetPassword = async (user) => {
  try {
    const { value: newPassword } = await ElMessageBox.prompt(
      `请输入用户 "${user.nickname}" 的新密码`,
      '重置密码',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPattern: /^.{6,20}$/,
        inputErrorMessage: '密码长度必须在6-20个字符之间'
      }
    )
    
    await resetUserPassword(user.user_id, newPassword)
    ElMessage.success('密码重置成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重置密码失败:', error)
      ElMessage.error('重置密码失败')
    }
  }
}

const viewUserDetail = (user) => {
  selectedUser.value = user
  showDetailDialog.value = true
}

const resetCreateForm = () => {
  createForm.value = {
    username: '',
    nickname: '',
    password: '',
    phone: '',
    role: 'user',
    bio: '',
    contact_info: ''
  }
  if (createFormRef.value) {
    createFormRef.value.resetFields()
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 头像兜底：接口有就用接口的；否则按用户ID/用户名稳定映射到内置头像池
const getAvatar = (user) => {
  if (!user) return ''
  if (user.avatar) return user.avatar
  const arr = Object.values(images?.avatars || {})
  if (!arr.length) return ''
  const basis = String(user.user_id || user.username || user.nickname || 'user')
  let sum = 0
  for (let i = 0; i < basis.length; i++) sum = (sum + basis.charCodeAt(i)) % 997
  return arr[sum % arr.length]
}

// 初始化
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 16px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 8px;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
}

.user-list-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.user-username {
  font-size: 12px;
  color: #6b7280;
}

/* 用户详情样式 */
.user-detail {
  padding: 20px 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-info h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.detail-info p {
  margin: 0 0 12px 0;
  color: #6b7280;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item .label {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
}

.detail-item .value {
  color: #6b7280;
}

.plantations-section h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.plantations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plantation-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.plantation-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.plantation-date {
  font-size: 12px;
  color: #6b7280;
}

.no-plantations {
  text-align: center;
  color: #6b7280;
  padding: 20px;
  background: #f9fafb;
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 16px;
  }
  
  .action-bar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detail-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
