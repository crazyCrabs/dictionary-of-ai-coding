<!--
  GENERATED FILE — DO NOT EDIT.
  Source: dictionary/*.md, internal/Curriculum.md, internal/README.template.md
  Regenerate: npm run generate
-->

<p>
  <a href="https://crazycrabs.github.io/dictionary-of-ai-coding/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/total-typescript/image/upload/v1777878285/dictionary-dark_2x.png">
      <source media="(prefers-color-scheme: light)" srcset="https://res.cloudinary.com/total-typescript/image/upload/v1777878285/dictionary-light_2x.png">
      <img alt="AI Coding Dictionary" src="https://res.cloudinary.com/total-typescript/image/upload/v1777878285/dictionary-light_2x.png" width="369">
    </picture>
  </a>
</p>

# AI Coding Dictionary

**AI 编程看起来像是专家专属**。没解释过的黑话。莫名其妙的失败。和工作量对不上的账单。

其实不是。很多困惑是被制造出来的:**一整个靠风投供养的产业,正受益于让它保持难懂**。

基本的入门词汇,一个下午就能学会。有了它们,这一切就不再像碰运气。

上下文为什么会退化?账单为什么这么高?同一个提示词,为什么今天和昨天表现不一样?

每个问题都有一个干净的答案——只要有人告诉你该用哪个词。

这就是这本词典的用途:**把 AI 编程的词汇翻译成大白话**。

本词典中文版译自 [Matt Pocock 的 AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary),词条结构与概念归原作者。

---

## 目录

<details>
<summary>Section 1 — 模型</summary>

- [AI](#ai)
- [Model](#model)
- [Parameters](#parameters)
- [Training](#training)
- [Inference](#inference)
- [Effort](#effort)
- [Token](#token)
- [Next-token prediction](#next-token-prediction)
- [Non-determinism](#non-determinism)
- [Model provider](#model-provider)
- [Harness](#harness)
- [Model provider request](#model-provider-request)
- [Input tokens](#input-tokens)
- [Output tokens](#output-tokens)
- [Prefix cache](#prefix-cache)
- [Cache tokens](#cache-tokens)

</details>

<details>
<summary>Section 2 — 会话、上下文窗口与轮次</summary>

- [Stateless](#stateless)
- [Context](#context)
- [Context window](#context-window)
- [Stateful](#stateful)
- [Agent](#agent)
- [System prompt](#system-prompt)
- [Session](#session)
- [Turn](#turn)

</details>

<details>
<summary>Section 3 — 工具与环境</summary>

- [Environment](#environment)
- [Filesystem](#filesystem)
- [Tool](#tool)
- [Tool call](#tool-call)
- [Tool result](#tool-result)
- [MCP](#mcp)
- [Permission request](#permission-request)
- [Permission mode](#permission-mode)
- [Agent mode](#agent-mode)
- [Sandbox](#sandbox)

</details>

<details>
<summary>Section 4 — 失败模式</summary>

- [Sycophancy](#sycophancy)
- [Hallucination](#hallucination)
- [Parametric knowledge](#parametric-knowledge)
- [Knowledge cutoff](#knowledge-cutoff)
- [Contextual knowledge](#contextual-knowledge)
- [Attention relationship](#attention-relationship)
- [Attention budget](#attention-budget)
- [Attention degradation](#attention-degradation)
- [Smart zone](#smart-zone)

</details>

<details>
<summary>Section 5 — 交接</summary>

- [Clearing](#clearing)
- [Handoff](#handoff)
- [Primary source](#primary-source)
- [Secondary source](#secondary-source)
- [Handoff artifact](#handoff-artifact)
- [Spec](#spec)
- [Ticket](#ticket)
- [Compaction](#compaction)
- [Autocompact](#autocompact)

</details>

<details>
<summary>Section 6 — 记忆与引导</summary>

- [Memory system](#memory-system)
- [AGENTS.md](#agentsmd)
- [Progressive disclosure](#progressive-disclosure)
- [Context pointer](#context-pointer)
- [Skill](#skill)
- [Subagent](#subagent)

</details>

<details>
<summary>Section 7 — 工作模式</summary>

- [Human-in-the-loop](#human-in-the-loop)
- [AFK](#afk)
- [Automated check](#automated-check)
- [Automated review](#automated-review)
- [Human review](#human-review)
- [Vibe coding](#vibe-coding)
- [Design concept](#design-concept)
- [Grilling](#grilling)
- [Prototyping](#prototyping)
- [DX](#dx)
- [AX](#ax)

</details>

## Section 1 — 模型

### AI

一个会移动的标签,不是一项技术。"AI"不像 [model](#model)(模型)或 [token](#token)(词元)那样命名一个固定的东西——它指向的是计算机新近能做到的、令人惊叹的事。当下它指向大语言模型。它以前指向过非常不同的东西:

| 年代      | "AI" 指什么                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| 1950s     | 符号推理——定理证明器、跳棋程序。                                              |
| 1960s–70s | 基于规则的符号程序——ELIZA、SHRDLU。                                           |
| 1980s     | 专家系统——成千上万条手写的 if-then 规则,编码人类专家知识。                    |
| 1990s     | 博弈树搜索——深蓝(Deep Blue)击败卡斯帕罗夫(1997)。研究者当时完全避开"AI"这个词 |
| 2000s     | 统计机器学习——垃圾邮件过滤器、推荐系统。当时仍以"机器学习"之名出售,不叫"AI"   |
| 2010s     | 深度学习——图像识别(AlexNet,2012)、AlphaGo(2016)。                             |
| 2020s     | 大语言模型——ChatGPT(2022)让"AI"意味着聊天机器人                               |

指针的移动有一个已知的机制,有时被称为 AI effect(AI 效应):一项技术一旦可靠地跑通,就会被改名——它"只是"搜索、"只是"统计——而"AI"滑向下一个未解决的问题。这个观察很老了。Bertram Raphael 在 1971 年这么说:"AI 是一群我们还不知道如何用计算机妥善解决的问题的统称。"Larry Tesler 的版本,约 1979 年:"智能就是机器还没做成的事。"

这就是为什么关于 AI 的对话常常各说各话。"AI 不会推理""AI 被过度炒作"这类断言带着一个隐藏的时间戳——它可能说的是专家系统、2010 年代的图像分类器,或上个月的大语言模型,每种所指支持的结论都不同。当关于 AI 的讨论僵住时,解法通常是把这个词换成你实际所指的精确术语:模型本身、[harness](#harness)(宿主环境)、[agent](#agent)(智能体)、或给它的 [context](#context)(上下文)。

_避免:_ 在任何技术性断言里使用"AI"——直接说出你指的那个部件。把"AI 编程"当作实践的标签没问题;"AI 在产生幻觉"不行。

_Usage:_

"CTO 想知道 AI 能不能处理 triage 队列。"

"先把这句话翻译成具体方案再评估——她的意思是:一个装在 harness 里、能访问工单系统的 LLM。"AI"本身不是一份 spec。"

### Model

[parameters](#parameters)(参数)本身。[stateless](#stateless)(无状态)——只做 [next-token prediction](#next-token-prediction)(下一词元预测),别的什么都不做。"Claude Opus 4.x"和"GPT-5.x"都是 model。一个 model 单独做不了任何 agentic 的事;它必须被 [harness](#harness)(宿主环境)装配起来。

model 不能读文件、跑命令、浏览网页、也记不住昨天——它接收 [token](#token)(词元)、预测 token,每个 [model provider request](#model-provider-request)(模型供应商请求)一次。一切看起来像 [agent](#agent)(智能体)在工作的东西——挑选 [tool](#tool)(工具)、读结果、循环直到任务完成——都是 harness 在连续编排这些预测。

[model provider](#model-provider)(模型供应商)按档位发布 model:大的最聪明但慢且贵,小的更快更便宜但能力弱。选档位是个真实的决定——重档用于规划和难的调试,轻档用于机械性修改——harness 允许你在 [session](#session)(会话)中途切换。

对这个措辞较真,也能让诊断更锐利。"这个 model 干不好这事"是一个具体的断言——同一个 model 换一个 harness,或换一份 [context](#context)(上下文),行为常常完全不同。在怪罪 model 之前,先检查它被给了什么:大多数令人失望的输出,追根溯源是 context 或 harness 的问题,不是参数的问题。

_Usage:_

"规划这步,要不要把 model 从 Sonnet 换成 Opus?"

"可以试——但这个任务里大部分活是 harness 干的。如果 [system prompt](#system-prompt) 和工具不对,换 model 也没用。"

### Parameters

[model](#model)(模型)内部的数字——常常以十亿计——在 [training](#training)(训练)中调定。模型"知道"的一切都存在其中。训练把它们写定;[inference](#inference)(推理)原样使用它们。也叫 _weights_(权重)。

从机制上说,parameters 就是把输入变成输出的那个东西。[next-token prediction](#next-token-prediction)(下一词元预测)是一场巨大的计算:[context window](#context-window)(上下文窗口)里的 [token](#token)(词元)进来,穿过 parameters 做乘法,得出对下一个 token 的预测。模型内部没有事实数据库,没有代码查找表——只有这些数字,以"计算倾向于产出有用结果"的方式排布。模型能背诵的训练事实,比如某个标准库 API,是 [parametric knowledge](#parametric-knowledge)(参数化知识):存在参数里,不是从哪里检索来的。

值得内化的细节是:parameters 在训练后冻结。你在 [session](#session)(会话)里做的任何事都不会改变它——你做的纠正、你给它看的代码库、它从错误里"学到"的教训,都不行。每个 session 跑在同样的数字上。这就是为什么 model 是 [stateless](#stateless)(无状态)的,为什么它的内置知识止步于 [knowledge cutoff](#knowledge-cutoff)(知识截止),为什么任何项目特定的东西必须通过 [context](#context)(上下文)进来。parameters 改变的唯一方式是再训练——那实际上会产出一个不同的模型。

_Usage:_

"能不能在我们的代码库上 fine-tune?"

"那会更新 parameters——之后就是一个不同的模型了。对一个项目来说,几乎总是把代码库装进 context 比重新训练便宜。"

### Training

调定 [model](#model)(模型)的 [parameters](#parameters)(参数)的过程:让它接触海量文本,调整参数以改进 [next-token prediction](#next-token-prediction)(下一词元预测)。一次性的、昂贵的、由 [model provider](#model-provider)(模型供应商)完成的过程。它涵盖 pre-training(预训练,主跑道)和 post-training(后训练,后续打磨,如指令遵循与安全);在这本词典的层面,这个区分不重要。

机制是大规模的重复:给模型看一段文本,让它预测下一个 [token](#token)(词元),把参数朝实际的下一个 token 方向轻推,然后在数万亿 token 上重复。没有任何东西以事实或规则的形式被存储——模型"知道"的一切,都是预测能力变强的副作用,压缩在参数里,成为 [parametric knowledge](#parametric-knowledge)(参数化知识)。

两件事影响日常使用。训练在一个时间点结束,所以模型有 [knowledge cutoff](#knowledge-cutoff)(知识截止)——它没见过你上个月升级的库版本。而且训练不是你能做的事:当模型不了解你的代码库、你的约定、你的内部 API 时,解法从来不是"教模型"——而是把这些材料放进 [context](#context)(上下文),你唯一能控制的输入。

_Usage:_

"能不能让它学会我们的内部 API?"

"不能靠训练——那是模型供应商手里以月计的过程。把 API 文档装进 context,那才是你真正有的杠杆。"

### Inference

运行训练好的 [model](#model)(模型)来生成输出——每次 [model provider request](#model-provider-request)(模型供应商请求)发生的就是这件事。[parameters](#parameters)(参数)保持不变;模型只是对给定的 [context](#context)(上下文)做 [next-token prediction](#next-token-prediction)(下一词元预测)。相比 [training](#training)(训练)便宜,但按 [token](#token)(词元)计费,是用模型的主要成本。

模型的一生分两个阶段:

| 阶段      | 何时发生         | 做什么                                | 参数       |
| --------- | ---------------- | ------------------------------------- | ---------- |
| Training  | 一次,发布之前    | 从训练语料产出参数                    | 正在被写入 |
| Inference | 每次有人使用模型 | 用冻结的参数跑你的 context,生成 token | 只读       |

你在推理时做的任何事都不会写回参数——这就是你今天做的纠正,明天留不下来的原因。下一个 [session](#session)(会话)里,你明明仔细解释过修法,模型还是犯同样的错——它没有无视你;它没有能力从这次交流中学到东西。model 是 [stateless](#stateless)(无状态)的——连续性必须来自模型之外:来自 [context window](#context-window) 或 [memory system](#memory-system)(记忆系统)。

这个机制也解释了账单。每个请求都让模型跑一遍完整的 context,所以成本随 [input tokens](#input-tokens)(输入 token)和 [output tokens](#output-tokens)(输出 token)增长,而一个做几十次 [tool](#tool) 调用的 [agent](#agent)(智能体),每个来回都要付一次推理费。这就是为什么 context 大小既是质量问题,也是成本问题。

_Usage:_

"为什么账单随用量涨,而不是一笔固定的授权费?"

"你付的是 inference——每次模型供应商请求都在供应商的硬件上跑一遍模型。训练早已完成,但推理按请求累计,而且一个 [turn](#turn) 在调用工具时会膨胀成很多个请求。"

### Effort

Effort 是一个旋钮,控制 [model](#model)(模型)回答之前做多少推理。它在每个 [model provider request](#model-provider-request)(模型供应商请求)上设置,控制模型在开始写你能看到的回答之前,要走过多少思考。那些思考和其他一切一样,是在 [inference](#inference) 时生成的;[harness](#harness)(宿主环境)常常把它藏起来,但那是模型真实在做的工作。

更高的 effort 更贵也更慢。推理以 [token](#token) 的形式产出,按 [output tokens](#output-tokens)(输出 token)计费——哪怕你从没看到它们——而且一次只生成一个 token,所以调高 effort 拉长答案到达前的等待,也加大账单。这笔交换是:更充分的推敲,换速度和成本。

大多数 harness 把 effort 暴露成一个小阶梯:

| 档位   | 适用场景                               |
| ------ | -------------------------------------- |
| Low    | 机械修改、查找、路径唯一且明确的变更。 |
| Medium | 日常编码——通常的默认。                 |
| High   | 棘手的 bug、设计决定、多步规划。       |
| Max    | 最难的问题,答错的代价高昂、难以回退。  |

设错的症状双向都有。难题上把 effort 设太低,你会得到一个自信而肤浅的答案,它跳过了问题需要的推理——读起来顺,但错在让你后面才付账的地方。给一行重命名设 max,你就得陪着一场漫长的思考,产出不会比最低档多。

让 effort 匹配任务,而不是匹配 [session](#session)(会话)。真正难推理的部分调高,周围的体力活调回来。

_Usage:_

"这个并发修复它一直搞砸,我都重新解释三遍了。"

"把 effort 调高。那是一个重推理的 bug,默认档位下,它在选定方案之前想得不够久。"

### Token

[model](#model)(模型)读写的原子单位。大约一个词大小,但不精确——常见词是一个 token,罕见或长的词拆成几个。[context window](#context-window)(上下文窗口)大小、成本和延迟都以 token 计。

文本经过 tokenizer(分词器)变成 token:一个几万条片段的固定词表,在 [training](#training)(训练)之前学得,把任何输入切成一串词表条目。模型从不看到字符或词——每段文本进模型前都被转成 token,[next-token prediction](#next-token-prediction)(下一词元预测)在出口一次一个 token 地产出。

经验法则:一个 token 约等于四分之三个英文词,所以一千 token 大约 750 词。代码更不可预测:常见关键字和习语切得很紧凑,而生成的标识符、哈希、base64 块和压缩产物,每个"词"要拆成很多 token。规律是:在 tokenizer 的原料里出现频繁的文本,得到又短又高效的编码;没出现过的被剁成很多小块。像 `a3f9c2e1` 这样的哈希从没在任何地方出现过,所以拆成很多 token,而 `function` 是一个。这就是为什么一个看起来很小的文件,装满不寻常的字符串,能占掉上下文窗口里惊人的一块。

token 是其他一切计量所用的单位。成本按 token 计——供应商把 [input tokens](#input-tokens)(输入 token)和 [output tokens](#output-tokens)(输出 token)分开计费。速度是每秒 token 数,因为输出一次生成一个 token。而上下文窗口是固定数量的 token,所以你文件的 token 数决定了装得下多少。

_避免:_ 把它叫"word"(词)——token 的边界和词的边界不重合,而且 tokens-per-second / tokens-per-dollar 才是真正有用的单位。

_Usage:_

"这个提示会有多大?"

"丢给 tokenizer 跑一下——schema 很紧凑,但 JSON 键很怪,拆出来的 token 会比你以为的多。"

### Next-token prediction

[model](#model)(模型)实际在做的事。给定 [context](#context)(上下文),它采样出下一个 [token](#token)(词元),追加,再跑一遍。每个输出——一句话、一次 [tool call](#tool-call)(工具调用)、一个千行文件——都是一次一个 token 拼出来的。模型没有别的运作模式。

每一步都一样:[context window](#context-window)(上下文窗口)里的 token 穿过 [parameters](#parameters)(参数),对词表里每个 token 产出一个概率——这个很可能是下一个,那个次之。从这些概率里采样出一个 token,追加,循环带着变长的 context 再跑。这个采样步骤,就是同一个提示在不同运行里产出不同输出的原因:[non-determinism](#non-determinism)(非确定性)长在机制里,不是叠在上面的 bug。

抓住这个机制,很多原本奇怪的行为就说得通了。模型在吐出一个 token 之前,从不检查它是不是真的——只检查它是不是大概率的——这是 [hallucination](#hallucination)(幻觉)的根源。它每吐一个 token 就落下一次承诺,所以一句听起来很自信的开头,能把整个回答带偏。又因为 [output tokens](#output-tokens) 严格一次只产出一个,生成速度给任何 [agent](#agent)(智能体)的工作速度画了条下限。

_Usage:_

"agent 是怎么'决定'调用工具的?"

"它不决定——一路到底都是 next-token prediction。所谓 tool call,不过是 [harness](#harness)(宿主环境)从输出流里解析出来的一段结构化字符串。"

### Non-determinism

同样的输入可以产出不同的输出。用完全相同的 [context](#context)(上下文)把一个 [model](#model)(模型)跑两遍,你可能得到两个不同的答案——有时差一个词,有时是完全不同的方案。你的代码什么都不用变,这就会发生。

这是模型生成文本的方式、以及 [model provider](#model-provider)(模型供应商)服务[请求](#model-provider-request)的方式所固有的性质。[inference](#inference)(推理)时,模型对所有可能的下一个 [token](#token)(词元)产出一个概率分布,从中采样一个——通常故意带点随机性,因为永远选最可能的 token 会产出重复、低质的文本。回答早期一个被不同采样的 token,会改变它之后的每一个 token,这就是一个词的不同如何演变成整个方案的不同。供应商侧的服务又叠加了更多变数:请求在共享硬件上被批处理,批之间的微小浮点差异,就能在两个 token 之间翻转一个五五开的选择。没有任何设置能让这一切消失。

对同一个任务,要预期 [agent](#agent)(智能体)的产出是一个分布。大多数回答落在合理的质量钟形曲线里——这就是非确定性尚可容忍的原因——但尾部是真实的:有些天模型显得锋利,有些天它显得丢了主线。同一个任务,不同的骰子。这有两个实际推论。重试是正当策略:一次失败只是分布中的一次抽样,同一任务再开一次可能就落得更好。而验证比在确定性工具上更重要——你没法测一次 agent 的行为就指望它复现,所以[自动化检查](#automated-check)(automated check)必须负责抓住坏样本。

小心别过度叙事化。人是模式匹配机器,一连串坏运行会让你觉得"这周模型变差了"。通常那只是分布。

_Usage:_

"Claude 今天糟糕透了。他们是不是发布了更差的版本?"

"大概率不是——模型输出是非确定性的。同一个任务,你会有好日子和坏日子。明天再试一次,再去找原因。"

### Model provider

为 [model](#model)(模型)提供 [inference](#inference)(推理)服务的一方。通常是远程服务(Anthropic、OpenAI、Google),也可以是本地的——Ollama、LM Studio、llama.cpp,跑在你自己的机器上。[harness](#harness)(宿主环境)自己不跑模型;它请 provider 来跑。

机器归 provider 所有:[parameters](#parameters)(参数)在它的硬件上,每次 [model provider request](#model-provider-request)(模型供应商请求)都是 harness 把 [token](#token) 送过网络、拿回预测。这使 provider 成为一整类被错怪到模型或 harness 头上的问题的源头——限流、容量降级、宕机都住在这里。当 [agent](#agent)(智能体)在 [session](#session)(会话)中途卡住,或每个 [turn](#turn) 都报错,先查 provider 的状态页,再查别的。

provider 也定商业条款:[input tokens](#input-tokens)(输入 token)与 [output tokens](#output-tokens)(输出 token)的按 token 定价、[prefix cache](#prefix-cache)(前缀缓存)折扣,以及到底有哪些模型可用。注意 provider 和模型的制造者可以是不同公司——Bedrock、Vertex、OpenRouter 服务的是别人家的模型。

本地 provider 用能力换控制:装得进你自己硬件的模型,比前沿模型小得多,但什么都不会离开这台机器,也没有按 token 计的账单。

_Usage:_

"客户是物理隔离的,能不能离线跑?"

"把 model provider 换成本地的——Ollama 或 llama.cpp,跑在他们的机器上。harness 不在乎,它只是换了个 endpoint。"

### Harness

[model](#model)(模型)周围把模型变成 [agent](#agent)(智能体)的一切:[tool](#tool)(工具)、[system prompt](#system-prompt)(系统提示)、[context window 管理](#context-window)、权限、hooks。**Claude.ai** 和 **Claude Code** 跑同一个模型,行为却不同,因为 harness 不同。

模型本身只做一件事:文本进,文本出。它不能读文件、跑命令、记住上一个 [turn](#turn)。harness 供给这一切。它为每个 [model provider request](#model-provider-request)(模型供应商请求)组装 [context](#context)(上下文),执行模型要求的 [tool call](#tool-call)(工具调用),把 [tool result](#tool-result)(工具结果)回填进去,保存 [session](#session)(会话)历史,在冒险动作前向你请求许可,并决定何时 [compact](#compaction)。agent 循环——模型提议,harness 执行,重复——是 harness 在跑。

这对诊断很重要。两个产品之间、或昨天与今天之间行为不同,变量常常不是模型——是 harness。不同的 system prompt、不同的工具集、改过的权限默认值、新的 context 管理策略,都会在不碰模型的情况下改变行为。这也意味着 harness 是你大部分配置的所在:[AGENTS.md](#agentsmd) 文件、权限设置、hooks,全都是给 harness 的指令,不是给模型的。

例子:Claude Code、Cursor、Codex CLI——以及 Claude.ai,它是聊天 harness,不是编程 harness。

_Usage:_

"同一个模型,为什么 Claude Code 能改文件,Claude.ai 只会回答问题?"

"harness 不同——Claude Code 有 [filesystem](#filesystem)(文件系统)工具、不同的 system prompt 和权限层。这里的变量不是模型。"

### Model provider request

从 [harness](#harness)(宿主环境)到 [model provider](#model-provider)(模型供应商)的一次往返。harness 发送当前 [context](#context)(上下文);provider 返回一个响应(一次 [tool call](#tool-call)(工具调用)或最终答案)。一条用户消息可以催生很多次 model provider request——如果 [agent](#agent)(智能体)调用 [tool](#tool),每条 [tool result](#tool-result) 都触发下一次请求。

每个请求携带全部:[system prompt](#system-prompt)(系统提示)、到目前为止的完整对话、每条 tool result。[model](#model) 是 [stateless](#stateless)(无状态)的,所以 provider 在请求之间不保存任何东西——第四十个请求,把第三十九个发过的全部重发,再加一条 tool result。[prefix cache](#prefix-cache)(前缀缓存)就是为了让这种重复变得付得起。

request 也是计费单位。[input tokens](#input-tokens)(输入 token)、[output tokens](#output-tokens)(输出 token)、缓存折扣,全按请求计——这就是一个看起来无害的问题能花掉惊人金额的原因:成本不正比于你的消息,而正比于请求次数乘以每个请求携带的 context 大小。

值得把 request 和 [turn](#turn)(轮次)区分开。turn 是与你的一次交流,而一个 turn——"把失败的测试修好"——会展开成一条请求链:

| 请求 | 模型返回                   | harness 随后        |
| ---- | -------------------------- | ------------------- |
| 1    | Tool call:跑测试           | 跑测试,追加失败输出 |
| 2    | Tool call:读测试文件       | 追加文件内容        |
| 3    | Tool call:读源文件         | 追加文件内容        |
| 4    | Tool call:编辑源文件       | 应用编辑,追加结果   |
| 5    | Tool call:再跑测试         | 跑测试,追加通过输出 |
| 6    | 最终答案:"修好了,测试通过" | 展示给你            |

一个 turn 六次请求——每次都重发整个 context。当你纳闷 [token](#token) 都去哪了,数请求,别数 turn。

_Usage:_

"一个问题烧掉了四万 token?"

"看 tool call——十二次 grep、八次 read、四次 edit。每条 tool result 都催生下一次 model provider request,而整个 [session](#session)(会话)前缀每次都重发。"

### Input tokens

[harness](#harness)(宿主环境)在每次 [model provider request](#model-provider-request)(模型供应商请求)中发送的 [token](#token)(词元)——[system prompt](#system-prompt)(系统提示)、对话历史、[tool result](#tool-result)(工具结果),[model](#model)(模型)在写出之前读到的一切。计费费率低于 [output tokens](#output-tokens)(输出 token),因为处理它们比产出输出便宜。

做 [AI](#ai) 编程时,input tokens 构成你账单的大头。model 是 [stateless](#stateless)(无状态)的,所以每个 [turn](#turn) 把整个 [session](#session)(会话)作为输入重发:你的第一条消息、每条回答、之后的每条 tool result。第五十个 turn 的输入里,装着之前四十九个 turn。一次 model provider request 可能只产出几百个输出 token,却重发十万 token 的累积历史。

[prefix cache](#prefix-cache)(前缀缓存)能把成本压下来:与之前某个请求完全一致的历史,按便宜的 [cache tokens](#cache-tokens)(缓存 token)计费,而不是全价 input。当输入成本仍然刺痛,修法是缩小被重发的东西——任务之间 [clearing](#clearing)(清空)或 [compaction](#compaction)(压实)。

_Usage:_

"账单很高,可 [agent](#agent)(智能体)几乎没写什么。"

"是 input tokens——每个 turn 都重发整个 session。没有 prefix cache 的话,历史每次请求都要重付一遍。"

### Output tokens

[model](#model)(模型)生成回来的 [token](#token)(词元)。计费费率高于 [input tokens](#input-tokens)(输入 token)——常见的大约五倍——因为产出的算力成本更高。

模型写出的一切都算:你读到的文字、它产出的代码、[tool call](#tool-call)(工具调用),以及模型回答前的 extended thinking(扩展思考)。最后一项让人意外——reasoning token 按 output 计费,哪怕 [harness](#harness)(宿主环境)常常不把它们显示给你,而调高 [effort](#effort) 花掉的正是它们。

output tokens 还决定 [session](#session)(会话)的节奏。模型读输入很快,但生成输出一次一个 token,所以当一个 [turn](#turn)(轮次)感觉慢,几乎总是在写出的输出,而不是在读入的输入。等待很长,通常意味着一个长答案在路上。

_Usage:_

"refactor session 明明输入不大,credit 却在狂烧。"

"agent 在整文件重写,而不是打补丁。output token 的费率大约是 input 的五倍——让它改成产出增量编辑,账单就下来了。"

### Prefix cache

[provider](#model-provider)(模型供应商)侧的存储,让连续的 [model provider request](#model-provider-request)(模型供应商请求)跳过对共享前缀的重复处理。当一个请求的开头与最近某个请求的开头一致——同样的 [system prompt](#system-prompt)(系统提示)、同样到某处为止的历史——provider 复用之前的处理结果,把这些 [token](#token)(词元)按 [cache tokens](#cache-tokens)(缓存 token)计费,费率低得多。

这笔缓存之所以划算,是因为 session 只增不改。每个请求都把整个历史作为 [input tokens](#input-tokens) 重发(为什么,见该词条),而正常的 [session](#session)(会话)里,历史只在末尾变化——每个请求就是上一个请求加几条新消息。provider 把长长的共享开头处理一次,存下结果,从词缀结束处继续。没有缓存,一个 50 个 [turn](#turn) 的 session,要为第一个 turn 的重处理付五十次钱。

缓存也会过期。条目保温多久,因 model provider 而异——典型是分钟级,不是小时级。session 闲置超过窗口,下一个请求会把前缀按全价重建一次,然后缓存恢复。这主要是 [harness](#harness)(宿主环境)构建者要操心的事;作为用户,可见的影响是:长暂停之后的那个请求,比之前的都贵。

_Usage:_

"为什么账单在 session 中途飙升?"

"harness 开始在每个 turn 往 system prompt 里注入当前时间。前缀在第一个变化的 token 处断掉,之后的每个请求都按全价计费。"

### Cache tokens

[provider](#model-provider)(模型供应商)从上一个 [model provider request](#model-provider-request)(模型供应商请求)缓存下来的 [input tokens](#input-tokens)(输入 token),这样就不必重新处理。当连续请求共享一个前缀,provider 通过 [prefix cache](#prefix-cache)(前缀缓存)复用处理结果,把缓存住的部分按低得多的费率计费。这是让长 [session](#session)(会话)付得起的那个杠杆——没有它,每个 [turn](#turn) 都要为整段历史重付一次。

这件事重要的原因,是 session 的计费方式。[model](#model)(模型)是 [stateless](#stateless) 的,所以每个请求重发整个对话——[system prompt](#system-prompt)、每条消息、每条 [tool result](#tool-result)——作为 input tokens。到第五十个 turn,每个请求携带五十个 turn 的历史,而且每一次你都要为它按全价付清。缓存改变了算术:供应商在完全一致的前缀里已经处理过的 token,按 cache tokens 计费,常常是 input 费率的十分之一或更低。长 session 上,你发送的大部分都是 cache tokens,账单才保持体面。

一个例子,说明 token 何时被缓存、何时没有。每个字母代表一段对话内容;每个请求发送到目前为止的对话:

| 请求发送 | 被缓存 | 按全价计费 | 原因                                     |
| -------- | ------ | ---------- | ---------------------------------------- |
| `AB`     | 无     | `AB`       | 第一个请求——没有可匹配的                 |
| `ABC`    | `AB`   | `C`        | `AB` 是上一个请求的精确前缀              |
| `ABCD`   | `ABC`  | `D`        | 前缀仍然完好                             |
| `AXCD`   | `A`    | `XCD`      | 一次编辑把 `B` 变成了 `X`;匹配在那里失败 |

缓存以一种特定的方式脆弱:它匹配精确前缀。只要对话中更早的地方有任何变化——[harness](#harness)(宿主环境)重排了内容、一个时间戳更新了、一个文件的表示变了——缓存从那一点起 miss,其后的一切都按全价 input 计费。缓存也在几分钟不活动后过期,所以长暂停后恢复的 session 会把历史重付一次。当 session 的成本无缘无故跳高,在用量报告里对比 cache tokens 和 input tokens——坏掉的缓存最先在那里现形。

_Usage:_

"长 session 的成本太凶残了——一次 refactor 花了八刀。"

"查 cache tokens。如果 harness 在 turn 之间重排 system prompt 或文件,前缀就断了,你每个请求都重付全价 input。"

## Section 2 — 会话、上下文窗口与轮次

### Stateless

不向前携带信息。[model](#model)(模型)在 [model provider request](#model-provider-request)(模型供应商请求)之间是 stateless 的——每个请求重发完整的 [context window](#context-window)(上下文窗口),因为模型没有任何别的途径看到东西。[agent](#agent)(智能体)默认在 [session](#session)(会话)之间也是 stateless 的:新 session 从空开始,不留旧 session 的痕迹。与 [stateful](#stateful)(有状态)相对。

模型本身永远 stateless:它的 [parameters](#parameters)(参数)在 [training](#training)(训练)后冻结,[inference](#inference) 时你做的任何事都改变不了它。模型不会从你的纠正里学习,不记得昨天被告知过同一件事,也不会渐渐了解你——无论对话感觉上多么像那么回事。一个 session 之内的连续感,是 [harness](#harness)(宿主环境)制造的:它保存对话记录,随每个请求重发。模型不是在回忆对话;它是在重读对话。

实际推论是:想让某个东西跨 session 被记住,你得把它写到 agent 会读回来的地方。这就是 [AGENTS.md](#agentsmd) 文件、[memory system](#memory-system)(记忆系统)和 [handoff artifact](#handoff-artifact)(交接产物)的用途——它们是会被装进未来 session 的 [context](#context)(上下文)的文件,顶替模型没有的那份记忆。当 agent 一再犯你纠正过的错,问题不是它为什么没学会——它学不会——而是该把这条纠正写在哪儿,让每个未来的 session 都读到。

_Usage:_

"为什么每次 [clear](#clearing) 之后它都忘掉约定?"

"模型是 stateless 的——新 session 从空开始。想让它被带走,就写进 AGENTS.md,或写在 harness 在 session 开始时加载的记忆文件里。"

### Context

[agent](#agent)(智能体)当下能获得的相关信息。这是个抽象名词——不是模型看到的原始输入(那是 [context window](#context-window)(上下文窗口)),不是滚动的历史(那是 [session](#session)(会话)),而是 _agent 知道的、与任务有关的那部分_。"把某个东西装进 context",意思是让它成为这个集合的一部分;"context engineering(上下文工程)"就是经营这个集合的学问。

三个术语可以干净地分开:

| 术语           | 指的是什么                                                |
| -------------- | --------------------------------------------------------- |
| Context        | agent 当下拥有的、与任务相关的信息                        |
| Context window | 模型每次请求看到的、字面意义上的 [token](#token) 序列 |
| Session        | [harness](#harness)(宿主环境)保存的滚动对话           |

这个区分重要,因为 context 衡量的是质量,不是数量。context window 可以几乎填满,而 context 依然贫瘠——几千 token 的过期 tool output,没有一条与手头任务相关。它也可以几乎全空,而 context 极佳:一条任务成败所系的类型定义。

大多数日常失败都能追到 context。当 agent 编造 API、违背既定决定、或瞎猜 schema,第一个问题是它做这件事时 context 里有什么——通常是要紧的事实从未被装进去,或者被埋在 [attention degradation](#attention-degradation) 之下。修法是经营:装任务需要的,挡住不需要的。

_Usage:_

"它一直在编造类型里不存在的字段。"

"类型文件不在 context 里——它在读调用点然后猜。先把定义读进去。"

### Context window

[model](#model)(模型)在每次 [model provider request](#model-provider-request)(模型供应商请求)中看到的一切。有限、因模型而异,而且是模型感知外界的唯一表面。

它是单一的一条 [token](#token) 序列:[system prompt](#system-prompt)(系统提示)、到目前为止的对话,以及 [harness](#harness)(宿主环境)反馈进来的每一条 [tool result](#tool-result)(工具结果)。在序列里的东西,model 就能用;不在序列里的,model 不知道它存在——你的代码库、你昨天改过的文件、你三个 session 之前给的指令,都是如此。窗口外的任何东西,都得先被带进来——通常通过一次 [tool call](#tool-call)——才能产生影响。

有限意味着它会被填满。每个 [turn](#turn) 都在追加内容——你的消息、model 的回答、tool result——一个长 [session](#session) 终会撞上限,被迫 [compaction](#compaction)(压实)或 [clearing](#clearing)(清空)。有限也意味着窗口里的一切在竞争:你装入的每个 token,都是其余内容少掉的一个;你不需要的内容,照样占据着 model 的 [attention](#attention-budget)(注意力)。务实的姿态是把窗口当成预算——装任务需要的,其余留在窗外。

_避免:_ 把它叫作"memory"。context window 是工作状态,不跨 session 存续。[Memory](#memory-system)(记忆系统)是叠加在其上的另一个概念。

_Usage:_

"我能把整个 monorepo 直接粘进提示里吗?"

"context window 是 200k token,大概只够仓库的五分之一。挑出任务会碰的文件,其余的留在 tool call 后面。"

### Stateful

向前携带信息。[session](#session)(会话)跨 [turn](#turn)(轮次)是 stateful 的——[context](#context)(上下文)随 session 运行而累积,这正是长 session 滑向 [dumb zone](#smart-zone) 的原因。[agent](#agent)(智能体)可以变得跨 **session** stateful:加一个 [memory system](#memory-system)(记忆系统),把信息持久化进 [environment](#environment)(环境),在未来 session 开始时重新加载。[model](#model)(模型)永远不 stateful;任何表面上的连续,都是 [harness](#harness)(宿主环境)在重新喂 context。与 [stateless](#stateless)(无状态)相对。

每一层的状态住在哪:

| 层          | 是否有状态 | 方式                                                                                                  |
| ----------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| Model       | 永不       | [Parameters](#parameters)(参数)冻结;它只看到每个请求里带的东西                                    |
| Session     | 跨 turn    | harness 把每条消息和 [tool result](#tool-result) 追加进 context                                 |
| Harness     | 跨 session | 记忆文件、[AGENTS.md](#agentsmd)、[handoff artifact](#handoff-artifact)——写下来,之后再加载 |
| Environment | 永远       | 文件持续存在,不管有没有 session 在跑                                                                  |

每层的状态,都是靠重读下一层存下的东西搭起来的:session 显得连续,是因为 harness 把消息历史重发给 stateless 的模型;agent 能跨 session 记住,是因为 harness 从 environment 重读文件。没有任何状态存在模型自己身上。

状态并不总是想要的。一切被带向前的东西都在影响接下来发生什么,所以 session 早期一个错误假设也会被带着走。[clearing](#clearing)(清空)就是主动扔掉 session 状态、从写下来的东西重新开始的动作。

_Usage:_

"它记得我昨天的偏好——是不是说明模型学会了?"

"不是,是 agent 的 harness 把偏好写进了记忆文件、在 session 开始时重新加载。模型本身对昨天一无所见。"

### Agent

一个 [model](#model)(模型),被 [harness](#harness)(宿主环境)装上 [tool](#tool)(工具)、[system prompt](#system-prompt)(系统提示)和 [context window](#context-window)(上下文窗口),与用户一来一回地过 [turn](#turn)(轮次)。_Claude Code 是一个 agent。Cursor 是一个 agent。Claude.ai 也是。_ agent 是你实际对话的对象——它是动起来的模型,为某个目的配置好。

这本词典里的大多数术语都指一个机械部件,"agent"不是。模型是一份 [parameters](#parameters)(参数);harness 是你指得出来的软件。agent 两者都不是——它是"你说话的对象"这个单位。人们不断地把 [AI](#ai) 拟人化,agent 就是被拟人化的那个单位:你委派任务给的东西,读你的消息并回答的东西,"它又把构建搞砸了"里的那个"它"。当你说 agent 做了某事,你的意思是"模型加 harness"做了它,但你是把这个组合当作单一行动者来称呼的。

这个想法比这一波 AI 更老。software agent——你把一个目标委派给它、它代你行动的程序——和 AI 这个词一样老。

_避免:_ "the AI"、"the bot"(太含混——分不清你指的是参数,还是装配起来的那个东西)。

_Usage:_

"迁移用哪个 agent?"

"本地用 Claude Code,UI 的活用 Cursor——底下同一个模型,harness 不同。"

### System prompt

[harness](#harness)(宿主环境)附加在每次 [model provider request](#model-provider-request)(模型供应商请求)开头的指令——[agent](#agent)(智能体)的常备简报:它是谁、如何行事、能调用哪些 [tool](#tool)(工具)、遵循什么约定。通常在一个 [session](#session)(会话)内保持不变。

system prompt 由 harness 的厂商写,不是你写的,而在编程 harness 里它很大——常常是几万 [token](#token)(词元)的行为规则、工具描述和边界情况处理,每个 [turn](#turn)(轮次)都作为 [input tokens](#input-tokens) 付一遍钱。你自己的常备指令搭它的便车:[AGENTS.md](#agentsmd) 这类文件在 session 开始时被装在 system prompt 旁边,[model](#model)(模型)在看到你的消息之前,先一起读完厂商的简报和你的。

因为每个请求里它都一字不差,它构成了 [prefix cache](#prefix-cache)(前缀缓存)的开头——这也是 harness 情愿让整个 session 保持它不变、而不随做随改的原因之一。

模型被训练成优先遵循 system prompt 而不是用户消息。所以当 agent 坚持一个你从没要求过的约定,或用一种你怎么都掰不过来的方式格式化输出,它通常是在服从 system prompt——你的消息在这场争执里输了。一些 harness 是可定制的:它们让你直接访问 system prompt,你可以读到 agent 实际被告知了什么,并且改掉它。

_Usage:_

"两个 harness,同一个模型,同一个提示,行为完全不同。"

"system prompt 不同。一个被调教成改代码从简,另一个被调教成从详解释——分歧在那里就已经注定,你的消息还没到场。"

### Session

与 [agent](#agent)(智能体)的一次有边界的交互运行。从空开始,累积消息、[tool result](#tool-result)(工具结果)和读过的文件,在 [clearing](#clearing)(清空)、关闭,或经 [compaction](#compaction)(压实)变成新 session 时结束。session 正是填满 [context window](#context-window)(上下文窗口)的那个东西:如果说 context window 是盒子,session 就是慢慢把它填满的物品。单个 context window 装不下的工作,必须拆到多个 session 里。

session 的消息历史是 agent 的工作记忆。[model](#model)(模型)是 [stateless](#stateless)(无状态)的,所以它看起来记得的一切——你要求过什么、测试说了什么、三个 [turn](#turn)(轮次)之前它决定了什么——都在消息历史里,随着每一次 [model provider request](#model-provider-request)(模型供应商请求)重新发送。不在 session 里的东西,对 agent 来说不存在。

这份记忆随 session 终结。新 session 从零开始:昨天 session 结束时还熟识你代码库的 agent,今天早上对它一无所知。能存续下来的是 [filesystem](#filesystem)(文件系统)——一个 session 里写下的文件,下一个 session 读得到;[handoff](#handoff)(交接)、[memory system](#memory-system)(记忆系统)和 [AGENTS.md](#agentsmd) 依赖的正是这一点。

session 在哪里结束,由你决定。session 中的每样东西都影响之后的每个 turn,所以在同一个 session 里做不相关的任务,残留会污染下一个回答。一个 session 一个任务,context 才保持相关;任务完成,就是清空的自然时机。

_Usage:_

"一个 session 能跑多久才会开始散架?"

"看工作——目标集中的 refactor 比开放式研究撑得久。session 一旦膨胀,就 hand off 或 compact,别硬推。"

### Turn

一条用户消息,加上 [agent](#agent)(智能体)为回应它所做的一切,直到它把控制权交还给你。包含一次或多次 [model provider request](#model-provider-request)(模型供应商请求)——agent 调用 [tool](#tool) 时是很多次。一个澄清提问会闭合当前 turn;你的回复开启下一个。层级是 [session](#session)(会话) **> Turn > Model provider request**。

turn 值得起名,是因为它的长度由 agent 决定,不是你。你交出一条消息;agent 决定交还之前串多少次工具调用。一个 turn 可以是一句话的回答,也可以是二十分钟的读、改、跑测试。这是同一件事的两个面:长 turn 是 [AFK](#afk) 这种工作方式成立的前提;长 turn 也是无人监督时出问题的地方——等 agent 交还时,它可能已经离你的本意很远了。

turn 也是转向(steer)的自然单位。turn 之内的一切都发生在你不在场的时候;turn 之间的间隙,才是你改变方向的地方。大多数 [harness](#harness)(宿主环境)会软化这一点:你可以在 turn 中途打断 agent 并让它改道,或在它干活时输入一条消息,等 turn 结束被读取。如果你反复对 turn 的结局不满意,修法通常是要求更小的 turn——先出方案,一次一步——用自主权换更频繁的、可以插手转向的间隙。

_Usage:_

"一个 turn 花了两分钟?"

"它在这个 turn 里做了十四次 [tool call](#tool-call)(工具调用)——每次都是独立的 model provider request。延迟层层叠加,最后才交还给你。"

## Section 3 — 工具与环境

### Environment

[agent](#agent)(智能体)作用于其上的世界——[harness](#harness)(宿主环境)之外、agent 通过 [tool result](#tool-result)(工具结果)感知、通过 [tool call](#tool-call)(工具调用)改变的一切。harness 是*运行* agent 的东西;environment 是 agent *在其中工作*的东西。像 [`AGENTS.md`](#agentsmd) 这样的文件住在 environment 里;harness 是把它装进 [context window](#context-window)(上下文窗口)的东西。[filesystem](#filesystem)(文件系统)是最常见的 environment,但不是唯一的(数据库、远程 API、浏览器会话都可以是 environment)。

agent 只有在看的时候才看得见 environment。它对 environment 的一切了解都来自 tool result,所以它脑中的图景是一组快照,每个快照只在其拍下的那一刻准确。如果文件在 agent 读过之后变了——你手动改了它,或构建步骤重新生成了它——agent 会继续基于过期的副本推理,直到有什么触发了重读。agent 自信满满地描述一个早已不是那个样子的文件,通常是这个原因:environment 动了,快照没动。

environment 也是持久化的那一层——唯一永远 [stateful](#stateful)(有状态)的一层。一个 [session](#session)(会话)的 context 在 session 结束时就没了,但写进 environment 的文件会留下来,给下一个 session 读——[memory system](#memory-system)(记忆系统)、[handoff artifact](#handoff-artifact)(交接产物)和 `AGENTS.md` 依赖的正是这一点。任何 agent 明天还该知道的东西,都必须落进 environment。

environment 有多大,由你决定。[sandbox](#sandbox) 把它缩小,限制 agent 能触达的范围;加一个 [tool](#tool) 把它扩大,把数据库或 API 带进射程。边界之内是 agent 能感知和改变的一切;边界之外对 agent 来说不存在。environment 被布置得有多利于 agent 工作,就是这个代码库的 [AX](#ax)。

_避免:_ 用 "environment" 指运行时或 harness 本身——harness 是包装,environment 是工作场地。

_Usage:_

"agent 看不到 staging 库的 schema。"

"把它接进 environment——给它一个 `psql` tool,scope 限定为 staging 只读。harness 没问题,只是它无事可做。"

### Filesystem

[agent](#agent)(智能体)读、写和执行所在的文件与目录树——编程 agent 默认的 [environment](#environment)(环境)。[AGENTS.md](#agentsmd)、[skill](#skill)、源代码、构建脚本和 [tool](#tool)(工具)配置都住在 filesystem 里。当一个 [harness](#harness)(宿主环境)"在你的项目里启动",指的就是把 agent 指向一个 filesystem。

agent 只通过 [tool call](#tool-call)(工具调用)接触它——读文件、写文件、跑 shell 命令。磁盘上的任何东西在被 tool call 装载之前,都不在 [context window](#context-window) 里;正因如此,agent 才能在一个远大于窗口的仓库里工作:filesystem 装着一切,context 只装当前任务读过的部分。一些 harness 默认把当前目录的文件名——不是内容,只是目录树——装进 context window,它们起的是 [context pointer](#context-pointer)(上下文指针)的作用:agent 看到有什么存在,再去读需要的文件。

它还和你共享。agent 编辑的文件,就是你在编辑器里打开、在 git 里 diff 的同一批——filesystem 是你审查 agent 所作所为的公共工作场地。

_Usage:_

"为什么它不读我的 AGENTS.md?"

"它挂在另一个 filesystem 上——[sandbox](#sandbox) 挂载了父目录,不是项目根目录。重新指一下 harness。"

### Tool

[harness](#harness)(宿主环境)暴露给 [agent](#agent)(智能体)调用的函数——Read、Write、Bash、Search。tool 是 agent 感知和作用于 [environment](#environment)(环境)的方式:不通过 [tool result](#tool-result)(工具结果)它看不见环境,不通过 [tool call](#tool-call)(工具调用)它改变不了环境。每次 tool call 都多付一次 [model provider request](#model-provider-request)(模型供应商请求),因为结果必须先送回 [model](#model)(模型),它才能决定下一步。

大多数编程 agent 自带的 tool:

| Tool   | 做什么                                            |
| ------ | ------------------------------------------------- |
| Read   | 把文件内容作为 tool result 返回                   |
| Write  | 在 [filesystem](#filesystem) 里创建或编辑文件 |
| Bash   | 跑一条 shell 命令,返回其输出                      |
| Search | 在代码库里查找匹配模式的文件或文本                |

一个 tool 由三样东西定义:名字、一段功能描述、参数的 schema。harness 随每个请求把这些定义发给 [model](#model),而模型选择 tool 的方式与它产出其他一切的方式相同——写 [token](#token)(词元),在这里是一段带参数的结构化调用。模型自己从不执行任何东西;harness 读出调用,执行函数,把结果送回去。

tool 列表决定了 agent 能做什么。能力强的模型配一个窄工具集,就是一个窄 agent:它会把一切都塞进手头有的工具里,这就是为什么 agent 如此依赖 Bash——shell 是一个够到系统大部分角落的 tool。想干净地给 agent 一种能力,就为它加一个 tool;[MCP](#mcp) 是把 harness 之外的工具插进来的标准。

tool 定义在每个请求里都占 [context](#context)(上下文),所以大的工具集在任何调用发生之前就有常驻成本——而许多描述相似的 tool,会让模型更难挑中正确的那个。

_Usage:_

"agent 能直接查 staging 吗?"

"给 harness 加一个 `psql` tool,scope 限定为 staging 只读。没有对应的 tool,agent 对 filesystem 之外的一切都是盲的。"

### Tool call

[model](#model)(模型)输出中指名一个 [tool](#tool)(工具)及其参数的部分——只是结构化文本。它自己什么都不做;[harness](#harness)(宿主环境)必须读它并执行。由模型在单次 [model provider request](#model-provider-request)(模型供应商请求)中产出。

一次 tool call 的生命周期:

| 步骤 | 谁      | 发生什么                                                                  |
| ---- | ------- | ------------------------------------------------------------------------- |
| 1    | Model   | 从 [system prompt](#system-prompt)(系统提示)里的描述得知有哪些 tool |
| 2    | Model   | 产出一个调用——tool 名加参数,通常是 JSON——然后停下                         |
| 3    | Harness | 解析调用,对照 [permission mode](#permission-mode) 检查              |
| 4    | Harness | 若被允许,执行它                                                           |
| 5    | Harness | 把结果作为 [tool result](#tool-result) 放进下一个请求送回去         |

[agent](#agent)(智能体)的一个 [turn](#turn)(轮次)的工作,通常就是这样串起来的很多次往返。

因为调用和别的一切一样由 [next-token prediction](#next-token-prediction)(下一词元预测)生成,它可以用任何模型输出会错的方式出错:不存在的路径、命令没有的 flag、看似合理而非正确的参数。harness 执行的是写下来的,不是想表达的——一个打错的路径不会优雅报错,它会改错文件。

_Usage:_

"它说跑了测试,但文件时间戳根本没变。"

"看对话记录——它是真的产出了 tool call,还是只是描述了要跑?模型产出调用,但如果 harness 没执行它,就什么都没发生。"

### Tool result

[harness](#harness)(宿主环境)执行一次 [tool call](#tool-call)(工具调用)后送回的东西——文件内容、命令输出、或错误。[agent](#agent)(智能体)看 [environment](#environment)(环境)的唯一途径。它在*下一个*[model provider request](#model-provider-request)(模型供应商请求)里回到 [model](#model)(模型)面前,由模型决定怎么处理。tool call 和 tool result 是同一次交换的两端,都发生在同一个 [turn](#turn)(轮次)之内。

一条 tool result 的生命周期:

| 步骤 | 谁      | 发生什么                                                    |
| ---- | ------- | ----------------------------------------------------------- |
| 1    | Harness | 执行 tool call——跑命令、读文件                              |
| 2    | Harness | 截获结果:输出、内容或错误                                   |
| 3    | Harness | 把它作为一条消息追加进 [context](#context)(上下文)      |
| 4    | Harness | 在下一个 model provider request 里把整个 context 发给供应商 |
| 5    | Model   | 读结果并决定:再来一次 tool call,还是给出最终回答            |

结果会在这个 [session](#session)(会话)余下的时间里一直留在 context 里。tool result 通常占一个编程 session 上下文的大头:每次读文件、每次跑测试、每次搜索都全额落入,在不再有用之后的很长时间里继续占着 [token](#token)。几条大的结果——一份冗长的测试日志、一个被整读的生成文件——能把 session 推向 [context window](#context-window) 边缘的速度,比对话本身快得多。

因为结果是模型看到的一切,模型没有任何办法核查结果背后的环境。如果输出被截断了、命令悄悄失败了、或 harness 返回了错误而不是内容,模型就从它被给的这些东西出发推理。当 agent 对你系统的图景看起来不对时,tool result 是该查的地方:对话记录的某处,有一条 result 说出的和你知道的事实不一样。

_Usage:_

"它推理这个文件的方式,就像文件是空的一样。"

"tool result 回来的是权限拒绝,不是内容。模型只看到了错误字符串——它没有别的办法看到这个文件。"

### MCP

**Model Context Protocol(模型上下文协议)。**把外部 tool 服务器插进 [harness](#harness)(宿主环境)的协议——[agent](#agent)(智能体)由此获得 harness 自带之外的工具。agent 从不"调用 MCP";它调用一个 [tool](#tool)(工具),只是 harness 恰好是从某个 MCP 服务器拿到的这个 tool。协议也暴露 resources(只读数据)和 prompts(可复用模板),但提供工具是主要用途。

这个协议解决的是集成问题。没有标准时,每个 harness 都得自己做一遍 Linear 集成、自己的 Slack 集成、自己的数据库集成——各自编写和维护。有了 MCP,集成只需写一次,成为服务器,任何兼容 MCP 的 harness 都能用。harness 连上服务器,服务器宣告自己提供哪些工具,这些工具就与内置工具并列,对 agent 可用。

代价记在 [context](#context)(上下文)上。服务器宣告的每个工具都以定义的形式到达——名字、描述、参数 schema——而 [model](#model)(模型)只能调用它知道存在的工具。朴素做法是启动时把所有定义装进 [context window](#context-window)(上下文窗口):装几个慷慨的服务器,一个 [session](#session)(会话)在你输入任何东西之前,就以几千 [token](#token)(词元)的工具 schema 开局,把 [attention budget](#attention-budget)(注意力预算)花在任务永远不会用的工具上。

许多 harness 现在用 tool search 缓解这一点:context 里只放一个指向可用工具的 [context pointer](#context-pointer)(上下文指针)——agent 按名字或用途搜索工具,需要时才装载它的定义。如果你的 harness 不这么做,前置成本照付,那就值得只启用项目真正用得上的服务器。

_Usage:_

"agent 需要读 Linear 上的工单。"

"给 harness 配上 Linear 的 MCP 服务器——它把 Linear API 暴露成 agent 可调用的工具。省得你自己写定制工具包装。"

### Permission request

[harness](#harness)(宿主环境)在执行一个未被预先批准的 [tool call](#tool-call)(工具调用)之前,展示给用户的东西。[model](#model)(模型)产出一个 tool call;harness 不立即运行,而是停下来问。批准就执行;拒绝,harness 就把拒绝作为一条 [tool result](#tool-result)(工具结果)报告给模型。这是 harness 把人放进 [loop](#human-in-the-loop)(人在回路)来把关高风险或敏感动作的机制。

一次 permission request 的生命周期:

| 步骤 | 谁      | 发生什么                                                              |
| ---- | ------- | --------------------------------------------------------------------- |
| 1    | Model   | 产出一个 tool call                                                    |
| 2    | Harness | 对照 [permission mode](#permission-mode) 和已保存的批准记录检查 |
| 3    | Harness | 已预批:立即执行。否则:暂停并展示请求                                  |
| 4    | User    | 批准一次、批准整个 [session](#session)(会话),或拒绝               |
| 5    | Harness | 执行调用,或把拒绝作为 tool result 送回去                              |

拒绝一个请求,本身就是一次转向。模型像读其他 tool result 一样读拒绝并做出反应——它换个路子,或者问你倾向怎么做。大多数 harness 允许在拒绝时附一句话,这就把请求变成了转向点:"别这样,改用迁移脚本"恰好落在模型决定下一步怎么做的那一刻。

代价是每个请求都是对你的一次同步等待。[agent](#agent)(智能体)卡在那儿直到你回应——你在看着时没问题,你不在时就是麻烦:一个不断触发请求的 agent 没法放着 [AFK](#afk) 干活。permission mode 就是那个旋钮:哪些调用直接放行、哪些先问,理想情况下再配一个 [sandbox](#sandbox),让扩大放行集合变得安全。

_Usage:_

"它卡在一个 permission request 上十分钟了——我在开会。"

"这就是 human-in-the-loop 的成本。把安全的 [tool](#tool) 预批掉,让请求只在真正危险的调用上触发。"

### Permission mode

[agent mode](#agent-mode) 中负责权限闸门的部分——哪些 [tool call](#tool-call)(工具调用)触发 [permission request](#permission-request)(权限请求)、哪些自动运行。这是 mode 系统最初的目的,早于 [harness](#harness)(宿主环境)们开始往上面捆绑行为指令。

harness 们出厂自带一列这样的 mode:

| Mode               | 读取 | 写入与 shell        | 典型用途                                         |
| ------------------ | ---- | ------------------- | ------------------------------------------------ |
| Read-only / plan   | 自动 | 阻止                | 调研、规划、审查                                 |
| Default            | 自动 | 先问                | 日常有人监督的工作                               |
| Auto-edit          | 自动 | 编辑自动,shell 先问 | 可信仓库、机械性修改                             |
| "Yolo" / full-auto | 自动 | 自动                | [Sandbox](#sandbox) 内、[AFK](#afk) 运行 |

选哪一档,是在安全和打断之间做交易,两头失手的滋味都真实。太紧,你就成了瓶颈:[agent](#agent)(智能体)每隔几秒为无害的读取停下,你不假思索地点批准,批准从此失去意义——橡皮图章是两头的坏处叠加,所有打断照单全收,保护一点没有。太松,agent 就会先斩后奏,改你不该错过的文件、跑你本想先看的命令。

最松的那一档,在 sandbox 里最有理:坏掉的 [tool](#tool) 调用的爆炸半径被限制住了。在 sandbox 之外,大多数人的落点是:读取自动放行,一切不可逆的操作保留 [human in the loop](#human-in-the-loop)。

_Usage:_

"它每次 grep 都暂停——AFK run 彻底废了。"

"把只读 tool 的 permission mode 放松,写入和 shell 保持先问。调研 [session](#session)(会话)上的权限请求,大多数都是噪音。"

### Agent mode

一个预设,塑造 [agent](#agent)(智能体)运行时的工作方式——把一个 [permission mode](#permission-mode) 与注入 [system prompt](#system-prompt)(系统提示)的行为指令捆绑在一起。例子:默认档,危险调用先问;**plan mode**,阻止编辑并把 agent 导向调研;**accept-edits** 档,自动批准编辑;**bypass permissions** 档(俗称 **YOLO mode**),一切自动批准。可以在 [session](#session)(会话)中途切换。

"捆绑"正是 mode 与裸权限设置的区别所在。permission mode 只是一道路障:它决定哪些 [tool call](#tool-call)(工具调用)能通过。单有一道路障,产出的是一个想编辑但被拦住的 agent——它提交写入请求,被拦下,再试别的路。注入的指令移除的是"想":plan mode 不只是阻止编辑,它告诉 agent 自己处在规划阶段,于是它读、问、提方案,而不是顶着路障较劲。闸门和牵引指向同一个方向。

实践中,你随任务推进中信任度的变化切换 mode。同一个任务可以经过好几档:方案还在成形时用 plan mode,头几处精细编辑用先问的默认档,agent 证明它理解了改动之后用 accept-edits,[sandbox](#sandbox) 里的 [AFK](#afk) 运行用 bypass。切换 mode 不付代价:对话原地继续,只是换了权限和指令。如果你发现自己不看内容就一路批准,说明 mode 设得比你实际的信任更紧;如果你总在拒绝编辑,说明设松了。

_厂商措辞:_ Claude Code 管这些叫 "permission modes",Codex 管它们叫 "approval modes"——都早于行为捆绑的出现。

_Usage:_

"我只想要个方案,它却一个劲改文件。"

"切到 plan mode——它会挡住写入,留在调研里。"

"那待会儿的 AFK run 呢?"

"用 bypass mode,但只在 sandbox 里面。"

### Sandbox

[agent](#agent)(智能体)运行其内的一个隔离 [environment](#environment)(环境)——容器、VM、一次性的 [filesystem](#filesystem)(文件系统),或受限权限的 shell。限制 agent 动作的爆炸半径:即使 agent 跑了破坏性命令或抓了恶意的东西,损害也被关在圈里。是让 [AFK](#afk) 实际可行的安全底座。

sandbox 和 [permission mode](#permission-mode) 从相反的两端解同一个问题。permission 在动作运行前先问;sandbox 限制动作一旦运行能触到什么。permission 需要你留在 [loop](#human-in-the-loop) 里——每次提问都是一次打断——而一个不停发问的 session 几乎谈不上自主。sandbox 花的是基础设施,不是注意力:隔离越强,需要问的问题越少。

隔离分档:

| 档位       | 是什么                                | 能圈住什么                     |
| ---------- | ------------------------------------- | ------------------------------ |
| 受限 shell | 每条命令外围的 OS 级约束              | 项目之外的写入、网络访问       |
| 容器       | 全新的 filesystem,不挂载凭证,用后即弃 | agent 对自己那台机器所做的一切 |
| VM / 云    | 一台完全独立的机器,常由 harness 提供  | 一切,包括内核级的逃逸          |

没有 sandbox 圈得住的:合法越过边界的行为。拿着你的 git 凭证的 agent 可以 push;有网络访问的 agent 可以调用生产 API。先决定什么允许越界,再决定边界砌多厚。

_Usage:_

"我想让它整夜跑 [bypass-permissions](#agent-mode),但我还没准备好。"

"把它放进 sandbox——新容器,不挂凭证,不出网络。最坏情况它清了自己的 filesystem,你把容器扔掉就是。"

## Section 4 — 失败模式

### Sycophancy

自信而讨好的 [model](#model)(模型)输出。根源在 [training](#training)(训练):模型被塑造成偏爱人类喜欢的回答,而人类喜欢附和,胜过喜欢被告知"你错了"。于是模型学到:附和有奖——哪怕附和是错的。

_表现为:_

- _顶不住质疑_ —— 你一句"你确定吗?",它就推翻自己本来正确的答案。
- _夸坏输入_ —— 没分析之前,先附和你那个有缺陷的方案"很棒"。
- _带偏见的措辞_ —— 暗示代码是你写的,评审就偏正面;暗示是别人写的,就偏负面。同一份产物,两种结论。
- _模仿_ —— 把你的错误原样复述给你,当作确认。

_诊断测试:_ 没有你的引导,模型还会这么说吗?如果唯一变了的是你的语气或措辞,那就是 sycophancy(谄媚),不是分析真的变了。

_修法:_ 藏起你的偏好。提示语用中性措辞——"review this code",而不是"这段代码好不好?"。

_避免:_ 把"sycophancy"用于任何恰好讨你喜欢的错误回答。没有诊断测试,这个词和"错了"没有区别。

_Usage:_

"它说我的重构方案很棒,我问了句'你确定吗?',它整个推翻了。"

"典型谄媚——你语气自信它就附和,你语气犹疑它就反水。方案的质量没变,变的是你的语气。[清空](#clearing)后不带任何暗示地重新问。"

### Hallucination

自信但错误的 [model](#model)(模型)输出。两种类型,成因和修法都不同:

| 类型           | 哪里错了                                                                  | 成因                                                                                                                                     | 修法                                                                       |
| -------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| _Factuality_   | 编造或弄错关于世界的事实——一个不存在的函数、一个错的 API 签名、一条假引用 | [Parametric knowledge](#parametric-knowledge)(参数化知识)的空白,常发生在 [knowledge cutoff](#knowledge-cutoff)(知识截止)之后 | 装载正确的 [contextual knowledge](#contextual-knowledge)(上下文知识) |
| _Faithfulness_ | 输出偏离已装载的 contextual knowledge、用户的指令、或模型自己此前的推理   | [Attention degradation](#attention-degradation);在 [dumb zone](#smart-zone) 里加重                                           | [清空](#clearing)或[压实](#compaction)                             |

[next-token prediction](#next-token-prediction)(下一词元预测)不管底下的事实是否为真,都产出流畅的文本——模型没有任何内部信号告诉它"这个你不知道",所以一个编造的方法,和正确的方法以同样笃定的口吻到来。幻觉代码在构造上就是"貌似可行"的:它就是那个 API *如果存在*该有的样子——这恰恰让它躲过走马观花的 review,直到运行时才失败。

你得分清面对的是哪种类型,因为一种的修法会让另一种更糟。Factuality 是缺知识:修法是加 context——文档、类型定义、那个文件。Faithfulness 是知识在,但在注意力的竞争中输了:修法是减 context。把 faithfulness 误诊成 factuality,你就会再贴更多文档,context 越大,漂移越重。当 agent 出错时,先检查正确的信息是不是本来就在 context 里,再决定你面对的是哪个问题。

_避免:_ 把"hallucination"当"错了"的同义词用——不说出类型,这个词没有诊断价值。

_Usage:_

"它给 schema 编了个 `parseAsync` 方法。"

"factuality 还是 faithfulness?"

"方法在我贴的文档里有——它只是过了四十个 [turn](#turn) 之后就不看文档了。"

"那就是 faithfulness。compact 后重新加载,别再贴文档了。"

### Parametric knowledge

[model](#model)(模型)从 [training](#training)(训练)中"知道"的东西,存在它的 [parameters](#parameters)(参数)里。在训练时冻结——模型看不到自己的参数,也无法更新它。细节在挤压中丢失:数十亿条事实塞进固定数量的参数,罕见的那些变模糊了。它是模型对常见话题的流利之源,也是对罕见话题的编造之源。与 [contextual knowledge](#contextual-knowledge)(上下文知识)相对。

parametric knowledge 不是以事实的形式存储的。训练从没给过模型一个可以查东西的数据库;训练只是调整参数,直到模型擅长预测文本,而一个擅长预测某话题文本的模型,表现得就像知道这个话题。知识有多可靠,取决于它在训练数据里出现了多少:一个有数百万样本的话题被准确复现;只有零星样本的话题,模型按"类似话题长什么样"来猜。复现和猜测,对模型是同一个过程,它分不清自己正在做哪一件。编造的答案和正确的答案以同样的流利度到来。[hallucination](#hallucination)(幻觉)就是模型猜错了。

parametric knowledge 还会过时。参数在 [knowledge cutoff](#knowledge-cutoff)(知识截止)处停止变化,所以那之后发布或改名的库在参数里不存在,变过的 API 记着的还是旧样子。

两个缺口——太罕见和太新——修法是同一个:知识没法加进参数,只能作为 contextual knowledge 补进来。

_Usage:_

"它写 React 完美无瑕,却给我们的内部 SDK 编造方法。"

"React 在 parametric knowledge 里很密——数百万条训练样本。你的 SDK 不是,所以模型按'长得像的样子'补。把 SDK 文档装进 [context](#context)(上下文)。"

### Knowledge cutoff

[model](#model)(模型)的 [parametric knowledge](#parametric-knowledge)(参数化知识)止步的日期。截止之后的库、API 和事件都是编造陷阱,除非它们的文档被作为 [contextual knowledge](#contextual-knowledge)(上下文知识)装载。每次模型发布都带着自己的截止日期。

截止日期存在,是因为模型的制造方式:[training](#training)(训练)把一份文本快照烤进模型的 [parameters](#parameters)(参数),此后参数冻结。模型不知道自己的知识有边界——被问到截止日期之后的东西,它不会拒绝回答,而是从最接近的已知内容向外推。这就是陷阱无声的原因:对着旧版本库写的代码看起来可行,常常还能编译通过,只在变过的那些部分上失败。

修法永远一样:把当下的信息装进 [context](#context)(上下文)。装载 changelog,指向已安装版本的类型定义,或让 agent 上网读文档。context 里的任何东西,都胜过参数里的空白。

_Usage:_

"它一直写 v3 SDK 的语法——我们用的是 v5。"

"v5 发布在 knowledge cutoff 之后。把 v5 的 changelog 作为 contextual knowledge 装进去,否则它会继续从旧版本的 parametric knowledge 里编造。"

### Contextual knowledge

[agent](#agent)(智能体)当下可以直接从 [context](#context)(上下文)里读到的事实——用户的任务、agent 读进来的文件、[tool result](#tool-result)(工具结果)、[session](#session)(会话)开始时装载的 [AGENTS.md](#agentsmd) 内容。与 [parametric knowledge](#parametric-knowledge)(参数化知识)相对:parametric 是从参数里*回忆*;contextual 是从[窗口](#context-window)里*阅读*。agent 从 contextual knowledge 出发工作时,[hallucination](#hallucination)(幻觉)少得多——答案就在它眼前,不是从模糊的记忆里捞出来的。

两种知识里,只有 contextual knowledge 在你的控制之下。参数是冻结的,所以想给 [model](#model)(模型)它缺的知识——一个内部 SDK、一个 [knowledge cutoff](#knowledge-cutoff) 之后发布的库、一个昨天做的决定——唯一的办法是放进 context。大量实际的 [AI](#ai) 编程工作归结起来就是这件事:在模型需要的时刻,把正确的事实放到它面前。

当 contextual 和 parametric 知识冲突,通常 contextual 赢。贴上当前的 API 文档,模型就照文档来,而不是照它对旧 API 的过期记忆——不过旧版本仍可能渗出来,尤其是在长 session 的深处。如果文档明明装载了,agent 却反复退回过时的写法,那是 parametric knowledge 在渗漏、越过了 contextual;复述一遍纠正,或把纠正挪到离工作更近的位置,会有帮助。

与 parametric knowledge 不同,contextual knowledge 是有使用成本的。装进窗口的每样东西都在花 [token](#token),都在竞争模型的 [attention budget](#attention-budget)(注意力预算),所以装得多不自动等于好——目标是窗口里装相关的事实,不是所有事实。

_何时用这个词:_ 只在与 parametric knowledge 对举时用;平时直接说 **context** 就行。

_避免:_ "working memory"——contextual knowledge 是窗口*此刻*装着的东西;[memory system](#memory-system)(记忆系统)是把跨 session 的内容送进窗口的东西。尺度不同,别混。

_Usage:_

"为什么贴了文档它 API 就全对,不贴它就编?"

"文档在的时候,它用的是 contextual knowledge——照着页面读。不在的时候,是 parametric knowledge,罕见的端点就模糊了。"

### Attention relationship

[模型](#model)在预测每个 [token](#token)(词元)时,会把 [context](#context)(上下文)里的其他每个 token 都纳入考量——有些权重很重,有些几乎为零。两个 token 之间的配对就是一个 **attention relationship**(注意力关系),而有意义的配对("her"与"Sarah"、一次 `getUser()` 调用与它的 `function getUser` 定义)相互影响强于无关的配对。N 个 token 的 context,有约 N² 量级的配对关系。

模型的表面"理解力"就住在这些配对里。它解对一个代词,是因为"her"与"Sarah"之间的 attention relationship 强;它用对参数调用了一个函数,是调用点与它早前读过的定义之间的关系在起作用。这些都不是查出来的——而是在每次 [model provider request](#model-provider-request)(模型供应商请求)上、对每一对新鲜算出来的。

N² 这个数字值得停下来感受一下,因为它增长得比直觉快:

| Context 大小  | 配对数(约 N²) |
| ------------- | ------------- |
| 1,000 token   | 约 100 万     |
| 10,000 token  | 约 1 亿       |
| 100,000 token | 约 100 亿     |

而且每个配对还被计算不止一次。模型有多个 attention head(注意力头)——前沿模型的确切数字未公开,五到一百是合理的猜测——每个 head 都独立计算所有关系。上表里的每个配对,都要在每个 head 上再重复一遍。这是很大量的配对。

对任何一个给定任务,这些关系里只有少数是重要的。你的指令和它所约束的代码之间的配对,是屈指可数的有用配对之一;池子里几乎所有其他东西都是噪音。而且两者增长速度不同:重要的关系大致保持恒定,总池子随 context 大小二次方增长。1,000 token 时,你在乎的配对是百万分之一;100,000 token 时,是百亿分之一。这就是 [attention budget](#attention-budget)(注意力预算)底下的算术,而 [attention degradation](#attention-degradation) 就是重要关系的份额被摊得太薄时的体感。

_Usage:_

"它一直在 diff 里混淆两个 `user` 符号——听着像我们进 [dumb zone](#smart-zone) 了。"

"对,每个调用点和它的声明之间的 attention relationship 在和另一对打架——token 形状相同,绑定不同。重命名一个,配对就清晰了。"

### Attention budget

每个 [token](#token)(词元)可分配给 [context](#context)(上下文)其余部分的影响力是有限的。对[某一段关系](#attention-relationship)影响重了,留给其他关系的就少了。这个预算按 token 计,不随 context 变大而变多——这就是为什么长 [session](#session)(会话)会稀释一切。

把它想成信号和噪音。你的指令是一段固定音量的信号;[context window](#context-window) 里的其他每个 token 都是 competing sound(抢耳朵的声音)。指令不会变小声——它还在那儿,一个字符不少——但 context 越长,房间越吵,信噪比越低。在 10k token 的 context 里最响亮的指令,到 150k 时成了背景嗡嗡声。这就是 [attention degradation](#attention-degradation) 背后的机制:模型没有忘记;信号淹没在噪音里了。

症状读起来像不服从——agent 早先答应过的约束后来慢慢漂走,重新贴一遍约束也只管一小会儿。原因不在指令;在窗口里所有和它抢注意力的其他东西。

你能控制的是放进 context 的东西。不服务任务的内容不是中性的——它是盖在所有有用内容上的噪音。让窗口保持小,[clear](#clearing)(清空)当累积的 context 开始入不敷出的时候,重要的约束要重申,别指望开头提一嘴能管到最后。

_Usage:_

"为什么它一直无视我贴在最上面的 schema?"

"我们早就进了 [dumb zone](#smart-zone)——每个 token 的 attention budget 是固定的,context 却一直在涨。schema 上的信号,现在在和几千个更新的 token 抢注意力。"

### Attention degradation

[session](#session)(会话)变长时,每个 [token](#token)(词元)的 [attention budget](#attention-budget)(注意力预算)被摊给更多竞争者。任何一段[有意义关系](#attention-relationship)上的信号变小;无关 [context](#context) 的噪音挤进来。同一个 [model](#model),同一份 [parameters](#parameters)——只是同一盘菜要喂的嘴更多了。smart zone / dumb [zone 现象](#smart-zone)的成因。

它表现为模型在 session 中途变差:遵守了一个小时的约束开始松脱,它重新问已经被告知过的事,它写出无视早前读过文件的代码。模型本身没有任何变化——唯一的变量,是它此刻正在关注的 context 有多少。

它是渐变的,这正是从 session 内部难以察觉的原因。没有报错,没有阈值;每个 [turn](#turn)(轮次)只比上一个差一点点,等你明显看出滑落时,你已经在 dumb zone 里待了一阵了。

恢复靠移除 context,不靠添加。把被无视的指令重贴一遍,只是往已经拥挤的窗口里再加一个竞争者,只管一小会儿。有效的是:[clear](#clearing)(清空)后只重新装载任务需要的部分,或者 [compact](#compaction)(压实),或者 [hand off](#handoff)(交接)给一个新 session。把指令遵循度的下降当作 context 长度的信号,而不是模型的信号。

_Usage:_

"它深深陷在 dumb zone 里了——编造类型文件里不存在的泛型。"

"attention degradation。类型定义还在 context 里,但它们上面的信号,被我们之后塞进去的所有东西埋了。清空重载。"

### Smart zone

[session](#session)(会话)早期,[agent](#agent)(智能体)处在 smart zone——锐利、专注、回忆良好。session 变长后,它漂进 dumb zone:更马虎、更健忘、错误更多——faithfulness 类的 [hallucination](#hallucination)(幻觉)也更多。同一个 [model](#model),同一个 [harness](#harness)——只是 [context](#context) 更多。[attention degradation](#attention-degradation) 的体感效果。在前沿模型上,dumb zone 常见于大约 125K–150K [token](#token) 处开始——这一点尚有争议。session 膨胀时就 [clear](#clearing)(清空)或 [compact](#compaction)(压实);别硬撑。

下滑是渐变的,这让它容易不被察觉。没有错误信息,没有可见的边界;agent 只是开始表现得稍微差一点,然后明显差一截。常见信号:它忘记你二十个 turn 之前给的指令,重复一个它已经纠正过的错误,或自信地断言 context 明明与之矛盾的东西。因为滑落是平滑的,常见的反应是硬撑着重加解释——这只会增加 context,让问题更糟。

zone 的分界不跟着 [context window](#context-window) 的上限走。一个 session 可以深陷 dumb zone 而窗口还大半空着:上限是 harness 拒绝继续的地方,但质量早在此之前就开始掉。按 smart zone 规划,别按窗口规划——一个任务的务实预算,是 agent 表现良好的那段 token 数,不是它技术上装得下的 token 数。

smart zone 是一笔预算,无关的工作也在花它。session 里做的每个任务都消耗 token,所以在同一个 session 里开第二个任务,意味着起点离 dumb zone 更近。一个 session 一个任务,让每个任务都拿到 session 最锐利的那段。单个任务大于一个 smart zone 时,拆分它:在自然的边界处 [hand off](#handoff)(交接)或 compact,让一个新 session 做下一块。

_Usage:_

"前三个组件它都拿捏了,第四个就砸了。"

"你已经出了 smart zone——同一个模型,只是现在深陷 dumb zone。compact 后重新装载方案,下一个组件就能落好。"

## Section 5 — 交接

### Clearing

结束当前 [session](#session)(会话),开一个全新的。下一条消息从一个空 session 和一个空 [context window](#context-window)(上下文窗口)开始。通常由用户发起。

clearing 是被污染 context 的解药。一个 session 会积累一切:失败的尝试、走错的路、过期的 [tool result](#tool-result)(工具结果)、被放弃的方案。[model](#model)(模型)在每个 [turn](#turn)(轮次)都重读这一切,坏历史拖累新工作。深陷长 session 时,[agent](#agent)(智能体)越来越含糊、越来越不听话——明确给过的指令被无视,质量下滑,催它也没用,因为它蹚着的那片噪音还在它的 [context](#context) 里。clearing 移除噪音。

clearing 不抹掉对话记录。大多数 [harness](#harness)(宿主环境)把 session 历史留在你的电脑上,记录还在,可以翻阅也可以恢复。消失的是 agent 的工作状态:model 是 [stateless](#stateless)(无状态)的,新 session 对旧 session 知道的事一无所知。如果 session 里有下一个 session 需要的决定或进展,先让 agent 写一份 [handoff artifact](#handoff-artifact)(交接产物),再开新 session 并指向它。

对比 [compaction](#compaction)(压实):它把 session 摘要进新 context,而不是从空开始。clearing 是更钝的工具:什么都不带走,包括垃圾。

_Usage:_

"它卡在那个失败的测试上打转。"

"直接 clear——开个新 session,带上方案文档和测试文件。跟现有的 context 较劲没有意义。"

### Handoff

把 [agent](#agent)(智能体)的 [context](#context)(上下文)从一个 [session](#session)(会话)转移到另一个。携带机制多样——写下来的 [handoff artifact](#handoff-artifact)(交接产物)、内存里的摘要([compaction](#compaction)(压实))等。与 [clearing](#clearing)(清空)不同(后者完全不转移)。动因也多样:切换角色(规划者 → 执行者)、启动一次 [AFK](#afk) 运行、分派给并行的多个 session,或腾出 [context window](#context-window)(上下文窗口)的空间。

接收方 session 从零 context 起步——[model](#model)(模型)是 [stateless](#stateless) 的,旧 session 的任何东西对新 session 都不可见。下一个 session 需要什么,就得显式携带什么;其余的都没了。"没有回头路"是塑造携带方式的那个约束:新 session 没法去问旧 session"你当时是什么意思",所以被携带的材料必须自己站得住。

| 机制             | 形态                                     | 特点                                                         |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------ |
| Handoff artifact | [environment](#environment) 里的文件 | 在任何东西依赖它之前,你可以先读它、改它;可复用给多个 session |
| Compaction       | context window 里的摘要                  | 自动且便宜;较难检查;只喂一个继承者                           |

坏 handoff 的可见失败是重新翻案:新 session 把旧 session 已经定下的事重新开议,因为携带的材料记下了"定了什么",却没记"为什么"。评判一个 handoff 的标准是:一个零 context 的 session,拿着它能把事情推进到什么程度。

_Usage:_

"规划 session 越来越重——要不要硬撑下去?"

"做个 handoff。把决定写进一份文档,clear,开一个读着它的新 session 做实现。"

### Primary source

以其本来面目存在的真相来源——代码、对话记录、原始日志、真实的 API 响应。不是对事物的转述;就是事物本身。与 [secondary source](#secondary-source)(二手来源)相对。

想知道你的代码库做什么,代码就是 primary source(一手来源)。文档、架构图、README,都是对它的描述——落笔时准确,此后各自按自己的时间表过时。当 [agent](#agent)(智能体)自信满满地说错你项目的某件事,要问的问题是:它是从哪个来源出发的——读了文档的 agent 继承了文档的陈旧;读了代码的 agent 读的是当下的真相。

代价是 primary source 没能成为默认选项的原因。把它装进 [context window](#context-window) 很贵——整个文件、整段记录、每个 [token](#token)(词元)都按 [input tokens](#input-tokens)(输入 token)计费、都在竞争 [attention budget](#attention-budget)(注意力预算)。这份价钱换到的是完整性:没有经过别人对"什么重要"的预筛选。上个月写的摘要,装不下今天才发现重要的那个细节;primary source 还装得下。

精度要紧的时候——确切的签名、真实的报错、抛异常的那一行——就动用 primary source。管理 [context](#context)(上下文)的大部分功夫,就是决定什么时候为 primary source 付钱、什么时候 secondary source 够用。

_Usage:_

"agent 说重试逻辑是指数退避,可我眼看着它在猛打那个端点。"

"那是它从设计文档里读来的。让它指向真正的重试模块——行为要紧时,从 primary source 出发。"

### Secondary source

对 [primary source](#primary-source)(一手来源)的转述,隔了一层——描述代码的文档、概述对话记录的摘要、汇总搜索结果的报告。装进 [context window](#context-window)(上下文窗口)比它所描述的来源便宜,而且构造上有损:写它的人决定了什么重要,他丢掉的部分,只读摘要的读者永远看不见。

大量的 [context](#context)(上下文)工程,就是制造 secondary source(二手来源)。[compaction](#compaction)(压实)把 [session](#session)(会话)历史变成播种下一个 session 的摘要。[subagent](#subagent)(子代理)在嘈杂的搜索上烧掉自己的 context,只带回一份简短报告。[handoff artifact](#handoff-artifact)(交接产物)把一个 session 的决定浓缩成下一个 session 要读的文档。[memory system](#memory-system)(记忆系统)把 session 学到的东西蒸馏成笔记。每一样都在做同一笔交易:用保真度换空间。

secondary source 以两种方式失败。有损——丢了 schema 决定的压缩摘要、没提边界情况的报告。漂移——primary source 变了,转述没跟上,于是文档用这一季的自信描述上一季的架构。当 [agent](#agent)(智能体)基于一条已经以任一方式失效的 secondary source 行动,它从错误的信息出发干劲十足;修法是把它送回 primary source。

但这两种失败都不能判 secondary source 死刑。context window 有限,primary source 又贵;没有摘要、报告和交接文档,什么都装不下。真正的功夫是知道哪些细节扛得住损耗——以及哪些扛不住时,回到 primary source 验证。一个做得好的 secondary source,带着一个指回原物的 [context pointer](#context-pointer)(上下文指针)——摘要里写明它出自哪份记录,文档里写明它描述的是哪个文件——当转述不够用时,读者可以顺着指针走,而不是对着残缺硬干。

_Usage:_

"交接文档说 auth 已经完成,可新 session 老发现 token 刷新是坏的。"

"那份文档是 secondary source——上一个 session 写下的是它相信的,不是真的。让新 session 跑一遍 auth 测试,以 primary source 为准。"

### Handoff artifact

作为 [handoff](#handoff)(交接)携带机制使用的文档——由一个 [session](#session)(会话)写进 [environment](#environment)(环境),给另一个 session 读。[spec](#spec)、[ticket](#ticket) 和方案文档都是 handoff artifact(交接产物)。

要写它的原因:[model](#model)(模型)是 [stateless](#stateless)(无状态)的,session 里的一切都活不过 [clearing](#clearing)(清空)。决定、约束、做了一半的方案——都随承载它们的 [context](#context)(上下文)一起消失。environment 是持久的。把重要的状态写进文件,就是把它挪到下一个 session 能读回来的地方。

artifact 是一种 [secondary source](#secondary-source)(二手来源)——对 session 工作的转述,不是工作本身。这让它小到足以给一个全新的 session 做简报,也是它可能误导新 session 的原因:它记下的是写它的 session 相信的东西,它漏掉的或写错的,读者无从察觉。凡是重要的断言,下一个 session 应该对着 [primary source](#primary-source)(一手来源)——代码、测试——验证,而不是照单继承。

好的 artifact 是写给一个零 context 的读者看的。具体的文件路径,而不是"我们讨论过的那个文件"。决定了什么、为什么这么决定,让下一个 session 不必重新开议。做完了什么、还剩什么。告诉写它的 session 这份文档的去向也有帮助:"为一个对这项工作一无所知的新 session 写一份交接文档。"

另一种携带机制是 [compaction](#compaction)(压实),在内存里摘要。artifact 有两个优势:它住在磁盘上,在任何东西依赖它之前,你可以先读它、改它;而且它可以复用——同一份 spec 可以给五个并行 session 做简报。

_Usage:_

"这个活怎么在规划 agent 和实现 agent 之间分工?"

"让规划 agent 写一份 handoff artifact——文件路径、决定、约束。实现 agent 的 session 开场就指向这份 artifact,把它当作简报来干活。"

### Spec

描述一项跨多个 [session](#session)(会话)的工作的 [handoff artifact](#handoff-artifact)(交接产物)——写的是建的是什么,不是每个 session 怎么做它那一份。随工作推进而演化。由 [ticket](#ticket) 组成。

spec 存在的理由是:session 是一次性的,大工作不是。任何超过一个 [context window](#context-window) 工作量的事情,都需要一个 [context](#context)(上下文)之外的家——agent [environment](#environment)(环境)里某个能在 [clearing](#clearing)(清空)后幸存的地方,可以是仓库里的文件、GitHub issue,或 agent 够得着的 issue tracker。spec 就是那个家:目标、约束、到目前为止的决定、ticket 清单及其状态。任何一个新 session 读它,就能知道工作进行到哪,而不必继承上一个 session 积累的噪音。

spec 有几种一眼可辨的风格,大多继承自团队本来记录事情的方式。_product requirements document_(PRD,产品需求文档)偏向面向用户的"是什么、为什么"——功能、行为、验收标准。_design doc_ 或 _RFC_ 偏技术——选定的方案、被否决的备选、权衡取舍。往小了说,一个带 ticket 清单的朴素 `plan.md`,对一个跨 session 的功能干的是同一件事。风格没有角色重要:对 [agent](#agent)(智能体)来说,这些全是同一个东西——它每个 session 开始时都要读的那份持久的意图声明。

_Usage:_

"这些活该全塞进一个 session 吗?"

"不,写成一份 spec——拆成 ticket,每条在自己的 session 里跑。想在一个 context 里干完全部,半路就进 [dumb zone](#smart-zone) 了。"

### Ticket

圈定一个 [session](#session)(会话)工作量的 [handoff artifact](#handoff-artifact)(交接产物)。可以独立存在,也可以作为子项挂在 [spec](#spec) 下。ticket 之间可以互相阻塞、或被兄弟 ticket 阻塞,于是工作的次序从依赖图里自然浮现,而不是来自一份线性计划。

定义性的约束是尺寸:一个 session。一张 ticket 应该能在 session 滑出 [smart zone](#smart-zone) 之前完成——而且这个约束是可检验的。如果你的 ticket 上的 session 常常活没干完就先劣化,ticket 太大了;拆。如果每个 session 大部分 [context](#context) 花在准备工作上、真正的活只干了五分钟,ticket 太小了;合。

好的 ticket 是写给一个没有其他 context 的读者的。目标、验收标准、指向相关文件和决定的 [context pointer](#context-pointer)(上下文指针)——足够让 session 不必重新推导上一个 session 已经知道的东西就能开工。

依赖图也是并行化的开关。互相独立的 ticket——图上的叶子——可以各自在自己的 session 里同时跑。这是同时运行多个 agent 的有效方式。

_Usage:_

"迁移 spec 从哪儿开工?"

"看 ticket 图——schema 变更阻塞回填,回填阻塞 API 切换。挑一张叶子,给它开一个 session。"

### Compaction

在内存里完成的 [handoff](#handoff)(交接):上一个 [session](#session) 的历史被摘要成一段总结,再由这段总结播种一个新 session。有损是设计使然:原始记录是 [primary source](#primary-source)(一手来源),摘要是 [secondary source](#secondary-source)(二手来源)——用细节换余量。由用户手动触发,或经 [autocompact](#autocompact) 自动触发。

机制如下:[context window](#context-window) 有限,而一个长 session 会把它填满——每条 [tool result](#tool-result)、每次读文件、每次走错的路,都留在历史里。等它变得沉重,[harness](#harness)(宿主环境)会让 [model](#model)(模型)摘要这个 session,扔掉原始历史,再用摘要播种新 session。没进摘要的,就从 context 里消失了。一些 harness 会缓和这一点:把旧的原始记录留在磁盘上,并在摘要里留一个指向它的 [context pointer](#context-pointer)(上下文指针)——二手来源回链一手来源,摘要丢掉的细节可以靠重读原文找回。

摘要是 model 写的,所以它可以被提示。"把 schema 决定保留下来"这样的指令,能让生成的产物更有章法。时机同样重要——在阶段边界、方案定下来之后 compact,别在任务中途。

与 [clearing](#clearing)(清空)对比:clearing 把一切丢掉、冷启动;compaction 设法把要点带过去,clearing 则赌这些要点已经写在了更好的地方。

_Usage:_

"[Context](#context) 越来越重,可我还有一轮测试要跑。"

"开始前先 compact——把必须存续的内容写进摘要提示里,让新 session 保住 schema 决定、丢掉探索过程。"

### Autocompact

[context window](#context-window)(上下文窗口)接近装满时,由 [harness](#harness)(宿主环境)自动触发的 [compaction](#compaction)(压实)。

harness 盯着 context window 的满溢程度。越过某个阈值——常常在 80% 左右——它就暂停,要求 [model](#model)(模型)摘要目前为止的 [session](#session)(会话),并用摘要播种一个新 session。工作随即继续,仿佛什么都没发生。

只是确实发生了什么。compaction 是有损的,而 autocompact 在一个你没选的时刻有损。手动的 compact 发生在阶段边界,你可以告诉模型要保留什么。autocompact 在任务中途、只要阈值被触到就开火——可能正开在重构的一半,由摘要自己决定你的哪些决定值得保留。经典症状:[agent](#agent)(智能体)干劲十足地继续,却悄悄忘掉了一个你一小时前定下的约束,你直到它的工作开始与那条约束矛盾时才察觉。

防御是不让它开火。盯着 context 指示器,在自然的边界手动 compact;或者把决定写进方案文档或磁盘上的 [handoff artifact](#handoff-artifact)(交接产物),那里没有摘要能弄丢它们。大多数 harness 还允许自定义缓冲——把阈值调早或调晚,或干脆关掉 autocompact——你可以调出开火之前自己想保留多少余量。

_Usage:_

"它好像不记得我们之前对 schema 的决定了。"

"autocompact 在两个 [turn](#turn) 之间开火了——早期的决定被摘要,肯定丢了东西。重新装载方案文档,或者下次手动 compact,让你自己控制什么被保留。"

## Section 6 — 记忆与引导

### Memory system

一个试图让 [agent](#agent)(智能体)跨 [session](#session)(会话)[stateful](#stateful)(有状态)的系统。在 session 期间把信息持久化进 [environment](#environment)(环境),在未来 session 开始时装回 [context window](#context-window)(上下文窗口),让 agent 在你 [clearing](#clearing)(清空) session 之后仍然带着连续性。

memory system(记忆系统)分两半。写路径:session 期间,agent 把它学到的东西——你声明的一个偏好、项目的一个事实——写成 environment 里的文件。读路径:session 开始时,[harness](#harness)(宿主环境)把这些文件,或它们的索引,装回 context window。很多 harness 自带 memory system——Claude Code 的 `/memory` 是一个——但你自己也能搭一个:一个笔记目录,加上 [AGENTS.md](#agentsmd) 里的一条"要查阅它"的指令。

任何常驻装载内容会有的权衡,这里同样适用。记忆会累积,所以大多数系统只装载一行索引,把正文留在 [context pointer](#context-pointer)(上下文指针)后面,而不是全文内联。而且记忆是 [secondary source](#secondary-source)(二手来源),会漂移:三月记下的事实,六月照样同样自信地装载,哪怕项目早已走远。memory system 需要修剪,和 AGENTS.md 一个道理。

_Usage:_

"我一直得反复告诉它我用的是 Postgres,不是 MySQL。"

"接一个 memory system——第一个 [turn](#turn)(轮次)就把它学到的东西写进 [filesystem](#filesystem)(文件系统),session 开始时重新装载。[model](#model)(模型)本身是 [stateless](#stateless) 的;记忆层负责伪造连续性。"

### AGENTS.md

[environment](#environment)(环境)里的一个文件,[harness](#harness)(宿主环境)在 [session](#session)(会话)开始时把它装进 [context window](#context-window)(上下文窗口)——项目写给 [agent](#agent)(智能体)的常备简报。跨 harness 的通用约定;一些 harness 还有自己的变体(Claude Code 的是 CLAUDE.md)。

因为它自动装载,它是避免跨 session 重复自己的一个办法。[model](#model)(模型)是 [stateless](#stateless)(无状态)的——你在某个 session 里给过的纠正,下一个 session 就没了,于是你不得不向每个新 session 重申:项目用 pnpm、测试要带某个特定 flag、某个目录是生成的别碰。当你为同一件事纠正过 agent 两次,这条纠正就是 AGENTS.md 的候选行。

合适的内容是 agent 无法从代码推导出来的东西:构建和测试命令、代码库没写明白的约定、硬性约束("绝不编辑生成的 client")。短小、陈述式——它是简报,不是文档。

代价是它里面的一切都永远装载。指令会累积,而且大多数与任何给定任务无关;一份长长的 AGENTS.md 既烧 [token](#token),又稀释自己——context 里的指令越多,模型对其中任何一条的遵循越不可靠。

_避免:_ 把本该 [progressively disclosed](#progressive-disclosure)(渐进披露)的内容放进 AGENTS.md——它里面的每一样,每个 [turn](#turn)、每个 session 都在付 [token](#token) 账,不管那个 session 需不需要。风格指南可以放到一个 [skill](#skill) 或 [context pointer](#context-pointer)(上下文指针)后面;AGENTS.md 只留放之四海的行。

_Usage:_

"为什么每个 session 一开场就烧掉 4k token?"

"查一下 AGENTS.md——有人把整本风格指南粘进去了,而不是放在 skill 后面。"

### Progressive disclosure

只装载 [agent](#agent)(智能体)当下需要的 [context](#context)(上下文),其余用 [context pointer](#context-pointer)(上下文指针)指向。借自 UI 设计,在那里它的意思是:只向用户展示与当前任务相关的控件,其余藏在一次点击后面。

这门技术存在,是因为 context 的账要付两遍。每个预先装载的 [token](#token)(词元),每个 [turn](#turn)(轮次)都按 [input tokens](#input-tokens)(输入 token)计费;而且不管 agent 需不需要,每个 token 都在花 [attention budget](#attention-budget)(注意力预算)。一份塞满完整风格指南、部署手册、数据库约定的 [AGENTS.md](#agentsmd),会让 agent 样样都变差——当前任务用得上的指令,被用不上的稀释了。症状是:agent 无视你明知就在它 context 里的规则——规则在,只是被埋了。

progressive disclosure(渐进披露)把它倒过来。常驻装载层保持小——每个主题一句话,加一个指向细节所在处的指针。agent 写组件时读风格指南,部署时读部署手册,修测试时两者都不读。[skill](#skill) 就是内建于 [harness](#harness) 的这个模式:一段简短描述每个 [session](#session) 都装载,完整指令只在被触发时才装。

_Usage:_

"要把整本风格指南倒进 AGENTS.md 吗?"

"不要——用 progressive disclosure。把风格指南做成一个 skill,agent 真要写组件时才装载。AGENTS.md 每个 turn 都在付 token 账。"

### Context pointer

一份文档里指向另一份的提及,[agent](#agent)(智能体)只在任务需要时,才把后者拉进 [context window](#context-window)(上下文窗口)。是 [progressive disclosure](#progressive-disclosure)(渐进披露)赖以搭建的单位。

用指针(而不是内联内容)的理由是成本。一个指针只是 context window 里的一行。它背后的文档可能有好几千 [token](#token),但在 agent 真的去跟随指针之前,这些 token 一个都不计费。把一份 2000 token 的部署手册内联进 [AGENTS.md](#agentsmd),每个 [session](#session)(会话)都为它付钱;换成"deploy process: see `internal/deploy.md`",只有真正部署的 session 才装载它。任务匹配时,agent 用一次 [tool call](#tool-call)(工具调用)跟随指针。

一个指针要能用,需要两样东西:一条稳定的路径,和足够的描述让 agent 知道何时值得跟随。裸路径是指针里 agent 没有理由跟的那种;"see `internal/deploy.md`"但不提里面有什么,需要它的 session 也会跳过。把这一行写成任务出现时的样子:"release、deploy 或 rollback——先读 `internal/deploy.md`"。

一旦留心,指针无处不在:[AGENTS.md](#agentsmd) 里的行、[skill](#skill) 的描述(harness 装载描述;skill 正文在它后面等着)、目录列表里的文件名、文档之间的链接。

指针还可以把一个 [secondary source](#secondary-source)(二手来源)拴回它所出自的 [primary source](#primary-source)(一手来源)——写明原始对话记录的压缩摘要,写明它描述的是哪个源文件的文档。这让二手来源的有损变得可恢复:当摘要不够用时,agent 顺着指针去读原文,而不是对着摘要保留下来的东西硬干。

_避免:_ "reference"——太干瘪;传达不出"跟随它会拉进更多 context"的意思。"Portal"——太花哨。

_Usage:_

"AGENTS.md 越来越大了。"

"里面大部分应该是 context pointer,不是内容。常驻的规则留在内联;把部署手册和风格指南做成 skill,在原地留一个 context pointer。"

### Skill

一个打包成单元的可传授能力——把一件事做好的指令与资源,放在 [environment](#environment)(环境)里,直到一个 [context pointer](#context-pointer)(上下文指针)为手头的任务把它拉进 [context window](#context-window)(上下文窗口)。[harness](#harness)(宿主环境)里承载 [progressive disclosure](#progressive-disclosure)(渐进披露)的单位。

skill 是开放标准,定义在 [agentskills.io](https://agentskills.io)——最初由 Anthropic 开发,此后被大多数主流 harness 采纳,所以一个 skill 写一次,到处能用。格式是一个文件夹,内含:

- 一个 `SKILL.md` 文件——元数据(至少有名字和描述)加指令本身
- 可选的、[agent](#agent)(智能体)可以运行的脚本
- 可选的、指令所指向的模板和参考资料

默认只有名字和描述占着 [context](#context)(上下文)。agent 的任务匹配时,它才装载其余部分。在那之前,skill 几乎不占地方——一两句话的 [token](#token),不管它的完整指令有多大。

这是 skill 与 [AGENTS.md](#agentsmd) 的分野:后者不管任务是什么,每个 [session](#session)(会话)都装载。skill 在某类工作出现时才被读——发布、搭一个新服务的脚手架、写一次迁移——其余时间被无视。

_避免:_ "[tool](#tool)"——tool 是 agent *调用*的东西;skill 是它 *阅读*的指令。

_Usage:_

"部署手册该放哪儿?"

"做成 skill——agent 只在任务涉及部署时才装载。放 AGENTS.md 的话,我们每周用一次的东西,每个 [turn](#turn)(轮次)都在烧 token。"

### Subagent

一个由另一个 agent 通过 [tool call](#tool-call)(工具调用)派生的 [agent](#agent)(智能体)。运行在自己的 [session](#session)(会话)和自己的 [context window](#context-window)(上下文窗口)里,只回报一个 [tool result](#tool-result)(工具结果)。与 [handoff](#handoff)(交接)不同——父 agent 明确期待它回来;handoff 没有回头路。**不能再派生 subagent(子代理)**——树只有一层深。subagent 的存在是为了隔离 [context](#context),不是为了搭层级。

要点是把嘈杂的工作挡在父 agent 的 context 之外。一次宽泛的搜索或一场漫长的读文件远征,会产出几十页 tool result,其中大多数只在找到答案之前有用。跑在父 agent 里,这一切会在 session 余下的时间里一直躺在父 agent 的 context 中。跑在 subagent 里,噪音填进一个一次性的窗口——只有最终报告落进父 agent 的 context。报告是一个 [secondary source](#secondary-source)(二手来源):父 agent 得到的是 subagent 对发现之物的转述,不是原始结果,报告漏掉的,父 agent 无从看见。

subagent 还可以并发——父 agent 可以对相互独立的工作一次派出好几个。

_Usage:_

"grep 的结果快把我的 context 撑爆了。"

"派一个 subagent 去搜——让它自己的 context window 承接噪音,只回报你真正需要的那两个文件路径。"

## Section 7 — 工作模式

### Human-in-the-loop

一种工作模式:一个或多个人在 [session](#session)(会话)中与 [agent](#agent)(智能体)搭档——实时审查、转向、协作。人在场、在参与,不只是给单个动作放行。

对比的另一面是 [AFK](#afk) 工作:agent 无人值守地跑,你事后评判结果。human-in-the-loop(人在回路)意味着在问题还便宜的时候抓住它:你看到 agent 伸手拿错了文件、误读了需求、或开始钻进一条死胡同,一句话就能把它掰回来——而不是二十分钟后,发现一大坨自信的工作全建立在那个错误上。agent 不可靠地知道自己跑偏了;没人管的时候,它们倾向于硬着头皮往前推,而不是停下来问。

哪种模式合适,取决于工作本身。规格清晰、低风险、易于验证的任务适合 AFK。含混的、不可逆的、或成品难以审查的任务——schema 迁移、棘手的设计决定、一切碰生产环境的东西——适合留在回路里。判断标准本质上是一句话:一次跑偏有多贵?你多晚才会发现?

有些工作天然就是在回路里的,因为你的反应就是输入。[grilling](#grilling) 只有你在场回答问题才成立;[prototyping](#prototyping) 只有你在场对产物做反应才成立。

留在回路里花的是你的注意力,而注意力是稀缺资源。用 agent 越用越好的一个部分,就是把更多工作安全地挪出回路——用方案、[automated check](#automated-check)(自动检查),和收尾时的 [human review](#human-review)(人工审查),替代全程监督。

_Usage:_

"这个挂一晚上 AFK?"

"不行,schema 迁移——保持 human-in-the-loop。我要看到每一步,万一它选错了回填的列,我好掰它。"

### AFK

Away from keyboard(离开键盘)。一种工作模式:用户启动一个 [session](#session)(会话),然后走开,让 [agent](#agent)(智能体)无人值守地跑。[AI](#ai) 编程的吞吐量倍增器——你睡觉、吃饭、干别的事情时,许多 AFK session 可以并行跑。通常需要宽松的 [permission mode](#permission-mode) 加上 [sandbox](#sandbox) 才安全。

你不在的时候,agent 处理含混的方式不一样。你在看着时,一个含混的决定会以提问的形式浮出来,你来回答;你走开之后,agent 自己挑一个默认值继续走,之后的每个决定都建立在那次猜测上。典型的失败是:回来看到几小时成果满满、自信满满的工作,建立在头十分钟一个错误的决定上。工作并不马虎——它自洽,只是对错误的事情自洽。

既然运行中没法给输入,就把输入放在运行之前和之后。之前:提前消解含混——来一场 [grilling](#grilling),或写一份 [spec](#spec)——让 agent 要独自填补的空隙更少。期间:[automated check](#automated-check) 和 [automated review](#automated-review)(自动审查)顶替你缺席的注意力,凡是能机械捕捉的,让它尽快失败。之后:运行要结束在可审查的东西上——一个 PR,而不是已经合并的改动。AFK 并没有取消 [human review](#human-review)(人工审查);它把全部审查推迟到结尾,所以结尾到达的东西必须值得审查。这也是 [AX](#ax) 在 AFK 运行中最要紧的原因——没人看着,environment 是 agent 得到的唯一支持。

_避免:_ "background agent"——它把重心放在机器上("在后台运行"),而不是人的模式("人走开了")。AFK 点名的那件要紧事是:用户没在看。

_Usage:_

"这个我要 AFK 跑——三个 sandbox 里的 agent 做重构,早上起来审 PR。"

"[Bypass permissions](#agent-mode)?"

"对,只读 [filesystem](#filesystem),断网。"

### Automated check

在 [environment](#environment)(环境)里运行的确定性验证——测试、类型检查、lint、构建、pre-commit 钩子。过/不过,不做判断。这是 [agent](#agent)(智能体)不需要任何人参与就能自我纠正的信号。flaky test(不稳定的测试)是坏掉的 check,不是"没有 check";automated check(自动检查)在设计上就是确定性的。

自我纠正以循环的方式工作。agent 做一个改动,把 check 当作一次 [tool call](#tool-call)(工具调用)来跑,失败输出落进它的 [context window](#context-window)——一条带文件和行号的类型错误,一条带期望值和实际值的断言失败。这足够它修好问题再跑一遍 check,如此往复直到通过,全程无需人参与。确定性是让这个循环可信的东西:同样的代码永远得到同样的判决,通过才有意义。一个 flaky 的 check 会毒化这一切——agent 去"修"没问题的代码,或在真失败上无限重试。

这就是为什么好的 check 是代码库 [AX](#ax) 的很大一部分。一个有严格类型、快速测试套件和 linter 的仓库里,agent 在你看到之前就抓住了自己大部分错误;一样都没有的仓库里,agent 产出什么就交什么。差别在 [AFK](#afk) 运行中最大——那是整个运行期间唯一的验证。但 check 只抓它断言的东西——绿灯意味着被断言的性质成立,不意味着代码是对的。判断形状的空隙,留给 [automated review](#automated-review)(自动审查)和 [human review](#human-review)(人工审查)。

_避免:_ "feedback loop" / "backpressure"——两者都把 check 和 review 混为一谈。_避免:_ "test"——测试是 automated check,但不是所有 automated check 都是测试。

_Usage:_

"AFK run 里 agent 一直交坏代码。"

"[sandbox](#sandbox) 里接了哪些 automated check?"

"只有单元测试。"

"加上 typecheck 和 lint——PR 落地之前它就能靠这些自我纠正了。"

### Automated review

一个 [agent](#agent)(智能体)审查另一个 agent 的工作,常用不同的 [model](#model)(模型)或 [system prompt](#system-prompt)(系统提示)。非确定性:它做出判断。跑在哪都行——PR 合并前、提交历史上做事后审查、或 [session](#session) 中途作为一个 [subagent](#subagent)(子代理)。CI 里的 LLM-as-judge 是 automated review(自动审查),不是 [automated check](#automated-check);决定类别的是断言*做什么*,不是它在哪儿跑。

与干活的 agent 分离,正是它有效的原因。让写代码的 agent 审自己的作品,收获很小——产生 bug 的那个 [session](#session) 同时也装着产生 bug 的推理过程,agent 会把自己的结论读回来当确认。一个 [context window](#context-window) 全新的审查者没有这种黏连:它像陌生人一样看这个 diff,而审查依赖的正是陌生人的眼睛。换一个模型,或用一个专司审查的 system prompt,能进一步锐化这一点——盲区不同,而且 system prompt 可以只 scope 在你真正在乎的事(安全、API 契约、性能),而不是一句含混的"找找问题"。

它在其他审查层之间落位。Automated check 是确定性的,抓得住机械断言的东西;[human review](#human-review)(人工审查)最贵、扩展性最差。Automated review 居中:它以机器的成本,抓住判断形状的问题——一个误导性的函数名、一个漏掉的边界情况。因为它是非确定性的,它会漏、也会误报;把它当作人类接手前抬高底线的过滤器,而不是取代人的闸门。

_避免:_ "AI review" / "agent review"——太含混,没法和干活的 agent 本身区分。

_Usage:_

"AFK run 交上来的坏 PR 太多了。"

"在合并前加一道 automated review——换个模型,单独的 system prompt,scope 在安全和契约变更上。"

### Human review

用户阅读 [agent](#agent)(智能体)产出的代码,并对它形成判断。读 diff 或被改动的文件算数;读 agent 对自己所作所为的*描述*不算——叙述不是产物。描述是一份 [secondary source](#secondary-source)(二手来源),出自被审查的一方;diff 是 [primary source](#primary-source)(一手来源),review(审查)的意思就是把 diff 读了。

agent 抬高了代码的产量,于是审查成了瓶颈。一个有用的想法是给审查策略分层。[automated check](#automated-check)(自动检查)抓机械性失败,[automated review](#automated-review)(自动审查)抓可描述的问题,human review(人工审查)只留给只有你能判断的东西——这个改动是不是对的改动,这个路子合不合这个代码库,这个东西到底该不该存在。

审查也是越早越便宜。开工前读一份方案,或中途读一个小 diff,只要几分钟;AFK([AFK](#afk))跑完之后去挖一条完成的分支,要久得多。审查检查点放在哪儿,是一个 [human-in-the-loop](#human-in-the-loop)(人在回路)的决定,不是事后想起来的事。

_避免:_ 单说 "code review"——分不清是人工还是自动。

_Usage:_

"我 human review 过 AFK 的产出了。"

"你读的是 diff,还是摘要?"

"diff。摘要说它删的是死代码——结果那个函数是从一个生成文件里调用的。"

### Vibe coding

一种工作模式:用户不做 [human review](#human-review)(人工审查),直接接受 [agent](#agent)(智能体)的代码。diff 被当作不透明的——要紧的是程序跑不跑得起来,不是里面是什么。[automated review](#automated-review)(自动审查)和 [automated check](#automated-check)(自动检查)可能照跑;vibe coding 对两者都不表态。

这个词来自 Andrej Karpathy,他在 2025 年初[造了这个词](https://x.com/karpathy/status/1886192184808149383):你"完全交给感觉"(fully give in to the vibes),并且"忘了代码的存在"——描述你想要的,接受送回来的,靠运行来判断。

vibe coding 用检查换速度。读 diff 通常是 agent 驱动的工作里最慢的一步,砍掉它就砍掉了主要瓶颈。对失败代价低的代码——[原型](#prototyping)、一次性脚本、内部工具——这是一笔合理的交易。风险随代码的寿命和利害而涨。

代价晚点才到。vibe 出来的改动积累成一个没人读过的代码库,而当初唯一检查过的是行为——于是任何行为浮不出来的问题,都 unseen 地上线了:写进日志的密钥、缺失的边界情况、悄悄出错的数据处理。第一次有人调试这个系统,才是第一次有人读这份代码。人工审查退场之后,还在运行的一切自动验证——测试、类型、automated review——就是代码仅存的关卡。

_避免:_ 把"vibe coding"当"低质量 AI 代码"的同义词——这个词命名的是审查姿态,不是产出的代码。

_Usage:_

"它在 auth 流程里改的东西你读了吗?"

"vibe 出来的——登录还能用,我只查了这个。"

"push 之前把 diff 读了,auth 上凭感觉,密钥就是这么漏进日志的。"

### Design concept

关于在建之物的共同理解,为用户和 [agent](#agent)(智能体)所共有,但不依附于任何产物。Brooks 的术语(《The Design of Design》):对话、[handoff artifact](#handoff-artifact)(交接产物)和代码,都是试图捕捉或抵达设计概念(design concept)的产物,但没有一样*就是*它。设计概念的质量,从孕育它的那段对话的质量里感觉得到。

这个词命名了一个熟悉挫败背后的缺口:agent 一字不差地写出了你要的东西,结果还是错的。通常的原因是,你自己还没完全想清楚要什么。设计概念在你脑子里还没完工——你的提示词捕获了你已经想通的部分,对没想通的部分保持沉默。agent 用自己的假设填了那些沉默,因为没有东西可供对齐。没有任何东西出故障。只是不存在共同的设计概念,因为一个完整的设计概念还不存在,无从分享。

判断设计概念是否共有,和判断同事之间是否默契用的是同一招:对方开始替你回答你还没问的问题,而且答得跟你一样。在那之前,工作就是对话——[grilling](#grilling) 是它的刻意版本——而过早写下 [spec](#spec),只是把没对齐的东西固化进一个更耐久的产物。设计概念还会随你的学习而移动;产物滞后于它,所以一份忠实于上周理解的 spec,照样能误导这一周的 session。

_Usage:_

"它一字不差地按我说的写了,结果还是错的。"

"你们还没有共享一个 design concept——它在用假设填空。继续聊,直到取消、退款、部分履约这些在你俩之间全部对齐,再放手让它写 spec。"

### Grilling

与 [agent](#agent)(智能体)一起发展 [design concept](#design-concept)(设计概念)的技术:agent 以苏格拉底式访谈用户,一次只敲定一个决定,并且每个决定都附一个推荐答案。它拖住冲向"成品方案"的脚步——在概念稳定之前,不写任何 [handoff artifact](#handoff-artifact)(交接产物)。

这项技术存在,是因为 agent 会无声地填空。拿着两行提示被要求写一份 [spec](#spec) 时,agent 不会停在你还没做的决定上——它挑好默认值,直接写进去。成果看起来很完整,猜测和选择难以区分,于是你发现得很晚:在审查时,或者在建好的功能以你从没选过的方式处理一个边界情况时。grilling(拷问式访谈)把它倒过来——agent 不猜,它问。

这是 [human-in-the-loop](#human-in-the-loop)(人在回路)的技术:你的回答就是输入。当一个问题在对话里答不了——你必须亲眼看到那个东西——就切换到 [prototyping](#prototyping)。

_Usage:_

"它直接去写 spec,把取消逻辑搞错了。"

"先 grill 它——让它问你部分取消、退款、时序的事,再允许它往文档里写任何东西。在对话里解决,比在代码里解决便宜。"

### Prototyping

让 [agent](#agent)(智能体)造一个快速粗糙的版本——用在对话保真度不够、你需要一个真实产物来讨论的时候。

[grilling](#grilling) 在对话里解决设计决定。对话便宜,但保真度低:有些问题用话答不了——一次交互的手感如何、一个 API 形状在真实调用代码里顺不顺手、一个布局在真实数据量下撑不撑得住。访谈推进到某个问题,你诚实的回答是"不知道,我得看到它才行"。过了这个点,讨论开始原地打转。此时该做的是:让 agent 把东西造出来,你看一眼,带着答案回到对话里。

agent 把造东西的成本打了下来,这件事才变得可行。以前要花一天糊出来的粗糙版本,现在几分钟就有,所以值得常态化地做。这是一门 [human-in-the-loop](#human-in-the-loop)(人在回路)的技术:原型就是摆在那里让你做反应的。

通常你不会只看一眼。对着原型迭代——反应、要一个改动、再反应——每一轮都对着真实产物解决掉一个决定,保真度高于对话所能。

原型不必全是糙的。你可以把你真正在评估的部分做成生产质量,这样决定落定之时,你对着它做反应的那个组件或 API,可以直接搬进真正的代码库。这让 prototyping(原型化)成为 [spec](#spec) 值得引用的素材。

_Usage:_

"我们花了半小时争论向导该做成一页还是三步。"

"嘴上是争不出来的——让 agent 把两种都原型出来。点一圈,五分钟见分晓。"

### DX

Developer experience(开发者体验)——一个代码库和它的工具链让人把活干好有多容易。好的 DX 是:反馈快、报错清楚、文档答的正是你真正要问的问题、环境第一次跑就通。这个词远早于 AI 编程;它被收进这本词典,主要是作为 [AX](#ax) 的对照。

DX 是人与代码库之间的互动——仅此而已。两类受众的主要区别是:人是 [stateful](#stateful)(有状态)的,agent 是 [stateless](#stateless)(无状态)的。人把代码库学一遍,然后带着这份知识过完之后的每一天,所以糟糕的 DX 是可生存的:他们用攒着一起 push 绕过慢 CI,用去 Slack 问一次绕过缺失的文档,用"记得东西在哪"绕过混乱的结构。workaround 层层积累,一个团队最终在一个处处与之作对的代码库里保持了高产。

[agent](#agent)(智能体)面对同一个代码库,却没有这些积累。跨 [session](#session)(会话)[stateless](#stateless) 的 agent,每次都从零重学代码库——快速的测试套件和清楚的报错它照样受益,但它昨天琢磨明白的东西,除非写进了 [environment](#environment)(环境),否则全没了,而 agent 只能通过 [tool result](#tool-result)(工具结果)感知 environment。这就是 AX 点名的那道缺口:DX 中在开发者换成 agent 后仍然幸存的部分,再加上人类没有的顾虑,比如让 [context window](#context-window)(上下文窗口)保持空闲。

重叠意味着对 DX 的投入常常免费改善 AX——严格类型、快速测试、可预测的结构两头都帮。分歧意味着并非总是如此:一份精美的入职文档帮人帮一周,对 agent 则毫无帮助,除非它能从 [AGENTS.md](#agentsmd) 被够到。

_Usage:_

"我们的 DX 挺好——新人一周就能上手干活。"

"能上手,是因为那一周有人坐在旁边。agent 没有那一周;AX 得单独查。"

### AX

Agent experience(agent 体验)——[environment](#environment)(环境)为一个 [agent](#agent)(智能体)在代码库里把活干好布置得有多好。面向 agent 的、[DX](#dx) 的对应物。同一个 agent 在一个仓库里表现出色、在另一个里拉胯——同一个 [model](#model)(模型),同一个 [harness](#harness)(宿主环境)——差别通常就是 AX。本能反应是怪模型、或重写提示词;修法更多时候在仓库里。

好的 AX 有三个主要维度:

| 维度             | 好的 AX 长什么样                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automated checks | 快速、确定的 [automated check](#automated-check)(自动检查)——类型、测试、lint——agent 无需人参与就能据此自我纠正                                                                               |
| Architecture     | agent 不必读完全部就能导航的代码库:可预测的结构、大量行为藏在小的接口后面、名字说得出东西是干什么用的                                                                                              |
| Free context     | [AGENTS.md](#agentsmd)、[skill](#skill) 和 [tool](#tool) 保持精瘦,[context window](#context-window) 的大部分留给任务,agent 留在 [smart zone](#smart-zone) 里,而不是被淹死 |

AX 和 DX 有重叠——好的检查和干净的架构对两类受众都有益——但它们也分道。人能容忍部落知识、慢 CI 和"billing 模块去问 Sarah";agent 不能。agent 从 IDE 的工具提示和漂亮的仪表盘里得不到任何好处;它们需要的是失败以文本形式出现在 [tool result](#tool-result)(工具结果)里。一个代码库完全可以 DX 良好而 AX 拉胯。

_避免:_ 把 AX 当 DX 的同义词——两类受众需要的投入不同。

_Usage:_

"这个 agent 在 API 仓库里写得很好,到了前端就产垃圾。"

"API 仓库有严格类型和快速测试套件;前端两样都没有,还有四十个常驻装载的 skill。那是 AX 缺口,不是模型问题。"

