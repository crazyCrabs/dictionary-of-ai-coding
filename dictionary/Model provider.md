---
description: 为推理提供模型服务的一方。通常是远程的(Anthropic、OpenAI、Google),也可以是本地的(Ollama、llama.cpp)。
---

为 [model](./Model.md)(模型)提供 [inference](./Inference.md)(推理)服务的一方。通常是远程服务(Anthropic、OpenAI、Google),也可以是本地的——Ollama、LM Studio、llama.cpp,跑在你自己的机器上。[harness](./Harness.md)(宿主环境)自己不跑模型;它请 provider 来跑。

机器归 provider 所有:[parameters](./Parameters.md)(参数)在它的硬件上,每次 [model provider request](./Model%20provider%20request.md)(模型供应商请求)都是 harness 把 [token](./Token.md) 送过网络、拿回预测。这使 provider 成为一整类被错怪到模型或 harness 头上的问题的源头——限流、容量降级、宕机都住在这里。当 [agent](./Agent.md)(智能体)在 [session](./Session.md)(会话)中途卡住,或每个 [turn](./Turn.md) 都报错,先查 provider 的状态页,再查别的。

provider 也定商业条款:[input tokens](./Input%20tokens.md)(输入 token)与 [output tokens](./Output%20tokens.md)(输出 token)的按 token 定价、[prefix cache](./Prefix%20cache.md)(前缀缓存)折扣,以及到底有哪些模型可用。注意 provider 和模型的制造者可以是不同公司——Bedrock、Vertex、OpenRouter 服务的是别人家的模型。

本地 provider 用能力换控制:装得进你自己硬件的模型,比前沿模型小得多,但什么都不会离开这台机器,也没有按 token 计的账单。

_Usage:_

"客户是物理隔离的,能不能离线跑?"

"把 model provider 换成本地的——Ollama 或 llama.cpp,跑在他们的机器上。harness 不在乎,它只是换了个 endpoint。"
