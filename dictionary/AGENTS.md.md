---
description: 环境中的一个文件,harness 在会话开始时装进上下文窗口——项目写给 agent 的常备简报。
---

[environment](./Environment.md)(环境)里的一个文件,[harness](./Harness.md)(宿主环境)在 [session](./Session.md)(会话)开始时把它装进 [context window](./Context%20window.md)(上下文窗口)——项目写给 [agent](./Agent.md)(智能体)的常备简报。跨 harness 的通用约定;一些 harness 还有自己的变体(Claude Code 的是 CLAUDE.md)。

因为它自动装载,它是避免跨 session 重复自己的一个办法。[model](./Model.md)(模型)是 [stateless](./Stateless.md)(无状态)的——你在某个 session 里给过的纠正,下一个 session 就没了,于是你不得不向每个新 session 重申:项目用 pnpm、测试要带某个特定 flag、某个目录是生成的别碰。当你为同一件事纠正过 agent 两次,这条纠正就是 AGENTS.md 的候选行。

合适的内容是 agent 无法从代码推导出来的东西:构建和测试命令、代码库没写明白的约定、硬性约束("绝不编辑生成的 client")。短小、陈述式——它是简报,不是文档。

代价是它里面的一切都永远装载。指令会累积,而且大多数与任何给定任务无关;一份长长的 AGENTS.md 既烧 [token](./Token.md),又稀释自己——context 里的指令越多,模型对其中任何一条的遵循越不可靠。

_避免:_ 把本该 [progressively disclosed](./Progressive%20disclosure.md)(渐进披露)的内容放进 AGENTS.md——它里面的每一样,每个 [turn](./Turn.md)、每个 session 都在付 [token](./Token.md) 账,不管那个 session 需不需要。风格指南可以放到一个 [skill](./Skill.md) 或 [context pointer](./Context%20pointer.md)(上下文指针)后面;AGENTS.md 只留放之四海的行。

_Usage:_

"为什么每个 session 一开场就烧掉 4k token?"

"查一下 AGENTS.md——有人把整本风格指南粘进去了,而不是放在 skill 后面。"
