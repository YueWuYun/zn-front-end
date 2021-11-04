//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,promptBox,createPageIcon} from 'nc-lightapp-front';
import UserdefruleTree from "../component/userdefruletree";
import createUIDom from "../../../public/utils/BDCreateUIDom";
import utils from '../../../public/utils';
const {showFormular } = utils;
const {NCDiv,NCCheckbox} = base;


/****************默认参数  开始***********************/
let urls={
    loadTreeDataUrl:"/nccloud/uapbd/userdefitem/userderitemLoadTreeData.do",
    queryCardUrl:"/nccloud/uapbd/userdefitem/queryUserdefitemData.do",
    saveDataUrl:"/nccloud/uapbd/userdefitem/saveUserdefitemData.do",
    editAfterEventUrl:"/nccloud/uapbd/userdefitem/editAfterEvent.do",
    dealUserdefitemDataUrl:"/nccloud/uapbd/userdefitem/dealUserdefitemData.do"
};
let pageCode="10140UDIB_list";//默认集团
let appCode='10140UDIB';//默认集团
let tableId = "userdefitems";
/***************默认参数  结束********************/

/**
 * 用户定义属性设置（userdefitem）
 * @author xuehaoc
 */
export default class UserDefItem extends Component {
    constructor(props){
        super(props)
        this.config =Object.assign({
            title: '10140UDIB-000000',/* 国际化处理： 用户定义属性设置-全局*/
            treetitle: '10140UDIB-000001',/* 国际化处理： 用户定义属性组*/
            treeId:"userdefruleTree",
            tableId:"userdefitems",
            pageCode:"10140UDIB_list",
            appCode:'10140UDIB',
            nodeType:'GLOBE_NODE',
            primaryKey:'pk_userdefrule',
            urls:urls
        },props.config);

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key":"~",
            "title":this.config.treetitle,
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": this.config.treetitle,
            "refpk": "~"
        };

        this.state = {
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            disabledSearch:false,
            tree:{
                needEdit:false,
                showLine:false,
                needSearch:true,
                showModal:false,
            },
            editFlag:null,
            oldParent:'',//原父节点
            isAdd:false,//新增标志  默认false
            json:{}
        }

        var requestCount = 0,
            result = {};

        var afterHandler = (res) =>{
            this.fillTreeData(res);
        };

        this.initTemplate(this.props,()=>{
            requestCount = requestCount +　1;
            if(requestCount == 2){
                afterHandler( result.res);
            }

        });

        this.loadTreeData((res)=>{
            requestCount = requestCount +　1;
            result.res = res;
            if(requestCount == 2){
                afterHandler( result.res);
            }
        });
    }

    /**
     * 请求元数据模板
     */
    componentWillMount(){

    }
    initTemplate = (props,callback) => {
        pageCode = props.config.pageCode?props.config.pageCode:pageCode;
        createUIDom(props)(
            {pagecode:pageCode},
            {
                moduleId: "10140UDIB",domainName: 'uapbd'
            },
            (data, langData,inlt)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data.template){
                    let meta = data.template;
                    meta = this.modifierMeta(meta,props);
                    props.meta.setMeta(meta);
                }
                if (data.button) {
                    props.button.setButtons(data.button);
                }
                callback && callback();
            }
        );
    }

    /**
     * 更新元数据 设置参照
     * @param meta
     * @param props
     * @returns {*}
     */
    modifierMeta = (meta,props)=> {
        meta[tableId].items.forEach((temp)=>{
            if(temp.attrcode == 'classid'){
                temp['isMultiSelectedEnabled']=false;
            }
            if(temp.attrcode == 'usufructgroup'){
                temp['options']=[{display:this.state.json['10140UDIB-000002'],value:"default"}];/* 国际化处理： default-通用引用*/
            }
        });
        return meta;

    }

    /**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
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
        });
        return data;
    }

    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){

    }

    componentDidUpdate(){
        let tableStatus = this.props.editTable.getStatus(tableId);
        if(tableStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    /**
     * 加载树节点数据
     */
    loadTreeData(callback ){
        let requestParam = {
            nodeType:this.config.nodeType
        };
        ajax({
            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    callback && callback(result);
                }
            }
        });
    }

    fillTreeData(result){
        let data = [Object.assign( {...this.root} ,{title:this.state.json[this.root.title],refname:this.state.json[this.root.refname]}, {children : result.data} )];
        this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
        this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
        this.props.button.setButtonDisabled(['edit','refresh'],true);
        this.toggleShow('browse');
    }


    //切换页面状态
    toggleShow = (status) =>{
        let flag = status === 'browse' ? false : true;
        this.props.button.setButtonVisible(['save','cancel'],flag);
        this.props.button.setButtonVisible(['edit','refresh'],!flag);
        this.props.syncTree.setNodeDisable(this.config.treeId,flag);
        this.props.editTable.setStatus(this.config.tableId, status==='browse'?"browse" :"edit");
        this.setState({disabledSearch:flag});
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk,callback){
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        this.state.curSelectedNode = selectedTreeNode;
        this.props.button.setButtonDisabled('refresh',false);
        if(refpk == this.root.refpk||this.props.editTable.getStatus()=='edit'){
            //清空表单
            this.props.tabale.setTableData(this.config.tableId);
            callback&&callback();
            return;
        }
        let TreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
        if(TreeNode.children!=null){
            callback&&callback()
            return;
        }
        let requestParam = {
            refpk:refpk,
            nodeType:this.config.nodeType,
            pageCode:this.config.pageCode
        };
        ajax({
            url:this.config.urls.queryCardUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success&&result.data){
                    showFormular(this.props,result,{
                        "userdefitems" : "editTable",
                    });
                    this.props.editTable.setTableData(this.config.tableId, result.data[this.config.tableId]);
                    let datas = this.props.editTable.getAllRows(this.config.tableId);
                    let params ={dealinfo:datas.map((e) => {
                        if(e.values.classid.value!=null) {
                            // if (e.values['usufructgroup'].value == "default") {
                            //     this.props.editTable.setValByKeyAndRowId(this.config.tableId, e.rowid, 'usufructgroup', {
                            //         value: "default",
                            //         display: this.state.json['10140UDIB-000002']/* 国际化处理： default-通用引用*/
                            //     })
                            // }
                            if (this.config.nodeType === 'GROUP_NODE' && e.values.pk_org.value === 'GLOBLE00000000000000') {
                                this.props.editTable.setEditableRowByRowId(this.config.tableId, e.rowid, false);
                            } else if (e.values.enabled && e.values.enabled.value == false) {
                                this.props.editTable.setEditableRowByRowId(this.config.tableId, e.rowid, false);
                            } else {
                                let classid = e.values.classid.value;
                                let rowid = e.rowid;
                                let usugroupvalue= e.values['usufructgroup'].value;
                                return {
                                    classid, rowid,usugroupvalue
                                }
                            }
                        }else{
                            // this.props.editTable.setEditableByKey(this.config.tableId, e.rowid, ['inputlength'], false)
                            // this.props.editTable.setEditableByKey(this.config.tableId, e.rowid, ['digits'], false)
                            // this.props.editTable.setEditableByKey(this.config.tableId, e.rowid, ['usufructgroup'], false)
                        }
                    })}
                    ajax({
                        url: this.config.urls.dealUserdefitemDataUrl,
                        data: params,
                        success: (res) => {
                            if(res.success&&res.data){
                                this.state.editFlag = res.data;
                                // res.data.forEach((e)=>{
                                //     this.props.editTable.setEditableByKey(this.config.tableId, e.rowid, ['inputlength'], e['inputLength'])
                                //     this.props.editTable.setEditableByKey(this.config.tableId, e.rowid, ['digits'], e['digits'])
                                //     this.props.editTable.setEditableByKey(this.config.tableId, e.rowid, ['usufructgroup'], e['UsufructgroupValue'] != null ? true : false)
                                //     this.props.editTable.setValByKeyAndRowId(this.config.tableId, e.rowid, 'usufructgroup', { value:e['UsufructgroupValue'], display:e['Usufructgroupdisplay']})
                                // })
                            }
                        }
                    })
                    this.props.button.setDisabled({edit:false});
                    /************************************************************
                     * 选中树节点回调成功后设置当前选中节点
                     ************************************************************/
                    let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                    this.state.curSelectedNode = selectedTreeNode;
                    //this.setState(this.state);
                    callback&&callback();
                }
            }
        });
    }

    checkHasChildren(tree,pk) {
        if(!tree){
            tree = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        }
        let i = tree.length;
        while (i--){
            let data = tree[i];
            if (data.refpk === pk) {
                if(data.hasOwnProperty('children') && data.children.length === 0){
                    delete data.children;
                    data.isleaf = true;
                }
                return true;
            } else {
                if (data.hasOwnProperty('children')) {
                    let res = this.checkHasChildren(data.children, pk);
                    if(res){
                        return false
                    }
                }
            }
        }
    }

    //按钮事件
    buttonClick(props, id) {
        switch (id) {
            case 'edit':
                this.toggleShow('edit');
                break;
            case 'refresh':
                if(this.state.curSelectedNode==null){
                    toast({title:this.state.json['10140UDIB-000003']});/* 国际化处理： 刷新成功！*/
                }else{
                    this.onSelectTree(this.state.curSelectedNode.refpk,()=>{
                        toast({title:this.state.json['10140UDIB-000003']});/* 国际化处理： 刷新成功！*/
                    });
                }
                break;
            case 'save':
                this.onSaveUserDefItem() ;
                break;
            case 'cancel':
                promptBox({
                    color:"info",
                    title:this.state.json['10140UDIB-000004'],/* 国际化处理： 取消*/
                    content:this.state.json['10140UDIB-000005'],/* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick:()=>{
                        this.props.editTable.cancelEdit(this.config.tableId, this.toggleShow("browse"));
                    },
                    cancelBtnClick:()=>{
                        return;
                    },
                    closeBtnClick:()=>{
                        return;
                    }
                })
                break;
            default:
                break;
        }
    }


    /**************************************************
     *
     * 保存：
     * 保存状态下：
     *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
     *
     **************************************************/
    onSaveUserDefItem=()=>{
        let tableData = this.props.editTable.getChangedRows(this.config.tableId,true);
        if(!tableData || tableData.length === 0) {
            this.toggleShow('browse');
            toast({ color: 'success', title: this.state.json['10140UDIB-000008'] });/* 国际化处理： 保存成功!*/
            return
        }
        if(!this.props.editTable.checkRequired(this.config.tableId, this.props.editTable.getAllRows(this.config.tableId,true))) {
            return
        }
        this.props.validateToSave( {
            pageid:this.config.pageCode,
            model:{
                areaType: 'table',
                pageinfo:null,
                areacode:this.config.tableId,
                rows:tableData
            },
        },()=>{
            ajax({
                url:urls.saveDataUrl,
                data:{
                    pageid:this.config.pageCode,
                    model:{
                        pageinfo:null,
                        areacode:this.config.tableId,
                        rows:tableData
                    },
                    userjson:`{nodeType:${this.config.nodeType}}`

                },
                success:(result) => {
                    debugger
                    if(result.success){
                        if(result.data!=null){
                            this.onSelectTree(this.state.curSelectedNode.refpk);
                            this.toggleShow('browse');
                            toast({ color: 'success', title: this.state.json['10140UDIB-000008'] });/* 国际化处理： 保存成功!*/
                        }
                    }

                }
            });
            } , {'userdefitems':'editTable'} , 'grid' )

    }
    /*****button group end*****/
    TableBeforeEvent=(props, moduleId , key,  value,oldvalue, data)=>{
        debugger
        if ((this.config.nodeType === 'GROUP_NODE' && data.values.pk_org.value === 'GLOBLE00000000000000')||(data.values.enabled && data.values.enabled.value == false)){
            return false;
        }
        let editFlag = this.state.editFlag;
        let flag = false;
        switch(key.attrcode){
            case 'inputlength':
                if(data.values.classid.value==null||data.values.classid.value==""){
                    return false
                }else {
                    editFlag.forEach((e)=>{
                        if(e.rowid==data.rowid){
                            flag = e['inputLength']
                        }
                    })
                }
                return flag
               break
            case 'digits':
                if(data.values.classid.value==null||data.values.classid.value==""){
                    return false
                }else {
                    editFlag.forEach((e)=>{
                        if(e.rowid==data.rowid){
                            flag = e['digits']
                        }
                    })
                }
                return flag
                break
            case 'usufructgroup':
                if(data.values.classid.value==null||data.values.classid.value==""){
                    return false
                }else {
                    editFlag.forEach((e)=>{
                        if(e.rowid==data.rowid){
                            flag = e['UsufructgroupValue'] != null ? true : false
                            this.props.editTable.setValByKeyAndRowId(this.config.tableId, e.rowid, 'usufructgroup', { value:e['UsufructgroupValue'], display:e['Usufructgroupdisplay']})
                        }
                    })
                }
                return flag
                break;
            default:
                return true;
        }
    }

    //编辑后事件
    TableAfterEvent=(props, moduleId , key,  value,oldvalue, index, data)=>{
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
        debugger
        if(key === 'classid'){
            ajax({
                url:this.config.urls.editAfterEventUrl,
                data:{classid:value.refpk},
                success:(result)=>{
                    if(result.data){
                        props.editTable.setValByKeyAndIndex(moduleId, index, 'digits', { value:result.data['DigitsValue'], display:null})
                        props.editTable.setValByKeyAndIndex(moduleId, index, 'usufruct', { value:result.data['UsufructValue'], display:null})
                        props.editTable.setValByKeyAndIndex(moduleId, index, 'usufructgroup', { value:result.data['UsufructgroupValue'], display:result.data['UsufructgroupValue']=="default"?this.state.json['10140UDIB-000002']:null})/* 国际化处理： default-通用引用*/
                        if(Object.prototype.toString.call(result.data['InputLengthValue'])=='[object Undefined]'){
                        }else if(result.data['InputLengthValue']){
                            props.editTable.setValByKeyAndIndex(moduleId, index, 'inputlength', { value:result.data['InputLengthValue'], display:null})
                        }else{
                            props.editTable.setValByKeyAndIndex(moduleId, index, 'inputlength', { value:null, display:null})
                        }
                        if(!result.data['inputLength']){
                            props.editTable.setValByKeyAndIndex(moduleId, index, 'inputlength', { value:null, display:null})
                        }
                        if(!result.data['digits']){
                            props.editTable.setValByKeyAndIndex(moduleId, index, 'digits', { value:null, display:null})
                        }
                        props.editTable.setEditableRowKeyByIndex(moduleId, index, ['inputlength'], result.data['inputLength'])
                        props.editTable.setEditableRowKeyByIndex(moduleId, index, ['digits'], result.data['digits'])
                        if(result.data['UsufructgroupValue']!=null){
                            props.editTable.setEditableRowKeyByIndex(moduleId, index, ['usufructgroup'],true)
                            let map = result.data['resMapList'];
                            props.meta.getMeta()[tableId].items.forEach((temp)=>{
                                if(temp.attrcode == 'usufructgroup'){
                                    temp['options']=map;
                                }
                            })
                        }else{
                            props.editTable.setEditableRowKeyByIndex(moduleId, index, ['usufructgroup'],false)
                        }
                        let editFlag = this.state.editFlag
                        result.data["rowid"]=data.rowid;
                        editFlag[editFlag.length]=result.data
                    }
                }
            });
        }
    }
    /**
     * 渲染
     * @returns {*}
     */
    render(){
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const {syncTree,editTable,button,ncmodal,DragWidthCom,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个

        let {createEditTable} = editTable;;//创建表单，需要引入这个

        const { createButtonApp } = button;

        let { createModal } = ncmodal;  //模态框

        /**
         * 树参数
         **/
        let marpuTreeParam = {
            treeId :this.config.treeId,
            needEdit: this.state.tree.needEdit,
            showLine: this.state.tree.showLine, //显示连线
            needSearch: this.state.tree.needSearch, //是否需要搜索框
            onSelectTree: this.onSelectTree.bind(this),//选择
            showModal:this.state.tree.showModal,
            disabledSearch:this.state.disabledSearch
        };
        return(
            <div>

                {createModal('modal',{noFooter:false})}
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-tree-table'>
                    {/* 标题 title*/}
                    <div className='header'>
                        {/*createPageIcon()*/}
                        {/*<h2 className='title'>{this.state.json[this.config.title]}</h2>*/}
                        <div className="title title-text">
                        {createBillHeadInfo({
                            title:this.state.json[this.config.title],
                            initShowBackBtn:false
                                    })}
                        </div>
                        {/* 按钮组 btn-group*/}
                        <div className="btn-group">
                            {createButtonApp({
                                area: 'header-button-area',
                                buttonLimit: 3,
                                onButtonClick: this.buttonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-table">
                    <DragWidthCom

                        // 左树区域
                        leftDom = {<UserdefruleTree treeConfig={marpuTreeParam} syncTree={this.props.syncTree} ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree }/>}

                        // 右卡片区域
                        rightDom = {<div className="nc-bill-table-area">
                            {createEditTable(this.config.tableId,{
                                    showIndex:true,
                                    onAfterEvent:this.TableAfterEvent.bind(this),
                                    onBeforeEvent:this.TableBeforeEvent.bind(this),
                                    adaptionHeight:true
                                }
                            )}
                        </div> }

                        // 默认左侧区域宽度，px/百分百
                        defLeftWid = '20%'
                        leftMinWid = '300px'
                    />
                </div>
                {createModal('modal',{noFooter:false})}
            </div>

        )
    }
}

/**
 * 单据模板
 * @param props
 */











//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65