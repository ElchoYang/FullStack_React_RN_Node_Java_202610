// 用户角色类型
export type UserRole = 'Admin' | 'Developer' | 'Tester' | 'Product Manager';

// 用户状态类型
export type UserStatus = 'Active' | 'Inactive';

// 用户实体数据模型
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  createdAt: string;
}

// 表单提交用数据模型（创建/编辑时无 id 与 createdAt）
export type UserFormData = Omit<User, 'id' | 'createdAt'>;

// 列表查询与过滤参数
export interface UserQueryParams {
  q?: string;           // json-server 全文搜索关键字
  role?: string;        // 角色筛选
  status?: string;      // 状态筛选
  department?: string;  // 部门筛选
  _page?: number;       // 当前页码
  _limit?: number;      // 每页条数
  _sort?: string;       // 排序字段
  _order?: 'asc' | 'desc'; // 排序规则
}
