---
description: 装上工具、系统提示和上下文窗口、与用户轮流对话的模型。动起来的模型。
---

一个 [model](./Model.md)(模型),被 [harness](./Harness.md)(宿主环境)装上 [tool](./Tool.md)(工具)、[system prompt](./System%20prompt.md)(系统提示)和 [context window](./Context%20window.md)(上下文窗口),与用户一来一回地过 [turn](./Turn.md)(轮次)。_Claude Code 是一个 agent。Cursor 是一个 agent。Claude.ai 也是。_ agent 是你实际对话的对象——它是动起来的模型,为某个目的配置好。

这本词典里的大多数术语都指一个机械部件,"agent"不是。模型是一份 [parameters](./Parameters.md)(参数);harness 是你指得出来的软件。agent 两者都不是——它是"你说话的对象"这个单位。人们不断地把 [AI](./AI.md) 拟人化,agent 就是被拟人化的那个单位:你委派任务给的东西,读你的消息并回答的东西,"它又把构建搞砸了"里的那个"它"。当你说 agent 做了某事,你的意思是"模型加 harness"做了它,但你是把这个组合当作单一行动者来称呼的。

这个想法比这一波 AI 更老。software agent——你把一个目标委派给它、它代你行动的程序——和 AI 这个词一样老。

_避免:_ "the AI"、"the bot"(太含混——分不清你指的是参数,还是装配起来的那个东西)。

_Usage:_

"迁移用哪个 agent?"

"本地用 Claude Code,UI 的活用 Cursor——底下同一个模型,harness 不同。"
