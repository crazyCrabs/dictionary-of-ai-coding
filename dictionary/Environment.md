---
description: agent 作用于其上的世界——harness 之外、agent 通过工具结果感知、通过工具调用改变的一切。
---

[agent](./Agent.md)(智能体)作用于其上的世界——[harness](./Harness.md)(宿主环境)之外、agent 通过 [tool result](./Tool%20result.md)(工具结果)感知、通过 [tool call](./Tool%20call.md)(工具调用)改变的一切。harness 是*运行* agent 的东西;environment 是 agent *在其中工作*的东西。像 [`AGENTS.md`](./AGENTS.md.md) 这样的文件住在 environment 里;harness 是把它装进 [context window](./Context%20window.md)(上下文窗口)的东西。[filesystem](./Filesystem.md)(文件系统)是最常见的 environment,但不是唯一的(数据库、远程 API、浏览器会话都可以是 environment)。

agent 只有在看的时候才看得见 environment。它对 environment 的一切了解都来自 tool result,所以它脑中的图景是一组快照,每个快照只在其拍下的那一刻准确。如果文件在 agent 读过之后变了——你手动改了它,或构建步骤重新生成了它——agent 会继续基于过期的副本推理,直到有什么触发了重读。agent 自信满满地描述一个早已不是那个样子的文件,通常是这个原因:environment 动了,快照没动。

environment 也是持久化的那一层——唯一永远 [stateful](./Stateful.md)(有状态)的一层。一个 [session](./Session.md)(会话)的 context 在 session 结束时就没了,但写进 environment 的文件会留下来,给下一个 session 读——[memory system](./Memory%20system.md)(记忆系统)、[handoff artifact](./Handoff%20artifact.md)(交接产物)和 `AGENTS.md` 依赖的正是这一点。任何 agent 明天还该知道的东西,都必须落进 environment。

environment 有多大,由你决定。[sandbox](./Sandbox.md) 把它缩小,限制 agent 能触达的范围;加一个 [tool](./Tool.md) 把它扩大,把数据库或 API 带进射程。边界之内是 agent 能感知和改变的一切;边界之外对 agent 来说不存在。environment 被布置得有多利于 agent 工作,就是这个代码库的 [AX](./AX.md)。

_避免:_ 用 "environment" 指运行时或 harness 本身——harness 是包装,environment 是工作场地。

_Usage:_

"agent 看不到 staging 库的 schema。"

"把它接进 environment——给它一个 `psql` tool,scope 限定为 staging 只读。harness 没问题,只是它无事可做。"
