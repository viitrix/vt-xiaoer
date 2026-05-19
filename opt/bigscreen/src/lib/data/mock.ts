export interface Notice {
  id: number;
  title: string;
  content: string;
  time: string;
  type: "urgent" | "normal" | "activity";
}

export interface Resident {
  id: number;
  name: string;
  unit: string;
  avatar_color: string;
}

export interface ParkingInfo {
  total: number;
  used: number;
  free: number;
}

export interface WeatherInfo {
  temp: number;
  weather: string;
  humidity: number;
  wind: string;
  icon: string;
}

export interface EnergyData {
  label: string;
  water: number;
  electric: number;
}

export interface CommunityStats {
  totalResidents: number;
  totalHouseholds: number;
  occupancyRate: number;
  parkingRate: number;
}

export const communityName = "翡翠湾智慧社区";

export const notices: Notice[] = [
  {
    id: 1,
    title: "关于收取2026年度物业费的通知",
    content: "尊敬的业主您好，2026年度物业费收缴工作现已开始。本次收费标准按照小区物业服务合同执行，请各位业主于2026年6月30日前完成缴费。您可以通过社区APP在线缴纳，也可前往物业服务中心办理。感谢您的配合与支持！",
    time: "2026-05-19 09:40",
    type: "urgent"
  },
  {
    id: 2,
    title: "端午节社区活动报名",
    content: "端午节包粽子活动将于5月28日在社区活动中心举行，欢迎各位居民报名参加，名额有限先到先得。",
    time: "2026-05-18 14:30",
    type: "activity"
  },
  {
    id: 3,
    title: "垃圾分类宣传周",
    content: "本周为垃圾分类宣传周，社区将组织志愿者在各楼栋门口进行分类指导，请积极参与。",
    time: "2026-05-16 08:30",
    type: "activity"
  },
  {
    id: 4,
    title: "地下车库照明升级",
    content: "B区地下车库将于下周进行LED照明升级改造，施工期间部分区域照明可能受影响。",
    time: "2026-05-15 16:00",
    type: "normal"
  },
  {
    id: 5,
    title: "儿童游乐区维护通知",
    content: "中心花园儿童游乐区将于本周进行安全检查和维护保养，期间暂停开放。",
    time: "2026-05-14 11:00",
    type: "urgent"
  }
];

export const recentVisitors: Resident[] = [
  { id: 1, name: "张**", unit: "1栋-801", avatar_color: "#4fc3f7" },
  { id: 2, name: "李**", unit: "3栋-1204", avatar_color: "#81c784" },
  { id: 3, name: "王**", unit: "2栋-503", avatar_color: "#ffb74d" },
  { id: 4, name: "赵**", unit: "5栋-301", avatar_color: "#e57373" },
  { id: 5, name: "陈**", unit: "1栋-1602", avatar_color: "#ba68c8" },
  { id: 6, name: "刘**", unit: "4栋-907", avatar_color: "#4db6ac" },
  { id: 7, name: "杨**", unit: "2栋-1106", avatar_color: "#ff8a65" },
  { id: 8, name: "黄**", unit: "6栋-402", avatar_color: "#a1887f" },
];

export const parkingInfo: ParkingInfo = {
  total: 1200,
  used: 876,
  free: 324
};

export const weatherInfo: WeatherInfo = {
  temp: 26,
  weather: "多云",
  humidity: 65,
  wind: "东南风 3级",
  icon: "⛅"
};

export const energyData: EnergyData[] = [
  { label: "1月", water: 3200, electric: 58000 },
  { label: "2月", water: 2800, electric: 52000 },
  { label: "3月", water: 3100, electric: 55000 },
  { label: "4月", water: 3500, electric: 60000 },
  { label: "5月", water: 3800, electric: 68000 },
  { label: "6月", water: 4200, electric: 72000 },
];

export const communityStats: CommunityStats = {
  totalResidents: 3680,
  totalHouseholds: 1236,
  occupancyRate: 94.6,
  parkingRate: 73.0
};

export const videoSources = [
  {
    id: 1,
    title: "小区大门入口",
  },
  {
    id: 2,
    title: "中心花园",
  },
  {
    id: 3,
    title: "地下车库入口",
  },
  {
    id: 4,
    title: "儿童游乐区",
  },
];
