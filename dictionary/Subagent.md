---
description: 一个 agent 通过工具调用派生的另一个 agent。运行在自己的会话里,只回报一个工具结果。不能再派生 subagent。
---

一个由另一个 agent 通过 [tool call](./Tool%20call.md)(工具调用)派生的 [agent](./Agent.md)(智能体)。运行在自己的 [session](./Session.md)(会话)和自己的 [context window](./Context%20window.md)(上下文窗口)里,只回报一个 [tool result](./Tool%20result.md)(工具结果)。与 [handoff](./Handoff.md)(交接)不同——父 agent 明确期待它回来;handoff 没有回头路。**不能再派生 subagent(子代理)**——树只有一层深。subagent 的存在是为了隔离 [context](./Context.md),不是为了搭层级。

要点是把嘈杂的工作挡在父 agent 的 context 之外。一次宽泛的搜索或一场漫长的读文件远征,会产出几十页 tool result,其中大多数只在找到答案之前有用。跑在父 agent 里,这一切会在 session 余下的时间里一直躺在父 agent 的 context 中。跑在 subagent 里,噪音填进一个一次性的窗口——只有最终报告落进父 agent 的 context。报告是一个 [secondary source](./Secondary%20source.md)(二手来源):父 agent 得到的是 subagent 对发现之物的转述,不是原始结果,报告漏掉的,父 agent 无从看见。

subagent 还可以并发——父 agent 可以对相互独立的工作一次派出好几个。

_Usage:_

"grep 的结果快把我的 context 撑爆了。"

"派一个 subagent 去搜——让它自己的 context window 承接噪音,只回报你真正需要的那两个文件路径。"
