# trilium-ios-shortcut

一个使用快捷指令给 trilium 发消息的指南

This repo is forked from [soulsands/trilium-ios-shortcut](https://github.com/soulsands/trilium-ios-shortcut).

我改了点[handler.js](./handler.js)的代码让这个handler可以在 [TriliumNext](https://github.com/TriliumNext/Notes/) 正常上传图片，没有修改任何其他地方。
 1. 不用 `require("module")` 而是用 `await import("module")`
 2. 函数调用方式也改了 `modulename.default.function();`
 3. TriliumNext里的函数名现在是 `importNotesToBranch` 而不是 `importToBranch`. 

BTW, 我没有 js 相关的开发经验，这些调整基于 GitHub Copilot 和 [issues-433](https://github.com/TriliumNext/Notes/issues/433).

## 前置条件

要使用这个指南，你需要：

-   苹果设备，装了快捷指令 app。
-   安装了 Trilium server。

ios 15.5 可使用，其他设备没测试，ios 13 也许可用，期待反馈。

## 快捷指令特性：

这个快捷指令允许你：

-   输入文字内容并发送
-   选中任何文字内容分享并保存
-   支持语音输入(没啥用，输入法默认支持，可以关掉)
-   支持读取剪贴板内容并发送，可配置开启关闭。读取剪贴板后有 4 个选项
    -   清空剪贴板
    -   引用剪贴板内容
    -   引用剪贴板内容（成功后清除）
    -   直接输入
-   支持发送照片
-   支持复制后发送文件
-   支持配置固定标题，配置后将直接使用固定标题
-   支持配置可选标题，选择`自定义`后可手动输入标题
-   可设置多个默认标签，设置后将发送笔记将附带默认标签
-   支持单独 name，也支持#name=value
-   可配置可选标签组，支持开启关闭从标签组中选择
-   如果发送失败，可以选择保存到剪贴板或备忘录

## 自定义接口：

要了解更多关于 custom api 的信息，可看[文档](https://github.com/zadam/trilium/wiki/Custom-request-handler)

这功能比文档展示的要强大，比如它可以直接引入项目中的文件

```js
const htmlSanitizer = require("../services/html_sanitizer");
```

可通过这种方式来访问未被暴露的功能，当然也可能引发一些意外。

## Custom request handler 文件

[handler](./handler.js)

这是一个最基础的方式，你也可以创建自己喜欢的逻辑，比如增加克隆。

## 操作指南

### Trilium server

1. 首先新建一个笔记或使用老笔记
2. 类型改为`JS backend`
3. 添加一个标签`#customRequestHandler={随意的字符} `
4. [handler](./handler.js)文件代码复制进去。

这样就生成了可创建笔记的接口。接口地址为`{trilium访问地址}/custom/${随意的字符}`，这个地址将用于后续填入快捷指令中。

### 苹果设备

1. 用手机打开链接获取快捷指令。

    1. [文字笔记](https://www.icloud.com/shortcuts/61b090d648ab44e9bba5de51ed9a9390)
    2. [文件笔记](https://www.icloud.com/shortcuts/338e4922664c4d9cb3e60c78a782ff10)

2. 跟随指南操作。
3. 如果启用权限请允许。

### 完成

开始享受随时随地给你的 trilium 服务花式发消息吧！

## 使用建议

这个指令提供了非常灵活的使用方法。

-   如果你只是想快速发送内容，而不想处理标题和标签，可以启用固定标题并配置默认标签，然后关闭可选标签选项。
-   如果你想在发送前修改标题和标签，可以关闭固定标题并开启选择标签，这样将获得非常灵活的输入体验。

在输入正文时，你可以选择直接输入或者引用输入，引用来源可以是系统输入或剪贴板内容。引用输入时，指令将使用`---`作为分隔符。你也可以在指令中修改引用输入方式。

你可以将快捷指令添加到主屏幕或辅助触控中。要将其添加到辅助触控中，请转到`设置-通用-辅助功能-触控-辅助触控`。

使用系统分享时，可以找到快捷指令，并将其添加到收藏夹中。这样，你可以在编辑操作中将其置顶，以便更方便地访问。



虽然可以发照片和文件，但是不建议发太多，不然数据库很大。

## 快捷指令编写建议

快捷指令的编写非常不方便，拖动起来有 bug，并且容易误触删掉某个节点。

如果自行修改，建议多使用`拷贝`，之后`贴到上/下方`。

左下角支持回退，情况不对及时回退。

并建议在关键点复制指令留以备份。

如发现操作卡顿可退出并重新进入。

如发现指令在编写时可以运行，实际操作却运行不了，则可能需要重启手机。

编写之后很难修改，所以建议编写前可以先用伪代码实现，梳理清除逻辑，之后再到手机中编写。

可多参考其他人的指令，遇到类似需求多使用拷贝。

## 最后

本指令只在这里发布或更新，不对其他来源负责。

如果有问题或建议，欢迎提交 issue。

如果对你有用也欢迎 start。
