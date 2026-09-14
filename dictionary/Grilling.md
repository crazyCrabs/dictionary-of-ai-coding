---
description: 发展设计概念的技术:agent 以苏格拉底式访谈用户,一次只敲定一个决定。
---

与 [agent](./Agent.md)(智能体)一起发展 [design concept](./Design%20concept.md)(设计概念)的技术:agent 以苏格拉底式访谈用户,一次只敲定一个决定,并且每个决定都附一个推荐答案。它拖住冲向"成品方案"的脚步——在概念稳定之前,不写任何 [handoff artifact](./Handoff%20artifact.md)(交接产物)。

这项技术存在,是因为 agent 会无声地填空。拿着两行提示被要求写一份 [spec](./Spec.md) 时,agent 不会停在你还没做的决定上——它挑好默认值,直接写进去。成果看起来很完整,猜测和选择难以区分,于是你发现得很晚:在审查时,或者在建好的功能以你从没选过的方式处理一个边界情况时。grilling(拷问式访谈)把它倒过来——agent 不猜,它问。

这是 [human-in-the-loop](./Human-in-the-loop.md)(人在回路)的技术:你的回答就是输入。当一个问题在对话里答不了——你必须亲眼看到那个东西——就切换到 [prototyping](./Prototyping.md)。

_Usage:_

"它直接去写 spec,把取消逻辑搞错了。"

"先 grill 它——让它问你部分取消、退款、时序的事,再允许它往文档里写任何东西。在对话里解决,比在代码里解决便宜。"
