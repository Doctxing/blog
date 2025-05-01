# RSA 加密通信原理

RSA加密通信是由几个“聪明绝顶”的老头子在麻省理工发明的，这是非对称加密的鼻祖，直至现今，量子计算机也仅仅将RSA－250破解，理论显示，只要秘钥足够长，该信息就几乎不可能被破解。

RSA加密通信本质应用了欧拉函数：
$$ a^{\varphi(n)} \equiv 1 {\pmod {n}} $$

## 加密过程：

- 首先，确定信息交互对象，A将信息传输给B，那么B需要产生公钥与私钥：
   - 取得两个大质数p与q，计算 $r = \varphi(N) = \varphi(p\cdot q) = (p-1)\cdot(q-1)$
   - 然后取一个质数 $e:\{e>p\ \&\& \ e>q\}$，并与$N$一起称为公钥。
   - 然后取一个$d$满足：$de \equiv 1 {\pmod {r}}$，并与$N$一起称为私钥。
   - 然后销毁$p$，$q$。将$(e,N)$传输给A，将$d$保存好，不能泄露。
- 其次A利用公钥对信息进行加密：
   - 实现沟通好信息 $x$ 大小不超过$N$，则计算得到的密文$c$应为：
$$ c = x^{e} \mod \ N$$
   - 然后将密文传输给B。
- 最后信息解密
   - B将信息进行解密：
$$ x = c^{d} \mod \ N$$

下进行论证：

则有：

$$c^{d} \equiv x \cdot x^{\lambda r} \equiv x \cdot \left(x^{\varphi(N)}\right)^\lambda \mod \ N $$

当 $x$ 与 $N$ 互质的时候，利用欧拉函数，则直接有：

$$ c^d \equiv x \mod \ N $$

又因为$x$小于$N$，则直接得证；

当 $x$ 与 $N$ 并不互质的时候，则不妨有另一数$h$,使得：
$ x = ph $ 以及 $ ed-1 \equiv k(q-1) $

则：

$ {\displaystyle n^{ed}=(ph)^{ed}\equiv 0\equiv ph\equiv n{\pmod {p}}} $
$ {\displaystyle n^{ed}=n^{ed-1}n=n^{k(q-1)}n=(n^{q-1})^{k}n\equiv 1^{k}n\equiv n{\pmod {q}}} $

即得证：

$$ c^d \equiv x \pmod N $$

## 安全性

外界能够获得的信息即为：

- 密文$c$
- 质数乘积$N$
- 公钥$e$

此时，想要解密则必要有将大数$N$进行分解为两个质数$p,q$，然后计算$r = \varphi(N) = \varphi(p\cdot q) = (p-1)\cdot(q-1)$，再取 $de \equiv 1 {\pmod {r}}$ ，然后破解得到密文：$ x = c^{d} \mod \ N$。

然而至今，在我们二进制计算机上面，还没有发现一算法，来在多项式时间内分解一个大数，同时也没有人证明其不存在。

直到今日也没有人发现对N进行因数分解来导出n的方法，至少没有公开的方法。
