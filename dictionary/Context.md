---
description: agent 当下能获得的相关信息——agent 知道的、与任务有关的那部分。
---

[agent](./Agent.md)(智能体)当下能获得的相关信息。这是个抽象名词——不是模型看到的原始输入(那是 [context window](./Context%20window.md)(上下文窗口)),不是滚动的历史(那是 [session](./Session.md)(会话)),而是 _agent 知道的、与任务有关的那部分_。"把某个东西装进 context",意思是让它成为这个集合的一部分;"context engineering(上下文工程)"就是经营这个集合的学问。

三个术语可以干净地分开:

| 术语           | 指的是什么                                                |
| -------------- | --------------------------------------------------------- |
| Context        | agent 当下拥有的、与任务相关的信息                        |
| Context window | 模型每次请求看到的、字面意义上的 [token](./Token.md) 序列 |
| Session        | [harness](./Harness.md)(宿主环境)保存的滚动对话           |

这个区分重要,因为 context 衡量的是质量,不是数量。context window 可以几乎填满,而 context 依然贫瘠——几千 token 的过期 tool output,没有一条与手头任务相关。它也可以几乎全空,而 context 极佳:一条任务成败所系的类型定义。

大多数日常失败都能追到 context。当 agent 编造 API、违背既定决定、或瞎猜 schema,第一个问题是它做这件事时 context 里有什么——通常是要紧的事实从未被装进去,或者被埋在 [attention degradation](./Attention%20degradation.md) 之下。修法是经营:装任务需要的,挡住不需要的。

_Usage:_

"它一直在编造类型里不存在的字段。"

"类型文件不在 context 里——它在读调用点然后猜。先把定义读进去。"
