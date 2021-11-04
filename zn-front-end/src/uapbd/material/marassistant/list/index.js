//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,toast,promptBox,getMultiLang ,cardCache ,createPageIcon} from 'nc-lightapp-front';
let { NCCol:Col, NCRow:Row } =base;
let {setDefData, getDefData } = cardCache;
const {NCDatePicker, NCButton ,NCPanel,NCCheckbox,NCPopconfirm,NCRadio,EmptyAreaTip } = base;
const { NCDiv } = base;
import './index.less';
import { debug } from 'util';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';

const NCTree = base.NCTree;

let leftTree = 'systemTree';//结构--左树id
let rightTable = 'marassistant_list'//成员--右树表id
let formId = 'marasstframe';//结构--编辑formid
let frameModalId = 'frameModal';//体系编辑模态窗id
let sysModalDelId = 'sysDelete';//体系删除模态窗id
let deleteTreeNode = '';//左树删除选择
let sysSaveType = 'add';//add--新增  edit--修改  copy--复制
/**
 * pagecode 配置
 */

 let pageCode = {
    mainPageCode: "10140MASST_list",
    frameFormPageCode:'10140MASST_card_frame',
 }

 
let config = {
    // nodeName: this.state.json['10140MASST-000012'],/* 国际化处理： 辅助属性设置*/
    nodeType: 'GROPE_NODE',
    appId:'0001Z010000000002YMX',
    appCode:'10140MASST'
}
let cardUrl = '/card';
const linkItem = 'code';     
// let cardUrl = '/uapbd/material/marassistant/card/index.html';
// let rstUrl = '../../marasstrst/main/index.html'
let rstUrl = '/uapbd/material/marasstrst/main/index.html'

const tableBtnAry = ["Edit","Delete"];		//树表列操作按钮

let cachKey = '10140MASST_list';//缓存的标识

/**
 * ajaxurl 配置
 */
let ajaxUrl={
    initUrl:'/nccloud/platform/templet/querypage.do',
    treeLoadUrl:"/nccloud/uapbd/material/MarAsstFrameQueryAction.do",
    listLoadUrl:"/nccloud/uapbd/material/MarAssistantQueryByFramePkAction.do",
    frameQueryUrl:"/nccloud/uapbd/material/MarAsstFrameQueryByPkAction.do",
    frameSaveUrl:"/nccloud/uapbd/material/MarAsstFrameSaveAction.do",
    frameDeleteUrl:"/nccloud/uapbd/material/MarAsstFrameDeleteAction.do",
    AssistantDelUrl:"/nccloud/uapbd/material/MarAssistantDeleteAction.do",
}

/**
 * 资产统计体系
 * 
 * wangdca
 */
class MarassistantList extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        let { form, button, table, search ,syncTree } = this.props;
        let { setSyncTreeData } = syncTree;
        this.setSyncTreeData = setSyncTreeData;   //设置树根节点数据方法
        this.state={
            cardEmpty:true,
            json:{}	
        }
        this.initTemplate(props);
    }

    componentDidMount () {
        //加载左树 默认不加载停用数据
        this.loadLeftTreeData();
    }

    //加载左树数据
    loadLeftTreeData(){
        ajax({
            url:ajaxUrl.treeLoadUrl,
            method:"post",
            data:{},
            success:(res)=>{
                if(res.success){
                    if (res.data[0].children && res.data[0].children.length > 0){
                        this.setState({cardEmpty:false})
                    }
                    this.setSyncTreeData(leftTree, []);
                    //转换树的父子关系
                    let treeData = this.dealTreeData(res.data);
                    this.setSyncTreeData(leftTree, treeData);
                    if(res.data.length>0){

                        //从卡片返回的需要保留原来选中的结构
                        let pk_marasstframe =getDefData("pk_marasstframe",cachKey);
                        // setDefData("pk_marasstframe",cachKey,'');
                        if(pk_marasstframe&&pk_marasstframe!=''){
                            setTimeout(() => {
                                this.props.syncTree.setNodeSelected(leftTree, pk_marasstframe);
                                this.loadTableData(pk_marasstframe);
                            }, 100);
                        }else{
                            //设置默认中第一行 第一行是根节点
                            this.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                            this.props.table.setAllTableData(rightTable, {rows:[]});
                            // this.onSelectEve( res.data[0].refpk,null,false);
                            // this.loadTableData(res.data[0].refpk);//2019-01-23修改 第一行是根节点不需要加载右表的数据，为了效率，不在查询数据
                            // if(res.data[0].refpk!=='root'){
                            // }else{
                            //     this.props.table.setAllTableData(rightTable, {rows:[]});
                            // }
                        }

                    }
                    this.toggleShow();
                }else{
                    alert(res.message);
                }
            },
        });
    }
     
     /**
     * 删除提示
     */
    onDeleteSysEve(selectedTreeNode){
        deleteTreeNode = selectedTreeNode;
        // this.props.modal.show(sysModalDelId);
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title:this.state.json['10140MASST-000001'],
            content:this.state.json['10140MASST-000015'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
            beSureBtnClick:()=>{this.onDeleteSys()}
        })
    }
    //删除操作
    onDeleteSys(){
        let pk = deleteTreeNode.id;
        let that = this;
        ajax({
            url:ajaxUrl.frameDeleteUrl,
            method:"post",
            data:{pk_marasstframe: pk,ts:deleteTreeNode.nodeData.ts},
            success:function(res){
                that.props.syncTree.delNodeSuceess(leftTree,pk);
                if (!that.props.syncTree.getSyncTreeValue(leftTree)[0].children || that.props.syncTree.getSyncTreeValue(leftTree)[0].children.length === 0){
                    that.setState({cardEmpty:true})
                }
                that.props.modal.close(sysModalDelId);
                that.props.syncTree.setNodeSelected(leftTree, "root");
                that.props.table.setAllTableData(rightTable, {rows:[]});
                that.toggleShow();
            },
        });
    }
    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve (data, item, isChange) {
        if(data === 'root'){
            this.props.table.setAllTableData(rightTable, {rows:[]});
            return; 
        }
        this.loadTableData(data);
    }
    /**
     * 根据左树加载右表数据
     * @param {} pk_marasstframe 
     * @param {*} isRefreshAction 
     */
    loadTableData(pk_marasstframe,isRefreshAction=false){
        //加载成员树表
        let that = this;
        ajax({
            url:ajaxUrl.listLoadUrl,
            method:"post",
            data:{pk_marasstframe: pk_marasstframe},
            success:function(res){
                if(res.success){
                    if(res.data){
                        debugger
                        that.props.table.setAllTableData(rightTable, res.data.marassistant_list);
                        that.props.button.setButtonDisabled(['Print','Output'], false);
                        let allnewpks = [];
                        // res.data.marassistant_list.rows.forEach((val) => {
                        //     allnewpks.push(val.values.pk_marassistant.value);
                        // });
                        // that.props.ViewModel.setData(cachKey,{simpleTable:{allpks: allnewpks}});
                    }else{
                        that.props.table.setAllTableData(rightTable, {rows:[]});
                        that.props.button.setButtonDisabled(['Print','Output'], true);
                    }
                    if(isRefreshAction){
                        toast({ color: 'success', title: that.state.json['10140MASST-000016'] });/* 国际化处理： 刷新成功！*/
                    }
                    that.toggleShow();
                }else{
                    alert(res.message);
                }
            },
        });
    }

     //切换页面状态--设置按钮显示和业务状态
	toggleShow (){
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        if(selectNode){
            if(selectNode.id === 'root'){
                this.props.button.setButtonDisabled(['Add'],true);
            }else{
                this.props.button.setButtonDisabled(['Add'],false);
            }
        }else{
            this.props.button.setButtonDisabled(['Add'],true);
        }
    }
    onMouseEnterEve( key ) {
        if(key === "root"){
            let obj = {
                delIcon:false,
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon( leftTree, key, obj )
        }else{
            let obj = {
                delIcon:true,
                editIcon:true,
                addIcon:false
            };
            this.props.syncTree.hideIcon( leftTree, key, obj )
        }
    }
    //新增 -- 结构
    onAddFrame(){
        sysSaveType = 'add';
        this.openSysModal('');
    }
    /**
     * 编辑
     */
    onEditSys(selectedTreeNode){
        sysSaveType = 'edit';
        this.openSysModal(selectedTreeNode.id);
    }
    //体系编辑窗口
    openSysModal(pk){
        this.props.form.setFormStatus(formId,'edit');
        this.props.form.EmptyAllFormValue(formId);
        let that = this;
        ajax({
            url:ajaxUrl.frameQueryUrl,
            method:"post",
            data:{pk_marasstframe:pk},
            success:function(res){
                if(res.success){
                    that.props.form.EmptyAllFormValue(formId);
                    that.props.form.setFormStatus(formId,'add');
                        // this.props.form.setAllFormValue(res.data.form);
                    let cardData = {rows:res.data.marasstframe.rows};
                    let value = {"marasstframe":cardData};
                    Utils.filterEmptyData(value.marasstframe.rows[0].values);
                    that.props.form.setAllFormValue(value);
                    //弹出体系编辑窗口
                     that.props.modal.show(frameModalId);
                }else{
                    alert(res.message);
                }
            },
        });
        
    }
    //体系保存 
    onSaveSys(){
        let flag = this.props.form.isCheckNow(formId);
        if(!flag){
            return;
        }
        let formdata = this.props.form.getAllFormValue(formId);
       //下面的代码用来验证公式
       formdata.areacode = 'marasstframe';
        let validateData = {"model" :formdata,"pageid" :pageCode.mainPageCode};
        this.props.validateToSave( validateData ,()=>{
             this.frameSaveFun(formdata)
             }, { 'marasstframe': 'form' },'form');
    }

    frameSaveFun(formdata){
        let requestParam = {
            model: formdata,
            pageid: pageCode.frameFormPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        let that = this;
        ajax({
            url:ajaxUrl.frameSaveUrl,
            method:"post",
            data:requestParam,
            success:function(res){
                if(res.success){
                    // let treeData = that.dealTreeData(res.data);
                    // if(sysSaveType==='add'){//新增树节点
                        // that.props.syncTree.addNodeSuccess(leftTree,treeData);
                    // }else{//修改树节点
                        // that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    // }
                    that.loadLeftTreeData();
                    that.props.modal.close(frameModalId);
                }else{
                    alert(res.message);
                }
            },
        });
    }
    
    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.iconBox = {
                editIcon: true,
                addIcon: true,
                delIcon: true
            }
            if(!node.children || node.children.length == 0) {
                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
            e.iconBox = {
                editIcon: true,
                addIcon: true,
                delIcon: true
            }
        });
        return data;
    }

    onClickButton(props, id){
        let pk_marasstframe = props.syncTree.getSelectNode(leftTree).id;
        switch (id) {
            case 'Add':
                if(pk_marasstframe === 'root'){
                    toast({content:this.state.json['10140MASST-000017'],color:"warning"});/* 国际化处理： 请选择结构*/
                    return;
                }
                setDefData("pk_marasstframe",cachKey,pk_marasstframe);
                props.pushTo(cardUrl, {
                    pagecode:'10140MASST_card',
                    status: 'add',
                    id:'',
                    pk_marasstframe:pk_marasstframe
                });
            break;
            case 'Refresh':
                // this.onSelectEve(pk_marasstframe,null,true,true);
                this.loadTableData(pk_marasstframe,true);
                break;	
            case 'Asstrst':
                props.openTo(rstUrl,{
                    pagecode:'10140MASSR_card',
                    appcode:'10140MASSR',
                    status: 'browse'
                });
            break;
            default:
                break;
        }
    }
    doubleClick = (record, index, e)=>{
        let pk_marassistant = record.pk_marassistant.value;
        let pk_marasstframe = this.props.syncTree.getSelectNode(leftTree).id;
        setDefData("pk_marasstframe",cachKey,pk_marasstframe);
        this.props.pushTo(cardUrl, {
            status: 'browse',
            pagecode:'10140MASST_card',
            id:pk_marassistant,
            pk:pk_marassistant,
            pk_marasstframe:pk_marasstframe
        });
    }
    
    addClickCall = () => {
        // this.setState({cardEmpty:false})
        this.onAddFrame()
    }

    render() {
        const {table,button, syncTree, modal,DragWidthCom,treeTable,treeTableManyCol,editTable,BillHeadInfo } = this.props;
        const { createSimpleTable } = table;
        const {createButton} = button;
        const { createButtonApp } = button;
        const { createTreeTable } = treeTable;
        const { createEditTable } = editTable;
        const {createBillHeadInfo} = BillHeadInfo;
        const {cardEmpty} = this.state;
        let { treeTableCol } = treeTableManyCol;
        let {createSyncTree} = syncTree;
        let { createModal } = modal;
        return (
            <div className="nc-bill-tree-table">
                {createModal('warning',{
                     title:this.state.json['10140MASST-000018'],/* 国际化处理： 关闭提醒*/
                     content:this.state.json['10140MASST-000019'],/* 国际化处理： 是否确定要关闭？*/
                })}
                {/*体系 编辑模态框*/}
                { createModal(frameModalId,{
                    title:this.state.json['10140MASST-000020'],/* 国际化处理： 辅助属性结构定义*/
                    content:this.props.form.createForm(formId),
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onSaveSys.bind(this),
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        // this.props.modal.show('warning',{
                        //     beSureBtnClick:()=>{
                        //         this.props.modal.close(frameModalId);
                        //         this.props.modal.close('warning');
                        //     }
                        // });
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title:this.state.json['10140MASST-000003'],/* 国际化处理： 确认取消*/
                            content:this.state.json['10140MASST-000004'],/* 国际化处理： 是否确认要取消？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(frameModalId);
                            }
                        })
                    }
                }) }
                 {/*体系 删除模态框*/}
                {createModal(sysModalDelId,{
                     title:this.state.json['10140MASST-000021'],/* 国际化处理： 删除提醒*/
                     content:this.state.json['10140MASST-000022'],/* 国际化处理： 确定要删除数据吗？*/
                     userControl:true,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.onDeleteSys.bind(this),
                     cancelBtnClick: ()=>{this.props.modal.close(sysModalDelId)}
                })}
                {/* 标题 title */}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header" style={{marginBottom: 0}} >
                    {/*页面大图标*/}
                    {/* {createPageIcon()} */}
                    {/* <h2 className="title">{this.state.json['10140MASST-000012']}</h2>国际化处理： 辅助属性设置 */}
                    {createBillHeadInfo({
                        title : this.state.json['10140MASST-000012'],/* 国际化处理： 辅助属性设置*/
                        initShowBackBtn:false
                    })}
                    {/* 按钮区  btn-group */}
                    <div className="btn-group">
                        {createButtonApp({
                            area: 'list_head',
                            buttonLimit: 5,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.list_head')
                        })}
                    </div>
                </NCDiv>
                {/* 标题 主界面区域  左树--右表*/}
                <div className="tree-table">
                    <DragWidthCom
                         //树
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                     treeId:leftTree,
                                     showLine:true, 
                                     searchType:"filtration",
                                     clickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调
                                     clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调
                                     clickAddIconEve: this.onAddFrame.bind(this), //新增点击 回调
                                     onSelectEve: this.onSelectEve.bind(this),   //选择节点回调方法
                                     defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                     onMouseEnterEve:this.onMouseEnterEve.bind(this),//鼠标滑过节点事件
                                     showModal:false
                                })}
                            </div>
                        } 
                        //体系成员---树状表
                        rightDom = {
                            <div style={{ height: '100%' }}>
                            <EmptyAreaTip
                                type="btn"
                                desc={this.state.json['10140MASST-000025']}
                                onClick={this.addClickCall}
                                show={cardEmpty} /> 
                            <div className="treeTableCol" style={{ display: cardEmpty ? 'none' : 'block' }}>
                                    { createSimpleTable( rightTable,{
                                        // async:false,    //数据同步加载为false,异步加载为true
                                        defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                        showCheckBox:true,       // 是否显示复选框 ,默认false不显示
                                        onRowDoubleClick: this.doubleClick.bind(this),//列表双击进入卡片界面
                                        checkedType:'radio',      // 勾选方式，单选radio,多选 checkbox； 默认多选
                                        dataSource: cachKey,//缓存的标识
                                        pkname: 'pk_marassistant',
                                        componentInitFinished:()=>{
                                            //缓存数据赋值成功的钩子函数
                                            //若初始化数据后需要对数据做修改，可以在这里处理
                                        }
                                    } ) }
                            </div>
                            </div>
                        }  
                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百 
                    />
                </div>
            </div>
        )
    }
    //初始化单据模板
    initTemplate = function(props) {
        createUIDom(props)(
            {
                pagecode : pageCode.mainPageCode
                // appid : config.appId
                // appcode:config.appCode
            },
            {
                moduleId: "10140MASST",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    let meta = data.template;
                    meta = this.modifierMeta(props, meta)
                    props.meta.setMeta(meta);
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delete',this.state.json['10140MASST-000022']) /* '确认要删除该条吗？' 设置操作列上删除按钮的弹窗提示 */
                    }
                }
            }
        );
    }
    tableButtonClick=(props, id, text, record, index)=>{
        // let pk_marassistant = record.values.pk_marassistant.value;
        let pk_marassistant = record.pk_marassistant.value;
        let pk_marasstframe = props.syncTree.getSelectNode(leftTree).id;
        switch(id){
            case 'Edit':
                setDefData("pk_marasstframe",cachKey,pk_marasstframe);  
                props.pushTo(cardUrl, {
                    status: 'edit',
                    pagecode:'10140MASST_card',
                    id:pk_marassistant,
                    pk:pk_marassistant,
                    pk_marasstframe:pk_marasstframe
                });
            break;
            case 'Delete':
                ajax({
                    url:ajaxUrl.AssistantDelUrl,  
                    data: {pk_marassistant:pk_marassistant,ts:record.ts.value},
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', title: this.state.json['10140MASST-000024'] });/* 国际化处理： 删除成功！*/
                            props.table.deleteTableRowsByIndex(rightTable, index);
                            let {deleteCacheId} = props.table;
                            deleteCacheId(rightTable,pk_marassistant);
                        }
                    }
                });
                break;
            default:
                break;
    
        }
    }
    modifierMeta=(props, meta)=> {
        //添加操作列
        meta[rightTable].items.push({
            attrcode: 'opr',
            label: this.state.json['10140MASST-000014'],/* 国际化处理： 操作*/
            itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
            className: 'table-opr' ,
            width: 200,
            fixed:'right',
            visible: true,
            render: (text, record, index) => {
                return (
                    props.button.createOprationButton(
                        tableBtnAry,
                        {
                            area: "list_inner",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => this.tableButtonClick.call(this,props, id, text, record, index)
                        }
                    )
                )
            }
        });
         //添加超链接
         meta[rightTable].items = meta[rightTable].items.map((item, key) => {
             // //item.width = 150;
             if (item.attrcode == linkItem) {
                 item.render = (text, record, index) => {
                     return (
                         <span
                             style={{color: '#007ace', cursor: 'pointer' }}
                             onClick={() => {
                                 setDefData("pk_marasstframe",cachKey,this.props.syncTree.getSelectNode(leftTree).id);
                                 props.pushTo(cardUrl, {
                                     status: 'browse',
                                     pagecode:'10140MASST_card',
                                     id: record['pk_marassistant'].value,//列表卡片传参
                                     pk:record['pk_marassistant'].value,
                                     pk_marasstframe:this.props.syncTree.getSelectNode(leftTree).id
                                 });
                             }}
                         >
                             {record && record[linkItem] && record[linkItem].value}
                         </span>
                     );
                 };
             }
             return item;
         });
        return meta;
    }
}


MarassistantList =  createPage({
    initTemplate:function(){},
    billinfo:{
        billtype: 'form', 
        pagecode: pageCode.mainPageCode,
        headcode: 'marasstframe',
    }
})(MarassistantList);

// ReactDOM.render(<OrgSysPage {...config}/>, document.querySelector('#app'));
export default MarassistantList;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65