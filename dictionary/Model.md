---
description: 参数本身。无状态——只做下一词元预测,别的什么都不做。自己无法完成任何 agentic 行为。
---

[parameters](./Parameters.md)(参数)本身。[stateless](./Stateless.md)(无状态)——只做 [next-token prediction](./Next-token%20prediction.md)(下一词元预测),别的什么都不做。"Claude Opus 4.x"和"GPT-5.x"都是 model。一个 model 单独做不了任何 agentic 的事;它必须被 [harness](./Harness.md)(宿主环境)装配起来。

model 不能读文件、跑命令、浏览网页、也记不住昨天——它接收 [token](./Token.md)(词元)、预测 token,每个 [model provider request](./Model%20provider%20request.md)(模型供应商请求)一次。一切看起来像 [agent](./Agent.md)(智能体)在工作的东西——挑选 [tool](./Tool.md)(工具)、读结果、循环直到任务完成——都是 harness 在连续编排这些预测。

[model provider](./Model%20provider.md)(模型供应商)按档位发布 model:大的最聪明但慢且贵,小的更快更便宜但能力弱。选档位是个真实的决定——重档用于规划和难的调试,轻档用于机械性修改——harness 允许你在 [session](./Session.md)(会话)中途切换。

对这个措辞较真,也能让诊断更锐利。"这个 model 干不好这事"是一个具体的断言——同一个 model 换一个 harness,或换一份 [context](./Context.md)(上下文),行为常常完全不同。在怪罪 model 之前,先检查它被给了什么:大多数令人失望的输出,追根溯源是 context 或 harness 的问题,不是参数的问题。

_Usage:_

"规划这步,要不要把 model 从 Sonnet 换成 Opus?"

"可以试——但这个任务里大部分活是 harness 干的。如果 [system prompt](./System%20prompt.md) 和工具不对,换 model 也没用。"
