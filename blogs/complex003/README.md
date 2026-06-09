# 关于卷积与傅立叶变换

## 卷积、本征与LTI
众所周知，卷积可以表示任何一个 `LTI` 系统，同样的，任何一个 `LTI` 系统也都可以用卷积来表示，单位冲击响应，也就是卷积核，就是这个系统的核心，比如我们可以很方便的利用冲击函数来获取延时和前置的信号，即：

$$ f(t) * \delta(t-t_0) = f(t - t_0) $$

同时还有很多比如积分，微分：

$$ f(t) * u(t) = \int_{-\infty}^t f(\tau) \ d\tau $$

完全可以说 `LTI` 就是卷积。其串联特性也可以很好的放到卷积中。同时傅立叶变换对于卷积有着非常优秀的性质，为什么呢？

傅立叶变换本质是用另一系列函数来表示信号，而这一些列函数就是 $ e^{j\omega t} $，这一系列函数线性组合构成源信号，而这些时间函数有妙妙的性质，需要注意的是，这不仅仅因为数学的简单演算，还因为：

$$ h(t) * e^{j\omega t} = H(\omega) \cdot e^{j\omega t} $$

其中 $ e^{j\omega t} $是 `LTI` 系统的唯一的一类本征函数，这也是傅立叶变换，卷积与 `LTI` 联系的深刻由来。通过傅立叶变换，我们能够得到输入信号的 “线形组合方式”。

?> 严格说，拉普拉斯变换下的 $ e^{st} $ 是 `LTI` 系统的唯一一类本征函数。


## 正交与FT
傅立叶变换数学一点是因为有正交的现象，在 `FT` 中：

$$ \int_{-\infty}^{\infty} e^{j\Delta\omega t} \, dt = 2\pi \cdot \delta(\Delta\omega) $$

而在 `DTFT` 中：

$$ \sum_{n=-\infty}^{\infty} e^{-j\Delta\omega n} = 2\pi \cdot \sum_{k=-\infty}^{\infty} \delta\left(\Delta\omega - 2\pi k \right) $$

而其实，因为上方有说到 $ e^{st} $ 是 `LTI` 系统的唯一一类本征函数。故任意的傅立叶变换其实就是对函数在 $ e^{j\omega t} $ 进行展开，得到系数函数，系数函数可以直接作用于结果进行组合计算。

在这个性质非常优良的系统中，$h(t)*e^{j\omega t}$ 的 $h(t)*$ 是厄米算子 $L$ ，因为易计算得到：

$$ \langle Le^{j\omega t}, e^{j\omega_1 t} \rangle = \langle e^{j\omega_1 t}, Le^{j\omega t} \rangle $$

因此傅立叶变换具有正交性。

!> 在 `DFT` 中，内积函数应为 $$ \sum_{n=0}^{N-1} e^{j\omega_0 n} \cdot e^{-j\omega_1 n} $$ 而 `DTFT` 可以看作是 $N \to \infty$ 下的 `DFT` 内积，虽然不再严格如此，但是也有优良的性质。

下面列出了几种傅立叶转换的对应的内积函数：

| 名称 | 正交基底 | 内积定义 |
|:----:|:----:|:----:|
| FS | $ e^{jk\omega_0 t} $ | $ \displaystyle \int_T x(t) y^*(t) dt $ |
| FT | $ e^{j\omega t} $ | $ \displaystyle \int_{\infty} x(t) y^*(t) \, dt $ |
| DTFS | $ e^{j\frac{2\pi}{N}kn} $ | $ \displaystyle \sum_N x[n] y^*[n] $ |
| DTFT | $ e^{j\omega n} $ | $ \displaystyle \sum_{\infty} x[n] y^*[n] $ |
| DFT | $ e^{j\frac{2\pi}{N}kn} $| $\displaystyle \sum_N x[n] y^*[n] $|

## 杂项

如果我想把一个函数用 $ e^{j\omega t} $ 的方法表示的话，就是说用如下形式表示：

$$ f(t) = \int_{-\infty}^{\infty}a_\omega \cdot e^{j\omega t} \  d\omega $$

那么不妨计算一下：

$$ \begin{align*} & \int_{-\infty}^{\infty}\left( \int_{-\infty}^{\infty}a_{\omega'} \cdot e^{j\omega' t} \  d\omega' \right) \cdot e^{-j\omega t} \ dt \\ = & \int_{-\infty}^{\infty} 2\pi a_{\omega'} \cdot \delta(\omega' - \omega) \  d\omega' \\ = & 2\pi a_{\omega} \end{align*} $$

然后，这就是我们的傅立叶变换，就是实际上理解的话，$ F(\omega) = 2\pi a_\omega $，所以在逆变换的时候就会有那个 $2\pi$，不过现在无可厚非了。

那讨论一下为什么周期函数的频域一定是离散的吧。

我们可以将周期函数看作一个单周期函数和一个冲击串的卷积：

$$ f(t) = f_0(t) * \sum_{-\infty}^{\infty} \delta(t-i\cdot T) $$

单周期函数取得是 $(-\frac{T}{2},\frac{T}{2})$，先不关注这个单周期函数，先思考一下那个冲击串函数，应当有：

$$ \mathscr{F}\left[\sum_{n=-\infty}^{\infty} \delta(t-n\cdot T) \right] = \sum _{n=-\infty }^{\infty }e^{-j\omega nT} $$

这里使用了一个定理叫做泊松求和

$$ \sum_{n=-\infty}^{\infty} e^{-j\omega nT} = 2\pi \cdot \sum_{k=-\infty}^{\infty} \delta\left(\omega T - 2\pi k \right) $$

也就是说这个冲击串函数负责了取样，这样一来，周期函数的傅立叶变换得到的结果是单周期函数的傅立叶变换在频域以 $\omega$ 周期取样乘 $ 2\pi $ 的结果。

!> 不过让我不太好受的一点是，这样解释了现象，但是其实证明泊松求和的时候也用到了傅立叶级数，有点循环论证了。

不过，相对的，我们更加需要的是加强对于傅立叶变换的理解。

`DTFT` 时候，通过求和得到了傅立叶变换，值得思考的是，为什么可以？

其实也是正交关系了，利用恒等式：

$$ \sum_{n=-\infty}^{\infty} e^{-jn \omega} = 2\pi \cdot \sum_{k=-\infty}^{\infty} \delta\left(\omega - 2\pi k \right) $$

可以看出这是有周期性的，然而事实也是逆变换中是取得一个周期进行积分，其实可以看作是在 Hilbert 空间中，信号 $x[n]$ 和基函数 $e^{j\omega n}$ 做内积：

$$ X(\omega) = \langle x[n], e^{j\omega n} \rangle $$
也就是说，$X(\omega)$ 表示的是 $x[n]$ 在频率 $\omega$ 的“投影系数”。我们沿着所有可能频率 $\omega \in [-\pi, \pi]$ 取投影，最终就得到了整个频谱。在 $\Delta \omega < 2\pi$ 内，自然就是只有一个冲击函数，只有对应的频率的值不为$0$，其余的均为$0$，同时频谱还具有周期性。

先说这么多吧。