---
description: "Agent 体验:环境为一个 agent 把活干好布置得有多好——检查、架构、空闲的上下文。"
aliases:
  - Agent experience
---

Agent experience(agent 体验)——[environment](./Environment.md)(环境)为一个 [agent](./Agent.md)(智能体)在代码库里把活干好布置得有多好。面向 agent 的、[DX](./DX.md) 的对应物。同一个 agent 在一个仓库里表现出色、在另一个里拉胯——同一个 [model](./Model.md)(模型),同一个 [harness](./Harness.md)(宿主环境)——差别通常就是 AX。本能反应是怪模型、或重写提示词;修法更多时候在仓库里。

好的 AX 有三个主要维度:

| 维度             | 好的 AX 长什么样                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automated checks | 快速、确定的 [automated check](./Automated%20check.md)(自动检查)——类型、测试、lint——agent 无需人参与就能据此自我纠正                                                                               |
| Architecture     | agent 不必读完全部就能导航的代码库:可预测的结构、大量行为藏在小的接口后面、名字说得出东西是干什么用的                                                                                              |
| Free context     | [AGENTS.md](./AGENTS.md.md)、[skill](./Skill.md) 和 [tool](./Tool.md) 保持精瘦,[context window](./Context%20window.md) 的大部分留给任务,agent 留在 [smart zone](./Smart%20zone.md) 里,而不是被淹死 |

AX 和 DX 有重叠——好的检查和干净的架构对两类受众都有益——但它们也分道。人能容忍部落知识、慢 CI 和"billing 模块去问 Sarah";agent 不能。agent 从 IDE 的工具提示和漂亮的仪表盘里得不到任何好处;它们需要的是失败以文本形式出现在 [tool result](./Tool%20result.md)(工具结果)里。一个代码库完全可以 DX 良好而 AX 拉胯。

_避免:_ 把 AX 当 DX 的同义词——两类受众需要的投入不同。

_Usage:_

"这个 agent 在 API 仓库里写得很好,到了前端就产垃圾。"

"API 仓库有严格类型和快速测试套件;前端两样都没有,还有四十个常驻装载的 skill。那是 AX 缺口,不是模型问题。"
