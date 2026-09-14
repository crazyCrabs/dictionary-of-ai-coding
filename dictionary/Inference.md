---
description: 运行训练好的模型来生成输出——每次模型供应商请求都在发生的事。参数保持不变。
---

运行训练好的 [model](./Model.md)(模型)来生成输出——每次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)发生的就是这件事。[parameters](./Parameters.md)(参数)保持不变;模型只是对给定的 [context](./Context.md)(上下文)做 [next-token prediction](./Next-token%20prediction.md)(下一词元预测)。相比 [training](./Training.md)(训练)便宜,但按 [token](./Token.md)(词元)计费,是用模型的主要成本。

模型的一生分两个阶段:

| 阶段      | 何时发生         | 做什么                                | 参数       |
| --------- | ---------------- | ------------------------------------- | ---------- |
| Training  | 一次,发布之前    | 从训练语料产出参数                    | 正在被写入 |
| Inference | 每次有人使用模型 | 用冻结的参数跑你的 context,生成 token | 只读       |

你在推理时做的任何事都不会写回参数——这就是你今天做的纠正,明天留不下来的原因。下一个 [session](./Session.md)(会话)里,你明明仔细解释过修法,模型还是犯同样的错——它没有无视你;它没有能力从这次交流中学到东西。model 是 [stateless](./Stateless.md)(无状态)的——连续性必须来自模型之外:来自 [context window](./Context%20window.md) 或 [memory system](./Memory%20system.md)(记忆系统)。

这个机制也解释了账单。每个请求都让模型跑一遍完整的 context,所以成本随 [input tokens](./Input%20tokens.md)(输入 token)和 [output tokens](./Output%20tokens.md)(输出 token)增长,而一个做几十次 [tool](./Tool.md) 调用的 [agent](./Agent.md)(智能体),每个来回都要付一次推理费。这就是为什么 context 大小既是质量问题,也是成本问题。

_Usage:_

"为什么账单随用量涨,而不是一笔固定的授权费?"

"你付的是 inference——每次模型供应商请求都在供应商的硬件上跑一遍模型。训练早已完成,但推理按请求累计,而且一个 [turn](./Turn.md) 在调用工具时会膨胀成很多个请求。"
