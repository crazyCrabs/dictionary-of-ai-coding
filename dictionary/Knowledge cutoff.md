---
description: 模型参数化知识止步的日期。截止之后的库和 API 是编造陷阱,除非装载了文档。
---

[model](./Model.md)(模型)的 [parametric knowledge](./Parametric%20knowledge.md)(参数化知识)止步的日期。截止之后的库、API 和事件都是编造陷阱,除非它们的文档被作为 [contextual knowledge](./Contextual%20knowledge.md)(上下文知识)装载。每次模型发布都带着自己的截止日期。

截止日期存在,是因为模型的制造方式:[training](./Training.md)(训练)把一份文本快照烤进模型的 [parameters](./Parameters.md)(参数),此后参数冻结。模型不知道自己的知识有边界——被问到截止日期之后的东西,它不会拒绝回答,而是从最接近的已知内容向外推。这就是陷阱无声的原因:对着旧版本库写的代码看起来可行,常常还能编译通过,只在变过的那些部分上失败。

修法永远一样:把当下的信息装进 [context](./Context.md)(上下文)。装载 changelog,指向已安装版本的类型定义,或让 agent 上网读文档。context 里的任何东西,都胜过参数里的空白。

_Usage:_

"它一直写 v3 SDK 的语法——我们用的是 v5。"

"v5 发布在 knowledge cutoff 之后。把 v5 的 changelog 作为 contextual knowledge 装进去,否则它会继续从旧版本的 parametric knowledge 里编造。"
