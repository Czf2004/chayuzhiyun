<template>
  <div class="app-container">
    <el-card class="glass" shadow="hover">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>系统设置</span>
          <el-tag type="success">即时生效</el-tag>
        </div>
      </template>

      <el-form label-width="120px" :model="form">
        <el-form-item label="主题">
          <el-segmented v-model="form.theme" :options="themeOptions" @change="apply" />
        </el-form-item>
        <el-form-item label="组件尺寸">
          <el-radio-group v-model="form.elementSize" @change="apply">
            <el-radio-button label="small">小</el-radio-button>
            <el-radio-button label="default">默认</el-radio-button>
            <el-radio-button label="large">大</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="强调色">
          <el-color-picker v-model="form.accentColor" @change="apply" show-alpha :predefine="precolors" />
        </el-form-item>
        <el-form-item label="圆角">
          <el-slider v-model="form.radius" :min="4" :max="24" :step="1" @change="apply" />
        </el-form-item>
        <el-form-item label="布局密度">
          <el-segmented v-model="form.density" :options="densityOptions" @change="apply" />
        </el-form-item>
        <el-form-item label="内容宽度">
          <el-radio-group v-model="form.contentWidth" @change="apply">
            <el-radio-button label="narrow">窄</el-radio-button>
            <el-radio-button label="wide">宽</el-radio-button>
            <el-radio-button label="fluid">自适应</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="玻璃质感">
          <el-switch v-model="form.glassmorphism" @change="apply" />
        </el-form-item>
        <el-form-item label="渐变背景">
          <el-switch v-model="form.gradients" @change="apply" />
        </el-form-item>
        <el-form-item label="动效">
          <el-switch v-model="form.animations" @change="apply" />
        </el-form-item>
        <el-form-item label="字体缩放">
          <el-input-number v-model="form.fontScale" :min="80" :max="130" :step="5" @change="apply" />%
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存到本地</el-button>
          <el-button @click="reset">恢复默认</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据造数（仅管理员使用） -->
    <el-card class="glass" shadow="hover" style="margin-top:16px">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>数据造数（写入数据库）</span>
          <el-tag type="warning">谨慎操作</el-tag>
        </div>
      </template>
      <div class="seed-grid">
        <div class="seed-block">
          <div class="seed-title">用户造数</div>
          <div class="seed-row">
            <span>数量</span>
            <el-input-number v-model="userCount" :min="1" :max="200" />
          </div>
          <el-button type="primary" :loading="seedingUsers" @click="seedUsers">生成用户</el-button>
        </div>
        <div class="seed-block">
          <div class="seed-title">设备造数</div>
          <div class="seed-row">
            <span>数量</span>
            <el-input-number v-model="deviceCount" :min="1" :max="200" />
          </div>
          <el-button type="primary" :loading="seedingDevices" @click="seedDevices">生成设备</el-button>
        </div>
        <div class="seed-block">
          <div class="seed-title">茶园造数</div>
          <div class="seed-row">
            <span>数量</span>
            <el-input-number v-model="plantationCount" :min="1" :max="100" />
          </div>
          <el-button type="primary" :loading="seedingPlantations" @click="seedPlantations">生成茶园</el-button>
        </div>
      </div>
      <div class="hint">将调用后端创建接口持久化到数据库，字段与真实一致。</div>
    </el-card>
  </div>
  
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useUiSettingsStore } from '@/stores/uiSettingsStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createUser } from '@/api/admin'
import { createDevice } from '@/api/devices'
import { createPlantation } from '@/api/plantations'

const ui = useUiSettingsStore()
const form = reactive({ ...ui.settings })

const themeOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '系统', value: 'system' },
]
const densityOptions = [
  { label: '紧凑', value: 'compact' },
  { label: '舒适', value: 'comfortable' },
  { label: '宽松', value: 'spacious' },
]
const precolors = ['#2f7a59', '#409eff', '#10b981', '#ef4444', '#f59e0b']

const apply = () => ui.set({ ...form })
const save = () => ui.save()
const reset = () => { Object.assign(form, ui.$reset ? ui.$reset() : {}); ui.set({}) }

onMounted(() => ui.load())

// ============== 造数逻辑 ==============
const userCount = ref(20)
const deviceCount = ref(20)
const plantationCount = ref(10)
const seedingUsers = ref(false)
const seedingDevices = ref(false)
const seedingPlantations = ref(false)

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pad2 = (n) => String(n).padStart(2, '0')
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const genPhone = () => `1${sample(['3','5','7','8','9'])}${rand(100000000, 999999999)}`.slice(0,11)
const cnNames = ['小王','小李','小张','小刘','小陈','阿明','小赵','小周','小孙','小朱','阿青','阿豪','小叶','小江','小林','小吴','阿敏','小杭','小越','小徽']
const roles = ['user','user','user','user','user','admin']
const cities = ['杭州市','福州市','泉州市','昆明市','黄山市','景德镇市','宜宾市']
const teaTypes = ['西湖龙井','金骏眉','铁观音','普洱生茶','普洱熟茶','黄山毛峰','碧螺春','白毫银针']
const rolesInTea = ['茶农','采茶师','制茶师','品鉴师','电商运营','仓配主管','渠道BD']
const hobbyTags = ['户外徒步','摄影','咖啡','烘焙','古典音乐','跑步','泛读','篆刻','木工']
const emailDomains = ['163.com','qq.com','gmail.com','outlook.com','aliyun.com']

// 更自然的昵称与简介生成
const genNickname = (name) => {
  const tea = sample(teaTypes)
  const city = sample(cities).replace('市','')
  const patterns = [
    () => `${name}`,
    () => `${name}${sample(['同学','同道','老师','师傅','阿'])}`,
    () => `${city}${sample(['茶客','茶友','生活','慢记'])}`,
    () => `${tea}${sample(['爱好者','观察','随记'])}`,
    () => `${name}与${tea}`,
    () => `${name}${sample(['_','·','-'])}${sample(['daily','notes','lab','studio']).toLowerCase()}`
  ]
  return sample(patterns)()
}

const genBio = (name) => {
  const city = sample(cities)
  const tea = sample(teaTypes)
  const job = sample(rolesInTea)
  const hobby = sample(hobbyTags)
  const years = `${rand(1,10)}年`
  const connectors = ['平时','日常','闲时','有空的时候']
  const closers = ['一起喝杯茶吧。','欢迎交流。','保持热爱。','记录一些小发现。']
  const templates = [
    () => `${name}，在${city}做${job}，接触${tea}已有${years}。${sample(connectors)}关注田间到杯里的每一步，偶尔分享冲泡与产地见闻，${sample(closers)}`,
    () => `${city}的${name}，喜欢${tea}，${years}来一直在做${job}。热爱${hobby}，也在尝试用更科学的方式理解风味。${sample(closers)}`,
    () => `${name} / ${job} / ${tea}爱好者。${sample(connectors)}会把所见所感写下来，${hobby}也在慢慢精进。${sample(closers)}`
  ]
  return sample(templates)()
}

const seedUsers = async () => {
  try {
    await ElMessageBox.confirm(`确定创建 ${userCount.value} 个虚拟用户并写入数据库吗？`, '确认', { type: 'warning' })
  } catch { return }
  try {
    seedingUsers.value = true
    const tasks = []
    const today = new Date()
    const ymd = `${today.getFullYear()}-${pad2(today.getMonth()+1)}-${pad2(today.getDate())}`
    for (let i = 0; i < userCount.value; i++) {
      const name = `${sample(cnNames)}`
      const nickname = genNickname(name)
      const username = `user_${ymd}_${i}_${Math.random().toString(16).slice(2,6)}`
      const payload = {
        username,
        nickname,
        password: 'Passw0rd!',
        phone: genPhone(),
        role: sample(roles),
        bio: genBio(name),
        contact_info: `${username}@${sample(emailDomains)}`
      }
      tasks.push(createUser(payload))
    }
    const results = await Promise.allSettled(tasks)
    const ok = results.filter(r => r.status === 'fulfilled').length
    ElMessage.success(`用户创建完成：成功 ${ok} / 共 ${results.length}`)
  } catch (e) {
    ElMessage.error('用户造数失败')
  } finally { seedingUsers.value = false }
}

const deviceTypes = ['drone','soil_sensor','weather_station','irrigation_controller']
const statuses = ['active','inactive','maintenance','offline']

// 茶园相关数据
const plantationNames = ['西湖龙井茶园','碧螺春茶园','铁观音茶园','普洱古茶园','黄山毛峰茶园','武夷岩茶园','安溪铁观音茶园','信阳毛尖茶园','六安瓜片茶园','太平猴魁茶园']
const teaVarieties = ['西湖龙井','碧螺春','铁观音','普洱','黄山毛峰','武夷岩茶','信阳毛尖','六安瓜片','太平猴魁','白毫银针']
const soilTypes = ['红壤','黄壤','棕壤','紫色土','水稻土','潮土']
const climates = ['亚热带季风气候','温带季风气候','高原气候','山地气候']
const altitudes = [200, 300, 500, 800, 1000, 1200, 1500, 1800]
const areas = [50, 80, 120, 200, 300, 500, 800, 1000, 1500, 2000]
const statusesPlantation = ['active','inactive','maintenance','harvesting','planting']

const seedPlantations = async () => {
  try {
    await ElMessageBox.confirm(`确定创建 ${plantationCount.value} 个虚拟茶园并写入数据库吗？`, '确认', { type: 'warning' })
  } catch { return }
  try {
    seedingPlantations.value = true
    const tasks = []
    const now = new Date(); const ym = `${now.getFullYear()}${pad2(now.getMonth()+1)}${pad2(now.getDate())}`
    for (let i = 0; i < plantationCount.value; i++) {
      const name = sample(plantationNames)
      const variety = sample(teaVarieties)
      const area = sample(areas)
      const altitude = sample(altitudes)
      const payload = {
        name: `${name}-${i+1}`,
        location: `${sample(cities)}${sample(['区','县','市'])}${sample(['镇','乡','街道'])}`,
        tea_variety: variety,
        area_size: area,
        altitude: altitude,
        soil_type: sample(soilTypes),
        climate: sample(climates),
        planting_date: `${rand(2010, 2023)}-${pad2(rand(1,12))}-${pad2(rand(1,28))}`,
        expected_harvest_date: `${rand(2024, 2025)}-${pad2(rand(3,11))}-${pad2(rand(1,28))}`,
        status: sample(statusesPlantation),
        description: `${name}位于海拔${altitude}米，面积${area}亩，主要种植${variety}。土壤类型为${sample(soilTypes)}，气候条件适宜茶叶生长。`,
        contact_person: sample(cnNames),
        contact_phone: genPhone(),
        annual_production: rand(area * 0.5, area * 2),
        quality_grade: sample(['特级','一级','二级','三级']),
        certification: sample(['有机认证','绿色食品','地理标志','无公害']),
        irrigation_system: sample(['滴灌','喷灌','沟灌','自然灌溉']),
        pest_control: sample(['生物防治','化学防治','综合防治','有机防治'])
      }
      tasks.push(createPlantation(payload))
    }
    const results = await Promise.allSettled(tasks)
    const ok = results.filter(r => r.status === 'fulfilled').length
    ElMessage.success(`茶园创建完成：成功 ${ok} / 共 ${results.length}`)
  } catch (e) {
    ElMessage.error('茶园造数失败')
  } finally { seedingPlantations.value = false }
}

const seedDevices = async () => {
  try {
    await ElMessageBox.confirm(`确定创建 ${deviceCount.value} 台虚拟设备并写入数据库吗？`, '确认', { type: 'warning' })
  } catch { return }
  try {
    seedingDevices.value = true
    const tasks = []
    const now = new Date(); const ym = `${now.getFullYear()}${pad2(now.getMonth()+1)}${pad2(now.getDate())}`
    for (let i = 0; i < deviceCount.value; i++) {
      const type = sample(deviceTypes)
      const payload = {
        device_id: `D-${ym}-${i}-${Math.random().toString(16).slice(2,6)}`,
        device_type: type,
        model: type === 'drone' ? `DJI-AG-${100 + i}` : type === 'soil_sensor' ? `SS-${1000 + i}` : type === 'weather_station' ? `WS-${200 + i}` : `IC-${300 + i}`,
        firmware_version: `v1.${(i % 5)}.${(i % 9)}`,
        serial_number: `SN-${Math.random().toString(36).slice(2,10).toUpperCase()}`,
        // plantation 可选；如需绑定可在此填入现有茶园ID
        status: sample(statuses)
      }
      tasks.push(createDevice(payload))
    }
    const results = await Promise.allSettled(tasks)
    const ok = results.filter(r => r.status === 'fulfilled').length
    ElMessage.success(`设备创建完成：成功 ${ok} / 共 ${results.length}`)
  } catch (e) {
    ElMessage.error('设备造数失败')
  } finally { seedingDevices.value = false }
}
</script>

<style scoped>
.app-container { padding: 24px; }
.seed-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.seed-block { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
.seed-row { display: flex; align-items: center; gap: 12px; }
.seed-title { font-weight: 600; }
.hint { color: #6b7280; font-size: 12px; margin-top: 8px; }
</style>


