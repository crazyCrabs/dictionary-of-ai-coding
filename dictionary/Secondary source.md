---
description: 对一手来源的转述,隔了一层——摘要、文档、压缩摘要。装载便宜,构造上有损。
---

对 [primary source](./Primary%20source.md)(一手来源)的转述,隔了一层——描述代码的文档、概述对话记录的摘要、汇总搜索结果的报告。装进 [context window](./Context%20window.md)(上下文窗口)比它所描述的来源便宜,而且构造上有损:写它的人决定了什么重要,他丢掉的部分,只读摘要的读者永远看不见。

大量的 [context](./Context.md)(上下文)工程,就是制造 secondary source(二手来源)。[compaction](./Compaction.md)(压实)把 [session](./Session.md)(会话)历史变成播种下一个 session 的摘要。[subagent](./Subagent.md)(子代理)在嘈杂的搜索上烧掉自己的 context,只带回一份简短报告。[handoff artifact](./Handoff%20artifact.md)(交接产物)把一个 session 的决定浓缩成下一个 session 要读的文档。[memory system](./Memory%20system.md)(记忆系统)把 session 学到的东西蒸馏成笔记。每一样都在做同一笔交易:用保真度换空间。

secondary source 以两种方式失败。有损——丢了 schema 决定的压缩摘要、没提边界情况的报告。漂移——primary source 变了,转述没跟上,于是文档用这一季的自信描述上一季的架构。当 [agent](./Agent.md)(智能体)基于一条已经以任一方式失效的 secondary source 行动,它从错误的信息出发干劲十足;修法是把它送回 primary source。

但这两种失败都不能判 secondary source 死刑。context window 有限,primary source 又贵;没有摘要、报告和交接文档,什么都装不下。真正的功夫是知道哪些细节扛得住损耗——以及哪些扛不住时,回到 primary source 验证。一个做得好的 secondary source,带着一个指回原物的 [context pointer](./Context%20pointer.md)(上下文指针)——摘要里写明它出自哪份记录,文档里写明它描述的是哪个文件——当转述不够用时,读者可以顺着指针走,而不是对着残缺硬干。

_Usage:_

"交接文档说 auth 已经完成,可新 session 老发现 token 刷新是坏的。"

"那份文档是 secondary source——上一个 session 写下的是它相信的,不是真的。让新 session 跑一遍 auth 测试,以 primary source 为准。"
