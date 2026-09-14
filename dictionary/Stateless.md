---
description: 不向前携带信息。模型跨请求无状态;agent 默认跨会话无状态。
---

不向前携带信息。[model](./Model.md)(模型)在 [model provider request](./Model%20provider%20request.md)(模型供应商请求)之间是 stateless 的——每个请求重发完整的 [context window](./Context%20window.md)(上下文窗口),因为模型没有任何别的途径看到东西。[agent](./Agent.md)(智能体)默认在 [session](./Session.md)(会话)之间也是 stateless 的:新 session 从空开始,不留旧 session 的痕迹。与 [stateful](./Stateful.md)(有状态)相对。

模型本身永远 stateless:它的 [parameters](./Parameters.md)(参数)在 [training](./Training.md)(训练)后冻结,[inference](./Inference.md) 时你做的任何事都改变不了它。模型不会从你的纠正里学习,不记得昨天被告知过同一件事,也不会渐渐了解你——无论对话感觉上多么像那么回事。一个 session 之内的连续感,是 [harness](./Harness.md)(宿主环境)制造的:它保存对话记录,随每个请求重发。模型不是在回忆对话;它是在重读对话。

实际推论是:想让某个东西跨 session 被记住,你得把它写到 agent 会读回来的地方。这就是 [AGENTS.md](./AGENTS.md.md) 文件、[memory system](./Memory%20system.md)(记忆系统)和 [handoff artifact](./Handoff%20artifact.md)(交接产物)的用途——它们是会被装进未来 session 的 [context](./Context.md)(上下文)的文件,顶替模型没有的那份记忆。当 agent 一再犯你纠正过的错,问题不是它为什么没学会——它学不会——而是该把这条纠正写在哪儿,让每个未来的 session 都读到。

_Usage:_

"为什么每次 [clear](./Clearing.md) 之后它都忘掉约定?"

"模型是 stateless 的——新 session 从空开始。想让它被带走,就写进 AGENTS.md,或写在 harness 在 session 开始时加载的记忆文件里。"
