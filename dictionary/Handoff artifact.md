---
description: 作为 handoff 携带机制使用的文档——由一个 session 写下,给另一个 session 读。
---

作为 [handoff](./Handoff.md)(交接)携带机制使用的文档——由一个 [session](./Session.md)(会话)写进 [environment](./Environment.md)(环境),给另一个 session 读。[spec](./Spec.md)、[ticket](./Ticket.md) 和方案文档都是 handoff artifact(交接产物)。

要写它的原因:[model](./Model.md)(模型)是 [stateless](./Stateless.md)(无状态)的,session 里的一切都活不过 [clearing](./Clearing.md)(清空)。决定、约束、做了一半的方案——都随承载它们的 [context](./Context.md)(上下文)一起消失。environment 是持久的。把重要的状态写进文件,就是把它挪到下一个 session 能读回来的地方。

artifact 是一种 [secondary source](./Secondary%20source.md)(二手来源)——对 session 工作的转述,不是工作本身。这让它小到足以给一个全新的 session 做简报,也是它可能误导新 session 的原因:它记下的是写它的 session 相信的东西,它漏掉的或写错的,读者无从察觉。凡是重要的断言,下一个 session 应该对着 [primary source](./Primary%20source.md)(一手来源)——代码、测试——验证,而不是照单继承。

好的 artifact 是写给一个零 context 的读者看的。具体的文件路径,而不是"我们讨论过的那个文件"。决定了什么、为什么这么决定,让下一个 session 不必重新开议。做完了什么、还剩什么。告诉写它的 session 这份文档的去向也有帮助:"为一个对这项工作一无所知的新 session 写一份交接文档。"

另一种携带机制是 [compaction](./Compaction.md)(压实),在内存里摘要。artifact 有两个优势:它住在磁盘上,在任何东西依赖它之前,你可以先读它、改它;而且它可以复用——同一份 spec 可以给五个并行 session 做简报。

_Usage:_

"这个活怎么在规划 agent 和实现 agent 之间分工?"

"让规划 agent 写一份 handoff artifact——文件路径、决定、约束。实现 agent 的 session 开场就指向这份 artifact,把它当作简报来干活。"
