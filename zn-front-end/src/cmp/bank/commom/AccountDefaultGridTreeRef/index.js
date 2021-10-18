/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import AccountBaseRefer from './AccountBaseRefer';
import './index.less';
/**
 * 组织级会计科目参照 入口
 * @param props
 * @returns {*}
 * liupzhc
 */
/**************************************************************************************
  *                         #### 写在前面的话 ####
  * 目前基本满足财务和UE的需求，如果再有问题，问题不是什么问题都要改，因为这个参照前期是财务的关注，
  * 现在UE也参与进来，两方都提出各种杂七杂八的问题，但是财务和UE又有很多特殊的规定，所以在改动
  * 原功能之前最好先问一下财务和UE还有哪里不满足，如果改了，会影响什么功能，
  * 必须提前跟他们说明白，不然他们很炸！ 一定一定一定要问明白UE和财务想要什么！！！
  **************************************************************************************/


export default function (props = {}) {
    let conf = {
        multiLang: {
            domainName: 'uapbd',
            currentLocale: 'zh-CN',
            moduleId: 'refer_uapbd',
        },

        refType: 'gridTree',
        refName: 'refer-000066',/* 国际化处理： 会计科目*/
        placeholder: 'refer-000066',/* 国际化处理： 会计科目*/
        rootNode: { refname: 'refer-000066', refpk: 'root',refcode:'root',show:true },/* 国际化处理： 会计科目*/
        popWindowClassName:'ncc-lefttree-width',
        refCode: 'uapbd.refer.fiacc.AccountDefaultGridTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/AccountModelRefer.do',
        queryGridUrl: '/nccloud/uapbd/ref/AccountModelRefer.do',
        isMultiSelectedEnabled: false,
        isShowHighFilter: true,//是否显示高级搜索框
        isShowDisabledData: false,//是否显示 显示停用
		isAccountRefer: true,//区分组织级和全局或集团级标志
		showHistory: false,
        columnConfig: [{ name: ['refer-000067', 'refer-000068'], code: ['refcode', 'refname'] }],/* 国际化处理： 科目编码,科目名称*/

    };

    return <AccountBaseRefer {...Object.assign(conf,props)} />
}

/***************************************************************************************
 *
 *  使用说明：
 *
 *  1、科目参照分为  全局或集团级会计科目 和 组织级会计科目
 *
 *  2、入口：
 *      全局或集团级:/uapbd/refer/fiacc/AccountGridTreeRefInGroupOrGlobal/index.js
 *      组织级：     /uapbd/refer/fiacc/AccountDefaultGridTree/index.js
 *
 *  3、区分参数:
 *      isAccountRefer: false:组织级;true：全局或集团级。
 *     提示：【使用者无需传递，已经内置】
 *
 *  4、由于科目参数是特殊参照，请求全部走的/nccloud/uapbd/ref/AccountModelRefer.do,加载不同的数据，依靠参数来处理
 *     a、加载科目类型和科目信息树结构数据：queryCondition + isHighFilter:false + isLoadDetailInfo:false
 *     b、选中科目信息加载详细信息和辅助核算：queryCondition +  isHighFilter:false + isLoadDetailInfo:true
 *     c、高级过滤（右上角放大镜）：queryCondition +  isHighFilter:true + isLoadDetailInfo:false
 *     d、快速搜索：isQuickSearch:true + onlyLeafCanSelect【true/false】+ queryCondition + isHighFilter:false + isLoadDetailInfo:false
 *     提示：【除参数queryCondition,使用者无需传递，已经内置】
 *
 *  5、领域使用
 *      如果是从单据模板中配置的，只需要在前端传递queryCondition
 *          a、全局或集团级  需要传递  pk_setofbook【账簿类型主键】、pk_org【全局或集团pk】、dateStr。（其中pk_setofbook和pk_org必传，若不传，pk_org 取全局pk）
 *          b、组织级   需要传递 pk_accountingbook【账簿_核算账簿主键】、dateStr 。（其中 pk_accountingbook必传）
 *
 *  截止2019年1月23日：
 *     剩余问题：
 *          1、tab切换 会切到父级元素
 *          2、搜索后勾选会有问题，这个经过跟踪，觉得应该是IUAP的问题
 *  规划：
 *     春节过后找时间重构！ 已OK
 ***************************************************************************************/
 
 /**************************************************************************************
        科目参照大体介绍
  目录： refer/fiacc/AccountDefaultGridTree/

index.js页面属性介绍：
	
	popWindowClassName:定义参照的左侧树与右侧卡表的宽度占比的样式属性
	
	queryGridUrl:一般gridTree类型的参照该属性是加载右表数据使用的，这里单独为了下拉时加载数据使用
	
	isShowHighFilter:是否显示高级功能,true显示/false不显示,
	
	isAccountRefer:是否是组织级科目参照,true是组织级/false全局或集团级
	
	onLeafCanSelect:只允许末级选中
	
	其他属性与一般参照一致
	
AccountBaseRefer.js页面介绍：
	该页面是科目参照的主页面
	当快捷键f2或者鼠标点击打开参照时  触发  show 方法，
	show:
		先打开参照框，然后构造请求参数  调用loadAndSetTreeData 加载并设置树数据，
		loadAndSetTreeData接受四个参数：(param, rootNode, this.state.accexpandedKeys,callback)
		param：是show方法中构造的请求参数;
		rootNode在index.js页面中已经配置;
		this.state.accexpandedKeys:需要展开的树节点;
		callback:回调方法，清空右侧数据，设置选中项，并且聚焦当前参照框
	loadAndSetTreeData:
		根据当前有没有缓存的数据决定是否发ajax请求去加载数据，获得数据之后，调用setTreeData去设置树数据
	setTreeData:主要作用是设置树数据，还附带把编码规则和科目体系主键存放到state中
	loadTreeData:异步请求树数据
	loadTableData:异步请求下拉参照中的列表数据
	renderPopoverLeft: 渲染左侧区域
	renderPopoverRight:渲染右侧区域
	renderPopoverSearchArea:渲染显示停用、全选、更多、高级等功能区域
	renderPopoverBottom:渲染已选、确认、取消按钮区域
	onSelectTreeNodeLoadTreeData:鼠标选中树节点时触发，在onTreeNodeSelect方法之后执行
	onCheckedTreeNodeLoadTreeData:鼠标勾选树节点复选框时触发 在onTreeNodeChecked方法之后执行
	loadDetailWhenSelectOrCheckedTreeNode:在鼠标或快捷键选中节点或勾选节点前的复选框时触发，在onSelectTreeNodeLoadTreeData和onCheckedTreeNodeLoadTreeData之后执行
	showHighFilterModal:打开高级过滤框
    onAfterHighFilterCloseOk:高级过滤点击确定时触发，根据情况分为特殊过滤和通用过滤两个方法，特殊过滤只针对高级中只选择“只显示末级”，或者选择科目类型，不选择辅助核算；通用过滤针对其他情况，特殊过滤不走后台，只是前台过滤出符合条件的数据，通用过滤要根据选择的科目类型和辅助核算项，到后台查询出符合条件的数据，返回数据后，在前台根据科目级次选择相应的数据	
    
AccountReferTree.js页面介绍：
	该页面是参照左侧区域的树和树搜索框组件页面
	最需要关注的是  
		onTreeNodeSelect:选中树节点时触发的方法，区分快捷键触发和鼠标触发，在选中的同时需要展开选中的节点
		onTreeNodeChecked:需要注意setMultiMode 树的多选情况下分为单选模式和多选模式，依靠这个方法来区分
		onTreeSearchChange:树搜索框值发生改变500ms后，过滤出相应数据，并且在完整目录结构上做标记，获得需要展开的节点的key
        componentWillReceiveProps 该生命周期函数负责的是时时更新左侧区域的数据
        
AccountAdvFilter.js页面介绍：
	高级过滤框页面，主要是返回高级过滤选择的条件
	
AccountReferForm.js页面介绍：	
	form区域组件页面，主要是展示科目信息
	
  **************************************************************************************/
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/