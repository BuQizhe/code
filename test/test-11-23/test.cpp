3. 拷贝构造函数：对象的 “复制器”
作用：
用一个已存在的对象，创建一个新的同类型对象（比如 Person p2 = p1; ），默认版本是「浅拷贝」。
核心特性：
函数名与类名相同，参数是「const 类名& 」（必须是引用，否则会引发无限递归）；
若用户未显式定义，编译器生成「默认拷贝构造函数」；
隐含 this 指针，指向「新创建的对象」，参数指向「被拷贝的对象」。
关键：浅拷贝的坑与深拷贝的必要性
默认拷贝构造是 “浅拷贝”—— 仅复制成员变量的数值（比如指针变量复制的是地址，而非堆内存内容），可能导致「双重释放」：
cpp
运行
class Array {
private:
    int* _arr;
    int _size;
public:
    Array(int size) { _arr = new int[size]; _size = size; }
    ~Array() { delete[] _arr; } // 析构释放堆内存
};

int main() {
    Array arr1(5);
    Array arr2 = arr1; // 调用默认拷贝构造（浅拷贝）
    // arr1 和 arr2 的 _arr 指向同一块堆内存
    return 0; // 析构时：arr2 先释放 _arr，arr1 再释放时触发“双重释放”崩溃
}
解决：显式定义深拷贝构造
cpp
运行
// 深拷贝构造：为新对象分配独立的堆内存
Array(const Array& other) {
    _size = other._size;
    _arr = new int[_size]; // 新对象独立分配堆内存
    memcpy(_arr, other._arr, _size * sizeof(int)); // 复制内容（而非地址）
}
4. 赋值运算符重载：对象的 “赋值器”
作用：
两个已存在的对象之间赋值（比如 p2 = p1; ），默认版本是「浅拷贝」，与拷贝构造的区别是：拷贝构造是 “创建新对象”，赋值重载是 “修改已有对象”。
核心特性：
函数名是 operator=，返回值是「类名 & 」（支持链式赋值，比如 p3 = p2 = p1; ）；
参数是「const 类名& 」（避免拷贝，提高效率）；
若用户未显式定义，编译器生成「默认赋值运算符重载」；
隐含 this 指针，指向「被赋值的对象」（左边对象），参数指向「赋值的对象」（右边对象）。
示例（深拷贝版赋值重载）：
cpp
运行
Array& operator=(const Array& other) {
    // 1. 防止自赋值（比如 arr1 = arr1;）
    if (this == &other) {
        return *this; // 自赋值直接返回当前对象
    }

    // 2. 释放当前对象的旧资源
    delete[] _arr;

    // 3. 深拷贝：分配新资源，复制内容
    _size = other._size;
    _arr = new int[_size];
    memcpy(_arr, other._arr, _size * sizeof(int));

    // 4. 返回当前对象（支持链式赋值）
    return *this;
}

// 链式赋值使用
int main() {
    Array arr1(5), arr2(3), arr3(4);
    arr3 = arr2 = arr1; // 等价于 arr3.operator=(arr2.operator=(arr1))
    return 0;
}