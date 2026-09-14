---
description: harness 暴露给 agent 调用的函数——Read、Write、Bash、Search。agent 感知和作用于环境的方式。
---

[harness](./Harness.md)(宿主环境)暴露给 [agent](./Agent.md)(智能体)调用的函数——Read、Write、Bash、Search。tool 是 agent 感知和作用于 [environment](./Environment.md)(环境)的方式:不通过 [tool result](./Tool%20result.md)(工具结果)它看不见环境,不通过 [tool call](./Tool%20call.md)(工具调用)它改变不了环境。每次 tool call 都多付一次 [model provider request](./Model%20provider%20request.md)(模型供应商请求),因为结果必须先送回 [model](./Model.md)(模型),它才能决定下一步。

大多数编程 agent 自带的 tool:

| Tool   | 做什么                                            |
| ------ | ------------------------------------------------- |
| Read   | 把文件内容作为 tool result 返回                   |
| Write  | 在 [filesystem](./Filesystem.md) 里创建或编辑文件 |
| Bash   | 跑一条 shell 命令,返回其输出                      |
| Search | 在代码库里查找匹配模式的文件或文本                |

一个 tool 由三样东西定义:名字、一段功能描述、参数的 schema。harness 随每个请求把这些定义发给 [model](./Model.md),而模型选择 tool 的方式与它产出其他一切的方式相同——写 [token](./Token.md)(词元),在这里是一段带参数的结构化调用。模型自己从不执行任何东西;harness 读出调用,执行函数,把结果送回去。

tool 列表决定了 agent 能做什么。能力强的模型配一个窄工具集,就是一个窄 agent:它会把一切都塞进手头有的工具里,这就是为什么 agent 如此依赖 Bash——shell 是一个够到系统大部分角落的 tool。想干净地给 agent 一种能力,就为它加一个 tool;[MCP](./MCP.md) 是把 harness 之外的工具插进来的标准。

tool 定义在每个请求里都占 [context](./Context.md)(上下文),所以大的工具集在任何调用发生之前就有常驻成本——而许多描述相似的 tool,会让模型更难挑中正确的那个。

_Usage:_

"agent 能直接查 staging 吗?"

"给 harness 加一个 `psql` tool,scope 限定为 staging 只读。没有对应的 tool,agent 对 filesystem 之外的一切都是盲的。"
