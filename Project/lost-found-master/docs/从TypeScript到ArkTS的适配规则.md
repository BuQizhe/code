# ArkTS语法适配背景

ArkTS在保留TypeScript（简称TS）基本语法风格的基础上，进一步通过规范强化了静态检查和分析，使得在程序开发阶段能够检测出更多错误，提升程序的稳定性和运行性能。本文将详细解释为什么建议将TS代码适配为ArkTS代码。

## 程序稳定性

动态类型语言如JavaScript（简称JS）虽能提升开发效率，但也容易在运行时引发非预期错误。例如未检查的`undefined`值可能导致程序崩溃，这类问题若能在开发阶段发现将显著提升稳定性。TypeScript（TS）通过类型标注机制，使编译器能在编译时检测出多数类型错误，但其非强制类型系统仍存在局限。例如未标注类型的变量会阻碍完整编译检查。ArkTS通过强制静态类型系统克服这一缺陷，实施更严格的类型验证机制，从而最大限度减少运行时错误的发生。

下面这个例子展示了ArkTS通过强制严格的类型检查来提高代码稳定性和正确性。


**显式初始化类的属性**

ArkTS要求类的所有属性在声明时或者在构造函数中显式地初始化，这和TS中的`strictPropertyInitialization`检查一致。以下的代码片段是非严格模式下的TS代码。

```typescript
class Person {
  name: string // undefined
  
  setName(n: string): void {
    this.name = n
  }
  
  getName(): string {
  // 开发者使用"string"作为返回类型，这隐藏了name可能为"undefined"的事实。
  // 更合适的做法是将返回类型标注为"string | undefined"，以告诉开发者这个API所有可能的返回值的类型。
    return this.name
  }
}

let buddy = new Person()
// 假设代码中没有对name的赋值，例如没有调用"buddy.setName('John')"
buddy.getName().length; // 运行时异常：name is undefined
```

ArkTS要求属性显式初始化，代码应如下所示：

```typescript
class Person {
  name: string = ''
  
  setName(n: string): void {
    this.name = n
  }
  
  // 类型为"string"，不可能为"null"或者"undefined"
  getName(): string {
    return this.name
  }
}

let buddy = new Person()
// 假设代码中没有对name的赋值，例如没有调用"buddy.setName('John')"
buddy.getName().length; // 0, 没有运行时异常
```

如果`name`可以是`undefined`，其类型应在代码中精确标注。

```typescript
class Person {
    name?: string // 可能为undefined

    setName(n: string): void {
        this.name = n
    }

    // 编译时错误：name可能为"undefined"，所以不能将这个API的返回类型标注为"string"
    getNameWrong(): string {
        return this.name
    }

    getName(): string | undefined { // 返回类型匹配name的类型
        return this.name
    }
}

let buddy = new Person()
// 假设代码中没有对name的赋值，例如没有调用"buddy.setName('John')"

// 编译时错误：编译器认为下一行代码有可能访问"undefined"的属性，报错
buddy.getName().length;  // 编译失败

buddy.getName()?.length; // 编译成功，没有运行时错误
```

## 程序性能

为了确保程序的正确性，动态类型语言需要在运行时检查对象的类型。例如JavaScript不允许访问`undefined`的属性。检查一个值是否为`undefined`的唯一方法是在运行时进行类型检查。所有JavaScript引擎都会执行以下操作：如果一个值不是`undefined`，则可以访问其属性；否则，抛出异常。虽然现代JavaScript引擎可以优化这类操作，但仍然存在一些无法消除的运行时检查，这会导致程序变慢。由于TypeScript代码总是先被编译成JavaScript代码，因此在TypeScript中也会遇到相同的问题。ArkTS解决了这个问题。通过启用静态类型检查，ArkTS代码将被编译成方舟字节码文件，而不是JavaScript代码。因此，ArkTS运行速度更快，更容易被进一步优化。


**Null Safety**

```typescript
function notify(who: string, what: string) {
  console.log(`Dear ${who}, a message for you: ${what}`)
}

notify('Jack', 'You look great today')
```

在大多数情况下，函数`notify`会接受两个`string`类型的变量作为输入，产生一个新的字符串。但是，如果将一些特殊值作为输入，例如`notify(null, undefined)`，情况会怎么样呢？
程序仍会正常运行，输出预期值：`Dear null, a message for you: undefined`。一切看起来正常，但是请注意，为了保证该场景下程序的正确性，引擎总是在运行时进行类型检查，执行类似以下的伪代码。

```typescript
function __internal_tostring(s: any): string {
  if (typeof s === 'string')
    return s
  if (s === undefined)
    return 'undefined'
  if (s === null)
    return 'null'
  // ...
}
```

现在想象一下，如果函数`notify`是某些复杂的负载场景中的一部分，而不仅仅是打印日志，那么在运行时执行像`__internal_tostring`的类型检查将会是一个性能问题。

如果可以保证在运行时，只有`string`类型的值（不会是其他值，例如`null`或者`undefined`）可以被传入函数`notify`呢？在这种情况下，因为可以确保没有其他边界情况，像`__internal_tostring`的检查就是多余的了。对于这个场景，这样的机制叫做“null-safety”，也就是说，保证`null`或`undefined`不是一个合法的`string`类型变量的值。如果ArkTS有了这个特性，类型不符合的代码将无法编译。

```typescript
function notify(who: string, what: string) {
  console.log(`Dear ${who}, a message for you: ${what}`)
}

notify('Jack', 'You look great today')
notify(null, undefined) // 编译时错误
```

TS通过启用编译选项`strictNullChecks`实现此特性。虽然TS被编译成JS，但因为JS没有这个特性，所以严格`null`检查仅在编译时起效。从程序稳定性和性能的角度考虑，ArkTS将“null-safety”视为一个重要的特性。因此，ArkTS强制进行严格`null`检查，在ArkTS中上述代码将始终编译失败。作为交换，此类代码为ArkTS引擎提供了更多信息和关于值的类型保证，有助于优化性能。


## .ets代码兼容性

在API version 10之前，ArkTS（.ets文件）完全采用了标准TS的语法。从API version 10 Release起，明确定义ArkTS的语法规则，同时，SDK增加了在编译流程中对.ets文件的ArkTS语法检查，通过编译告警或编译失败提示开发者适配新的ArkTS语法。

根据工程的compatibleSdkVersion，具体策略如下：

  - compatibleSdkVersion >= 10 为标准模式。在该模式下，对.ets文件，违反ArkTS语法规则的代码会导致工程编译失败，需要完全适配ArkTS语法后方可编译成功。
  - compatibleSdkVersion < 10 为兼容模式。在该模式下，对.ets文件以warning形式提示违反ArkTS语法规则的所有代码。尽管违反ArkTS语法规则的工程在兼容模式下仍可编译成功，但需完全适配ArkTS语法后方可在标准模式下编译成功。

## 支持与TS/JS的交互

ArkTS支持与TS/JS的高效互操作。在当前版本中，ArkTS运行时兼容动态类型对象语义。在与TS/JS交互时，将TS/JS的数据和对象作为ArkTS的数据和对象使用，可能会绕过ArkTS的静态编译检查，导致非预期的行为或增加额外的开销。

```typescript
// lib.ts
export class C {
  v: string
}

export let c = new C()

// app.ets
import { C, c } from './lib'

function foo(c: C) {
  c.v.length
}

foo(c)  //  运行时异常：v is undefined
```

## 方舟运行时兼容TS/JS

在API version 11上，OpenHarmony SDK中的TypeScript版本为4.9.5，target字段为es2017。应用中支持使用ECMA2017及更高版本的语法进行TS/JS开发。

**应用环境限制**

1. 强制使用严格模式（use strict）
2. 禁止使用`eval()`
3. 禁止使用`with() {}`
4. 禁止以字符串为代码创建函数
5. 禁止循环依赖

    循环依赖示例:
    ```typescript
    // bar.ets
    import {v} from './foo' // bar.ets依赖foo.ets
    export let u = 0;

    // foo.ets
    import {u} from './bar' // foo.ets同时又依赖bar.ets
    export let v = 0;

    //应用加载失败
    ```

**与标准TS/JS的差异**

在标准的TS/JS中，JSON的数字格式要求小数点后必须跟随数字，例如 `2.e3` 这类科学计数法不被允许，会导致`SyntaxError`。而在方舟运行时中，支持这类科学计数法


# 从TypeScript到ArkTS的适配规则

ArkTS规范约束了TypeScript（简称TS）中影响开发正确性或增加运行时开销的特性。本文罗列了ArkTS中限制的TS特性，并提供重构代码的建议。ArkTS保留了TS大部分语法特性，未在本文中约束的TS特性，ArkTS完全支持。例如，ArkTS支持自定义装饰器，语法与TS一致。按本文约束进行代码重构后，代码仍为合法有效的TS代码。

**示例**

包含关键字`var`的原始TypeScript代码：

```typescript
function addTen(x: number): number {
  var ten = 10;
  return x + ten;
}
```

重构后的代码：

```typescript
function addTen(x: number): number {
  let ten = 10;
  return x + ten;
}
```

**级别**

约束分为两个级别：错误、警告。

- **错误**: 必须要遵从的约束。如果不遵从该约束，将会导致程序编译失败。 
- **警告**: 推荐遵从的约束。尽管现在违反该约束不会影响编译流程，但是在将来，违反该约束可能将会导致程序编译失败。

**不支持的特性**

目前，不支持的特性主要包括：

- 与降低运行时性能的动态类型相关的特性。
- 需要编译器额外支持从而导致项目构建时间增加的特性。

根据开发者的反馈和实际场景的数据，将来会进一步减少不支持的特性。

## 概述

本节罗列了ArkTS不支持或部分支持的TypeScript特性。完整的列表以及详细的代码示例和重构建议，请参考[约束说明](#约束说明)。更多案例请参考[适配指导案例](arkts-more-cases.md)。

### 强制使用静态类型

静态类型是ArkTS的重要特性之一。当程序使用静态类型时，所有类型在编译时已知，这有助于开发者理解代码中的数据结构。编译器可以提前验证代码的正确性，减少运行时的类型检查，从而提升性能。

基于上述考虑，ArkTS中禁止使用`any`类型。

**示例**

```typescript
// 不支持：
let res: any = some_api_function('hello', 'world');
// `res`是什么？错误代码的数字？字符串？对象？
// 该如何处理它？
// 支持：
class CallResult {
  public succeeded(): boolean { ... }
  public errorMessage(): string { ... }
}

let res: CallResult = some_api_function('hello', 'world');
if (!res.succeeded()) {
  console.log('Call failed: ' + res.errorMessage());
}
```

`any`类型在TypeScript中并不常见，仅约1%的TypeScript代码库使用。代码检查工具（例如ESLint）也制定了一系列规则来禁止使用`any`。因此，虽然禁止`any`将导致代码重构，但重构量很小，有助于整体性能提升。

### 禁止在运行时变更对象布局

为实现最佳性能，ArkTS要求在程序执行期间不能更改对象的布局。换句话说，ArkTS禁止以下行为：

- 向对象中添加新的属性或方法。
- 从对象中删除已有的属性或方法。
- 将任意类型的值赋值给对象属性。

TypeScript编译器已经禁止了许多此类操作。然而，有些操作还是有可能绕过编译器的，例如，使用`as any`转换对象的类型，或者在编译TS代码时关闭严格类型检查的配置，或者在代码中通过`@ts-ignore`忽略类型检查。

在ArkTS中，严格类型检查不是可配置项。ArkTS强制进行部分严格类型检查，并通过规范禁止使用`any`类型，禁止在代码中使用`@ts-ignore`。

**示例**

```typescript
class Point {
  public x: number = 0
  public y: number = 0

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// 无法从对象中删除某个属性，从而确保所有Point对象都具有属性x
let p1 = new Point(1.0, 1.0);
delete p1.x;           // 在TypeScript和ArkTS中，都会产生编译时错误
delete (p1 as any).x;  // 在TypeScript中不会报错；在ArkTS中会产生编译时错误

// Point类没有定义命名为z的属性，在程序运行时也无法添加该属性
let p2 = new Point(2.0, 2.0);
p2.z = 'Label';           // 在TypeScript和ArkTS中，都会产生编译时错误
(p2 as any).z = 'Label';   // 在TypeScript中不会报错；在ArkTS中会产生编译时错误

// 类的定义确保了所有Point对象只有属性x和y，并且无法被添加其他属性
let p3 = new Point(3.0, 3.0);
let prop = Symbol();      // 在TypeScript中不会报错；在ArkTS中会产生编译时错误
(p3 as any)[prop] = p3.x; // 在TypeScript中不会报错；在ArkTS中会产生编译时错误
p3[prop] = p3.x;          // 在TypeScript和ArkTS中，都会产生编译时错误

// 类的定义确保了所有Point对象的属性x和y都具有number类型，因此，无法将其他类型的值赋值给它们
let p4 = new Point(4.0, 4.0);
p4.x = 'Hello!';          // 在TypeScript和ArkTS中，都会产生编译时错误
(p4 as any).x = 'Hello!'; // 在TypeScript中不会报错；在ArkTS中会产生编译时错误

// 使用符合类定义的Point对象：
function distance(p1: Point, p2: Point): number {
  return Math.sqrt(
    (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y)
  );
}
let p5 = new Point(5.0, 5.0);
let p6 = new Point(6.0, 6.0);
console.log('Distance between p5 and p6: ' + distance(p5, p6));
```

修改对象布局会影响代码可读性和运行时性能。定义类后，在其他地方修改对象布局，容易引起困惑乃至引入错误。此外，还需要额外的运行时支持，增加执行开销。这与静态类型约束冲突：使用显式类型时，不应添加或删除属性。

当前，只有少数项目允许在运行时变更对象布局，一些常用的代码检查工具也增加了相应的限制规则。这个约束只会导致少量代码重构，但会提升性能。

### 限制运算符的语义

为获得更好的性能并鼓励开发者编写更清晰的代码，ArkTS限制了一些运算符的语义。详细的语义限制，请参考[约束说明](#约束说明)。

**示例**

```typescript
// 一元运算符`+`只能作用于数值类型：
let t = +42;   // 合法运算
let s = +'42'; // 编译时错误
```

使用额外的语义重载语言运算符会增加语言规范的复杂度，而且，开发者还被迫牢记所有可能的例外情况及对应的处理规则。在特定情况下，这会导致不必要的运行时开销。

当前只有不到1%的代码库使用该特性。因此，尽管限制运算符的语义需要重构代码，但重构量很小且非常容易操作，并且，通过重构能使代码更清晰、具备更高性能。

### 不支持 structural typing

假设两个不相关的类`T`和`U`拥有相同的`public`API：

```typescript
class T {
  public name: string = ''

  public greet(): void {
    console.log('Hello, ' + this.name);
  }
}

class U {
  public name: string = ''

  public greet(): void {
    console.log('Greetings, ' + this.name);
  }
}
```

类型为`T`的值是否能赋给类型为`U`的变量。

```typescript
let u: U = new T(); // 是否允许？
```

类型为`T`的值是否能传递给接受类型为`U`的参数的函数。

```typescript
function greeter(u: U) {
  console.log('To ' + u.name);
  u.greet();
}

let t: T = new T();
greeter(t); // 是否允许？
```

具体采用哪种方法，情况如下：

- `T`和`U`没有继承关系或没有`implements`相同的接口，但由于它们具有相同的`public`API，它们“在某种程度上是相等的”，所以上述两个问题的答案都是“是”。
- `T`和`U`没有继承关系或没有`implements`相同的接口，应当始终被视为完全不同的类型，因此上述两个问题的答案都是“否”。

采用第一种方法的语言支持structural typing，而采用第二种方法的语言则不支持structural typing。目前TypeScript支持structural typing，而ArkTS不支持。

关于structural typing是否有助于生成清晰、易理解的代码，目前尚未有定论。ArkTS不支持structural typing的原因如下：

因为对structural typing的支持是一个重大的特性，需要在语言规范、编译器和运行时进行大量的考虑和仔细的实现。另外，由于ArkTS使用静态类型，运行时为了支持这个特性需要额外的性能开销。

鉴于此，当前我们还不支持该特性。根据实际场景的需求和反馈，我们后续会重新加以考虑。更多案例和建议请参考[约束说明](#约束说明)。

## 约束说明

### 对象的属性名必须是合法的标识符

**规则：**`arkts-identifiers-as-prop-names`

**级别：错误**

**错误码：10605001**

在ArkTS中，对象的属性名不能为数字或字符串。例外：ArkTS支持属性名为字符串字面量和枚举中的字符串值。通过属性名访问类的属性，通过数值索引访问数组元素。

**TypeScript**

```typescript
var x = { 'name': 'x', 2: '3' };

console.log(x['name']); // x
console.log(x[2]); // 3
```

**ArkTS**

```typescript
class X {
  public name: string = ''
}
let x: X = { name: 'x' };
console.log(x.name); // x

let y = ['a', 'b', 'c'];
console.log(y[2]); // c

// 在需要通过非标识符（即不同类型的key）获取数据的场景中，使用Map<Object, some_type>。
let z = new Map<Object, string>();
z.set('name', '1');
z.set(2, '2');
console.log(z.get('name'));  // 1
console.log(z.get(2)); // 2

enum Test {
  A = 'aaa',
  B = 'bbb'
}

let obj: Record<string, number> = {
  [Test.A]: 1,   // 枚举中的字符串值
  [Test.B]: 2,   // 枚举中的字符串值
  ['value']: 3   // 字符串字面量
}
```

### 不支持`Symbol()`API

**规则：**`arkts-no-symbol`

**级别：错误**

**错误码：10605002**

在ArkTS中，对象布局在编译时确定，不可在运行时更改，因此不支持`Symbol()`API。该API在静态类型语言中通常没有实际意义。

ArkTS只支持`Symbol.iterator`。

### 不支持以`#`开头的私有字段

**规则：**`arkts-no-private-identifiers`

**级别：错误**

**错误码：10605003**

ArkTS不支持使用`#`符号开头声明的私有字段。改用`private`关键字。

**TypeScript**

```typescript
class C {
  #foo: number = 42
}
```

**ArkTS**

```typescript
class C {
  private foo: number = 42
}
```

### 类型、命名空间的命名必须唯一

**规则：**`arkts-unique-names`

**级别：错误**

**错误码：10605004**

类型（类、接口、枚举）和命名空间的名称必须唯一，并且不能与其他名称（如变量名、函数名）重复。

**TypeScript**

```typescript
let X: string
type X = number[] // 类型的别名与变量同名
```

**ArkTS**

```typescript
let X: string
type T = number[] // 为避免名称冲突，此处不允许使用X
```

### 使用`let`而非`var`

**规则：**`arkts-no-var`

**级别：错误**

**错误码：10605005**

`let`关键字可以在块级作用域中声明变量，帮助程序员避免错误。因此，ArkTS不支持`var`，请使用`let`声明变量。

**TypeScript**

```typescript
function f(shouldInitialize: boolean) {
  if (shouldInitialize) {
     var x = 'b';
  }
  return x;
}

console.log(f(true));  // b
console.log(f(false)); // undefined

let upperLet = 0;
{
  var scopedVar = 0;
  let scopedLet = 0;
  upperLet = 5;
}
scopedVar = 5; // 可见
scopedLet = 5; // 编译时错误
```

**ArkTS**

```typescript
function f(shouldInitialize: boolean): string {
  let x: string = 'a';
  if (shouldInitialize) {
    x = 'b';
  }
  return x;
}

console.log(f(true));  // b
console.log(f(false)); // a

let upperLet = 0;
let scopedVar = 0;
{
  let scopedLet = 0;
  upperLet = 5;
}
scopedVar = 5;
scopedLet = 5; //编译时错误
```

### 使用具体的类型而非`any`或`unknown`

**规则：**`arkts-no-any-unknown`

**级别：错误**

**错误码：10605008**

ArkTS不支持`any`和`unknown`类型。显式指定具体类型。

**TypeScript**

```typescript
let value1: any
value1 = true;
value1 = 42;

let value2: unknown
value2 = true;
value2 = 42;
```

**ArkTS**

```typescript
let value_b: boolean = true; // 或者 let value_b = true
let value_n: number = 42; // 或者 let value_n = 42
let value_o1: Object = true;
let value_o2: Object = 42;
```

### 使用`class`而非具有call signature的类型

**规则：**`arkts-no-call-signatures`

**级别：错误**

**错误码：10605014**

ArkTS不支持对象类型中包含call signature。

**TypeScript**

```typescript
type DescribableFunction = {
  description: string
  (someArg: string): string // call signature
}

function doSomething(fn: DescribableFunction): void {
  console.log(fn.description + ' returned ' + fn(''));
}
```

**ArkTS**

```typescript
class DescribableFunction {
  description: string
  public invoke(someArg: string): string {
    return someArg;
  }
  constructor() {
    this.description = 'desc';
  }
}

function doSomething(fn: DescribableFunction): void {
  console.log(fn.description + ' returned ' + fn.invoke(''));
}

doSomething(new DescribableFunction());
```

### 使用`class`而非具有构造签名的类型

**规则：**`arkts-no-ctor-signatures-type`

**级别：错误**

**错误码：10605015**

ArkTS不支持对象类型中的构造签名。改用类。

**TypeScript**

```typescript
class SomeObject {}

type SomeConstructor = {
  new (s: string): SomeObject
}

function fn(ctor: SomeConstructor) {
  return new ctor('hello');
}
```

**ArkTS**

```typescript
class SomeObject {
  public f: string
  constructor (s: string) {
    this.f = s;
  }
}

function fn(s: string): SomeObject {
  return new SomeObject(s);
}
```

### 仅支持一个静态块

**规则：**`arkts-no-multiple-static-blocks`

**级别：错误**

**错误码：10605016**

ArkTS不允许类中有多个静态块，如果存在多个静态块语句，请合并到一个静态块中。

**TypeScript**

```typescript
class C {
  static s: string

  static {
    C.s = 'aa'
  }
  static {
    C.s = C.s + 'bb'
  }
}
```

**ArkTS**

```typescript
class C {
  static s: string

  static {
    C.s = 'aa'
    C.s = C.s + 'bb'
  }
}
```

**说明**

当前不支持静态块的语法。支持该语法后，在.ets文件中使用静态块需遵循此约束。

### 不支持index signature

**规则：**`arkts-no-indexed-signatures`

**级别：错误**

**错误码：10605017**

ArkTS不允许index signature，改用数组。

**TypeScript**

```typescript
// 带index signature的接口：
interface StringArray {
  [index: number]: string
}

function getStringArray(): StringArray {
  return ['a', 'b', 'c'];
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
```

**ArkTS**

```typescript
class X {
  public f: string[] = []
}

let myArray: X = new X();
const secondItem = myArray.f[1];
```

### 使用继承而非intersection type

**规则：**`arkts-no-intersection-types`

**级别：错误**

**错误码：10605019**

目前ArkTS不支持intersection type，可以使用继承作为替代方案。

**TypeScript**

```typescript
interface Identity {
  id: number
  name: string
}

interface Contact {
  email: string
  phoneNumber: string
}

type Employee = Identity & Contact
```

**ArkTS**

```typescript
interface Identity {
  id: number
  name: string
}

interface Contact {
  email: string
  phoneNumber: string
}

interface Employee extends Identity,  Contact {}
```

### 不支持`this`类型

**规则：**`arkts-no-typing-with-this`

**级别：错误**

**错误码：10605021**

ArkTS不支持`this`类型，改用显式具体类型。

**TypeScript**

```typescript
interface ListItem {
  getHead(): this
}

class C {
  n: number = 0

  m(c: this) {
    // ...
  }
}
```

**ArkTS**

```typescript
interface ListItem {
  getHead(): ListItem
}

class C {
  n: number = 0

  m(c: C) {
    // ...
  }
}
```

### 不支持条件类型

**规则：**`arkts-no-conditional-types`

**级别：错误**

**错误码：10605022**

ArkTS不支持条件类型别名，建议引入带显式约束的新类型，或使用`Object`进行逻辑重构。
不支持`infer`关键字。

**TypeScript**

```typescript
type X<T> = T extends number ? T: never
type Y<T> = T extends Array<infer Item> ? Item: never
```

**ArkTS**

```typescript
// 在类型别名中提供显式约束
type X1<T extends number> = T

// 用Object重写，类型控制较少，需要更多的类型检查以确保安全
type X2<T> = Object

// Item必须作为泛型参数使用，并能正确实例化
type YI<Item, T extends Array<Item>> = Item
```

### 不支持在`constructor`中声明字段

**规则：**`arkts-no-ctor-prop-decls`

**级别：错误**

**错误码：10605025**

ArkTS不支持在`constructor`中声明类字段。在`class`中声明这些字段。

**TypeScript**

```typescript
class Person {
  constructor(
    protected ssn: string,
    private firstName: string,
    private lastName: string
  ) {
    this.ssn = ssn;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}
```

**ArkTS**

```typescript
class Person {
  protected ssn: string
  private firstName: string
  private lastName: string

  constructor(ssn: string, firstName: string, lastName: string) {
    this.ssn = ssn;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}
```

### 接口中不支持构造签名

**规则：**`arkts-no-ctor-signatures-iface`

**级别：错误**

**错误码：10605027**

ArkTS不支持在接口中使用构造签名。建议使用函数或方法。

**TypeScript**

```typescript
interface I {
  new (s: string): I
}

function fn(i: I) {
  return new i('hello');
}
```

**ArkTS**

```typescript
interface I {
  create(s: string): I
}

function fn(i: I) {
  return i.create('hello');
}
```

### 不支持索引访问类型

**规则：**`arkts-no-aliases-by-index`

**级别：错误**

**错误码：10605028**

ArkTS不支持索引访问类型。

### 不支持通过索引访问字段

**规则：**`arkts-no-props-by-index`

**级别：错误**

**错误码：10605029**

ArkTS不支持动态声明字段，不支持动态访问字段。只能访问已在类中声明或者继承可见的字段，访问其他字段将会造成编译时错误。
使用点操作符访问字段，例如（`obj.field`），不支持索引访问（`obj[field]`）。
ArkTS支持通过索引访问`TypedArray`（例如`Int32Array`）中的元素。

**TypeScript**

```typescript
class Point {
  x: string = ''
  y: string = ''
}
let p: Point = {x: '1', y: '2'};
console.log(p['x']); // 1

class Person {
  name: string = ''
  age: number = 0;
  [key: string]: string | number
}

let person: Person = {
  name: 'John',
  age: 30,
  email: '***@example.com',
  phoneNumber: '18*********',
}
```

**ArkTS**

```typescript
class Point {
  x: string = ''
  y: string = ''
}
let p: Point = {x: '1', y: '2'};
console.log(p.x); // 1

class Person {
  name: string
  age: number
  email: string
  phoneNumber: string

  constructor(name: string, age: number, email: string,
        phoneNumber: string) {
    this.name = name;
    this.age = age;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }
}

let person = new Person('John', 30, '***@example.com', '18*********');
console.log(person['name']);     // 编译时错误
console.log(person.unknownProperty); // 编译时错误

let arr = new Int32Array(1);
arr[0];
```

### 不支持structural typing

**规则：**`arkts-no-structural-typing`

**级别：错误**

**错误码：10605030**

ArkTS不支持structural typing，编译器无法比较两种类型的`public`API并决定它们是否相同。使用其他机制，例如继承、接口或类型别名。

**TypeScript**

```typescript
interface I1 {
  f(): string
}

interface I2 { // I2等价于I1
  f(): string
}

class X {
  n: number = 0
  s: string = ''
}

class Y { // Y等价于X
  n: number = 0
  s: string = ''
}

let x = new X();
let y = new Y();

// 将X对象赋值给Y对象
y = x;

// 将Y对象赋值给X对象
x = y;

function foo(x: X) {
  console.log(x.n + x.s);
}

// 由于X和Y的API是等价的，所以X和Y是等价的
foo(new X());
foo(new Y());
```

**ArkTS**

```typescript
interface I1 {
  f(): string
}

type I2 = I1 // I2是I1的别名

class B {
  n: number = 0
  s: string = ''
}

// D是B的继承类，构建了子类型和父类型的关系
class D extends B {
  constructor() {
    super()
  }
}

let b = new B();
let d = new D();

console.log('Assign D to B');
b = d; // 合法赋值，因为B是D的父类

// 将b赋值给d将会引起编译时错误
// d = b

interface Z {
   n: number
   s: string
}

// 类X implements 接口Z，构建了X和Y的关系
class X implements Z {
  n: number = 0
  s: string = ''
}

// 类Y implements 接口Z，构建了X和Y的关系
class Y implements Z {
  n: number = 0
  s: string = ''
}

let x: Z = new X();
let y: Z = new Y();

console.log('Assign X to Y');
y = x // 合法赋值，它们是相同的类型

console.log('Assign Y to X');
x = y // 合法赋值，它们是相同的类型

function foo(c: Z): void {
  console.log(c.n + c.s);
}

// 类X和类Y implement 相同的接口，因此下面的两个函数调用都是合法的
foo(new X());
foo(new Y());
```

### 需要显式标注泛型函数类型实参

**规则：**`arkts-no-inferred-generic-params`

**级别：错误**

**错误码：10605034**

如果可以从传递给泛型函数的参数中推断出具体类型，ArkTS允许省略泛型类型实参。否则，省略泛型类型实参会发生编译时错误。
禁止仅基于泛型函数返回类型推断泛型类型参数。

**TypeScript**

```typescript
function choose<T>(x: T, y: T): T {
  return Math.random() < 0.5 ? x: y;
}

let x = choose(10, 20);   // 推断choose<number>(...)
let y = choose('10', 20); // 编译时错误

function greet<T>(): T {
  return 'Hello' as T;
}
let z = greet() // T的类型被推断为“unknown”
```

**ArkTS**

```typescript
function choose<T>(x: T, y: T): T {
  return Math.random() < 0.5 ? x: y;
}

let x = choose(10, 20);   // 推断choose<number>(...)
let y = choose('10', 20); // 编译时错误

function greet<T>(): T {
  return 'Hello' as T;
}
let z = greet<string>();
```

### 需要显式标注对象字面量的类型

**规则：**`arkts-no-untyped-obj-literals`

**级别：错误**

**错误码：10605038**

在ArkTS中，需要显式标注对象字面量的类型，否则，将发生编译时错误。在某些场景下，编译器可以根据上下文推断出字面量的类型。

在以下上下文中不支持使用字面量初始化类和接口：

* 初始化具有`any`、`Object`或`object`类型的任何对象
* 初始化带有方法的类或接口
* 初始化包含自定义含参数的构造函数的类
* 初始化带`readonly`字段的类

**例子1**

**TypeScript**

```typescript
let o1 = {n: 42, s: 'foo'};
let o2: Object = {n: 42, s: 'foo'};
let o3: object = {n: 42, s: 'foo'};

let oo: Object[] = [{n: 1, s: '1'}, {n: 2, s: '2'}];
```

**ArkTS**

```typescript
class C1 {
  n: number = 0
  s: string = ''
}

let o1: C1 = {n: 42, s: 'foo'};
let o2: C1 = {n: 42, s: 'foo'};
let o3: C1 = {n: 42, s: 'foo'};

let oo: C1[] = [{n: 1, s: '1'}, {n: 2, s: '2'}];
```

**例子2**

**TypeScript**

```typescript
class C2 {
  s: string
  constructor(s: string) {
    this.s = 's =' + s;
  }
}
let o4: C2 = {s: 'foo'};
```

**ArkTS**

```typescript
class C2 {
  s: string
  constructor(s: string) {
    this.s = 's =' + s;
  }
}
let o4 = new C2('foo');
```

**例子3**

**TypeScript**

```typescript
class C3 {
  readonly n: number = 0
  readonly s: string = ''
}
let o5: C3 = {n: 42, s: 'foo'};
```

**ArkTS**

```typescript
class C3 {
  n: number = 0
  s: string = ''
}
let o5: C3 = {n: 42, s: 'foo'};
```

**例子4**

**TypeScript**

```typescript
abstract class A {}
let o6: A = {};
```

**ArkTS**

```typescript
abstract class A {}
class C extends A {}
let o6: C = {}; // 或 let o6: C = new C()
```

**例子5**

**TypeScript**

```typescript
class C4 {
  n: number = 0
  s: string = ''
  f() {
    console.log('Hello');
  }
}
let o7: C4 = {n: 42, s: 'foo', f: () => {}};
```

**ArkTS**

```typescript
class C4 {
  n: number = 0
  s: string = ''
  f() {
    console.log('Hello');
  }
}
let o7 = new C4();
o7.n = 42;
o7.s = 'foo';
```

**例子6**

**TypeScript**

```typescript
class Point {
  x: number = 0
  y: number = 0
}

function getPoint(o: Point): Point {
  return o;
}

// TS支持structural typing，可以推断p的类型为Point
let p = {x: 5, y: 10};
getPoint(p);

// 可通过上下文推断出对象字面量的类型为Point
getPoint({x: 5, y: 10});
```

**ArkTS**

```typescript
class Point {
  x: number = 0
  y: number = 0

  // 在字面量初始化之前，使用constructor()创建一个有效对象。
  // 由于没有为Point定义构造函数，编译器将自动添加一个默认构造函数。
}

function getPoint(o: Point): Point {
  return o;
}

// 字面量初始化需要显式定义类型
let p: Point = {x: 5, y: 10};
getPoint(p);

// getPoint接受Point类型，字面量初始化生成一个Point的新实例
getPoint({x: 5, y: 10});
```

### 对象字面量不能用于类型声明

**规则：**`arkts-no-obj-literals-as-types`

**级别：错误**

**错误码：10605040**

ArkTS不支持使用对象字面量声明类型，可以使用类或者接口声明类型。

**TypeScript**

```typescript
let o: {x: number, y: number} = {
  x: 2,
  y: 3
}

type S = Set<{x: number, y: number}>
```

**ArkTS**

```typescript
class O {
  x: number = 0
  y: number = 0
}

let o: O = {x: 2, y: 3};

type S = Set<O>
```

### 数组字面量必须仅包含可推断类型的元素

**规则：**`arkts-no-noninferrable-arr-literals`

**级别：错误**

**错误码：10605043**

ArkTS将数组字面量的类型推断为所有元素的联合类型。如果其中任何一个元素的类型无法推导，则编译时会发生错误。

**TypeScript**

```typescript
let a = [{n: 1, s: '1'}, {n: 2, s: '2'}];
```

**ArkTS**

```typescript
class C {
  n: number = 0
  s: string = ''
}

let a1 = [{n: 1, s: '1'} as C, {n: 2, s: '2'} as C]; // a1的类型为“C[]”
let a2: C[] = [{n: 1, s: '1'}, {n: 2, s: '2'}];    // a2的类型为“C[]”
```

### 使用箭头函数而非函数表达式

**规则：**`arkts-no-func-expressions`

**级别：错误**

**错误码：10605046**

ArkTS不支持函数表达式，使用箭头函数。

**TypeScript**

```typescript
let f = function (s: string) {
  console.log(s);
}
```

**ArkTS**

```typescript
let f = (s: string) => {
  console.log(s);
}
```

### 不支持使用类表达式

**规则：**`arkts-no-class-literals`

**级别：错误**

**错误码：10605050**

ArkTS不支持类表达式，必须显式声明一个类。

**TypeScript**

```typescript
const Rectangle = class {
  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }

  height
  width
}

const rectangle = new Rectangle(0.0, 0.0);
```

**ArkTS**

```typescript
class Rectangle {
  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }

  height: number
  width: number
}

const rectangle = new Rectangle(0.0, 0.0);
```

### 类不允许`implements`

**规则：**`arkts-implements-only-iface`

**级别：错误**

**错误码：10605051**

ArkTS不允许类被`implements`，只有接口可以被`implements`。

**TypeScript**

```typescript
class C {
  foo() {}
}

class C1 implements C {
  foo() {}
}
```

**ArkTS**

```typescript
interface C {
  foo(): void
}

class C1 implements C {
  foo() {}
}
```

### 不支持修改对象的方法

**规则：**`arkts-no-method-reassignment`

**级别：错误**

**错误码：10605052**

ArkTS不支持修改对象的方法。在静态语言中，对象布局固定，类的所有实例共享同一个方法。
若需为特定对象添加方法，可封装函数或采用继承机制。

**TypeScript**

```typescript
class C {
  foo() {
    console.log('foo');
  }
}

function bar() {
  console.log('bar');
}

let c1 = new C();
let c2 = new C();
c2.foo = bar;

c1.foo(); // foo
c2.foo(); // bar
```

**ArkTS**

```typescript
class C {
  foo() {
    console.log('foo');
  }
}

class Derived extends C {
  foo() {
    console.log('Extra');
    super.foo();
  }
}

function bar() {
  console.log('bar');
}

let c1 = new C();
let c2 = new C();
c1.foo(); // foo
c2.foo(); // foo

let c3 = new Derived();
c3.foo(); // Extra foo
```

### 类型转换仅支持`as T`语法

**规则：**`arkts-as-casts`

**级别：错误**

**错误码：10605053**

在ArkTS中，`as`关键字是类型转换的唯一语法，错误的类型转换会导致编译时错误或者运行时抛出`ClassCastException`异常。ArkTS不支持使用`<type>`语法进行类型转换。

需要将`primitive`类型（如`number`或`boolean`）转换为引用类型时，请使用`new`表达式。

**TypeScript**

```typescript
class Shape {}
class Circle extends Shape { x: number = 5 }
class Square extends Shape { y: string = 'a' }

function createShape(): Shape {
  return new Circle();
}

let c1 = <Circle> createShape();

let c2 = createShape() as Circle;

// 如果转换错误，不会产生编译时或运行时报错
let c3 = createShape() as Square;
console.log(c3.y); // undefined

// 在TS中，由于`as`关键字不会在运行时生效，所以`instanceof`的左操作数不会在运行时被装箱成引用类型
let e1 = (5.0 as Number) instanceof Number; // false

// 创建Number对象，获得预期结果：
let e2 = (new Number(5.0)) instanceof Number; // true
```

**ArkTS**

```typescript
class Shape {}
class Circle extends Shape { x: number = 5 }
class Square extends Shape { y: string = 'a' }

function createShape(): Shape {
  return new Circle();
}

let c2 = createShape() as Circle;

// 运行时抛出ClassCastException异常：
let c3 = createShape() as Square;

// 创建Number对象，获得预期结果：
let e2 = (new Number(5.0)) instanceof Number; // true
```

### 不支持JSX表达式

**规则：**`arkts-no-jsx`

**级别：错误**

**错误码：10605054**

不支持使用JSX。

### 一元运算符`+`、`-`和`~`仅适用于数值类型

**规则：**`arkts-no-polymorphic-unops`

**级别：错误**

**错误码：10605055**

ArkTS仅允许一元运算符用于数值类型，否则会导致编译时错误。与TypeScript不同，ArkTS不支持隐式字符串到数值的转换，必须进行显式转换。

**TypeScript**

```typescript
let a = +5;    // 5（number类型）
let b = +'5';    // 5（number类型）
let c = -5;    // -5（number类型）
let d = -'5';    // -5（number类型）
let e = ~5;    // -6（number类型）
let f = ~'5';    // -6（number类型）
let g = +'string'; // NaN（number类型）

function returnTen(): string {
  return '-10';
}

function returnString(): string {
  return 'string';
}

let x = +returnTen();  // -10（number类型）
let y = +returnString(); // NaN
```

**ArkTS**

```typescript
let a = +5;    // 5（number类型）
let b = +'5';    // 编译时错误
let c = -5;    // -5（number类型）
let d = -'5';    // 编译时错误
let e = ~5;    // -6（number类型）
let f = ~'5';    // 编译时错误
let g = +'string'; // 编译时错误

function returnTen(): string {
  return '-10';
}

function returnString(): string {
  return 'string';
}

let x = +returnTen();  // 编译时错误
let y = +returnString(); // 编译时错误
```

### 不支持`delete`运算符

**规则：**`arkts-no-delete`

**级别：错误**

**错误码：10605059**

在ArkTS中，对象布局在编译时确定，运行时不可更改。因此，删除属性的操作没有意义。

**TypeScript**

```typescript
class Point {
  x?: number = 0.0
  y?: number = 0.0
}

let p = new Point();
delete p.y;
```

**ArkTS**

```typescript
// 可以声明一个可空类型并使用null作为缺省值
class Point {
  x: number | null = 0
  y: number | null = 0
}

let p = new Point();
p.y = null;
```

### 仅允许在表达式中使用`typeof`运算符

**规则：**`arkts-no-type-query`

**级别：错误**

**错误码：10605060**

ArkTS仅支持在表达式中使用`typeof`运算符，不允许使用`typeof`作为类型。

**TypeScript**

```typescript
let n1 = 42;
let s1 = 'foo';
console.log(typeof n1); // 'number'
console.log(typeof s1); // 'string'
let n2: typeof n1
let s2: typeof s1
```

**ArkTS**

```typescript
let n1 = 42;
let s1 = 'foo';
console.log(typeof n1); // 'number'
console.log(typeof s1); // 'string'
let n2: number
let s2: string
```

### 部分支持`instanceof`运算符

**规则：**`arkts-instanceof-ref-types`

**级别：错误**

**错误码：10605065**

TypeScript中，`instanceof`运算符的左操作数类型必须为`any`类型、对象类型或类型参数，否则结果为`false`。ArkTS中，`instanceof`运算符的左操作数类型必须为引用类型（如对象、数组或函数），否则会发生编译时错误。此外，左操作数必须是对象实例。

### 不支持`in`运算符

**规则：**`arkts-no-in`

**级别：错误**

**错误码：10605066**

在ArkTS中，对象布局在编译时已知且运行时无法修改，因此不支持`in`运算符。需要检查类成员是否存在时，使用`instanceof`代替。

**TypeScript**

```typescript
class Person {
  name: string = ''
}
let p = new Person();

let b = 'name' in p; // true
```

**ArkTS**

```typescript
class Person {
  name: string = ''
}
let p = new Person();

let b = p instanceof Person; // true，且属性name一定存在
```

### 不支持解构赋值

**规则：**`arkts-no-destruct-assignment`

**级别：错误**

**错误码：10605069**

ArkTS不支持解构赋值。可使用其他替代方法，例如，使用临时变量。

**TypeScript**

```typescript
let [one, two] = [1, 2]; // 此处需要分号
[one, two] = [two, one];

let head, tail
[head, ...tail] = [1, 2, 3, 4];
```

**ArkTS**

```typescript
let arr: number[] = [1, 2];
let one = arr[0];
let two = arr[1];

let tmp = one;
one = two;
two = tmp;

let data: Number[] = [1, 2, 3, 4];
let head = data[0];
let tail: Number[] = [];
for (let i = 1; i < data.length; ++i) {
  tail.push(data[i]);
}
```

### 逗号运算符`,`仅用在`for`循环语句中

**规则：**`arkts-no-comma-outside-loops`

**级别：错误**

**错误码：10605071**

在ArkTS中，逗号运算符仅适用于`for`循环语句，用于明确执行顺序。
>**注意：** 这与声明变量和函数参数传递时使用的逗号分隔符不同。

**TypeScript**

```typescript
for (let i = 0, j = 0; i < 10; ++i, j += 2) {
  // ...
}

let x = 0;
x = (++x, x++); // 1
```

**ArkTS**

```typescript
for (let i = 0, j = 0; i < 10; ++i, j += 2) {
  // ...
}

// 通过语句表示执行顺序，而非逗号运算符
let x = 0;
++x;
x = x++;
```

### 不支持解构变量声明

**规则：**`arkts-no-destruct-decls`

**级别：错误**

**错误码：10605074**

ArkTS不支持解构变量声明。解构变量声明是一个依赖于结构兼容性的动态特性，且解构声明中的名称必须与被解构对象中的属性名称一致。

**TypeScript**

```typescript
class Point {
  x: number = 0.0
  y: number = 0.0
}

function returnZeroPoint(): Point {
  return new Point();
}

let {x, y} = returnZeroPoint();
```

**ArkTS**

```typescript
class Point {
  x: number = 0.0
  y: number = 0.0
}

function returnZeroPoint(): Point {
  return new Point();
}

// 创建一个局部变量来处理每个字段
let zp = returnZeroPoint();
let x = zp.x;
let y = zp.y;
```

### 不支持在catch语句标注类型

**规则：**`arkts-no-types-in-catch`

**级别：错误**

**错误码：10605079**

TypeScript的catch语句中，只能标注`any`或`unknown`类型。ArkTS不支持这些类型，应省略类型标注。

**TypeScript**

```typescript
try {
  // ...
} catch (a: unknown) {
  // 处理异常
}
```

**ArkTS**

```typescript
try {
  // ...
} catch (a) {
  // 处理异常
}
```

### 不支持`for .. in`

**规则：**`arkts-no-for-in`

**级别：错误**

**错误码：10605080**

由于在ArkTS中，对象布局在编译时是确定的并且在运行时无法修改，因此不支持使用`for .. in`迭代一个对象的属性。

**TypeScript**

```typescript
let a: string[] = ['1.0', '2.0', '3.0'];
for (let i in a) {
  console.log(a[i]);
}
```

**ArkTS**

```typescript
let a: string[] = ['1.0', '2.0', '3.0'];
for (let i = 0; i < a.length; ++i) {
  console.log(a[i]);
}
```

### 不支持映射类型

**规则：**`arkts-no-mapped-types`

**级别：错误**

**错误码：10605083**

ArkTS不支持映射类型，使用其他语法来表示相同的语义。

**TypeScript**

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean
}
```

**ArkTS**

```typescript
class C {
  n: number = 0
  s: string = ''
}

class CFlags {
  n: boolean = false
  s: boolean = false
}
```

### 不支持`with`语句

**规则：**`arkts-no-with`

**级别：错误**

**错误码：10605084**

ArkTS不支持`with`语句，使用其他语法来表示相同的语义。

**TypeScript**

```typescript
with (Math) { // 编译时错误, 但是仍能生成JavaScript代码
  let r: number = 42;
  let area: number = PI * r * r;
}
```

**ArkTS**

```typescript
let r: number = 42;
let area: number = Math.PI * r * r;
```

### 限制`throw`语句中表达式的类型

**规则：**`arkts-limited-throw`

**级别：错误**

**错误码：10605087**

ArkTS只支持抛出`Error`类或其派生类的实例。禁止抛出其他类型的数据，例如`number`或`string`。

**TypeScript**

```typescript
throw 4;
throw '';
throw new Error();
```

**ArkTS**

```typescript
throw new Error();
```

### 限制省略函数返回类型标注

**规则：**`arkts-no-implicit-return-types`

**级别：错误**

**错误码：10605090**

ArkTS在部分场景中支持对函数返回类型进行推断。当`return`语句中的表达式是对某个函数或方法进行调用，且该函数或方法的返回类型没有被显著标注时，会出现编译时错误。在这种情况下，请标注函数返回类型。

**TypeScript**

```typescript
// 只有在开启noImplicitAny选项时会产生编译时错误
function f(x: number) {
  if (x <= 0) {
    return x;
  }
  return g(x);
}

// 只有在开启noImplicitAny选项时会产生编译时错误
function g(x: number) {
  return f(x - 1);
}

function doOperation(x: number, y: number) {
  return x + y;
}

f(10);
doOperation(2, 3);
```

**ArkTS**

```typescript
// 需标注返回类型：
function f(x: number): number {
  if (x <= 0) {
    return x;
  }
  return g(x);
}

// 可以省略返回类型，返回类型可以从f的类型标注推导得到
function g(x: number): number {
  return f(x - 1);
}

// 可以省略返回类型
function doOperation(x: number, y: number) {
  return x + y;
}

f(10);
doOperation(2, 3);
```

### 不支持参数解构的函数声明

**规则：**`arkts-no-destruct-params`

**级别：错误**

**错误码：10605091**

ArkTS要求实参必须直接传递给函数，且必须指定到形参。

**TypeScript**

```typescript
function drawText({ text = '', location: [x, y] = [0, 0], bold = false }) {
  text;
  x;
  y;
  bold;
}

drawText({ text: 'Hello, world!', location: [100, 50], bold: true });
```

**ArkTS**

```typescript
function drawText(text: String, location: number[], bold: boolean) {
  let x = location[0];
  let y = location[1];
  text;
  x;
  y;
  bold;
}

function main() {
  drawText('Hello, world!', [100, 50], true);
}
```

### 不支持在函数内声明函数

**规则：**`arkts-no-nested-funcs`

**级别：错误**

**错误码：10605092**

ArkTS不支持在函数内声明函数，改用lambda函数。

**TypeScript**

```typescript
function addNum(a: number, b: number): void {

  // 函数内声明函数
  function logToConsole(message: string): void {
    console.log(message);
  }

  let result = a + b;

  // 调用函数
  logToConsole('result is ' + result);
}
```

**ArkTS**

```typescript
function addNum(a: number, b: number): void {
  // 使用lambda函数代替声明函数
  let logToConsole: (message: string) => void = (message: string): void => {
    console.log(message);
  }

  let result = a + b;

  logToConsole('result is ' + result);
}
```

### 不支持在函数和类的静态方法中使用`this`

**规则：**`arkts-no-standalone-this`

**级别：错误**

**错误码：10605093**

ArkTS中`this`只能在类的实例方法中使用，不支持在函数和类的静态方法中使用。

**TypeScript**

```typescript
function foo(i: string) {
  this.count = i; // 只有在开启noImplicitThis选项时会产生编译时错误
}

class A {
  count: string = 'a'
  m = foo
}

let a = new A();
console.log(a.count); // 打印a
a.m('b');
console.log(a.count); // 打印b
```

**ArkTS**

```typescript
class A {
  count: string = 'a'
  m(i: string): void {
    this.count = i;
  }
}

function main(): void {
  let a = new A();
  console.log(a.count);  // 打印a
  a.m('b');
  console.log(a.count);  // 打印b
}
```

### 不支持生成器函数

**规则：**`arkts-no-generators`

**级别：错误**

**错误码：10605094**

目前ArkTS不支持生成器函数，可使用`async`或`await`机制处理并行任务。

**TypeScript**

```typescript
function* counter(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for (let num of counter(1, 5)) {
  console.log(num);
}
```

**ArkTS**

```typescript
async function complexNumberProcessing(num: number): Promise<number> {
  // ...
  return num;
}

async function foo() {
  for (let i = 1; i <= 5; i++) {
    await complexNumberProcessing(i);
  }
}

foo()
```

### 使用`instanceof`和`as`进行类型保护

**规则：**`arkts-no-is`

**级别：错误**

**错误码：10605096**

ArkTS不支持`is`运算符，必须用`instanceof`运算符替代。在使用之前，必须使用`as`运算符将对象转换为需要的类型。

**TypeScript**

```typescript
class Foo {
  foo: string = ''
  common: string = ''
}

class Bar {
  bar: string = ''
  common: string = ''
}

function isFoo(arg: any): arg is Foo {
  return arg.foo !== undefined;
}

function doStuff(arg: Foo | Bar) {
  if (isFoo(arg)) {
    console.log(arg.foo);  // OK
    console.log(arg.bar);  // 编译时错误
  } else {
    console.log(arg.foo);  // 编译时错误
    console.log(arg.bar);  // OK
  }
}

doStuff({ foo: 123, common: '123' });
doStuff({ bar: 123, common: '123' });
```

**ArkTS**

```typescript
class Foo {
  foo: string = ''
  common: string = ''
}

class Bar {
  bar: string = ''
  common: string = ''
}

function isFoo(arg: Object): boolean {
  return arg instanceof Foo;
}

function doStuff(arg: Object): void {
  if (isFoo(arg)) {
    let fooArg = arg as Foo;
    console.log(fooArg.foo);   // OK
    console.log(arg.bar);    // 编译时错误
  } else {
    let barArg = arg as Bar;
    console.log(arg.foo);    // 编译时错误
    console.log(barArg.bar);   // OK
  }
}

function main(): void {
  doStuff(new Foo());
  doStuff(new Bar());
}
```

### 部分支持展开运算符

**规则：**`arkts-no-spread`

**级别：错误**

**错误码：10605099**

ArkTS仅支持使用展开运算符展开数组、`Array`的子类和`TypedArray`（例如`Int32Array`）。仅支持使用在以下场景中：
1. 传递给剩余参数时；
2. 复制一个数组到数组字面量。

**TypeScript**

```typescript
function foo(x: number, y: number, z: number) {
  // ...
}

let args: [number, number, number] = [0, 1, 2];
foo(...args);
```

**ArkTS**

```typescript
function log_numbers(x: number, y: number, z: number) {
  // ...
}

let numbers: number[] = [1, 2, 3];
log_numbers(numbers[0], numbers[1], numbers[2]);
```

**TypeScript**

```typescript
let point2d = { x: 1, y: 2 };
let point3d = { ...point2d, z: 3 };
```

**ArkTS**

```typescript
class Point2D {
  x: number = 0; y: number = 0
}

class Point3D {
  x: number = 0; y: number = 0; z: number = 0
  constructor(p2d: Point2D, z: number) {
    this.x = p2d.x;
    this.y = p2d.y;
    this.z = z;
  }
}

let p3d = new Point3D({ x: 1, y: 2 } as Point2D, 3);

class DerivedFromArray extends Uint16Array {};

let arr1 = [1, 2, 3];
let arr2 = new Uint16Array([4, 5, 6]);
let arr3 = new DerivedFromArray([7, 8, 9]);
let arr4 = [...arr1, 10, ...arr2, 11, ...arr3];
```

### 接口不能继承具有相同方法的两个接口

**规则：**`arkts-no-extend-same-prop`

**级别：错误**

**错误码：106050102**

在TypeScript中，如果一个接口继承了两个具有相同方法的接口，则必须使用联合类型声明该方法的返回值类型。在ArkTS中，由于接口不能包含两个无法区分的方法（如参数列表相同但返回类型不同），因此不能继承具有相同方法的两个接口。

**TypeScript**

```typescript
interface Mover {
  getStatus(): { speed: number }
}
interface Shaker {
  getStatus(): { frequency: number }
}

interface MoverShaker extends Mover, Shaker {
  getStatus(): {
    speed: number
    frequency: number
  }
}

class C implements MoverShaker {
  private speed: number = 0
  private frequency: number = 0

  getStatus() {
    return { speed: this.speed, frequency: this.frequency };
  }
}
```

**ArkTS**

```typescript
class MoveStatus {
  public speed: number
  constructor() {
    this.speed = 0;
  }
}
interface Mover {
  getMoveStatus(): MoveStatus
}

class ShakeStatus {
  public frequency: number
  constructor() {
    this.frequency = 0;
  }
}
interface Shaker {
  getShakeStatus(): ShakeStatus
}

class MoveAndShakeStatus {
  public speed: number
  public frequency: number
  constructor() {
    this.speed = 0;
    this.frequency = 0;
  }
}

class C implements Mover, Shaker {
  private move_status: MoveStatus
  private shake_status: ShakeStatus

  constructor() {
    this.move_status = new MoveStatus();
    this.shake_status = new ShakeStatus();
  }

  public getMoveStatus(): MoveStatus {
    return this.move_status;
  }

  public getShakeStatus(): ShakeStatus {
    return this.shake_status;
  }

  public getStatus(): MoveAndShakeStatus {
    return {
      speed: this.move_status.speed,
      frequency: this.shake_status.frequency
    };
  }
}
```

### 不支持声明合并

**规则：**`arkts-no-decl-merging`

**级别：错误**

**错误码：10605103**

ArkTS不支持类和接口的声明合并。

**TypeScript**

```typescript
interface Document {
  createElement(tagName: any): Element
}

interface Document {
  createElement(tagName: string): HTMLElement
}

interface Document {
  createElement(tagName: number): HTMLDivElement
  createElement(tagName: boolean): HTMLSpanElement
  createElement(tagName: string, value: number): HTMLCanvasElement
}
```

**ArkTS**

```typescript
interface Document {
  createElement(tagName: number): HTMLDivElement
  createElement(tagName: boolean): HTMLSpanElement
  createElement(tagName: string, value: number): HTMLCanvasElement
  createElement(tagName: string): HTMLElement
  createElement(tagName: Object): Element
}
```

### 接口不能继承类

**规则：**`arkts-extends-only-class`

**级别：错误**

**错误码：10605104**

ArkTS中，接口不能继承类，只能继承其他接口。

**TypeScript**

```typescript
class Control {
  state: number = 0
}

interface SelectableControl extends Control {
  select(): void
}
```

**ArkTS**

```typescript
interface Control {
  state: number
}

interface SelectableControl extends Control {
  select(): void
}
```

### 不支持构造函数类型

**规则：**`arkts-no-ctor-signatures-funcs`

**级别：错误**

**错误码：10605106**

ArkTS不支持构造函数类型，改用lambda函数。

**TypeScript**

```typescript
class Person {
  constructor(
    name: string,
    age: number
  ) {}
}
type PersonCtor = new (name: string, age: number) => Person

function createPerson(Ctor: PersonCtor, name: string, age: number): Person
{
  return new Ctor(name, age);
}

const person = createPerson(Person, 'John', 30);
```

**ArkTS**

```typescript
class Person {
  constructor(
    name: string,
    age: number
  ) {}
}
type PersonCtor = (n: string, a: number) => Person

function createPerson(Ctor: PersonCtor, n: string, a: number): Person {
  return Ctor(n, a);
}

let Impersonizer: PersonCtor = (n: string, a: number): Person => {
  return new Person(n, a);
}

const person = createPerson(Impersonizer, 'John', 30);
```

### 只能使用类型相同的编译时表达式初始化枚举成员

**规则：**`arkts-no-enum-mixed-types`

**级别：错误**

**错误码：10605111**

ArkTS不支持使用运行期间计算的表达式初始化枚举成员。枚举中所有显式初始化的成员必须具有相同类型。

**TypeScript**

```typescript
enum E1 {
  A = 0xa,
  B = 0xb,
  C = Math.random(),
  D = 0xd,
  E // 推断出0xe
}

enum E2 {
  A = 0xa,
  B = '0xb',
  C = 0xc,
  D = '0xd'
}
```

**ArkTS**

```typescript
enum E1 {
  A = 0xa,
  B = 0xb,
  C = 0xc,
  D = 0xd,
  E // 推断出0xe
}

enum E2 {
  A = '0xa',
  B = '0xb',
  C = '0xc',
  D = '0xd'
}
```

### 不支持`enum`声明合并

**规则：**`arkts-no-enum-merging`

**级别：错误**

**错误码：10605113**

ArkTS不支持`enum`声明合并。

**TypeScript**

```typescript
enum ColorSet {
  RED,
  GREEN
}
enum ColorSet {
  YELLOW = 2
}
enum ColorSet {
  BLACK = 3,
  BLUE
}
```

**ArkTS**

```typescript
enum ColorSet {
  RED,
  GREEN,
  YELLOW,
  BLACK,
  BLUE
}
```

### 命名空间不能被用作对象

**规则：**`arkts-no-ns-as-obj`

**级别：错误**

**错误码：10605114**

ArkTS不支持将命名空间用作对象，可以使用类或模块。

**TypeScript**

```typescript
namespace MyNamespace {
  export let x: number
}

let m = MyNamespace;
m.x = 2;
```

**ArkTS**

```typescript
namespace MyNamespace {
  export let x: number
}

MyNamespace.x = 2;
```

### 不支持命名空间中的非声明语句

**规则：**`arkts-no-ns-statements`

**级别：错误**

**错误码：10605116**

在ArkTS中，命名空间用于定义标识符的可见范围，仅在编译时有效。因此，命名空间中不支持非声明语句。可以将非声明语句写在函数中。

**TypeScript**

```typescript
namespace A {
  export let x: number
  x = 1;
}
```

**ArkTS**

```typescript
namespace A {
  export let x: number

  export function init() {
    x = 1;
  }
}

// 调用初始化函数来执行
A.init();
```

### 不支持`require`和`import`赋值表达式

**规则：**`arkts-no-require`

**级别：错误**

**错误码：10605121**

ArkTS不支持通过`require`导入和`import`赋值表达式，改用`import`。

**TypeScript**

```typescript
import m = require('mod')
```

**ArkTS**

```typescript
import * as m from 'mod'
```

### 不支持`export = ...`语法

**规则：**`arkts-no-export-assignment`

**级别：错误**

**错误码：10605126**

ArkTS不支持`export = ...`语法，改用常规的`export`或`import`。

**TypeScript**

```typescript
// module1
export = Point

class Point {
  constructor(x: number, y: number) {}
  static origin = new Point(0, 0)
}

// module2
import Pt = require('module1')

let p = Pt.Point.origin;
```

**ArkTS**

```typescript
// module1
export class Point {
  constructor(x: number, y: number) {}
  static origin = new Point(0, 0)
}

// module2
import * as Pt from 'module1'

let p = Pt.Point.origin
```

### 不支持ambient module声明

**规则：**`arkts-no-ambient-decls`

**级别：错误**

**错误码：10605128**

由于ArkTS本身有与JavaScript交互的机制，ArkTS不支持ambient module声明。

**TypeScript**

```typescript
declare module 'someModule' {
  export function normalize(s: string): string;
}
```

**ArkTS**

```typescript
// 从原始模块中导入需要的内容
import { normalize } from 'someModule'
```

### 不支持在模块名中使用通配符

**规则：**`arkts-no-module-wildcards`

**级别：错误**

**错误码：10605129**

在ArkTS中，导入是编译时而非运行时行为，不支持在模块名中使用通配符。

**TypeScript**

```typescript
// 声明
declare module '*!text' {
  const content: string
  export default content
}

// 使用代码
import fileContent from 'some.txt!text'
```

**ArkTS**

```typescript
// 声明
declare namespace N {
  function foo(x: number): number
}

// 使用代码
import * as m from 'module'
console.log('N.foo called: ' + N.foo(42));
```

### 不支持通用模块定义(UMD)

**规则：**`arkts-no-umd`

**级别：错误**

**错误码：10605130**

ArkTS不支持通用模块定义（UMD）。因为在ArkTS中没有“脚本”的概念（相对于“模块”）。此外，在ArkTS中，导入是编译时而非运行时特性。改用`export`和`import`语法。

**TypeScript**

```typescript
// math-lib.d.ts
export const isPrime(x: number): boolean
export as namespace mathLib

// 脚本中
mathLib.isPrime(2)
```

**ArkTS**

```typescript
// math-lib.d.ts
namespace mathLib {
  export isPrime(x: number): boolean
}

// 程序中
import { mathLib } from 'math-lib'
mathLib.isPrime(2)
```

### 不支持`new.target`

**规则：**`arkts-no-new-target`

**级别：错误**

**错误码：10605132**

ArkTS没有原型的概念，因此不支持`new.target`。此特性不符合静态类型的原则。

### 不支持确定赋值断言

**规则：**`arkts-no-definite-assignment`

**级别：警告**

**错误码：10605134**

ArkTS不支持确定赋值断言，例如：`let v!: T`。改为在声明变量的同时为变量赋值。

**TypeScript**

```typescript
let x!: number // 提示：在使用前将x初始化

initialize();

function initialize() {
  x = 10;
}

console.log('x = ' + x);
```

**ArkTS**

```typescript
function initialize(): number {
  return 10;
}

let x: number = initialize();

console.log('x = ' + x);
```

### 不支持在原型上赋值

**规则：**`arkts-no-prototype-assignment`

**级别：错误**

**错误码：10605136**

ArkTS没有原型的概念，因此不支持在原型上赋值。此特性不符合静态类型的原则。

**TypeScript**

```typescript
let C = function(p) {
  this.p = p; // 只有在开启noImplicitThis选项时会产生编译时错误
}

C.prototype = {
  m() {
    console.log(this.p);
  }
}

C.prototype.q = function(r: string) {
  return this.p == r;
}
```

**ArkTS**

```typescript
class C {
  p: string = ''
  m() {
    console.log(this.p);
  }
  q(r: string) {
    return this.p == r;
  }
}
```

### 不支持`globalThis`

**规则：**`arkts-no-globalthis`

**级别：警告**

**错误码：10605137**

由于ArkTS不支持动态更改对象的布局，因此不支持全局作用域和`globalThis`。

**TypeScript**

```typescript
// 全局文件中
var abc = 100;

// 从上面引用'abc'
let x = globalThis.abc;
```

**ArkTS**

```typescript
// file1
export let abc: number = 100;

// file2
import * as M from 'file1'

let x = M.abc;
```

### 不支持一些utility类型

**规则：**`arkts-no-utility-types`

**级别：错误**

**错误码：10605138**

ArkTS仅支持`Partial`、`Required`、`Readonly`和`Record`，不支持TypeScript中其他的`Utility Types`。

对于`Partial<T>`类型，泛型参数T必须为类或者接口类型。

对于`Record`类型的对象，通过索引访问到的值的类型是包含`undefined`的联合类型。

### 不支持对函数声明属性

**规则：**`arkts-no-func-props`

**级别：错误**

**错误码：10605139**

由于ArkTS不支持动态改变函数对象布局，因此，不支持对函数声明属性。

### 不支持`Function.apply`和`Function.call`

**规则：**`arkts-no-func-apply-call`

**级别：错误**

**错误码：10605152**

ArkTS不允许使用标准库函数`Function.apply`和`Function.call`。这些函数用于显式设置被调用函数的`this`参数。在ArkTS中，`this`的语义仅限于传统的OOP风格，函数体中禁止使用`this`。

### 不支持`Function.bind`

**规则：**`arkts-no-func-bind`

**级别：警告**

**错误码：10605140**

ArkTS禁用标准库函数`Function.bind`。标准库使用这些函数显式设置被调用函数的`this`参数。在ArkTS中，`this`仅限于传统OOP风格，函数体中禁用使用`this`。


### 不支持`as const`断言

**规则：**`arkts-no-as-const`

**级别：错误**

**错误码：10605142**

ArkTS不支持`as const`断言和字面量类型。标准TypeScript中，`as const`用于标注字面量类型。

**TypeScript**

```typescript
// 'hello'类型
let x = 'hello' as const;

// 'readonly [10, 20]'类型
let y = [10, 20] as const;

// '{ readonly text: 'hello' }'类型
let z = { text: 'hello' } as const;
```

**ArkTS**

```typescript
// 'string'类型
let x: string = 'hello';

// 'number[]'类型
let y: number[] = [10, 20];

class Label {
  text: string = ''
}

// 'Label'类型
let z: Label = {
  text: 'hello'
}
```

### 不支持导入断言

**规则：**`arkts-no-import-assertions`

**级别：错误**

**错误码：10605143**

ArkTS不支持导入断言。因为导入是编译时特性，运行时检查导入API是否正确没有意义。改用常规的`import`语法。

**TypeScript**

```typescript
import { obj } from 'something.json' assert { type: 'json' }
```

**ArkTS**

```typescript
// 编译时将检查导入T的正确性
import { something } from 'module'
```

### 限制使用标准库

**规则：**`arkts-limited-stdlib`

**级别：错误**

**错误码：10605144**

ArkTS不允许使用TypeScript或JavaScript标准库中的某些接口。大部分接口与动态特性有关。ArkTS中禁止使用以下接口：

全局对象的属性和方法：`eval`

`Object`：`__proto__`、`__defineGetter__`、`__defineSetter__`、
`__lookupGetter__`、`__lookupSetter__`、`assign`、`create`、
`defineProperties`、`defineProperty`、`freeze`、
`fromEntries`、`getOwnPropertyDescriptor`、`getOwnPropertyDescriptors`、
`getOwnPropertySymbols`、`getPrototypeOf`、
`hasOwnProperty`、`is`、`isExtensible`、`isFrozen`、
`isPrototypeOf`、`isSealed`、`preventExtensions`、
`propertyIsEnumerable`、`seal`、`setPrototypeOf`

`Reflect`：`apply`、`construct`、`defineProperty`、`deleteProperty`、
`getOwnPropertyDescriptor`、`getPrototypeOf`、
`isExtensible`、`preventExtensions`、
`setPrototypeOf`

`Proxy`：`handler.apply()`、`handler.construct()`、
`handler.defineProperty()`、`handler.deleteProperty()`、`handler.get()`、
`handler.getOwnPropertyDescriptor()`、`handler.getPrototypeOf()`、
`handler.has()`、`handler.isExtensible()`、`handler.ownKeys()`、
`handler.preventExtensions()`、`handler.set()`、`handler.setPrototypeOf()`

### 强制进行严格类型检查

**规则：**`arkts-strict-typing`

**级别：错误**

**错误码：10605145**

在编译阶段，会进行TypeScript严格模式的类型检查，包括：
`noImplicitReturns`, 
`strictFunctionTypes`, 
`strictNullChecks`, 
`strictPropertyInitialization`。

**TypeScript**

```typescript
// 只有在开启noImplicitReturns选项时会产生编译时错误
function foo(s: string): string {
  if (s != '') {
    console.log(s);
    return s;
  } else {
    console.log(s);
  }
}

let n: number = null; // 只有在开启strictNullChecks选项时会产生编译时错误
```

**ArkTS**

```typescript
function foo(s: string): string {
  console.log(s);
  return s;
}

let n1: number | null = null;
let n2: number = 0;
```

在定义类时，如果无法在声明时或者构造函数中初始化某实例属性，那么可以使用确定赋值断言符`!`来消除`strictPropertyInitialization`的报错。

使用确定赋值断言符会增加代码错误风险。开发者需确保实例属性在使用前已赋值，否则可能产生运行时异常。

使用确定赋值断言符会增加运行时开销，应尽量避免使用。

使用确定赋值断言符将产生`warning: arkts-no-definite-assignment`。

**TypeScript**

```typescript
class C {
  name: string  // 只有在开启strictPropertyInitialization选项时会产生编译时错误
  age: number   // 只有在开启strictPropertyInitialization选项时会产生编译时错误
}

let c = new C();
```

**ArkTS**

```typescript
class C {
  name: string = ''
  age!: number      // warning: arkts-no-definite-assignment

  initAge(age: number) {
    this.age = age;
  }
}

let c = new C();
c.initAge(10);
```

### 不允许通过注释关闭类型检查

**规则：**`arkts-strict-typing-required`

**级别：错误**

**错误码：10605146**

在ArkTS中，类型检查不是可选项。不允许通过注释关闭类型检查，不支持使用`@ts-ignore`和`@ts-nocheck`。

**TypeScript**

```typescript
// @ts-nocheck
// ...
// 关闭了类型检查后的代码
// ...

let s1: string = null; // 没有报错

// @ts-ignore
let s2: string = null; // 没有报错
```

**ArkTS**

```typescript
let s1: string | null = null; // 没有报错，合适的类型
let s2: string = null; // 编译时报错
```

### 允许.ets文件`import`.ets/.ts/.js文件源码, 不允许.ts/.js文件`import`.ets文件源码

**规则：**`arkts-no-ts-deps`

**级别：错误**

**错误码：10605147**

.ets文件可以`import`.ets/.ts/.js文件源码，但是.ts/.js文件不允许`import`.ets文件源码。

**TypeScript**

```typescript
// app.ets
export class C {
  // ...
}

// lib.ts
import { C } from 'app'
```

**ArkTS**

```typescript
// lib1.ets
export class C {
  // ...
}

// lib2.ets
import { C } from 'lib1'
```

### `class`不能被用作对象

**规则：**`arkts-no-classes-as-obj`

**级别：警告**

**错误码：10605149**

在ArkTS中，`class`声明的是一个新类型，不是值。因此，不支持将`class`用作对象，例如将其赋值给一个对象。

### 不支持在`import`语句前使用其他语句

**规则：**`arkts-no-misplaced-imports`

**级别：错误**

**错误码：10605150**

在ArkTS中，除动态`import`语句外，所有`import`语句需置于其他语句之前。

**TypeScript**

```typescript
class C {
  s: string = ''
  n: number = 0
}

import foo from 'module1'
```

**ArkTS**

```typescript
import foo from 'module1'

class C {
  s: string = ''
  n: number = 0
}

import('module2').then(() => {}).catch(() => {})  // 动态import
```

### 限制使用`ESObject`类型

**规则：**`arkts-limited-esobj`

**级别：警告**

**错误码：10605151**

为了防止动态对象（来自.ts/.js文件）在静态代码（.ets文件）中的滥用，`ESObject`类型在ArkTS中的使用是受限的。
在API版本18以前，唯一允许使用`ESObject`类型的场景是局部变量的声明。`ESObject`类型变量只能被跨语言调用的对象赋值，例如：`ESObject`、`any`、`unknown`、匿名类型等。禁止使用在.ets文件中定义的静态类型值初始化`ESObject`类型变量。`ESObject`类型变量只能用于跨语言调用的函数或赋值给另一个`ESObject`类型变量。
从API版本18开始，`ESObject`类型不再支持赋值对象字面量类型。`ESObject`类型支持在动态导入场景中作为类型标注，以及用于属性访问（点操作符和[]访问）、调用表达式和new表达式。

**ArkTS**

```typescript
// lib.d.ts
declare function foo(): any;
declare function bar(a: any): number;

// main.ets
let e0: ESObject = foo(); // API18以前，编译时错误：ESObject类型只能用于局部变量；API18以后，OK，显式标注ESObject类型

function f() {
  let e1 = foo();        // 编译时错误：e1的类型是any
  let e2: ESObject = 1;  // API18以前，编译时错误：不能用非动态值初始化ESObject类型变量；API18以后，OK，支持赋值数字类型
  let e3: ESObject = {}; // API18以前，编译时错误：不能用非动态值初始化ESObject类型变量；API18以后，编译时错误：ESObject不支持赋值对象字面量类型
  let e4: ESObject = []; // API18以前，编译时错误：不能用非动态值初始化ESObject类型变量；API18以后，OK，支持赋值数组类型
  let e5: ESObject = ''; // API18以前，编译时错误：不能用非动态值初始化ESObject类型变量；API18以后，OK，支持赋值字符串类型
  e5['prop'];            // API18以前，编译时错误：不能访问ESObject类型变量的属性；API18以后，OK，支持[]访问
  e5[1];                 // API18以前，编译时错误：不能访问ESObject类型变量的属性；API18以后，OK，支持[]访问
  e5.prop;               // API18以前，编译时错误：不能访问ESObject类型变量的属性；API18以后，OK，支持点操作符访问

  let e6: ESObject = foo(); // OK，显式标注ESObject类型
  let e7 = e6;              // OK，使用ESObject类型赋值
  bar(e7);                  // OK，ESObject类型变量传给跨语言调用的函数
}
```
# 适配指导案例

本文通过具体应用场景中的案例，提供在ArkTS语法规则下将TS代码适配成ArkTS代码的建议。各章以ArkTS语法规则的英文名称命名，每个案例展示适配前的TS代码和适配后的ArkTS代码。

## arkts-identifiers-as-prop-names

当属性名是有效的标识符（即不包含特殊字符、空格等，并且不以数字开头），可以直接使用而无需引号。

**应用代码**

```typescript
interface W {
  bundleName: string
  action: string
  entities: string[]
}

let wantInfo: W = {
  'bundleName': 'com.huawei.hmos.browser',
  'action': 'ohos.want.action.viewData',
  'entities': ['entity.system.browsable']
}
```

**建议改法**

```typescript
interface W {
  bundleName: string
  action: string
  entities: string[]
}

let wantInfo: W = {
  bundleName: 'com.huawei.hmos.browser',
  action: 'ohos.want.action.viewData',
  entities: ['entity.system.browsable']
}
```

## arkts-no-any-unknown

### 按照业务逻辑，将代码中的`any, unknown`改为具体的类型

```typescript
function printObj(obj: any) {
  console.log(obj);
}

printObj('abc'); // abc
```

**建议改法**

```typescript
function printObj(obj: string) {
  console.log(obj);
}

printObj('abc'); // abc
```

### 标注JSON.parse返回值类型

**应用代码**

```typescript
class A {
  v: number = 0
  s: string = ''
  
  foo(str: string) {
    let tmpStr = JSON.parse(str);
    if (tmpStr.add != undefined) {
      this.v = tmpStr.v;
      this.s = tmpStr.s;
    }
  }
}
```

**建议改法**

```typescript
class A {
  v: number = 0
  s: string = ''
  
  foo(str: string) {
    let tmpStr: Record<string, Object> = JSON.parse(str);
    if (tmpStr.add != undefined) {
      this.v = tmpStr.v as number;
      this.s = tmpStr.s as string;
    }
  }
}
```

### 使用Record类型

**应用代码**

```typescript
function printProperties(obj: any) {
  console.log(obj.name);
  console.log(obj.value);
}
```

**建议改法**

```typescript
function printProperties(obj: Record<string, Object>) {
  console.log(obj.name as string);
  console.log(obj.value as string);
}
```

## arkts-no-call-signature

使用函数类型进行替代。

**应用代码**

```typescript
interface I {
  (value: string): void;
}

function foo(fn: I) {
  fn('abc');
}

foo((value: string) => {
  console.log(value);
})
```


**建议改法**

```typescript
type I = (value: string) => void

function foo(fn: I) {
  fn('abc');
}

foo((value: string) => {
  console.log(value);
})
```

## arkts-no-ctor-signatures-type

使用工厂函数（() => Instance）替代构造函数签名。

**应用代码**

```typescript
class Controller {
  value: string = ''

  constructor(value: string) {
    this.value = value;
  }
}

type ControllerConstructor = {
  new (value: string): Controller;
}

class Menu {
  controller: ControllerConstructor = Controller
  createController() {
    if (this.controller) {
      return new this.controller(123);
    }
    return null;
  }
}

let t = new Menu();
console.log(t.createController()!.value);
```

**建议改法**

```typescript
class Controller {
  value: string = ''

  constructor(value: string) {
    this.value = value;
  }
}

type ControllerConstructor = () => Controller;

class Menu {
  controller: ControllerConstructor = () => {
    return new Controller('abc');
  }

  createController() {
    if (this.controller) {
      return this.controller();
    }
    return null;
  }
}

let t: Menu = new Menu();
console.log(t.createController()!.value);
```

## arkts-no-indexed-signatures

使用Record类型进行替代。

**应用代码**

```typescript
function foo(data: { [key: string]: string }) {
  data['a'] = 'a';
  data['b'] = 'b';
  data['c'] = 'c';
}
```

**建议改法**

```typescript
function foo(data: Record<string, string>) {
  data['a'] = 'a';
  data['b'] = 'b';
  data['c'] = 'c';
}
```

## arkts-no-typing-with-this

使用具体类型替代`this`。

**应用代码**

```typescript
class C {
  getInstance(): this {
    return this;
  }
}
```

**建议改法**

```typescript
class C {
  getInstance(): C {
    return this;
  }
}
```

## arkts-no-ctor-prop-decls

显式声明类属性，并在构造函数中手动赋值。

**应用代码**

```typescript
class Person {
  constructor(readonly name: string) {}

  getName(): string {
    return this.name;
  }
}
```

**建议改法**

```typescript
class Person {
  name: string
  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}
```

## arkts-no-ctor-signatures-iface

使用type定义工厂函数或普通函数类型。

**应用代码**

```typescript
class Controller {
  value: string = ''

  constructor(value: string) {
    this.value = value;
  }
}

interface ControllerConstructor {
  new (value: string): Controller;
}

class Menu {
  controller: ControllerConstructor = Controller
  createController() {
    if (this.controller) {
      return new this.controller('abc');
    }
    return null;
  }
}

let t = new Menu();
console.log(t.createController()!.value);
```

**建议改法**

```typescript
class Controller {
  value: string = ''

  constructor(value: string) {
    this.value = value;
  }
}

type ControllerConstructor = () => Controller;

class Menu {
  controller: ControllerConstructor = () => {
    return new Controller('abc');
  }

  createController() {
    if (this.controller) {
      return this.controller();
    }
    return null;
  }
}

let t: Menu = new Menu();
console.log(t.createController()!.value);
```

## arkts-no-props-by-index

可以将对象转换为Record类型，以便访问其属性。

**应用代码**

```typescript
function foo(params: Object) {
    let funNum: number = params['funNum'];
    let target: string = params['target'];
}
```

**建议改法**

```typescript
function foo(params: Record<string, string | number>) {
    let funNum: number = params['funNum'] as number;
    let target: string = params['target'] as string;
}
```

## arkts-no-inferred-generic-params

所有泛型调用都应显式标注泛型参数类型，如 Map\<string, T\>、.map\<T\>()。

**应用代码**

```typescript
class A {
  str: string = ''
}
class B extends A {}
class C extends A {}

let arr: Array<A> = [];

let originMenusMap:Map<string, C> = new Map(arr.map(item => [item.str, (item instanceof C) ? item: null]));
```

**建议改法**

```typescript
class A {
  str: string = ''
}
class B extends A {}
class C extends A {}

let arr: Array<A> = [];

let originMenusMap: Map<string, C | null> = new Map<string, C | null>(arr.map<[string, C | null]>(item => [item.str, (item instanceof C) ? item: null]));
```

**原因**

`(item instanceof C) ? item: null` 需要声明类型为`C | null`，由于编译器无法推导出`map`的泛型类型参数，需要显式标注。

## arkts-no-regexp-literals

使用new RegExp(pattern, flags) 构造函数替代RegExp字面量。

**应用代码**

```typescript
let regex: RegExp = /\s*/g;
```

**建议改法**

```typescript
let regexp: RegExp = new RegExp('\\s*','g');
```

**原因**

如果正则表达式中使用了标志符，需要将其作为`new RegExp()`的参数。

## arkts-no-untyped-obj-literals

### 从SDK中导入类型，标注object literal类型

**应用代码**

```typescript
const area = { // 没有写明类型 不方便维护
  pixels: new ArrayBuffer(8),
  offset: 0,
  stride: 8,
  region: { size: { height: 1,width:2 }, x: 0, y: 0 }
}
```

**建议改法**

```typescript
import { image } from '@kit.ImageKit';

const area: image.PositionArea = { // 写明具体类型
  pixels: new ArrayBuffer(8),
  offset: 0,
  stride: 8,
  region: { size: { height: 1, width: 2 }, x: 0, y: 0 }
}
```

### 用class为object literal标注类型，要求class的构造函数无参数

**应用代码**

```typescript
class Test {
  value: number = 1
  // 有构造函数
  constructor(value: number) {
    this.value = value;
  }
}

let t: Test = { value: 2 };
```

**建议改法1**

```typescript
// 去除构造函数
class Test {
  value: number = 1
}

let t: Test = { value: 2 };
```

**建议改法2**
```typescript
// 使用new
class Test {
  value: number = 1
  
  constructor(value: number) {
    this.value = value;
  }
}

let t: Test = new Test(2);
```

**原因**

```typescript
class C {
  value: number = 1
  
  constructor(n: number) {
    if (n < 0) {
      throw new Error('Negative');
    }
    this.value = n;
  }
}

let s: C = new C(-2); 	//抛出异常
let t: C = { value: -2 };	//ArkTS不支持
```

如果允许使用`C`来标注object literal的类型，变量`t`会导致行为的二义性。ArkTS禁止通过object literal绕过这一行为。

### 用class/interface为object literal标注类型，要求使用identifier作为object literal的key

**应用代码**

```typescript
class Test {
  value: number = 0
}

let arr: Test[] = [
  {
    'value': 1
  },
  {
    'value': 2
  },
  {
    'value': 3
  }
]
```

**建议改法**

```typescript
class Test {
  value: number = 0
}
let arr: Test[] = [
  {
    value: 1
  },
  {
    value: 2
  },
  {
    value: 3
  }
]
```

### 使用Record类型为object literal标注类型，要求使用字符串作为object literal的key

**应用代码**

```typescript
let obj: Record<string, number | string> = {
  value: 123,
  name: 'abc'
}
```

**建议改法**

```typescript
let obj: Record<string, number | string> = {
  'value': 123,
  'name': 'abc'
}
```

### 函数参数类型包含index signature

**应用代码**

```typescript
function foo(obj: { [key: string]: string}): string {
  if (obj != undefined && obj != null) {
    return obj.value1 + obj.value2;
  }
  return '';
}
```

**建议改法**

```typescript
function foo(obj: Record<string, string>): string {
  if (obj != undefined && obj != null) {
    return obj.value1 + obj.value2;
  }
  return '';
}
```

### 函数实参使用了object literal

**应用代码**

```typescript
(fn) => {
  fn({ value: 123, name:'' });
}
```

**建议改法**

```typescript
class T {
  value: number = 0
  name: string = ''
}

(fn: (v: T) => void) => {
  fn({ value: 123, name: '' });
}
```

### class/interface 中包含方法

**应用代码**

```typescript
interface T {
  foo(value: number): number
}

let t:T = { foo: (value) => { return value } };
```

**建议改法1**

```typescript
interface T {
  foo: (value: number) => number
}

let t:T = { foo: (value) => { return value } };
```

**建议改法2**

```typescript
class T {
  foo: (value: number) => number = (value: number) => {
    return value;
  }
}

let t:T = new T();
```

**原因**

class/interface中声明的方法应被所有实例共享。ArkTS不支持通过object literal改写实例方法。ArkTS支持函数类型的属性。

### export default对象

**应用代码**

```typescript
export default {
  onCreate() {
    // ...
  },
  onDestroy() {
    // ...
  }
}
```

**建议改法**

```typescript
class Test {
  onCreate() {
    // ...
  }
  onDestroy() {
    // ...
  }
}

export default new Test()
```

### 通过导入namespace获取类型

**应用代码**

```typescript
// test.d.ets
declare namespace test {
  interface I {
    id: string;
    type: number;
  }

  function foo(name: string, option: I): void;
}

export default test;

// app.ets
import { test } from 'test';

let option = { id: '', type: 0 };
test.foo('', option);
```

**建议改法**

```typescript
// test.d.ets
declare namespace test {
  interface I {
    id: string;
    type: number;
  }

  function foo(name: string, option: I): void;
}

export default test;

// app.ets
import { test } from 'test';

let option: test.I = { id: '', type: 0 };
test.foo('', option);
```

**原因**

对象字面量缺少类型，根据`test.foo`分析可以得知，`option`的类型来源于声明文件，那么只需要将类型导入即可。
在`test.d.ets`中，`I`定义在namespace中。在ets文件中，先导入namespace，再通过名称获取相应的类型。

### object literal传参给Object类型

**应用代码**

```typescript
function emit(event: string, ...args: Object[]): void {}

emit('', {
  'action': 11,
  'outers': false
});
```

**建议改法**

```typescript
function emit(event: string, ...args: Object[]): void {}

let emitArg: Record<string, number | boolean> = {
   'action': 11,
   'outers': false
}

emit('', emitArg);
```

## arkts-no-obj-literals-as-types

使用interface显式定义结构类型。

**应用代码**

```typescript
type Person = { name: string, age: number }
```

**建议改法**

```typescript
interface Person {
  name: string,
  age: number
}
```

## arkts-no-noninferrable-arr-literals

显式声明数组元素的类型（使用interface或class），并为数组变量添加类型注解。

**应用代码**

```typescript
let permissionList = [
  { name: '设备信息', value: '用于分析设备的续航、通话、上网、SIM卡故障等' },
  { name: '麦克风', value: '用于反馈问题单时增加语音' },
  { name: '存储', value: '用于反馈问题单时增加本地文件附件' }
]
```

**建议改法**

为对象字面量声明类型

```typescript
class PermissionItem {
  name?: string
  value?: string
}

let permissionList: PermissionItem[] = [
  { name: '设备信息', value: '用于分析设备的续航、通话、上网、SIM卡故障等' },
  { name: '麦克风', value: '用于反馈问题单时增加语音' },
  { name: '存储', value: '用于反馈问题单时增加本地文件附件' }
]
```

## arkts-no-method-reassignment

使用函数类型的类字段（class field）代替原型方法。

**应用代码**

```typescript
class C {
  add(left: number, right: number): number {
    return left + right;
  }
}

function sub(left: number, right: number): number {
  return left - right;
}

let c1 = new C();
c1.add = sub;
```

**建议改法**

```typescript
class C {
  add: (left: number, right: number) => number = 
    (left: number, right: number) => {
      return left + right;
    }
}

function sub(left: number, right: number): number {
  return left - right;
}

let c1 = new C();
c1.add = sub;
```

## arkts-no-polymorphic-unops

使用 Number.parseInt()、new Number() 等显式转换函数。

**应用代码**

```typescript
let a = +'5'; // 使用操作符隐式转换
let b = -'5';
let c = ~'5';
let d = +'string';
```

**建议改法**

```typescript
let a = Number.parseInt('5'); // 使用Number.parseInt显示转换
let b = -Number.parseInt('5');
let c = ~Number.parseInt('5');
let d = new Number('string');
```

## arkts-no-type-query

使用类、接口或类型别名替代typeof，避免依赖变量做类型推导。

**应用代码**

```typescript
// module1.ts
class C {
  value: number = 0
}

export let c = new C()

// module2.ts
import { c } from './module1'
let t: typeof c = { value: 123 };
```

**建议改法**

```typescript
// module1.ts
class C {
  value: number = 0
}

export { C }

// module2.ts
import { C } from './module1'
let t: C = { value: 123 };
```

## arkts-no-in

### 使用Object.keys判断属性是否存在

**应用代码**

```typescript
function test(str: string, obj: Record<string, Object>) {
  return str in obj;
}
```

**建议改法**

```typescript
function test(str: string, obj: Record<string, Object>) {
  for (let i of Object.keys(obj)) {
    if (i == str) {
      return true;
    }
  }
  return false;
}
```

## arkts-no-destruct-assignment

使用索引访问元素或手动赋值代替解构赋值。

**应用代码**

```typescript
let map = new Map<string, string>([['a', 'a'], ['b', 'b']]);
for (let [key, value] of map) {
  console.log(key);
  console.log(value);
}
```

**建议改法**

使用数组

```typescript
let map = new Map<string, string>([['a', 'a'], ['b', 'b']]);
for (let arr of map) {
  let key = arr[0];
  let value = arr[1];
  console.log(key);
  console.log(value);
}
```

## arkts-no-types-in-catch

使用无类型 catch (error)，然后通过类型断言处理。

**应用代码**

```typescript
import { BusinessError } from '@kit.BasicServicesKit'

try {
  // ...
} catch (e: BusinessError) {
  console.error(e.message, e.code);
}
```

**建议改法**

```typescript
import { BusinessError } from '@kit.BasicServicesKit'

try {
  // ...
} catch (error) {
  let e: BusinessError = error as BusinessError;
  console.error(e.message, e.code);
}
```

## arkts-no-for-in

使用 Object.entries(obj) + for of 替代 for in。

**应用代码**

```typescript
interface Person {
  [name: string]: string
}
let p: Person = {
  name: 'tom',
  age: '18'
};

for (let t in p) {
  console.log(p[t]);  // log: "tom", "18" 
}
```

**建议改法**

```typescript
let p: Record<string, string> = {
  'name': 'tom',
  'age': '18'
};

for (let ele of Object.entries(p)) {
  console.log(ele[1]);  // log: "tom", "18" 
}
```

## arkts-no-mapped-types

使用 Record\<K, T\> 替代映射类型。

**应用代码**

```typescript
class C {
  a: number = 0
  b: number = 0
  c: number = 0
}
type OptionsFlags = {
  [Property in keyof C]: string
}
```

**建议改法**

```typescript
class C {
  a: number = 0
  b: number = 0
  c: number = 0
}

type OptionsFlags = Record<keyof C, string>
```

## arkts-limited-throw

将对象转换为Error，或创建新的Error实例抛出。

**应用代码**

```typescript
import { BusinessError } from '@kit.BasicServicesKit'

function ThrowError(error: BusinessError) {
  throw error;
}
```

**建议改法**

```typescript
import { BusinessError } from '@kit.BasicServicesKit'

function ThrowError(error: BusinessError) {
  throw error as Error;
}
```

**原因**

`throw`语句中值的类型必须为`Error`或者其继承类，如果继承类是一个泛型，会有编译期报错。建议使用`as`将类型转换为`Error`。

## arkts-no-standalone-this

### 函数内使用this

**应用代码**

```typescript
function foo() {
  console.log(this.value);
}

let obj = { value: 'abc' };
foo.apply(obj);
```

**建议改法1**

使用类的方法实现,如果该方法被多个类使用,可以考虑采用继承的机制

```typescript
class Test {
  value: string = ''
  constructor (value: string) {
    this.value = value
  }
  
  foo() {
    console.log(this.value);
  }
}

let obj: Test = new Test('abc');
obj.foo();
```

**建议改法2**

将this作为参数传入

```typescript
function foo(obj: Test) {
  console.log(obj.value);
}

class Test {
  value: string = ''
}

let obj: Test = { value: 'abc' };
foo(obj);
```

**建议改法3**

将属性作为参数传入
```typescript
function foo(value: string) {
  console.log(value);
}

class Test {
  value: string = ''
}

let obj: Test = { value: 'abc' };
foo(obj.value);
```

### class的静态方法内使用this

**应用代码**

```typescript
class Test {
  static value: number = 123
  static foo(): number {
    return this.value
  }
}
```

**建议改法**

```typescript
class Test {
  static value: number = 123
  static foo(): number {
    return Test.value
  }
}
```

## arkts-no-spread

使用Object.assign()、手动赋值或数组方法替代扩展运算符。

**应用代码**

```typescript
// test.d.ets
declare namespace test {
  interface I {
    id: string;
    type: number;
  }

  function foo(): I;
}

export default test

// app.ets
import test from 'test';

let t: test.I = {
  ...test.foo(),
  type: 0
}
```

**建议改法**

```typescript
// test.d.ets
declare namespace test {
  interface I {
    id: string;
    type: number;
  }

  function foo(): I;
}

export default test

// app.ets
import test from 'test';

let t: test.I = test.foo();
t.type = 0;
```

**原因**

ArkTS中，对象布局在编译期是确定的。如果需要将一个对象的所有属性展开赋值给另一个对象可以通过逐个属性赋值语句完成。在本例中，需要展开的对象和赋值的目标对象类型恰好相同，可以通过改变该对象属性的方式重构代码。

## arkts-no-ctor-signatures-funcs

在class内声明属性，而不是在构造函数上。

**应用代码**

```typescript
class Controller {
  value: string = ''
  constructor(value: string) {
    this.value = value
  }
}

type ControllerConstructor = new (value: string) => Controller;

class Menu {
  controller: ControllerConstructor = Controller
  createController() {
    if (this.controller) {
      return new this.controller('abc');
    }
    return null;
  }
}

let t = new Menu()
console.log(t.createController()!.value)
```

**建议改法**

```typescript
class Controller {
  value: string = ''
  constructor(value: string) {
    this.value = value;
  }
}

type ControllerConstructor = () => Controller;

class Menu {
  controller: ControllerConstructor = () => { return new Controller('abc') }
  createController() {
    if (this.controller) {
      return this.controller();
    }
    return null;
  }
}

let t: Menu = new Menu();
console.log(t.createController()!.value);
```

## arkts-no-globalthis

ArkTS不支持`globalThis`。一方面无法为`globalThis`添加静态类型，只能通过查找方式访问其属性，导致额外性能开销。另一方面，无法为`globalThis`的属性标记类型，无法保证操作的安全性和高性能。

1. 建议按照业务逻辑根据`import/export`语法实现数据在不同模块的传递。

2. 必要情况下，可以通过构造的**单例对象**来实现全局对象的功能。(**说明：** 不能在har中定义单例对象，har在打包时会在不同的hap中打包两份，无法实现单例。)

**构造单例对象**

```typescript
// 构造单例对象
export class GlobalContext {
  private constructor() {}
  private static instance: GlobalContext;
  private _objects = new Map<string, Object>();

  public static getContext(): GlobalContext {
    if (!GlobalContext.instance) {
      GlobalContext.instance = new GlobalContext();
    }
    return GlobalContext.instance;
  }

  getObject(value: string): Object | undefined {
    return this._objects.get(value);
  }

  setObject(key: string, objectClass: Object): void {
    this._objects.set(key, objectClass);
  }
}

```

**应用代码**

```typescript

// file1.ts

export class Test {
  value: string = '';
  foo(): void {
    globalThis.value = this.value;
  }
}

// file2.ts

globalThis.value;

```

**建议改法**

```typescript

// file1.ts

import { GlobalContext } from '../GlobalContext'

export class Test {
  value: string = '';
  foo(): void {
    GlobalContext.getContext().setObject('value', this.value);
  }
}

// file2.ts

import { GlobalContext } from '../GlobalContext'

GlobalContext.getContext().getObject('value');
```

## arkts-no-func-apply-bind-call

### 使用标准库中接口

**应用代码**

```typescript
let arr: number[] = [1, 2, 3, 4];
let str = String.fromCharCode.apply(null, Array.from(arr));
```

**建议改法**

```typescript
let arr: number[] = [1, 2, 3, 4];
let str = String.fromCharCode(...Array.from(arr));
```

### bind定义方法

**应用代码**

```typescript
class A {
  value: string = ''
  foo: Function = () => {}
}

class Test {
  value: string = '1234'
  obj: A = {
    value: this.value,
    foo: this.foo.bind(this)
  }
  
  foo() {
    console.log(this.value);
  }
}
```

**建议改法1**

```typescript
class A {
  value: string = ''
  foo: Function = () => {}
}

class Test {
  value: string = '1234'
  obj: A = {
    value: this.value,
    foo: (): void => this.foo()
  }
  
  foo() {
    console.log(this.value);
  }
}
```

**建议改法2**

```typescript
class A {
  value: string = ''
  foo: Function = () => {}
}

class Test {
  value: string = '1234'
  foo: () => void = () => {
    console.log(this.value);
  }
  obj: A = {
    value: this.value,
    foo: this.foo
  }
}
```

### 使用apply

**应用代码**

```typescript
class A {
  value: string;
  constructor (value: string) {
    this.value = value;
  }

  foo() {
    console.log(this.value);
  }
}

let a1 = new A('1');
let a2 = new A('2');

a1.foo();
a1.foo.apply(a2);
```

**建议改法**

```typescript
class A {
  value: string;
  constructor (value: string) {
    this.value = value;
  }

  foo() {
    this.fooApply(this);
  }

  fooApply(a: A) {
    console.log(a.value);
  }
}

let a1 = new A('1');
let a2 = new A('2');

a1.foo();
a1.fooApply(a2);
```

## arkts-limited-stdlib

### `Object.fromEntries()`

**应用代码**

```typescript
let entries = new Map([
  ['foo', 123],
  ['bar', 456]
]);

let obj = Object.fromEntries(entries);
```

**建议改法**

```typescript
let entries = new Map([
  ['foo', 123],
  ['bar', 456]
]);

let obj: Record<string, Object> = {};
entries.forEach((value, key) => {
  if (key != undefined && key != null) {
    obj[key] = value;
  }
})
```

### 使用`Number`的属性和方法

ArkTS不允许使用全局对象的属性和方法： `Infinity, NaN, isFinite, isNaN, parseFloat, parseInt`

可以使用`Number`的属性和方法： `Infinity, NaN, isFinite, isNaN, parseFloat, parseInt`

**应用代码**

```typescript
NaN;
isFinite(123);
parseInt('123');
```

**建议改法**

```typescript
Number.NaN;
Number.isFinite(123);
Number.parseInt('123');
```

## arkts-strict-typing(StrictModeError)

### strictPropertyInitialization

**应用代码**

```typescript
interface I {
  name:string
}

class A {}

class Test {
  a: number;
  b: string;
  c: boolean;
  d: I;
  e: A;
}

```

**建议改法**

```typescript
interface I {
  name:string
}

class A {}

class Test {
  a: number;
  b: string;
  c: boolean;
  d: I = { name:'abc' };
  e: A | null = null;
  constructor(a:number, b:string, c:boolean) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

```
### Type `*** | null` is not assignable to type `***`

**应用代码**

```typescript
class A {
  bar() {}
}
function foo(n: number) {
  if (n === 0) {
    return null;
  }
  return new A();
}
function getNumber() {
  return 5;
}
let a:A = foo(getNumber());
a.bar();
```

**建议改法**

```typescript
class A {
  bar() {}
}
function foo(n: number) {
  if (n === 0) {
    return null;
  }
  return new A();
}
function getNumber() {
  return 5;
}

let a: A | null = foo(getNumber());
a?.bar();
```

### 严格属性初始化检查

在class中，如果一个属性没有初始化，且没有在构造函数中被赋值，ArkTS将报错。

**建议改法**

1.一般情况下，**建议按照业务逻辑**在声明时初始化属性，或者在构造函数中为属性赋值。如：

```typescript
//code with error
class Test {
  value: number
  flag: boolean
}

//方式一，在声明时初始化
class Test {
  value: number = 0
  flag: boolean = false
}

//方式二，在构造函数中赋值
class Test {
  value: number
  flag: boolean
  constructor(value: number, flag: boolean) {
    this.value = value;
    this.flag = flag;
  }
}
```

2.对于对象类型（包括函数类型）`A`，如果不确定如何初始化，建议按照以下方式之一进行初始化

​	方式(i)  `prop: A | null = null`

​	方式(ii) `prop?: A`

​	方式三(iii) `prop： A | undefined = undefined`

- 从性能角度看，`null`类型仅用于编译期的类型检查，不会影响虚拟机性能。而`undefined | A`被视为联合类型，运行时可能产生额外开销。
- 从代码可读性、简洁性的角度来说，`prop?:A`是`prop： A | undefined = undefined`的语法糖，**推荐使用可选属性的写法**

### 严格函数类型检查

**应用代码**

```typescript
function foo(fn: (value?: string) => void, value: string): void {}

foo((value: string) => {}, ''); //error
```

**建议改法**

```typescript
function foo(fn: (value?: string) => void, value: string): void {}

foo((value?: string) => {}, '');
```

**原因**

例如，在以下的例子中，如果编译期不开启严格函数类型的检查，那么该段代码可以编译通过，但是在运行时会产生非预期的行为。具体来看，在`foo`的函数体中，一个`undefined`被传入`fn`（这是可以的，因为`fn`可以接受`undefined`），但是在代码第6行`foo`的调用点，传入的`(value: string) => { console.info(value.toUpperCase()) }`的函数实现中，始终将参数`value`当做string类型，允许其调用`toUpperCase`方法。如果不开启严格函数类型的检查，那么这段代码在运行时，会出现在`undefined`上无法找到属性的错误。

```typescript
function foo(fn: (value?: string) => void, value: string): void {
  let v: string | undefined = undefined;
  fn(v);
}

foo((value: string) => { console.info(value.toUpperCase()) }, ''); // Cannot read properties of undefined (reading 'toUpperCase')
```

为了避免运行时的非预期行为，开启严格类型检查时，这段代码将无法编译通过，需要提醒开发者修改代码，确保程序安全。

### 严格空值检查

**应用代码**

```typescript
class Test {
  private value?: string
  
  public printValue () {
    console.log(this.value.toLowerCase());
  }
}

let t = new Test();
t.printValue();
```

**建议改法**

在编写代码时，建议减少可空类型的使用。如果对变量、属性标记了可空类型，那么在使用它们之前，需要进行空值的判断，根据是否为空值处理不同的逻辑。

```typescript
class Test {
  private value?: string

  public printValue () {
    if (this.value) {
      console.log(this.value.toLowerCase());
    }
  }
}

let t = new Test();
t.printValue();
```

**原因**

在第一段代码中，如果编译期不开启严格空值检查，那么该段代码可以编译通过，但是在运行时会产生非预期的行为。这是因为`t`的属性`value`为`undefined`（`value?: string`是`value: string | undefined = undefined`的语法糖），在第11行调用`printValue`方法时，由于在该方法体内未对`this.value`的值进行空值检查，而直接按照`string`类型访问其属性，这就导致了运行时的错误。为了避免运行时的非预期行为，如果在编译时开启严格空值检查，这段代码将编译不通过从而可以提醒开发者修改代码（如按照第二段代码的方式），保证程序安全。

### 函数返回类型不匹配

**应用代码**

```typescript
class Test {
  handleClick: (action: string, externInfo?: string) => void | null = null;
}
```

**建议改法**

在这种写法下，函数返回类型被解析为 `void | undefined`，需要添加括号用来区分union类型。

```typescript
class Test {
  handleClick: ((action: string, externInfo?: string) => void) | null = null;
}
```

### '***' is of type 'unknown'

**应用代码**

```typescript
try {
  
} catch (error) {
  console.log(error.message);
}
```

**建议改法**

```typescript
import { BusinessError } from '@kit.BasicServicesKit'

try {
  
} catch (error) {
  console.log((error as BusinessError).message);
}
```

### Type '*** | null' is not assignable to type '\*\*\*'

**应用代码**

```typescript
class A {
  value: number
  constructor(value: number) {
    this.value = value;
  }
}

function foo(v: number): A | null {
  if (v > 0) {
    return new A(v);
  }
  return null;
}

let a: A = foo();
```

**建议改法1**

修改变量`a`的类型：`let a: A | null = foo()`。

```typescript
class A {
  value: number
  constructor(value: number) {
    this.value = value;
  }
}

function foo(v: number): A | null {
  if (v > 0) {
    return new A(v);
  }
  return null;
}

let a: A | null = foo(123);

if (a != null) {
  // 非空分支
} else {
  // 处理null
}
```

**建议改法2**

如果确定此处调用`foo`一定返回非空值，可以使用非空断言`!`。

```typescript
class A {
  value: number
  constructor(value: number) {
    this.value = value;
  }
}

function foo(v: number): A | null {
  if (v > 0) {
    return new A(v);
  }
  return null;
}

let a: A = foo(123)!;
```

### Cannot invoke an object which possibly 'undefined'

**应用代码**

```typescript
interface A {
  foo?: () => void
}

let a:A = { foo: () => {} };
a.foo();
```

**建议改法1**

```typescript
interface A {
  foo: () => void
}
let a: A = { foo: () => {} };
a.foo();
```

**建议改法2**

```typescript
interface A {
  foo?: () => void
}

let a: A = { foo: () => {} };
if (a.foo) {
  a.foo();
}
```

**原因**

在原先代码的定义中，`foo`是可选属性，可能为`undefined`，对`undefined`的调用会导致报错。建议根据业务逻辑判断是否需要将`foo`设为可选属性。如果确实需要，那么在访问该属性后需要进行空值检查。

### Variable '***' is used before being assigned

**应用代码**

```typescript
class Test {
  value: number = 0
}

let a: Test
try {
  a = { value: 1};
} catch (e) {
  a.value;
}
a.value;
```

**建议改法**

```typescript
class Test {
  value: number = 0
}

let a: Test | null = null;
try {
  a = { value:1 };
} catch (e) {
  if (a) {
    a.value;
  }
}

if (a) {
  a.value;
}
```

**原因**

对于primitive types，可以根据业务逻辑赋值，例如0，''，false。

对于对象类型，可以将其类型修改为与null的联合类型，并赋值为null。使用时需要进行非空检查。

### Function lacks ending return statement and return type does not include 'undefined'.

**应用代码**

```typescript
function foo(a: number): number {
  if (a > 0) {
    return a;
  }
}
```

**建议改法1** 

根据业务逻辑，在else分支中返回合适的数值

**建议改法2**

```typescript
function foo(a: number): number | undefined {
  if (a > 0) {
    return a;
  }
  return
}
```

## arkts-strict-typing-required

删除忽略注释，为所有变量显式声明类型。

**应用代码**

```typescript
// @ts-nocheck
var a: any = 123;
```

**建议改法**

```typescript
let a: number = 123;
```

**原因**

ArkTS不支持通过注释的方式绕过严格类型检查。首先将注释（`// @ts-nocheck`或者`// @ts-ignore`）删去，再根据报错信息修改其他代码。

## Importing ArkTS files to JS and TS files is not allowed

## arkts-no-tsdeps

不允许.ts、.js文件`import`.ets文件源码。

**建议改法**

方式1.将.ts文件的后缀修改为ets，并按ArkTS语法规则适配代码。

方式2.将.ets文件中被.ts文件依赖的代码单独抽取到.ts文件中。

## arkts-no-special-imports

改为使用普通import { ... } from '...' 导入类型。

**应用代码**

```typescript
import type {A, B, C, D } from '***'
```


**建议改法**

```typescript
import {A, B, C, D } from '***'
```

## arkts-no-classes-as-obj

### 使用class构造实例

**应用代码**

```typescript
class Controller {
  value: string = ''
  constructor(value: string) {
    this.value = value
  }
}

interface ControllerConstructor {
  new (value: string): Controller;
}

class Menu {
  controller: ControllerConstructor = Controller
  createController() {
    if (this.controller) {
      return new this.controller('abc');
    }
    return null;
  }
}

let t = new Menu();
console.log(t.createController()!.value);
```

**建议改法**

```typescript
class Controller {
  value: string = ''
  constructor(value: string) {
    this.value = value
  }
}

type ControllerConstructor = () => Controller;

class Menu {
  controller: ControllerConstructor = () => { return new Controller('abc'); }
  createController() {
    if (this.controller) {
      return this.controller();
    }
    return null;
  }
}

let t: Menu = new Menu();
console.log(t.createController()!.value);
```

### 访问静态属性

**应用代码**

```typescript
class C1 {
  static value: string = 'abc'
}

class C2 {
  static value: string = 'def'
}

function getValue(obj: any) {
  return obj['value'];
}

console.log(getValue(C1));
console.log(getValue(C2));
```

**建议改法**

```typescript
class C1 {
  static value: string = 'abc'
}

class C2 {
  static value: string = 'def'
}

function getC1Value(): string {
  return C1.value;
}

function getC2Value(): string {
  return C2.value;
}

console.log(getC1Value());
console.log(getC2Value());
```

## arkts-no-side-effects-imports

改用动态import。

**应用代码**

```typescript
import 'module'
```

**建议改法**

```typescript
import('module')
```

## arkts-no-func-props

使用class来组织多个相关函数。

**应用代码**

```typescript
function foo(value: number): void {
  console.log(value.toString());
}

foo.add = (left: number, right: number) => {
  return left + right;
}

foo.sub = (left: number, right: number) => {
  return left - right;
}
```

**建议改法**

```typescript
class Foo {
  static foo(value: number): void {
    console.log(value.toString());
  }

  static add(left: number, right: number): number {
    return left + right;
  }

  static sub(left: number, right: number): number {
    return left - right;
  }
}
```

## arkts-limited-esobj

使用具体类型（如number, string）或接口代替模糊的ESObject。

**应用代码**

```typescript
// lib.d.ts
declare function foo(): any;

// main.ets
let e0: ESObject = foo();

function f() {
  let e1 = foo();
  let e2: ESObject = 1;
  let e3: ESObject = {};
  let e4: ESObject = '';
}
```

**建议改法**

```typescript
// lib.d.ts
declare function foo(): any;

// main.ets
interface I {}

function f() {
  let e0: ESObject = foo();
  let e1: ESObject = foo();
  let e2: number = 1;
  let e3: I = {};
  let e4: string = '';
}
```

## 拷贝

### 浅拷贝

**TypeScript**

```typescript
function shallowCopy(obj: object): object {
  let newObj = {};
  Object.assign(newObj, obj);
  return newObj;
}
```

**ArkTS**

```typescript
function shallowCopy(obj: object): object {
  let newObj: Record<string, Object> = {};
  for (let key of Object.keys(obj)) {
    newObj[key] = obj[key];
  }
  return newObj;
}
```

### 深拷贝

**TypeScript**

```typescript
function deepCopy(obj: object): object {
  let newObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      newObj[key] = deepCopy(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
```

**ArkTS**

```typescript
function deepCopy(obj: object): object {
  let newObj: Record<string, Object> | Object[] = Array.isArray(obj) ? [] : {};
  for (let key of Object.keys(obj)) {
    if (typeof obj[key] === 'object') {
      newObj[key] = deepCopy(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
```

## 状态管理使用典型场景

### Struct组件外使用状态变量

由于`struct`和`class`的不同，不建议将`this`作为参数传递到`struct`外部使用，以避免实例引用无法释放，导致内存泄露。建议传递状态变量对象到`struct`外部使用，通过修改对象的属性来触发UI刷新。

**不推荐用法**

```typescript
export class MyComponentController {
  item: MyComponent = null;

  setItem(item: MyComponent) {
    this.item = item;
  }

  changeText(value: string) {
    this.item.value = value;
  }
}

@Component
export default struct MyComponent {
  public controller: MyComponentController = null;
  @State value: string = 'Hello World';

  build() {
    Column() {
      Text(this.value)
        .fontSize(50)
    }
  }

  aboutToAppear() {
    if (this.controller)
      this.controller.setItem(this); // 不建议把this作为参数传递到struct外部使用
  }
}

@Entry
@Component
struct ObjThisOldPage {
  controller = new MyComponentController();

  build() {
    Column() {
      MyComponent({ controller: this.controller })
      Button('change value').onClick(() => {
        this.controller.changeText('Text');
      })
    }
  }
}
```

**推荐用法**

```typescript
class CC {
  value: string = '1';

  constructor(value: string) {
    this.value = value;
  }
}

export class MyComponentController {
  item: CC = new CC('1');

  setItem(item: CC) {
    this.item = item;
  }

  changeText(value: string) {
    this.item.value = value;
  }
}

@Component
export default struct MyComponent {
  public controller: MyComponentController | null = null;
  @State value: CC = new CC('Hello World');

  build() {
    Column() {
      Text(`${this.value.value}`)
        .fontSize(50)
    }
  }

  aboutToAppear() {
    if (this.controller)
      this.controller.setItem(this.value);
  }
}

@Entry
@Component
struct StyleExample {
  controller: MyComponentController = new MyComponentController();

  build() {
    Column() {
      MyComponent({ controller: this.controller })
      Button('change value').onClick(() => {
        this.controller.changeText('Text');
      })
    }
  }
}
```

### Struct支持联合类型的方案

下面这段代码有arkts-no-any-unknown的报错，由于struct不支持泛型，建议使用联合类型，实现自定义组件类似泛型的功能。

**不推荐用法**

```typescript
class Data {
  aa: number = 11;
}

@Entry
@Component
struct DatauionOldPage {
  @State array: Data[] = [new Data(), new Data(), new Data()];

  @Builder
  componentCloser(data: Data) {
    Text(data.aa + '').fontSize(50)
  }

  build() {
    Row() {
      Column() {
        ForEachCom({ arrayList: this.array, closer: this.componentCloser })
      }
      .width('100%')
    }
    .height('100%')
  }
}

@Component
export struct ForEachCom {
  arrayList: any[]; // struct不支持泛型，有arkts-no-any-unknown报错
  @BuilderParam closer: (data: any) => void = this.componentCloser; // struct不支持泛型，有arkts-no-any-unknown报错

  @Builder
  componentCloser() {
  }

  build() {
    Column() {
      ForEach(this.arrayList, (item: any) => { // struct不支持泛型，有arkts-no-any-unknown报错
        Row() {
          this.closer(item)
        }.width('100%').height(200).backgroundColor('#eee')
      })
    }
  }
}
```

**推荐用法**

```typescript
class Data {
  aa: number = 11;
}

class Model {
  aa: string = '11';
}

type UnionData = Data | Model;

@Entry
@Component
struct DatauionPage {
  array: UnionData[] = [new Data(), new Data(), new Data()];

  @Builder
  componentCloser(data: UnionData) {
    if (data instanceof Data) {
      Text(data.aa + '').fontSize(50)
    }
  }

  build() {
    Row() {
      Column() {
        ForEachCom({ arrayList: this.array, closer: this.componentCloser })
      }
      .width('100%')
    }
    .height('100%')
  }
}

@Component
export struct ForEachCom {
  arrayList: UnionData[] = [new Data(), new Data(), new Data()];
  @BuilderParam closer: (data: UnionData) => void = this.componentCloser;

  @Builder
  componentCloser() {
  }

  build() {
    Column() {
      ForEach(this.arrayList, (item: UnionData) => {
        Row() {
          this.closer(item)
        }.width('100%').height(200).backgroundColor('#eee')
      })
    }
  }
}
```