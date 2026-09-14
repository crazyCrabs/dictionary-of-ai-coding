---
description: 给模型调定参数的过程:让它接触海量文本,不断调整以改进下一词元预测。
---

调定 [model](./Model.md)(模型)的 [parameters](./Parameters.md)(参数)的过程:让它接触海量文本,调整参数以改进 [next-token prediction](./Next-token%20prediction.md)(下一词元预测)。一次性的、昂贵的、由 [model provider](./Model%20provider.md)(模型供应商)完成的过程。它涵盖 pre-training(预训练,主跑道)和 post-training(后训练,后续打磨,如指令遵循与安全);在这本词典的层面,这个区分不重要。

机制是大规模的重复:给模型看一段文本,让它预测下一个 [token](./Token.md)(词元),把参数朝实际的下一个 token 方向轻推,然后在数万亿 token 上重复。没有任何东西以事实或规则的形式被存储——模型"知道"的一切,都是预测能力变强的副作用,压缩在参数里,成为 [parametric knowledge](./Parametric%20knowledge.md)(参数化知识)。

两件事影响日常使用。训练在一个时间点结束,所以模型有 [knowledge cutoff](./Knowledge%20cutoff.md)(知识截止)——它没见过你上个月升级的库版本。而且训练不是你能做的事:当模型不了解你的代码库、你的约定、你的内部 API 时,解法从来不是"教模型"——而是把这些材料放进 [context](./Context.md)(上下文),你唯一能控制的输入。

_Usage:_

"能不能让它学会我们的内部 API?"

"不能靠训练——那是模型供应商手里以月计的过程。把 API 文档装进 context,那才是你真正有的杠杆。"
