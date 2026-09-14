---
description: session 变长时,每个 token 的注意力预算摊给更多竞争者;重要关系上的信号变小。
---

[session](./Session.md)(会话)变长时,每个 [token](./Token.md)(词元)的 [attention budget](./Attention%20budget.md)(注意力预算)被摊给更多竞争者。任何一段[有意义关系](./Attention%20relationship.md)上的信号变小;无关 [context](./Context.md) 的噪音挤进来。同一个 [model](./Model.md),同一份 [parameters](./Parameters.md)——只是同一盘菜要喂的嘴更多了。smart zone / dumb [zone 现象](./Smart%20zone.md)的成因。

它表现为模型在 session 中途变差:遵守了一个小时的约束开始松脱,它重新问已经被告知过的事,它写出无视早前读过文件的代码。模型本身没有任何变化——唯一的变量,是它此刻正在关注的 context 有多少。

它是渐变的,这正是从 session 内部难以察觉的原因。没有报错,没有阈值;每个 [turn](./Turn.md)(轮次)只比上一个差一点点,等你明显看出滑落时,你已经在 dumb zone 里待了一阵了。

恢复靠移除 context,不靠添加。把被无视的指令重贴一遍,只是往已经拥挤的窗口里再加一个竞争者,只管一小会儿。有效的是:[clear](./Clearing.md)(清空)后只重新装载任务需要的部分,或者 [compact](./Compaction.md)(压实),或者 [hand off](./Handoff.md)(交接)给一个新 session。把指令遵循度的下降当作 context 长度的信号,而不是模型的信号。

_Usage:_

"它深深陷在 dumb zone 里了——编造类型文件里不存在的泛型。"

"attention degradation。类型定义还在 context 里,但它们上面的信号,被我们之后塞进去的所有东西埋了。清空重载。"
