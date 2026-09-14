---
description: agent mode 中负责权限闸门的部分——哪些工具调用触发权限请求,哪些自动运行。
---

[agent mode](./Agent%20mode.md) 中负责权限闸门的部分——哪些 [tool call](./Tool%20call.md)(工具调用)触发 [permission request](./Permission%20request.md)(权限请求)、哪些自动运行。这是 mode 系统最初的目的,早于 [harness](./Harness.md)(宿主环境)们开始往上面捆绑行为指令。

harness 们出厂自带一列这样的 mode:

| Mode               | 读取 | 写入与 shell        | 典型用途                                         |
| ------------------ | ---- | ------------------- | ------------------------------------------------ |
| Read-only / plan   | 自动 | 阻止                | 调研、规划、审查                                 |
| Default            | 自动 | 先问                | 日常有人监督的工作                               |
| Auto-edit          | 自动 | 编辑自动,shell 先问 | 可信仓库、机械性修改                             |
| "Yolo" / full-auto | 自动 | 自动                | [Sandbox](./Sandbox.md) 内、[AFK](./AFK.md) 运行 |

选哪一档,是在安全和打断之间做交易,两头失手的滋味都真实。太紧,你就成了瓶颈:[agent](./Agent.md)(智能体)每隔几秒为无害的读取停下,你不假思索地点批准,批准从此失去意义——橡皮图章是两头的坏处叠加,所有打断照单全收,保护一点没有。太松,agent 就会先斩后奏,改你不该错过的文件、跑你本想先看的命令。

最松的那一档,在 sandbox 里最有理:坏掉的 [tool](./Tool.md) 调用的爆炸半径被限制住了。在 sandbox 之外,大多数人的落点是:读取自动放行,一切不可逆的操作保留 [human in the loop](./Human-in-the-loop.md)。

_Usage:_

"它每次 grep 都暂停——AFK run 彻底废了。"

"把只读 tool 的 permission mode 放松,写入和 shell 保持先问。调研 [session](./Session.md)(会话)上的权限请求,大多数都是噪音。"
