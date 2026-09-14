---
description: "把权限模式和注入系统提示的行为指令打包在一起的预设。可以在会话中途切换。"
aliases:
  - plan mode
  - accept-edits
  - bypass permissions
  - YOLO mode
---

一个预设,塑造 [agent](./Agent.md)(智能体)运行时的工作方式——把一个 [permission mode](./Permission%20mode.md) 与注入 [system prompt](./System%20prompt.md)(系统提示)的行为指令捆绑在一起。例子:默认档,危险调用先问;**plan mode**,阻止编辑并把 agent 导向调研;**accept-edits** 档,自动批准编辑;**bypass permissions** 档(俗称 **YOLO mode**),一切自动批准。可以在 [session](./Session.md)(会话)中途切换。

"捆绑"正是 mode 与裸权限设置的区别所在。permission mode 只是一道路障:它决定哪些 [tool call](./Tool%20call.md)(工具调用)能通过。单有一道路障,产出的是一个想编辑但被拦住的 agent——它提交写入请求,被拦下,再试别的路。注入的指令移除的是"想":plan mode 不只是阻止编辑,它告诉 agent 自己处在规划阶段,于是它读、问、提方案,而不是顶着路障较劲。闸门和牵引指向同一个方向。

实践中,你随任务推进中信任度的变化切换 mode。同一个任务可以经过好几档:方案还在成形时用 plan mode,头几处精细编辑用先问的默认档,agent 证明它理解了改动之后用 accept-edits,[sandbox](./Sandbox.md) 里的 [AFK](./AFK.md) 运行用 bypass。切换 mode 不付代价:对话原地继续,只是换了权限和指令。如果你发现自己不看内容就一路批准,说明 mode 设得比你实际的信任更紧;如果你总在拒绝编辑,说明设松了。

_厂商措辞:_ Claude Code 管这些叫 "permission modes",Codex 管它们叫 "approval modes"——都早于行为捆绑的出现。

_Usage:_

"我只想要个方案,它却一个劲改文件。"

"切到 plan mode——它会挡住写入,留在调研里。"

"那待会儿的 AFK run 呢?"

"用 bypass mode,但只在 sandbox 里面。"
