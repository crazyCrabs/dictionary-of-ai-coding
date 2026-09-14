---
description: agent 读写和执行所在的文件与目录树——编程 agent 的默认环境。
---

[agent](./Agent.md)(智能体)读、写和执行所在的文件与目录树——编程 agent 默认的 [environment](./Environment.md)(环境)。[AGENTS.md](./AGENTS.md.md)、[skill](./Skill.md)、源代码、构建脚本和 [tool](./Tool.md)(工具)配置都住在 filesystem 里。当一个 [harness](./Harness.md)(宿主环境)"在你的项目里启动",指的就是把 agent 指向一个 filesystem。

agent 只通过 [tool call](./Tool%20call.md)(工具调用)接触它——读文件、写文件、跑 shell 命令。磁盘上的任何东西在被 tool call 装载之前,都不在 [context window](./Context%20window.md) 里;正因如此,agent 才能在一个远大于窗口的仓库里工作:filesystem 装着一切,context 只装当前任务读过的部分。一些 harness 默认把当前目录的文件名——不是内容,只是目录树——装进 context window,它们起的是 [context pointer](./Context%20pointer.md)(上下文指针)的作用:agent 看到有什么存在,再去读需要的文件。

它还和你共享。agent 编辑的文件,就是你在编辑器里打开、在 git 里 diff 的同一批——filesystem 是你审查 agent 所作所为的公共工作场地。

_Usage:_

"为什么它不读我的 AGENTS.md?"

"它挂在另一个 filesystem 上——[sandbox](./Sandbox.md) 挂载了父目录,不是项目根目录。重新指一下 harness。"
