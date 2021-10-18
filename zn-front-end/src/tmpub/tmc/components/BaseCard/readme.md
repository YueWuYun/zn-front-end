# 卡片页基础组件

> author: wangjzhi <br>
> created date: 2018-12-26

使用该组件可以快速创建一个包含表头、Tab页签的卡片页面，封装了通用交互，使业务节点不需要关心交互细节。

#### api

| 参数      | 名称 | 类型 | 说明 |
| --------- | ---- | ---- | ---- |
| config | BaseCard常量 | Object | 具体参数见demo | |
| initTemplate | 模板加载方法 | Object | |
| headBtnArea | 头部按钮区域 | String | |
| buttonClick | 头部按钮点击事件 | Function | |
| shoulderBtnArea | 表体tab区域肩部区域按钮code | Function | |
| pageClick | 卡片分页事件 | Function | |
| buttonVisible | 新增事件 | Function | |
| pageTitle | 页面标题 | String | |
| afterEvent | 表头编辑后事件 | Function | |
| customState | 传给BaseCard的state | Object |  |
| cardDidMount | componentDidMount的钩子函数 | Function |  |



