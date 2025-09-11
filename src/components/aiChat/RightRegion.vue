<script setup>
import {useAdviceStore} from '@/stores/adviceStore'
import { storeToRefs } from 'pinia';
import {ref,computed,watch} from 'vue'
import {Memo,ArrowUp,ArrowDown} from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
// 创建adviceStore的实例
const adviceStore = useAdviceStore();
// 从store中解构出items并保持其响应式
const { items } = storeToRefs(adviceStore);
const activeTab = ref(items.value[0]?.id)

// 为每个建议项创建独立的翻转状态（使用对象存储，key为索引）
const flipStates = ref({})

// 日期选择
const valueday = ref([])
const { dailyHistory } = storeToRefs(adviceStore);

//生成农事计划
// 新增弹窗相关状态
const planDialogVisible = ref(false);
const { todayAdvices: storeTodayAdvices } = storeToRefs(adviceStore)

// 打开弹窗并获取今日建议
const planning = () => {
  // 保留原有结构，只给每个advice添加checked属性
  storeTodayAdvices.value = storeTodayAdvices.value.map(group => ({
    ...group,
    adviceItems: group.adviceItems.map(advice => ({ ...advice, checked: false }))
  }));
  planDialogVisible.value = true;
};
// 提交选中的计划
const submitPlan = () => {
  const selectedAdvices = storeTodayAdvices.value.flatMap(group =>
  group.adviceItems.filter(advice => advice.checked));
  if (selectedAdvices.length === 0) {
    ElNotification({
      title: '提示',
      message: '请至少选择一项建议',
      type: 'warning'
    });
    return;
  }

  ElNotification({
    title: '成功',
    message: `已成功生成包含 ${selectedAdvices.length} 项建议的农事计划`,
    type: 'success'
  });
  planDialogVisible.value = false;
};

// 关闭弹窗时重置状态
const handleClose = () => {
  storeTodayAdvices.value = [];
  planDialogVisible.value = false;
};

// 选择类别
const handleTab=(id)=>{
      activeTab.value = id
}

// 判断有无建议
const activeAdviceItems = computed(()=>{
  const item = items.value.find(item =>item.id === activeTab.value)
  return item ? item.adviceItems : []
})

// 箭头翻转
const handleangle = (index)=>{
  if(flipStates.value[index] === undefined){
    flipStates.value[index] = false
  }
  flipStates.value[index] = !flipStates.value[index]
}

const Execute = (adviceItem)=>{
  adviceItem.isexecuted = true
  ElNotification({
    title: '通知',
    message: ('已标记为执行状态'),
  })
}

// 标记已读/未读
const handleReaded = (adviceItem)=>{
  adviceItem.isreaded = !adviceItem.isreaded
}

// 导出建议要改！！
const exportToWord = async (adviceItem) => {
  const response = await fetch('/template.docx');
  const content = await response.arrayBuffer();

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  doc.setData({
    region:adviceItem.region,
    info:adviceItem.info,
    detail: adviceItem.detail
  });

  try {
    doc.render();
  } catch (error) {
    console.error('生成文档时出错:', error);
    return;
  }

  const out = doc.getZip().generate({ type: 'blob' });
  const fileName = `${adviceItem.region}建议详情_${new Date().toISOString().slice(0, 10)}.docx`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(out);
  link.download = fileName;
  link.click();
};



// 监听日期选择变化并同步到store
watch(valueday, (newVal) => {
  if (!newVal || newVal.length === 0) {
    adviceStore.setSelectedDates([]);
    return;
  }

  // 取最后选中的日期，使用本地日期格式化
  const formattedDates = newVal.map(date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  adviceStore.setSelectedDates(formattedDates);
});

// 格式化显示选中的日期范围
const formattedDateRange = computed(() => {
  if (!valueday.value || valueday.value.length === 0) {
    return '';
  }

  // 排序并格式化日期
  const sortedDates = [...valueday.value].sort((a, b) => a - b);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return sortedDates.length === 1
    ? formatDate(sortedDates[0])
    : `${formatDate(sortedDates[0])} ~ ${formatDate(sortedDates[sortedDates.length - 1])}`;
});

const checkAll = ref(false);
// 全选/取消全选
const handleCheckAll = () => {
  storeTodayAdvices.value.forEach(group => {
    group.adviceItems.forEach(advice => {
      advice.checked = checkAll.value;
    });
  });
};

watch(
  () => storeTodayAdvices.value.flatMap(group => group.adviceItems.map(advice => advice.checked)),
  (checkedList) => {
    checkAll.value = checkedList.length > 0 && checkedList.every(checked => checked);
  }
);

</script>

<template>
  <div class="advices">
    <!-- 标签 -->
    <div class="tab-items">
      <div class="tab-item">
          <el-tag class="tab"
            v-for="item in items"
            :key="item.id"
            size="large"
            :effect="activeTab === item.id ? 'success' : 'light'"
            @click="handleTab(item.id)"
            :class="{ activeTab: activeTab === item.id }"
            >
            {{ item.label }}
          </el-tag>
      </div>

    </div>
    <!-- 卡片总盒子 -->
    <div class="advice-box" v-infinite-scroll="load" v-if="activeAdviceItems.length">
        <div v-for="(adviceItem,index) in activeAdviceItems" :key="index">
          <!-- 单个卡片 -->
          <div class="total">
            <div class="advice">
              <!-- 未读红点 -->
              <div class="dot" v-if="!adviceItem.isreaded"></div>
              <el-icon :size="22" class="memo"><Memo /></el-icon>
              <div class="content">
                <p class="region">{{ adviceItem.region }}</p>
                <p class="info">{{ adviceItem.info }}</p>
              </div>
              <!-- 下拉菜单 -->
               <el-dropdown trigger="click" class="Menu">
                  <!-- <el-icon :size="14"><More /></el-icon> -->
                   <div class="circles">
                      <div class="circle"></div>
                      <div class="circle"></div>
                      <div class="circle"></div>
                   </div>

                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleReaded(adviceItem)">{{adviceItem.isreaded ? '标为未读' : '标为已读'}}</el-dropdown-item>
                      <el-dropdown-item @click="exportToWord(adviceItem)">导出建议</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
            </div>
            <div class="bottom">
              <p class="checkDetail" @click="handleangle(index)">查看详情<el-icon :size="9" style="margin: 4px 0 0 5px; transition: transform 0.3s ease;"
                :style="{transform: flipStates[index] ? 'scaleY(-1)':'scaleY(1)'}"
                ><ArrowUp /></el-icon></p>
              <el-button type="success" size="small" round class="Execute" @click="(Execute(adviceItem))">执行</el-button>
            </div>
            <div class="detail" v-if="flipStates[index]">
              <p class="detail-content">{{ adviceItem.detail }}</p>
              <img :src="adviceItem.imageUrl" style="border-radius: 10px;">
              <p class="checkDetail" @click="handleangle(index)" style="display: block; margin-top: 5px;">收起<el-icon :size="10"><ArrowDown /></el-icon></p>
            </div>
          </div>
        </div>
        <div class="buttons">
          <el-button type="primary" plain size="small" @click="planning" class="plan">生成农事计划</el-button>
        </div>
        <!-- 农事计划弹窗 -->
        <el-dialog
          v-model="planDialogVisible"
          title="生成农事计划"
          width="600px"
          :before-close="handleClose"
        >
          <div class="plan-content">
            <p v-if="storeTodayAdvices.length === 0" class="empty-tip">今日暂无建议</p>
            <!-- 建议列表 -->
            <div v-else class="advice-list">
              <!-- 全选按钮 -->
              <div class="check-all">

              </div>
              <el-text type="primary">请勾选建议生成次日农事计划</el-text>
                <div v-for="group in storeTodayAdvices" :key="group.id">
                  <div v-for="(advice, index) in group.adviceItems" :key="index">
                    <el-checkbox
                      v-model="advice.checked"
                      class="checkbox"
                    ></el-checkbox>
                    <div class="advice-info"
                    @click="advice.checked = !advice.checked"
                    style="cursor: pointer;"
                    >
                      <h4>{{ advice.region }} - {{ advice.info }}</h4>
                      <p class="detail-text">{{ advice.detail }}</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <template #footer>
            <el-checkbox
                  v-model="checkAll"
                  @change="handleCheckAll"
                  style="position: absolute; left: 15px;"
                >
                  全选
                </el-checkbox>
            <el-button @click="planDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitPlan">确认提交</el-button>
          </template>
        </el-dialog>
    </div>
    <div class="advice-box adnone" v-else>
      - - - - - - 暂无相关建议 - - - - - -
    </div>
    <div class="history">
      <div class="Calendar">
        <p style="font-size: 13px; color: #333;">历史记录</p>
        <div class="block">
          <el-date-picker
            v-model="valueday"
            type="dates"
            size="small"
            placeholder="请选择日期"
            class="valueday"
          />
          <p class="record-text" v-if="valueday">{{ formattedDateRange }}</p>
        </div>
      </div>
      <!-- 显示历史记录 -->
      <div v-if="valueday && valueday.length > 0">
        <!-- 有记录时 -->
        <div class="history-record" v-if="dailyHistory.length > 0">
          <div v-for="(record, index) in dailyHistory" :key="index" class="history-card">
            <div class="h-total">
              <div class="label" :style="{ backgroundColor: record.isexecuted ? '#ddffb4' : 'lemonchiffon' }">
                <p style="font-size: 11px;">{{ record.isexecuted ? '已执行' : '未执行' }}</p>
              </div>
              <div class="h-advice">
                <el-icon :size="22" style="margin-top: 10px;margin-right: 10px;"><Memo /></el-icon>
                <div class="content">
                  <p class="h-region">{{ record.region }}({{ record.type }})</p>
                  <p class="h-info">{{ record.info }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无相关记录 -->
        <div v-else class="history-card">
          <div class="h-total">
            <p style="padding: 10px; text-align: center;">没有相关建议</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.advice-box{
  height: 450px;
  list-style: none;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 7px;
  padding: 0 7px 15px 7px;
  box-sizing: border-box;
  /* background-image:linear-gradient(to bottom right,white,rgb(218, 255, 218)) ; */
  background-color: #a7ffc94f;
  border-radius: 15px;
}

.adnone{
  justify-content: center;
  font-size: 13px;
  color: #333;
}

.form{
  width: 300px;
}

.tab{
  margin-right: 5px;
  font-size: 13px;
  padding: 0 15px;
  color: #000;
  background-color: #fff;
  border: none;

}

.tab:hover{
  /* border-bottom: #148800 solid 2px; */
  border-radius: 10px;
  color: #ffffff;
  background-color: #9deed2;
}

.tab:hover{
  cursor:pointer;
}

.activeTab{
  color: #ffffff;
  /* border-bottom: #148800 solid 2px; */
  background-color: #82debe;
  border-radius: 10px;
}

.tab-items{
  padding-top: 7px;
  padding-left: 10px;
  margin-bottom: 5px;
  /* background-color: #a7ffc96d; */
}

.total{
  background-color: #ffffff;
  /* background-image: linear-gradient(to bottom right, white , rgb(189, 255, 189)); */
  position: relative;
  padding:5px 10px;
  margin-top: 10px;
  width: 260px;
  border: #ffffff solid 2px;
  border-radius: 7px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0px 2px 5px #ffffff;
}

.dot{
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff4848;
  position: absolute;
  right: -3px;
  top: -9px;
}

.plan{
background-color: #82debe;
color: white;
border-radius: 15px;
border: none;
position: fixed;
top: 462px;
right: 15px;
/* padding:  10px 10px; */
}

.advice{
  display: flex;
  position: relative;
  /* margin-top: 10px; */
}

.memo{
  margin-top: 10px;
  margin-right: 10px;
  color: rgb(26, 154, 137);
}

.region{
  font-size: 15px;
  font-weight: 700;
  max-width: 150px;
  color: #333;
  /* color: #fff; */
}

.info{
  font-size: 13px;
  color: #444;
  /* color: #f0f0f0; */
}

.Execute{
background-color: #8befcc;
border: none;
}

.Menu{
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.circles{
  display: flex;
  margin-top: 6px;
}

.circle{
  width: 4px;
  height: 4px;
  background-color: #6a6a6a;
  border-radius: 50%;
  margin-right: 2px;
}

.bottom{
  display: flex;
  margin-top: 3px;
  justify-content: space-between;
  align-items: center;
}

.detail{
  text-align: center;
  margin-top: 10px;
}

.detail-content{
 font-size: 13px;
 color: #6b6b6b;
 text-align: left;
 max-width: 280px;
 display: block;
 margin-bottom: 10px;
 text-indent: 2em;
}

.checkDetail{
  display: inline-block;
  font-size: 11px;
  color: #666;
  cursor: pointer;
}
.history{
  padding: 5px 10px;
  padding-bottom: 10px;
  height: 232px;
  overflow-y: auto;
  background-color: #ffffff;
  position: relative;
  scrollbar-width: none;
  background-color: #a7ffc94f;
  border-radius: 15px;
}

::v-deep .valueday{
  width: 130px;
  position: relative;
  top: -2px;
}

.Calendar{
  display: flex;
  justify-content: space-between;
}

.record-text{
  font-size: 12px;
  color: #949494;
  position: absolute;
  right: 12px;
  display: block;
}

.history-card{
  margin-top: 20px;
}

.h-total{
  background-color: #ffffff;
  position: relative;
  padding: 0 0 5px 10px;
  margin-top: 10px;
  width: 260px;
  border: #ffffff solid 1px;
  border-radius: 7px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 2px 2px 3px #ffffff;
}

.h-advice{
  display: flex;
  position: relative;
  margin-top: 3px;
}

.h-region{
  font-size: 15px;
  font-weight: 700;
  max-width: 150px;
  color: #333;
}

.h-info{
  font-size: 13px;
  color: #444;
}

.label{
  position: relative;
  left: -10px;
  display: inline-block;
  background-color: #ddffb4;
  padding: 2px 13px;
}

.plan-content {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.empty-tip {
  text-align: center;
  padding: 20px 0;
  color: #666;
}

.advice-list {
  margin-top: 10px;
}

.advice-item {
  display: flex;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-bottom: 10px;
  align-items: flex-start;
}


.advice-info h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
}

.advice-info{
  padding: 5px 10px;
  border-radius: 10px;
}

.advice-info:hover{
  background-color: rgb(236, 255, 255);

}

.detail-text {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}


</style>
