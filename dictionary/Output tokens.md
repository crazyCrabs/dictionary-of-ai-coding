---
description: 模型生成回来的 token。计费费率高于输入 token,因为产出的算力成本更高。
---

[model](./Model.md)(模型)生成回来的 [token](./Token.md)(词元)。计费费率高于 [input tokens](./Input%20tokens.md)(输入 token)——常见的大约五倍——因为产出的算力成本更高。

模型写出的一切都算:你读到的文字、它产出的代码、[tool call](./Tool%20call.md)(工具调用),以及模型回答前的 extended thinking(扩展思考)。最后一项让人意外——reasoning token 按 output 计费,哪怕 [harness](./Harness.md)(宿主环境)常常不把它们显示给你,而调高 [effort](./Effort.md) 花掉的正是它们。

output tokens 还决定 [session](./Session.md)(会话)的节奏。模型读输入很快,但生成输出一次一个 token,所以当一个 [turn](./Turn.md)(轮次)感觉慢,几乎总是在写出的输出,而不是在读入的输入。等待很长,通常意味着一个长答案在路上。

_Usage:_

"refactor session 明明输入不大,credit 却在狂烧。"

"agent 在整文件重写,而不是打补丁。output token 的费率大约是 input 的五倍——让它改成产出增量编辑,账单就下来了。"
