// API基础URL
export const API_BASE_URL = 'http://rap2api.taobao.org/app/mock/323891';
export class TimeUtils {
    // 获取当前日期时间作为默认值
    static getCurrentDateTime(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    }
    // 格式化时间显示（与MainPage保持一致）
    static formatTime(timeStr: string): string {
        if (!timeStr)
            return '时间未知';
        try {
            const date = new Date(timeStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            if (diffDays > 7) {
                // 超过7天显示具体日期
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()
                    .toString()
                    .padStart(2, '0')}`;
            }
            else if (diffDays > 0) {
                return `${diffDays}天前`;
            }
            else if (diffHours > 0) {
                return `${diffHours}小时前`;
            }
            else if (diffMinutes > 0) {
                return `${diffMinutes}分钟前`;
            }
            else {
                return '刚刚';
            }
        }
        catch (error) {
            // 如果时间格式无法解析，直接返回原字符串
            return timeStr;
        }
    }
}
