---
description: 把外部工具服务器插进 harness 的协议——agent 由此获得 harness 之外的工具。
---

**Model Context Protocol(模型上下文协议)。**把外部 tool 服务器插进 [harness](./Harness.md)(宿主环境)的协议——[agent](./Agent.md)(智能体)由此获得 harness 自带之外的工具。agent 从不"调用 MCP";它调用一个 [tool](./Tool.md)(工具),只是 harness 恰好是从某个 MCP 服务器拿到的这个 tool。协议也暴露 resources(只读数据)和 prompts(可复用模板),但提供工具是主要用途。

这个协议解决的是集成问题。没有标准时,每个 harness 都得自己做一遍 Linear 集成、自己的 Slack 集成、自己的数据库集成——各自编写和维护。有了 MCP,集成只需写一次,成为服务器,任何兼容 MCP 的 harness 都能用。harness 连上服务器,服务器宣告自己提供哪些工具,这些工具就与内置工具并列,对 agent 可用。

代价记在 [context](./Context.md)(上下文)上。服务器宣告的每个工具都以定义的形式到达——名字、描述、参数 schema——而 [model](./Model.md)(模型)只能调用它知道存在的工具。朴素做法是启动时把所有定义装进 [context window](./Context%20window.md)(上下文窗口):装几个慷慨的服务器,一个 [session](./Session.md)(会话)在你输入任何东西之前,就以几千 [token](./Token.md)(词元)的工具 schema 开局,把 [attention budget](./Attention%20budget.md)(注意力预算)花在任务永远不会用的工具上。

许多 harness 现在用 tool search 缓解这一点:context 里只放一个指向可用工具的 [context pointer](./Context%20pointer.md)(上下文指针)——agent 按名字或用途搜索工具,需要时才装载它的定义。如果你的 harness 不这么做,前置成本照付,那就值得只启用项目真正用得上的服务器。

_Usage:_

"agent 需要读 Linear 上的工单。"

"给 harness 配上 Linear 的 MCP 服务器——它把 Linear API 暴露成 agent 可调用的工具。省得你自己写定制工具包装。"
