---
description: 模型从训练中获得、存在参数里的知识。在训练时冻结。与上下文知识相对。
---

[model](./Model.md)(模型)从 [training](./Training.md)(训练)中"知道"的东西,存在它的 [parameters](./Parameters.md)(参数)里。在训练时冻结——模型看不到自己的参数,也无法更新它。细节在挤压中丢失:数十亿条事实塞进固定数量的参数,罕见的那些变模糊了。它是模型对常见话题的流利之源,也是对罕见话题的编造之源。与 [contextual knowledge](./Contextual%20knowledge.md)(上下文知识)相对。

parametric knowledge 不是以事实的形式存储的。训练从没给过模型一个可以查东西的数据库;训练只是调整参数,直到模型擅长预测文本,而一个擅长预测某话题文本的模型,表现得就像知道这个话题。知识有多可靠,取决于它在训练数据里出现了多少:一个有数百万样本的话题被准确复现;只有零星样本的话题,模型按"类似话题长什么样"来猜。复现和猜测,对模型是同一个过程,它分不清自己正在做哪一件。编造的答案和正确的答案以同样的流利度到来。[hallucination](./Hallucination.md)(幻觉)就是模型猜错了。

parametric knowledge 还会过时。参数在 [knowledge cutoff](./Knowledge%20cutoff.md)(知识截止)处停止变化,所以那之后发布或改名的库在参数里不存在,变过的 API 记着的还是旧样子。

两个缺口——太罕见和太新——修法是同一个:知识没法加进参数,只能作为 contextual knowledge 补进来。

_Usage:_

"它写 React 完美无瑕,却给我们的内部 SDK 编造方法。"

"React 在 parametric knowledge 里很密——数百万条训练样本。你的 SDK 不是,所以模型按'长得像的样子'补。把 SDK 文档装进 [context](./Context.md)(上下文)。"
