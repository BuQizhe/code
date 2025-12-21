#include<iostream>
using namespace std;

//867. 转置矩阵
//给你一个二维整数数组 matrix， 返回 matrix 的 转置矩阵 。
//矩阵的 转置 是指将矩阵的主对角线翻转，交换矩阵的行索引与列索引。
// class Solution {
// public:
//     vector<vector<int>> transpose(vector<vector<int>>& matrix) {
//         int m = matrix.size(), n = matrix[0].size();
//         vector<vector<int>> transposed(n, vector<int>(m));
//         for (int i = 0; i < m; i++) {
//             for (int j = 0; j < n; j++) {
//                 transposed[j][i] = matrix[i][j];
//             }
//         }
//         return transposed;
//     }
// };


//231. 2 的幂
//给你一个整数 n，请你判断该整数是否是 2 的幂次方。如果是，返回 true ；否则，返回 false 。
//如果存在一个整数 x 使得 n == 2x ，则认为 n 是 2 的幂次方。

// class Solution {
// public:
//     bool isPowerOfTwo(int n) {
//         return n > 0 && (n & (n - 1)) == 0;
//     }
// };

// class Solution {
// public:
//     bool isPowerOfTwo(int n) {
//         return n > 0 && (n & -n) == n;
//     }
// };

// class Solution {
// private:
//     static constexpr int BIG = 1 << 30;

// public:
//     bool isPowerOfTwo(int n) {
//         return n > 0 && BIG % n == 0;
//     }
// };

//2586. 统计范围内的元音字符串数
//给你一个下标从 0 开始的字符串数组 words 和两个整数：left 和 right 。
//如果字符串以元音字母开头并以元音字母结尾，那么该字符串就是一个 元音字符串 ，其中元音字母是 'a'、'e'、'i'、'o'、'u' 。
//返回 words[i] 是元音字符串的数目，其中 i 在闭区间[left, right] 内。
// class Solution {
// public:
//     int vowelStrings(vector<string>& words, int left, int right) {
//         unordered_set<char> vowels = { 'a', 'e', 'i', 'o', 'u' };
//         int ans = 0;
//         for (int i = left; i <= right; ++i) {
//             const string& word = words[i];
//             if (vowels.count(word[0]) && vowels.count(word.back())) {
//                 ++ans;
//             }
//         }
//         return ans;
//     }
// };



#include <iostream>
using namespace std;

// 只定义一次 Solution 类
class Solution {
public:
    int add(int a, int b) {
        return a + b;
    }
};

int main() {
    Solution s;
    cout << "1+2=" << s.add(1, 2) << endl;
    return 0;
}