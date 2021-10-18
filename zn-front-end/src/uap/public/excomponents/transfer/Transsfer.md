 >**引入**
 
```
import Transfer from '../../public/excomponents/Transfer';
```
>**使用**

```
<Transfer 
    TransferId={'org_transferid'}  //id,必填
	leftTreeData={this.state.firstStepOrgValue.leftTreeData} 
	rightTreeData={this.state.firstStepOrgValue.rightTreeData}
    selectType = {'onlySelf'}  // 设置节点选中方式
    treeType = {'VRFusion'} // 设置树的类型
    hiddenAllMoveBtns = {boolean} // 设置是否显示全部移动按钮
    rightFixed = {boolean} //  右树有固定的数据时需要设置为true。
    referLeftTree = {boolean} // 左树为参照树
```
> 传参说明

---
    TransferId          id,必填
    leftTreeData        左侧树初始化数据
    rightTreeData       右侧树初始化数据，没有可传入[]
    selectType          string      节点选种方式 
                                        一 .普通类型树支持：
                                            1. 'onlySelf' 仅自己  
                                            2. 'onlyChild' 包含所有下级  
                                            3. 'onlyLeaf' 仅末级 
                                            4. 默认子节点移动父节点跟随
                                        二 .带虚实节点树支持
                                            1. 'onlySelf' 仅自己
                                            2. 'onlyChild' 包含所有下级
                                            3. 'onlyDirectChild' 仅直接下级

    treeType            string      树的类型 不设置默认普通类型树，如果是带有虚实节点需要设置为 'VRFusion'。
    hiddenAllMoveBtns   boolean     是否隐藏全左、全右按钮，默认显示。
    rightFixed          boolean     右树有固定的数据时需要设置为true。
    allToLeft_without_merge  boolean  左树为参照树，右树含固定节点且右树为左树的子集，添加此属性可实现全部左移功能。
    referLeftTree       boolean     左树为参照树（右移时左树数据不会移除）
    title               Object      {left:lefttitle,right:righttitle}
    searchPlaceholder    string     搜索框提示词  默认为空
    autoSearch          boolean     是否开启自动搜索(默认不开启，否则可能引发眼中的性能问题)
    beforeMove          移动前事件，返回bool,返回false时不移动；beforeMove(nodes,value,'br2l')
    afterMove           移动后事件，无返回值afterMove(nodes,value,'ar2l')

*注：*移动前(beforeMove)与移动后(afterMove)都会返回移动事件类型，移动事件类型分4类：{'br2l'：右树到左树移动前事件；'ar2l'：有数到左树移动后事件；'bl2r'：左树到右数移动前事件；'al2r'：左树到右树移动后事件}

