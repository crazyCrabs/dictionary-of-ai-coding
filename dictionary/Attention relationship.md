---
description: 两个 token 之间的配对——有意义的配对比无关的配对相互影响更强。N 个 token 的上下文约有 N² 个这种关系。
---

[模型](./Model.md)在预测每个 [token](./Token.md)(词元)时,会把 [context](./Context.md)(上下文)里的其他每个 token 都纳入考量——有些权重很重,有些几乎为零。两个 token 之间的配对就是一个 **attention relationship**(注意力关系),而有意义的配对("her"与"Sarah"、一次 `getUser()` 调用与它的 `function getUser` 定义)相互影响强于无关的配对。N 个 token 的 context,有约 N² 量级的配对关系。

模型的表面"理解力"就住在这些配对里。它解对一个代词,是因为"her"与"Sarah"之间的 attention relationship 强;它用对参数调用了一个函数,是调用点与它早前读过的定义之间的关系在起作用。这些都不是查出来的——而是在每次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)上、对每一对新鲜算出来的。

N² 这个数字值得停下来感受一下,因为它增长得比直觉快:

| Context 大小  | 配对数(约 N²) |
| ------------- | ------------- |
| 1,000 token   | 约 100 万     |
| 10,000 token  | 约 1 亿       |
| 100,000 token | 约 100 亿     |

而且每个配对还被计算不止一次。模型有多个 attention head(注意力头)——前沿模型的确切数字未公开,五到一百是合理的猜测——每个 head 都独立计算所有关系。上表里的每个配对,都要在每个 head 上再重复一遍。这是很大量的配对。

对任何一个给定任务,这些关系里只有少数是重要的。你的指令和它所约束的代码之间的配对,是屈指可数的有用配对之一;池子里几乎所有其他东西都是噪音。而且两者增长速度不同:重要的关系大致保持恒定,总池子随 context 大小二次方增长。1,000 token 时,你在乎的配对是百万分之一;100,000 token 时,是百亿分之一。这就是 [attention budget](./Attention%20budget.md)(注意力预算)底下的算术,而 [attention degradation](./Attention%20degradation.md) 就是重要关系的份额被摊得太薄时的体感。

_Usage:_

"它一直在 diff 里混淆两个 `user` 符号——听着像我们进 [dumb zone](./Smart%20zone.md) 了。"

"对,每个调用点和它的声明之间的 attention relationship 在和另一对打架——token 形状相同,绑定不同。重命名一个,配对就清晰了。"
