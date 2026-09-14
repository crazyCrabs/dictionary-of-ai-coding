---
description: context window 接近装满时,由 harness 自动触发的 compaction。
---

[context window](./Context%20window.md)(上下文窗口)接近装满时,由 [harness](./Harness.md)(宿主环境)自动触发的 [compaction](./Compaction.md)(压实)。

harness 盯着 context window 的满溢程度。越过某个阈值——常常在 80% 左右——它就暂停,要求 [model](./Model.md)(模型)摘要目前为止的 [session](./Session.md)(会话),并用摘要播种一个新 session。工作随即继续,仿佛什么都没发生。

只是确实发生了什么。compaction 是有损的,而 autocompact 在一个你没选的时刻有损。手动的 compact 发生在阶段边界,你可以告诉模型要保留什么。autocompact 在任务中途、只要阈值被触到就开火——可能正开在重构的一半,由摘要自己决定你的哪些决定值得保留。经典症状:[agent](./Agent.md)(智能体)干劲十足地继续,却悄悄忘掉了一个你一小时前定下的约束,你直到它的工作开始与那条约束矛盾时才察觉。

防御是不让它开火。盯着 context 指示器,在自然的边界手动 compact;或者把决定写进方案文档或磁盘上的 [handoff artifact](./Handoff%20artifact.md)(交接产物),那里没有摘要能弄丢它们。大多数 harness 还允许自定义缓冲——把阈值调早或调晚,或干脆关掉 autocompact——你可以调出开火之前自己想保留多少余量。

_Usage:_

"它好像不记得我们之前对 schema 的决定了。"

"autocompact 在两个 [turn](./Turn.md) 之间开火了——早期的决定被摘要,肯定丢了东西。重新装载方案文档,或者下次手动 compact,让你自己控制什么被保留。"
