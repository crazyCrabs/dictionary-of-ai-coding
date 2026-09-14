---
description: agent 运行其内的隔离环境——容器、VM 或受限 shell。限制 agent 动作的爆炸半径。
aliases:
  - Sandboxing
  - Sandbox / Sandboxing
---

[agent](./Agent.md)(智能体)运行其内的一个隔离 [environment](./Environment.md)(环境)——容器、VM、一次性的 [filesystem](./Filesystem.md)(文件系统),或受限权限的 shell。限制 agent 动作的爆炸半径:即使 agent 跑了破坏性命令或抓了恶意的东西,损害也被关在圈里。是让 [AFK](./AFK.md) 实际可行的安全底座。

sandbox 和 [permission mode](./Permission%20mode.md) 从相反的两端解同一个问题。permission 在动作运行前先问;sandbox 限制动作一旦运行能触到什么。permission 需要你留在 [loop](./Human-in-the-loop.md) 里——每次提问都是一次打断——而一个不停发问的 session 几乎谈不上自主。sandbox 花的是基础设施,不是注意力:隔离越强,需要问的问题越少。

隔离分档:

| 档位       | 是什么                                | 能圈住什么                     |
| ---------- | ------------------------------------- | ------------------------------ |
| 受限 shell | 每条命令外围的 OS 级约束              | 项目之外的写入、网络访问       |
| 容器       | 全新的 filesystem,不挂载凭证,用后即弃 | agent 对自己那台机器所做的一切 |
| VM / 云    | 一台完全独立的机器,常由 harness 提供  | 一切,包括内核级的逃逸          |

没有 sandbox 圈得住的:合法越过边界的行为。拿着你的 git 凭证的 agent 可以 push;有网络访问的 agent 可以调用生产 API。先决定什么允许越界,再决定边界砌多厚。

_Usage:_

"我想让它整夜跑 [bypass-permissions](./Agent%20mode.md),但我还没准备好。"

"把它放进 sandbox——新容器,不挂凭证,不出网络。最坏情况它清了自己的 filesystem,你把容器扔掉就是。"
