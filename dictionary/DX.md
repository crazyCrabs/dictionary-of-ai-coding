---
description: "开发者体验:代码库及其工具链让人把活干好有多容易——文档、反馈速度、报错。"
aliases:
  - Developer experience
---

Developer experience(开发者体验)——一个代码库和它的工具链让人把活干好有多容易。好的 DX 是:反馈快、报错清楚、文档答的正是你真正要问的问题、环境第一次跑就通。这个词远早于 AI 编程;它被收进这本词典,主要是作为 [AX](./AX.md) 的对照。

DX 是人与代码库之间的互动——仅此而已。两类受众的主要区别是:人是 [stateful](./Stateful.md)(有状态)的,agent 是 [stateless](./Stateless.md)(无状态)的。人把代码库学一遍,然后带着这份知识过完之后的每一天,所以糟糕的 DX 是可生存的:他们用攒着一起 push 绕过慢 CI,用去 Slack 问一次绕过缺失的文档,用"记得东西在哪"绕过混乱的结构。workaround 层层积累,一个团队最终在一个处处与之作对的代码库里保持了高产。

[agent](./Agent.md)(智能体)面对同一个代码库,却没有这些积累。跨 [session](./Session.md)(会话)[stateless](./Stateless.md) 的 agent,每次都从零重学代码库——快速的测试套件和清楚的报错它照样受益,但它昨天琢磨明白的东西,除非写进了 [environment](./Environment.md)(环境),否则全没了,而 agent 只能通过 [tool result](./Tool%20result.md)(工具结果)感知 environment。这就是 AX 点名的那道缺口:DX 中在开发者换成 agent 后仍然幸存的部分,再加上人类没有的顾虑,比如让 [context window](./Context%20window.md)(上下文窗口)保持空闲。

重叠意味着对 DX 的投入常常免费改善 AX——严格类型、快速测试、可预测的结构两头都帮。分歧意味着并非总是如此:一份精美的入职文档帮人帮一周,对 agent 则毫无帮助,除非它能从 [AGENTS.md](./AGENTS.md.md) 被够到。

_Usage:_

"我们的 DX 挺好——新人一周就能上手干活。"

"能上手,是因为那一周有人坐在旁边。agent 没有那一周;AX 得单独查。"
