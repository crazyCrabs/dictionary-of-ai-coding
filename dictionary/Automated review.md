---
description: "一个 agent 审查另一个 agent 的工作,常用不同的模型或系统提示。非确定性:它做出判断。"
---

一个 [agent](./Agent.md)(智能体)审查另一个 agent 的工作,常用不同的 [model](./Model.md)(模型)或 [system prompt](./System%20prompt.md)(系统提示)。非确定性:它做出判断。跑在哪都行——PR 合并前、提交历史上做事后审查、或 [session](./Session.md) 中途作为一个 [subagent](./Subagent.md)(子代理)。CI 里的 LLM-as-judge 是 automated review(自动审查),不是 [automated check](./Automated%20check.md);决定类别的是断言*做什么*,不是它在哪儿跑。

与干活的 agent 分离,正是它有效的原因。让写代码的 agent 审自己的作品,收获很小——产生 bug 的那个 [session](./Session.md) 同时也装着产生 bug 的推理过程,agent 会把自己的结论读回来当确认。一个 [context window](./Context%20window.md) 全新的审查者没有这种黏连:它像陌生人一样看这个 diff,而审查依赖的正是陌生人的眼睛。换一个模型,或用一个专司审查的 system prompt,能进一步锐化这一点——盲区不同,而且 system prompt 可以只 scope 在你真正在乎的事(安全、API 契约、性能),而不是一句含混的"找找问题"。

它在其他审查层之间落位。Automated check 是确定性的,抓得住机械断言的东西;[human review](./Human%20review.md)(人工审查)最贵、扩展性最差。Automated review 居中:它以机器的成本,抓住判断形状的问题——一个误导性的函数名、一个漏掉的边界情况。因为它是非确定性的,它会漏、也会误报;把它当作人类接手前抬高底线的过滤器,而不是取代人的闸门。

_避免:_ "AI review" / "agent review"——太含混,没法和干活的 agent 本身区分。

_Usage:_

"AFK run 交上来的坏 PR 太多了。"

"在合并前加一道 automated review——换个模型,单独的 system prompt,scope 在安全和契约变更上。"
