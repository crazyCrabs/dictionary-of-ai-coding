---
description: 与 agent 的一次有边界的交互运行:从空开始累积,在清空、关闭或压缩成新 session 时结束。
---

与 [agent](./Agent.md)(智能体)的一次有边界的交互运行。从空开始,累积消息、[tool result](./Tool%20result.md)(工具结果)和读过的文件,在 [clearing](./Clearing.md)(清空)、关闭,或经 [compaction](./Compaction.md)(压实)变成新 session 时结束。session 正是填满 [context window](./Context%20window.md)(上下文窗口)的那个东西:如果说 context window 是盒子,session 就是慢慢把它填满的物品。单个 context window 装不下的工作,必须拆到多个 session 里。

session 的消息历史是 agent 的工作记忆。[model](./Model.md)(模型)是 [stateless](./Stateless.md)(无状态)的,所以它看起来记得的一切——你要求过什么、测试说了什么、三个 [turn](./Turn.md)(轮次)之前它决定了什么——都在消息历史里,随着每一次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)重新发送。不在 session 里的东西,对 agent 来说不存在。

这份记忆随 session 终结。新 session 从零开始:昨天 session 结束时还熟识你代码库的 agent,今天早上对它一无所知。能存续下来的是 [filesystem](./Filesystem.md)(文件系统)——一个 session 里写下的文件,下一个 session 读得到;[handoff](./Handoff.md)(交接)、[memory system](./Memory%20system.md)(记忆系统)和 [AGENTS.md](./AGENTS.md.md) 依赖的正是这一点。

session 在哪里结束,由你决定。session 中的每样东西都影响之后的每个 turn,所以在同一个 session 里做不相关的任务,残留会污染下一个回答。一个 session 一个任务,context 才保持相关;任务完成,就是清空的自然时机。

_Usage:_

"一个 session 能跑多久才会开始散架?"

"看工作——目标集中的 refactor 比开放式研究撑得久。session 一旦膨胀,就 hand off 或 compact,别硬推。"
