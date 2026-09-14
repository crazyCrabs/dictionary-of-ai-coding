---
description: 供应商通过前缀缓存从上一个请求存下来的输入 token,按低得多的费率计费。
---

[provider](./Model%20provider.md)(模型供应商)从上一个 [model provider request](./Model%20provider%20request.md)(模型供应商请求)缓存下来的 [input tokens](./Input%20tokens.md)(输入 token),这样就不必重新处理。当连续请求共享一个前缀,provider 通过 [prefix cache](./Prefix%20cache.md)(前缀缓存)复用处理结果,把缓存住的部分按低得多的费率计费。这是让长 [session](./Session.md)(会话)付得起的那个杠杆——没有它,每个 [turn](./Turn.md) 都要为整段历史重付一次。

这件事重要的原因,是 session 的计费方式。[model](./Model.md)(模型)是 [stateless](./Stateless.md) 的,所以每个请求重发整个对话——[system prompt](./System%20prompt.md)、每条消息、每条 [tool result](./Tool%20result.md)——作为 input tokens。到第五十个 turn,每个请求携带五十个 turn 的历史,而且每一次你都要为它按全价付清。缓存改变了算术:供应商在完全一致的前缀里已经处理过的 token,按 cache tokens 计费,常常是 input 费率的十分之一或更低。长 session 上,你发送的大部分都是 cache tokens,账单才保持体面。

一个例子,说明 token 何时被缓存、何时没有。每个字母代表一段对话内容;每个请求发送到目前为止的对话:

| 请求发送 | 被缓存 | 按全价计费 | 原因                                     |
| -------- | ------ | ---------- | ---------------------------------------- |
| `AB`     | 无     | `AB`       | 第一个请求——没有可匹配的                 |
| `ABC`    | `AB`   | `C`        | `AB` 是上一个请求的精确前缀              |
| `ABCD`   | `ABC`  | `D`        | 前缀仍然完好                             |
| `AXCD`   | `A`    | `XCD`      | 一次编辑把 `B` 变成了 `X`;匹配在那里失败 |

缓存以一种特定的方式脆弱:它匹配精确前缀。只要对话中更早的地方有任何变化——[harness](./Harness.md)(宿主环境)重排了内容、一个时间戳更新了、一个文件的表示变了——缓存从那一点起 miss,其后的一切都按全价 input 计费。缓存也在几分钟不活动后过期,所以长暂停后恢复的 session 会把历史重付一次。当 session 的成本无缘无故跳高,在用量报告里对比 cache tokens 和 input tokens——坏掉的缓存最先在那里现形。

_Usage:_

"长 session 的成本太凶残了——一次 refactor 花了八刀。"

"查 cache tokens。如果 harness 在 turn 之间重排 system prompt 或文件,前缀就断了,你每个请求都重付全价 input。"
