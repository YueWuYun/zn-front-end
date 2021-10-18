# 列表页基础组件

> author: liyaoh <br>
> created date: 2018-12-11

使用该组件可以快速创建一个包含表头、查询区、Tab页签、表格的列表页面，封装了通用交互，使业务节点不需要关心交互细节。

#### api

| 参数      | 名称 | 类型 | 说明 |
| --------- | ---- | ---- | ---- |
| config | BaseList常量 | Object | 具体参数见demo | |
| initTemplate | 模板加载方法 | Object | |
| headBtnArea | 头部按钮区域 | String | |
| buttonClick | 头部按钮点击事件 | Function | |
| showSearch | 是否显示查询区 | Boolean | 默认true |
| searchBtnClick | 查询按钮点击事件 | Function | |
| listTabs | Tab页签相关数据（没有tab页签不需要传） | Object | 具体参数见demo |
| pageTitle | 页面标题 | String | |
| disableRowDoubleClick | 是否禁用表格行双击事件 | Boolean | 默认false |
| searchConfig | 查询区参数 | Object | 参数与NCCreateSearch相同 |
| tableConfig | 表格区参数 | Object | 参数与createSimpleTable相同 |
| customState | 传给BaseList的state | Object |  |
| didMount | componentDidMount的钩子函数 | Function |  |


| 方法 | 名称 | 说明 |
| --- | --- | --- |
| onTableSelect | 表格单选回调函数 | 返回参数与createSimpleTable的onSelected方法相同 |
| onTableSelectAll | 表格全选回调函数 | 返回参数与createSimpleTable的onSelectedAll方法相同 |
