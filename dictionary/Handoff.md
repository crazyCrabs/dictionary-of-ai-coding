---
description: 把 agent 的上下文从一个 session 转移到另一个,没有回头路。携带机制多样——产物、压实等。
---

把 [agent](./Agent.md)(智能体)的 [context](./Context.md)(上下文)从一个 [session](./Session.md)(会话)转移到另一个。携带机制多样——写下来的 [handoff artifact](./Handoff%20artifact.md)(交接产物)、内存里的摘要([compaction](./Compaction.md)(压实))等。与 [clearing](./Clearing.md)(清空)不同(后者完全不转移)。动因也多样:切换角色(规划者 → 执行者)、启动一次 [AFK](./AFK.md) 运行、分派给并行的多个 session,或腾出 [context window](./Context%20window.md)(上下文窗口)的空间。

接收方 session 从零 context 起步——[model](./Model.md)(模型)是 [stateless](./Stateless.md) 的,旧 session 的任何东西对新 session 都不可见。下一个 session 需要什么,就得显式携带什么;其余的都没了。"没有回头路"是塑造携带方式的那个约束:新 session 没法去问旧 session"你当时是什么意思",所以被携带的材料必须自己站得住。

| 机制             | 形态                                     | 特点                                                         |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------ |
| Handoff artifact | [environment](./Environment.md) 里的文件 | 在任何东西依赖它之前,你可以先读它、改它;可复用给多个 session |
| Compaction       | context window 里的摘要                  | 自动且便宜;较难检查;只喂一个继承者                           |

坏 handoff 的可见失败是重新翻案:新 session 把旧 session 已经定下的事重新开议,因为携带的材料记下了"定了什么",却没记"为什么"。评判一个 handoff 的标准是:一个零 context 的 session,拿着它能把事情推进到什么程度。

_Usage:_

"规划 session 越来越重——要不要硬撑下去?"

"做个 handoff。把决定写进一份文档,clear,开一个读着它的新 session 做实现。"
