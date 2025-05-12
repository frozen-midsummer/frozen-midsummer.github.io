---
lang: zh-CN
title: Java并发
description: Java并发
sidebar: heading
---

# Java 并发

#### 进程线程区别

**进程：**<span style="background-color: yellow">是程序运行和系统资源分配的基本单位（与线程的根本区别）</span>。

**线程：**是进程的一个实体，<span style="background-color: yellow">是 cpu 调度和分派的基本单位</span>，是比进程更小的能独立运行的单元。

> 进程与线程的区别

- 资源拥有：进程在执行过程中拥有独立的内存单元，而多个线程共享内存资源，减少切换次数，从而效率更高。
- 地址空间：进程有自己独立的地址空间，线程没有自己独立的地址空间。
- 资源开销：进程间切换有较大的开销，线程间切换开销较小。因为进程切换**要切换页目录以使用新的地址空间**，把原进程的数据段代码换出去，把要执行的进程内容换进来。

## 一、多线程基础知识

### 为什么要使用多线程

1. 线程可以看作是轻量级的进程，是程序执行的最小单位，<span style="background-color: yellow">线程间的切换和调度成本远远小于进程</span>。
2. 多核 CPU 时代意味着<span style="background-color: yellow">多个线程可以通过运行，减少了线程上下文切换的开销，且提高了 CPU 的利用率</span>。
3. 现在的系统要求百万级甚至千万级的并发量，合理利用多线程机制<span style="background-color: yellow">可以大大提高系统整体的并发能力以及性能</span>。

---

### 创建线程的四种方式

**方法一 继承 Thread 类，重写 run 方法**

```java
// 构造方法的参数是给线程指定名字，，推荐给线程起个名字
Thread t1 = new Thread("t1") {
     @Override
     // run 方法内实现了要执行的任务
     public void run() {
     log.debug("hello");
     }
};
t1.start();
```

**方法二 实现 Runnable 接口**

```java
// 创建任务对象
Runnable task2 = new Runnable() {
     @Override
     public void run() {
     log.debug("hello");
     }
};
// 参数1 是任务对象; 参数2 是线程名字，推荐给线程起个名字
Thread t2 = new Thread(task2, "t2");
t2.start();
```

**方法三 通过 Callable 和 Future 创建线程**

```java
public class MyCallable implements Callable<Integer> {
    public Integer call() {
        return 123;
    }
}
public static void main(String[] args) throws ExecutionException, InterruptedException {
    MyCallable mc = new MyCallable();
    FutureTask<Integer> ft = new FutureTask<>(mc);
    Thread thread = new Thread(ft);
    thread.start();
    System.out.println(ft.get());
}
```

**方法四 通过线程池创建线程**

---

### Runnable 和 Thread

实现接口会更好一些，因为：

- <span style="background-color: yellow">Java 不支持多继承</span>，因此继承了 Thread 类就无法继承其它类，但是可以实现多个接口；
- <span style="background-color: yellow">继承整个 Thread 类开销过大</span>。
- <span style="background-color: yellow">Thread 是把线程和任务合并在了一起，Runnable 是把线程和任务分开了</span>，用 Runnable 更容易与线程池等高级 API 配合，用 Runnable 让任务类脱离了 Thread 继承体系，更灵活。通过查看源码可以发现，Runnable 其实到底还是通过 Thread 执行的！

---

### Runnable 和 Callable

- Runnable 接口中的 run() 方法的返回值是 void，它做的事情只是纯粹地去执行 run() 方法中的代码而已；

- Callable 接口中的 <span style="background-color: yellow">call() 方法是有返回值的，是一个泛型</span>，和 Future、FutureTask 配合可以用来获取异步执行的结果。

---

### start，run

​ **线程 run()方法是由 java 虚拟机直接调用的**，如果我们没有启动线程(没有调用线程的 start()方法)而是在应用代码中直接调用 run()方法，**那么这个线程的 run()方法其实运行在当前线程**(**即 run()方法的调用在调用方所在的线程**)之中，而不是运行在其自身的线程中，从而违背了创建线程的初衷。

### sleep，yiled，wait，join

- sleep 属于**Thread 类** ：**不释放锁**、释放 cpu；**不会释放锁**，只会**阻塞线程**，让出 cpu 给其它线程，但是它的监控状态依然保持着，当指定时间到了又会自动恢复可运行状态，**可中断**，sleep 给其他线程机会时不考虑线程的**优先级**，因此会给**低优先级的线程以运行的机会**。
- join 属于 Thread 类：释放锁、抢占 cpu；`t.join`：暂停主线程，等到线程 t 执行完。一般用于**等待异步线程执行完结果之后才能继续运行的场景**。例如：主线程创建并启动了子线程，如果子线程中要进行大量耗时运算计算某个数据值，而主线程要取得这个数据值才能运行，这时就要用到 join 方法了
- yield 属于**Thread**类：不释放锁、释放 cpu；**与 sleep 不同的是 yield 不会让线程进入阻塞状态，而是让线程重回就绪状态**，他只需要等待重新获取 CPU 时间，所以**执行 yield()的线程有可能在进入到可执行状态后马上又被执行**。还有一点和 sleep 不同的是 **yield 方法只能使同优先级或更高优先级的线程有执行的机会**。
- wait 属于**Object**类：释放锁、释放 cpu。wait 的过程中线程会释放锁，只有当其他线程调用**notify**才能唤醒此线程。**wait 使用时必须先获取对象锁，即必须在 synchronized 修饰的代码块中使用**，那么相应的 **notify 方法同样必须在 synchronized 修饰的代码块中使用**，如果没有在 synchronized 修饰的代码块中使用时运行时会抛出 IllegalMonitorStateException**的异常**。

补充：

1. sleep，join，yield，interrupted 是 Thread 类中的方法；
2. wait/notify 是 object 中的方法。

---

### 为什么 wait()和 notify()属于 Object 类

**简单说**：因为 synchronized 中的这把锁可以是任意对象，所以任意对象都可以调用 wait()和 notify()；所以 wait 和 notify 属于 Object。

**专业说**：因为这些方法在操作同步线程时，都必须要标识它们操作线程的锁，只有同一个锁上的等待线程，可以被同一个锁上的 notify 唤醒，不可以对不同锁中的线程进行唤醒。

也就是说，等待和唤醒必须是同一个锁。而锁可以是任意对象，所以可以被任意对象调用的方法是定义在 object 类中。

---

### sleep()和 wait()的异同

1. <span style="background-color: yellow">sleep() 是 Thread 类的方法</span>，调用会暂停此线程，但监控依然保持，_不会释放对象锁_，到时间自动恢复；**wait() 是 Object 的方法，调用会放弃对象锁**，进入 WaitSet 等待队列，待调用 notify()/notifyAll() 唤醒指定的线程或者所有线程，才会进入 EntryList 队列竞争锁。
2. 它们都可以被 interrupted 方法中断。
3. sleep() 方法可以在任何地方使用，而 wait() 方法则只能在同步方法或同步块中使用。

---

### 线程、

> **Thread 的源码中定义了 6 种状态：**

1. **new（新建）**：创建后尚未启动。

2. **runnnable（可运行）**：正在 Java 虚拟机中运行。但是在操作系统层面，它可能处于运行状态，也可能等待资源调度。所以该状态的<span style="background-color: yellow">可运行是指可以被运行</span>，具体有没有运行要看底层操作系统的资源调度。

3. **blocked（阻塞）**：请求获取 monitor lock 从而进入 synchronized 函数或者代码块，但是其它线程已经占用了该 monitor lock，所以处于阻塞状态。要结束该状态进入 runnable 需要其他线程释放 monitor lock。

4. **waiting（等待）**：等待其它线程显式地唤醒。阻塞和等待的区别在于，<span style="background-color: yellow">阻塞是被动的</span>，它是在等待获取 monitor lock。而<span style="background-color: yellow">等待是主动的</span>，通过调用 `wait()` 等方法进入。

   | 进入方法                                   | 退出方法                             |
   | ------------------------------------------ | ------------------------------------ |
   | 没有设置 Timeout 参数的 Object.wait() 方法 | Object.notify() / Object.notifyAll() |
   | 没有设置 Timeout 参数的 Thread.join() 方法 | 被调用的线程执行完毕                 |
   | LockSupport.park() 方法                    | LockSupport.unpark(Thread)           |

5. **time waiting （定时等待）**：无需等待其它线程显式地唤醒，在一定时间之后会被系统自动唤醒。

   | 进入方法                                 | 退出方法                                        |
   | ---------------------------------------- | ----------------------------------------------- |
   | Thread.sleep() 方法                      | 时间结束                                        |
   | 设置了 Timeout 参数的 Object.wait() 方法 | 时间结束 / Object.notify() / Object.notifyAll() |
   | 设置了 Timeout 参数的 Thread.join() 方法 | 时间结束 / 被调用的线程执行完毕                 |
   | LockSupport.parkNanos() 方法             | LockSupport.unpark(Thread)                      |
   | LockSupport.parkUntil() 方法             | LockSupport.unpark(Thread)                      |

6. **terminated（终止）**：可以是线程结束任务之后自己结束，或者产生了异常而结束。

> 状态转换

<img src="./%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20211124152959276.png" alt="image-20211124152959276" style="zoom:80%;" />

![image-20220425105010394](./JUC%20&%20操作系统.assets/image-20220425105010394.png)

![image-20220425105048622](JUC%20&%20操作系统.assets/image-20220425105048622.png)

![image-20220425105101564](JUC%20&%20操作系统.assets/image-20220425105101564.png)

---

### ThreadLocal

​ ThreadLocal 类用来**提供线程内部的局部变量**，这种变量在多线程环境下访问时能保证各个线程的变量相对独立于其它线程内的变量。(线程隔离)

​ 每个 Thread 线程内部都有一个 ThreadLocalMap，Map 里面存储**ThreadLocal 对象(key)**和**线程变量副本(value)**，Thread 内部的 Map 是由**ThreadLocal 维护的**，由 ThreadLocal 负责向 map 获取和设置线程的变量值；对于不同的线程，每次获取副本值时，别的线程并不能获取到当前线程的副本值，形成了副本的隔离，互不干扰。

<span style="background-color: yellow">使用场景</span>

​ 每个线程需要有自己单独的实例；实例需要在多个方法中共享，但不希望被多线程共享。例如**存储用户的 Session，因为 Session 在当前会话周期内有效，会话结束便销毁**。还有像线程内上下文管理器、数据库连接等可以用到 ThreadLocal;

​ 向 ThreadLocal 里面存东西就是向他里面的 map 存东西，然后 ThreadLocal 把这个 Map 挂到当前线程的底下，这样 Map 就只属于这个线程了。

<span style="background-color: yellow">使用方式</span>

```java
//接口方法
public T get() {...} //该方法返回当前线程所对应的线程局部变量(先获取当前线程的ThreadLocalMap变量，如果存在则返回值，不存在则创建并返回初始值)
public void set(T value) {...} //设置当前线程的线程局部变量的值(先获取当前线程，并获取当前线程的ThreadLocalMap若不为空，则将参数设置到map中去(当前的ThreadLoca的引用作为key)，如果为空则为该线程创建map并设置初始值)
public void remove() {...} //获取当前线程，并获取其ThreadLocalMap，如果map不为空移除当前ThreadLocal对象对应的entry
protected T initialValue() {...} //返回该线程局部变量的初始值，该方法是一个protected(同包或者不同包的子类)的方法，显然是为了让子类覆盖而设计的。这个方法是一个延迟调用方法，在set方法还没调用而先调用了get方法时才执行，并且仅执行1次。ThreadLocal中的缺省实现直接返回一个null。
```

```java
ThreadLocal<String> mLocal = new ThreadLocal<>();  //创建

// 创建并赋初始值
private static ThreadLocal<String> mLocal = new ThreadLocal<String>(){
            @Override
            protected String initialValue(){
                return "init value";
            }
        };
System.out.println(mLocal.get());

mLocal.set("hello");  // 设置值
mLocal.get() //获取值
```

<span style="background-color: yellow">原理</span> ThreadLocal 原理

​ 每一个线程维护一个 ThreadLocalMap（所以一个线程内可以存在多个 ThreadLocal），key 为使用**弱引用**的 ThreadLocal 实例，value 为**强引用**的线程变量副本。

##### ThreadLocal 和 synchronized 的对比

|        | synchronized                                                        | ThreadLocal                                                                              |
| ------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 原理   | 采用 "以时间换空间" 的方式， 只提供了一份变量，让不同的线程排队访问 | 采用 "以空间换时间" 的方式，为每一个线程都提供了一份变量副本，从而实现同时访问而相不干扰 |
| 侧重点 | 多个线程之间访问资源的同步，用于线程间的数据共享                    | 多线程中让每个线程间数据隔离问题；用于线程间数据隔离                                     |

​ 虽然二者都能解决问题，但是 ThreadLocal 拥有更高的并发性。

<span style="background-color: yellow">Spring 使用 ThreadLocal 解决线程安全问题。</span>

##### ThreadLocal 的内部结构(设计过程)

​ 每个 Thread 线程内部都有一个 ThreadLocalMap，Map 里面存储**ThreadLocal 对象(key)**和**线程变量副本(value)**，Thread 内部的 Map 是由 ThreadLocal 维护的，由 ThreadLocal 负责向 map 获取和设置线程的变量值；对于不同的线程，每次获取副本值时，别的线程并不能获取到当前线程的副本值，形成了副本的隔离，互不干扰。

![image-20220509173403676](JUC%20&%20操作系统.assets/image-20220509173403676.png)

##### ThreadLocalMap 的结构

​ ThreadLocalMap 是 ThreadLocal 的内部类，没有实现 Map 接口，用独立的方法实现了 Map 功能，其内部 Entry 也是独立实现的。

![image-20220531113109305](JUC%20&%20操作系统.assets/image-20220531113109305.png)

**JDK8 中 ThreadLocal 设计方案的好处：**

- 每个 map 存储的 Entry 数量变少
- 当 Thread 销毁时，ThreadLocalMap 也会随之销毁，减少内存的使用。

##### ThreadLocal 在 Spring 中的使用

​ Spring 提供了事务相关的操作，而事务得保证一组操作同时成功或失败，这也就意味着**所有操作需要在同一个数据库连接**上，Spring 就是用 ThreadLocal 来实现的，ThreadLocal 存储类型是一个 Map，Map 中的 key 是 DataSource，**value 是 Connection 对象**。**用了 ThreadLocal 保证了同一个线程获取一个 Connection 对象，从而保证一次事务的所有操作都在同一个数据库连接上**。

##### ThreadLocal 的应用

​ 每个线程需要有自己单独的实例；实例需要在多个方法中共享，但不希望被多线程共享。例如**存储用户的 Session，因为 Session 在当前会话周期内有效，会话结束便销毁**。还有像线程内上下文管理器、数据库连接等可以用到 ThreadLocal;

##### ThreadLocal 内存泄露问题

​ ThreadLocal 内存泄漏的根源是：**由于 ThreadLocalMap 的生命周期跟 Thread 一样长**（在没有手动删除这个 Entry 的前提下，始终有 ThreadRef->currentThread->ThreadLocalMap->enrty(entry 中包含了 ThreadLocal 实例和 value)导致内存泄漏），**如果没有手动删除对应 key(Entry)就会导致内存泄漏**，而不是因为弱引用。

![image-20220531144639200](JUC%20&%20操作系统.assets/image-20220531144639200.png)

<font color='red'>解决办法(避免内存泄漏方法)</font>：

- 使用完 ThreadLocal 后，执行 remove() 操作，手动删除 Entry，避免出现内存泄露。(主要)
- 使用完 ThreadLocal 后，当前 Thread 也随之结束。

**内存泄漏相关概念**：

- Memory Overflow：内存溢出，没有足够的内存提供给申请者使用
- Memory leak：内存泄漏是指程序中已动态分配的堆内存由于某种原因程序未释放或者无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果，内存泄漏的堆积终将导致内存溢出。

**弱引用相关概念：**

- 强引用：就是常见的普通对象的引用，只要还有强引用指向一个对象，就能表明对象还”活着‘’垃圾回收器就不会回收这种对象
- 弱引用：垃圾回收器一旦发现弱引用的对象，不管内存空间足够与否，都会回收它的的内存。

##### ThreadLocal(key) 为什么使用弱引用？

​ ThreadLocalMap 调用`set/get/remove` 方法时，会对 key 为 null 进行判断，如果为 null 的话，那么会对 value 置为 null。

​ 这就意味着使用完 ThreadLocal，线程依然运行的前提下，就算忘记调用 remove 方法，**弱引用比强引用可以多一层保障**，弱引用的 ThreadLocal 会被回收，对应的 value 在下一次 ThreadLocalMap 调用 set，get，remove 的任一方法时会被清除，从而避免内存泄漏，但不能 100% 保证内存不泄露。(**没有调用这些方法**时，此时 value 中的还是有值，且当线程运行时无法被垃圾回收)。

##### ThreadLocal hash 冲突的解决

​ ThreadLocal 使用<span style="background-color: yellow">线性探测法</span>来解决哈希冲突，该方法探测下一个空余地址插入，若整个空间都找不到空余地址，则产生溢出。我们可以把 Entry[ ] table 看作一个环形数组。

![image-20220531160224070](JUC%20&%20操作系统.assets/image-20220531160224070.png)

---

### 如何判断是否线程安全

> 判断一个程序是否存在线程安全问题

1. 是否是多线程环境；
2. 是否存在多个线程修改一个共享资源；

> 线程安全的实现方式

1. 不可变
2. 互斥同步：synchronized 和 ReentrantLock
3. 非阻塞同步：CAS
4. 建立副本：ThreadLocal

---

### Fork/Join 框架

​ Fork/Join 框架是 Java 7 提供的一个用于并行执行任务的框架，是一个把大任务分割成若干个小任务，最终汇总每个小任务结果后得到大任务结果的框架。

1. Fork 把大任务切分成若干个子任务并行的执行。
2. Join 就是合并这些子任务的执行结果。

---

### 生产者消费者模式

​ 在并发编程中使用生产者和消费者模式能够解决绝大多数并发问题。该模式通过平衡生产线程和消费线程的工作能力来提高程序整体处理数据的速度。

​ 为了平衡生产和消费速度不一致的问题，生产者和消费者模式是通过一个<span style="background-color: yellow">容器</span>来解决生产者和消费者的强耦合问题。生产者和消费者彼此之间不直接通信，而是通过<span style="background-color: yellow">阻塞队列</span>来进行通信，所以生产者生产完数据之后不用等待消费者处理，直接扔给阻塞队列，消费者不找生产者要数据，而是直接从阻塞队列里取，阻塞队列就相当于一个缓冲区，平衡了生产者和消费者的处理能力。

​ 这个**阻塞队列就是用来给生产者和消费者解耦的**。纵观大多数设计模式，都会找一个第三者出来进行解耦，如工厂模式的第三者是工厂类，模板模式的第三者是模板类。在学习一些设计模式的过程中，先找到这个模式的第三者，能帮助我们快速熟悉一个设计模式。

---

### 如何控制线程执行顺序

1. 使用 join：每执行一个线程 t，就调用`t.join()`，这样可以使得 main 线程暂停，等到 t 执行完之后再继续调用其他线程。
2. 使用单线程线程池。

## 二、线程池

### 线程池的好处

1. <span style="background-color: yellow">降低资源消耗</span>：通过线程复用，降低线程创建和销毁造成的消耗。
2. <span style="background-color: yellow">提高响应速度</span>：当任务到达时，任务可以不需要的等到线程创建就能立即执行。
3. <span style="background-color: yellow">提高线程的可管理性</span>：线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。

---

### 线程池处理任务的流程

![image-20220224132915100](JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20220224132915100.png)

![image-20220330173207467](JUC%20&%20操作系统.assets/image-20220330173207467.png)

---

### 4 种常见线程池及选择

##### Executors 有四种[线程池](https://so.csdn.net/so/search?q=线程池&spm=1001.2101.3001.7020)的实现方式：

```java
// 快速创建线程池，但是创建的细节未知。不要通过这种方法创建，通过 ThreadPoolExecutor 创建。
ExecutorService executorService = Executors.newCachedThreadPool();
```

| 4 种常见线程池                           | 特点                                                                                                 | 应用场景                                     | 对应的阻塞队列      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------- |
| 固定大小线程池（newFixedThreadPool）     | 核心线程数 = 最大线程数，且有限多                                                                    | 适用于任务量已知，相对耗时的任务             | LinkedBlockingQueue |
| 带缓冲线程池（newCachedThreadPool）      | 核心线程数是 0，最大线程数 INTEGER.MAX_VALUE。意味着全部是救急线程，且可近似认为任务线程数可以无限多 | 任务数比较密集，但每个任务执行时间较短的情况 | SynchronousQueue    |
| 单线程线程池（newSingleThreadExecutor）  | 核心线程数 = 最大线程数 = 1                                                                          | 适用于需要保证顺序执行各个任务               | LinkedBlockingQueue |
| 任务调度线程池（newScheduledThreadPool） | 延时执行 + 定时周期性执行                                                                            | 适用于延时执行或者周期性任务                 | DelayQueue          |

#### 线程池创建多少线程合适

- 线程的 CPU 耗时所占比例越高，就需要越少的线程
- 线程的 IO 耗时所占比例越高，就需要越多的线程
- 针对不同的程序，进行对应的实际测试就可以得到最合适的选择
- 线程数 >= CPU 核心数

CPU 密集型：最佳线程数= cpu 核心数的 1-2 倍

通用公式(IO 密集型也能用)

**线程数 = CPU 核心数 \* (1+ IO 耗时/CPU 耗时)**

---

### ThreadPoolExecutor 的参数

① **corePoolSize**：常驻核心线程数。即使本地任务执行完，核心线程也不会被销毁。

② **maximumPoolSize**：线程池能够容纳同时执行的线程最大数， `maximumPoolSize ≥ 1` 。

③ **keepAliveTime**：线程空闲时间，线程空闲的时间达到该值后会被销毁，直到只剩下 corePoolSize 个线程为止，避免浪费内存资源。

④ **unit**：keepAliveTime 的时间单位。

⑤ **workQueue**：工作队列，当线程请求数 ≥ `corePoolSize` 时，线程会进入<span style="background-color: yellow">阻塞队列</span>。

⑥ **threadFactory**：线程工厂，用来生产一组相同任务的线程。可以给线程命名，有利于分析错误。

⑦ **handler**：拒绝策略。如果创建线程数达到 `maximumPoolSize` 仍然有新任务这时会执行拒绝策略。

```java
// ThreadPoolExecutor 的构造方法
public ThreadPoolExecutor(int corePoolSize,
                      int maximumPoolSize,
                      long keepAliveTime,
                      TimeUnit unit,
                      BlockingQueue<Runnable> workQueue,
                      ThreadFactory threadFactory,
                      RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
            throw new IllegalArgumentException();
    if (workQueue <span style="background-color: yellow"> null || threadFactory </span> null || handler == null)
        throw new NullPointerException();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```

---

### 创建、关闭线程池

**创建：**

```java
// 《阿里巴巴 Java 开发手册》中强制线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险
ThreadPoolExecutor executor = new ThreadPoolExecutor(7, 8, 5,
                                                     TimeUnit.SECONDS, new LinkedBlockingDeque<Runnable>());
```

**关闭：**

​ `shutdown` 或 `shutdownNow` 。原理是遍历线程池中的工作线程，然后逐个调用线程的 `interrupt` 方法中断线程，无法响应中断的任务可能永远无法终止。

1. `shutdownNow` 首先将线程池的状态设为 `STOP`，然后尝试停止正在执行或暂停任务的线程，并返回等待执行任务的列表。
2. `shutdown` 只是将线程池的状态设为` SHUTDOWN`，然后中断没有正在执行任务的线程，不接受新任务，继续处理现有任务。

​ 通常调用 `shutdown` 来关闭线程池，如果任务不一定要执行完可调用 `shutdownNow`。

---

### handler 拒绝策略

拒绝策略 JDK 提供了 4 种实现：

| JDK 提供的拒绝策略  | 说明                                            |
| ------------------- | ----------------------------------------------- |
| AbortPolicy         | 直接抛出异常，<font color='red'>默认策略</font> |
| CallerRunsPolicy    | 用调用者所在的线程来执行任务                    |
| DiscardOldestPolicy | 丢弃阻塞队列中靠最前的任务，将新的任务添加      |
| DiscardPolicy       | 直接丢弃任务                                    |

---

### execute() / submit() 的区别

1. `execute() `用于提交不需要返回值的任务，所以无法判断任务是否被线程池执行成功与否；

2. `submit() `用于提交需要返回值的任务。

   ​ 线程池会返回一个 `Future` 类型的对象，可以通过 `Future` 的 `get()`方法来获取返回值，`get()`方法会阻塞当前线程直到任务完成，而使用 `get(long timeout，TimeUnit unit)`方法则会阻塞当前线程一段时间后立即返回，这时候有可能任务没有执行完。

---

### 阻塞队列

​ 阻塞队列相比普通队列，<span style="background-color: yellow">支持阻塞的插入和移除</span>。阻塞队列常用于生产者和消费者的场景，阻塞队列就是生产者用来存放元素，消费者用来获取元素的容器。

1. 当队列满时，会阻塞插入元素的线程，直到队列不满。
2. 当队列为空时，获取元素的线程会被阻塞，直到队列非空。

**Java 中的阻塞队列**

`ArrayBlockingQueue`，由数组组成的有界阻塞队列，默认情况下不保证线程公平，有可能先阻塞的线程最后才访问队列。

`LinkedBlockingQueue`，由链表结构组成的有界阻塞队列，队列的默认和最大长度为 Integer 最大值。

`PriorityBlockingQueue`，支持优先级排序的无界阻塞队列，默认情况下元素按照升序排序。可自定义 `compareTo` 方法指定排序规则，或者初始化时指定 Comparator 排序，不能保证同优先级元素的顺序。

`DelayQueue`，支持延时获取元素的无界阻塞队列，使用优先级队列实现。创建元素时可以指定多久才能从队列中获取当前元素，只有延迟期满时才能从队列中获取元素，适用于缓存和定时调度。

`SynchronousQueue`，不存储元素的阻塞队列，每一个 put 必须等待一个 take。默认使用非公平策略，也支持公平策略，适用于传递性场景，吞吐量高。

`LinkedTransferQueue`，链表组成的无界阻塞队列。

`LinkedBlockingDeque`，链表组成的双向阻塞队列，可从队列的两端插入和移出元素，多线程同时入队时减少了竞争。

> 实现原理

​ 使用<span style="background-color: yellow">通知模式</span>实现：生产者往满的队列里添加元素时会阻塞，当消费者消费后，会通知生产者当前队列可用。当往队列里插入一个元素时，如果队列不可用，主要通过 LockSupport 的 `park()` 方法阻塞生产者，不同操作系统中实现方式不同，在 Linux 下使用的是系统方法 `pthread_cond_wait` 实现。

---

### 线程池的生命周期、状态

<img src="./%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20&%20JUC.assets/image-20220126103647342.png" alt="image-20220126103647342" style="zoom: 67%;" />

- RUNNING：接收新的任务并处理队列中的任务。
- SHUTDOWN：不接受新任务，处理队列中剩余任务
- STOP：不接受新任务，不处理队列中的任务，同时中断处理中的任务
- TIDYING：所有任务处理完成，执行函数 `terminated()` 进入 TERMINATED 状态
- TERMINATED：线程池彻底终止

---

### 线程池中的线程数一般怎么设置？

1.  **线程池中线程执行任务的性质：**计算密集型的任务比较占 cpu，所以一般线程数设置的大小等于或者略微大于 cpu 的核数；但 IO 型任务主要时间消耗在 IO 等待上，cpu 压力并不大，所以线程数一般设置较大。
2.  **cpu 使用率：**当线程数设置较大时，线程的初始化，切换，销毁等操作会消耗不小的 cpu 资源，使得 cpu 利用率一直维持在较高水平。
3.  **内存使用率：**线程数过多和队列的大小都会影响此项数据，队列的大小应该通过前期计算线程池任务的条数，来合理的设置队列的大小，不宜过小，让其不会溢出，因为溢出会走拒绝策略，多少会影响性能，也会增加复杂度。
4.  **下游系统抗并发能力：**多线程给下游系统造成的并发等于你设置的线程数，例如：如果是多线程访问数据库，你就考虑数据库的连接池大小设置，数据库并发太多影响其 QPS，会把数据库打挂等问题。

## 三、JMM(JAVA 内存模型)⭐

并发问题产生的三大根源：**可见性、有序性和原子性**。

​ JMM(Java 内存模型)规定了**虚拟机**和**计算机内存**之间是如何协同工作的，**也就是一个线程何时可以看到由其他线程修改的变量，以及如何同步访问的共享变量**。JMM 中的几点规定：**JMM 规定所有变量都存储在主内存**；<font color='red'>每个线程都有自己的工作内存，线程的工作内存保存了该线程用到的变量和主内存共享变量的副本拷贝，线程对变量的操作都在工作内存中，线程不能直接读写主内存中的变量</font>。

​ java 为了屏蔽硬件和操作系统访问内存的各种差异，提出了 JAVA 内存模型的规范，保证了 JAVA 程序在各种平台下对内存的访问都能得到一致效果。**Java 内存模型是一种规范(规则)，Java 虚拟机会实现这种规范**。

![image-20220505103121140](JUC%20&%20操作系统.assets/image-20220505103121140.png)

### 主存与工作内存

​ 主内存：主内存是虚拟机内存的部分(java 内存模型(JMM)规定了所有的变量都存储在主内存中)。

​ 工作内存：每条**线程**还有自己的工作内存(working memory)，可以比作高速缓存。

​ 线程的工作内存中保存了该线程使用到的变量的主内存副本拷贝，线程对变量的所有操作(读取、赋值)都必须在工作内存中进行，而**不能直接读写主内存中的变量**。不同的线程之间也无法直接访问对方工作内存中的变量，线程间变量值的传递需要通过主内存来完成。

### 原子性、可见性、有序性

原子性：同一时刻只能有一个线程对数据进行操作。

可见性：一个线程对主内存的修改可以及时地被其他线程看到，（synchronized、volatile、final）；

有序性：一个线程观察其他线程中的指令执行顺序，由于指令重排序，该观察结果一般杂乱无序。(happens-before 原则)

#### 如何保证原子性？

通过**互斥同步方式**保证原子性，如：synchronized、ReentrantLock、Atomic、CAS。

#### 如何保证可见性？

1. synchronized

   - 加锁时，必须清空工作内存中共享变量值，从主内存获取最新共享变量值

   - 解锁时，将工作内存修改的共享变量刷新到主内存中

2. volatile

   当一个变量被声明为 volatile 时，<font color='red'>线程操作 volatile 变量都是直接操作主存</font>：

   - 线程读取共享变量时，会先清空工作内存中变量值，再从主内存中获取最新值
   - 线程写入共享变量时，直接把值刷新回主内存

#### 如何保证有序性？

​ 由于处理器为了提高程序运行效率，可能会对代码进行<span style="background-color: yellow">指令重排</span>，它不保证程序中各语句执行先后顺序同代码中顺序一致，但它在进行重排序时会考虑指令之间的数据依赖性，保证程序最终执行结果和代码顺序执行的结果一致。

##### 打破有序性的三种重排序

- **编译器优化的重排序**：编译器在不改变单线程程序语义放入前提下，可以重新安排语句的执行顺序
- **指令级并行的重排序**：现代处理器采用了指令级并行技术来将多条指令重叠执行。如果不存在数据依赖性，**处理器可以改变语句对应的机器指令的执行顺序**，也就是**CPU 原生就有可能将指令进行重排**。
- **内存系统的重排序**：CPU 架构下很有可能有 store buffer/invalid queue 缓冲区，这种异步很可能会导致指令重排。

1. synchronized

   被 synchronized 修饰的代码是单线程执行的，单线程执行内部无论指令是否重排序，结果一致。(但是 synchronized 无法阻止指令重排，**并且 synchronized 的有序性也是在其保护的代码块中**，例如 dcl 双重校验锁不加 volatile 时出现的问题，就是因为 INSTANCE 不止在 synchronized 代码块中有，在第一个 if 中也出现了(没有在 synchronized 中)，因此出现了安全问题，但这个安全问题不是因为其有序性，而是因为这个对象在代码块也有)。**synchronized 可以保证共享变量的原子、有序、可见性但是要保证共享变量都在 synchronized 代码块中。**

2. volatile

   volatile 修饰的变量，可以禁止指令重排。

---

### JMM 中缓存一致性(CPU 层级下)

- 总线锁，就是锁总线，对共享变量的修改在相同时刻只允许一个 CPU 操作。
- 缓存锁是锁缓存行(cache line)，其中较出名的是 MESI 协议，对缓存行标记状态，通过“同步通知”的方式，来实现(缓存行)数据的可见性和有序性。(MESI 大概的原理就是当每个 CPU 读取共享变量之前，会先识别数据的对象状态(是修改、还是共享、还是独占、还是无效)**如果是独占**，说明当前 CPU 将要得到的变量数据是最新的，没有被其他 CPU 同时读取；**如果是共享**，说明当前 CPU 将要得到的变量还是最新的，有其他的 CPU 在同时读取，但还没被修改；**如果是修改**，说明当前 CPU 正在修改该变量的值，同时会向其他 CPU 发送该数据状态为 invalid 的通知，得到其他 CPU 的响应后(其他 CPU 将数据状态从共享变为 invalid)，当前 CPU 将高速缓存的数据写到主存，并把自己的状态从修改变成独占；**如果是无效**，说明当前数据时被改过了，需要从主从重新读取最新的数据)。
- 但“同步通知”会影响性能，所以会有**内存缓冲区(store buffer/invalid queue)**来实现**异步**进而提高 CPU 的工作效率。(异步原理：之前在修改的同时会告诉其他 CPU，而现在则把最新修改值写到**store buffer**，**并通知其他 cpu 记得要修改状态，随后 CPU 便可返回干其他事了**，等到其他 cpu 发过来响应消息，再将(store buffer 中的)数据更新到高速缓存以及主存中。其他 CPU 接收到 invalid 通知时，也会把接收到的消息放入 invalid queue 中，只要写到 invalid queue 就会直接返回告诉修改数据的 CPU，自己已将状态设置为 invalid)。
- 但引入内存缓冲区后(异步)，又会存在可见性和有序性的问题(后面的指令查不到前面指令的执行结果(指令的执行顺序并非代码执行顺序)例如当 CPU 修改完 A 值，写到 store buffer 了，CPU 就可以干其他事了，但如果 CPU 指令又接收指令需要修改 A 值，但上一次修改的值还在 store buffer 中，没修改至高速缓存)，因此当需要强可见性和有序性时，只能“禁用”缓存的优化。(“禁止“缓存优化：(同核心)在 CPU 读取的时候，首先要去 store buffer 看看存不存在，存在则直接取，不存在才读取主存的数据；(不同核心)CPU1 修改了 A 值，已把修改后值写到了 store buffer，并通知 CPU2 对该值进行 invalid 操作，但是 CPU2 可能还没接收到 invalid 通知，就去做了其他操作导致 CPU2 读到的还是旧值，即便 CPU2 接收到了 invalid 通知，但 CPU1 的值还没写到主存，那么 CPU2 再次向主存读取的时候，还是旧值)
- “禁用”缓存优化在 CPU 层面下有**内存屏障**，读屏障/写屏障/全能屏障，本质上是插入一条“屏障指令”，**只要遇到这条指令，那前面的操作都得完成**，使得缓冲区(store buffer/invalid queue)在屏障指令之前的操作均已被处理，进而达到读写在 CPU 层面上是可见和有序的。(**写屏障**：CPU 当发现写屏障的指令时，会把该指令之前的存在于 store buffer 所有写指令刷入高速缓存，通过这种方式就可以让 CPU 修改的数据可以马上暴露给其他 CPU，达到写操作可见性的效果；**读屏障**：CPU 当发现读屏障的指令时，就会把该指令之前存在于 invalid queue 所有的指令处理掉，通过这种方式就可以确保当前 cpu 的缓存状态是正确的，读操作读取的一定是最新效果)

### JMM 的内存交互(变量如何从主内存到本地内存以及从本地内存到主内存)

​ 内存交互操作一共有 8 种，lock，read，load，use，assign，store，write，unlock

![image-20220505114551077](JUC%20&%20操作系统.assets/image-20220505114551077.png)

​ 线程读写数据的流程：

- 读数据：lock 加锁从主内存中 read 数据，然后把数据 load 到工作内存中，线程 use 数据(把工作内存中的数据传给执行引擎 use)
- 写数据：使用完成后，线程 assign 数据到工作内存(把从执行引擎收到的值赋给工作内存中的变量)，把数据从工作内存中 store 到主内存，并把数据 write 到主内存汇总，unlock 释放锁。

### JMM 的作用是什么？

​ Java 内存模型是围绕着在并发过程中如何处理<span style="background-color: yellow">原子性、可见性和有序性</span>这三个特征来建立的。

​ Java 线程的通信由 JMM 控制，<span style="background-color: yellow">其主要目的是定义程序中各种变量的访问规则</span>，即关注在 JVM 中把变量值存储到内存和从内存中取出变量值这样的细节。这里的变量与 Java 编程中的变量不同，包括实例字段、静态字段，但不包括局部变量与方法参数，因为它们是线程私有的，不存在多线程竞争。

​ JMM 遵循一个基本原则：只要不改变程序执行结果，编译器和处理器怎么优化都行。例如编译器分析某个锁只会单线程访问就消除锁，某个 volatile 变量只会单线程访问就把它当作普通变量。

​ JMM 规定所有变量都存储在主内存，每条线程有自己的工作内存，工作内存中保存被该线程使用的变量的主内存副本，线程对变量的所有操作都必须在工作空间进行，不能直接读写主内存数据。不同线程间无法直接访问对方工作内存中的变量，线程通信必须经过主内存。

​ 关于主内存与工作内存的交互，即变量如何从主内存拷贝到工作内存、从工作内存同步回主内存，JMM 定义了 8 种**原子操作**：

| 操作   | 作用变量范围 | 作用                                   |
| ------ | ------------ | -------------------------------------- |
| lock   | 主内存       | 把变量标识为线程独占状态               |
| unlock | 主内存       | 释放处于锁定状态的变量                 |
| read   | 主内存       | 把变量值从主内存传到工作内存           |
| load   | 工作内存     | 把 read 得到的值放入工作内存的变量副本 |
| use    | 工作内存     | 把工作内存中的变量值传给执行引擎       |
| assign | 工作内存     | 把从执行引擎接收的值赋给工作内存变量   |
| store  | 工作内存     | 把工作内存的变量值传到主内存           |
| write  | 主内存       | 把 store 取到的变量值放入主内存变量中  |

---

### happens-before 是什么？

​ <span style="background-color: yellow">happens-before 并不是说前一个操作发生在后一个操作前面，而是说前一个写操作结果对后续操作是可见的(且前一个操作按顺序排在第二个操作之前)，如：A happens-before B</span>（规定了对共享变量的写操作对其他线程的读操作可见。）

​ 在 JMM 中，如果一个操作执行的结果需要对另一个操作可见，那么这两个操作之间必须存在 happens-before 关系。happens-before 原则非常重要，**它是判断数据是否存在竞争、线程是否安全的主要依据**。

​ 如果 JMM 中所有的有序性（编译优化）都仅靠 volatile 和 synchronized 来完成，那么很多操作都将会变得非常啰嗦。所以<span style="background-color: yellow">使用 happens-before 规则定义一些禁止编译优化的场景</span>，保证并发编程的正确性。

| happens-before | 说明                                                                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 程序次序规则   | 对于单独线程中的每个操作，按照程序的顺序，前面的操作 happens-before 后续的任何操作。                                                               |
| 管程锁定规则   | 一个 unlock 解锁操作(例如 synchronized 执行完)先行发生于后面对同一个锁的 lock 操作。                                                               |
| volatile 规则  | 对一个 volatile 变量的写操作先行发生于后面对这个变量的读操作                                                                                       |
| 传递规则       | 如果 A happens-before B，B happens-before C，那么 A happens-before C                                                                               |
| 线程启动规则   | Thread 对象的 start() 方法先行发生于此线程的每一个动作。                                                                                           |
| 线程终止规则   | 对线程 interrupt( ) 方法的调用先行发生于被中断线程的代码检测到中断事件的发生                                                                       |
| 线程终止规则   | 线程中的所有操作都先行发生于对此线程的终止检测，我们可以通过 Thread::join()方法是否结束、Thread::isAlive()的返回值等手段检测线程是否已经终止执行。 |
| 对象终结规则   | 一个对象的初始化完成先行发生于他的 finalize()方法的开始                                                                                            |

---

### as-if-serial 是什么？

​ `as-if-serial`语义的意思是：**不管怎么重排序，单线程程序的执行结果不能改变**。编译器和处理器必须遵循 as-if-serial 语义。

​ 为了遵循 as-if-serial，**编译器和处理器不会对存在数据依赖关系的操作重排序，因为这种重排序会改变执行结果**。但是如果操作之间不存在数据依赖关系，这些操作就可能被编译器和处理器重排序，if-serial 把单线程程序保护起来，给程序员一种幻觉：单线程程序是按程序的顺序执行的。

​ 数据依赖性(关系)：仅针对单个处理器中执行的指令序列和单个线程中执行的操作，不同处理器之间和不同线程之间的数据依赖性不被编译器和处理器考虑。

​ 在单线程程序中，对存在控制依赖的操作重排序(有数据依赖的不会重排序，没有数据依赖的才会重排序)，不会改变执行结果。

​ 在多线程程序中，对存在控制依赖的操作重排序，可能会改变程序的执行结果。（因为在单个线程中两个操作没有依赖性，随便重排序，但另一个线程中的操作可能与这个线程的操作有数据依赖关系，因此由其重排序可能会改变数据结果）

---

### as-if-serial 和 happens-before 有什么区别？

​ as-if-serial 保证**单线程程序**的执行结果不变，happens-before 保证**正确同步的多线程程序的执行结果不变**。

这两种语义的目的都是为**了在不改变程序执行结果的前提下尽可能提高程序执行并行度**。

---

### volatile 关键字

​ 把变量声明为 `volatile` ，是在告诉 JVM，这个变量是**共享且不稳定**的，每次使用它都到主存中进行读取。

作用：就是在 volatile 前后加上内存屏障，使得编译器和 CPU 无法进行重排序，致使有序，并且写 volatile 变量对其他线程可见。

<span style="background-color: yellow">在 AQS 的 state、JDK1.7 的 ConcurrentHashMap 里面使用了。</span>

> volatile 原理

读写 volatile 变量时会加入<span style="background-color: yellow">内存屏障保证可见性和有序性</span>。

- 对 volatile 变量的<span style="background-color: yellow">写指令后会加入写屏障</span>，保证在该**屏障之前对共享变量的改动，都同步到主存中**；
- 对 volatile 变量的<span style="background-color: yellow">读指令前会加入读屏障</span>，保证在该**屏障之后对共享变量的读取，加载的是主存中的数据**。

#### volatile 和 synchronized 的区别 ⭐

1. volatile 本质是在告诉 JVM 当前变量在寄存器（**工作内存**）中的值是不确定的，**每次使用都需要从主存中读取**；synchronized 则是锁定当前变量，**只有当前线程可以访问该变量，其他线程被阻塞住**。
2. volatile 仅能使用在变量级别；synchronized 则可以使用在变量、方法和类级别。
3. volatile 能保证可见性、有序性，不能保证原子性；而 synchronized 则可以保证有序性、可见性和原子性。
4. volatile 不会造成线程的阻塞；synchronized 可能会造成线程的阻塞。
5. volatile 标记的变量不会被编译器优化；synchronized 标记的变量会被编译器优化。

## 四、锁

### 锁设计 & 锁分类

​ Java 中我们最常用的锁应该就是 Synchronized 以及 ReentrantLock，**一个是 JVM 关键字，依赖于操作系统的系统调用实现的锁**，一个是 J.U.C 包下基于 AQS 实现一种可重入锁，**其原理主要是利用 cas 修改一个 volatile 修饰的 int 变量来标识是否获取到锁的**， 如果 state 变量不为 0 则证明当前有线程正在持有锁。

**根据默认是否有其它线程修改数据划分**可以分为<span style="background-color: yellow">乐观锁和悲观锁</span>

- 乐观锁的概念认为当前线程在操作数据的过程中不会有其他线程修改数据，操作数据过程中不加锁，CAS 是乐观锁的一种实现。CAS 即比较并交换，即比较内存中的值和期望的值是否相同，相同才将新的值更新。
- 悲观锁认为共享变量一定会有其他线程来修改，所以操作共享变量的时候一定要先加锁。Java 中的 Synchronized 以及 ReentrantLock 都是悲观锁。

**根据获取不到锁的线程如何处理划分**可以分为<span style="background-color: yellow">轻量级锁和重量级锁</span>

- 重量级锁的概念是如果锁已经被持有了，当前线程获取不到锁，**当前线程挂起，等待锁的释放以及被唤醒**。
- 轻量级锁的概念是如果锁已经被持有了，当前线程获取不到锁，那么将自旋一段时间，等待锁的释放。这样设计的原因是大部分情况下我们占用锁的线程很快就执行完了，在很短的时间内就释放了锁，如果是重量级锁，那么下一个线程想获取锁继续执行的话需要经历挂起以及唤醒，这个过程需要 CPU 上下文切换，这个时间开销甚至大于用户代码执行的时间，所以轻量级锁让线程等一会，锁一旦释放，当前线程可以立马获取到，省去了不必要的上下文切换的开销。

**根据抢锁规则的设计划分**可以分为<span style="background-color: yellow">公平锁和非公平锁</span>

- 公平锁的概念是如果当前一个线程已经获取到锁了，其他线程如果再想获取到锁的话需要排队。
- 非公平锁的概念是如果当前一个线程已经获取到锁了，那么新来的线程如果再想获取到锁先 CAS 抢一下，如果抢到了就执行代码，抢不到再去排队。

JDK 中的 ReentrantLock 既支持非公平锁又支持公平锁，默认非公平锁。用通过`final ReentrantLock lock = new ReentrantLock(true);`设置公平锁。

<span style="background-color: yellow">重入锁与非重入锁</span>

- 所谓重入锁，即一个线程如果获取到了锁，那么这个线程下一次进入同步代码中的时候可以直接进入，不用重新获取锁，我们最熟悉的 sychronized 和 ReentrantLock 都是可重入锁。

<span style="background-color: yellow">独占锁与共享锁</span>

- 独占锁的概念是如果有一个线程已经获取到了锁，其他线程不可以继续获取锁，锁只能有此线程独占。
- 共享锁的概念是一个锁可以有多个线程共享，即一个线程获取到了锁，其他线程还可以继续获取锁。

基于 AQS 实现的 ReentrantLock 就是独占锁，而 AQS 也提供了实现共享锁的模版方法 tryAcquireShared。

---

### synchronized

- JDK6 对锁的实现引入了大量的优化，如自旋锁、适应性自旋锁、锁消除、锁粗化、偏向锁、轻量级锁等技术来减少锁操作的开销。
- synchronized 底层原理属于 JVM 层面，<span style="background-color: yellow">Java 对象头和 Monitor 是实现 synchronized 的基础</span>。
- 从**字节码角度**来看，执行同步代码块时首先要执行 `monitorenter` 指令，退出时执行 `monitorexit` 指令。
  1. 当执行 `monitorenter` 指令时，线程试图获取锁也就是对象监视器`Monitor`的持有权。在执行`monitorenter`时，会尝试获取对象的锁，如果锁的计数器为 0 则表示锁可以被获取，获取后将锁计数器设为 1(锁计数器+1)。
  2. 对象锁的的拥有者线程才可以执行 `monitorexit` 指令来释放锁。在执行 `monitorexit` 指令后，将锁计数器设为 0 (锁计数器-1)，表明锁被释放，其他线程可以尝试获取锁。

* `synchronized` 修饰的方法并没有 `monitorenter` 指令和 `monitorexit` 指令，取得代之的确实是 `ACC_SYNCHRONIZED` 标识，该标识指明了该方法是一个同步方法。不过本质都是对`Monitor`的获取。

#### synchronized 修饰方法：

1. 修饰非静态方法(成员方法)，锁是**当前的实例对象**，俗称“对象锁”。
2. 修饰静态方法，锁是类的 class 对象，俗称“类锁”。
3. 修饰代码块，锁是 Synchronized 括号里的对象。
4. **不能修饰变量**。

---

#### Mark Word 结构

32 位系统的对象头(运行时元数据和类型指针)中 Mark Word 结构：

![image-20220310101553083](JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20220310101553083.png)

锁标志位：

1. 00 轻量级锁
2. 01 偏向锁
3. 10 重量级锁
4. 11 GC 标志

---

#### Monitor 原理

​ **Monitor**被翻译为**监视器**或者说**管程**，由 C++实现。是操作系统提出的一种高级原语，在 Java 中看不到它的存在。另外，由于`wait/notify`方法也依赖于`monitor`对象，所以只有在 synchronized 修饰代码块或者方法里才能调用`wait() / notify()`方法，否则会抛出`java.lang.IllegalMonitorStateException`的异常的原因。

​ <span style="background-color: yellow">每个 java 对象都内置了一个 Monitor</span>，如果使用 synchronized 给对象上锁（重量级），该对象头(对象头包含两个部分：**运行时元数据(Mark Word)**和**类型指针(Klass Word)**)的`Mark Word`就会指向`Monitor`对象。

![image-20220318093841237](JUC%20&%20操作系统.assets/image-20220318093841237.png)

<img src="./%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20211124205406628.png" alt="image-20211124205406628" style="zoom: 67%;" />

**执行流程：**

- 当 Thread-2 执行 `synchronized(obj) `就会将 Monitor 的所有者 Owner 置为 Thread-2。

- 在 Thread-2 获取 Monitor 之后，如果其他线程也来执行 `synchronized(obj)`，就会进入 EntryList，处于阻塞态。
- <span style="background-color: yellow">解锁</span>：Thread-2 执行完同步代码块的内容后，将 Owner 设置为 null，然后唤醒 EntryList 中所有等待线程来同时竞争锁。
- 图中 WaitSet 中的 Thread-0，Thread-1 是之前获得过锁，但没有获得锁而进入 WAITING 状态的线程。

---

### Synchronized 锁升级

- **目的**：减少获得锁和释放锁带来的性能消耗。

- 锁存在四种状态，分别是<span style="background-color: yellow">无锁、偏向锁、轻量级锁、重量级锁</span>，这几个状态会随着竞争情况逐渐升级，<span style="background-color: yellow">锁可以升级但不可以降级</span>。

- 偏向锁默认是延迟的，所以 synchronized 一般使用的是轻量级锁，只有在关闭延迟后，才会使用偏向锁。

| 锁       | 优点                             | 缺点                                               |
| -------- | -------------------------------- | -------------------------------------------------- |
| 偏向锁   | 加锁和解锁不需要额外的消耗       | 如果线程间存在锁竞争，会带来额外的**锁撤销**的消耗 |
| 轻量级锁 | 锁重入不阻塞，程序响应速度快     | 线程一直不能获取锁的时候会自旋消耗 CPU             |
| 重量级锁 | 线程竞争不使用自旋，不会消耗 CPU | 线程阻塞，响应时间缓慢                             |

**对象头包含两个部分**：**运行时元数据(Mark Word)**和**类型指针(Klass Word)**。

#### 轻量级锁

​ 轻量级锁的使用场景是：如果一个对象虽然有多个线程要对它进行加锁，但是加锁的时间是错开的（也就是没有线程产生实际竞争），那么可以使用轻量级锁来进行优化。

> 执行原理

<span style="background-color: yellow">加锁</span>

​ 轻量级锁对使用者是透明的，即语法仍是 synchronized。

​ 每次指向到`synchronized`代码块时，JVM 会先在当前线程的栈桢中创建用于**存储锁记录的空间(锁记录对象)**，并将对象头中的 Mark Word 复制到锁记录中。然后线程尝试**使用 CAS 将锁对象头中的 Mark Word 替换为指向锁记录的指针**。如果替换成功，表示当前线程加轻量级锁成功；如果替换失败，有两种情况：

- 如果是其它线程获取本对象上的锁，表明有竞争，<span style="background-color: yellow">进入锁膨胀</span>。
- 如果是当前线程再次获取本对象上的锁，那么在当前栈帧中再添加一条锁记录作为<span style="background-color: yellow">锁重入</span>的计数。

<span style="background-color: yellow">解锁</span>

当线程退出 synchronized 代码块的时候，有两种情况：

- 如果有取值为 null 的锁记录，表示有锁重入，这时重置锁记录，让重入计数减 1。

- 如果取值不为 null，使用 CAS 将 Mark Word 的值恢复给对象头：

  1. 成功则代表解锁成功。

  2. 失败，则说明轻量级锁进行了锁膨胀或已经升级为重量级锁，进入重量级锁解锁流程。

     ![image-20220509222450764](JUC%20&%20操作系统.assets/image-20220509222450764.png)

#### 偏向锁(用来优化轻量级锁的锁重入问题)

- HotSpot 的作者发现：**大多数情况下，锁不仅不存在多线程竞争，而且总是由同一线程多次获得**，因此有了偏向锁。由于轻量级锁在没有竞争时，每次重入仍然需要执行 CAS 操作，<span style="background-color: yellow">引入偏向锁，用来优化轻量级锁的锁重入问题。</span>

* 第一次使用时，通过 <span style="background-color: yellow">CAS 将线程 ID 设置到锁对象头的 Mark Word</span>， 之后如果再次执行锁重入时，发现这个线程 ID 是自己的就表示没有竞争，<span style="background-color: yellow">不用重新 CAS</span>，以后只要不发生竞争，这个对象锁就归该线程所有。

> 如何撤销偏向锁 - 调用 wait/notify

- 其他线程使用该对象

- 调用 wait/notify，会使对象的锁变成重量级锁，因为`wait() / notify()`方法之后重量级锁才支持。
- 调用对象的 hashcode(如果一个对象的 hashCode()方法已经被调用过一次之后，这个对象还能被设置偏向锁么？答案是不能。因为如果可以的化，那 Mark Word 中的 identity hash code 必然会被**偏向线程**Id 给覆盖(导致 hashcode 没有地方放，此时锁会膨胀为重量级)，这就会造成同一个对象前后两次调用 hashCode()方法得到的结果不一致。)

> 批量重偏向

​ 如果对象被多个线程访问，但是没有竞争，这时候偏向了线程 t1 的对象又有机会重新偏向线程 t2，即可以不用升级为轻量级锁，要实现重新偏向是要有条件的：当撤销偏向锁达到阈值 20 次后，jvm 会这样觉得，我是不是偏向错了呢，于是会在给这些对象加锁时重新偏向至 t2。因为前 19 次是轻量，释放之后为无锁不可偏向，但是 20 次后面的是偏向 t2，释放之后依然是偏向 t2。

> 批量撤销

​ 当一个偏向锁如果撤销次数到达 40 的时候，JVM 就认为这个对象设计的有问题；那么 JVM 会把这个对象所对应的类所有的对象都撤销偏向锁；并且新实例化的对象也是不可偏向的。

---

---

#### 锁膨胀(轻量级锁变重量级锁)

​ 如果在尝试加轻量级锁的过程中，CAS 操作无法成功，有一种情况就是其它线程已经为这个对象加上了轻量级锁，此时就要进行锁膨胀，将轻量级锁变成重量级锁。

1. 当 Thread-1 进行轻量级加锁时，Thread-0 已经对该对象加了轻量级锁

   <img src="./%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/20200309203715-909034.png" alt="1583757433691" style="zoom: 67%;" />

2. 这时 Thread-1 加轻量级锁失败，进入锁膨胀：即为对象申请 Monitor 锁，让 Object 指向重量级锁地址，然后自己进入 Monitor 的 EntryList 变成 BLOCKED 状态

   <img src="./%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/20200309203947-654193-16377605441685.png" alt="1583757586447" style="zoom:67%;" />

3. 当 Thread-0 退出 synchronized 同步块时，使用 CAS 将 Mark Word 的值恢复给对象头，失败(因为那是轻量级锁的解锁方式，现在已经是重量级锁了)。那么会进入重量级锁的解锁过程，即按照 Monitor 的地址找到 Monitor 对象，将 Owner 设置为 null，唤醒 EntryList 中的 Thread-1 线程。

---

### Synchronized 锁优化

#### 自旋优化

- 重量级锁竞争的时候，还可以使用自旋来进行优化，即当一个线程正在执行时另一个线程访问同步块获取锁时，不直接进入阻塞状态进行等待，而是进行自旋重试等待如果当前线程自旋成功（即在自旋的时候持锁的线程释放了锁），那么当前线程就可以不用进行上下文切换就获得了锁。
- 自旋会占用 CPU 时间，单核 CPU 自旋就是浪费，多核 CPU 自旋才能发挥优势。在<span style="background-color: yellow">JDK 6 之后自旋锁是自适应的</span>，比如对象刚刚的一次自旋操作成功过，那么认为这次自旋成功的可能性会高，就多自旋几次；反之，就少自旋甚至不自旋，总之，比较智能。<span style="background-color: yellow">JDK 7 之后不能控制是否开启自旋功能</span>。

#### 锁清除

​ 锁清除是发生在编译器级别的一种锁优化方式，有时候我们写的代码完全不需要加锁，但却执行了加锁操作，**编译器会进行锁清除**。

#### 锁粗化

​ 如果很多次锁的请求都是对同一对象加锁，**可以有效地合并多个相邻的加锁代码块，将加锁同步的范围扩大，因此可以减少加锁带来的性能损耗**。

---

### Synchronized 和 Lock

1. Synchronized 是 Java 的一个关键字，在<span style="background-color: yellow">JVM 层面</span>实现加锁和释放锁；

   Lock 是一个接口，在<span style="background-color: yellow">代码层面</span>实现加锁和释放锁；ReenTrantLock 是 Lock 的实现类。

2. Synchronized 不需要用户去手动释放锁，在线程代码执行完或出现异常时自动释放锁；

   Lock 不会自动释放锁，需要在 finally { } 代码块中显式释放锁；

3. Lock 可以设置获取锁的超时时间，且可以查看锁是否获取成功，实现公平锁，<span style="background-color: yellow">可实现选择性通知</span>（借助于 Condition 接口）。

4. Lock 功能性更全面， ReentrantLock 主要增加了三个高级功能：<span style="background-color: yellow">等待可中断、可实现公平锁及锁可以绑定多个条件</span>。

5. <span style="background-color: yellow">不过性能已经不是二者的选择标准</span>。

fs 吃，vV/f'.‘。

![image-20220421224157766](JUC%20&%20操作系统.assets/image-20220421224157766.png)

> ReentrantLock & Synchronized

|            | ReentrantLock                      | Synchronized                         |
| ---------- | ---------------------------------- | ------------------------------------ |
| 锁实现机制 | 依赖 AQS                           | 依赖于                               |
| 灵活性     | 支持响应中断、超时、尝试获取锁     | 不灵活                               |
| 释放形式   | 必须显示调用`unlock()`释放锁       | 自动释放监视器                       |
| 锁类型     | 公平锁 & 非公平锁                  | 非公平锁                             |
| 条件队列   | 可关联多个条件队列（多个 WaitSet） | 关联一个条件队列`wait()`、`notify()` |
| 可重入性   | 可重入                             | 可重入                               |

---

### ReentrantLock

![image-20220128112519320](%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20&%20JUC.assets/image-20220128112519320.png)

​ `ReentrantLock`实现了`Lock`接口，`Lock`接口是`Java`中对锁操作行为的统一规范。`ReentrantLock`内部定义了专门的组件`Sync`， `Sync`继承`AQS`提供释放资源的实现，`NonfairSync`和`FairSync`是基于`Sync`扩展的子类，即`ReentrantLock`的非公平模式与公平模式，它们作为`Lock`接口功能的基本实现。

---

#### ReentrantLock 可重入实现

<span style="background-color: yellow">可重入</span>指的是，该锁能够支持一个线程对资源的重复加锁。该特性需要解决两个问题：

1. **线程再次获取锁**：锁需要去识别获取锁的线程是否是当前持有锁的线程，如果是，则再次获取锁。
2. **锁的最终释放**：该锁被获取了 n 次，那么前（n-1）次`tryRelease(int releases)`方法必须返回 false。

​ <span style="background-color: yellow">Synchronized 关键字隐式的支持重进入</span>，比如一个 synchronized 修饰的递归方法，在方法执行时，执行线程在获取了锁之后仍能连续多次地获得该锁 。ReentrantLock 虽然没能像 synchronized 关键字一样支持隐式的重进入，但是在调用`lock()`方法时，已经获取到锁的线程，能够再次调用`lock()`方法获取锁而不被阻塞。

`ReentrantLock`的实现`tryAcquire`方法里面不管是公平锁还是非公平锁，都有下面的代码，以非公平锁为例：

```java
final boolean nonfairTryAcquire(int acquires) {
    ...
    int c = getState();  //获取当前状态
 	if (c <span style="background-color: yellow"> 0){...}   // state</span>0 代表资源可获取

    // 如果state!=0,但是当前线程是持有锁线程，直接重入
    else if (current == getExclusiveOwnerThread()) {
        //state状态 + 1
        int nextc = c + acquires;
        //避免int值累计过大溢出
        if (nextc < 0)
            throw new Error("Maximum lock count exceeded");
        //将state变量替换成新的值，此处不需要 CAS，因为持有锁的线程只有一个
        setState(nextc);
        //返回true，实现可重入
        return true;
    }
    ...
}
```

​ 对于非公平锁只要 CAS 设置同步状态成功则表示当前线程获取了锁，而公平锁则不同。公平锁使用 `tryAcquire` 方法，该方法与`nonfairTryAcquire` 的唯一区别就是**判断条件中多了对同步队列中当前节点是否有前驱节点的判断**，如果该方法返回 true 表示有线程比当前线程更早请求锁，因此需要等待前驱线程获取并释放锁后才能获取锁。

```java
// 释放锁
protected final boolean tryRelease(int releases) {
    int c = getState() - releases;
    // getExclusiveOwnerThread() 获取占有线程
    if (Thread.currentThread() != getExclusiveOwnerThread())
    	throw new IllegalMonitorStateException();
    boolean free = false;
    if (c == 0) {
    	free = true;
    	setExclusiveOwnerThread(null);
    }
    setState(c);
    return free;
}
```

可以看到，该方法将 state 是否为 0 作为最终释放的条件，当同步状态为 0 时，将占有线程设置为 null，并返回 true，表示释放成功。

---

### 死锁、活锁、饥饿

#### 死锁

​ 当前线程拥有其他线程需要的资源，当前线程等待其他线程已拥有的资源，都不放弃自己拥有的资源。

​ 多个进程可以竞争有限数量的资源。当一个进程申请资源时，如果这时没有可用资源，那么这个进程进入等待状态。有时，如果所申请的资源被其他等待进程占有，那么该等待进程有可能再也无法改变状态。这种情况称为 **死锁**。

> **产生死锁的四个必要条件是什么?**

- **互斥**：资源必须处于非共享模式，即一次只有一个进程可以使用。如果另一进程申请该资源，那么必须等待直到该资源被释放为止。
- **占有并等待**：一个进程至少应该占有一个资源，并等待另一资源，而该资源被其他进程所占有。
- **非抢占**：资源不能被抢占。只能在持有资源的进程完成任务后，该资源才会被释放。
- **循环等待**：有一组等待进程 `{P0, P1,..., Pn}`， `P0` 等待的资源被 `P1` 占有，`P1` 等待的资源被 `P2` 占有，......，`Pn-1` 等待的资源被 `Pn` 占有，`Pn` 等待的资源被 `P0` 占有。

> 检测（定位）死锁

检测死锁可以使用 `jconsole`工具（有直接监测死锁的按钮）；或者使用`jps`定位进程 id，再用 `jstack` 定位死锁。

以`jps`为例：

<img src="./%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20&%20JUC.assets/image-20220128115410503.png" alt="image-20220128115410503" style="zoom: 80%;" />

<img src="./%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20&%20JUC.assets/image-20220128115454292.png" alt="image-20220128115454292" style="zoom: 80%;" />

> 解决死锁方案

1. **顺序加锁**

   ​ 当多个线程需要相同的锁，但是按照不同的顺序加锁，死锁就很容易发生。如果能确保所有的线程都是按照相同的顺序获得锁，那么死锁就不会发生。但这种方式需要你事先知道所有可能会用到的锁，然而总有些时候是无法预知的。通过使用 Hash 值的大小确定加锁的先后。

2. **加锁时限**

   ​ 获取锁时加上一个超时时间，若一个线程没有在给定的时限内成功获得锁，则会放弃争抢锁，如：ReentrantLock 锁超时机制。

3. **锁打断**

   ​ 被动的解决死锁方式，由其它线程调用 `interrupt` 来打断死锁，如：ReentrantLock 的锁打断机制。

4. 尽可能缩减加锁的范围，等到操作共享变量的时候才加锁。

> 死锁的 Demo

```java
public class DeadLockDemo {
    private static Object resource1 = new Object();//资源 1
    private static Object resource2 = new Object();//资源 2

    public static void main(String[] args) {
        new DeadLockDemo().deadLock();
    }
    private void deadLock () {
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (resource1) {
                    try {
                        Thread.currentThread().sleep(2000);
                    }catch (InterruptedException e) {
                        e.printStackTrance();
                    }
                    synchronized (resource2) {
                        System.out.println("need resource" + 2);
                    }
                }
            }
        });
        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (resource2) {
                    synchronized (resource1) {
                        System.out.println("need resource" + 1);
                    }
                }
            }
        });
        t1.start();
        t2.start();
    }
}
```

---

#### 活锁

<font color='red'>活锁出现在两个线程相互改变对方的结束条件，最后谁也无法结束</font>。（一个++，一个--，永远执行不完）

> 解决活锁方案

​ 让两个线程执行时间有交错，实际开发中可以**增加随机睡眠时间**来解决活锁。

---

#### 饥饿

​ 一个线程由于 CPU 被其它线程抢走而长时间得不到运行，这种情况一般发生的<span style="background-color: yellow">原因是这个线程优先级低</span>。

​ 在哲学家就餐问题中，使用<span style="background-color: yellow">顺序加锁</span>的方式解决的话，会产生饥饿。使用 Reentrantlock 来解决能避免饥饿。

---

### 单例：双重校验锁（DCL）

**为什么两次 if 判断？**

​ <span style="background-color: yellow">外层判断提高效率，内层判断为了防止多次实例化对象。</span>

**使用 volatile 的目的是：避免指令重排序**

​ 双重校验锁存在一个问题：`INSTANCE = new Singleton();`该语句非原子操作，实际是三个步骤：

    	1. 给singleton分配内存；
    	2. 调用 Singleton 的构造函数来初始化成员变量；
    	3. 将给单例对象指向分配的内存空间（此时singleton才不为null）。

​ 编译器有可能进行**指令重排优化**，可能分配内存并修改指针后未初始化 ，导致其它人拿到的对象就可能是个不完整的对象。举个例子，第一个线程初始化对象到一半，第二个线程来发现已经不是 null 了就直接返回了 实际上该对象此时还没有完全初始化 可能会出现这个问题。

​ 例子：线程 1 此时创建了 singleton 对象(分配了内存空间，也就是完成了第一个步骤)，但是 2,3 步骤乱序了，先执行了 3，后执行 2，也就是先将引用了指向了对象(由于对象还没有初始化，此时的对象是没有初始化的对象，而引用仅仅是一个地址)，这时如果线程 2 走到**第一个 if**(没有在*synchronized*的代码块中，没有受到保护)的位置进行判断时此时 INSTANCE 不为空，他现在只是一个指向还没有初始化对象的一个地址，也就是 t2 线程拿到了一个**未初始化完毕的单例**。但也与原本的单例模式初衷违背，**因此需要 volatile 来避免指令重排序，以防出问题**。

```java
public final class Singleton{
    private Singleton() {}
    private static volatile Singleton INSTANCE = null;
    public static Singleton getInstance() {
        //实例没创建(完成)，才会进入内部的synchronized代码块
        if (INSTANCE == null) {
            synchronized (Singleton.class) {
                //或许用其他的线程在你第一次判断的期间，正在创建实例，现在已经创建完成
                if (INSTANCE == null) {
                    INSTANCE = new Singleton();
                }
            }
        }
        return INSTANCE;
    }
}
```

### happens-before

​ happens-before 规定了对共享变量的写操作对其它线程的读操作可见，特是可见性与有序性的一套规则总结。happens-before 保证**正确同步的多线程程序的执行结果不变。**

| happens-before | 说明                                                                                                                                                                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 程序次序规则   | 一个线程中，按照程序的顺序，前面的操作 happens-before 后续的任何操作。                                                                                                                                                                                          |
| 管程锁定规则   | 一个 unlock 解锁操作(例如 synchronized 执行完)先行发生于后面对同一个锁的 lock 操作。**线程解锁 m 之前对变量的写，对于接下来 m 加锁的其他线程对该变量读可见。**                                                                                                  |
| volatile 规则  | 对一个 volatile 变量的写操作先行发生于后面对这个变量的读操作。线**程对 volatile 变量的写，对接下来其他线程对该变量的读可见。**                                                                                                                                  |
| 传递规则       | 如果 A happens-before B，B happens-before C，那么 A happens-before C                                                                                                                                                                                            |
| 线程启动规则   | Thread 对象的 start() 方法先行发生于此线程的每一个动作。**线程 start 前对变量的写，对该线程开时候对该变量读可见。**                                                                                                                                             |
| 线程终止规则   | 对线程 interrupt( ) 方法的调用先行发生于被中断线程的代码检测到中断事件的发生。**线程 t1 打断线程 t2(interrupt)前对变量的写，对于其他线程得知 t2 被打断后对变量的读可见(通过 t2.interrupted 或 t2.isInterrupted)**                                               |
| 线程终止规则   | 线程中的所有操作都先行发生于对此线程的终止检测，我们可以通过 Thread::join()方法是否结束、Thread::isAlive()的返回值等手段检测线程是否已经终止执行。**线程结束前对变量的写，对其他线程得知它结束后的读可见(比如其他线程调用 t1.isAlive()或 t1.join()等待它结束)** |
| 对象终结规则   | 一个对象的初始化完成先行发生于他的 finalize()方法的开始                                                                                                                                                                                                         |
|                | 对变量默认值(o,false,null)的写(只是定义了没赋值 )，对其他变量的读可见。                                                                                                                                                                                         |

### 乐观锁：CAS+版本号

​ 总是假设最好的情况，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用<span style="background-color: yellow">版本号机制</span>和 <span style="background-color: yellow">CAS 算法</span>实现。乐观锁适用于多读的应用类型，这样可以提高吞吐量，像数据库提供的类似于 `write_condition` 机制，其实都是提供的乐观锁。在 <span style="background-color: yellow">Java 中 java.util.concurrent.atomic 包下面的原子变量类就是使用了乐观锁的一种实现方式 CAS 实现的</span>。

##### 为什么要用 CAS

​ 因为 synchronized 锁每次只会让一个线程去操作共享资源，而 CAS 相当于没有加锁，多个线程都可以去直接操作共享资源，在实际去修改的时候才去判断能否修改成功，在很多情况下会比 synchronized 锁高效。

> 乐观锁一定比悲观锁效率高么？

​ 乐观锁适用于写比较少的情况下（多读场景），即冲突真的很少发生的时候，这样可以省去了锁的开销，加大了系统的整个吞吐量。但如果是多写的情况，一般会经常产生冲突，这就会导致上层应用会不断的进行 retry，这样反倒是降低了性能，所以一般多写的场景下用悲观锁就比较合适。

---

### CAS(compare and swap)

![image-20220420102726998](JUC%20&%20操作系统.assets/image-20220420102726998.png)

​ CAS 操作又称为 “无锁操作”，是一种<span style="background-color: yellow">乐观锁</span>策略，它假设所有线程访问共享资源时不会出现冲突，因此线程不会出现阻塞停顿状态。如果出现了冲突怎么办？<font color='red'>无锁操作利用 CAS 来鉴别线程是否出现冲突，出现冲突就不断重试</font>。

- 对于内存中的某个值 V，提供一个旧值 A 和一个新值 B 。如果提供的旧值 A 和 V 相等就把 B 写入 V，这个过程是<span style="background-color: yellow">原子性</span>的。
- CAS 必须借助 <span style="background-color: yellow">volatile</span> 才能读取到共享变量的最新值来实现<span style="background-color: yellow">比较并交换</span>的效果，因为每次 CAS 意味着需要获取共享变量最新结果，将最新结果与 prev 比较。

- <span style="background-color: yellow">CAS 体现的是无锁并发、无阻塞并发</span>，即使重试失败，线程也不会陷入阻塞，始终在高速运行，使得效率提升，而 synchronized 会让线程在没有获取锁时，发生上下文切换，进入阻塞。

---

#### CAS 的问题：ABA

​ CAS 从语义上来说存在一个逻辑漏洞：如果 V 初次读取时是 A，并且在准备赋值时仍为 A，这依旧不能说明它没有被其他线程更改过，因为这段时间内假设它的值先改为 B 又改回 A，那么 CAS 操作就会误认为它从来没有被改变过。

​ 这个漏洞称为 `ABA` 问题，juc 包提供了一个 `AtomicStampedReference`，原子更新<span style="background-color: yellow">带有版本号</span>的引用类型，通过控制变量值的版本来解决 `ABA` 问题。大部分情况下 `ABA` 不会影响程序并发的正确性，如果需要解决，传统的互斥同步可能会比原子类更高效。

---

## 五、JUC

### JDK 中提供了哪些并发容器？

JDK 提供的这些容器大部分在 java.util.concurrent 包中。

- ConcurrentHashMap：线程安全的 HashMap；
- CopyOnWriteArrayList：线程安全的 List，在读多写少的场合性能非常好，远远好于 Vector；
- ConcurrentLinkedQueue：高效的并发队列，使用链表实现。可以看做一个线程安全的 LinkedList，这是一个非阻塞队列；
- BlockingQueue：这是一个接口，JDK 内部通过链表、数组等方式实现了这个接口。表示阻塞队列，非常适合用于作为数据共享的通道；
- ConcurrentSkipListMap：跳表的实现。这是一个 Map，使用跳表的数据结构进行快速查找。

---

### AQS(抽象队列式同步器）

AQS（AbstractQueuedSynchronizer，抽象队列同步器），<font color='red'>它用来构建锁和同步器的框架</font>，许多同步类的实现都依赖于它，如：ReentrantLock、Semaphore、CountDownLacth 等。

​ AQS 是 JDK 提供的一个同步框架，内部维护这 FIFO 双向队列即 CLH 双向队列。

```java
public abstract class AbstractQueuedSynchronizer
```

特点：

1. 用 state 属性来表示同步状态（独占或共享），子类需要定义如何维护这个状态，<font color='red'>使用 CAS 机制设置 state 状态</font>，控制如何获取锁和释放锁
2. 提供了基于 FIFO 的阻塞队列，AQS 内部使用双向链表将等待线程链接起来，类似 Monitor 的 EntryList
3. 条件变量来实现等待、唤醒机制，支持多个条件变量，类似 Monitor 的 WaitSet

子类主要实现这样一些方法：

- tryAcquire：尝试获取独占锁
- tryRelease：尝试释放独占锁
- tryAcquireShared：尝试获取共享锁
- tryReleaseShared：尝试释放共享锁
- isHeldExclusively：判断是否持有独占锁

#### AQS 原理

​ AQS 核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制 AQS 是用 **CLH 队列锁**实现的，即将暂时获取不到锁的线程加入到队列中。

​ CLH 队列是一个虚拟的双向队列（虚拟的双向队列即不存在队列实例，仅存在结点之间的关联关系）。AQS 是将每条请求共享资源的线程封装成一个 CLH 锁队列的一个结点（Node）来实现锁的分配。

![image-20220602092551788](JUC%20&%20操作系统.assets/image-20220602092551788.png)

![image-20220510090445930](JUC%20&%20操作系统.assets/image-20220510090445930.png)

​ AQS 使用一个 int 成员变量来表示同步状态，通过内置的 FIFO 队列来完成获取资源线程的排队工作。AQS 使用 CAS 对该同步状态进行原子操作实现对其值的修改。

```java
private volatile int state;//共享变量(用于判断共享资源是否被占用的标记位)，使用volatile修饰保证线程可见性，之所以用int而不是boolean是因为共享模式时，一旦被占用，其他共享模式下的线程也能占用，state可用于记录共享线程的数量。
```

​ 状态信息通过 protected 类型的`getState`，`setState`，`compareAndSetState`进行操作

```java
//返回同步状态的当前值
protected final int getState() {
        return state;
}
 // 设置同步状态的值
protected final void setState(int newState) {
        state = newState;
}
//原子地（CAS操作）将同步状态值设置为给定值update如果当前同步状态的值等于expect（期望值）
protected final boolean compareAndSetState(int expect, int update) {
        return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
}
```

#### AQS 源码分析

AQS 的**成员变量**

![image-20220602090052236](JUC%20&%20操作系统.assets/image-20220602090052236.png)

```java
private volatile int state;//共享变量(用于判断共享资源是否被占用的标记位)，使用volatile修饰保证线程可见性，之所以用int而不是boolean是因为共享模式时，一旦被占用，其他共享模式下的线程也能占用，state可用于记录共享线程的数量。
```

![image-20220602090713199](JUC%20&%20操作系统.assets/image-20220602090713199.png)

- CANCELLED：1，在同步队列中等待的线程等待超时或被中断，需要从同步队列中取消该 Node 的结点。
- SIGNAL：-1，处于唤醒状态，只要前继结点释放锁，就会通知标识为 SIGNAL 状态的后继结点的线程执行。
- CONDITION：-2，与 Condition 相关，该标识的结点处于等待队列中，结点的线程等待在 Condition 上，当其他线程调用了 Condition 的 signal()方法后，CONDITION 状态的结点将从等待队列转移到同步队列中，等待获取同步锁。
- PROPAGATE：值为-3，与共享模式相关，在共享模式中，该状态标识结点的线程处于可运行状态。

#### AQS 对资源的共享方式

**AQS 定义两种资源共享方式**

##### Exclusive

只有一个线程能执行，如 ReentrantLock。又可分为公平锁和非公平锁,ReentrantLock 同时支持两种锁,下面以 ReentrantLock 对这两种锁的定义做介绍：

- 公平锁：按照线程在队列中的排队顺序，先到者先拿到锁
- 非公平锁：当线程要获取锁时，先通过两次 CAS 操作去抢锁，如果没抢到，当前线程再加入到队列中等待唤醒。

##### 公平锁与非公平锁

<span style="background-color: yellow">总结：公平锁和非公平锁只有两处不同：</span>

1. 非公平锁在调用 lock 后，首先就会调用 CAS 进行一次抢锁，如果这个时候恰巧锁没有被占用，那么直接就获取到锁返回了。
2. 非公平锁在 CAS 失败后，和公平锁一样都会进入到 tryAcquire 方法，**在 tryAcquire 方法中，如果发现锁这个时候被释放了（state == 0），非公平锁会直接 CAS 抢锁**，但是公平锁会判断等待队列是否有线程处于等待状态，如果有则不去抢锁，乖乖排到后面。

​ 公平锁和非公平锁就这两点区别，**如果这两次 CAS 都不成功，那么后面非公平锁和公平锁是一样的，都要进入到阻塞队列等待唤醒**。

​ 相对来说，非公平锁会有更好的性能，因为它的吞吐量比较大。当然，非公平锁让获取锁的时间变得更加不确定，可能会导致在阻塞队列中的线程长期处于饥饿状态。

##### Share

​ 多个线程可同时执行，如 Semaphore/CountDownLatch。Semaphore、CountDownLatch、 CyclicBarrier、ReadWriteLock。

ReentrantReadWriteLock 可以看成是组合式，因为 ReentrantReadWriteLock 也就是读写锁允许多个线程同时对某一资源进行读。

​ 不同的自定义同步器争用共享资源的方式也不同。自定义同步器在实现时只需要实现共享资源 state 的获取与释放方式即可，至于具体线程等待队列的维护（如获取资源失败入队/唤醒出队等），AQS 已经在上层已经帮我们实现好了。

> AQS 有哪两种模式？

**独占模式**：表示锁只会被一个线程占用，其他线程必须等到持有锁的线程释放锁后才能获取锁，同一时间只能有一个线程获取到锁。ReentrantLock

**共享模式**：表示多个线程获取同一个锁有可能成功，**ReadLock 就采用共享模式**。Semaphore、CountDownLatch、 CyclicBarrier、ReadWriteLock。

#### AQS 组件

##### Semaphore(信号量)

synchronized 和 ReentrantLock 都是一次只允许一个线程访问某个资源，Semaphore(信号量)可以指定多个线程同时访问某个资源。

执行 `acquire` 方法阻塞，直到有一个许可证可以获得然后拿走一个许可证；每个 `release` 方法增加一个许可证，这可能会释放一个阻塞的 acquire 方法。然而，其实并没有实际的许可证这个对象，Semaphore 只是维持了一个可获得许可证的数量。 Semaphore 经常用于限制获取某种资源的线程数量。

除了 `acquire`方法之外，另一个比较常用的与之对应的方法是`tryAcquire`方法，该方法如果获取不到许可就立即返回 false。

Semaphore 有两种模式，公平模式和非公平模式。

- **公平模式：** 调用 acquire 的顺序就是获取许可证的顺序，遵循 FIFO；
- **非公平模式：** 抢占式的。

##### CountDownLatch（倒计时器）

`CountDownLatch` 允许 `count` 个线程阻塞在一个地方，直至所有线程的任务都执行完毕。

`CountDownLatch` 是共享锁的一种实现,它默认构造 AQS 的 `state` 值为 `count`。当线程使用 `countDown()` 方法时,其实使用了`tryReleaseShared`方法以 CAS 的操作来减少 `state`,直至 `state` 为 0 。当调用 `await()` 方法的时候，如果 `state` 不为 0，那就证明任务还没有执行完毕，`await()` 方法就会一直阻塞，也就是说 `await()` 方法之后的语句不会被执行。然后，`CountDownLatch` 会自旋 CAS 判断 `state <span style="background-color: yellow"> 0`，如果 `state </span> 0` 的话，就会释放所有等待的线程，`await()` 方法之后的语句得到执行。

#### CountDownLatch 的不足

​ CountDownLatch 是一次性的，**计数器的值只能在构造方法中初始化一次，之后没有任何机制再次对其设置值，当 CountDownLatch 使用完毕后，它不能再次被使用**。

##### CyclicBarrier(循环栅栏)

CyclicBarrier 和 CountDownLatch 非常类似，它也可以实现线程间的技术等待，但是它的功能比 CountDownLatch 更加复杂和强大。主要应用场景和 CountDownLatch 类似。

<span style="background-color: yellow">CountDownLatch 的实现是基于 AQS 的，而 CycliBarrier 是基于 ReentrantLock(ReentrantLock 也属于 AQS 同步器)和 Condition 的.</span>

CyclicBarrier 的字面意思是可循环使用（Cyclic）的屏障（Barrier）。它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活。CyclicBarrier 默认的构造方法是 `CyclicBarrier(int parties)`，其参数表示屏障拦截的线程数量，每个线程调用`await`方法告诉 CyclicBarrier 我已经到达了屏障，然后当前线程被阻塞。

##### CyclicBarrier 和 CountDownLatch 的区别

**CountDownLatch 是计数器，只能使用一次，而 CyclicBarrier 的计数器提供 reset 功能，可以多次使用**。但是我不那么认为它们之间的区别仅仅就是这么简单的一点。

对于 CountDownLatch 来说，重点是“一个线程（多个线程）等待”，而其他的 N 个线程在完成“某件事情”之后，可以终止，也可以等待。而对于 CyclicBarrier，重点是多个线程，在任意一个线程没有完成，所有的线程都必须等待。

CountDownLatch 是计数器，线程完成一个记录一个，只不过计数不是递增而是递减，而 CyclicBarrier 更像是一个阀门，需要所有线程都到达，阀门才能打开，然后继续执行。

---

#### 为什么只有前驱节点是头节点时才能尝试获取同步状态？

1. 头节点是成功获取到同步状态的节点，而头节点的线程释放了同步状态之后，将会唤醒其后继节点。后继节点的线程被唤醒后需要检查自己的前驱节点是否是头节点。
2. <span style="background-color: yellow">为了维护同步队列的 FIFO 原则</span>，节点和节点在循环检查的过程中基本不通信，而是简单判断自己的前驱是否为头节点，这样就使节点的释放规则符合 FIFO，并且也便于对过早通知的处理（过早通知指前驱节点不是头节点的线程由于中断被唤醒）。

#### 共享式获取/释放锁的原理？

​ 获取同步状态时，调用 `acquireShared` 方法，该方法调用 `tryAcquireShared` 方法尝试获取同步状态，返回值为 int 类型，返回值不小于于 0 表示能获取同步状态。因此在共享式获取锁的自旋过程中，成功获取同步状态并退出自旋的条件就是该方法的返回值不小于 0。

​ 释放同步状态时，调用 `releaseShared` 方法，释放后会唤醒后续处于等待状态的节点。它和独占式的区别在于 `tryReleaseShared` 方法必须确保同步状态安全释放，通过循环 CAS 保证，因为释放同步状态的操作会同时来自多个线程。

#### 独占式获取锁的流程

也就是`acquire(int age)`方法调用流程：

<img src="./JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20220303203335747.png" alt="image-20220303203335747" style="zoom:67%;" />

---

### ReentrantReadWriteLock

​ 读写锁在同一时刻允许多个读线程访问，在写线程访问时，所有的读写线程均阻塞。读写锁维护了一个读锁和一个写锁，通过分离读锁和写锁使并发性相比排他锁有了很大提升。

​ 读写锁机制是<span style="background-color: yellow">基于 AQS 的</span>一种实现，保证<span style="background-color: yellow">读读共享、读写互斥、写写互斥</span>。它的自定义同步器需要在同步状态 `state` 上**维护多个读线程和一个写线程**，该状态的设计成为实现读写锁的关键。ReentrantReadWriteLock 很好的利用了高低位。来实现一个整型控制两种状态的功能，读写锁将变量切分成了两个部分，<span style="background-color: yellow">高 16 位表示读，低 16 位表示写</span>。

> 特点

- 读锁和写锁都支持锁中断，因为它们都有 `lockInterruptibly()` 方法；
- 写锁支持条件变量，读写不支持条件变量，如果读锁调用 `newCondition` 会抛出异常;
- 默认构造方法为非公平模式 ，也可以通过指定 fair 为 true 设置为公平模式 。

> 读写锁的升降级策略？

- <span style="background-color: yellow">不支持锁升级</span>，不能从读锁升级到写锁，持有读锁的情况下去获取写锁，会导致写锁永久等待。
- <span style="background-color: yellow">支持锁降级</span>，在释放写锁之前可以获取读锁来达到锁的降级。

---

### Condition 接口

​ 任意一个 Java 对象，都拥有一组监视器方法（定义在 java.lang.Object 上），主要包括`wait()`、`wait(long timeout)`、`notify()`以及`notifyAll()`方法，这些方法与 synchronized 同步关键字配合，可以实现等待/通知模式。Condition 接口也提供了类似 Object 的监视器方法，与 Lock 配合可以实现等待/通知模式。

```java
Lock lock = new ReentrantLock();
Condition condition = lock.newCondition();
public void conditionalWait() throws InterruptedException {
    lock.lock();
    try {
        conditon.await();  // 释放锁，并在此等待
    }finally {
        lock.unlock();
    }
}
public void conditionSignal() throws InterruptedException {
    lock.lock();
    try {
        conditon.signal(); // 调用 signal 之后，通知线程从 await 返回
    }finally {
        lock.unlock();
    }
}
```

---

### Exchanger 线程间交换数据

​ Exchanger 是用于线程间协作的工具类，用于进行线程间的数据交换。它提供一个**同步点**，在这个同步点两个线程可以交换彼此的数据。

​ 两个线程通过 `exchange` 方法交换数据，第一个线程执行 `exchange` 方法后会阻塞等待第二个线程执行该方法，当两个线程都到达同步点时这两个线程就可以交换数据，将本线程生产出的数据传递给对方。应用场景包括遗传算法、校对工作等。

---

### ConcurrentHashMap 是如何保证线程安全的？

1.7 中，ConcurrentHashMap 采用了分段锁策略，将一个 HashMap 切割成 Segment 数组，其中 Segment 可以看成一个 HashMap， 不同点是 Segment 继承自 ReentrantLock，在操作的时候给 Segment 赋予了一个对象锁，从而保证多线程环境下并发操作安全
1.8 中，与此对应的 ConcurrentHashMap 也是采用了与 HashMap 类似的存储结构，但是 JDK1.8 中 ConcurrentHashMap 并没有采用分段锁的策略，而是在元素的节点上采用 CAS + synchronized 操作来保证并发的安全性

### JDK7 的 ConcurrentHashMap 原理？

​ ConcurrentHashMap 用于解决 **HashMap 的线程不安全**和 HashTable 的**并发效率低**，<span style="background-color: yellow">HashTable 之所以效率低是因为所有线程都必须竞争同一把锁</span>。ConcurrentHashMap 首先将数据分成 `Segment` 数据段，然后给每一个数据段配一把锁，当一个线程占用锁访问其中一个段的数据时，其他段的数据也能被其他线程访问。

<span style="background-color: yellow">结构</span>： `Segment` + `HashEntry`（与 HashMap 类似，但是其中的`value`与`next`变量由`volatile`修饰）

1. **Segment 继承自 ReentrantLock**，一个 ConcurrentHashMap 里包含一个`Segment`数组。**Segment 的结构和 HashMap 类似，是一种数组和链表结构**。
2. 一个 Segment 里包含一个 HashEntry 数组，当对 HashEntry 数组的数据进行修改时，必须首先获得与它对应的 Segment 锁 。

​ `get `实现简单高效，先经过一次再散列（为了减少散列冲突），再用这个哈希值通过哈希运算定位到 Segment，最后通过散列算法定位到元素。get 的高效在于不需要加锁，除非读到空值才会加锁重读。<span style="background-color: yellow">get 方法中将共享变量定义为 volatile</span>，在 <span style="background-color: yellow">get 操作里只需要读所以不用加锁</span>。

​ put 必须加锁，首先定位到 Segment，然后进行插入操作。第一步判断是否需要对 Segment 里的 HashEntry 数组进行扩容，第二步定位添加元素的位置，然后将其放入数组。

​ `size` 操作用于统计元素的数量，必须统计每个 Segment 的大小然后求和，在统计结果累加的过程中，之前累加过的 count 变化几率很小，因此先尝试两次通过不加锁的方式统计结果，如果统计过程中容器大小发生了变化，再加锁统计所有 Segment 大小。判断容器是否发生变化根据 modCount 确定。

![img](JUC%20&%20操作系统.assets/8bf6d4aa717a871c73d5d2699d822fed.png)

![img](JUC%20&%20操作系统.assets/3e0ef497f95c88e6d409cd6f0737bfe3.png)

---

### JDK8 的 ConcurrentHashMap 原理？

​ 将锁的级别控制在更细粒度的哈希桶数组元素级别，也就是说只要锁住这个**链表的头结点**(红黑树的根节点)，就不会影响其他的哈希桶数组的读写，大大提高了并发度。

主要对 JDK7 做了三点改造：

- JDK1.7 采用 Segment 的分段锁机制实现线程安全，JDK1.8 采用`CAS+synchronized`保证线程安全。
- 将 1.7 中的 HashEntry 改为了 Node，但作用都是相同的。其中的`val`、`next`都由 volatile 修饰。
- 锁的粒度：JDK1.7 是对需要进行数据操作的 Segment 加锁，JDK1.8 调整为对每个数组元素加锁（Node）。
- 查询时间复杂度：从 JDK1.7 的遍历链表 O(n)， JDK1.8 变成遍历红黑树 O(logN)。

#### JDK1.8 弃用分段锁的原因(而使用 cas+synchronized)

> JDK1.8 中为什么使用内置锁 synchronized 替换 可重入锁 ReentrantLock？

- 在 JDK1.6 中，对 synchronized 锁的实现引入了大量的优化，并且 synchronized 会有多种锁状态，会从无锁 ->轻量级锁 -> 偏向锁 -> 重量级锁一步步转换。
- 减少内存开销 。假设使用 ReentrantLock 来获得同步支持，**那么每个节点都需要通过继承 AQS 来获得同步支持。但并不是每个节点都需要获得同步支持的，只有链表的头节点（红黑树的根节点）需要同步，这无疑带来了巨大内存浪费**。

> put

- 根据 key 计算出 hashcode 。
- 判断是否需要进行初始化。
- `f` 即为当前 key 定位出的 Node，如果为空表示当前位置可以写入数据，利用 <span style="background-color: yellow">CAS</span> 尝试写入，失败则自旋保证成功。
- 如果当前位置的 `hashcode <span style="background-color: yellow"> MOVED </span> -1`,则需要进行扩容。
- 如果都不满足，则利用 synchronized 锁写入数据。
- 如果数量大于 `TREEIFY_THRESHOLD` 则要转换为红黑树。

---

# 操作系统

### 操作系统的特征？

<img src="./JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20211208095637878.png" alt="image-20211208095637878"  />

---

### 大内核 & 微内核

内核：计算机上配置的底层软件，是操作系统最基本，最核心的部分。

分类：

- 大内核：变态次数少，性能高。但是内核代码庞大，难以维护

- 微内核：变态次数多，性能低。但是内核代码少，方便维护

  ![image-20220121155724866](%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20&%20JUC.assets/image-20220121155724866.png)

---

### 内核态和用户态

​ 内核态和用户态是操作系统运行的两种级别，目的是为了保证系统程序不被应用程序有意或无意的破坏。操作系统在内核态运行，应用程序只能在用户态运行。

- <span style="background-color: yellow">内核态</span>：处于内核态的 CPU 可以访问任意的数据，包括外围设备，比如网卡、硬盘等，处于内核态的 CPU 可以从一个程序切换到另外一个程序，并且占用 CPU 不会发生抢占情况，一般处于特权级 0 的状态我们称之为内核态。
- <span style="background-color: yellow">用户态</span>：处于用户态的 CPU 只能受限的访问内存，并且不允许访问外围设备，用户态下的 CPU 不允许独占，也就是说 CPU 能够被其他程序获取。

> 用户态和内核态的切换？

​ 用户程序的访问能力有限，一些比较重要的比如从硬盘读取数据，从键盘获取数据的操作则是内核态才能做的事情，而这些数据却又对用户程序来说非常重要。所以就涉及到两种模式下的转换， 此时就需要进行<span style="background-color: yellow">系统调用</span>，能够执行系统调用的就只有 <span style="background-color: yellow">操作系统</span>。

1. 用户态 -> 内核态

   - 系统调用：用户态进程主动切换到内核态的一种方式，用户态执行陷入指令 int（软中断指令），引发一个内中断，从而 CPU 进入内核态，所以说系统调用本质也是中断。**陷入指令是唯一一个只能在用户态，而不能在内核态执行的指令**。
   - 异常（也叫内中断）：当 CPU 正在执行用户态程序时，突然发生某些预先不可知的异常事件，这个时候就会触发从用户态执行的进程转向内核态执行相关的异常事件，如：缺页异常，int i = 1/0。
   - 外围设备的中断：当外围设备完成用户的请求操作后，会向 CPU 发出中断信号，此时 CPU 就会暂停执行下一条即将要执行的指令，转而切换成内核态去执行中断信号对应的处理程序。

2. 内核态 -> 用户态

   通过执行**特权指令**，将程序状态字（PSW）标志位设置为 ”用户态“。

---

### 系统调用

​ 我们运行的程序基本都是运行在用户态，如果我们想要调用操作系统提供的内核态级别的子功能咋办呢？那就需要系统调用了。也就是说我们的用户程序，凡是与内核态有关的操作（如文件管理、进程控制、内存管理、I/O 等)，都必须通过系统调用方式向操作系统提出服务请求，并由操作系统代为完成。

- 关于各种相关指令
  1. 系统调用指令 = 广义指令：在用户态下调用，在核心态执行
  2. 陷入指令 = trap 指令 = 访管指令：在用户态下执行

> 系统调用过程

1. 传递系统调用参数
2. 执行陷入指令，操作系统来选择具体运行哪个处理函数
3. 执行系统调用相应服务程序
4. 返回用户程序继续执行

---

### PCB 和 TCB

进程的组成：PCB + 数据段 + 程序段

1. PCB：进程存在的唯一标识，是给操作系统用的，程序段、数据段是给进程自己用的。
2. 数据段：运行过程产生的各种数据（如：程序中定义的变量）
3. 程序段：程序的代码（指令序列）

> PCB

​ 操作系统要记录 PID、进程所属用户（UID），还有记录给进程分配了哪些资源（如：分配了多少内存，正在使用哪些 IO 设备、正在使用哪些文件），还要记录进程运行情况（如：CPU 使用时间、磁盘使用情况等）。

​ **这些信息都被保存在一个数据结构 PCB 中，即进程控制块**，但凡进程管理所需要的信息，都会被放在 PCB 中。

![image-20220221192545449](%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20&%20JUC.assets/image-20220221192545449.png)

> TCB

每个线程都是一个线程 ID、线程控制块 TCB。TCB 与 PCB 相似，只是 TCB 保存的线程状态比 PCB 中保存的少。

---

### I/O

![image-20220418144217105](JUC%20&%20操作系统.assets/image-20220418144217105.png)

**IO 分为两个过程：**

1. 数据准备的过程
2. 数据从内核空间拷贝到用户进程缓冲区的过程

​ 阻塞 I/O 会阻塞在「过程 1 」和「过程 2」，⽽⾮阻塞 I/O 和基于⾮阻塞 I/O 的多路复⽤只会阻塞在「过程 2」，所以这三个都可以认为是同步 I/O。 异步 IO 则不同，过程 1 和过程 2 都不阻塞。

![image-20220418145306464](JUC%20&%20操作系统.assets/image-20220418145306464.png)

#### 零拷贝

​ 避免在用户态与内核态之间来回拷贝数据的技术。

​ 而 NIO 的零拷贝与传统的文件 IO 操作最大的不同之处就在于它虽然也是要从磁盘读取数据，但是它并**不需要将数据读取到操作系统的内核缓冲区，而是直接将进程的用户私有地址空间中的一部分区域与文件对象建立起映射关系，这样直接从内存中读写文件，速度大幅度提升**。

### 程序、进程、线程、协程

**程序：**程序由静态的指令和数据组成，进程是是动态的,是程序的一次执行过程。（指令加载到 CPU，数据加载到内存）

**进程：**<span style="background-color: yellow">是程序运行和系统资源分配的基本单位（与线程的根本区别）</span>。

**线程：**是进程的一个实体，<span style="background-color: yellow">是 cpu 调度和分派的基本单位</span>，是比进程更小的能独立运行的单元。

> 进程与线程的区别

- 资源拥有：进程在执行过程中拥有独立的内存单元，而多个线程共享内存资源，减少切换次数，从而效率更高。
- 地址空间：进程有自己独立的地址空间，线程没有自己独立的地址空间。
- 资源开销：进程间切换有较大的开销，线程间切换开销较小。因为进程切换**要切换页目录以使用新的地址空间**，把原进程的数据段代码换出去，把要执行的进程内容换进来。

> 协程

​ <font color='red'>协程是一种用户态的轻量级线程</font>，一个线程可以拥有多个协程。协程调度由用户自己执行，每个协程拥有自己的执行栈，可以保存自己的执行现场。协程主动让出执行权时，会保存执行现场，然后切换到其它协程；协程恢复执行时，会根据之前保存的执行现场，恢复到中断前的状态继续执行，这样就通过协程实现了即轻量又灵活的，由用户态进行调度的多任务模型。

---

### 线程相关

#### 线程间通信方式

1. 使用全局变量：由于多个线程可能更改全局变量，因此全局变量最好声明为 **volatile**。
2. 使用消息实现通信：每个线程都可以拥有自己的消息队列，因此可以采用消息进行线程间通信。
3. Java 中使用`wait()`和`notify`、ReentrantLock 结合 Condition。

#### 线程同步

<font color='red'> 同步就是协同步调，按预定的先后次序运行</font>，其实也就是线程安全。

<span style="background-color: yellow">互斥同步</span>

​ 是一种最常见也是最主要的并发正确性保障手段。同步是指在多个线程并发访问共享数据时，保证共享数据在同一个时刻只被一条（或者是一些，当使用信号量的时候）线程使用。而互斥是实现同步的一种手段，临界区（Critical Section）、互斥量（Mutex）和信号量（Semaphore）都是常见的互斥实现方式。

1. 在 Java 里面，最基本的互斥同步手段就是 **synchronized** 关键字，以及 **Reentrantlock**。
2. **信号量**：它允许同一时刻多个线程访问同一资源，并且可以**限制同一时刻访问此资源的最大线程数量**。

<span style="background-color: yellow">非阻塞同步</span>

​ 互斥同步面临的主要问题是进行线程阻塞和唤醒所带来的性能开销，因此这种同步也被称为阻塞同步。互斥同步属于一种悲观的并发策略，无论共享的数据是否真的会出现竞争，它都会进行加锁。这必然**导致用户态到核心态转换、维护锁计数器和检查是否有被阻塞的线程需要被唤醒等开销**。随着硬件指令集的发展（CAS 指令），我们已经有了另外一个选择：基于冲突检测的乐观并发策略。<span style="background-color: yellow">也就是乐观锁</span>。

---

#### 用户线程、守护线程

**用户线程**：用户线程指不需要内核支持而在用户程序中实现的线程，其不依赖于操作系统核心，应用进程利用线程库提供创建、同步、调度和管理线程的函数来控制用户线程。

**守护线程**：是一种运行时在后台提供通用服务的线程（也就是个服务线程），当程序中只剩下守护线程时，程序就会退出。如：垃圾回收线程就是守护线程。

#### 线程上下文切换

​ Thread Context Switch 是<span style="background-color: yellow">存储和恢复 CPU 状态的过程</span>，它使得线程能够从中断点恢复执行。当 Context Switch 发生时，需要由操作系统保存当前线程的状态，并恢复另一个线程的状态，Java 中对应的概念就是程序计数器，它的作用是记住下一条 jvm 指令的执行地址，是线程私有的。

> 线程上下文切换的时机

因为以下一些原因导致 cpu 不再执行当前的线程，转而执行另一个线程的代码：

- 线程的 cpu 时间片用完(每个线程轮流执行，看前面并行的概念)
- 垃圾回收
- 有更高优先级的线程需要运行
- 线程自己调用了 `sleep`、`yield`、`wait`、`join`、`park`、`synchronized`、`lock` 等方法

> 线程上下文切换过程？

​ 先把前一个任务（线程/进程）的 CPU 上下文<span style="background-color: yellow">（也就是 CPU 寄存器和程序计数器）</span>保存起来，然后加载新任务的上下文到这些寄存器和程序计数器，最后再跳转到程序计数器所指的新位置，运行新任务。这些保存下来的上下文，会存储在系统内核中，并在任务重新调度执行时再次加载进来，以恢复任务的执行。

> 如何减少上下文切换？

1. 无锁并发编程：多线程竞争时，会引起上下文切换，可以用一些办法来避免使用锁，如：将数据的 ID 按照 hash 取模分段，不同的线程处理不同段的数据。
2. CAS 算法：JDK 的 Atomic 包使用 CAS 算法来更新数据，不需要加锁。

3. 使用最少线程：避免创建不需要的线程，如：任务很少，但创建了很多线程来处理，这样会造成大量线程都处于等待状态。

4. 协程：在单线程里实现多任务的调度，并在单线程中维持多个任务间的切换。

---

#### 为什么进程上下文切换代价更高

线程上下文切换和进程上下文切换最主要的区别：<span style="background-color: yellow">线程的切换虚拟内存空间依然是相同的，但是进程切换是不同的</span>。

进程切换分两步：

1. 切换页目录以使用新的地址空间（线程切换不需要）
2. 切换内核栈和硬件上下文

---

### 进程相关

#### 进程切换

从一个进程的运行转到另一个进程上运行，这个过程中经过下面这些变化：

1. 保存进程上下文，包括程序计数器和其他寄存器。
2. 更新 PCB 信息。
3. 把进程的 PCB 移入相应的队列，如就绪、在某事件阻塞等队列。
4. 选择另一个进程执行，并更新其 PCB。
5. 更新内存管理的数据结构。
6. 恢复进程上下文。

---

#### 进程的状态转换

- **创建状态(new)** ：进程正在被创建，尚未到就绪状态。
- **就绪状态(ready)** ：进程已处于准备运行状态，即进程获得了除了处理器之外的一切所需资源，一旦得到处理器资源(处理器分配的时间片)即可运行。
- **运行状态(running)** ：进程正在处理器上运行(单核 CPU 下任意时刻只有一个进程处于运行状态)。
- **阻塞状态(waiting)** ：又称为等待状态，进程正在等待某一事件而暂停运行。如等待某资源为可用或等待 IO 操作完成。即使处理器空闲，该进程也不能运行。
- **结束状态(terminated)** ：进程正在从系统中消失。可能是进程正常结束或其他原因中断退出运行。

<img src="./JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20211208101547944.png" alt="image-20211208101547944" style="zoom:80%;" />

1. 就绪 —> 运行：对就绪状态的进程，当进程调度程序按一种选定的策略从中选中一个就绪进程，为之分配了处理机后，该进程便由就绪状态变为执行状态；
2. 运行 —> 阻塞：正在执行的进程因发生某等待事件而无法执行，则进程由执行状态变为阻塞状态，如进程提出输入/输出请求而变成等待外部设备传输信息的状态，进程申请资源（主存空间或外部设备）得不到满足时变成等待资源状态，进程运行中出现了故障（程序出错或主存储器读写错等）变成等待干预状态等等；
3. 阻塞 —> 就绪：处于阻塞状态的进程，在其等待的事件已经发生，如输入/输出完成，资源得到满足或错误处理完毕时，处于等待状态的进程并不马上转入执行状态，而是先转入就绪状态，然后再由系统进程调度程序在适当的时候将该进程转为执行状态；
4. 运行—> 就绪：正在执行的进程，因时间片用完而被暂停执行，或在采用抢先式优先级调度算法的系统中,当有更高优先级的进程要运行而被迫让出处理机时，该进程便由执行状态转变为就绪状态。

---

#### 进程间通信方式 ？

​ 进程间通信（IPC，InterProcess Communication），大概有 7 种常见的进程间的通信方式：

1. <span style="background-color: yellow">管道/匿名管道</span>：半双工的，具有固定的读端和写端；**只能用于父子进程或者兄弟进程之间的进程的通信**；可以看成是一种特殊的文件，对于它的读写也可以使用普通的 read、write 等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。
2. <span style="background-color: yellow">命名管道</span>：**遵循 FIFO**，**以磁盘文件的方式存在**，可以实现本机任意两个进程通信。
3. <span style="background-color: yellow">信号(Signal)</span> ：信号是一种比较复杂的通信方式，用于通知、接收进程某个事件已经发生；
4. <span style="background-color: yellow">消息队列</span>：消息队列是消息的链表,具有特定的格式,存放在内存中，并由消息队列标识符标识。管道和消息队列的通信数据都是先进先出的原则。与管道（无名管道：只存在于内存中的文件；命名管道：存在于实际的磁盘介质或者文件系统）不同的是，消息队列存放在内核中，只有在内核重启(即，操作系统重启)或者显式地删除一个消息队列时，该消息队列才会被真正的删除。消息队列可以实现消息的随机查询，消息不一定要以先进先出的次序读取,也可以按消息的类型读取.比 FIFO 更有优势。**消息队列克服了信号承载信息量少，管道只能承载无格式字 节流以及缓冲区大小受限等缺点。**
5. <span style="background-color: yellow">信号量(Semaphore)</span> ：信号量是一个计数器，用于多进程对共享数据的访问，**信号量的意图在于进程间同步**。这种通信方式主要用于解决与同步相关的问题，并避免竞争条件。
6. <span style="background-color: yellow">共享内存</span>：使得多个进程可以访问同一块内存空间，不同进程可以及时看到对方进程中对共享内存中数据的更新。**共享内存是最快的一种 IPC**，因为进程是直接对内存进行存取。
7. <span style="background-color: yellow">套接字</span>：利用网络进行通信，能够**用于不同计算机之间的进程间通信**。

> 通信方式的选择

1. 管道用来实现进程间相互发送非常短小的、频率很高的消息，适用于两个进程间的通信。
2. 共享内存用来实现进程间共享的、非常庞大的、读写操作频率很高的数据，适用于多进程间的通信。
3. 其他考虑用 socket，主要应用在分布式开发中。

---

#### 进程调度算法

为了确定首先执行哪个进程以及最后执行哪个进程以实现最大 CPU 利用率：

1. <span style="background-color: yellow">先来先服务 FCFS</span>：按照进程到达的先后顺序执行。<span style="background-color: yellow">非抢占式算法</span>，只能由当前的进程主动放弃 CPU。<span style="background-color: yellow">不会导致饥饿</span>。适合于长作业（进程），而不利于短作业（进程）。
2. <span style="background-color: yellow">短作业优先 SJF</span>：每次调度时选择当前已经到达就绪队列且运行时间最短的进程。<span style="background-color: yellow">默认非抢占式，也有抢占式的</span>。减少了平均周转时间，<span style="background-color: yellow">会导致长进程饥饿</span>。
3. <span style="background-color: yellow">高响应比优先 HRRN</span>：调度时选择响应比最高的进程服务。响应比=(等待时间+运行时间)/运行时间。<span style="background-color: yellow">非抢占式，不会导致饥饿</span>，响应比计算增加开销。
4. <span style="background-color: yellow">时间片轮转 RR</span>：按照各进程到达就绪队列的顺序，轮流执行一个时间片。<span style="background-color: yellow">抢占式，不会导致饥饿</span>，但是高频率的进程上下文切换增加开销。
5. <span style="background-color: yellow">优先级调度算法</span>：调度时选择优先级最高的进程。<span style="background-color: yellow">抢占式、非抢占式都有，会导致低优先级进程饥饿</span>。适用于实时操作系统。
6. <span style="background-color: yellow">多级反馈队列调度算法</span>：前面介绍的几种进程调度的算法都有一定的局限性。如**短进程优先的调度算法，仅照顾了短进程而忽略了长进程** 。多级反馈队列调度算法既能使高优先级的作业得到响应又能使短作业（进程）迅速完成。，因而它是目前**被公认的一种较好的进程调度算法**，UNIX 操作系统采取的便是这种调度算法。

---

#### 僵尸进程、孤儿进程

- **僵尸进程**

  僵尸进程是当子进程比父进程先结束，而父进程又没有回收子进程，释放子进程占用的资源，此时子进程将成为一个僵尸进程。

- **孤儿进程**

  一个父进程退出，而它的一个或多个子进程还在运行，那么那些子进程将成为孤儿进程。孤儿进程将被 init 进程（进程号为 1）所收养，并由 init 进程对它们完成状态收集工作。

---

### 内存管理机制

#### 内存管理主要是做什么的？

- 负责内存的分配与回收（malloc 函数：申请内存，free 函数：释放内存）
- <span style="background-color: yellow">地址转换</span>：逻辑地址 <---> 物理地址。操作系统引入了虚拟内存，<font color='red'>进程持有的虚拟地址会通过 CPU 芯片中的内存管理单元（MMU）的映射关系</font>，来转换变成物理地址，然后再通过物理地址访问内存。

​

<span style="background-color: yellow">内存管理主要有 3 种方式：分段、分页、段页式</span>。

- 分段：将程序的地址空间按照程序自身的逻辑关系划分为若干个段。
- 分页：将内存空间分为一个个大小相等的页区。通过页表对应逻辑地址和物理地址。
- 段页式：<span style="background-color: yellow">将进程按逻辑分段，再将各段分页</span>（如：每个页面 4KB），再将内存空间分为大小相同的内存块，将各页面分别装入内存块中。

#### 内存碎片

​ 分为内部碎片和外部碎片。内部碎片和外部碎片最明显的区别就是内部碎片能够明确指出这部分内存属于哪个进程，而外部碎片不属于任何进程。

- 内部碎片：指已经被分配给某个进程，但是该进程却使用不到的内存空间，只有当该进程运行完毕后才能释放这块内存空间。
- 外部碎片：指内存分配过程中产生的不可被利用的、已申请内存之外的内存空间，外部碎片往往比较多，而且每块碎片都很小。

<font color='red'>解决办法：段页式内存分配机制</font>

#### 分页与分段的区别？

1. <span style="background-color: yellow">段是信息的逻辑单位</span>，它是根据用户的需要划分的，因此段对用户是可见的 ；<span style="background-color: yellow">页是信息的物理单位</span>，是为了管理主存的方便而划分的，对用户是透明的；
2. 段的大小不固定，由它所完成的功能决定；页大小固定，由系统决定；
3. 段向用户提供二维地址空间（段名+段内地址）；页向用户提供的是一维地址空间；
4. 分页会产生内碎片，但不会产生外碎片，分段会产生外碎片，但不会产生内碎片。

|      | 优点                                                                                                   | 缺点                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 分页 | 内存空间利用率高，<span style="background-color: yellow">不会产生外部碎片</span>，只会有少量的页内碎片 | 不方便按照逻辑模块实现信息的共享和保护                                                           |
| 分段 | 很方便按照逻辑模块实现信息的共享和保护                                                                 | 如果段长过大，则不容易分配连续空间；<span style="background-color: yellow">会产生外部碎片</span> |

---

#### 虚拟地址和物理地址之间的映射

1. 虚拟地址和物理地址之间的映射是以页（4kb）为单位进行映射的。

2. 每一个进程都有一个 PCB 进程控制块，里面包含了一些进程的信息（页目录、状态、ID、PID）

3. 映射过程（32 位系统下）：

   ​ 首先 PCB 中有一个指向一级分页表的指针，每一个页表的大小均为 4096B（4KB），可以存储 1024 个地址。其中一级页表中每一个地址对应着一个二级页表的首地址，二级页表中也存储着 1024 个地址，其中每个地址分别对应着物理内存上面的每一个页的首地址。这样一来，虚拟地址空间所能够访问的地址有 1024 _ 1024 _ 4096B = 2^32B = 4GB；正好是 4G。
   **我们知道进程的虚拟地址称为线性地址，每一个线性地址都由第一级页表、第二级页表以及该地址相对于该页首地址的偏移量三部分组成，即 10-10-12 的形式：**

   ![image-20220303211414476](JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20220303211414476.png)

---

### 虚拟内存 & 页面置换

​ 这个在我们平时使用电脑特别是 Windows 系统的时候太常见了。很多时候我们使用点开了很多占内存的软件，这些软件占用的内存可能已经远远超出了我们电脑本身具有的物理内存。

​ 原因就是因为使用了虚拟内存，它使得应用程序认为它拥有连续的可用的内存（一个连续完整的地址空间），而实际上，它通常是被分隔成多个页，部分页暂时存储在外部磁盘上，在需要时进行数据交换。

实现虚拟技术的两个关键点：

- <font color='red'>请求调页功能</font>：访问的信息不在内存时，由操作系统负责将所需信息从磁盘调入内存。
- <font color='red'>页面置换功能</font>：内存空间不够时，将内存中暂时用不到的信息换出到 磁盘。

#### 局部性原理

​ 局部性原理是虚拟内存技术的基础，正是因为程序运行具有局部性原理，才可以只装入部分程序到内存就开始运行。具体是指，我们的程序在执行的时候往往呈现局部性规律，也就是说在某个较短的时间段内，程序执行局限于某一小部分，程序访问的存储空间也局限于某个区域。

---

#### 缺页中断/缺页异常

​ 进程线性地址空间里的页面不必常驻内存，在执行一条指令时，如果发现它要访问的页不在内存时，那么停止该指令的执行，<font color='red'>并产生一个页不存在的异常（缺页中断）</font>，对应的故障处理程序可通过从磁盘加载该页的方法来排除故障，之后，原先引起异常的指令就可以继续执行，而不再产生异常。

​ 缺页中断是因为当前执行的指令想要访问的目标页面未调入内存而产生的， 因此<font color='red'>属于内中断</font>。一条指令在执行期间， 可能产生多次缺页中断。

<img src="./JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20211208205352437.png" alt="image-20211208205352437" style="zoom:80%;" />

请求分页存储管理与基本分页存储管理的主要区别：

1. 在程序执行过程中，当所访问的信息不在内存时，由操作系统负责将所需信息从外存调入内存，然后继续执行程序<font color='red'>（请求调页）</font>
2. 若内存空间不够， 由操作系统负责将内存中暂时用不到的信息换出到外存<font color='red'>（页面置换）</font>

---

#### 页面置换算法？

​ 内存中给页面留的位置是有限的，在内存中以帧为单位放置页面。为了防止请求调页的过程出现过多的内存页面错误而使得程序执行效率下降，我们需要设计一些页面置换算法：<span style="background-color: yellow">常见前 4 个</span>

- **先进先出置换算法（FIFO）**：先进先出，即淘汰最早调入的页面。
- **最佳置换算法（OPT）**：选未来最远将使用的页淘汰，是一种最优的方案，可以证明缺页数最小。<span style="background-color: yellow">理论最优，但无法实现</span>
- **最近最久未使用（LRU）**：即选择最近最久未使用的页面予以淘汰。
- **最少使用页面置换算法（LFU）** : 该置换算法选择在之前时期使用最少的页面作为淘汰页。
- **时钟（Clock）置换算法**：时钟置换算法也叫**最近未用算法 NRU**（Not RecentlyUsed）。该算法为每个页面设置一位<span style="background-color: yellow">访问位</span>，将内存中的所有页面都通过链接指针链成一个循环队列。循环扫描各页面，第一轮淘汰访问位=0 的，并将扫描过的页面置为 1。若第一轮没选中，则进行第二轮扫描。
- **改进型 CLOCK（改进型 NRU）**：若用（访问位，修改位）来表示，则第一轮淘汰（0,0），第二轮淘汰（0,1），并将扫描过的页面访问位都置为 0，第三轮淘汰（0,0），第四轮淘汰（0,1）。

---

### 动态链接库和静态链接库

- 静态链接就是在编译链接时直接将需要的执行代码拷贝到调用处，优点就是在程序发布的时候就不需要的依赖库，也就是不再需要带着库一块发布，程序可以独立执行，但是体积可能会相对大一些。
- 动态链接就是在编译的时候不直接拷贝可执行代码，而是通过记录一系列符号和参数，在程序运行或加载时将这些信息传递给操作系统，操作系统负责将需要的动态库加载到内存中，然后程序在运行到指定的代码时，去共享执行内存中已经加载的动态库可执行代码，最终达到运行时连接的目的。优点是多个程序可以共享同一段代码，而不需要在磁盘上存储多个拷贝，缺点是由于是运行时加载，可能会影响程序的前期执行性能。

---

### 编译系统

![image-20211208212223440](JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/image-20211208212223440.png)

![h0110 。  程 序  （ 文 本 ）  预 处 理 器  （ cpp 〕  he 110 。 1  修 改 了 的  源 程 序  （ 文 本 ）  编 译 器  (ccl)  he 《 0 ． S  汇 编 程 序  （ 文 本 ）  汇 编 器  （ as ）  printE.O  he110 · 0  可 重 定 位  目 标 程 序  { 二 进 制 》  链 接 器  he110  可 执 行  目 标 程 序  图 1 ． 3 编 译 系 统 ](JUC%20&%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.assets/clip_image001-16389697493221.png)

- 预处理阶段：处理以 # 开头的预处理命令；
- 编译阶段：翻译成汇编文件；
- 汇编阶段：将汇编文件翻译成可重定位目标文件；
- 链接阶段：将可重定位目标文件和 printf.o 等单独预编译好的目标文件进行合并，得到最终的可执行目标文件。

---

### 磁盘调度算法

<span style="background-color: yellow">为了提高磁盘的访问性能，一般是通过优化磁盘的访问请求顺序来做到</span>，常用的磁盘调度算法有以下 4 种：

1. <span style="background-color: yellow">先来先服务（FCFS）</span>：根据进程请求访问磁盘的先后顺序进行调度。<span style="background-color: yellow">不会饥饿</span>，但如果大量进程竞争使用磁盘，这种算法性能低，请求访问的磁道可能会很分散，导致寻道时间过长。

2. <span style="background-color: yellow">最短寻道时间优先算法（SSTF）</span>：要求访问的磁道与当前磁头所在的磁道距离最近，以使每次的寻道时间最短。性能较好，平均寻道时间短，克服了先来先服务（FCFS）调度算法中磁臂移动过大的问题，<span style="background-color: yellow">可能导致饥饿</span>。

3. <span style="background-color: yellow">扫描算法（SCAN）（电梯调度算法）</span>：磁头在一个方向上移动，访问所有未完成的请求，直到磁头到达该方向上的最后的磁道，才调换方向。由于磁头移动规律与电梯运行相似，故又称为电梯调度算法。性能较好，平均寻道时间短，<span style="background-color: yellow">不会导致 “饥饿”</span>，但局部性访问方面性能差，不利于远端磁头一端的访问请求

4. <span style="background-color: yellow">循环扫描算法（CSCAN）</span>：只有磁头朝某个特定方向移动时，才处理磁道访问请求，而返回时直接快速移动至起始端，并且返回中途不处理任何请求，该算法的特点：磁道只响应一个方向上的请求。消除了对两端磁道请求的不公平，<span style="background-color: yellow">不会导致 “饥饿”</span>。
