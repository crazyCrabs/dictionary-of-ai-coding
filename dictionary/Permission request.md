---
description: harness 在执行未被预先批准的工具调用前展示给用户的东西。把人放进循环的机制。
---

[harness](./Harness.md)(宿主环境)在执行一个未被预先批准的 [tool call](./Tool%20call.md)(工具调用)之前,展示给用户的东西。[model](./Model.md)(模型)产出一个 tool call;harness 不立即运行,而是停下来问。批准就执行;拒绝,harness 就把拒绝作为一条 [tool result](./Tool%20result.md)(工具结果)报告给模型。这是 harness 把人放进 [loop](./Human-in-the-loop.md)(人在回路)来把关高风险或敏感动作的机制。

一次 permission request 的生命周期:

| 步骤 | 谁      | 发生什么                                                              |
| ---- | ------- | --------------------------------------------------------------------- |
| 1    | Model   | 产出一个 tool call                                                    |
| 2    | Harness | 对照 [permission mode](./Permission%20mode.md) 和已保存的批准记录检查 |
| 3    | Harness | 已预批:立即执行。否则:暂停并展示请求                                  |
| 4    | User    | 批准一次、批准整个 [session](./Session.md)(会话),或拒绝               |
| 5    | Harness | 执行调用,或把拒绝作为 tool result 送回去                              |

拒绝一个请求,本身就是一次转向。模型像读其他 tool result 一样读拒绝并做出反应——它换个路子,或者问你倾向怎么做。大多数 harness 允许在拒绝时附一句话,这就把请求变成了转向点:"别这样,改用迁移脚本"恰好落在模型决定下一步怎么做的那一刻。

代价是每个请求都是对你的一次同步等待。[agent](./Agent.md)(智能体)卡在那儿直到你回应——你在看着时没问题,你不在时就是麻烦:一个不断触发请求的 agent 没法放着 [AFK](./AFK.md) 干活。permission mode 就是那个旋钮:哪些调用直接放行、哪些先问,理想情况下再配一个 [sandbox](./Sandbox.md),让扩大放行集合变得安全。

_Usage:_

"它卡在一个 permission request 上十分钟了——我在开会。"

"这就是 human-in-the-loop 的成本。把安全的 [tool](./Tool.md) 预批掉,让请求只在真正危险的调用上触发。"
