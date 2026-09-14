---
description: "模型周围把模型变成 agent 的一切:工具、系统提示、上下文窗口管理、权限、钩子。"
---

[model](./Model.md)(模型)周围把模型变成 [agent](./Agent.md)(智能体)的一切:[tool](./Tool.md)(工具)、[system prompt](./System%20prompt.md)(系统提示)、[context window 管理](./Context%20window.md)、权限、hooks。**Claude.ai** 和 **Claude Code** 跑同一个模型,行为却不同,因为 harness 不同。

模型本身只做一件事:文本进,文本出。它不能读文件、跑命令、记住上一个 [turn](./Turn.md)。harness 供给这一切。它为每个 [model provider request](./Model%20provider%20request.md)(模型供应商请求)组装 [context](./Context.md)(上下文),执行模型要求的 [tool call](./Tool%20call.md)(工具调用),把 [tool result](./Tool%20result.md)(工具结果)回填进去,保存 [session](./Session.md)(会话)历史,在冒险动作前向你请求许可,并决定何时 [compact](./Compaction.md)。agent 循环——模型提议,harness 执行,重复——是 harness 在跑。

这对诊断很重要。两个产品之间、或昨天与今天之间行为不同,变量常常不是模型——是 harness。不同的 system prompt、不同的工具集、改过的权限默认值、新的 context 管理策略,都会在不碰模型的情况下改变行为。这也意味着 harness 是你大部分配置的所在:[AGENTS.md](./AGENTS.md.md) 文件、权限设置、hooks,全都是给 harness 的指令,不是给模型的。

例子:Claude Code、Cursor、Codex CLI——以及 Claude.ai,它是聊天 harness,不是编程 harness。

_Usage:_

"同一个模型,为什么 Claude Code 能改文件,Claude.ai 只会回答问题?"

"harness 不同——Claude Code 有 [filesystem](./Filesystem.md)(文件系统)工具、不同的 system prompt 和权限层。这里的变量不是模型。"
