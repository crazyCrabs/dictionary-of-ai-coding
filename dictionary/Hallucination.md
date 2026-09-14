---
description: "自信但错误的模型输出。两种:事实性(编造事实)与忠实性(偏离已装载的上下文)。"
---

自信但错误的 [model](./Model.md)(模型)输出。两种类型,成因和修法都不同:

| 类型           | 哪里错了                                                                  | 成因                                                                                                                                     | 修法                                                                       |
| -------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| _Factuality_   | 编造或弄错关于世界的事实——一个不存在的函数、一个错的 API 签名、一条假引用 | [Parametric knowledge](./Parametric%20knowledge.md)(参数化知识)的空白,常发生在 [knowledge cutoff](./Knowledge%20cutoff.md)(知识截止)之后 | 装载正确的 [contextual knowledge](./Contextual%20knowledge.md)(上下文知识) |
| _Faithfulness_ | 输出偏离已装载的 contextual knowledge、用户的指令、或模型自己此前的推理   | [Attention degradation](./Attention%20degradation.md);在 [dumb zone](./Smart%20zone.md) 里加重                                           | [清空](./Clearing.md)或[压实](./Compaction.md)                             |

[next-token prediction](./Next-token%20prediction.md)(下一词元预测)不管底下的事实是否为真,都产出流畅的文本——模型没有任何内部信号告诉它"这个你不知道",所以一个编造的方法,和正确的方法以同样笃定的口吻到来。幻觉代码在构造上就是"貌似可行"的:它就是那个 API *如果存在*该有的样子——这恰恰让它躲过走马观花的 review,直到运行时才失败。

你得分清面对的是哪种类型,因为一种的修法会让另一种更糟。Factuality 是缺知识:修法是加 context——文档、类型定义、那个文件。Faithfulness 是知识在,但在注意力的竞争中输了:修法是减 context。把 faithfulness 误诊成 factuality,你就会再贴更多文档,context 越大,漂移越重。当 agent 出错时,先检查正确的信息是不是本来就在 context 里,再决定你面对的是哪个问题。

_避免:_ 把"hallucination"当"错了"的同义词用——不说出类型,这个词没有诊断价值。

_Usage:_

"它给 schema 编了个 `parseAsync` 方法。"

"factuality 还是 faithfulness?"

"方法在我贴的文档里有——它只是过了四十个 [turn](./Turn.md) 之后就不看文档了。"

"那就是 faithfulness。compact 后重新加载,别再贴文档了。"
