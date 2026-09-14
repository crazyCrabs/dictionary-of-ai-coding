---
description: 描述一项跨多个 session 的工作的交接产物——建的是什么,而不是每个 session 怎么做它那份。由 ticket 组成。
---

描述一项跨多个 [session](./Session.md)(会话)的工作的 [handoff artifact](./Handoff%20artifact.md)(交接产物)——写的是建的是什么,不是每个 session 怎么做它那一份。随工作推进而演化。由 [ticket](./Ticket.md) 组成。

spec 存在的理由是:session 是一次性的,大工作不是。任何超过一个 [context window](./Context%20window.md) 工作量的事情,都需要一个 [context](./Context.md)(上下文)之外的家——agent [environment](./Environment.md)(环境)里某个能在 [clearing](./Clearing.md)(清空)后幸存的地方,可以是仓库里的文件、GitHub issue,或 agent 够得着的 issue tracker。spec 就是那个家:目标、约束、到目前为止的决定、ticket 清单及其状态。任何一个新 session 读它,就能知道工作进行到哪,而不必继承上一个 session 积累的噪音。

spec 有几种一眼可辨的风格,大多继承自团队本来记录事情的方式。_product requirements document_(PRD,产品需求文档)偏向面向用户的"是什么、为什么"——功能、行为、验收标准。_design doc_ 或 _RFC_ 偏技术——选定的方案、被否决的备选、权衡取舍。往小了说,一个带 ticket 清单的朴素 `plan.md`,对一个跨 session 的功能干的是同一件事。风格没有角色重要:对 [agent](./Agent.md)(智能体)来说,这些全是同一个东西——它每个 session 开始时都要读的那份持久的意图声明。

_Usage:_

"这些活该全塞进一个 session 吗?"

"不,写成一份 spec——拆成 ticket,每条在自己的 session 里跑。想在一个 context 里干完全部,半路就进 [dumb zone](./Smart%20zone.md) 了。"
