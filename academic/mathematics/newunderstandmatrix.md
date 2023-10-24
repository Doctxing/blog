# A new way to understand matrix

# 理解矩阵新方式

---

## 首先从初等矩阵出发

如初等矩阵 $E(i,j)$ :

$$
\begin{pmatrix}  
1&&&&&&&&&&&\\  
&\ddots&\\
&&1\\
&&&0&&\cdots&&1\\
&&&&1\\
    &&&\vdots&&\ddots&&\vdots\\
    &&&&&&1\\
    &&&1&&\cdots&&0 \\
    &&&&&&&&1 \\
    &&&&&&&&&\ddots \\
    &&&&&&&&&&1 
\end{pmatrix}
$$

从形式上看好像是一个 $E_{n\times n}$ 的第i行和第j行换了一下一样，同时运算时候也是，放在被乘式前面则自动调换被乘式的i行和j行，不难发现貌似其他初等矩阵好像都是如此，这使我们发现新大陆：只要行列式可以仅通过一个维度的变换被解析成多个初等矩阵相乘的形式，那么他参与运算时就是相似的，eg:

$$
\begin{pmatrix}
1&2&0\\
0&0&1\\
0&1&3\\\end{pmatrix}
$$

可理解为：

$$
\begin{pmatrix}
1&0&0\\
0&1&0\\
0&0&1\\
\end{pmatrix}->
\begin{pmatrix}
1&2&0\\
0&1&0\\
0&0&1\\
\end{pmatrix}->
\begin{pmatrix}
1&2&0\\
0&1&3\\
0&0&1\\
\end{pmatrix}->
\begin{pmatrix}
1&2&0\\
0&0&1\\
0&1&3\\
\end{pmatrix}
$$

此处仅使用行解析，即按照如此的解析应当乘在前面；

而按照列解析则是：

$$
\begin{pmatrix}
1&0&0\\
0&1&0\\
0&0&1\\
\end{pmatrix}->
\begin{pmatrix}
1&0&0\\
0&1&0\\
0&3&1\\
\end{pmatrix}->
\begin{pmatrix}
1&0&2\\
0&1&0\\
0&3&1\\
\end{pmatrix}->
\begin{pmatrix}
1&2&0\\
0&0&1\\
0&1&3\\
\end{pmatrix}
$$

此时仅使用列解析，即乘的时候应当乘在后面；

