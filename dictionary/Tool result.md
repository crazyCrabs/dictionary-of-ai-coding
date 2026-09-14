---
description: harness 执行工具调用后送回的东西——文件内容、输出或错误。agent 看环境的唯一途径。
---

[harness](./Harness.md)(宿主环境)执行一次 [tool call](./Tool%20call.md)(工具调用)后送回的东西——文件内容、命令输出、或错误。[agent](./Agent.md)(智能体)看 [environment](./Environment.md)(环境)的唯一途径。它在*下一个*[model provider request](./Model%20provider%20request.md)(模型供应商请求)里回到 [model](./Model.md)(模型)面前,由模型决定怎么处理。tool call 和 tool result 是同一次交换的两端,都发生在同一个 [turn](./Turn.md)(轮次)之内。

一条 tool result 的生命周期:

| 步骤 | 谁      | 发生什么                                                    |
| ---- | ------- | ----------------------------------------------------------- |
| 1    | Harness | 执行 tool call——跑命令、读文件                              |
| 2    | Harness | 截获结果:输出、内容或错误                                   |
| 3    | Harness | 把它作为一条消息追加进 [context](./Context.md)(上下文)      |
| 4    | Harness | 在下一个 model provider request 里把整个 context 发给供应商 |
| 5    | Model   | 读结果并决定:再来一次 tool call,还是给出最终回答            |

结果会在这个 [session](./Session.md)(会话)余下的时间里一直留在 context 里。tool result 通常占一个编程 session 上下文的大头:每次读文件、每次跑测试、每次搜索都全额落入,在不再有用之后的很长时间里继续占着 [token](./Token.md)。几条大的结果——一份冗长的测试日志、一个被整读的生成文件——能把 session 推向 [context window](./Context%20window.md) 边缘的速度,比对话本身快得多。

因为结果是模型看到的一切,模型没有任何办法核查结果背后的环境。如果输出被截断了、命令悄悄失败了、或 harness 返回了错误而不是内容,模型就从它被给的这些东西出发推理。当 agent 对你系统的图景看起来不对时,tool result 是该查的地方:对话记录的某处,有一条 result 说出的和你知道的事实不一样。

_Usage:_

"它推理这个文件的方式,就像文件是空的一样。"

"tool result 回来的是权限拒绝,不是内容。模型只看到了错误字符串——它没有别的办法看到这个文件。"
