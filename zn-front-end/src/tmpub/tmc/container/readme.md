> author: liyaoh <br>
> created date: 2018-12-12

本目录用于存放公共方法，使用方法：
```
import { list, card, link, util, page } from 'src/tmpub/container';
```
* list - 列表按钮方法
* card - 卡片按钮方法
* link - 联查方法
* util - 工具函数
* page - 业务方法

> 具体有什么方法见每个文件夹的index.js

### 目录结构

* container 公共方法
    * card 卡片按钮方法
        * index.js
        * methods.js 卡片封装的方法
        * headButtonClick.js 表头按钮点击事件
        * bodyButtonClick.js 肩部按钮点击事件
    * common 公共方法（与业务无关）
        * index.js
    * link 联查业务方法
        * index.js
        * linkApproveDetail.js 联查审批详情
        * linkInterest.js 联查利率
        * linkVoucher.js 联查凭证
        ... 
    * list 列表按钮方法
        * index.js 输出给外面使用的方法
        * methods.js 列表封装的方法
    * page 放一些业务方法（如增删改查）
        * index.js
        * card.js 卡片页方法
        * list.js 列表页方法
    * utils 工具类函数
        * index.js
    * index.js 输出到外面的方法
