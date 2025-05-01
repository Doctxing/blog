# 对于复球面的一些思考

这里想要阐释一些复球面的几何特性

在我们学的课本里面，我们的复球面对应的半径是1，然而这带来了极大的不便，如果将复球面半径设置为 $0.5$ 就会出现一些让人感到极为舒适的东西。

- 复球面上一点关于$y = 0 = z-1$的对称点为此点的倒数点

- 复球面上一点关于$y = 0$的对称点为此点的共轭点

<p align="center">
    <img src="./blogs/complex001/1.png" alt="pic">
</p>

下面设置一些函数映射，为了论证方便，我们在三维实空间坐标系里面进行论证：

- $Ca(Z) = \left(Re(Z),Im(Z)\right)$

- $Cb(Z) = \left(\arg(Z),\arctan\left(\frac{1}{|Z|}\right)\right)$

- $Ccir(\theta,\varphi) = (x,y,z)$

不难得知这些函数在双方向上均为单射。

首先任取一个复数$Z_0$：得到其在复平面上的坐标映射：

$$(x_0,y_{0}) = Ca(Z_0)$$

其次得到其在复球面上的坐标映射：

$$(\theta_0,\varphi_{0)} = Cb(Z_0)$$

而在此$r=0.5$的复球面上关于$y = 0 = z-1$的对称点应有：

$$(x_0,y_0,z_0) \to (x'_0,y'_0,z'_0) = (x_0,-y_0,1-z_0)$$

则必然满足此点$Z_1$有：

$$Cb(Z_1) = (\theta_1,\varphi_1) = (-\theta_0,\frac{\pi}{2}-\varphi_0)$$

得到：

$$Cb(Z_1) = \left(-\arg(Z_0),\arctan(|Z_0|)\right)$$

又因为$\arg(Z) = -\arg(\frac{1}{Z})$，得到：

$$ Cb(Z_1) = \left(\arg\left(\frac{1}{Z_0}\right),\arctan(|Z_0|)\right) = Cb\left(\frac{1}{Z_0}\right)$$

又容易得知，从复平面到复球面的映射为一个单射，反之亦然，极容易得知：

$$Z_1 = \frac{1}{Z_0}$$

而对于另一条的论证：

$$ Ccir(Cb(Z_0)) = (x_0,y_0,z_0) \ 关于 \ 面 \ \alpha \ 的对称:$$

$$(x_0,y_0,z_0) \to (x_0,-y_0,z_0)$$

通过映射关系得到：

$$Cb(Z_1) = \left(\arg(Z_1),\arctan\left(\frac{1}{|Z_1|}\right)\right) = \left(-\arg(Z_0),\arctan\left(\frac{1}{|Z_0|}\right)\right)$$

又有$\arg\left(\overline{Z}\right) = -\arg(Z)$

则可以导出：

$$Z_1 = \overline{Z_0}$$

