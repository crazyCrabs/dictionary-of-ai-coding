---
description: harness 到模型供应商之间的一次往返。harness 发送上下文;供应商返回一个响应。
---

从 [harness](./Harness.md)(宿主环境)到 [model provider](./Model%20provider.md)(模型供应商)的一次往返。harness 发送当前 [context](./Context.md)(上下文);provider 返回一个响应(一次 [tool call](./Tool%20call.md)(工具调用)或最终答案)。一条用户消息可以催生很多次 model provider request——如果 [agent](./Agent.md)(智能体)调用 [tool](./Tool.md),每条 [tool result](./Tool%20result.md) 都触发下一次请求。

每个请求携带全部:[system prompt](./System%20prompt.md)(系统提示)、到目前为止的完整对话、每条 tool result。[model](./Model.md) 是 [stateless](./Stateless.md)(无状态)的,所以 provider 在请求之间不保存任何东西——第四十个请求,把第三十九个发过的全部重发,再加一条 tool result。[prefix cache](./Prefix%20cache.md)(前缀缓存)就是为了让这种重复变得付得起。

request 也是计费单位。[input tokens](./Input%20tokens.md)(输入 token)、[output tokens](./Output%20tokens.md)(输出 token)、缓存折扣,全按请求计——这就是一个看起来无害的问题能花掉惊人金额的原因:成本不正比于你的消息,而正比于请求次数乘以每个请求携带的 context 大小。

值得把 request 和 [turn](./Turn.md)(轮次)区分开。turn 是与你的一次交流,而一个 turn——"把失败的测试修好"——会展开成一条请求链:

| 请求 | 模型返回                   | harness 随后        |
| ---- | -------------------------- | ------------------- |
| 1    | Tool call:跑测试           | 跑测试,追加失败输出 |
| 2    | Tool call:读测试文件       | 追加文件内容        |
| 3    | Tool call:读源文件         | 追加文件内容        |
| 4    | Tool call:编辑源文件       | 应用编辑,追加结果   |
| 5    | Tool call:再跑测试         | 跑测试,追加通过输出 |
| 6    | 最终答案:"修好了,测试通过" | 展示给你            |

一个 turn 六次请求——每次都重发整个 context。当你纳闷 [token](./Token.md) 都去哪了,数请求,别数 turn。

_Usage:_

"一个问题烧掉了四万 token?"

"看 tool call——十二次 grep、八次 read、四次 edit。每条 tool result 都催生下一次 model provider request,而整个 [session](./Session.md)(会话)前缀每次都重发。"
