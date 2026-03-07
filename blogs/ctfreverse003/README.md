# 强网杯Polyencryption

所以给大家写一个wp吧，这事好久不做了，😉，好好好谢谢谢谢，给大家献丑了...

总的来说，这个题目是一非常巨大的工程，需要逆向c#/java/python的逻辑，3个语言互相加密，并相互控制，巧妙的实现了多种同步锁机制，实现后逐渐进行化简发现，这是一种魔改AES-128结构的加密，但是似乎并不是仅仅替换常量那样简单。

## 正文

先使用各种dotnet反汇编工具进行分析，尝试了一遍发现还是dotpeek最佳，能够几乎完整的还原整个代码。

反编译中唯一有问题的地方：

```csharp
long[] destinationArray = new long[16 /*0x10*/];
Array.Copy((Array) Saw.s, 1017, (Array) destinationArray, 0, 16 /*0x10*/);
// ISSUE: reference to a compiler-generated field
// ISSUE: reference to a compiler-generated field
// ISSUE: reference to a compiler-generated field
// ISSUE: method pointer
Saw.iv = Array.ConvertAll<long, byte>(destinationArray, Saw.<>c.<>9__24_0 ?? (Saw.<>c.<>9__24_0 = new Converter<long, byte>((object) Saw.<>c.<>9, __methodptr(<Main>b__24_0))));
TcpListener tcpListener = new TcpListener(IPAddress.Loopback, 0);
tcpListener.Start();
```

打开源文件看`compiler_generated_code`，分析发现这个应该是一种lambda表达式的编译结果：

```csharp
  [CompilerGenerated]
  [Serializable]
  private sealed class <>c
  {
    [Nullable(0)]
    public static readonly Saw.<>c <>9;
    [Nullable(0)]
    public static Converter<long, byte> <>9__24_0;

    static <>c()
    {
      Saw.<>c.<>9 = new Saw.<>c();
    }

    public <>c()
    {
      base..ctor();
    }

    internal byte <Main>b__24_0(long x)
    {
      return (byte) x;
    }
  }
```

显然，是将long截取低位取byte，源结构应当是：
```csharp
Saw.iv = Array.ConvertAll<long, byte>(destinationArray, x => (byte)x);
```
也就是说，这个iv就被拿到了，同时可以看到k是fullname的`sha256`

```python
iv1 = 0x0000000000008CAB20E0EB5D0E419101
k1 = 0xf8963561a24b24f219999d30d026f9421cfa89731cafe47e47560a3aaf557559
```

然后观察到调用了python，但是明面找不到python文件，binwalk一下，发现dll文件后面贴了一个jar文件，dump出来，解压得到以下文件

```zsh
   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2024-05-06 04:18:20 .....          338          235  Curse.class
2024-05-06 04:18:20 .....         2048          569  Curse.dll
2024-05-06 04:18:20 .....          736          389  Hack.class
2024-05-06 04:18:20 D....            0            0  META-INF
2024-05-06 04:18:20 .....           42           42  META-INF/MANIFEST.MF
2024-05-06 04:18:20 .....         8823         4316  Saw.class
2024-05-06 04:18:20 .....         3985         1423  remote_pdb.py
2024-05-06 04:18:20 .....         1337          707  remote_pdb_LICENSE.txt
2024-05-06 04:18:20 .....         5025         2075  saw.py
------------------- ----- ------------ ------------  ------------------------
2024-05-06 04:18:20              22334         9756  8 files, 1 folders
```

应当是调用了这个里面的`Saw.py`，然后python再调用`java`，打开一看，果然如此

```python
def child(p):
    global ch
    ch = subprocess.Popen(["java", ...], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    
rdb = RemotePdb(host='127.0.0.1', port=0, port_callback=child)
rdb.set_trace()
```

使用所给的条件创建一个docker，跑示例输入，结果

```zsh
root@ub> dotnet polyencrypt.dll abe74e3a9c375b3428bf31d1f8fa49c1
.......................1B3E8E7F2A52540CB60AC9F57EB0DB5F
```

题目是3种语言通过lo来传递信息的，于是乎抓127.0.0.1的包来辅助分析，幸运的是，程序字节后面的jar包是没有签名的，可以自由的去修改，最方便的patch地点在python程序，写入/tmp/out.txt文件。

一点一点硬分析是离不开的，于是一点一点分析程序结构。c#调用了内部两个方法：

```csharp
private static async Task<bool> Hack()
{
    NetworkStream ns = Saw.client.GetStream();
    byte[] buffer = new byte[4];
    if (await ns.ReadAsync(buffer, 0, buffer.Length) == 0)
      return false;
    int len = BitConverter.ToInt32(buffer, 0);
    if (len == 0)
    ...
}
...
int num1 = await Saw.Hack() ? 1 : 0;
await Saw.Track();
```
分析Hack程序可以看到，是在与python通信,先接收了4byte，然后以此为长度再去读取，观察python里面有：

```python
rdb = RemotePdb(host='127.0.0.1', port=0, port_callback=child)
rdb.set_trace()

hack.send(p32(0))
hack.send(p32(a))
```

这个a似乎是凭空产生的，但是注意到在java中有定义

```java
String[] var10001 = var6.getProperty("sun.jdwp.listenerAddress").split(":");
var3.println("global a; a=" + var10001[1]);
var3.println("global iv; iv=b'YdlvQDCjuS5T89m1'");
var3.println("continue");
```

说明是set_trace的作用，可以暂停python程序接受java传来的指令并执行。而a显然传的就是`jdwp`端口，传给`c#`显然是让其操控jvm。

无他，只得老老实实一句一句看，按照调用的顺序分析：

```csharp
private static async Task<bool> Hack()
{
    ...
    byte[] buf2 = new byte[len];
    int num;
    for (int pos = 0; pos < len; pos += num)
    {
        num = await ns.ReadAsync(buf2, pos, buf2.Length - pos);
        if (num == 0)
            return false;
    }
    AssemblyLoadContext assemblyLoadContext = new AssemblyLoadContext("tmp", true);
    Assembly assembly = (Assembly) null;
    using (MemoryStream memoryStream = new MemoryStream(buf2))
        assembly = assemblyLoadContext.LoadFromStream((Stream) memoryStream);
    Saw.sp = (int) ((MethodBase) assembly.GetType("Curse").GetMethod("Do")).Invoke((object) null, new object[2]
    {
        (object) Saw.s,
        (object) Saw.sp
    });
    await ns.WriteAsync(ReadOnlyMemory<byte>.op_Implicit(BitConverter.GetBytes(Saw.s[0])), new CancellationToken());
    return true;
}
```

Hack函数先是接受了传来数据包的长度，是python程序传过来的，前面分析已经知道，如果长度是0会走到初始化端口（被java定义的被python发送的a值）以及Slash函数，否则观看下面，会将接受的二进制解析为c#汇编并动态加载执行这个里面的Do函数。并将s[0]结果送回到python，交给python做后续处理。

Hack函数调用了一个叫做Slash函数，这是第一次传入jdwp的端口号的时候被调用的，猜测应当是某种初始化。

```csharp
private static async Task Slash()
{
    ...
    await ns.WriteAsync(ReadOnlyMemory<byte>.op_Implicit(new byte[11] {
        0, 0, 0, 11, 0, 0, 0, 1, 0, 1, 7
        }), new CancellationToken());
    int num2 = await ns.ReadAsync(head, 0, head.Length);
    for (int index = 0; index < 5; ++index)
        Saw.vals[index] = sr.ReadInt32();
    Saw.tit = new byte[Saw.vals[2]];
    await ns.WriteAsync(ReadOnlyMemory<byte>.op_Implicit(new byte[11]{
        0, 0, 0, 11, 0, 0, 0, 1, 0, 1, 3
        }), new CancellationToken());
    sr.ReadBytes(11);
    uint num3 = sr.ReadUInt32();
    for (int index = 0; (long) index < (long) num3; ++index)
    {
        int num4 = (int) sr.ReadByte();
        byte[] numArray2 = sr.ReadBytes(Saw.vals[3]);
        switch (Encoding.ASCII.GetString(sr.ReadBytes(sr.ReadInt32())))
        {
            case "LSaw;":
            Saw.swcl = numArray2;
            break;
            case "LCurse;":
            Saw.ccl = numArray2;
            break;
            case "LHack;":
            Saw.hcl = numArray2;
            break;
        }
        sr.ReadInt32();
    }
    ...
  }
```

jdwp的数据格式大致为：

| 字节序列       | 含义           | 类型 |
|---------------|----------------|------|
| `0, 0, 0, 11`  | 请求长度 (length) | `int` |
| `0, 0, 0, 1`   | 请求标志 (flag)   | `int` |
| `0, 1`         | 组号 (group)     | `short` |
| `7`            | 指令码 (code)    | `byte` |

我知道这很长，但是还是比较关键的，最前面忽略了和jdwp握手的请求，后面`0, 0, 0, 11, 0, 0, 0, 1, 0, 1, 7` 的数据包查询并对应[官方文档](https://docs.oracle.com/en/java/javase/11/docs/specs/jdwp/jdwp-protocol.html)可以看出，(1,7) 是查询IDsize，撤回值是5个，这刚好对应了vals的长度，后面的指令(1,3)是AllClasses，会撤回所有类，后面有一个循环判断，分别将ID号写进`swcl/ccl/hcl`，后续也是一系列初始化，查询文档并总结有：

| 缩写 | 对应名称      |
|------|---------------|
| swcl | Saw           |
| swcm | Saw.calc      |
| ccl  | Curse         |
| ccm  | Curse.hack    |
| hcl  | Hack          |
| hcm  | Hack.*        |

之后在main函数的按照调用顺序里面又有Track函数/Shreck函数/Crack函数/Stop函数，循环结束后又有Hack函数和Horror函数的调用，这什么烂名字(bushi)

依次对照流量数据进行分析，注意到之前分析的一个Slash函数，里面有这一段：

```csharp
    ...
    await ns.WriteAsync(ReadOnlyMemory<byte>.op_Implicit(new byte[18]{
        0, 0, 0, (11 + Saw.vals[3] + 1 + 1 + 4 + 1), 0, 0, 0, 1, 0, 15, 1, 40, 1, 0, 0, 0, 1, 4
        }), new CancellationToken());
    await ns.WriteAsync(ReadOnlyMemory<byte>.op_Implicit(Saw.ccl), new CancellationToken());//SUSPEND_ALL when called (Curse)
    sr.ReadBytes(15);
    ...
```

除去前面的数据长度和flag，后面的id是(15,1)查询发现是对函数调用价触发事件的，后面又传出了Curse的类id，查询综合得到结论，初始化的时候就将其这个类设置为在调用方法的时候就会暂停`jvm`

去分析java代码，发现在最初调用出现了Curse.magic，但是因为并没有对其加入触发事件，故等效于无，后面在每一个循环中都有Curse.magic的调用，且这是类中唯一方法，而分析Breck函数分析可以得到就是用来解锁的，这是第一对上锁解锁机制。

后面注意到c#中main方法中的一些长字符串都是先Crack函数然后是Stop函数，应该是被加密的逻辑，分析一下

```csharp
private static async Task<byte[]> Crack(byte[] msg)
{
    NetworkStream ns = Saw.client.GetStream();
    await ns.WriteAsync(ReadOnlyMemory<byte>.op_Implicit(BitConverter.GetBytes(msg.Length)), new CancellationToken());
    await ns.WriteAsync(ReadOnlyMemory<byte>.op_Implicit(msg), new CancellationToken());
    byte[] b = new byte[4];
    int num1 = await ns.ReadAsync(b, 0, b.Length);
    byte[] m2 = new byte[BitConverter.ToInt32(b, 0)];
    int num2;
    for (int pos = 0; pos < m2.Length; pos += num2)
    {
        num2 = await ns.ReadAsync(m2, pos, m2.Length - pos);
        if (num2 == 0)
            return m2;
    }
    return m2;
}
```

这个是client，是向python传输的内容，而python里面的接受逻辑如此：

```python
    ...
    rlen = u32(hack.recv(4))
    while rlen > 0:
        d = unpad(AES.new(hashlib.sha256(curse).digest(), AES.MODE_CBC, iv).decrypt(hack.recv(rlen)), 16)
        hack.send(p32(len(d)))
        hack.send(d)
        rlen = u32(hack.recv(4))
    ...
```

就是说会将内容按照AES进行解密，key是`curse`文件的sha256，而iv是之前java传给的，拿到第二组解密：

```python
iv2 = 0x59646c765144436a7553355438396d31
k2 = 0xe33eb8a9ae522cacc94de3e5fcf7e1dd2e9d3a5230b42e7ceb81c97f1bb6ba47
```

这个函数会传给python让其解密，然后传回去，再给到Stop函数，分析Stop函数，发现是一路发送id，最后传的id是`Hack.*`里面的，结合传输的字节(3,3)显然是调用了里面的函数，按照data的第一个字节传输的内容决定其索引。值得一提的是，最初在Slash初始化一些东西的时候，确定`Hack.*`的时候，是按照函数名进行顺序排列的，java代码里面也是简单的命名为a~h，这样只需要一个线性映射就能算出来是哪一个函数。

看到了其撤回值就是java那边方法的计算结果。

然后整个逻辑走下去，到达有一个看似是给jdwp传输信息的地方：

```csharp
    ...
    if (rr == 22)
        {
            valueTask = Saw.blient.GetStream().WriteAsync(ReadOnlyMemory<byte>.op_Implicit(new byte[15]{
                0, 0, 0, 15, 0, 0, 0, 1, 0, 1, 10, 0, 0, 0, 0
                }), new CancellationToken());
            await valueTask;
            p.Kill();
    ...
```

显然这个是最终终止的内容，而向`jvm`传输的数据也是操控终止的命令，这个加密只有22轮

后面是Breck函数，前面已经分析过，这就是给jvm解锁用的，后面向python传输数据也是为了打破解密循环的，后面就到一直hack，hack中关键的内容是和python进行交互，涉及动态加载c#于是跑到python进行查看。

里面的也是类似的流程，也是一大串加密的东西，里面也是crack函数后交给lol函数(不完别搞)，crack函数中`rdb.set_trace()`可以理解为暂停了python这边程序，等待java那边响应，对照数据包查询，这个应当是不匹配`var10.equals("(Pdb) 0")`，所以走到了下面的一个解密段，使用的是同样的aes加密，iv和key使用了java内部的东西：

```java
SecretKeySpec var7 = new SecretKeySpec(MessageDigest.getInstance("SHA-256").digest(var4.getCanonicalName().getBytes()), "AES");
IvParameterSpec var8 = new IvParameterSpec(var5.getName().substring(0, 16).getBytes());
```

简单得到：

```python
iv3 = 0x6765744167656e7450726f7065727469
k3 = 0x26f196237743ea19fc45acc1f5964b03316ddb56ef6de22aefca12154291464a
```

撤回python执行代码是通过`continue`来实现的，lol函数是替换了`Curse.dll`中间一段字节，然后传回去了，交给`Saw.Hack`执行，用ida打开看汇编，果然就是中间有一大长段`nop`，专门让其替换指令的。

<p align="center">
    <img src="./blogs/ctfreverse003/image.png" alt="pic">
</p>

循环计数变量名称出奇的一致，都是rr，这很善良了，在python的一通循环结束后，就是到了循环的set_trace，看样子就是来让java交给python来运行的，于是进去分析java代码。

里面的结构也是一样的循环，根据curse的所锁机制，一次c#循环计数对应python中一次循环计数变换，java在这个周期中仍然是仅仅进行一次计数变化。里面的hack函数是进行解密的关键，里面每一次调用都有Curse.magic，暂停掉，刚好在c#中在结束后进入了while的循环：

```csharp
        ...
        await valueTask;
        do
            ;
        while (await Saw.Hack());
        bool flag = true;
        while (flag)
            flag = await Saw.Horror();
        ++rr;
    }
  }
}
```

Horror函数里面进行分析，里面(2,6)是字符串字段ID，后面传入了ccm，(10,1)是读取其值，就是说修改Curse.hack的值，这刚好是对应了这个里面的函数的作用，后面(1,9)解开了锁，恢复执行。说白了就是麻烦c#去解个秘，然后后面走个流程结束，最后给来个

```csharp
    ...
    var3.println(hack(new byte[]{109, 82, -84, -48, 54, -41, -91, 47, 32, 88, 51, -49, 89, -37, -113, -8}));
    var3.println("continue");
    Curse.hack = "!";
    Curse.magic();
    ...
```

在Horror函数里面提前走到结束，这个字符串用c#里面的密钥解密后得到的是`b'!r=0'`,结合python循环后面的一段

```python
    ...
    while True:
        rdb.set_trace()
        if r == 0:
            break
        exec(r)
    rr += 1
```
结束了这个循环，再次回到c#执行；c#涉及到一个巨大的s数组，python有个m数组，java的Hack里面也有一个m数组，现在用pythhon全部实现：过程patch辅助进行调试修改，得到如下脚本：

```python
import struct

# box for byte substitution
BOX = [...]

mj = [0] * 128
mp = [0] * 128#m in python
s = [0] * 1034
sp = 1

hexstr = 'abe74e3a9c375b3428bf31d1f8fa49c1'
rr: int = 0
s[1023] = 3207972492
s[1024] = 1190065579
s[1025] = 4165979424
s[1026] = 2693353696
s[1027] = 3628337899
s[1028] = 1707638109
s[1029] = 1003779598
s[1030] = 2653425729
s[1031] = 795752593
s[1032] = 2469382657
while True:
    print('.',end='')
    # c# part
    if rr % 2 == 0:
        if rr == 0:
            s[32] = int(hexstr[0:8], 16)
            s[33] = int(hexstr[8:16], 16)
            s[34] = int(hexstr[16:24], 16)
            s[35] = int(hexstr[24:32], 16)
        else:
            sp -= 27
            mj[17] = 1
            mj[16] = 0
            for i in range(4):
                mj[mj[16]] <<= 8
                mj[mj[16]] &= 0xffffffff
                mj[mj[16]] ^= mj[mj[17]]
                mj[17] += 1

                mj[mj[16]] <<= 8
                mj[mj[16]] &= 0xffffffff
                mj[mj[16]] ^= mj[mj[17]]
                mj[17] += 1

                mj[mj[16]] <<= 8
                mj[mj[16]] &= 0xffffffff
                mj[mj[16]] ^= mj[mj[17]]
                mj[17] += 1
                
                mj[16] += 1
                mj[mj[16]] = mj[mj[17]]
                mj[17] += 1
            #JavaFuncs.a(0x10, 0x1)
            s[32] = s[1] ^ mj[0]
            s[33] = s[2] ^ mj[1]
            s[34] = s[3] ^ mj[2]
            s[35] = s[4] ^ mj[3]
            if rr == 22:
                for i in range(4):
                    print(f'{s[32 + i] & 0xffffffff:08x}', end='')
                exit(0)
    else:
        if rr == 1:
            mj[1] = 0x49e99e07
            sp += 3
        else:
            mj[1] ^= mj[0]
        s[2] = mj[0]
        s[3] = mj[1]
        if rr == 1:
            s[4] = 1038097261
        else:
            s[4] ^= s[3]
    
    # python part
    if rr % 2 == 0:
        if rr == 0:
            s[sp] = 2427014626
            sp += 1
            s[256] = 1023
        else:
            s[sp] = s[4]
            s[sp] = (s[sp] << 8) & 0xFFFFFFFFFFFFFFFF
            s[sp] &= 4294967295
            sp += 1
            s[sp] = s[4]
            s[sp] = (s[sp] >> 24) & 0xFFFFFFFFFFFFFFFF
            s[sp - 1] |= s[sp]
            s[0] = s[sp - 1]
            sp -= 1
            tmp = struct.unpack("I", bytes(map(lambda x : BOX[x], struct.pack("I", s[0]))))[0]
            s[1] ^= tmp
            s[1] ^= s[s[256]]
            s[256] += 1
        s[0] = s[1]
        mp[0] = s[0] & 0xffffffff
        s[0] = s[2]
        mp[1] = s[0] & 0xffffffff
        s[0] = s[3]
        mp[2] = s[0] & 0xffffffff
    else:
        sp += 31
        sp -= 4
        for i in range(4):
            mp[i] = struct.unpack("I", bytes(map(lambda x : BOX[x], struct.pack("I", s[sp+i]))))[0]
    
    # java part
    if rr % 2 == 0:
        if rr == 0:
            mp[1]=1166827919
        else:
            mp[1] ^= mp[0]
        mj[0] = mp[1]
        mj[1] = mp[2]
    else:
        newlist=list()
        xt = lambda a: (((a << 1) ^ 0x1B) & 0xFF) if (a & 0x80) else (a << 1)
        for i in range(4):
            b=list(struct.pack('>I',mp[i]))
            mp[6]=b[0]^b[1]^b[2]^b[3]
            newlist.append([b[0]^mp[6]^xt(b[0]^b[1]),
                        b[1]^mp[6]^xt(b[1]^b[2]),
                        b[2]^mp[6]^xt(b[2]^b[3]),
                        b[3]^mp[6]^xt(b[3]^b[0])])
        
        for i in range(4):
            for j in range(4):
                mj[i*4+j] = newlist[0][j]
                newlist.append(newlist.pop(0))
            newlist.append(newlist.pop(0))
    rr += 1
```

这里根据分析的逻辑，替换掉需要解密并传递的步骤，将3个地方按照运行顺序拼接起来，替换函数，手动修复逻辑，简化了巨大数组，省去一个m，最终的加密版本：

```python
import struct
from typing import List

BOX = [...]

MAGIC = [0xbf35c68c, 0x46eef5ab, 0xf84fcd20, 0xa08950e0, 0xd8440aeb,
         0x65c87d5d, 0x3bd4760e, 0x9e281041, 0x2f6e3891, 0x932fca01]

STATUS = [0x90a94de2, 0x458c618f, 0x49e99e07, 0x3de01b6d]

def m32(v: int) -> int:
    # Ensure value fits in 32 bits
    return v & 0xFFFFFFFF

def rotl32(v: int, bits: int) -> int:
    # Rotate left a 32-bit integer
    v = m32(v)
    return m32((v << bits) | (v >> (32 - bits)))

def sbox32(value: int) -> int:
    # Apply S-Box substitution for each byte in the 32-bit word
    packed = struct.pack('<I', m32(value))
    substituted = bytes(BOX[b] for b in packed)
    return struct.unpack('<I', substituted)[0]

def xtime(a: int) -> int:
    # AES GF(2^8) multiply by 2 with reduction x^8 + x^4 + x^3 + x + 1 (0x1B)
    return (((a << 1) ^ 0x1B) & 0xFF) if (a & 0x80) else (a << 1)

def mix(word: int) -> List[int]:
    b0, b1, b2, b3 = struct.pack('>I', m32(word))
    xor_sum = b0 ^ b1 ^ b2 ^ b3
    return [
        (b0 ^ xor_sum ^ xtime(b0 ^ b1)) & 0xFF,
        (b1 ^ xor_sum ^ xtime(b1 ^ b2)) & 0xFF,
        (b2 ^ xor_sum ^ xtime(b2 ^ b3)) & 0xFF,
        (b3 ^ xor_sum ^ xtime(b3 ^ b0)) & 0xFF,
    ]

def build_m(words: List[int]) -> List[int]:
    mp = [sbox32(w) for w in words]
    rows = [mix(w) for w in mp]
    
    m = []
    for i in range(4):
        for j in range(4):
            row_index = (i + j) % 4
            m.append(rows[row_index][j])
    return m

def assemble_be(b0: int, b1: int, b2: int, b3: int) -> int:
    # Assemble four bytes into a big-endian 32-bit word
    return ((b0 & 0xFF) << 24) | ((b1 & 0xFF) << 16) | ((b2 & 0xFF) << 8) | (b3 & 0xFF)

def encrypt(hexstr: str) -> str:
    status = STATUS.copy()
    s = [0] * 4
    m = [0] * 16
    
    s[0] = int(hexstr[0:8], 16)
    s[1] = int(hexstr[8:16], 16)
    s[2] = int(hexstr[16:24], 16)
    s[3] = int(hexstr[24:32], 16)

    m = build_m(s)
    r = 0

    while True:
        s[0] = m32(status[0] ^ assemble_be(*m[0:4]))
        s[1] = m32(status[1] ^ assemble_be(*m[4:8]))
        s[2] = m32(status[2] ^ assemble_be(*m[8:12]))
        s[3] = m32(status[3] ^ assemble_be(*m[12:16]))
        if r == 10:
            return ''.join(f'{m32(s[i]):08x}' for i in range(4))
        tmp = sbox32(rotl32(status[3], 8))
        status[0] = m32(status[0] ^ MAGIC[r] ^ tmp)
        status[1] = m32(status[0] ^ status[1])
        status[2] = m32(status[1] ^ status[2])
        status[3] = m32(status[2] ^ status[3])
        m = build_m(s)
        r += 1

if __name__ == '__main__':
    print(encrypt('abe74e3a9c375b3428bf31d1f8fa49c1'))
    
```

剩下的工作就简单了。