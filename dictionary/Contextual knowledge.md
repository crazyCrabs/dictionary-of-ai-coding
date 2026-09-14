---
description: agent 当下可以直接从上下文里读到的事实。与参数化知识相对。
---

[agent](./Agent.md)(智能体)当下可以直接从 [context](./Context.md)(上下文)里读到的事实——用户的任务、agent 读进来的文件、[tool result](./Tool%20result.md)(工具结果)、[session](./Session.md)(会话)开始时装载的 [AGENTS.md](./AGENTS.md.md) 内容。与 [parametric knowledge](./Parametric%20knowledge.md)(参数化知识)相对:parametric 是从参数里*回忆*;contextual 是从[窗口](./Context%20window.md)里*阅读*。agent 从 contextual knowledge 出发工作时,[hallucination](./Hallucination.md)(幻觉)少得多——答案就在它眼前,不是从模糊的记忆里捞出来的。

两种知识里,只有 contextual knowledge 在你的控制之下。参数是冻结的,所以想给 [model](./Model.md)(模型)它缺的知识——一个内部 SDK、一个 [knowledge cutoff](./Knowledge%20cutoff.md) 之后发布的库、一个昨天做的决定——唯一的办法是放进 context。大量实际的 [AI](./AI.md) 编程工作归结起来就是这件事:在模型需要的时刻,把正确的事实放到它面前。

当 contextual 和 parametric 知识冲突,通常 contextual 赢。贴上当前的 API 文档,模型就照文档来,而不是照它对旧 API 的过期记忆——不过旧版本仍可能渗出来,尤其是在长 session 的深处。如果文档明明装载了,agent 却反复退回过时的写法,那是 parametric knowledge 在渗漏、越过了 contextual;复述一遍纠正,或把纠正挪到离工作更近的位置,会有帮助。

与 parametric knowledge 不同,contextual knowledge 是有使用成本的。装进窗口的每样东西都在花 [token](./Token.md),都在竞争模型的 [attention budget](./Attention%20budget.md)(注意力预算),所以装得多不自动等于好——目标是窗口里装相关的事实,不是所有事实。

_何时用这个词:_ 只在与 parametric knowledge 对举时用;平时直接说 **context** 就行。

_避免:_ "working memory"——contextual knowledge 是窗口*此刻*装着的东西;[memory system](./Memory%20system.md)(记忆系统)是把跨 session 的内容送进窗口的东西。尺度不同,别混。

_Usage:_

"为什么贴了文档它 API 就全对,不贴它就编?"

"文档在的时候,它用的是 contextual knowledge——照着页面读。不在的时候,是 parametric knowledge,罕见的端点就模糊了。"
