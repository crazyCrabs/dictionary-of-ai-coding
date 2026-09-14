---
description: "session 早期 agent 锐利专注。session 变长后漂入 dumb zone:更马虎、更健忘、错误更多。"
aliases:
  - Dumb zone
  - Smart zone / Dumb zone
---

[session](./Session.md)(会话)早期,[agent](./Agent.md)(智能体)处在 smart zone——锐利、专注、回忆良好。session 变长后,它漂进 dumb zone:更马虎、更健忘、错误更多——faithfulness 类的 [hallucination](./Hallucination.md)(幻觉)也更多。同一个 [model](./Model.md),同一个 [harness](./Harness.md)——只是 [context](./Context.md) 更多。[attention degradation](./Attention%20degradation.md) 的体感效果。在前沿模型上,dumb zone 常见于大约 125K–150K [token](./Token.md) 处开始——这一点尚有争议。session 膨胀时就 [clear](./Clearing.md)(清空)或 [compact](./Compaction.md)(压实);别硬撑。

下滑是渐变的,这让它容易不被察觉。没有错误信息,没有可见的边界;agent 只是开始表现得稍微差一点,然后明显差一截。常见信号:它忘记你二十个 turn 之前给的指令,重复一个它已经纠正过的错误,或自信地断言 context 明明与之矛盾的东西。因为滑落是平滑的,常见的反应是硬撑着重加解释——这只会增加 context,让问题更糟。

zone 的分界不跟着 [context window](./Context%20window.md) 的上限走。一个 session 可以深陷 dumb zone 而窗口还大半空着:上限是 harness 拒绝继续的地方,但质量早在此之前就开始掉。按 smart zone 规划,别按窗口规划——一个任务的务实预算,是 agent 表现良好的那段 token 数,不是它技术上装得下的 token 数。

smart zone 是一笔预算,无关的工作也在花它。session 里做的每个任务都消耗 token,所以在同一个 session 里开第二个任务,意味着起点离 dumb zone 更近。一个 session 一个任务,让每个任务都拿到 session 最锐利的那段。单个任务大于一个 smart zone 时,拆分它:在自然的边界处 [hand off](./Handoff.md)(交接)或 compact,让一个新 session 做下一块。

_Usage:_

"前三个组件它都拿捏了,第四个就砸了。"

"你已经出了 smart zone——同一个模型,只是现在深陷 dumb zone。compact 后重新装载方案,下一个组件就能落好。"
