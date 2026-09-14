---
description: 每个 token 可分配给上下文其余部分的影响力是有限的。按 token 计,不随上下文变大而变多。
---

每个 [token](./Token.md)(词元)可分配给 [context](./Context.md)(上下文)其余部分的影响力是有限的。对[某一段关系](./Attention%20relationship.md)影响重了,留给其他关系的就少了。这个预算按 token 计,不随 context 变大而变多——这就是为什么长 [session](./Session.md)(会话)会稀释一切。

把它想成信号和噪音。你的指令是一段固定音量的信号;[context window](./Context%20window.md) 里的其他每个 token 都是 competing sound(抢耳朵的声音)。指令不会变小声——它还在那儿,一个字符不少——但 context 越长,房间越吵,信噪比越低。在 10k token 的 context 里最响亮的指令,到 150k 时成了背景嗡嗡声。这就是 [attention degradation](./Attention%20degradation.md) 背后的机制:模型没有忘记;信号淹没在噪音里了。

症状读起来像不服从——agent 早先答应过的约束后来慢慢漂走,重新贴一遍约束也只管一小会儿。原因不在指令;在窗口里所有和它抢注意力的其他东西。

你能控制的是放进 context 的东西。不服务任务的内容不是中性的——它是盖在所有有用内容上的噪音。让窗口保持小,[clear](./Clearing.md)(清空)当累积的 context 开始入不敷出的时候,重要的约束要重申,别指望开头提一嘴能管到最后。

_Usage:_

"为什么它一直无视我贴在最上面的 schema?"

"我们早就进了 [dumb zone](./Smart%20zone.md)——每个 token 的 attention budget 是固定的,context 却一直在涨。schema 上的信号,现在在和几千个更新的 token 抢注意力。"
