---
description: harness 在每次模型供应商请求中发送的 token。计费费率低于输出 token。
---

[harness](./Harness.md)(宿主环境)在每次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)中发送的 [token](./Token.md)(词元)——[system prompt](./System%20prompt.md)(系统提示)、对话历史、[tool result](./Tool%20result.md)(工具结果),[model](./Model.md)(模型)在写出之前读到的一切。计费费率低于 [output tokens](./Output%20tokens.md)(输出 token),因为处理它们比产出输出便宜。

做 [AI](./AI.md) 编程时,input tokens 构成你账单的大头。model 是 [stateless](./Stateless.md)(无状态)的,所以每个 [turn](./Turn.md) 把整个 [session](./Session.md)(会话)作为输入重发:你的第一条消息、每条回答、之后的每条 tool result。第五十个 turn 的输入里,装着之前四十九个 turn。一次 model provider request 可能只产出几百个输出 token,却重发十万 token 的累积历史。

[prefix cache](./Prefix%20cache.md)(前缀缓存)能把成本压下来:与之前某个请求完全一致的历史,按便宜的 [cache tokens](./Cache%20tokens.md)(缓存 token)计费,而不是全价 input。当输入成本仍然刺痛,修法是缩小被重发的东西——任务之间 [clearing](./Clearing.md)(清空)或 [compaction](./Compaction.md)(压实)。

_Usage:_

"账单很高,可 [agent](./Agent.md)(智能体)几乎没写什么。"

"是 input tokens——每个 turn 都重发整个 session。没有 prefix cache 的话,历史每次请求都要重付一遍。"
