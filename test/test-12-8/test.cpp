//#include<iostream>
//using namespace std;
//
//template<typename T>
//class Box {
//	T value;
//public:	
//	Box(T val) : value(val) {}
//	T getValue() const { return value; }
//	void setValue(T val) { value = val; }
//};
//template<typename T>	
//void displayBox(const Box<T>& box) {
//	cout << "Box contains: " << box.getValue() << endl;
//}
//	int main() {
//	Box<int> intBox(123);
//	displayBox(intBox);
//	
//	Box<string> strBox("Hello, World!");
//	displayBox(strBox);
//	
//	return 0;
//	}
//	

//合并两个有序数组
//给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
//
//请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
//
//注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。

//#include <iostream>
//#include <vector>
//using namespace std;
//class Solution {
//		
//	public:
//	void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
//		int i = m - 1; 
//		int j = n - 1; 
//		int k = m + n - 1; 
//		while (i >= 0 && j >= 0) {
//			if (nums1[i] > nums2[j]) {
//				nums1[k--] = nums1[i--];
//			} else {
//				nums1[k--] = nums2[j--];
//			}
//		}
//		while (j >= 0) {
//			nums1[k--] = nums2[j--];
//		}
//	}
//};
//int main() {
//	Solution solution;
//	vector<int> nums1 = {1, 2, 3, 0, 0, 0};
//	int m = 3;
//	vector<int> nums2 = {2, 5, 6};
//	int n = 3;
//	solution.merge(nums1, m, nums2, n);
//	cout << "Merged array: ";
//	for (int num : nums1) {
//		cout << num << " ";
//	}
//	cout << endl;
//	return 0;
//}
//
//		


//简单合并后排序
//class Solution {
//public:
//    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
//        for (int i = 0; i != n; ++i) {
//            nums1[m + i] = nums2[i];
//        }
//        sort(nums1.begin(), nums1.end());
//    }
//};




//从后往前合并
//void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
//    int i = nums1.size() - 1;
//    m--;
//    n--;
//    while (n >= 0) {
//        while (m >= 0 && nums1[m] > nums2[n]) {
//            swap(nums1[i--], nums1[m--]);
//        }
//        swap(nums1[i--], nums2[n--]);
//
//    };



//双指针从后往前合并
//class Solution {
//public:
//    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
//        int p1 = m - 1, p2 = n - 1;
//        int tail = m + n - 1;
//        int cur;
//        while (p1 >= 0 || p2 >= 0) {
//            if (p1 == -1) {
//                cur = nums2[p2--];
//            }
//            else if (p2 == -1) {
//                cur = nums1[p1--];
//            }
//            else if (nums1[p1] > nums2[p2]) {
//                cur = nums1[p1--];
//            }
//            else {
//                cur = nums2[p2--];
//            }
//            nums1[tail--] = cur;
//        }
//    }
//};


//双指针合并
//class Solution {
//public:
//    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
//        int p1 = 0, p2 = 0;
//        int sorted[m + n];
//        int cur;
//        while (p1 < m || p2 < n) {
//            if (p1 == m) {
//                cur = nums2[p2++];
//            }
//            else if (p2 == n) {
//                cur = nums1[p1++];
//            }
//            else if (nums1[p1] < nums2[p2]) {
//                cur = nums1[p1++];
//            }
//            else {
//                cur = nums2[p2++];
//            }
//            sorted[p1 + p2 - 1] = cur;
//        }
//        for (int i = 0; i != m + n; ++i) {
//            nums1[i] = sorted[i];
//        }
//    }
//};
//
//


//LRU缓存机制

/*设计和构建一个“最近最少使用”缓存，该缓存会删除最近最少使用的项目。缓存应该从键映射到值(允许你插入和检索特定键对应的值)，并在初始化时指定最大容量。当缓存被填满时，它应该删除最近最少使用的项目。

它应该支持以下操作： 获取数据 get 和 写入数据 put 。

获取数据 get(key) - 如果密钥 (key) 存在于缓存中，则获取密钥的值（总是正数），否则返回 -1。
写入数据 put(key, value) - 如果密钥不存在，则写入其数据值。当缓存容量达到上限时，它应该在写入新数据之前删除最近最少使用的数据值，从而为新的数据值留出空间。

示例：

LRUCache cache = new LRUCache( 2 /* 缓存容量 */ 

//cache.put(1, 1);
//cache.put(2, 2);
//cache.get(1);       // 返回  1
//cache.put(3, 3);    // 该操作会使得密钥 2 作废
//cache.get(2);       // 返回 -1 (未找到)
//cache.put(4, 4);    // 该操作会使得密钥 1 作废
//cache.get(1);       // 返回 -1 (未找到)
//cache.get(3);       // 返回  3
//cache.get(4);       // 返回  4



//#include <iostream>
//#include <unordered_map>
//using namespace std;
//class LRUCache {
//	struct DLinkedNode {
//		int key;
//		int value;
//		DLinkedNode* prev;
//		DLinkedNode* next;
//		DLinkedNode() : key(0), value(0), prev(nullptr), next(nullptr) {}
//		DLinkedNode(int _key, int _value) : key(_key), value(_value), prev(nullptr), next(nullptr) {}
//	};
//	unordered_map<int, DLinkedNode*> cache;
//	DLinkedNode* head;
//	DLinkedNode* tail;
//	int size;
//	int capacity;
//	void addToHead(DLinkedNode* node) {
//		node->prev = head;
//		node->next = head->next;
//		head->next->prev = node;
//		head->next = node;
//	}
//	void removeNode(DLinkedNode* node) {
//		node->prev->next = node->next;
//		node->next->prev = node->prev;
//	}
//	void moveToHead(DLinkedNode* node) {
//		removeNode(node);
//		addToHead(node);
//	}
//	DLinkedNode* removeTail() {
//		DLinkedNode* res = tail->prev;
//		removeNode(res);
//		return res;
//	}
//public:
//	LRUCache(int _capacity) : capacity(_capacity), size(0) {
//		head = new DLinkedNode();
//		tail = new DLinkedNode();
//		head->next = tail;
//		tail->prev = head;
//	}
//	int get(int key) {
//		if (!cache.count(key)) {
//			return -1;
//		}
//		DLinkedNode* node = cache[key];
//		moveToHead(node);
//		return node->value;
//	}
//	void put(int key, int value) {
//		if (!cache.count(key)) {
//			DLinkedNode* node = new DLinkedNode(key, value);
//			cache[key] = node;
//			addToHead(node);
//			++size;
//			if (size > capacity) {
//				DLinkedNode* tail = removeTail();
//				cache.erase(tail->key);
//				delete tail;
//				--size;
//			}
//		} else {
//			DLinkedNode* node = cache[key];
//			node->value = value;
//			moveToHead(node);
//		}
//	}
//};	
//int main() {
//	LRUCache cache(2); // 缓存容量为 2
//	cache.put(1, 1);
//	cache.put(2, 2);
//	cout << cache.get(1) << endl; // 返回 1
//	cache.put(3, 3); // 该操作会使得密钥 2 作废
//	cout << cache.get(2) << endl; // 返回 -1 (未找到)
//	cache.put(4, 4); // 该操作会使得密钥 1 作废
//	cout << cache.get(1) << endl; // 返回 -1 (未找到)
//	cout << cache.get(3) << endl; // 返回 3
//	cout << cache.get(4) << endl; // 返回 4
//	return 0;
//}


#include <unordered_map>

class Node {
public:
    int key, value;
    Node* prev, * next;

    Node(int k = 0, int v = 0) : key(k), value(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
private:
    int capacity;
    int sz;
    Node* dummy; // 哨兵节点（循环双向链表）
    std::unordered_map<int, Node*> key_to_node;

    // 从链表中删除一个节点（假设节点已在链表中）
    void remove(Node* x) {
        if (x == nullptr || x == dummy) return;
        x->prev->next = x->next;
        x->next->prev = x->prev;
        x->prev = x->next = nullptr;
    }

    // 在链表头添加一个节点（作为 MRU）
    void push_front(Node* x) {
        x->prev = dummy;
        x->next = dummy->next;
        dummy->next->prev = x;
        dummy->next = x;
    }

    // 查找并把节点移动到表头（用于 get）
    Node* get_node_and_move(int key) {
        auto it = key_to_node.find(key);
        if (it == key_to_node.end()) return nullptr;
        Node* node = it->second;
        remove(node);
        push_front(node);
        return node;
    }

public:
    LRUCache(int capacity) : capacity(capacity), sz(0), dummy(new Node()) {
        dummy->prev = dummy;
        dummy->next = dummy;
    }

    ~LRUCache() {
        // 释放链表上所有节点
        Node* cur = dummy->next;
        while (cur != dummy) {
            Node* nxt = cur->next;
            delete cur;
            cur = nxt;
        }
        delete dummy;
    }

    int get(int key) {
        Node* node = get_node_and_move(key);
        return node ? node->value : -1;
    }

    void put(int key, int value) {
        if (capacity <= 0) return;
        auto it = key_to_node.find(key);
        if (it != key_to_node.end()) {
            // 已存在：更新并移到表头
            Node* node = it->second;
            node->value = value;
            remove(node);
            push_front(node);
            return;
        }
        // 新节点
        Node* node = new Node(key, value);
        push_front(node);
        key_to_node[key] = node;
        ++sz;

        if (sz > capacity) {
            // 淘汰尾部（LRU）
            Node* back_node = dummy->prev;
            key_to_node.erase(back_node->key);
            remove(back_node);
            delete back_node;
            --sz;
        }
    }
};