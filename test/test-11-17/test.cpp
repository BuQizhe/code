//// F.h
//#include <iostream>
//using namespace std;
//inline void f(int i);
//
//// F.cpp
//#include "F.h"
//void f(int i)
//{
//	cout << i << endl;
//}
//
//// main.cpp
//#include "F.h"
//int main()
//{
//	f(10);
//	return 0;
//}
//
//// 链接错误：main.obj : error LNK2019: 无法解析的外部符号 "void __cdecl
////f(int)" (?f@@YAXH@Z)，该符号在函数 _main 中被引用


//// 类中既有成员变量，又有成员函数
//class A1 {
//public:
//	void f1() {}
//private:
//	int _a;
//};
//// 类中仅有成员函数
//class A2 {
//public:
//	void f2() {}
//};
//// 类中什么都没有---空类
//class A3
//{
//};

//#include <iostream>
//using namespace std;
//
//void testStack(int param) {
//    int local = 10; // 局部变量，存栈区
//    cout << "参数 param 地址：" << &param << endl;
//    cout << "局部变量 local 地址：" << &local << endl;
//}
//
//int main() {
//    int mainLocal = 20; // 主函数局部变量，存栈区
//    cout << "主函数局部变量 mainLocal 地址：" << &mainLocal << endl;
//    testStack(30);
//    return 0;
//}
//#include <iostream>
//using namespace std;
//
//int main() {
//    // 动态分配 int，存堆区
//    int* heapInt = new int(10);
//    // 动态分配数组，存堆区
//    int* heapArr = new int[5] {1, 2, 3, 4, 5};
//
//    cout << "堆区 int 地址：" << heapInt << endl;
//    cout << "堆区数组地址：" << heapArr << endl;
//
//    // 手动释放，避免内存泄漏
//    delete heapInt;
//    delete[] heapArr; // 数组必须用 delete[]
//
//    return 0;
//}

#include <iostream>
using namespace std;

// 函数体存放在代码区
void testFunc() {
    cout << "函数 testFunc 地址（代码区）：" << (void*)testFunc << endl;
}

int main() {
    // 字符串常量存放在代码区（只读）
    const char* str = "hello world";
    cout << "字符串常量地址（代码区）：" << (void*)str << endl;

    testFunc();
    cout << "主函数 main 地址（代码区）：" << (void*)main << endl;

    return 0;
}