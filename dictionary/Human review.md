---
description: 用户阅读 agent 产出的代码并对它形成判断。读 diff 算数;读摘要不算。
---

用户阅读 [agent](./Agent.md)(智能体)产出的代码,并对它形成判断。读 diff 或被改动的文件算数;读 agent 对自己所作所为的*描述*不算——叙述不是产物。描述是一份 [secondary source](./Secondary%20source.md)(二手来源),出自被审查的一方;diff 是 [primary source](./Primary%20source.md)(一手来源),review(审查)的意思就是把 diff 读了。

agent 抬高了代码的产量,于是审查成了瓶颈。一个有用的想法是给审查策略分层。[automated check](./Automated%20check.md)(自动检查)抓机械性失败,[automated review](./Automated%20review.md)(自动审查)抓可描述的问题,human review(人工审查)只留给只有你能判断的东西——这个改动是不是对的改动,这个路子合不合这个代码库,这个东西到底该不该存在。

审查也是越早越便宜。开工前读一份方案,或中途读一个小 diff,只要几分钟;AFK([AFK](./AFK.md))跑完之后去挖一条完成的分支,要久得多。审查检查点放在哪儿,是一个 [human-in-the-loop](./Human-in-the-loop.md)(人在回路)的决定,不是事后想起来的事。

_避免:_ 单说 "code review"——分不清是人工还是自动。

_Usage:_

"我 human review 过 AFK 的产出了。"

"你读的是 diff,还是摘要?"

"diff。摘要说它删的是死代码——结果那个函数是从一个生成文件里调用的。"
