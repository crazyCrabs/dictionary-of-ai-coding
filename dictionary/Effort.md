---
description: 模型回答前做多少推理的旋钮。调高 effort 花更多输出 token,换难问题上更高的一次命中率。
aliases:
  - Reasoning effort
  - Thinking effort
---

Effort 是一个旋钮,控制 [model](./Model.md)(模型)回答之前做多少推理。它在每个 [model provider request](./Model%20provider%20request.md)(模型供应商请求)上设置,控制模型在开始写你能看到的回答之前,要走过多少思考。那些思考和其他一切一样,是在 [inference](./Inference.md) 时生成的;[harness](./Harness.md)(宿主环境)常常把它藏起来,但那是模型真实在做的工作。

更高的 effort 更贵也更慢。推理以 [token](./Token.md) 的形式产出,按 [output tokens](./Output%20tokens.md)(输出 token)计费——哪怕你从没看到它们——而且一次只生成一个 token,所以调高 effort 拉长答案到达前的等待,也加大账单。这笔交换是:更充分的推敲,换速度和成本。

大多数 harness 把 effort 暴露成一个小阶梯:

| 档位   | 适用场景                               |
| ------ | -------------------------------------- |
| Low    | 机械修改、查找、路径唯一且明确的变更。 |
| Medium | 日常编码——通常的默认。                 |
| High   | 棘手的 bug、设计决定、多步规划。       |
| Max    | 最难的问题,答错的代价高昂、难以回退。  |

设错的症状双向都有。难题上把 effort 设太低,你会得到一个自信而肤浅的答案,它跳过了问题需要的推理——读起来顺,但错在让你后面才付账的地方。给一行重命名设 max,你就得陪着一场漫长的思考,产出不会比最低档多。

让 effort 匹配任务,而不是匹配 [session](./Session.md)(会话)。真正难推理的部分调高,周围的体力活调回来。

_Usage:_

"这个并发修复它一直搞砸,我都重新解释三遍了。"

"把 effort 调高。那是一个重推理的 bug,默认档位下,它在选定方案之前想得不够久。"
