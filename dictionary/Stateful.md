---
description: 向前携带信息。会话跨轮次有状态;agent 可以通过记忆系统变得跨会话有状态。
---

向前携带信息。[session](./Session.md)(会话)跨 [turn](./Turn.md)(轮次)是 stateful 的——[context](./Context.md)(上下文)随 session 运行而累积,这正是长 session 滑向 [dumb zone](./Smart%20zone.md) 的原因。[agent](./Agent.md)(智能体)可以变得跨 **session** stateful:加一个 [memory system](./Memory%20system.md)(记忆系统),把信息持久化进 [environment](./Environment.md)(环境),在未来 session 开始时重新加载。[model](./Model.md)(模型)永远不 stateful;任何表面上的连续,都是 [harness](./Harness.md)(宿主环境)在重新喂 context。与 [stateless](./Stateless.md)(无状态)相对。

每一层的状态住在哪:

| 层          | 是否有状态 | 方式                                                                                                  |
| ----------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| Model       | 永不       | [Parameters](./Parameters.md)(参数)冻结;它只看到每个请求里带的东西                                    |
| Session     | 跨 turn    | harness 把每条消息和 [tool result](./Tool%20result.md) 追加进 context                                 |
| Harness     | 跨 session | 记忆文件、[AGENTS.md](./AGENTS.md.md)、[handoff artifact](./Handoff%20artifact.md)——写下来,之后再加载 |
| Environment | 永远       | 文件持续存在,不管有没有 session 在跑                                                                  |

每层的状态,都是靠重读下一层存下的东西搭起来的:session 显得连续,是因为 harness 把消息历史重发给 stateless 的模型;agent 能跨 session 记住,是因为 harness 从 environment 重读文件。没有任何状态存在模型自己身上。

状态并不总是想要的。一切被带向前的东西都在影响接下来发生什么,所以 session 早期一个错误假设也会被带着走。[clearing](./Clearing.md)(清空)就是主动扔掉 session 状态、从写下来的东西重新开始的动作。

_Usage:_

"它记得我昨天的偏好——是不是说明模型学会了?"

"不是,是 agent 的 harness 把偏好写进了记忆文件、在 session 开始时重新加载。模型本身对昨天一无所见。"
