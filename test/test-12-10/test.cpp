

//20.有效的括号
// 
//给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
//有效字符串需满足：
//左括号必须用相同类型的右括号闭合。
//左括号必须以正确的顺序闭合。
//每个右括号都有一个对应的相同类型的左括号

#include <iostream>
#include <string>
#include <stack> // 栈的头文件
#include <unordered_map> // 哈希表，用于快速匹配括号类型
using namespace std;

bool isValid(string s) {
    // 1. 初始化栈：存左括号
    stack<char> stk;
    // 2. 哈希表：右括号 → 对应的左括号（快速查找匹配关系）
    unordered_map<char, char> map = {
        {')', '('},
        {'}', '{'},
        {']', '['}
    };

    // 3. 遍历字符串的每个字符
    for (char c : s) {
        // 情况1：遇到右括号（key在map里）
        if (map.count(c)) {
            // 3.1 如果栈空（没有左括号匹配）→ 无效
            if (stk.empty()) {
                return false;
            }
            // 3.2 弹出栈顶的左括号，判断是否匹配
            char top = stk.top();
            stk.pop();
            if (top != map[c]) { // 类型不匹配 → 无效
                return false;
            }
        }
        // 情况2：遇到左括号 → 压入栈
        else {
            stk.push(c);
        }
    }

    // 4. 遍历结束后，栈必须为空（所有左括号都闭合了）
    return stk.empty();
}

// 测试代码
int main() {
    // 测试用例1：有效
    string s1 = "()[]{}";
    cout << "测试用例1：" << (isValid(s1) ? "有效" : "无效") << endl; // 输出有效

    // 测试用例2：无效（类型不匹配）
    string s2 = "(]";
    cout << "测试用例2：" << (isValid(s2) ? "有效" : "无效") << endl; // 输出无效

    // 测试用例3：无效（顺序错误）
    string s3 = "([)]";
    cout << "测试用例3：" << (isValid(s3) ? "有效" : "无效") << endl; // 输出无效

    // 测试用例4：有效（嵌套）
    string s4 = "{[]}";
    cout << "测试用例4：" << (isValid(s4) ? "有效" : "无效") << endl; // 输出有效

    // 测试用例5：无效（缺右括号）
    string s5 = "{";
    cout << "测试用例5：" << (isValid(s5) ? "有效" : "无效") << endl; // 输出无效

    return 0;
}


//904 水果成篮

//你正在探访一家农场，农场从左到右种植了一排果树。这些树用一个整数数组 fruits 表示，其中 fruits[i] 是第 i 棵树上的水果 种类 。
//你想要尽可能多地收集水果。然而，农场的主人设定了一些严格的规矩，你必须按照要求采摘水果：
//
//你只有 两个 篮子，并且每个篮子只能装 单一类型 的水果。每个篮子能够装的水果总量没有限制。
//你可以选择任意一棵树开始采摘，你必须从 每棵 树（包括开始采摘的树）上 恰好摘一个水果 。采摘的水果应当符合篮子中的水果类型。每采摘一次，你将会向右移动到下一棵树，并继续采摘。
//一旦你走到某棵树前，但水果不符合篮子的水果类型，那么就必须停止采摘。
//给你一个整数数组 fruits ，返回你可以收集的水果的 最大 数目。

#include <iostream>
#include <vector>
#include <unordered_map> // 哈希表统计水果类型数量
using namespace std;

int totalFruit(vector<int>& fruits) {
    // 1. 哈希表：记录当前窗口内每种水果的数量（key=水果类型，value=数量）
    unordered_map<int, int> basket;
    // 2. 滑动窗口指针：left=左边界，max_len=最大采摘数（初始0）
    int left = 0, max_len = 0;

    // 3. 右指针遍历所有树（扩大窗口）
    for (int right = 0; right < fruits.size(); right++) {
        int cur_fruit = fruits[right];
        basket[cur_fruit]++; // 当前水果加入篮子，数量+1

        // 4. 如果窗口内水果类型超过2种，缩小左边界
        while (basket.size() > 2) {
            int left_fruit = fruits[left];
            basket[left_fruit]--; // 左边界水果数量-1
            // 如果该水果数量为0，从篮子里移除（类型数减少）
            if (basket[left_fruit] == 0) {
                basket.erase(left_fruit);
            }
            left++; // 左指针右移，缩小窗口
        }

        // 5. 更新最大采摘数（当前窗口长度=right-left+1）
        max_len = max(max_len, right - left + 1);
    }

    return max_len;
}

// 测试代码
int main() {
    // 测试用例1：[1,2,1] → 3
    vector<int> f1 = { 1,2,1 };
    cout << "测试用例1：" << totalFruit(f1) << endl;

    // 测试用例2：[1,2,3,2,2] → 4
    vector<int> f2 = { 1,2,3,2,2 };
    cout << "测试用例2：" << totalFruit(f2) << endl;

    // 测试用例3：[0,1,2,2] → 3
    vector<int> f3 = { 0,1,2,2 };
    cout << "测试用例3：" << totalFruit(f3) << endl;

    // 测试用例4：[3,3,3,1,2,1,1,2,3,3,4] → 5
    vector<int> f4 = { 3,3,3,1,2,1,1,2,3,3,4 };
    cout << "测试用例4：" << totalFruit(f4) << endl;

    return 0;
}