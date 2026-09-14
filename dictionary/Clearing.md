---
description: 结束当前 session,开一个全新的。下一条消息从一个空 session 和空上下文窗口开始。
---

结束当前 [session](./Session.md)(会话),开一个全新的。下一条消息从一个空 session 和一个空 [context window](./Context%20window.md)(上下文窗口)开始。通常由用户发起。

clearing 是被污染 context 的解药。一个 session 会积累一切:失败的尝试、走错的路、过期的 [tool result](./Tool%20result.md)(工具结果)、被放弃的方案。[model](./Model.md)(模型)在每个 [turn](./Turn.md)(轮次)都重读这一切,坏历史拖累新工作。深陷长 session 时,[agent](./Agent.md)(智能体)越来越含糊、越来越不听话——明确给过的指令被无视,质量下滑,催它也没用,因为它蹚着的那片噪音还在它的 [context](./Context.md) 里。clearing 移除噪音。

clearing 不抹掉对话记录。大多数 [harness](./Harness.md)(宿主环境)把 session 历史留在你的电脑上,记录还在,可以翻阅也可以恢复。消失的是 agent 的工作状态:model 是 [stateless](./Stateless.md)(无状态)的,新 session 对旧 session 知道的事一无所知。如果 session 里有下一个 session 需要的决定或进展,先让 agent 写一份 [handoff artifact](./Handoff%20artifact.md)(交接产物),再开新 session 并指向它。

对比 [compaction](./Compaction.md)(压实):它把 session 摘要进新 context,而不是从空开始。clearing 是更钝的工具:什么都不带走,包括垃圾。

_Usage:_

"它卡在那个失败的测试上打转。"

"直接 clear——开个新 session,带上方案文档和测试文件。跟现有的 context 较劲没有意义。"
