---
description: 模型输出中指名工具和参数的部分——只是结构化文本。harness 必须读它并执行。
---

[model](./Model.md)(模型)输出中指名一个 [tool](./Tool.md)(工具)及其参数的部分——只是结构化文本。它自己什么都不做;[harness](./Harness.md)(宿主环境)必须读它并执行。由模型在单次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)中产出。

一次 tool call 的生命周期:

| 步骤 | 谁      | 发生什么                                                                  |
| ---- | ------- | ------------------------------------------------------------------------- |
| 1    | Model   | 从 [system prompt](./System%20prompt.md)(系统提示)里的描述得知有哪些 tool |
| 2    | Model   | 产出一个调用——tool 名加参数,通常是 JSON——然后停下                         |
| 3    | Harness | 解析调用,对照 [permission mode](./Permission%20mode.md) 检查              |
| 4    | Harness | 若被允许,执行它                                                           |
| 5    | Harness | 把结果作为 [tool result](./Tool%20result.md) 放进下一个请求送回去         |

[agent](./Agent.md)(智能体)的一个 [turn](./Turn.md)(轮次)的工作,通常就是这样串起来的很多次往返。

因为调用和别的一切一样由 [next-token prediction](./Next-token%20prediction.md)(下一词元预测)生成,它可以用任何模型输出会错的方式出错:不存在的路径、命令没有的 flag、看似合理而非正确的参数。harness 执行的是写下来的,不是想表达的——一个打错的路径不会优雅报错,它会改错文件。

_Usage:_

"它说跑了测试,但文件时间戳根本没变。"

"看对话记录——它是真的产出了 tool call,还是只是描述了要跑?模型产出调用,但如果 harness 没执行它,就什么都没发生。"
