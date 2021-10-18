- Modal

- API

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| show                  | 是否显示modal                 |bool              |false
| title                 | 标题                          |string            |null
| label                 | label文字                     |string            |null
| content               | 输入框内容                     |string           |null
| isRequire             | 输入框是否必填                 |bool              |true
| okText                | 确定按钮文字                   |string            |确定
| closeText             | 取消按钮文字                   |string            |取消
| okShow                | 是否显示确定按钮                |bool              |true
| closeShow             | 是否显示取消按钮                |bool              |true
| className             | 弹框class                      |string            |null
| placeholder           | 输入框提示文字                  |string            |null
| maxlen                | 输入框最多输入长度               |number            |100
| onOk                  | 确定按钮点击事件                 |function         |无参数
| onClose               | 取消按钮点击事件                 |function         |无参数

注意： 若isRequire必输，则没有输入内容的时候点击确定按钮，会自动提示： 请输入label，并return