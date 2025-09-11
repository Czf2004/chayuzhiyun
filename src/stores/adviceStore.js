import { defineStore } from "pinia";

export const useAdviceStore = defineStore('advice',{
  state:()=>({
    items:[{
      id:1,
      label:'灌溉',
      name:"irrigation",
      adviceItems:[
      {
        region:'地块A',
        info:"生长期应多施氮肥",
        imageUrl:'@/assets/监测信息.png',
        detail:'地块 S 经监测土壤含水率仅 12%，低于 15% 的适宜阈值，需紧急补水。建议今日 16:00-18:00 开启滴灌系统，调节流量至每小时 8L/㎡，持续灌溉 45 分钟，确保水分渗透至 20cm 根系层，灌溉后 30 分钟复测含水率。',
        isreaded:false,
        valueday: '2025-08-23',
        isexecuted:false
      },
      {
        region:'地块B',
        info:"m没到花期需增加磷钾肥比例",
        imageUrl:'@/assets/监测信息.png',
        detail:'地块 A 当前含水率 18% 处于安全范围，但明日预报高温强光。建议提前于次日 6:00-7:00 轻灌 20 分钟，采用脉冲式滴灌模式，减少水分蒸发损耗。灌溉后检查管道有无堵塞，确保水流均匀覆盖所有茶株根系区。',
        isreaded:false,
        valueday: '2025-08-24',
        isexecuted:false
      },
    ],
    },
    {
      id:2,
      label:'施肥',
      name:"fertilization",
      adviceItems:[
        {
        region:'地块A',
        info:"早晨6点进行灌溉效果最佳",
        imageUrl:'@/assets/监测信息.png',
        detail:'地块 D 经监测土壤含水率仅 12%，低于 15% 的适宜阈值，需紧急补水。建议今日 16:00-18:00 开启滴灌系统，调节流量至每小时 8L/㎡，持续灌溉 45 分钟，确保水分渗透至 20cm 根系层，灌溉后 30 分钟复测含水率。',
        isreaded:false,
        valueday: '2025-08-23',
        isexecuted:false
      },
        {
          region:'地块B',
          info:"每次灌溉应保证土壤湿润深度达15cm",
          imageUrl:'@/assets/监测信息.png',
          detail:'地块 A 经监测土壤含水率仅 12%，低于 15% 的适宜阈值，需紧急补水。建议今日 16:00-18:00 开启滴灌系统，调节流量至每小时 8L/㎡，持续灌溉 45 分钟，确保水分渗透至 20cm 根系层，灌溉后 30 分钟复测含水率。',
          isreaded:false,
          valueday: '2025-08-24',
          isexecuted:false
        }
      ],
    },
    {
      id:3,
      label:'病虫害防治',
      name:"pestControl",
      adviceItems:[

      ],
    },
    {
      id:4,
      label:'采摘',
      name:"harvest",
      adviceItems:[
      ],
    }
  ],
    todayAdvices : [
    {
      id: 1,
      label: '灌溉',
      name: "irrigation",
      adviceItems: [
        {
          region: '地块C',
          info: "午后高温前及时补水",
          imageUrl: '@/assets/监测信息.png',
          detail: '地块C当前土壤含水率14%，接近临界值。建议今日14:00前完成灌溉，采用喷灌方式，流量调节至每小时5L/㎡，持续30分钟，确保水分渗透至15cm深度，避免午后高温导致的水分快速蒸发。',
          isreaded: false,
          valueday: '2025-08-25',
          isexecuted: false
        }
      ]
    },
    {
      id: 2,
      label: '施肥',
      name: "fertilization",
      adviceItems: [
        {
          region: '地块A',
          info: "结合灌溉追施复合肥",
          imageUrl: '@/assets/监测信息.png',
          detail: '地块A土壤氮磷钾含量检测显示氮元素偏低，建议今日灌溉后追加氮磷钾复合肥（比例1:1:1），每亩用量20kg，采用条施方式，深度5-8cm，施肥后轻覆土以提高利用率。',
          isreaded: false,
          valueday: '2025-08-25',
          isexecuted: false
        }
      ]
    },
    {
      id: 3,
      label: '病虫害防治',
      name: "pestControl",
      adviceItems: [
        {
          region: '地块B',
          info: "预防性喷施杀菌剂",
          imageUrl: '@/assets/监测信息.png',
          detail: '根据气象预报，未来3天湿度较大，地块B易发生霜霉病。建议今日10:00前喷施波尔多液（1:1:200配比），每亩用量150L，重点喷洒叶片背面，施药后6小时内遇雨需补喷。',
          isreaded: false,
          valueday: '2025-08-25',
          isexecuted: false
        }
      ]
    },
    {
      id: 4,
      label: '采摘',
      name: "harvest",
      adviceItems: [
        {
          region: '地块D',
          info: "上午露水干后采摘",
          imageUrl: '@/assets/监测信息.png',
          detail: '地块D作物已进入最佳采摘期，建议今日8:00-11:00进行采摘，此时露水已干且温度适宜。采摘时保留2片功能叶，轻拿轻放避免机械损伤，采摘后及时送入预冷车间。',
          isreaded: false,
          valueday: '2025-08-25',
          isexecuted: false
        }
      ]
    }
  ],
  selectedDates:[]
  }),
  getters: {
    // 筛选当前标签且符合选中日期的建议
    filteredAdviceItems: (state) => (activeTabId) => {
      const tab = state.items.find(item => item.id === activeTabId)
      if (!tab) return []

      // 无选中日期时返回所有建议
      if (!state.selectedDate) return tab.adviceItems

      // 按选中日期筛选当前标签的建议
      return tab.adviceItems.filter(item =>
        item.valueday === state.selectedDate
      )
    },
    // 获取选中日期的所有类型建议记录
    dailyHistory: (state) => {
      if (!state.selectedDates || state.selectedDates.length === 0) return [];

      return state.items.flatMap(tab =>
        tab.adviceItems
          .filter(item => state.selectedDates.includes(item.valueday))  // 多日期匹配
          .map(item => ({
            ...item,
            type: tab.label
          }))
      ).sort((a, b) => {
        const typeOrder = { '灌溉': 1, '施肥': 2, '病虫害防治': 3, '采摘': 4 };
        return typeOrder[a.type] - typeOrder[b.type];
      });
    }
  },
  actions: {
    // 更新选中的日期
    setSelectedDates(dates) {
      this.selectedDates = dates || []
    }
  }
})
