---
description: 只装载 agent 当下需要的上下文,其余放在 context pointer 后面。借自 UI 设计。
---

只装载 [agent](./Agent.md)(智能体)当下需要的 [context](./Context.md)(上下文),其余用 [context pointer](./Context%20pointer.md)(上下文指针)指向。借自 UI 设计,在那里它的意思是:只向用户展示与当前任务相关的控件,其余藏在一次点击后面。

这门技术存在,是因为 context 的账要付两遍。每个预先装载的 [token](./Token.md)(词元),每个 [turn](./Turn.md)(轮次)都按 [input tokens](./Input%20tokens.md)(输入 token)计费;而且不管 agent 需不需要,每个 token 都在花 [attention budget](./Attention%20budget.md)(注意力预算)。一份塞满完整风格指南、部署手册、数据库约定的 [AGENTS.md](./AGENTS.md.md),会让 agent 样样都变差——当前任务用得上的指令,被用不上的稀释了。症状是:agent 无视你明知就在它 context 里的规则——规则在,只是被埋了。

progressive disclosure(渐进披露)把它倒过来。常驻装载层保持小——每个主题一句话,加一个指向细节所在处的指针。agent 写组件时读风格指南,部署时读部署手册,修测试时两者都不读。[skill](./Skill.md) 就是内建于 [harness](./Harness.md) 的这个模式:一段简短描述每个 [session](./Session.md) 都装载,完整指令只在被触发时才装。

_Usage:_

"要把整本风格指南倒进 AGENTS.md 吗?"

"不要——用 progressive disclosure。把风格指南做成一个 skill,agent 真要写组件时才装载。AGENTS.md 每个 turn 都在付 token 账。"
