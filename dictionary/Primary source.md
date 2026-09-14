---
description: 事物本身——代码、对话记录、原始数据。完整且权威,但装进上下文的代价高。
---

以其本来面目存在的真相来源——代码、对话记录、原始日志、真实的 API 响应。不是对事物的转述;就是事物本身。与 [secondary source](./Secondary%20source.md)(二手来源)相对。

想知道你的代码库做什么,代码就是 primary source(一手来源)。文档、架构图、README,都是对它的描述——落笔时准确,此后各自按自己的时间表过时。当 [agent](./Agent.md)(智能体)自信满满地说错你项目的某件事,要问的问题是:它是从哪个来源出发的——读了文档的 agent 继承了文档的陈旧;读了代码的 agent 读的是当下的真相。

代价是 primary source 没能成为默认选项的原因。把它装进 [context window](./Context%20window.md) 很贵——整个文件、整段记录、每个 [token](./Token.md)(词元)都按 [input tokens](./Input%20tokens.md)(输入 token)计费、都在竞争 [attention budget](./Attention%20budget.md)(注意力预算)。这份价钱换到的是完整性:没有经过别人对"什么重要"的预筛选。上个月写的摘要,装不下今天才发现重要的那个细节;primary source 还装得下。

精度要紧的时候——确切的签名、真实的报错、抛异常的那一行——就动用 primary source。管理 [context](./Context.md)(上下文)的大部分功夫,就是决定什么时候为 primary source 付钱、什么时候 secondary source 够用。

_Usage:_

"agent 说重试逻辑是指数退避,可我眼看着它在猛打那个端点。"

"那是它从设计文档里读来的。让它指向真正的重试模块——行为要紧时,从 primary source 出发。"
