# 关于卷积与傅立叶变换

众所周知，卷积可以表示任何一个 `LTI` 系统，同样的，任何一个 `LTI` 系统也都可以用卷积来表示，单位冲击响应，也就是卷积核，就是这个系统的核心，比如我们可以很方便的利用冲击函数来获取延时和前置的信号，即：

$$ f(t) * \delta(t-t_0) = f(t - t_0) $$

同时还有很多比如积分，微分：

$$ f(t) * u(t) = \int_{-\infty}^t f(\tau) \ d\tau $$

完全可以说 `LTI` 就是卷积。其串联特性也可以很好的放到卷积中。同时傅立叶变换对于卷积有着非常优秀的性质，为什么呢？

傅立叶变换本质是用另一系列函数来表示信号，而这一些列函数就是 $ e^{j\omega t} $，这一系列函数线性组合构成源信号，而这些时间函数有妙妙的性质，需要注意的是，这不仅仅因为数学的简单演算，还因为：

$$ h(t) * e^{j\omega t} = C \cdot e^{j\omega t} $$

傅立叶变换数学一点是因为有正交的现象，即：

$$ \int_{-\infty}^{\infty} e^{j\omega t} \cdot e^{-j\omega' t} \, dt = 2\pi \cdot \delta(\omega - \omega') $$

那如果我想把一个函数用 $ e^{j\omega t} $ 的方法表示的话，就是说用如下形式表示：

$$ f(t) = \int_{-\infty}^{\infty}a_\omega \cdot e^{j\omega t} \  d\omega $$

那么不妨计算一下：

$$ \int_{-\infty}^{\infty}\left( \int_{-\infty}^{\infty}a_{\omega'} \cdot e^{j\omega' t} \  d\omega' \right) \cdot e^{-j\omega t} \ dt \\ = \int_{-\infty}^{\infty} 2\pi a_{\omega'} \cdot \delta(\omega' - \omega) \  d\omega' \\ = 2\pi a_{\omega} $$

然后，这就是我们的傅立叶变换，就是实际上理解的话，$ F(\omega) = 2\pi a_\omega $，所以在逆变换的时候就会有那个 $2\pi$，不过现在无可厚非了。

那讨论一下为什么周期函数的频域一定是离散的吧。

我们可以将周期函数看作一个单周期函数和一个冲击串的卷积：

$$ f(t) = f_0(t) * \sum_{-\infty}^{\infty} \delta(t-i\cdot T) $$

单周期函数取得是 $(-\frac{T}{2},\frac{T}{2})$，先不关注这个单周期函数，先思考一下那个冲击串函数，应当有：

$$ \mathscr{F}\left[\sum_{-\infty}^{\infty} \delta(t-i\cdot T) \right] = \sum _{-\infty }^{\infty }e^{-j\omega iT} $$

这里使用了一个定理叫做泊松求和

$$ \sum_{n=-\infty}^{\infty} e^{-j\omega nT} = 2\pi \cdot \sum_{k=-\infty}^{\infty} \delta\left(\omega T - 2\pi k \right) $$

也就是说这个冲击串函数负责了取样，这样一来，周期函数的傅立叶变换得到的结果是单周期函数的傅立叶变换在频域以 $\omega$ 周期取样乘 $ 2\pi $ 的结果。

不过让我不太好受的一点是，这样解释了现象，但是其实证明泊松求和的时候也用到了傅立叶级数，有点循环论证了。

不过，相对的，我们更加需要的是加强对于傅立叶变换的理解。

DTFT时候，通过求和得到了傅立叶变换，值得思考的是，为什么可以？

其实也是正交关系了，利用恒等式：

$$ \sum_{n=-\infty}^{\infty} e^{-jn \omega} = 2\pi \cdot \sum_{k=-\infty}^{\infty} \delta\left(\omega - 2\pi k \right) $$

可以看出这是有周期性的，然而事实也是逆变换中是取得一个周期进行积分，其实可以看作是在 Hilbert 空间中，信号 $x[n]$ 和基函数 $e^{j\omega n}$ 做内积：

$$ X(\omega) = \langle x[n], e^{j\omega n} \rangle $$
也就是说，$X(\omega)$ 表示的是 $x[n]$ 在频率 $\omega$ 的“投影系数”。我们沿着所有可能频率 $\omega \in [-\pi, \pi]$ 取投影，最终就得到了整个频谱。在 $\Delta \omega < 2\pi$ 内，自然就是只有一个冲击函数，只有对应的频率的值不为$0$，其余的均为$0$，同时频谱还具有周期性。

先说这么多吧。