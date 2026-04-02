
//反转字符串
//编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出。
//不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。
//示例 1：
//
//输入：s = ["h", "e", "l", "l", "o"]
//输出：["o", "l", "l", "e", "h"]
//示例 2：
//	

//输入：s = ["H", "a", "n", "n", "a", "h"]
//输出：["h", "a", "n", "n", "a", "H"]
#include <iostream>
#include <vector>
using namespace std;
class Solution {
	public:
	void reverseString(vector<char>& s) {
		int left = 0;
		int right = s.size() - 1;
		while (left < right) {
			swap(s[left], s[right]);
			left++;
			right--;
		}
	}
};
int main() {
	Solution solution;
	vector<char> s = {'h', 'e', 'l', 'l', 'o'};
	solution.reverseString(s);
	for (char c : s) {
		cout << c << " ";
	}
	cout << endl;
	return 0;
}
//解释：	
//使用双指针法，定义两个指针 left 和 right，分别指向字符串的开头和结尾。
//通过交换 left 和 right 指向的字符，并将 left 向右移动，right 向左移动，
//直到 left 不再小于 right，即完成字符串的反转。
//时间复杂度：O(n)，其中 n 是字符串的长度。我们只需要遍历字符串一次。
//空间复杂度：O(1)，我们只使用了常数级别的额外空间。
//提示：
//1 <= s.length <= 10^5
//s[i] 是一个可打印的 ASCII 字符。


//单指针写法
//使用单指针遍历前半部分数组，并与对应的后半部分元素交换位置。
class Solution {
public:
	void reverseString(vector<char>& s) {
		int n = s.size();
		for (int i = 0; i < n / 2; i++) {
			swap(s[i], s[n - 1 - i]);
		}
	}
};


//使用 C++20 范围库
class Solution {
public:
	void reverseString(vector<char>& s) {
		ranges::reverse(s);
	}
};


//给定两个字符串 s 和 t 。返回 s 中包含 t 的所有字符的最短子字符串。如果 s 中不存在符合条件的子字符串，则返回空字符串 "" 。
//如果 s 中存在多个符合条件的子字符串，返回任意一个。
//
//注意： 对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
//
//示例 1：
//
//输入：s = "ADOBECODEBANC", t = "ABC"
//输出："BANC"
//解释：最短子字符串 "BANC" 包含了字符串 t 的所有字符 'A'、'B'、'C'

#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;
class Solution {
	public:
	string minWindow(string s, string t) {
		unordered_map<char, int> need, window;
		for (char c : t) {
			need[c]++;
		}
		int left = 0, right = 0;
		int valid = 0;
		int start = 0, len = INT_MAX;
		while (right < s.size()) {
			char c = s[right];
			right++;
			if (need.count(c)) {
				window[c]++;
				if (window[c] == need[c]) {
					valid++;
				}
			}
			while (valid == need.size()) {
				if (right - left < len) {
					start = left;
					len = right - left;
				}
				char d = s[left];
				left++;
				if (need.count(d)) {
					if (window[d] == need[d]) {
						valid--;
					}
					window[d]--;
				}
			}
		}
		return len == INT_MAX ? "" : s.substr(start, len);
	}
};
int main() {
	Solution solution;
	string s = "ADOBECODEBANC";
	string t = "ABC";
	string result = solution.minWindow(s, t);
	cout << "最短子字符串: " << result << endl; // 输出: "BANC"
	return 0;
}
//解释：
//使用滑动窗口算法，定义两个指针 left 和 right，表示当前窗口的左右边界。
//使用 need 哈希表记录字符串 t 中每个字符的需求数量，使用 window 哈希表记录当前窗口中每个字符的数量。
//当窗口中的字符数量满足需求时，尝试收缩窗口以找到更短的子字符串。
//时间复杂度：O(n)，其中 n 是字符串 s 的长度。每个字符最多被访问两次（一次由右指针，一次由左指针）。
//空间复杂度：O(m)，其中 m 是字符串 t 中不同字符的数量。需要额外的哈希表来存储这些字符的需求数量。
//提示：
//1 <= s.length, t.length <= 10^5
//s 和 t 由英文字母组成

//使用 C++20 范围库
class Solution {
	public:
	string minWindow(string s, string t) {
		unordered_map<char, int> need, window;
		for (char c : t) {
			need[c]++;
		}
		int left = 0, right = 0;
		int valid = 0;
		int start = 0, len = INT_MAX;
		while (right < s.size()) {
			char c = s[right];
			right++;
			if (need.count(c)) {
				window[c]++;
				if (window[c] == need[c]) {
					valid++;
				}
			}
			while (valid == need.size()) {
				if (right - left < len) {
					start = left;
					len = right - left;
				}
				char d = s[left];
				left++;
				if (need.count(d)) {
					if (window[d] == need[d]) {
						valid--;
					}
					window[d]--;
				}
			}
		}
		return len == INT_MAX ? "" : s.substr(start, len);
	}
};

//提示：
//1 <= s.length, t.length <= 10^5
//s 和 t 由英文字母组成



#include <iostream>
#include <string>
#include<climits>
using namespace std;

string minWindows(string s,string t){
	int need[128] = {0};
	int windows[128] = { 0 };
	int need_type = 0;

	for (char c:t)
	{
		if (need[c]==0)
		{
			need[c]++;
		}
	}

	int left = 0, valid = 0;
	int min_len = INT_MAX, start = 0;

	for (int right=0;right<s.size();right)
	{
		char c = s[right];
		if (need[c] > 0)
		{
			windows[c]++;
			if (windows[c] == need[c])
			{
				valid++;
			}
			
		}
		while (valid == need_type)
		{
			int current_len = right - left + 1;
			if (current_len < min_len)
			{
				min_len = current_len;
				start = left;
			}
		}
		char d = s[left];
		if (need[d]>0)
		{
			if (windows[0] == need[d])
			{
				valid--;
			}
			windows[d]--;
		}
		left++;
	}


return min_len = INT_MAX ? " " : s.substr(start, min_len);

}

int main()
{
	string s = "ADOBECODEBANC";
	string t = "ABC";
	cout << minWindows(s, t) << endl;
	return 0;

}