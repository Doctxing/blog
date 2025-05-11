# 留数定理&拉普拉斯逆变换

在学习信号系统的时候突然想起来自己的奇奇喵喵想法，遂写之。

众所周知，$ e^{st} $ 是在 `LTI` 系统下的唯一一类本征函数，因此卷积可以自然而然的运用于拉普拉斯变换当中，其实就我理解而言，世界上最优雅最合理，最适用于 `LTI` 系统的变换应当是双边拉普拉斯变换，也许在物理世界双边会更好？

这里还是主要说明一下我的奇奇喵喵想法吧，拉普拉斯变换的公式是：

$$ L(s) = \int_{0}^\infty f(t) e^{-st} \ dt $$

逆变换公式是：

$$ f(t) = \frac{1}{2\pi j} \lim_{T\to \infty }\int_{\gamma -iT}^{\gamma +iT}e^{st}F(s)\,ds $$

谁会去算这个大大的路径积分啊，正常人都是通过别的方法做的。

看课本上的计算其实跟留数定理计算的成本差不多，那就还是留数定理计算比较舒适，有：

$$ f(t) = \sum_{\text{Res}} \text{Res}_{s=s_n}\left[F(s)\cdot e^{st}\right] $$

而对于n阶极点处的留数有：

$$ \text{Res}_{s = s_0}\left[F(s)\cdot e^{st}\right] = \frac{1}{(n-1)!} \lim_{z \to z_0} \frac{d^{n-1}}{ds^{n-1}} \left[(s - s_0)^n \cdot F(s)\cdot e^{st}\right] $$

这是常规计算方法，但是根据

$$ \sum_{i} \text{Res}_{z=a_i} f(z) + \text{Res}_{z=\infty} f(z) = 0 $$

$$ \sum_{i} \text{Res}_{z=a_i} f(z) = \text{Res}_{w=0} \left[ \frac{1}{w^2} f\left( \frac{1}{w} \right) \right]$$

那我们就可以刚刚好的进行计算拉普拉斯逆变换。

$$ f(t) = \text{Res}_{w=0} \left[ \frac{e^{\frac{t}{\omega}}}{w^2} F\left( \frac{1}{w} \right) \right] $$

理论上来说，这是在数学上形式最简单的，只用计算在一个点的一个留数，但是在大多数情况计算上是比较复杂的，用到的概率比较小，而且比较吃复变，需要你洛朗展开，级数运算。（但万一巧妙的用到了呢？）

