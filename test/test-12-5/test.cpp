// 全局的operator==
class Date
{
public:
	Date(int year = 1900, int month = 1, int day = 1)
	{
		_year = year;
		_month = month;
		_day = day;
	}
	//private:运算符重载成全局时，需要成员变量变公有，方便使用
	int _year;
	int _month;
	int _day;
};

bool operator==(const Date& d1, const Date& d2)
{
	return d1._year == d2._year
		&& d1._month == d2._month
		&& d1._day == d2._day;
}


int main()
{
	Date d3(2024, 8, 28);
	Date d4(2024, 8, 29);

	//显示调用
	operator==(d3, d4);

	//直接写，转换调用，编译会转换成operator==(d3,d4);
	d3 == d4;

	return 0;
}

// 这里会发现运算符重载成全局的就需要成员变量是公有的,无法访问私有成员，该怎么才能提高一点封装性呢？
// 这里其实可以用我们有三种方法解决
//a.提供这些成员get和set
//b.或者干脆重载成成员函数（一般用这种解决）
//c.后面学习的友元解决
//但是三种方式封装性还有待提高


//class Date {
//public:
//	int _year, _month, _day;
//	Date(int y = 1900, int m = 1, int d = 1) : _year(y), _month(m), _day(d) {}
//
//	// 成员版 ==
//	bool operator==(const Date& d) const {
//		return _year == d._year && _month == d._month && _day == d._day;
//	}
//
//	// 成员版 <（按日期大小比较）
//	bool operator<(const Date& d) const {
//		if (_year != d._year) return _year < d._year;
//		if (_month != d._month) return _month < d._month;
//		return _day < d._day;
//	}
//};
//
//// 全局版 !=（基于 == 实现，需友元或 get 接口）
//bool operator!=(const Date& d1, const Date& d2) {
//	return !(d1 == d2);
//}
//
//class Date {
//public:
//	int _year, _month, _day;
//	Date(int y = 1900, int m = 1, int d = 1) : _year(y), _month(m), _day(d) {}
//
//	Date& operator=(const Date& d) {
//		if (this == &d) return *this; // 自赋值检测
//		_year = d._year;
//		_month = d._month;
//		_day = d._day;
//		return *this; // 支持 d1 = d2 = d3
//	}
//};
//
//// 全局版 Date + 天数（比如 d1 + 10 表示10天后的日期）
//Date operator+(const Date& d, int days) {
//	Date res = d;
//	// 简化逻辑：假设每月固定30天（实际需处理月份天数/闰年）
//	res._day += days;
//	while (res._day > 30) {
//		res._day -= 30;
//		res._month++;
//		if (res._month > 12) {
//			res._month -= 12;
//			res._year++;
//		}
//	}
//	return res;
//}
//
//// 成员版 自增（++d）
//Date& operator++() {
//	*this = *this + 1; // 复用 + 逻辑
//	return *this;
//}
//
//// 成员版 后置自增（d++）：用 int 占位符区分前置/后置
//Date operator++(int) {
//	Date temp = *this; // 先保存当前值
//	*this = *this + 1; // 再自增
//	return temp; // 返回旧值
//}
//
//Date& operator+=(int days) {
//	*this = *this + days; // 复用 + 逻辑
//	return *this;
//}


//1. 关系运算符（ == 、 != 、<、> 等）
//推荐：成员函数版（或全局 + 友元），返回 bool，参数 / 函数加 const（保证常量正确性）。
//cpp
//运行
class Date {
public:
    int _year, _month, _day;
    Date(int y = 1900, int m = 1, int d = 1) : _year(y), _month(m), _day(d) {}

    // 成员版 ==
    bool operator==(const Date& d) const {
        return _year == d._year && _month == d._month && _day == d._day;
    }

    // 成员版 <（按日期大小比较）
    bool operator<(const Date& d) const {
        if (_year != d._year) return _year < d._year;
        if (_month != d._month) return _month < d._month;
        return _day < d._day;
    }
};

// 全局版 !=（基于 == 实现，需友元或 get 接口）
bool operator!=(const Date& d1, const Date& d2) {
    return !(d1 == d2);
}

//2. 赋值运算符（ = ）
//强制：非静态成员函数，返回类引用（支持连续赋值），必须检测自赋值。
//cpp
//运行
class Date {
public:
    int _year, _month, _day;
    Date(int y = 1900, int m = 1, int d = 1) : _year(y), _month(m), _day(d) {}

    Date& operator=(const Date& d) {
        if (this == &d) return *this; // 自赋值检测
        _year = d._year;
        _month = d._month;
        _day = d._day;
        return *this; // 支持 d1 = d2 = d3
    }
};


//3. 算术运算符（ + 、 - 等）
//推荐：全局版（或成员版），返回新对象（不修改原对象），参数加 const。
//cpp
//运行
// 全局版 Date + 天数（比如 d1 + 10 表示10天后的日期）
Date operator+(const Date & d, int days) {
    Date res = d;
    // 简化逻辑：假设每月固定30天（实际需处理月份天数/闰年）
    res._day += days;
    while (res._day > 30) {
        res._day -= 30;
        res._month++;
        if (res._month > 12) {
            res._month -= 12;
            res._year++;
        }
    }
    return res;
}

// 成员版 自增（++d）
Date& operator++() {
    *this = *this + 1; // 复用 + 逻辑
    return *this;
}

// 成员版 后置自增（d++）：用 int 占位符区分前置/后置
Date operator++(int) {
    Date temp = *this; // 先保存当前值
    *this = *this + 1; // 再自增
    return temp; // 返回旧值
}

//4. 复合赋值运算符（ += 、 -= 等）
//推荐：成员函数版，返回类引用（支持连续赋值），修改自身对象。
//cpp
//运行

Date & operator+=(int days) {
    *this = *this + days; // 复用 + 逻辑
    return *this;
}

//5. 流运算符（ << 、 >> ）
//强制：全局函数 + 友元（因为左操作数是 ostream / istream，无法作为类成员的 this）。
//cpp
//运行
#include <iostream>
using namespace std;

class Date {
public:
    int _year, _month, _day;
    Date(int y = 1900, int m = 1, int d = 1) : _year(y), _month(m), _day(d) {}

    // 声明友元，让全局 << 能访问私有成员
    friend ostream& operator<<(ostream& out, const Date& d);
    friend istream& operator>>(istream& in, Date& d);
};

// 输出运算符 <<
ostream& operator<<(ostream& out, const Date& d) {
    out << d._year << "-" << d._month << "-" << d._day;
    return out; // 支持 cout << d1 << d2;
}

// 输入运算符 >>
istream& operator>>(istream& in, Date& d) {
    in >> d._year >> d._month >> d._day;
    return in; // 支持 cin >> d1 >> d2;
}

//6. 下标运算符（[]）
//强制：非静态成员函数，常用于数组 / 容器类，返回引用（支持读写）。
//cpp
//运行
class Array {
private:
    int _arr[10];
public:
    // 读写版 []
    int& operator[](int idx) {
        if (idx < 0 || idx >= 10) {
            cerr << "下标越界" << endl;
            exit(1);
        }
        return _arr[idx];
    }

    // 只读版 []（const 对象调用）
    const int& operator[](int idx) const {
        if (idx < 0 || idx >= 10) {
            cerr << "下标越界" << endl;
            exit(1);
        }
        return _arr[idx];
    }
};