---
description: 模型在每次模型供应商请求中看到的一切。有限、因模型而异,是模型感知外界的唯一表面。
---

[model](./Model.md)(模型)在每次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)中看到的一切。有限、因模型而异,而且是模型感知外界的唯一表面。

它是单一的一条 [token](./Token.md) 序列:[system prompt](./System%20prompt.md)(系统提示)、到目前为止的对话,以及 [harness](./Harness.md)(宿主环境)反馈进来的每一条 [tool result](./Tool%20result.md)(工具结果)。在序列里的东西,model 就能用;不在序列里的,model 不知道它存在——你的代码库、你昨天改过的文件、你三个 session 之前给的指令,都是如此。窗口外的任何东西,都得先被带进来——通常通过一次 [tool call](./Tool%20call.md)——才能产生影响。

有限意味着它会被填满。每个 [turn](./Turn.md) 都在追加内容——你的消息、model 的回答、tool result——一个长 [session](./Session.md) 终会撞上限,被迫 [compaction](./Compaction.md)(压实)或 [clearing](./Clearing.md)(清空)。有限也意味着窗口里的一切在竞争:你装入的每个 token,都是其余内容少掉的一个;你不需要的内容,照样占据着 model 的 [attention](./Attention%20budget.md)(注意力)。务实的姿态是把窗口当成预算——装任务需要的,其余留在窗外。

_避免:_ 把它叫作"memory"。context window 是工作状态,不跨 session 存续。[Memory](./Memory%20system.md)(记忆系统)是叠加在其上的另一个概念。

_Usage:_

"我能把整个 monorepo 直接粘进提示里吗?"

"context window 是 200k token,大概只够仓库的五分之一。挑出任务会碰的文件,其余的留在 tool call 后面。"
