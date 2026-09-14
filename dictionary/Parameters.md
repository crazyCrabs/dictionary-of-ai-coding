---
description: 模型内部的数字——常常以十亿计——在训练中调定。模型"知道"的一切都存在其中。也叫权重。
---

[model](./Model.md)(模型)内部的数字——常常以十亿计——在 [training](./Training.md)(训练)中调定。模型"知道"的一切都存在其中。训练把它们写定;[inference](./Inference.md)(推理)原样使用它们。也叫 _weights_(权重)。

从机制上说,parameters 就是把输入变成输出的那个东西。[next-token prediction](./Next-token%20prediction.md)(下一词元预测)是一场巨大的计算:[context window](./Context%20window.md)(上下文窗口)里的 [token](./Token.md)(词元)进来,穿过 parameters 做乘法,得出对下一个 token 的预测。模型内部没有事实数据库,没有代码查找表——只有这些数字,以"计算倾向于产出有用结果"的方式排布。模型能背诵的训练事实,比如某个标准库 API,是 [parametric knowledge](./Parametric%20knowledge.md)(参数化知识):存在参数里,不是从哪里检索来的。

值得内化的细节是:parameters 在训练后冻结。你在 [session](./Session.md)(会话)里做的任何事都不会改变它——你做的纠正、你给它看的代码库、它从错误里"学到"的教训,都不行。每个 session 跑在同样的数字上。这就是为什么 model 是 [stateless](./Stateless.md)(无状态)的,为什么它的内置知识止步于 [knowledge cutoff](./Knowledge%20cutoff.md)(知识截止),为什么任何项目特定的东西必须通过 [context](./Context.md)(上下文)进来。parameters 改变的唯一方式是再训练——那实际上会产出一个不同的模型。

_Usage:_

"能不能在我们的代码库上 fine-tune?"

"那会更新 parameters——之后就是一个不同的模型了。对一个项目来说,几乎总是把代码库装进 context 比重新训练便宜。"
