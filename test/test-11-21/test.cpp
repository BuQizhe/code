//#include <iostream>
//#include <string>
//using namespace std;
//
//class Person {
//private:
//    string name;
//    int age;
//public:
//    // 成员函数：给对象赋值
//    void setInfo(string name, int age) {
//        // this->name：当前对象的 name 成员变量
//        // 右边的 name：函数参数（局部变量）
//        this->name = name;
//        this->age = age;
//    }
//
//    // 成员函数：打印当前对象的信息
//    void showInfo() {
//        // 等价于 cout << this->name << " " << this->age << endl;
//        cout << name << " " << age << endl;
//    }
//};
//
// 
// 
//int main() {
//    Person p1, p2;
//    p1.setInfo("Alice", 20); // this 指向 p1
//    p2.setInfo("Bob", 22);   // this 指向 p2
//
//    p1.showInfo(); // 输出 Alice 20（this 指向 p1）
//    p2.showInfo(); // 输出 Bob 22（this 指向 p2）
//    return 0;
//}



//void setAge(int age) {
//    this->age = age; // this->age 是成员变量，右边 age 是参数
//}



//class Person {
//private:
//    string name;
//    int age;
//public:
//    // 返回 Person&（对象引用），支持链式调用
//    Person& setAge(int age) {
//        this->age = age;
//        return *this; // 返回当前对象本身
//    }
//
//    Person& setName(string name) {
//        this->name = name;
//        return *this;
//    }
//};
//
//int main() {
//    Person p;
//    // 链式调用：连续调用成员函数
//    p.setAge(20).setName("Alice").showInfo(); // 输出 Alice 20
//    return 0;
//}



//class Calculator {
//public:
//    int add(int a, int b) {
//        return a + b;
//    }
//
//    // 重载 add 函数：三个参数
//    int add(int a, int b, int c) {
//        // 调用当前对象的 add(int, int) 版本
//        return this->add(a, b) + c;
//    }
//};
//
//int main() {
//    Calculator calc;
//    cout << calc.add(1, 2, 3) << endl; // 输出 6（1+2+3）
//    return 0;
//}



//int age = 100; // 全局变量
//
//class Person {
//private:
//    int age = 20; // 成员变量
//public:
//    void show() {
//        cout << age << endl;       // 成员变量（20）
//        cout << ::age << endl;     // 全局变量（100），:: 是作用域解析符
//        cout << this->age << endl; // 成员变量（20）
//    }
//};

//class Person {
//private:
//    int age; // 4 字节
//public:
//    void setAge(int age) { this->age = age; }
//};
//
//// sizeof(Person) = 4（仅成员变量 age 的大小，this 指针不占实例内存）
//cout << sizeof(Person) << endl;







//内存分布：
//
//1. 栈区（Stack）：系统自动管理的 “临时内存”
//核心特点：
//分配 / 回收：编译器自动完成（函数调用时分配栈帧，函数返回时释放），无需程序员干预；
//内存结构：栈是 “先进后出”（FILO）的连续内存空间，栈指针（esp 寄存器）控制栈的增长 / 收缩；
//大小限制：栈的默认大小较小（Windows 约 1 - 8MB，Linux 约 8MB），超出会触发 栈溢出（Stack Overflow）；
//存储内容：局部变量（非 static）、函数参数、函数返回地址、寄存器上下文（函数调用时保存）。
//
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

//栈溢出：
// 错误：局部数组占用 10MB 内存，超出栈默认大小，触发栈溢出
//void stackOverflow() {
//    char bigArr[1024 * 1024 * 10]; // 10MB，栈溢出崩溃
//}

//2. 堆区（Heap）：程序员手动管理的 “动态内存”
//核心特点：
//分配 / 回收：需手动调用 new / malloc 分配，delete / free 回收（C++ 推荐用 new / delete，会调用构造 / 析构函数）；
//内存结构：堆是不连续的内存空间（由操作系统的内存管理器管理），内存地址从低到高增长；
//大小限制：堆的大小远大于栈（接近物理内存上限），适合存储大块数据；
//存储内容：动态创建的对象、数组、自定义数据结构（如链表、树的节点）。
//
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
//
//

//3. 全局 / 静态存储区（Data + BSS）：程序生命周期的 “全局内存”
//核心特点：
//生命周期：从程序启动到程序结束（早于 main 函数初始化，晚于 main 函数销毁）；
//分区规则：
//Data 区（初始化数据区）：存放已初始化的全局变量、静态变量（static）、静态常量；
//BSS 区（未初始化数据区）：存放未初始化的全局变量、静态变量（程序启动时会自动初始化为 0）；
//存储内容：全局变量（global）、静态变量（static，包括全局静态和局部静态）。
//
//#include <iostream>
//using namespace std;
//
//// 全局变量：已初始化 → Data 区
//int globalInit = 10;
//// 全局变量：未初始化 → BSS 区
//int globalUnInit;
//
//int main() {
//    // 局部静态变量：已初始化 → Data 区
//    static int staticInit = 20;
//    // 局部静态变量：未初始化 → BSS 区
//    static int staticUnInit;
//
//    cout << "全局初始化变量 globalInit 地址：" << &globalInit << endl;
//    cout << "全局未初始化变量 globalUnInit 地址：" << &globalUnInit << endl;
//    cout << "局部静态初始化变量 staticInit 地址：" << &staticInit << endl;
//    cout << "局部静态未初始化变量 staticUnInit 地址：" << &staticUnInit << endl;
//
//    return 0;
//}

//4. 代码区（Text）：只读的 “指令内存”
//核心特点：
//存储内容：程序的机器指令（编译后的二进制代码）、字符串常量（const char* str = "hello" 中的 "hello"）；
//属性：只读（防止程序意外修改指令）、可共享（多个进程运行同一程序时，共享同一段代码区，节省内存）；
//生命周期：从程序启动到结束，与全局 / 静态存储区同时存在。
//
//#include <iostream>
//using namespace std;
//
//// 函数体存放在代码区
//void testFunc() {
//    cout << "函数 testFunc 地址（代码区）：" << (void*)testFunc << endl;
//}
//
//int main() {
//    // 字符串常量存放在代码区（只读）
//    const char* str = "hello world";
//    cout << "字符串常量地址（代码区）：" << (void*)str << endl;
//
//    testFunc();
//    cout << "主函数 main 地址（代码区）：" << (void*)main << endl;
//
//    return 0;
//}

// 错误：字符串常量存放在代码区（只读），修改会触发段错误（Segmentation Fault）
//int main() {
//    char* str = "hello"; // 编译器会警告：将 const char* 赋值给 char*
//    str[0] = 'H'; // 运行崩溃：修改只读内存
//    return 0;
//}

