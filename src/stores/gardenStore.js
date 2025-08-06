import { defineStore } from "pinia";
// import { verifyLocation } from "@/locationVerification";
export const useGardenStore = defineStore('garden',{
  state:()=>({
    // 茶园初始数据
    gardenList: [
      {
        id: '1001',
        name: '云雾山茶园',
        address: '福建省武夷山市星村镇桐木村',
        latitude: 27.76,
        longitude: 117.9,
        area: 80.5,
        variety: '大红袍',
        plantingYear: 2010,
        owner: '武夷山岩茶合作社',
        certification: '有机认证',
        status: '正常生产'
      },
      {
        id: '1002',
        name: '阳光茶园一号',
        address: '云南省西双版纳州勐海县勐混镇',
        latitude: 21.98,
        longitude: 100.54,
        area: 120.3,
        variety: '普洱',
        plantingYear: 2012,
        owner: '勐海县茶农专业合作社',
        certification: '绿色食品',
        status: '正常生产'
      },
      {
        id: '1003',
        name: '龙井生态茶园',
        address: '浙江省杭州市西湖区龙井村',
        latitude: 30.23,
        longitude: 120.76,
        area: 50.8,
        variety: '龙井',
        plantingYear: 2015,
        owner: '杭州西湖茶叶有限公司',
        certification: '有机认证',
        status: '改造中'
      }
    ],
    // 弹窗可见
    dialogvisible:false,

    // =null=>新增，!=null=>编辑
    currentEditingId:null,

    // 编辑模式？
    isEditMode:false,
    tableLoading: false,
    formData: {
      name: '',
      address: '',
      latitude: null,
      longitude: null,
      area: null,
      variety: '',
      plantingYear: null,
      owner: '',
      status: ''
    },
    // 表单验证规则
    formRules: {
      name: [
        { required: true, message: '请输入茶园名称', trigger: 'blur' },
        { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      address: [
        { required: true, message: '请输入详细地址', trigger: 'blur' },
        { min: 5, message: '地址至少 5 个字符', trigger: 'blur' }
      ],
      coordinates: [
        {
          validator: (rule, value, callback, source) => {
            const { latitude, longitude } = source
            if (latitude=='' || longitude=='') {
              callback(new Error('请输入完整的经纬度'))
            } else if (latitude < -90 || latitude > 90) {
              callback(new Error('纬度值应在 -90 到 90 之间'))
            } else if (longitude < -180 || longitude > 180) {
              callback(new Error('经度值应在 -180 到 180 之间'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      area: [
        { required: true, message: '请输入茶园面积', trigger: 'blur' },
        {
          validator: (rule, value, callback, source) => {
            if (value <= 0) {
              callback(new Error('面积必须大于 0'))
            } else if (value > 10000) {
              callback(new Error('面积不能超过 10000 亩'))
            } else if (source.variety && source.plantingYear) {
              const currentYear = new Date().getFullYear()
              const age = currentYear - source.plantingYear

              const varietyAreaRanges = {
                '龙井': { min: 0.5, max: 200 },
                '碧螺春': { min: 0.3, max: 150 },
                '大红袍': { min: 0.2, max: 100 },
                '铁观音': { min: 0.5, max: 300 },
                '普洱': { min: 1, max: 500 },
                'default': { min: 0.1, max: 10000 }
              }

              const range = varietyAreaRanges[source.variety] || varietyAreaRanges.default

              if (age < 3 && value > range.max * 0.5) {
                callback(new Error(`种植年限较短，建议面积不超过 ${range.max * 0.5} 亩`))
              } else if (value < range.min || value > range.max) {
                callback(new Error(`${source.variety} 适宜面积范围为 ${range.min} - ${range.max} 亩`))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      variety: [
        { required: true, message: '请选择或输入茶叶品种', trigger: 'blur' }
      ],
      plantingYear: [
        { required: true, message: '请输入种植年份', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            const currentYear = new Date().getFullYear()
            if (value < 1950) {
              callback(new Error('种植年份不能早于 1950 年'))
            } else if (value > currentYear) {
              callback(new Error(`种植年份不能晚于 ${currentYear} 年`))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      owner: [
        { required: true, message: '请输入所属单位', trigger: 'blur' },
        { min: 2, message: '所属单位至少 2 个字符', trigger: 'blur' }
      ],
      status: [
        { required: true, message: '请选择生产状态', trigger: 'change' }
      ]
    },

    // 茶园状态数组
    statusOption:[
      {label:'正常生产',value:'正常生产'},
      {label:'休耕',value:'休耕'},
      {label:'改造中',value:'改造中'}
    ],

    //茶叶品种
    teaVarieties: [
      { label: '龙井', value: '龙井' },
      { label: '碧螺春', value: '碧螺春' },
      { label: '大红袍', value: '大红袍' },
      { label: '铁观音', value: '铁观音' },
      { label: '普洱', value: '普洱' },
      { label: '黄山毛峰', value: '黄山毛峰' },
      { label: '祁门红茶', value: '祁门红茶' }
    ],
  }),
  actions:{

    // 验证地址准确性
  async verifyLocation() {
    const { address, latitude, longitude } = this.formData;

    // 基础校验
    if (!address || !latitude || !longitude) {
      return { success: false, message: '请填写完整的地址和经纬度信息' };
    }

    try {
      const apiKey = 'c89763ca3b15e5d916703381ed54d338';
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://restapi.amap.com/v3/geocode/geo?address=${encodedAddress}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('地址解析服务异常');
      }

      const result = await response.json();
      // 解析API返回结果
      if (result.status !== '1' || result.geocodes.length === 0) {
        return {
          success: false,
          message: '无法解析该地址，请检查地址是否正确'
        };
      }

      // 提取API返回的经纬度
      const [apiLongitude, apiLatitude] = result.geocodes[0].location.split(',').map(Number);

      // 计算经纬度偏差（单位：度）
      const latDiff = Math.abs(latitude - apiLatitude);
      const lngDiff = Math.abs(longitude - apiLongitude);
      const totalDiff = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      const distance = Math.round(totalDiff * 111); // 转换为公里数

      // 根据偏差返回不同结果
      if (totalDiff < 0.01) { // 约1公里内
        return {
          success: true,
          message: `地址验证通过，经纬度与地址匹配良好（偏差约${distance}公里）`
        };
      } else if (totalDiff < 0.1) { // 约10公里内
        return {
          success: false,
          warning: true,
          message: `经纬度与地址存在一定偏差（约${distance}公里）`,
          suggestedLat: apiLatitude,
          suggestedLng: apiLongitude
        };
      } else { // 偏差较大
        return {
          success: false,
          message: `经纬度与地址偏差较大（约${distance}公里）`,
          suggestedLat: apiLatitude,
          suggestedLng: apiLongitude
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `验证失败：${error.message}`
      };
    }
  },

  // 打开新增表单
    openAddForm() {
      this.resetForm()
      this.isEditMode = false
      this.dialogvisible = true
    },
  // 编辑表单
  openEditForm(row){
    this.resetForm()
    this.isEditMode=true
    this.currentEditingId=row.id
    this.formData={...row}
    this.dialogvisible=true
  },
  // 提交表单
  submitForm(){
    if(this.isEditMode){
      const index = this.gardenList.findIndex(item=>item.id===this.currentEditingId)
      if(index!=-1){
        this.gardenList[index]={...this.gardenList[index],...this.formData}
      }
      return {success:true,message:'茶园信息更新成功'}
    }else{
      const newId = String(Math.max(...this.gardenList.map(item => Number(item.id)), 0) + 1)
      this.gardenList.push({
        id:newId,
        ...this.formData
      })
      return { success: true, message: '茶园信息添加成功' }
    }
  },
  // 重置表单
  resetForm(){
    this.formData={
      name: '',
      address: '',
      latitude: null,
      longitude: null,
      area: null,
      variety: '',
      plantingYear: null,
      owner: '',
      status: ''
    }
    this.currentEditingId=null
  },
  // 删除信息
    handleDelete() {
      this.gardenList = this.gardenList.filter(item => item.id !== this.currentEditingId)
      this.closeDialog()
      return { success: true, message: '茶园信息已删除' }
    },
  // 关闭窗口
  closeDialog(){
    this.resetForm()
    this.dialogvisible=false
  },
  // 加载数据
    loadData() {
      this.tableLoading = true
      setTimeout(() => {
        this.tableLoading = false
      }, 800)
    }
  },
  getters: {
    dialogTitle() {
      return this.isEditMode ? '编辑茶园信息' : '新增茶园信息'
    }
  }
})
