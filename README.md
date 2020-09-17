# uestc-coursetable-parser

[![license](https://img.shields.io/github/license/saafo/uestc-coursetable-parser?style=flat-square)](https://github.com/Saafo/uestc-coursetable-parser/blob/master/LICENSE)
[![author](https://img.shields.io/badge/Author-@Saafo-blue?style=social)](https://github.com/Saafo)

本仓库为电子科技大学课表解析脚本仓库。

`course2ics.js`用于解析课表生成ics文件，`course2Mi-AI.js`用于适配小米小爱课程表功能。

## course2ics.js

### 什么是ics文件

> `ics文件`是一种日历信息文件，可以包含一系列事件的开始结束时间、标题、位置等信息，以通用日历格式`.ics`保存，供多种电子邮件和日历程序使用，包括`Microsoft Outlook`, `Google Calendar`和`Apple Calendar`。

通俗来讲，我们可以利用`ics文件`将你的课表导入到你的电脑或手机的原生日历中。

将课程表导入到原生日历进行管理的好处十分明显，包括但不限于：

* **统一管理**。如果你本来有使用日历的习惯，可以将课表和其他日程统一管理，方便安排和查看。
* **没有广告**。市面上的课表软件逐渐开始掐烂钱，原生日历足够清爽。~~ADUI真的能关掉日历广告~~
* **原生集成**。一些系统如iOS的其他功能和自带日历有深度的集成，包括但不限于：在该动身去教室时提前提醒、开启勿扰模式直到当前日程结束（长按/重按控制中心的勿扰）。
* **多设备同步**。很少有做到真正全平台的第三方课表软件。原生日历则支持通过订阅`iCal`链接来订阅在`iCloud 日历/Outlook/Google Calendar`中创建好的日历来达到跨平台跨设备同步日程。如果你恰巧财力雄厚有一套生态全家桶，那么前面三种日历对应的平台都能在你的所有全家桶设备上自动同步你的课表。

只要你愿意花上十分钟时间，你就能拥有以上优点给你的生活带来的便利。

### 使用方法

使用方法分为两个步骤：

* 生成ics文件
* 将ics文件导入到日历中

当然，如果你拥有多台设备，你也可以根据本文档后面的多设备同步指北，来同步你每个设备的课表和日程。

#### 生成ics文件

首先需要你用电脑浏览器打开[教务系统](http://eams.uestc.edu.cn/eams/home!childmenus.action?menu.id=844)的`我的课表`页面。
(url为：/eams/courseTableForStd!courseTable.action的页面）

如果你使用的是Chrome / Edge / Firefox，按下`F12`按键，或者在Safari中按下`⌘ ⌥ I`。你也可以在页面中右键，选择`审查元素`。

刚刚弹出来的工具叫做`DevTools`。接下来选中`Console`菜单。

这时`Console`中应该能输入内容，我们将[course2ics.js](course2ics.js)中的所有代码复制到`Console`中。

这个时候先确定一下刚刚复制代码的最后一排，括号里是本学期开学第一周的周一日期，如`genics('20200907');`。确认无误之后可以回车键运行。不除意外就能得到ics文件了。如果这一步发生了错误，可以将课表和Console输出一并截图到本仓库`issues`中请求帮助。

#### 导入到设备

由于`.ics`是日历文件通用格式，由`RFC 5545`日历数据交换标准统一制定。因此，我们可以便捷地将`ics文件`导入到各种平台的设备中。

##### macOS

双击下载的`ics文件`，即可选择导入到现有日历中或新建日历。如果你在日历中登录了iCloud，推荐导入到iCloud日历。这样，你的课表和日程会出现在你的所有Apple设备上。

##### Windows

Windows 10用户可以双击下载的`ics文件`，选择用日历或Outlook打开，即可选择导入到现有日历中或新建日历。如果你在日历中登录了微软账号，你的课表和日程就会同步到`Microsoft Exchange`账户下。

##### Linux

~~是因为不想Linux被鄙视才列在这里的，但既然都在用Linux了肯定有办法找到导入ics的方法吧真的有的真的有的。~~

##### iOS / iPadOS

提供几种方式：

* 将文件上传至奶牛快传、文叔叔、或其他能通过浏览器访问的位置，然后通过`Safari浏览器`打开需要访问的地址，在Safari下载好之后即可选择导入至`日历`。
* 将`ics文件`发送至自己的邮箱，在系统原生邮箱app点击ics文件，即可选择添加至日历中。（缺点：每节课程都需点击导入）

##### Android

如果你恰巧使用的是`Android`的话，那么你可以选择在`Google Calendar`中导入`ics文件`。但如果你使用的是`安卓`的话，那么就需要利用第三方软件（可以在`Play Store`中搜索"ics"寻找相关软件，也可以在国内应用市场下载`Outlook`）来导入ics文件。

`小米手机/MIUI`可以尝试将系统日历更新至`V12.0.6.9`，即可在`日历-设置-日程导入`中导入ics文件。

#### 多平台同步指北

##### iCloud用户

如果你使用`Apple`的`iCloud日历`服务来进行设备同步的话，在全平台的同步还是能做到的。在iOS和iPadOS上会自动同步。

在`Windows`上，只需下载一个[`Windows 版 iCloud`](https://support.apple.com/zh-cn/HT204283)，即可同步日程。

在`Android/安卓`上，可以在`Play Store`下载一个`Sync for iCloud`（红色图标）来进行同步。使用这种方法，建议先在[`Apple ID管理页面`](https://appleid.apple.com/#!&page=signin)生成一个`独立App密码`(APP-SPECIFIC PASSWORDS)。如果你不会魔法，也可以在iCloud日历中获取公开订阅链接之后，尝试用`滴答清单`或其他软件来进行`url日历订阅`。

##### Microsoft用户

如果你在Windows中使用微软账号，可以在`Windows日历`中登录微软账号，导入课表或日程。在iOS/iPadOS/macOS上，添加`Microsoft Exchange`账户，勾选日历同步后即可同步日历。在Android上，也可以在日历中添加`Microsoft Exchange`账号来进行全平台同步。

### Q&A

#### 如何将课程在日历中重命名？

有两种方法：

* 可以在导入日历之后修改课程首周的所有课程名称。以后的课程因为属于同一事件，会自动更改属性。
* 可以在电脑上用你喜爱的文本编辑器（e.g. `VSCode`、`Sublime Text`、`TextEdit`、`Gedit`、`Notepad/记事本`等编辑器 ~~Word不是文本编辑器！！！~~）打开生成的`ics文件`。然后做批量替换即可。

## course2Mi-AI.js

本来最开始写的就是这个适配小爱课程表的脚本。脚本完成之后在端到端测试时与开发沟通发现，目前因为小爱课程表导入页面使用的`webview`和学校使用的树维系统有兼容性问题，无法正常加载课表页面，因此「要等很久」，短期内可能无法通过小爱同学自动导入。

## Known Issues

| Issues | Notes |
| ------ | ----- |
| 课程安排无法避开节假日 | 暂时不打算做，导入后删掉就好啦，本来老师补课时间也是随意安排的，日历日程编辑起来也很方便 |



## CONTRIBUTING

电子科技大学课表基于树维系统开发，脚本在一定程度上也兼容树维系统。如有不适配的地方还请自行修改。本仓库只接受电子科技大学课表解析的issues和PR。