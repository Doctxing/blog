# 线代笔记0.1

这是假期学的，今天复习一下写上去。

## 引入问题

知 $ \mathbf{a_1} $ 、 $ \mathbf{a_2} $ , 由两向量织成的 $ R^2 $ , $ \mathbf{c} $ 在其上的投影向量为 $ \mathbf{p} $ ,求 $ \mathbf{p} $ 。（ 向量均为列向量）

## 开始演绎

为表示方便记$A$为$ \begin{bmatrix} a_1 & a_2 \end{bmatrix} $（$ m \times n $阵）

$ c(A) $ 是一$ R^2 $

记 $\widehat{X} = {\begin{bmatrix} x & y \end{bmatrix}}^T $

有 $ A \widehat{X} = \mathbf{p} $

误差向量 $ e=c-p = c-A \widehat{X} $

满足 $ A^T e = 0 $（垂直）

即 $ A^T( c-A \widehat{X} = 0 ) $ 
化简得 $ A^T c = A^T A \widehat{X} $

易有 $ A^T A $ 为方阵

分为充分与必要证明：

- $ Ax = 0 $ 时 $ A^T Ax $   显然为 $ 0 $
- $ A^T Ax = 0 $ 时 $ x^T A^T Ax = 0 $

  必有 $ Ax = 0 $

  则： $$ Ax = 0  \Leftrightarrow A^T Ax = 0 $$

  有：$$ \dim \left[ \mathcal{ker}(A) \right] = n-\dim(A) $$
  $$ \dim \left[ \mathcal{ker}(A^T A) \right] = n-\dim(A^T A) $$


  又因 $ \mathcal{kel}(A) = \mathcal{kel}(A^T A) $
  
  当 $A$ 列满秩，必有 $ A^T A $ 列满秩

  故 $ A^T A $ 可逆
  
有$$ \widehat{X} = {(A^T A)}^{-1}Ac $$

则$$ P=A \widehat{X} = A{(A^T A)}^{-1}Ac $$

在线性回归中，我们要拟合的一阶线性式 $ \widehat{y} $ 中：

要满足 $ \sum {(y-\widehat{y})}^2 $ 最小

意即在： 

$$ Y = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \\ \end{bmatrix} \ \  \widehat{Y} = \begin{bmatrix} \widehat{y_1} \\ \widehat{y_2} \\ \vdots \\ \widehat{y_n} \\ \end{bmatrix} $$

中 $ {(Y-\widehat{Y})}^2 $ 最小

在投影中，求投影时满足了：

$ {(p-c)}^2 $ 最小（ $e$ 垂直于 $A$ 织成的$ R^2 $）

与之类似，故不妨令：

$$ y=k_0+k_1 x_1+k_2 x_2 + \cdots$$

得数据阵：

$$
A=\begin{bmatrix}
1 & x_{11} & x_{21} & \cdots \\
1 & x_{12} & x_{22} & \cdots  \\
1 & x_{13} & x_{23} & \cdots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix} 
$$

其每行为一自变量数据点

$$ Y = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \\ \end{bmatrix} $$

其每行为一因变量

 $ \widehat{Y} = C(A) $ 显然成立

故不妨有：

$$ \widehat{K} = {(A^T A)}^{-1} A^T Y $$

$ \widehat{K} $为系数向量 $ {\begin{bmatrix} k_0  & k_1 & \cdots & k_{n-1} & k_{n} \end{bmatrix}}^T $

则有：

$$ \widehat{y} = \widehat{K}^T \cdot X $$




