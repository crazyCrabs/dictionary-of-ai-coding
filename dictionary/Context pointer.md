---
description: 一份文档里指向另一份的提及,agent 只在任务需要时才把它拉进上下文。
---

一份文档里指向另一份的提及,[agent](./Agent.md)(智能体)只在任务需要时,才把后者拉进 [context window](./Context%20window.md)(上下文窗口)。是 [progressive disclosure](./Progressive%20disclosure.md)(渐进披露)赖以搭建的单位。

用指针(而不是内联内容)的理由是成本。一个指针只是 context window 里的一行。它背后的文档可能有好几千 [token](./Token.md),但在 agent 真的去跟随指针之前,这些 token 一个都不计费。把一份 2000 token 的部署手册内联进 [AGENTS.md](./AGENTS.md.md),每个 [session](./Session.md)(会话)都为它付钱;换成"deploy process: see `internal/deploy.md`",只有真正部署的 session 才装载它。任务匹配时,agent 用一次 [tool call](./Tool%20call.md)(工具调用)跟随指针。

一个指针要能用,需要两样东西:一条稳定的路径,和足够的描述让 agent 知道何时值得跟随。裸路径是指针里 agent 没有理由跟的那种;"see `internal/deploy.md`"但不提里面有什么,需要它的 session 也会跳过。把这一行写成任务出现时的样子:"release、deploy 或 rollback——先读 `internal/deploy.md`"。

一旦留心,指针无处不在:[AGENTS.md](./AGENTS.md.md) 里的行、[skill](./Skill.md) 的描述(harness 装载描述;skill 正文在它后面等着)、目录列表里的文件名、文档之间的链接。

指针还可以把一个 [secondary source](./Secondary%20source.md)(二手来源)拴回它所出自的 [primary source](./Primary%20source.md)(一手来源)——写明原始对话记录的压缩摘要,写明它描述的是哪个源文件的文档。这让二手来源的有损变得可恢复:当摘要不够用时,agent 顺着指针去读原文,而不是对着摘要保留下来的东西硬干。

_避免:_ "reference"——太干瘪;传达不出"跟随它会拉进更多 context"的意思。"Portal"——太花哨。

_Usage:_

"AGENTS.md 越来越大了。"

"里面大部分应该是 context pointer,不是内容。常驻的规则留在内联;把部署手册和风格指南做成 skill,在原地留一个 context pointer。"
