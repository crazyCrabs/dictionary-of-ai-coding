---
description: 供应商侧的存储,让连续的请求跳过重复处理共享前缀,这部分 token 按更低的费率计费。
---

[provider](./Model%20provider.md)(模型供应商)侧的存储,让连续的 [model provider request](./Model%20provider%20request.md)(模型供应商请求)跳过对共享前缀的重复处理。当一个请求的开头与最近某个请求的开头一致——同样的 [system prompt](./System%20prompt.md)(系统提示)、同样到某处为止的历史——provider 复用之前的处理结果,把这些 [token](./Token.md)(词元)按 [cache tokens](./Cache%20tokens.md)(缓存 token)计费,费率低得多。

这笔缓存之所以划算,是因为 session 只增不改。每个请求都把整个历史作为 [input tokens](./Input%20tokens.md) 重发(为什么,见该词条),而正常的 [session](./Session.md)(会话)里,历史只在末尾变化——每个请求就是上一个请求加几条新消息。provider 把长长的共享开头处理一次,存下结果,从词缀结束处继续。没有缓存,一个 50 个 [turn](./Turn.md) 的 session,要为第一个 turn 的重处理付五十次钱。

缓存也会过期。条目保温多久,因 model provider 而异——典型是分钟级,不是小时级。session 闲置超过窗口,下一个请求会把前缀按全价重建一次,然后缓存恢复。这主要是 [harness](./Harness.md)(宿主环境)构建者要操心的事;作为用户,可见的影响是:长暂停之后的那个请求,比之前的都贵。

_Usage:_

"为什么账单在 session 中途飙升?"

"harness 开始在每个 turn 往 system prompt 里注入当前时间。前缀在第一个变化的 token 处断掉,之后的每个请求都按全价计费。"
