---
description: 在环境里运行的确定性验证——测试、类型检查、lint、构建、pre-commit 钩子。过/不过,不做判断。
---

在 [environment](./Environment.md)(环境)里运行的确定性验证——测试、类型检查、lint、构建、pre-commit 钩子。过/不过,不做判断。这是 [agent](./Agent.md)(智能体)不需要任何人参与就能自我纠正的信号。flaky test(不稳定的测试)是坏掉的 check,不是"没有 check";automated check(自动检查)在设计上就是确定性的。

自我纠正以循环的方式工作。agent 做一个改动,把 check 当作一次 [tool call](./Tool%20call.md)(工具调用)来跑,失败输出落进它的 [context window](./Context%20window.md)——一条带文件和行号的类型错误,一条带期望值和实际值的断言失败。这足够它修好问题再跑一遍 check,如此往复直到通过,全程无需人参与。确定性是让这个循环可信的东西:同样的代码永远得到同样的判决,通过才有意义。一个 flaky 的 check 会毒化这一切——agent 去"修"没问题的代码,或在真失败上无限重试。

这就是为什么好的 check 是代码库 [AX](./AX.md) 的很大一部分。一个有严格类型、快速测试套件和 linter 的仓库里,agent 在你看到之前就抓住了自己大部分错误;一样都没有的仓库里,agent 产出什么就交什么。差别在 [AFK](./AFK.md) 运行中最大——那是整个运行期间唯一的验证。但 check 只抓它断言的东西——绿灯意味着被断言的性质成立,不意味着代码是对的。判断形状的空隙,留给 [automated review](./Automated%20review.md)(自动审查)和 [human review](./Human%20review.md)(人工审查)。

_避免:_ "feedback loop" / "backpressure"——两者都把 check 和 review 混为一谈。_避免:_ "test"——测试是 automated check,但不是所有 automated check 都是测试。

_Usage:_

"AFK run 里 agent 一直交坏代码。"

"[sandbox](./Sandbox.md) 里接了哪些 automated check?"

"只有单元测试。"

"加上 typecheck 和 lint——PR 落地之前它就能靠这些自我纠正了。"
