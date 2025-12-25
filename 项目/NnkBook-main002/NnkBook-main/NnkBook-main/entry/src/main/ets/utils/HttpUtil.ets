// entry/src/main/ets/utils/HttpUtil.ets
import http from '@ohos.net.http';

const BASE_URL: string = 'http://192.168.221.23:5000';   // 改成你的 IP

export interface Record {
  id?: number;
  amount: number;
  type: string;
  category: string;
  remark?: string;
  user_id?: number;
  date?: string;
  create_time?: string;
}

export interface UserInfo {
  userId: number;
  username: string;
  gender: string;
  hobby: string;
  avatar: string;
}

/* 注册（已加日志） */
interface GeneratedTypeLiteralInterface_1 {
  success: boolean;
  id?: number;
}

export async function registerUser(username: string, password: string, gender: string, hobby: string, avatar: string): Promise<number> {
  const client = http.createHttp();
  try {
    console.info('注册url:', `${BASE_URL}/api/user/register`);
    console.info('注册body:', JSON.stringify({ username, password, gender, hobby, avatar }));
    const resp = await client.request(
      `${BASE_URL}/api/user/register`,
      { method: http.RequestMethod.POST,
        header: { 'Content-Type': 'application/json' },
        extraData: JSON.stringify({ username, password, gender, hobby, avatar }),
        expectDataType: http.HttpDataType.STRING }
    );
    console.info('注册响应码:', resp.responseCode);
    console.info('注册响应内容:', resp.result);
    if (resp.responseCode === 200)
      return (JSON.parse(`${resp.result}`) as GeneratedTypeLiteralInterface_1).id ?? -1;
    return -1;
  } catch (e) {
    console.error('注册异常', e);
    return -1;
  } finally {
    client.destroy();
  }
}

/* 登录（已加日志） */
interface GeneratedTypeLiteralInterface_2 {
  success: boolean;
  userId?: number;
  username?: string;
  gender?: string;
  hobby?: string;
  avatar?: string;
}

export async function loginUser(username: string, password: string): Promise<UserInfo | null> {
  const client = http.createHttp();
  try {
    console.info('登录url:', `${BASE_URL}/api/user/login`);
    console.info('登录body:', JSON.stringify({ username, password }));
    const resp = await client.request(
      `${BASE_URL}/api/user/login`,
      { method: http.RequestMethod.POST,
        header: { 'Content-Type': 'application/json' },
        extraData: JSON.stringify({ username, password }),
        expectDataType: http.HttpDataType.STRING }
    );
    console.info('登录响应码:', resp.responseCode);
    console.info('登录响应内容:', resp.result);
    if (resp.responseCode === 200) {
      const obj = JSON.parse(`${resp.result}`) as GeneratedTypeLiteralInterface_2;
      if (obj.success) return { userId: obj.userId!, username: obj.username!, gender: obj.gender ?? '', hobby: obj.hobby ?? '', avatar: obj.avatar ?? '' };
    }
    return null;
  } catch (e) {
    console.error('登录异常', e);
    return null;
  } finally {
    client.destroy();
  }
}

/* 修改用户信息 */
interface GeneratedTypeLiteralInterface_3 {
  success: boolean;
}

export async function updateUser(userId: number, gender: string, hobby: string, avatar: string): Promise<boolean> {
  const client = http.createHttp();
  try {
    const resp = await client.request(
      `${BASE_URL}/api/user/update/${userId}`,
      { method: http.RequestMethod.PUT,
        header: { 'Content-Type': 'application/json' },
        extraData: JSON.stringify({ gender, hobby, avatar }),
        expectDataType: http.HttpDataType.STRING }
    );
    return resp.responseCode === 200 && (JSON.parse(`${resp.result}`) as GeneratedTypeLiteralInterface_3).success;
  } catch (e) {
    console.error('更新用户异常', e);
    return false;
  } finally {
    client.destroy();
  }
}

/* 新增记录 */
interface GeneratedTypeLiteralInterface_4 {
  success: boolean;
}

export async function addRecord(record: Record): Promise<boolean> {
  const client = http.createHttp();
  try {
    const body: Record = {
      amount: record.amount,
      type: record.type,
      category: record.category,
      remark: record.remark,
      user_id: record.user_id ?? 1,
      date: record.date ?? ''
    };
    const resp = await client.request(
      `${BASE_URL}/api/record/add`,
      { method: http.RequestMethod.POST,
        header: { 'Content-Type': 'application/json' },
        extraData: JSON.stringify(body),
        expectDataType: http.HttpDataType.STRING }
    );
    return resp.responseCode === 200 &&
    (JSON.parse(`${resp.result}`) as GeneratedTypeLiteralInterface_4).success;
  } catch (e) {
    console.error('新增异常', e);
    return false;
  } finally {
    client.destroy();
  }
}

/* 查询所有记录（某用户） */
interface GeneratedTypeLiteralInterface_5 {
  data: Record[];
}

export async function listRecord(userId: number): Promise<Record[]> {
  const client = http.createHttp();
  try {
    const resp = await client.request(
      `${BASE_URL}/api/record/list/${userId}`,
      { method: http.RequestMethod.GET, expectDataType: http.HttpDataType.STRING }
    );
    if (resp.responseCode === 200)
      return (JSON.parse(`${resp.result}`) as GeneratedTypeLiteralInterface_5).data;
    return [];
  } catch (e) {
    console.error('查询异常', e);
    return [];
  } finally {
    client.destroy();
  }
}

/* 删除记录 */
export async function deleteRecord(id: number): Promise<boolean> {
  const client = http.createHttp();
  try {
    const resp = await client.request(
      `${BASE_URL}/api/record/${id}`,
      { method: http.RequestMethod.DELETE, expectDataType: http.HttpDataType.STRING }
    );
    return resp.responseCode === 200;
  } catch (e) {
    console.error('删除异常', e);
    return false;
  } finally {
    client.destroy();
  }
}