---
description: 一种工作模式:用户启动一个会话,然后离开,让 agent 无人值守地跑(away from keyboard)。
aliases:
  - away from keyboard
  - AFK (away from keyboard)
---

Away from keyboard(离开键盘)。一种工作模式:用户启动一个 [session](./Session.md)(会话),然后走开,让 [agent](./Agent.md)(智能体)无人值守地跑。[AI](./AI.md) 编程的吞吐量倍增器——你睡觉、吃饭、干别的事情时,许多 AFK session 可以并行跑。通常需要宽松的 [permission mode](./Permission%20mode.md) 加上 [sandbox](./Sandbox.md) 才安全。

你不在的时候,agent 处理含混的方式不一样。你在看着时,一个含混的决定会以提问的形式浮出来,你来回答;你走开之后,agent 自己挑一个默认值继续走,之后的每个决定都建立在那次猜测上。典型的失败是:回来看到几小时成果满满、自信满满的工作,建立在头十分钟一个错误的决定上。工作并不马虎——它自洽,只是对错误的事情自洽。

既然运行中没法给输入,就把输入放在运行之前和之后。之前:提前消解含混——来一场 [grilling](./Grilling.md),或写一份 [spec](./Spec.md)——让 agent 要独自填补的空隙更少。期间:[automated check](./Automated%20check.md) 和 [automated review](./Automated%20review.md)(自动审查)顶替你缺席的注意力,凡是能机械捕捉的,让它尽快失败。之后:运行要结束在可审查的东西上——一个 PR,而不是已经合并的改动。AFK 并没有取消 [human review](./Human%20review.md)(人工审查);它把全部审查推迟到结尾,所以结尾到达的东西必须值得审查。这也是 [AX](./AX.md) 在 AFK 运行中最要紧的原因——没人看着,environment 是 agent 得到的唯一支持。

_避免:_ "background agent"——它把重心放在机器上("在后台运行"),而不是人的模式("人走开了")。AFK 点名的那件要紧事是:用户没在看。

_Usage:_

"这个我要 AFK 跑——三个 sandbox 里的 agent 做重构,早上起来审 PR。"

"[Bypass permissions](./Agent%20mode.md)?"

"对,只读 [filesystem](./Filesystem.md),断网。"
