---
description: 圈定一个 session 工作量的交接产物。可独立存在,也可挂在 spec 下。ticket 之间可以互相阻塞。
---

圈定一个 [session](./Session.md)(会话)工作量的 [handoff artifact](./Handoff%20artifact.md)(交接产物)。可以独立存在,也可以作为子项挂在 [spec](./Spec.md) 下。ticket 之间可以互相阻塞、或被兄弟 ticket 阻塞,于是工作的次序从依赖图里自然浮现,而不是来自一份线性计划。

定义性的约束是尺寸:一个 session。一张 ticket 应该能在 session 滑出 [smart zone](./Smart%20zone.md) 之前完成——而且这个约束是可检验的。如果你的 ticket 上的 session 常常活没干完就先劣化,ticket 太大了;拆。如果每个 session 大部分 [context](./Context.md) 花在准备工作上、真正的活只干了五分钟,ticket 太小了;合。

好的 ticket 是写给一个没有其他 context 的读者的。目标、验收标准、指向相关文件和决定的 [context pointer](./Context%20pointer.md)(上下文指针)——足够让 session 不必重新推导上一个 session 已经知道的东西就能开工。

依赖图也是并行化的开关。互相独立的 ticket——图上的叶子——可以各自在自己的 session 里同时跑。这是同时运行多个 agent 的有效方式。

_Usage:_

"迁移 spec 从哪儿开工?"

"看 ticket 图——schema 变更阻塞回填,回填阻塞 API 切换。挑一张叶子,给它开一个 session。"
