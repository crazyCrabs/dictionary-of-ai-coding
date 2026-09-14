---
description: 模型实际在做的事。从上下文采样一个下一词元,追加,再跑一遍。它唯一的运作模式。
---

[model](./Model.md)(模型)实际在做的事。给定 [context](./Context.md)(上下文),它采样出下一个 [token](./Token.md)(词元),追加,再跑一遍。每个输出——一句话、一次 [tool call](./Tool%20call.md)(工具调用)、一个千行文件——都是一次一个 token 拼出来的。模型没有别的运作模式。

每一步都一样:[context window](./Context%20window.md)(上下文窗口)里的 token 穿过 [parameters](./Parameters.md)(参数),对词表里每个 token 产出一个概率——这个很可能是下一个,那个次之。从这些概率里采样出一个 token,追加,循环带着变长的 context 再跑。这个采样步骤,就是同一个提示在不同运行里产出不同输出的原因:[non-determinism](./Non-determinism.md)(非确定性)长在机制里,不是叠在上面的 bug。

抓住这个机制,很多原本奇怪的行为就说得通了。模型在吐出一个 token 之前,从不检查它是不是真的——只检查它是不是大概率的——这是 [hallucination](./Hallucination.md)(幻觉)的根源。它每吐一个 token 就落下一次承诺,所以一句听起来很自信的开头,能把整个回答带偏。又因为 [output tokens](./Output%20tokens.md) 严格一次只产出一个,生成速度给任何 [agent](./Agent.md)(智能体)的工作速度画了条下限。

_Usage:_

"agent 是怎么'决定'调用工具的?"

"它不决定——一路到底都是 next-token prediction。所谓 tool call,不过是 [harness](./Harness.md)(宿主环境)从输出流里解析出来的一段结构化字符串。"
