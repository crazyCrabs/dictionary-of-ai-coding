---
description: 一条用户消息,加上 agent 为回应它所做的一切,直到它交还控制权。包含一次或多次供应商请求。
---

一条用户消息,加上 [agent](./Agent.md)(智能体)为回应它所做的一切,直到它把控制权交还给你。包含一次或多次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)——agent 调用 [tool](./Tool.md) 时是很多次。一个澄清提问会闭合当前 turn;你的回复开启下一个。层级是 [session](./Session.md)(会话) **> Turn > Model provider request**。

turn 值得起名,是因为它的长度由 agent 决定,不是你。你交出一条消息;agent 决定交还之前串多少次工具调用。一个 turn 可以是一句话的回答,也可以是二十分钟的读、改、跑测试。这是同一件事的两个面:长 turn 是 [AFK](./AFK.md) 这种工作方式成立的前提;长 turn 也是无人监督时出问题的地方——等 agent 交还时,它可能已经离你的本意很远了。

turn 也是转向(steer)的自然单位。turn 之内的一切都发生在你不在场的时候;turn 之间的间隙,才是你改变方向的地方。大多数 [harness](./Harness.md)(宿主环境)会软化这一点:你可以在 turn 中途打断 agent 并让它改道,或在它干活时输入一条消息,等 turn 结束被读取。如果你反复对 turn 的结局不满意,修法通常是要求更小的 turn——先出方案,一次一步——用自主权换更频繁的、可以插手转向的间隙。

_Usage:_

"一个 turn 花了两分钟?"

"它在这个 turn 里做了十四次 [tool call](./Tool%20call.md)(工具调用)——每次都是独立的 model provider request。延迟层层叠加,最后才交还给你。"
