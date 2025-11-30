# My School Ride MVP需求文档

## 1. 网站名称
My School Ride -校车追踪管理系统（MVP版）

## 2. 网站描述
一个面向学校的校车管理平台，提供统一登录入口，支持管理员、司机、学生、家长四种角色。核心功能包括：管理员对车辆、司机、学生、家长的全面管理；司机实时GPS位置上报；学生和家长实时查看校车位置。

## 3. 核心功能模块
\n### 3.1 统一登录系统
- **统一登录入口**：所有用户类型（管理员、司机、学生、家长）通过同一登录页面访问系统
- **角色选择机制**：登录页面提供下拉菜单或按钮组，用户需先选择角色后输入凭证
- **角色验证**：系统根据选中角色验证对应数据库表中的用户名和密码
- **管理员专用路由**：访问 `/adminherelogin` 自动跳转至登录页并预选管理员角色
- **预配置超级管理员账号**：\n  - 用户名：`chandrasekharadmin`
  - 密码：`chandrasekharadmin1023@@`
- JWT身份认证和会话管理

### 3.2 管理员模块（Phase 1: Operational Data Management）
\n#### 3.2.1 车辆管理（CRUD）
- **添加车辆**：车辆ID、车牌号、型号、载客量、路线名称（如'Route 4 - North Campus'）
- **查看车辆列表**：使用 shadcn/ui Data Tables 组件展示，支持搜索和筛选
- **编辑车辆信息**：通过 Dialog/Sheet 组件实现无刷新编辑\n- **停用/删除车辆记录**\n- **路线分配**：为每辆车分配文本型路线名称（MVP简化方案）

#### 3.2.2 司机管理（CRUD）
- **添加司机**：姓名、联系方式、驾照号、分配车辆（vehicle_id关联）
- **查看司机列表**：使用 shadcn/ui Data Tables 组件\n- **编辑司机信息**：通过 Dialog/Sheet 组件实现\n- **停用/删除司机账号**
- **车辆关联**：创建司机时必须指定 vehicle_id 建立关系链接

#### 3.2.3 学生管理（CRUD）
- **添加学生**：姓名、学号、年级、接送点坐标、关联家长\n- **查看学生列表**：使用 shadcn/ui Data Tables 组件
- **编辑学生信息**\n- **停用/删除学生记录**
\n#### 3.2.4 家长管理（CRUD）
- **添加家长**：姓名、联系方式、关联学生\n- **查看家长列表**：使用 shadcn/ui Data Tables 组件
- **编辑家长信息**
- **停用/删除家长账号**

#### 3.2.5 权限控制
- Supabase RLS（Row Level Security）策略：
  - 管理员角色：允许 INSERT 和 UPDATE 所有表
  - 司机角色：仅允许 READ 车辆和路线信息
\n### 3.3 司机模块（Phase 3: Driver Dashboard - The Publisher）

#### 3.3.1 司机仪表盘
- 登录后显示当前任务和车辆信息
- 显示当前速度和行驶状态
\n#### 3.3.2 实时追踪功能
- **'开始追踪/停止追踪'按钮**：简单的状态切换控制
- **GPS数据采集**：\n  - 使用 `navigator.geolocation.watchPosition` API（优于 getCurrentPosition）
  - 采集内容：经纬度、行驶方向（heading）\n- **数据节流机制**：每5-10秒更新一次数据库（避免过度写入）
- **位置数据上传**：通过 Supabase API 提交至 `gps_logs` 表\n- **后台持续运行**：即使应用在后台也保持位置更新

#### 3.3.3 GPS上报逻辑（TypeScript实现）
```typescript
// 位置更新时
const { error } = await supabase
  .from('gps_logs')\n  .insert({ 
    vehicle_id: myVehicleId, 
    latitude: lat, 
    longitude: lng,
    heading: heading 
  })
```
\n### 3.4 学生与家长模块（Phase 4: Parent/Student View - The Subscriber）

#### 3.4.1 实时地图追踪（Phase 2: Map Integration）
- **地图引擎**：React-Leaflet + CartoDB Dark Matter Tiles
- **视觉风格**：Cyber-dark主题配合霓虹绿标记
- **核心功能**：
  - 登录后自动加载地图界面
  - 显示分配给该学生的校车实时位置
  - 车辆标记使用霓虹绿脉冲动画效果（Neon Green Pulse Marker）
  - 车辆标记随GPS数据更新自动移动
  - 显示车辆移动轨迹
  - 平滑动画过渡：使用CSS transition在两个坐标点间插值，使校车呈现滑行效果而非瞬移

#### 3.4.2 位置信息展示
- 学生接送点标记\n- 校车当前位置与接送点距离
- 预计到达时间（ETA）
- 地图自动刷新机制（通过Supabase Realtime订阅实现）

#### 3.4.3 实时数据订阅
- 使用Supabase Realtime Channels 订阅 `gps_logs` 表
- 按vehicle_id 过滤相关车辆数据
- 无需手动刷新页面，数据自动推送更新

#### 3.4.4 地理围栏与提醒（Phase 5: Optional/Advanced）
- **距离计算**：使用 Haversine 公式计算校车与学生接送点距离
- **到达提醒**：当距离 < 500米时，显示 Toast 通知：'Bus is arriving soon!'
- **触发逻辑**：实时监测位置变化并自动判断\n
## 4. 技术架构说明

### 4.1 数据库设计
- **独立用户表结构**：
  - `admins` 表：管理员账号信息
  - `drivers` 表：司机账号及详细信息（含vehicle_id 外键）
  - `students` 表：学生档案及接送点坐标
  - `parents` 表：家长账号及关联学生
  - `vehicles` 表：车辆信息、分配状态、路线名称
  - `gps_logs` 表：司机实时位置记录（driver_id、vehicle_id、latitude、longitude、heading、timestamp）

### 4.2 后端技术栈
- Supabase（替代传统 Node.js + MongoDB方案）
- Supabase Auth（JWT身份认证）\n- Supabase Realtime（WebSocket实时通信）
- RESTful API 自动生成
- Row Level Security（RLS）权限控制

### 4.3 前端技术栈
\n#### 管理后台：
- React（Vite构建）
- Tailwind CSS
- shadcn/ui 组件库（Data Tables、Dialog、Sheet）
- Axios或 Supabase Client\n\n#### 司机/学生/家长端：\n- React（Web端）或 React Native + Expo（移动端）
- React-Leaflet 地图组件
- Leaflet.js 核心库
- CartoDB Dark Matter Tiles（免费，无需API密钥）
- 自定义霓虹绿 SVG 标记图标
- Geolocation API（浏览器原生）

#### 地图组件依赖安装：
```bash\nnpm install leaflet react-leaflet\nnpm install -D @types/leaflet
```

#### 全局CSS配置（src/index.css）：
```css
@import'leaflet/dist/leaflet.css';
\n.leaflet-container {
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  z-index: 0;
}\n```

### 4.4 核心API端点
- `POST /api/auth/login`：统一登录接口（需传递角色参数）
- `POST /api/gps/update`：司机上报GPS位置（通过 Supabase Client实现）
- `GET /api/gps/latest/:driverId`：获取指定司机最新位置\n- `GET /api/admin/vehicles`：管理员获取车辆列表
- `POST /api/admin/vehicles`：管理员添加车辆
- `PUT /api/admin/vehicles/:id`：管理员更新车辆\n- `DELETE /api/admin/vehicles/:id`：管理员删除车辆
- 类似的CRUD端点适用于 drivers、students、parents

### 4.5 LiveMap 组件实现（src/components/map/LiveMap.tsx）

#### 组件配置：
-地图瓦片：CartoDB Dark Matter (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`)
- 自定义标记：使用 `L.divIcon` 创建霓虹绿脉冲图标
- Tailwind 动画类：`animate-ping`、`shadow-green-400`
- 默认中心点：[17.3850, 78.4867]（Hyderabad示例）
- 默认缩放级别：13

#### 组件接口：
```typescript
interface VehicleLocation {
  id: string;\n  name: string;
  lat: number;
  lng: number;
  status: 'moving' | 'stopped' | 'offline';
}\n
interface LiveMapProps {
  center?: [number, number];
  zoom?: number;
  vehicles?: VehicleLocation[];
}\n```

#### 使用示例：
```typescript
import LiveMap from '@/components/map/LiveMap';

const DashboardPage = () => {
  const activeBuses = [
    { id: '1', name: 'Bus 101 (Route A)', lat: 17.3850, lng: 78.4867, status: 'moving' },
    { id: '2', name: 'Bus 104 (Route B)', lat: 17.3950, lng: 78.4967, status: 'stopped' },\n  ];

  return (
    <div className='h-screen'>
      <LiveMap center={[17.3850, 78.4867]} zoom={13} vehicles={activeBuses} />
    </div>
  );
};
```\n
## 5. 实时追踪实现方案

### 5.1 司机端（数据发布者）
-使用 `navigator.geolocation.watchPosition` 获取位置
- 每5-10秒通过 Supabase Client 插入 `gps_logs` 表
- 包含字段：vehicle_id、latitude、longitude、heading、timestamp
\n### 5.2 服务器端（Supabase）
- 接收位置数据自动存入数据库
- 通过 Supabase Realtime Channels 自动广播给订阅客户端
- 位置数据保留策略：保存最近24小时轨迹用于历史回放

### 5.3 学生/家长端（数据订阅者）
- 建立 Supabase Realtime 订阅连接
- 监听 `gps_logs` 表的 INSERT 事件
- 按 vehicle_id 过滤相关车辆\n- 接收最新位置并更新地图标记
- 使用 CSS transition 实现平滑移动动画

### 5.4 性能优化
- GPS数据节流存储（避免数据库过载）
- 地理空间索引优化查询性能
- 前端标记插值动画（减少视觉跳跃感）
\n## 6. 开发阶段规划

### Phase 1: Operational Data Management（优先级：高，复杂度：低）
- 实现管理员 CRUD 界面
- 使用 shadcn/ui Data Tables 和 Dialog 组件
- 配置 Supabase RLS 权限策略
\n### Phase 2: Map Integration（优先级：高，复杂度：中）
- 集成 React-Leaflet 和 CartoDB Dark Matter\n- 创建 LiveMap 组件
- 实现霓虹绿脉冲标记

### Phase 3: Driver Location Logic（优先级：中，复杂度：高）
- 实现 Geolocation API 调用
- 配置数据节流机制
- 完成GPS 数据上报逻辑
\n### Phase 4: Realtime Subscriptions（优先级：中，复杂度：高）
- 配置 Supabase Realtime Channels
- 实现前端订阅逻辑
- 添加平滑动画过渡\n
### Phase 5: Geofencing & Alerts（优先级：可选，复杂度：中）
- 实现 Haversine 距离计算
- 添加到达提醒功能
- 配置 Toast 通知组件

## 7. 安全与性能\n- 密码加密存储（Supabase Auth 内置 bcrypt）
- JWT令牌过期机制
- CORS跨域配置
- 请求限流保护
- GPS数据节流存储（5-10秒间隔）
- 地理空间索引优化查询性能
- Supabase RLS 行级安全策略
\n## 8. 网站设计风格
- **主题定位**：Cyber-dark 风格，霓虹绿点缀，强调科技感和未来感
- **配色方案**：
  - 主背景：#1a1a1a（深黑）
  - 卡片背景：#ffffff（纯白，管理后台）
  - 主题色：#3b82f6（科技蓝）
  - 霓虹绿：#10b981（翠绿，用于地图标记和强调元素）
  - 警告色：#f59e0b（橙黄）
  - 边框色：#e2e8f0（浅灰）
- **视觉细节**：
  - 地图标记：霓虹绿脉冲动画（animate-ping）配合阴影效果（shadow-green-400）
  - 圆角：中等圆角（0.5rem）
  -阴影：轻微卡片阴影\n  - 按钮：扁平化设计，悬停时轻微提升效果
  - 地图：CartoDB Dark Matter 深色底图，清晰的标记图标，车辆标记带方向指示
  - 表格：斑马纹行样式，悬停高亮\n- **布局方式**：
  - 管理后台：侧边栏导航 + 主内容区\n  - 移动端/家长端：全屏地图视图+ 底部状态栏
  - 表单：垂直排列，清晰的字段标签
  - 响应式设计，适配桌面和移动设备