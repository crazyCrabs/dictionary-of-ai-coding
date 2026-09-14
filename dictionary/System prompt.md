---
description: harness 在每次模型供应商请求前附加的指令——agent 的常备简报。通常在一个会话内保持不变。
---

[harness](./Harness.md)(宿主环境)附加在每次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)开头的指令——[agent](./Agent.md)(智能体)的常备简报:它是谁、如何行事、能调用哪些 [tool](./Tool.md)(工具)、遵循什么约定。通常在一个 [session](./Session.md)(会话)内保持不变。

system prompt 由 harness 的厂商写,不是你写的,而在编程 harness 里它很大——常常是几万 [token](./Token.md)(词元)的行为规则、工具描述和边界情况处理,每个 [turn](./Turn.md)(轮次)都作为 [input tokens](./Input%20tokens.md) 付一遍钱。你自己的常备指令搭它的便车:[AGENTS.md](./AGENTS.md.md) 这类文件在 session 开始时被装在 system prompt 旁边,[model](./Model.md)(模型)在看到你的消息之前,先一起读完厂商的简报和你的。

因为每个请求里它都一字不差,它构成了 [prefix cache](./Prefix%20cache.md)(前缀缓存)的开头——这也是 harness 情愿让整个 session 保持它不变、而不随做随改的原因之一。

模型被训练成优先遵循 system prompt 而不是用户消息。所以当 agent 坚持一个你从没要求过的约定,或用一种你怎么都掰不过来的方式格式化输出,它通常是在服从 system prompt——你的消息在这场争执里输了。一些 harness 是可定制的:它们让你直接访问 system prompt,你可以读到 agent 实际被告知了什么,并且改掉它。

_Usage:_

"两个 harness,同一个模型,同一个提示,行为完全不同。"

"system prompt 不同。一个被调教成改代码从简,另一个被调教成从详解释——分歧在那里就已经注定,你的消息还没到场。"
