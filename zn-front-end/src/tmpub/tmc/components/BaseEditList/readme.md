# 整表编辑列表页基础组件

> author: dongyue7 <br>
> created date: 2018-12-26

使用该组件可以快速创建一个包含表头、查询区、可编辑表格的整表编辑列表页面，封装了通用交互，使业务节点不需要关心交互细节。

整表编辑列表页主要逻辑：
1、列表的增删改查（增删改包括浏览态和编辑态两种形式）；
2、点击新增，列表变为编辑态（已为编辑态时不变），并增加一行空白行；
3、点击修改，列表变为编辑态；
4、勾选数据后可点击删除按钮，浏览态时会提示是否删除数据，编辑态时会直接进行删除操作；
5、列表操作列按钮与肩部按钮一致（批量非批量的关系，删除也分浏览态编辑态）；
6、其他业务可以根据给出的api进行控制。

#### api

| 参数              | 名称                     | 类型        | 说明                |
| constant          | BaseEditList常量          | Object    | 具体参数见demo       |
| _initTemplate     | 模板加载方法               | Function  |                     |
| _afterEvent       | 列表编辑后事件             | Function  |                     |
| _searchAfterEvent | 查询区编辑后事件            | Function  |                     |
| _afterSearch      | 查询后事件                 | Function  | 见备注1              |
| _beforeSave       | 保存前事件                 | Function  | 见备注2             |
| _beforeOpr        | 操作列点击执行前数据处理    | Function  |  见备注3             |
| _afterSetTable    | 渲染表格后事件             | Function  |  见备注4            |
| _beforeBatch      | 批量操作前事件             | Function  |  见备注5            |


备注：
1、该方法在查询的ajax返回成功且有返回数据（即success为true，返回data.grid）时候，在setTableData方法之前调用，用于在渲染表格之前控制待渲染的数据；
2、该方法在保存前调用，用于对待保存的数据进行调整控制；
3、该方法在列表操作列按钮生效前调用，用于对待操作的数据record进行控制；
4、该方法在查询的ajax返回成功且有返回数据时，在setTableData方法之后调用，用于在表格数据渲染完成后控制编辑性等；
5、该方法在批量操作之前（目前仅有批量删除）调用，用于处理待批量操作的数据。