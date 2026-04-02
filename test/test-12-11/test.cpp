

//905.按奇偶排序数组
//给你一个整数数组 nums，将 nums 中的的所有偶数元素移动到数组的前面，后跟所有奇数元素。
//返回满足此条件的 任一数组 作为答案。
//
//示例 1：
//
//输入：nums = [3, 1, 2, 4]
//输出：[2, 4, 3, 1]
//解释：[4, 2, 3, 1]、[2, 4, 1, 3] 和[4, 2, 1, 3] 也会被视作正确答案。

#include<iostream>
#include<vector>
using namespace std;


int main()
{
	vector<int>nums = { 3,1,2,4 };//数组
	vector<int>even;//偶数数组
	vector<int>odd;//奇数数组

	for (int num:nums)
	{
		if (num % 2 == 0)
		{
			even.push_back(num);
		}
		else
		{
			odd.push_back(num);
		}
	}

	vector<int>res;//合并数组

	for (int e:even)
	{
		res.push_back(e);
	}

	for (int o : odd)
	{
		res.push_back(o);
	}

	cout << "排序后数组";

	for (int num:res)
	{
		cout << num << " ";
	}

	cout << endl;

	return 0;
}

//双指针
#include<iostream>
#include<vector>
using namespace std;
int main()
{
	vector<int>nums = { 3,1,2,4 };

	int left = 0;
	int right = nums.size() - 1;
	
	while (left<right)
	{
		while (left < right && nums[left] % 2 == 0)
		{
			left++;
		}
		while (left < right && nums[right] % 2 == 1)
		{
			right--;
		}
	}

	cout << "排序后的数组";

	for(int num:nums)
	{
		cout << num << " ";

	}

	cout << endl;
	return 0;
}


//LCR.015.找到字符串中所有字母的异位词
//给定两个字符串 s 和 p，找到 s 中所有 p 的 变位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
//变位词 指字母相同，但排列不同的字符串。
//
//示例 1：
//
//输入 : s = "cbaebabacd", p = "abc"
//输出 : [0, 6]
//解释 :
//	起始索引等于 0 的子串是 "cba", 它是 "abc" 的变位词。
//	起始索引等于 6 的子串是 "bac", 它是 "abc" 的变位词。

#include<iostream>
#include<vector>
#include<string>
using namespace std;

vector<int>findAnagrams(string s, string p)
{
	vector<int>res; //存储数组结果
	int s_len = s.size(), p_len = p.size();

	if (s_len<p_len)//s比p短，直接返回空
	{
		return res;
	}

	vector<int>p_count(26, 0);
	vector<int>s_count(26, 0);

	for (int i = 0; i < p_len; i++)
	{
		p_count[p[i] - 'a']++;
		s_count[s[i] - 'a']++;

	}

	if (p_count==s_count)//检查第一个是否为异位词
	{
		res.push_back(0);
	}

	for (int right=p_len;right<s_len;right)
	{
		s_count[s[right] - 'a']++;

		int left = right - p_len;
		s_count[s[left] - 'a']++;

		if (p_count==s_count)
		{
			res.push_back(left + 1);
		}
	}
	return res;
}

int main()
{

	// 测试用例1
	string s1 = "cbaebabacd";
	string p1 = "abc";
	vector<int> res1 = findAnagrams(s1, p1);
	cout << "测试用例1结果：";
	for (int idx : res1) {
		cout << idx << " ";
	}
	cout << endl; // 输出：0 6

	// 测试用例2
	string s2 = "abab";
	string p2 = "ab";
	vector<int> res2 = findAnagrams(s2, p2);
	cout << "测试用例2结果：";
	for (int idx : res2) {
		cout << idx << " ";
	}
	cout << endl; // 输出：0 1 2

	return 0;
}




//1. 字符计数的核心：c - 'a'
//p_count[p[i] - 'a']++;
//小写字母a的 ASCII 码是 97，b是 98...z是 122；
//p[i] - 'a'会把字符转成 0 - 25 的数字（比如'a'→0，'b'→1），对应数组下标，方便计数。
//
//
//2. 初始化第一个窗口
//for (int i = 0; i < p_len; i++) {
//	p_count[p[i] - 'a']++;
//	s_count[s[i] - 'a']++;
//}
//先统计p的所有字符，再统计s中前p_len个字符（第一个窗口）；
//比如p = "abc"，p_count[0] = 1（a）、p_count[1] = 1（b）、p_count[2] = 1（c）。
//
//
//3. 滑动窗口的关键：固定长度
//for (int right = p_len; right < s_len; right++) {
//	s_count[s[right] - 'a']++; // 加右字符
//	int left = right - p_len;
//	s_count[s[left] - 'a']--; // 减左字符
//}
//窗口长度始终等于p_len：右指针每右移 1 位，左指针也右移 1 位；
//比如p_len = 3，right = 3 时，left = 0 → 窗口是[1, 3]；right = 4 时，left = 1 → 窗口是[2, 4]。
//
//4. 记录起始索引的细节
//res.push_back(left + 1);
//left 是 “刚移出窗口的左指针”，比如 right = 3（p_len = 3），left = 0 → 新窗口的起始索引是 1（left + 1）；
//第一个窗口的起始索引是 0，单独判断即可。


vector<int> findAnagrams(string s, string p) {
	vector<int> res;
	int s_len = s.size(), p_len = p.size();
	if (s_len < p_len) return res;

	vector<int> count(26, 0);
	int match = 0; // 匹配的字符数（count[i]==0表示该字符数量相等）

	// 初始化计数
	for (int i = 0; i < p_len; i++) {
		count[p[i] - 'a']++; // p的字符+1
		count[s[i] - 'a']--; // s的字符-1
	}

	// 统计初始匹配数
	for (int i = 0; i < 26; i++) {
		if (count[i] == 0) match++;
	}
	if (match == 26) res.push_back(0);

	// 滑动窗口
	for (int right = p_len; right < s_len; right++) {
		// 加入右字符
		int r = s[right] - 'a';
		count[r]--;
		if (count[r] == 0) match++;
		else if (count[r] == -1) match--;

		// 移出左字符
		int left = right - p_len;
		int l = s[left] - 'a';
		count[l]++;
		if (count[l] == 0) match++;
		else if (count[l] == 1) match--;

		// 所有字符匹配
		if (match == 26) res.push_back(left + 1);
	}

	return res;
}