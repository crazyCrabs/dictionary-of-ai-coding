---
description: 模型读写的原子单位。大约一个词大小,但不精确。上下文窗口大小、成本和延迟都按 token 计。
---

[model](./Model.md)(模型)读写的原子单位。大约一个词大小,但不精确——常见词是一个 token,罕见或长的词拆成几个。[context window](./Context%20window.md)(上下文窗口)大小、成本和延迟都以 token 计。

文本经过 tokenizer(分词器)变成 token:一个几万条片段的固定词表,在 [training](./Training.md)(训练)之前学得,把任何输入切成一串词表条目。模型从不看到字符或词——每段文本进模型前都被转成 token,[next-token prediction](./Next-token%20prediction.md)(下一词元预测)在出口一次一个 token 地产出。

经验法则:一个 token 约等于四分之三个英文词,所以一千 token 大约 750 词。代码更不可预测:常见关键字和习语切得很紧凑,而生成的标识符、哈希、base64 块和压缩产物,每个"词"要拆成很多 token。规律是:在 tokenizer 的原料里出现频繁的文本,得到又短又高效的编码;没出现过的被剁成很多小块。像 `a3f9c2e1` 这样的哈希从没在任何地方出现过,所以拆成很多 token,而 `function` 是一个。这就是为什么一个看起来很小的文件,装满不寻常的字符串,能占掉上下文窗口里惊人的一块。

token 是其他一切计量所用的单位。成本按 token 计——供应商把 [input tokens](./Input%20tokens.md)(输入 token)和 [output tokens](./Output%20tokens.md)(输出 token)分开计费。速度是每秒 token 数,因为输出一次生成一个 token。而上下文窗口是固定数量的 token,所以你文件的 token 数决定了装得下多少。

_避免:_ 把它叫"word"(词)——token 的边界和词的边界不重合,而且 tokens-per-second / tokens-per-dollar 才是真正有用的单位。

_Usage:_

"这个提示会有多大?"

"丢给 tokenizer 跑一下——schema 很紧凑,但 JSON 键很怪,拆出来的 token 会比你以为的多。"
