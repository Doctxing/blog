# 梦开始的地方（reverse）

第一次在比赛中做出的一个题

## F**K

可执行文件放到 `ida` 中进行分析，发现几个混淆名称的函数以及变量，更改符号名称，得到较为好看的main函数：

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  char __dst[65]; // [xsp+2Eh] [xbp-162h] BYREF
  char __s[65]; // [xsp+6Fh] [xbp-121h] BYREF
  char __b_[100]; // [xsp+B0h] [xbp-E0h] BYREF
  char __b[100]; // [xsp+114h] [xbp-7Ch] BYREF

  memset(__b, 0, sizeof(__b));
  memset(__b_, 0, sizeof(__b_));
  strcpy(__dst, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
  HNFUNC_1((__int64)__dst, __s);
  if ( fgets(__b, 100, __stdinp) )
  {
    __b[strcspn(__b, "\n")] = 0;
    HNFUNC_2(__b, (__int64)__b_, (__int64)__s);
  }
  while ( !byte_100008292 )
    HNFUNC_3((__int64)__b_);
  if ( !memcmp(&str1, str2, 16 * str3) )
    printf("\nCongratulations!\n");
  else
    printf("\nSomething Wrong.\n");
  return 0;
}
```

可以看出，func1将 长字符串输入然后输出了一个新的串，观察func1的内容，可以观察到是对长字符串进行了顺序变换，不急于分析具体逻辑。然后将这个顺序变换的字符串 `__s` 给到func2，同时注意到func2还有一个传入参数是 `__b` ，即用户输入，这应当是加密的一部分，然后又经过循环的 func3，最终与str1进行比对。

观察func2，本质上就是一个自定义 `base_table` 的 `base64` 编码。然后观察func3逻辑：

```c
__int64 __fastcall HNFUNC_3(__int64 __b)
{
  __int64 result; // x0
  int n16; // [xsp+8h] [xbp-28h]
  int n4; // [xsp+Ch] [xbp-24h]
  __int64 __s_; // [xsp+18h] [xbp-18h] BYREF
  __int16 v5; // [xsp+20h] [xbp-10h]

  __s_ = 0;
  v5 = 0;
  for ( n4 = 0; n4 < 4; ++n4 )
    *((_BYTE *)&__s_ + n4) = *(_BYTE *)(__b + str3 + n4);
  BYTE4(__s_) = 0;
  result = HNFUNC_4((const char *)&__s_, &str2[16 * str3]);
  for ( n16 = 0; n16 < 16; ++n16 )
    str2[16 * str3 + n16] = (7 * (str2[16 * str3 + n16] ^ (n16 + 6)) + 4660 * (n16 % 15)) % 256;
  ++str3;
  return result;
}
```

然后分析func4，发现本质就是一个 md5 值的函数，于是将上述func3经过人工化简得到：

```c
void func3(char* str){
    static char count = 0;
    char temp[4];
    for(int i=0; i < 4; i++){
        temp[i] = str[i+count];
    }
    md5(temp,&str2[count*16]);
    for(int k=0; k < 16; k++){
        char strt = 4660 * (k % 15) % 256;
        str2[count*16 + k] = ((str2[count*16 + k] ^ (k+6)) * 7 + strt) % 256;
    }
    count++;
}
```

在逆向中，首先可以看到经过md5后有进行了一轮变换，但是好在可逆，代码中strt已知，则有关系：

$$ x_{new} \equiv x_{old} \oplus (k+6) \times 7 + stat \pmod{n} $$

$$ x_{old} \equiv \left( (x_{new} - stat) \times (7)^{-1} \right) \oplus (k+6) \pmod{n} $$

代码也可以看到是4个为单位进行计算md5的，理论可以进行爆破；由于是重叠的取4个字符，先爆破出第一个，那后续的只用爆破一位。

最后再复制func1,将随机数替换，最多只用爆破64次，总体理论可行。

```python
import itertools
import hashlib

encrypt = [0x8E, 0x68, 0x1B, 0xB4, 0x4A, 0xFA ...]

def inverse_transform(new_v: bytearray) -> bytearray:
    inv = bytearray()
    for i, nv in enumerate(new_v):
        n16 = i % 16
        k = n16 + 6
        c = (4660 * (n16 % 15)) & 0xFF
        y = (nv - c) & 0xFF
        x = (183 * y) & 0xFF  # 7 的逆元
        inv.append(x ^ k)
    return inv

decoded = inverse_transform(encrypt)
blocks = len(decoded) // 16

charset = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
first_block = decoded[0:16]
b0 = None
for combo in itertools.product(charset, repeat=4):
    s = bytes(combo)
    if hashlib.md5(s).digest() == first_block:
        b0 = bytearray(s)
        print("块 0 →", s)
        break

assert b0 is not None, "第 0 块暴力失败!"

b = bytearray(len(decoded) + 3)
b[0:4] = b0

for i in range(1, blocks):
    target = decoded[i*16:(i+1)*16]
    prefix = bytes(b[i:i+3])
    found = False
    for c in charset:
        s = prefix + bytes([c])
        if hashlib.md5(s).digest() == target:
            b[i+3] = c
            found = True
            break
    if not found:
        print(f"块 {i} 无匹配！")
        decrypted = b[:i+3]
        break

print("恢复 b:", decrypted)

def self_unbase64(encoded: bytes, table: bytes) -> bytes:
    reverse_table = {ch: i for i, ch in enumerate(table)}
    decoded = bytearray()

    for i in range(0, len(encoded), 4):
        chunk = encoded[i:i+4]
        pad = chunk.count(ord('='))
        chunk = chunk.rstrip(b'=').ljust(4, b'A')

        try:
            a, b, c, d = [reverse_table[ch] for ch in chunk]
        except KeyError:
            continue

        decoded.append((a << 2) | (b >> 4))
        if pad < 2:
            decoded.append(((b & 0x0F) << 4) | (c >> 2))
        if pad == 0:
            decoded.append(((c & 0x03) << 6) | d)

    return bytes(decoded)

def rand_table(s: bytes,n: int) -> bytes:
    s = list(s)
    rand_num = n % 64
    for n in range(59):
        v = n + rand_num
        if v < len(s):
            s[n], s[v] = s[v], s[n]
    
    return bytes(s)

for n in range(64):
    new_table = rand_table(charset, n)
    dedecrypted = self_unbase64(decrypted, new_table)
    if dedecrypted.startswith(b'H&NCTF'):
        print(f"找到 n={n}: {dedecrypted}")
        break
```

得到结果:

```zsh
块 0 → b'YIfU'
块 40 无匹配！
恢复 b: bytearray(b'YIfUW7XMk7rrTcmnOYLPd63vg5S5S7BojdO/lr/1dt6')
找到 n=6: b'H&NCTF{Ye5h!!!I_Lik333_bur9~^o^}<'
```