---
description: 试图让 agent 跨会话有状态的系统:把信息持久化到环境里,在会话开始时重新加载。
---

一个试图让 [agent](./Agent.md)(智能体)跨 [session](./Session.md)(会话)[stateful](./Stateful.md)(有状态)的系统。在 session 期间把信息持久化进 [environment](./Environment.md)(环境),在未来 session 开始时装回 [context window](./Context%20window.md)(上下文窗口),让 agent 在你 [clearing](./Clearing.md)(清空) session 之后仍然带着连续性。

memory system(记忆系统)分两半。写路径:session 期间,agent 把它学到的东西——你声明的一个偏好、项目的一个事实——写成 environment 里的文件。读路径:session 开始时,[harness](./Harness.md)(宿主环境)把这些文件,或它们的索引,装回 context window。很多 harness 自带 memory system——Claude Code 的 `/memory` 是一个——但你自己也能搭一个:一个笔记目录,加上 [AGENTS.md](./AGENTS.md.md) 里的一条"要查阅它"的指令。

任何常驻装载内容会有的权衡,这里同样适用。记忆会累积,所以大多数系统只装载一行索引,把正文留在 [context pointer](./Context%20pointer.md)(上下文指针)后面,而不是全文内联。而且记忆是 [secondary source](./Secondary%20source.md)(二手来源),会漂移:三月记下的事实,六月照样同样自信地装载,哪怕项目早已走远。memory system 需要修剪,和 AGENTS.md 一个道理。

_Usage:_

"我一直得反复告诉它我用的是 Postgres,不是 MySQL。"

"接一个 memory system——第一个 [turn](./Turn.md)(轮次)就把它学到的东西写进 [filesystem](./Filesystem.md)(文件系统),session 开始时重新装载。[model](./Model.md)(模型)本身是 [stateless](./Stateless.md) 的;记忆层负责伪造连续性。"
