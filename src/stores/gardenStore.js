import { defineStore } from "pinia";
import { getPlantations, getPlantationDetail, createPlantation, updatePlantation, deletePlantation } from '@/api/plantations';
// import { verifyLocation } from "@/locationVerification";
export const useGardenStore = defineStore('garden',{
  state:()=>({
    // 茶园数据
    gardenList: [],
    // 分页信息
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    // 查询参数
    queryParams: {
      page: 1,
      per_page: 10,
      ordering: '',
      country: '',
      province: '',
      city: '',
      deployment_status: '',
      status: ''
    },
    // 弹窗可见
    dialogvisible:false,

    // =null=>新增，!=null=>编辑
    currentEditingId:null,

    // 编辑模式？
    isEditMode:false,
    tableLoading: false,
    formData: {
      plantation_name: '',
      country: 'China',
      province: '',
      city: '',
      district: '',
      detail_address: '',
      latitude: null,
      longitude: null,
      altitude: null,
      drone_count: null,
      drone_running: null,
      soil_sensors_count: null,
      soil_sensors_running: null,
      insect_pests_status: 0,
      deployment_status: 0
    },
    // 表单验证规则
    formRules: {
      plantation_name: [
        { required: true, message: '请输入茶园名称', trigger: 'blur' },
        { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      country: [
        { required: true, message: '请输入国家', trigger: 'blur' }
      ],
      province: [
        { required: true, message: '请输入省份', trigger: 'blur' }
      ],
      city: [
        { required: true, message: '请输入城市', trigger: 'blur' }
      ],
      detail_address: [
        { required: true, message: '请输入详细地址', trigger: 'blur' },
        { min: 5, message: '地址至少 5 个字符', trigger: 'blur' }
      ],
      deployment_status: [
        { required: true, message: '请选择部署状态', trigger: 'change' }
      ],
      insect_pests_status: [
        { required: true, message: '请选择病虫害状态', trigger: 'change' }
      ]
    },

    // 部署状态选项
    deploymentStatusOptions: [
      { label: '未部署', value: 0 },
      { label: '部署中', value: 1 },
      { label: '已部署', value: 2 }
    ],


  }),
  actions:{

    // 获取茶园列表
  async loadData() {
    this.tableLoading = true;
    try {
      const response = await getPlantations(this.queryParams);
      // 根据实际接口响应，检查code字段
      if (response && response.code === 0 && response.success) {
        this.gardenList = response.data.items || [];
        this.pagination.total = response.data.total || 0;
        this.pagination.current = response.data.page || 1;
        this.pagination.pageSize = response.data.per_page || 10;
      } else {
        // 如果没有数据，设置为空数组
        this.gardenList = [];
        this.pagination.total = 0;
        this.pagination.current = 1;
      }
    } catch (error) {
      console.error('获取茶园列表失败:', error);
      // 出错时设置为空数组
      this.gardenList = [];
      this.pagination.total = 0;
      this.pagination.current = 1;
    } finally {
      this.tableLoading = false;
    }
  },

  // 获取茶园详情
  async getPlantationDetail(plantationId) {
    try {
      const response = await getPlantationDetail(plantationId);
      // 根据实际接口响应，检查code字段
      if (response && response.code === 0 && response.success) {
        return response.data;
      } else {
        throw new Error(response.message || '获取茶园详情失败');
      }
    } catch (error) {
      console.error('获取茶园详情失败:', error);
      throw error;
    }
  },

  // 新增表单
  openAddForm() {
    this.resetForm()
    this.isEditMode = false
    this.currentEditingId = null
    this.dialogvisible = true
  },

  // 处理表单数据，将0值转换为null或空字符串
  processFormData(data) {
    const processed = { ...data }
    
    // 处理数值字段，0值转换为null
    const numericFields = ['latitude', 'longitude', 'altitude', 'drone_count', 'drone_running', 'soil_sensors_count', 'soil_sensors_running']
    numericFields.forEach(field => {
      if (processed[field] === 0) {
        processed[field] = null
      }
    })
    
    // 处理字符串字段，空字符串或null保持原样
    const stringFields = ['plantation_name', 'country', 'province', 'city', 'district', 'detail_address']
    stringFields.forEach(field => {
      if (processed[field] === null || processed[field] === undefined) {
        processed[field] = ''
      }
    })
    
    return processed
  },

  // 准备提交数据，将null值转换为0
  prepareSubmitData(data) {
    const submitData = { ...data }
    
    // 处理数值字段，null值转换为0
    const numericFields = ['latitude', 'longitude', 'altitude', 'drone_count', 'drone_running', 'soil_sensors_count', 'soil_sensors_running']
    numericFields.forEach(field => {
      if (submitData[field] === null || submitData[field] === undefined || submitData[field] === '') {
        submitData[field] = 0
      }
    })
    
    // 处理字符串字段，null值转换为空字符串
    const stringFields = ['plantation_name', 'country', 'province', 'city', 'district', 'detail_address']
    stringFields.forEach(field => {
      if (submitData[field] === null || submitData[field] === undefined) {
        submitData[field] = ''
      }
    })
    
    // 确保所有必需字段都有值
    if (!submitData.plantation_name) {
      submitData.plantation_name = ''
    }
    if (!submitData.country) {
      submitData.country = 'China'
    }
    
    return submitData
  },

  // 编辑表单
  async openEditForm(row) {
    this.resetForm()
    this.isEditMode = true
    this.currentEditingId = row.plantation_id
    try {
      // 如果row中已经有完整数据，直接使用
      if (row.plantation_name && row.country) {
        // 处理数据，将0值转换为null或空字符串
        const processedData = this.processFormData(row)
        this.formData = { ...processedData }
      } else {
        // 否则获取详情
        const detail = await this.getPlantationDetail(row.plantation_id)
        const processedData = this.processFormData(detail)
        this.formData = { ...processedData }
      }
      this.dialogvisible = true
    } catch (error) {
      console.error('获取茶园详情失败:', error)
      // 如果获取详情失败，使用当前行数据
      const processedData = this.processFormData(row)
      this.formData = { ...processedData }
      this.dialogvisible = true
    }
  },

  // 提交表单
  async submitForm() {
    try {
      // 处理提交数据，将null值转换为0
      const submitData = this.prepareSubmitData(this.formData)
      
      // 调试信息
      console.log('提交的表单数据:', submitData)
      
      if (this.isEditMode) {
        const response = await updatePlantation(this.currentEditingId, submitData)
        // 根据实际接口响应，检查code字段
        if (response && response.code === 0 && response.success) {
          await this.loadData() // 重新加载数据
          return { success: true, message: response.message || '茶园信息更新成功' }
        } else {
          throw new Error(response.message || '更新失败')
        }
      } else {
        const response = await createPlantation(submitData)
        // 根据实际接口响应，检查code字段
        if (response && response.code === 0 && response.success) {
          await this.loadData() // 重新加载数据
          return { success: true, message: response.message || '茶园信息添加成功' }
        } else {
          throw new Error(response.message || '创建失败')
        }
      }
    } catch (error) {
      console.error('提交表单失败:', error)
      return { success: false, message: error.message || '操作失败' }
    }
  },

  // 重置表单
  resetForm() {
    this.formData = {
      plantation_name: '',
      country: 'China',
      province: '',
      city: '',
      district: '',
      detail_address: '',
      latitude: null,
      longitude: null,
      altitude: null,
      drone_count: null,
      drone_running: null,
      soil_sensors_count: null,
      soil_sensors_running: null,
      insect_pests_status: 0,
      deployment_status: 0
    }
    this.currentEditingId = null
  },

  // 删除信息
  async handleDelete(plantationId) {
    try {
      await deletePlantation(plantationId)
      await this.loadData() // 重新加载数据
      return { success: true, message: '茶园信息已删除' }
    } catch (error) {
      console.error('删除失败:', error)
      return { success: false, message: error.message || '删除失败' }
    }
  },

  // 关闭窗口
  closeDialog() {
    this.resetForm()
    this.dialogvisible = false
  },

  // 更新查询参数
  updateQueryParams(params) {
    this.queryParams = { ...this.queryParams, ...params }
  },

  // 分页处理
  async handlePageChange(page) {
    this.queryParams.page = page
    try {
      await this.loadData()
    } catch (error) {
      console.error('分页切换失败:', error)
      throw error
    }
  },

  // 搜索处理
  async handleSearch(params) {
    this.queryParams = { ...this.queryParams, ...params, page: 1 }
    try {
      await this.loadData()
    } catch (error) {
      console.error('搜索失败:', error)
      throw error
    }
  }
  },
  getters: {
    dialogTitle() {
      return this.isEditMode ? '编辑茶园信息' : '新增茶园信息'
    }
  }
})
