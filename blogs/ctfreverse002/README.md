# smileyCTF2025-DNA

非常有趣（对我来说），给oldking的话直接爆杀的好吧。

做题的时候才听说这个东西叫栈机，不过这个和 `DNA` 结合起来，是四进制编码的程序序列。

## 题解

用 `PyLingual` 打开所给的 `pyc` 文件进行反汇编，虽然做的不咋样，但是也足够看了。

进行人工调整，得到能跑的版本：

```python
import marshal
import sys

s = []
m = {}
nm = {'A': 0, 'T': 1, 'G': 2, 'C': 3}
unlucky = [
    b'\x8coooooo...',
    b'\x96uuuuuu...',
    b"\x8aiiiiii...",
    b'\x82aaaaaa...'
]

trans = lambda s: sum((nm[c] << 2 * i for i, c in enumerate(s)))

if len(sys.argv) != 2:
    print(f'''Usage: {sys.argv[0]} <dna_file>''')
    sys.exit(1)
code = open(sys.argv[1]).read()
flag = input('> ').encode()

if len(flag) != 56:
    exit('WRONG!')
if flag[:6] != b'.;,;.{':
    exit('WRONG!')
if flag[-1] != 125:
    exit('WRONG!')
flag = flag[6:-1]

for i in range(len(flag)):
    m[640 + i] = flag[i]
pc = 0

while pc < len(code):
    pri, pro = map(trans, [code[pc:pc + 2], code[pc + 2:pc + 12]])
    
    match pri:
        case 0:#push pro
            s.append(pro)
            pc += 12

        case 1:#pop
            if not s:
                raise Exception('Stack underflow')
            s.pop()
            pc += 2

        case 2:#push $pro
            if pro not in m:
                raise Exception(f'Uninitialized memory access at {pro}')
            s.append(m[pro])
            pc += 12

        case 3:#pop $pro
            if not s:
                raise Exception('Stack underflow')
            m[pro] = s.pop()
            pc += 12

        case 4:#add (b+a)->a
            if len(s) < 2:
                raise Exception('Stack underflow')
            a, b = s.pop(), s.pop()
            s.append(a + b)
            pc += 2

        case 5:#minus (b-a)->a
            if len(s) < 2:
                raise Exception('Stack underflow')
            a, b = s.pop(), s.pop()
            s.append(b - a)
            pc += 2

        case 6:#mult (b*a)->a
            if len(s) < 2:
                raise Exception('Stack underflow')
            a, b = s.pop(), s.pop()
            s.append(a * b)
            pc += 2

        case 7:#mod (b%a)->a
            if len(s) < 2:
                raise Exception('Stack underflow')
            a, b = s.pop(), s.pop()
            if a == 0:
                raise Exception('Division by zero')
            s.append(b % a)
            pc += 2

        case 8:#test (b == a)->a
            if len(s) < 2:
                raise Exception('Stack underflow')
            a, b = s.pop(), s.pop()
            s.append(1 if a == b else 0)
            pc += 2

        case 9:#jmp pro
            pc = pro

        case 10:#je pro
            if not s:
                raise Exception('Stack underflow')
            if s.pop() == 1:
                pc = pro
            else:
                pc += 12

        case 11:#jne pro
            if not s:
                raise Exception('Stack underflow')
            if s.pop() != 1:
                pc = pro
            else:
                pc += 12

        case 12:#print
            if not s:
                raise Exception('Stack underflow')
            print(chr(s.pop()), end='')
            pc += 2

        case 13:#key
            if not s:
                raise Exception('Stack underflow')
            key = s.pop()

            def f():
                return
            f.__code__ = marshal.loads(bytes([b ^ key for b in unlucky.pop(0)]))
            f()
            pc += 2

        case 14:#swap (a,b) -> (b,a)
            if len(s) < 2:
                raise Exception('Stack underflow')
            a, b = s.pop(), s.pop()
            if a not in nm or b not in nm:
                raise Exception('Invalid')
            nm[a], nm[b] = nm[b], nm[a]
            pc += 2

        case 15:#end
            break

        case _:
            raise Exception(f'Invalid opcode {pri}')
```

可以看到里面其实是将DNA的4种核糖核酸来2进制储存，unlucky其实是code_obj对应字节码进行加密后的东西，看源码原来是异或一个 `key` ，而众所周知，这个东西肯定前面有一段0，那 `key` 就是0对应那一段对应的值，我们取 `code[1]` 就好，解密后存起来，方便后面使用。

因为栈机里面要用这些函数，而且更改的是`nm`，这关乎到文件的解码，所以说这些函数一定不是随机的函数，至少对应某个输入，其输出是固定值。

```python
import marshal, dis

unlucky = [
    b'\x8coooooo...',
    b'\x96uuuuuu...',
    b"\x8aiiiiii...",
    b'\x82aaaaaa...'
]
codes = []

for idx, blob in enumerate(unlucky):
    blob = bytes([char ^ blob[1] for char in blob])
    try:
        co = marshal.loads(blob)
        codes.append(co)
    except Exception as e:
        print("Failed to load:", e)
        continue
```

其实不需要分析这4个函数的，但是我还是分析了，逻辑简化结果如下：

```python
def unlucky_1():
    tmp = {}
    tmp['A'] = nm['T']
    tmp['T'] = nm['G']
    tmp['G'] = nm['C']
    tmp['C'] = nm['A']
    globals()['nm'] = tmp

def unlucky_2():
    tmp = {}
    tmp['A'] = nm['G']
    tmp['G'] = nm['T']
    tmp['C'] = nm['A']
    tmp['T'] = nm['C']
    globals()['nm'] = tmp

def unlucky_3():
    tmp = {}
    tmp['A'] = nm['G']
    tmp['C'] = nm['A']
    tmp['G'] = nm['C']
    tmp['T'] = nm['T']
    order = list(nm.keys())
    o_tmp = {k: tmp[k] for k in order}
    globals()['nm'] = o_tmp
    
def unlucky_4():
    tmp = nm.copy()
    nmvalues = list(nm.values())
    
    tmp['A'] = nmvalues[0]
    tmp['C'] = nmvalues[2]
    tmp['G'] = nmvalues[1]
    tmp['T'] = nmvalues[3]
    globals()['nucleotide_map'] = tmp
```

利用栈机源码，对 `DNA` 文件进行反汇编。这里盲猜只有一个end。

```python
code = open('vm.dna').read()

nm = {'A': 0, 'T': 1, 'G': 2, 'C': 3}
pc = 0
execct = 0

trans = lambda s: sum((nm[c] << 2 * i for i, c in enumerate(s)))

def unlucky_next():
    global execct
    if execct != -1:
        def func():
            return
        func.__code__ = codes[execct]
        func()
        execct += 1
    else:
        None

print("--- Start of program ---")
print("\tfunc at:", pc)

while pc < len(code):
    pri, pro = map(trans, [code[pc:pc + 2], code[pc + 2:pc + 12]])
    print(f'${pc:06}', end=' ')

    if pri == 0 or 2 <= pri <= 3 or 9 <= pri <= 11:
        pc += 12
    elif pri <=15:
        pc += 2
    else:
        raise Exception(f'Invalid opcode {pri}')
    ass = [
        f'Push: {pro} ',
         'Pop : None',
        f'Push: ${pro}',
        f'Pop : ${pro}',
        f'Calc: s[n-1] + s[n] -> s[n-1]',
        f'Calc: s[n-1] - s[n] -> s[n-1]',
        f'Calc: s[n-1] * s[n] -> s[n-1]',
        f'Calc: s[n-1] % s[n] -> s[n-1]',
        f'Calc: s[n-1] == s[n] -> s[n-1]',
        f'Jump: {pro}',
        f'Jpeq: {pro}',
        f'Jpne: {pro}',
         'Prnt:',
        f'Exec: unlucky_{execct+1}',
         'Swap: b <-> a',
         'End :\n--- End of program ---\n\n'
    ]
    print(ass[pri])
    if pri==13:
        unlucky_next()
    if pri==15:
        print(f'Exec count: {execct}')
        print(f'Final stack: {nm}')
        print(f'Final code pointer: {pc}')
        print(f'Final code length: {len(code)}')
```

得到结果如下，看起来也就是一个end，简略输出：

```zsh
--- Start of program ---
	func at: 0
$000000 Push: $640
$000012 Push: 106 
$000024 Calc: s[n-1] * s[n] -> s[n-1]
$000026 Push: $641
$000038 Push: 27 
$000050 Calc: s[n-1] * s[n] -> s[n-1]
$000052 Push: $642
$000064 Push: 140 
$000076 Calc: s[n-1] * s[n] -> s[n-1]
$000078 Push: $643
$000090 Push: 138 
$000102 Calc: s[n-1] * s[n] -> s[n-1]
$000104 Push: $644
$000116 Push: 108 
...
$069378 Push: 33 
$069390 Prnt:
$069392 Push: 10 
$069404 Prnt:
$069406 End :
--- End of program ---


Exec count: 4
Final stack: {'A': 2, 'G': 1, 'C': 3, 'T': 0}
Final code pointer: 69408
Final code length: 69408
```

结果看起来是不错的，应该没有什么问题，观察反汇编结果，发现有结构重复的段，重复率很高，大约是196行一次重复。

<p align="center">
    <img src="./blogs/ctfreverse002/image.png" alt="pic">
</p>

看汇编最后一段，发现是一个比较后判定是否正确的一段：

```zsh
$069144 Push: 49 
$069156 Calc: s[n-1] == s[n] -> s[n-1]
$069158 Jpne: 69308
$069170 Push: 67 
$069182 Prnt:
$069184 Push: 79 
$069196 Prnt:
$069198 Push: 82 
$069210 Prnt:
$069212 Push: 82 
$069224 Prnt:
$069226 Push: 69 
$069238 Prnt:
$069240 Push: 67 
$069252 Prnt:
$069254 Push: 84 
$069266 Prnt:
$069268 Push: 33 
$069280 Prnt:
$069282 Push: 10 
$069294 Prnt:
$069296 Jump: 69406
$069308 Push: 87 
$069320 Prnt:
$069322 Push: 82 
$069334 Prnt:
$069336 Push: 79 
$069348 Prnt:
$069350 Push: 78 
$069362 Prnt:
$069364 Push: 71 
$069376 Prnt:
$069378 Push: 33 
$069390 Prnt:
$069392 Push: 10 
$069404 Prnt:
$069406 End :
--- End of program ---
```

比较了是不是49个都对，然后根据这个进行跳转，对照ascii表，Jump前面打印的是正确，后面是打印的错误。

看一下那些重复的段，不难看出就是多项式和。

```zsh
$000000 Push: $640
$000012 Push: 106 
$000024 Calc: s[n-1] * s[n] -> s[n-1]
$000026 Push: $641
$000038 Push: 27 
$000050 Calc: s[n-1] * s[n] -> s[n-1]
$000052 Push: $642
$000064 Push: 140 
$000076 Calc: s[n-1] * s[n] -> s[n-1]
$000078 Push: $643
$000090 Push: 138 
$000102 Calc: s[n-1] * s[n] -> s[n-1]
$000104 Push: $644
$000116 Push: 108 
$000128 Calc: s[n-1] * s[n] -> s[n-1]
$000130 Push: $645
$000142 Push: 91 
$000154 Calc: s[n-1] * s[n] -> s[n-1]
$000156 Push: $646
$000168 Push: 131 
$000180 Calc: s[n-1] * s[n] -> s[n-1]
$000182 Push: $647
$000194 Push: 138 
$000206 Calc: s[n-1] * s[n] -> s[n-1]
$000208 Push: $648
$000220 Push: 106 
$000232 Calc: s[n-1] * s[n] -> s[n-1]
$000234 Push: $649
$000246 Push: 127 
$000258 Calc: s[n-1] * s[n] -> s[n-1]
$000260 Push: $650
$000272 Push: 161 
$000284 Calc: s[n-1] * s[n] -> s[n-1]
$000286 Push: $651
$000298 Push: 115 
$000310 Calc: s[n-1] * s[n] -> s[n-1]
$000312 Push: $652
$000324 Push: 177 
$000336 Calc: s[n-1] * s[n] -> s[n-1]
$000338 Push: $653
$000350 Push: 152 
$000362 Calc: s[n-1] * s[n] -> s[n-1]
$000364 Push: $654
$000376 Push: 15 
$000388 Calc: s[n-1] * s[n] -> s[n-1]
$000390 Push: $655
$000402 Push: 55 
$000414 Calc: s[n-1] * s[n] -> s[n-1]
$000416 Push: $656
$000428 Push: 230 
$000440 Calc: s[n-1] * s[n] -> s[n-1]
$000442 Push: $657
$000454 Push: 131 
$000466 Calc: s[n-1] * s[n] -> s[n-1]
$000468 Push: $658
$000480 Push: 147 
$000492 Calc: s[n-1] * s[n] -> s[n-1]
$000494 Push: $659
$000506 Push: 183 
$000518 Calc: s[n-1] * s[n] -> s[n-1]
$000520 Push: $660
$000532 Push: 235 
$000544 Calc: s[n-1] * s[n] -> s[n-1]
$000546 Push: $661
$000558 Push: 197 
$000570 Calc: s[n-1] * s[n] -> s[n-1]
$000572 Push: $662
$000584 Push: 200 
$000596 Calc: s[n-1] * s[n] -> s[n-1]
$000598 Push: $663
$000610 Push: 104 
$000622 Calc: s[n-1] * s[n] -> s[n-1]
$000624 Push: $664
$000636 Push: 188 
$000648 Calc: s[n-1] * s[n] -> s[n-1]
$000650 Push: $665
$000662 Push: 196 
$000674 Calc: s[n-1] * s[n] -> s[n-1]
$000676 Push: $666
$000688 Push: 118 
$000700 Calc: s[n-1] * s[n] -> s[n-1]
$000702 Push: $667
$000714 Push: 28 
$000726 Calc: s[n-1] * s[n] -> s[n-1]
$000728 Push: $668
$000740 Push: 21 
$000752 Calc: s[n-1] * s[n] -> s[n-1]
$000754 Push: $669
$000766 Push: 97 
$000778 Calc: s[n-1] * s[n] -> s[n-1]
$000780 Push: $670
$000792 Push: 151 
$000804 Calc: s[n-1] * s[n] -> s[n-1]
$000806 Push: $671
$000818 Push: 217 
$000830 Calc: s[n-1] * s[n] -> s[n-1]
$000832 Push: $672
$000844 Push: 118 
$000856 Calc: s[n-1] * s[n] -> s[n-1]
$000858 Push: $673
$000870 Push: 22 
$000882 Calc: s[n-1] * s[n] -> s[n-1]
$000884 Push: $674
$000896 Push: 212 
$000908 Calc: s[n-1] * s[n] -> s[n-1]
$000910 Push: $675
$000922 Push: 31 
$000934 Calc: s[n-1] * s[n] -> s[n-1]
$000936 Push: $676
$000948 Push: 101 
$000960 Calc: s[n-1] * s[n] -> s[n-1]
$000962 Push: $677
$000974 Push: 227 
$000986 Calc: s[n-1] * s[n] -> s[n-1]
$000988 Push: $678
$001000 Push: 155 
$001012 Calc: s[n-1] * s[n] -> s[n-1]
$001014 Push: $679
$001026 Push: 237 
$001038 Calc: s[n-1] * s[n] -> s[n-1]
$001040 Push: $680
$001052 Push: 146 
$001064 Calc: s[n-1] * s[n] -> s[n-1]
$001066 Push: $681
$001078 Push: 68 
$001090 Calc: s[n-1] * s[n] -> s[n-1]
$001092 Push: $682
$001104 Push: 75 
$001116 Calc: s[n-1] * s[n] -> s[n-1]
$001118 Push: $683
$001130 Push: 71 
$001142 Calc: s[n-1] * s[n] -> s[n-1]
$001144 Push: $684
$001156 Push: 218 
$001168 Calc: s[n-1] * s[n] -> s[n-1]
$001170 Push: $685
$001182 Push: 173 
$001194 Calc: s[n-1] * s[n] -> s[n-1]
$001196 Push: $686
$001208 Push: 41 
$001220 Calc: s[n-1] * s[n] -> s[n-1]
$001222 Push: $687
$001234 Push: 220 
$001246 Calc: s[n-1] * s[n] -> s[n-1]
$001248 Push: $688
$001260 Push: 161 
$001272 Calc: s[n-1] * s[n] -> s[n-1]
$001274 Calc: s[n-1] + s[n] -> s[n-1]
$001276 Calc: s[n-1] + s[n] -> s[n-1]
$001278 Calc: s[n-1] + s[n] -> s[n-1]
$001280 Calc: s[n-1] + s[n] -> s[n-1]
$001282 Calc: s[n-1] + s[n] -> s[n-1]
$001284 Calc: s[n-1] + s[n] -> s[n-1]
$001286 Calc: s[n-1] + s[n] -> s[n-1]
$001288 Calc: s[n-1] + s[n] -> s[n-1]
$001290 Calc: s[n-1] + s[n] -> s[n-1]
$001292 Calc: s[n-1] + s[n] -> s[n-1]
$001294 Calc: s[n-1] + s[n] -> s[n-1]
$001296 Calc: s[n-1] + s[n] -> s[n-1]
$001298 Calc: s[n-1] + s[n] -> s[n-1]
$001300 Calc: s[n-1] + s[n] -> s[n-1]
$001302 Calc: s[n-1] + s[n] -> s[n-1]
$001304 Calc: s[n-1] + s[n] -> s[n-1]
$001306 Calc: s[n-1] + s[n] -> s[n-1]
$001308 Calc: s[n-1] + s[n] -> s[n-1]
$001310 Calc: s[n-1] + s[n] -> s[n-1]
$001312 Calc: s[n-1] + s[n] -> s[n-1]
$001314 Calc: s[n-1] + s[n] -> s[n-1]
$001316 Calc: s[n-1] + s[n] -> s[n-1]
$001318 Calc: s[n-1] + s[n] -> s[n-1]
$001320 Calc: s[n-1] + s[n] -> s[n-1]
$001322 Calc: s[n-1] + s[n] -> s[n-1]
$001324 Calc: s[n-1] + s[n] -> s[n-1]
$001326 Calc: s[n-1] + s[n] -> s[n-1]
$001328 Calc: s[n-1] + s[n] -> s[n-1]
$001330 Calc: s[n-1] + s[n] -> s[n-1]
$001332 Calc: s[n-1] + s[n] -> s[n-1]
$001334 Calc: s[n-1] + s[n] -> s[n-1]
$001336 Calc: s[n-1] + s[n] -> s[n-1]
$001338 Calc: s[n-1] + s[n] -> s[n-1]
$001340 Calc: s[n-1] + s[n] -> s[n-1]
$001342 Calc: s[n-1] + s[n] -> s[n-1]
$001344 Calc: s[n-1] + s[n] -> s[n-1]
$001346 Calc: s[n-1] + s[n] -> s[n-1]
$001348 Calc: s[n-1] + s[n] -> s[n-1]
$001350 Calc: s[n-1] + s[n] -> s[n-1]
$001352 Calc: s[n-1] + s[n] -> s[n-1]
$001354 Calc: s[n-1] + s[n] -> s[n-1]
$001356 Calc: s[n-1] + s[n] -> s[n-1]
$001358 Calc: s[n-1] + s[n] -> s[n-1]
$001360 Calc: s[n-1] + s[n] -> s[n-1]
$001362 Calc: s[n-1] + s[n] -> s[n-1]
$001364 Calc: s[n-1] + s[n] -> s[n-1]
$001366 Calc: s[n-1] + s[n] -> s[n-1]
$001368 Calc: s[n-1] + s[n] -> s[n-1]
$001370 Pop : $4096
```

那这个程序基本已经清楚了，就是一个多项式计算然后验证，那个重复的段就是计算多项式结果。那么还是利用栈机进行反汇编，输出矩阵和结果，然后求解输出结果就好。

```python
import numpy as np

nm = {'A': 0, 'T': 1, 'G': 2, 'C': 3}
pc = 0
counter = 0
execct = 0
codestr = "matrix_A = [["
while pc < len(code):
    pri, pro = map(trans, [code[pc:pc + 2], code[pc + 2:pc + 12]])
    if pri == 0 or 2 <= pri <= 3 or 9 <= pri <= 11:
        pc += 12
    elif pri <=15:
        pc += 2
    else:
        raise Exception(f'Invalid opcode {pri}')

    if pri == 0:
        if counter == 49 and pro == 49:
            codestr += "]\n"
            break
        codestr += str(pro) + ", "
    elif pri == 3:
        if counter == 48:
            codestr += "]\n]\ncode_result = ["
        else:
            codestr += "], \n ["
        counter += 1
    elif pri == 13:
        unlucky_next()
    else:
        continue

exec(codestr)

A = np.array(matrix_A)
b = np.array(code_result)

A_inv = np.linalg.inv(A)

x = A_inv @ b

s = ''.join(chr(round(i)) for i in x)

print("结果字符串：")
print('.;,;.{'+s+'}')
```

然后得到flag:

```zsh
结果字符串：
.;,;.{we_ought_to_start_storing_our_data_as_dna_instead}
```