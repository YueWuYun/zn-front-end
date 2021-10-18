# 开始、结束日期弹框组件

> author: liyaoh <br>
> created date: 2018-12-03

#### props

| 参数      | 名称 | 类型 | 说明 |
| --------- | ---- | ---- | ---- |
| showModal | 控制弹窗显隐 | Boolean | |
| title | 弹窗标题 | String | |
| begin | 开始日期对象 | Object | 示例：<br> { label: '试算开始日期', //日期label <br> placeholder: '试算开始日期' //日期placeholder }
| end | 结束日期对象 | Object | 格式同begin |


| 方法 | 名称 | 说明 |
| --- | --- | --- |
| onClose | 关闭弹窗的方法 | |
| onConfirm | 点击确定的方法 | 返回开始结束日期的对象：{beginDate: '2018-12-01',endDate:'2018-12-31'}|

#### demo

```js
<BeginEndDateModal
    showModal={this.state.showInterestTrialModal} 
    title="试算利息" 
    begin={{ label: '试算开始日期'}}
    end={{ label: '试算结束日期'}} 
    onClose={this.closeModal.bind(this)}
    onConfirm={this.handleDateModalConfirm(val)}
 />