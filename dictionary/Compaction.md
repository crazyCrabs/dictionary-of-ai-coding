---
description: 在内存里完成的 handoff(交接):上一个 session 的历史被摘要,并以此播种新 session。有损——用细节换余量。
---

在内存里完成的 [handoff](./Handoff.md)(交接):上一个 [session](./Session.md) 的历史被摘要成一段总结,再由这段总结播种一个新 session。有损是设计使然:原始记录是 [primary source](./Primary%20source.md)(一手来源),摘要是 [secondary source](./Secondary%20source.md)(二手来源)——用细节换余量。由用户手动触发,或经 [autocompact](./Autocompact.md) 自动触发。

机制如下:[context window](./Context%20window.md) 有限,而一个长 session 会把它填满——每条 [tool result](./Tool%20result.md)、每次读文件、每次走错的路,都留在历史里。等它变得沉重,[harness](./Harness.md)(宿主环境)会让 [model](./Model.md)(模型)摘要这个 session,扔掉原始历史,再用摘要播种新 session。没进摘要的,就从 context 里消失了。一些 harness 会缓和这一点:把旧的原始记录留在磁盘上,并在摘要里留一个指向它的 [context pointer](./Context%20pointer.md)(上下文指针)——二手来源回链一手来源,摘要丢掉的细节可以靠重读原文找回。

摘要是 model 写的,所以它可以被提示。"把 schema 决定保留下来"这样的指令,能让生成的产物更有章法。时机同样重要——在阶段边界、方案定下来之后 compact,别在任务中途。

与 [clearing](./Clearing.md)(清空)对比:clearing 把一切丢掉、冷启动;compaction 设法把要点带过去,clearing 则赌这些要点已经写在了更好的地方。

_Usage:_

"[Context](./Context.md) 越来越重,可我还有一轮测试要跑。"

"开始前先 compact——把必须存续的内容写进摘要提示里,让新 session 保住 schema 决定、丢掉探索过程。"
