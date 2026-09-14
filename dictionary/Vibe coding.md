---
description: 一种工作模式:用户不做人工审查,直接接受 agent 的代码。diff 被当作不透明的。
---

一种工作模式:用户不做 [human review](./Human%20review.md)(人工审查),直接接受 [agent](./Agent.md)(智能体)的代码。diff 被当作不透明的——要紧的是程序跑不跑得起来,不是里面是什么。[automated review](./Automated%20review.md)(自动审查)和 [automated check](./Automated%20check.md)(自动检查)可能照跑;vibe coding 对两者都不表态。

这个词来自 Andrej Karpathy,他在 2025 年初[造了这个词](https://x.com/karpathy/status/1886192184808149383):你"完全交给感觉"(fully give in to the vibes),并且"忘了代码的存在"——描述你想要的,接受送回来的,靠运行来判断。

vibe coding 用检查换速度。读 diff 通常是 agent 驱动的工作里最慢的一步,砍掉它就砍掉了主要瓶颈。对失败代价低的代码——[原型](./Prototyping.md)、一次性脚本、内部工具——这是一笔合理的交易。风险随代码的寿命和利害而涨。

代价晚点才到。vibe 出来的改动积累成一个没人读过的代码库,而当初唯一检查过的是行为——于是任何行为浮不出来的问题,都 unseen 地上线了:写进日志的密钥、缺失的边界情况、悄悄出错的数据处理。第一次有人调试这个系统,才是第一次有人读这份代码。人工审查退场之后,还在运行的一切自动验证——测试、类型、automated review——就是代码仅存的关卡。

_避免:_ 把"vibe coding"当"低质量 AI 代码"的同义词——这个词命名的是审查姿态,不是产出的代码。

_Usage:_

"它在 auth 流程里改的东西你读了吗?"

"vibe 出来的——登录还能用,我只查了这个。"

"push 之前把 diff 读了,auth 上凭感觉,密钥就是这么漏进日志的。"
