---
description: 打包成一个单元的可传授能力——不进上下文窗口,直到 context pointer 为手头任务把它拉进来。
---

一个打包成单元的可传授能力——把一件事做好的指令与资源,放在 [environment](./Environment.md)(环境)里,直到一个 [context pointer](./Context%20pointer.md)(上下文指针)为手头的任务把它拉进 [context window](./Context%20window.md)(上下文窗口)。[harness](./Harness.md)(宿主环境)里承载 [progressive disclosure](./Progressive%20disclosure.md)(渐进披露)的单位。

skill 是开放标准,定义在 [agentskills.io](https://agentskills.io)——最初由 Anthropic 开发,此后被大多数主流 harness 采纳,所以一个 skill 写一次,到处能用。格式是一个文件夹,内含:

- 一个 `SKILL.md` 文件——元数据(至少有名字和描述)加指令本身
- 可选的、[agent](./Agent.md)(智能体)可以运行的脚本
- 可选的、指令所指向的模板和参考资料

默认只有名字和描述占着 [context](./Context.md)(上下文)。agent 的任务匹配时,它才装载其余部分。在那之前,skill 几乎不占地方——一两句话的 [token](./Token.md),不管它的完整指令有多大。

这是 skill 与 [AGENTS.md](./AGENTS.md.md) 的分野:后者不管任务是什么,每个 [session](./Session.md)(会话)都装载。skill 在某类工作出现时才被读——发布、搭一个新服务的脚手架、写一次迁移——其余时间被无视。

_避免:_ "[tool](./Tool.md)"——tool 是 agent *调用*的东西;skill 是它 *阅读*的指令。

_Usage:_

"部署手册该放哪儿?"

"做成 skill——agent 只在任务涉及部署时才装载。放 AGENTS.md 的话,我们每周用一次的东西,每个 [turn](./Turn.md)(轮次)都在烧 token。"
