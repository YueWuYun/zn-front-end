//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,print,high,promptBox,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
let{ NCMessage:Message,NCCol:Col,NCRow:Row,NCDropdown:Dropdown,NCMenu:Menu,NCButton:Button,NCCheckbox:Checkbox,NCTooltip:Tooltip,EmptyAreaTip }=base;
const {PrintOutput}=high;
import AreaclTreeRef from '../../../refer/address/AreaclTreeRef/index'
import './index.less'
// let {BDselect} = Utils;
/**
 * 穿梭框--导入使用
 */
import Transfer from '../../../public/excomponents/Transfer';
import Utils from '../../../public/utils';

const {ExcelImport}=high;
const {NCMenu,NCDropdown,NCCheckbox,NCPopconfirm,NCRadio, NCDiv} = base;
const {NCMenuGroup} = NCMenu;
const { Item } = Menu;



/****************默认参数  开始***********************/
let loadTreeDataUrl="/nccloud/uapbd/areaclass/AreaClassTreeQueryAction.do";
let rollBackCodeUrl = '/nccloud/uapbd/areaclass/AreaClassRollBackCodeAction.do';
let printUrl = '/nccloud/uapbd/areaclass/AreaClassPrintAction.do';

let formId = "areaclassForm";
let treeId= "areaclassTree";

let pageStatus = 'browse';//界面的状态，是否编辑态
let showDisable = false;
let importModalId = 'importModalId';//引入对话框id
let mdClassId = '7f91af95-154e-43f9-995e-da76a192be15';//元数据id管控模式使用
/***************默认参数  结束********************/

/**
 * 地区分类
 * wangdca
 */
class AreaClassFun extends Component {
    constructor(props){
        super(props)
        this.state={
            cardEmpty:true,
            json:{},
            checkDisable:false,
            disabledSearch:false,//左树搜索框是否可用
            oprType:'0',
            // importDataValue:{},
            importLeftTreeData:[],
            importRightTreeData:[],
            pks:[],
            //add by wh
            context:{
                title:''
            }	
        }
        this.initTemplate(props);
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
            e.iconBox = {
                editIcon: true,
                addIcon: true,
                delIcon: true
            }
            deleteDataChildrenProp(e);
        });
        return data;
    }

    componentWillMount(){
       //add wh 20181020 多语引用的json文件
       let callback = (json, status, inlt) => {
        if (status) {
            this.setState({json, inlt},() => {
                this.initTemplate(this.props)
                //this.loadTreeData(false);//默认不加载停用的数据
            })       // 保存json和inlt到页面state中并刷新页面
        }
    }
    this.props.MultiInit.getMultiLang({moduleId: '10140ARCLB', domainName: 'uapbd',callback})

       
    }

    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){
        // /**************
        //  * 构造请求参数
        //  * @type {{checked: boolean}}
        //  *************/
        // let requestParam = { checked:this.state.checked };
        this.loadTreeData(false);//默认不加载停用的数据
       
        // //修改按钮状态
        // this.initButtonStatus();

    }
    /**
     * 左树加载
     */
    loadTreeData(showDisable,action){
        // let check = this.chcekMode();
        // if(!check){
        //     return;
        // }
        // var bdselect =  new BDselect([mdClassId]);
        // bdselect.getModeByClassid(mdClassId,(mode) => {
        //     debugger;
        //     var managemode = mode[0].managemode;
        //     var nodetype = this.props.nodeType;
        //     if (managemode == BDselect.SCOPE_GROUP&&nodetype ==='GLOBE_NODE'){
        //         toast({color: 'warning',content : '可见范围为集团无全局节点'});
        //         this.props.button.setButtonsVisible({
        //             Import:false,
        //             Save:false,
        //             SaveAdd:false,
        //             Cancel:false,
        //             Refresh:true,
        //             Print:false,
        //             Output:false
        //         });
        //         return;
        //     }else{
        //     }
        // });
        /*************
        * ajax请求 加载树数据
        *************/
       ajax({
           url:loadTreeDataUrl,
           data:{nodeType:this.props.nodeType,showDisable:showDisable},
           success:(result)=>{
               if(result.success){
                   // let data = [Object.assign( {...this.root} , {children : result.data} )];
                   if (!result.data[0].children || result.data[0].children.length === 0){
                       this.setState({cardEmpty:true})
                   } else {
                       this.setState({cardEmpty:false})
                   }
                   //同步树  加载全部数据
                   this.props.syncTree.setSyncTreeData(treeId , this.dealTreeData(result.data));
                   //展开节点  设置默认展开项
                   this.props.syncTree.openNodeByPk(treeId, "root");
                   //设置默认中根节点
                   this.props.syncTree.setNodeSelected(treeId, "root");
                   this.onSelectEve( "root",null,true);
                   if(action === 'Refresh'){
                       toast({ color: 'success', title:this.state.json['10140ARCLB-000039'] });/* 国际化处理： 刷新成功*/
                   }
               }
           }
       });
    }
      //切换页面状态--设置按钮显示和业务状态
	toggleShow (status){
        debugger
        this.setState({cardEmpty:false})
        if(status === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }

        pageStatus = status;
        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
        if(!selectedTreeNode){
            this.props.button.setButtonsVisible({
                Import:true,
                Save:false,
                SaveAdd:false,
                Cancel:false,
                Refresh:true,
                Print:true,
                Output:true,
                imports:true,
                export:true
            });
            this.props.form.setFormStatus(formId,'browse');
            this.setState({
                checkDisable:false
            });
            //设置表单启用状态项不可用
            this.props.form.setFormItemsDisabled(formId,{enablestate:true});
            return;
        }
        if(pageStatus === 'edit'){//编辑态需要设置保存新增按钮不可用
            this.props.button.setButtonDisabled({Save:false,SaveAdd:true,Cancel:false});
        }else if(pageStatus ==='add'){//新增需要设置保存、保存新增、取消可用
            this.props.button.setButtonDisabled({Save:false,SaveAdd:false,Cancel:false});
        }
        if(pageStatus === 'edit'||pageStatus==='add'){
            this.props.button.setButtonsVisible({
                Import:false,
                Save:true,
                SaveAdd:true,
                Cancel:true,
                Refresh:false,
                Print:false,
                Output:false,
                imports:false,
                export:false
            });
            this.props.form.setFormStatus(formId,'edit');
             //设置表单启用状态项不可用
             this.props.form.setFormItemsDisabled(formId,{enablestate:true});
            //设置左树不可操作
            this.props.syncTree.setNodeDisable(treeId,true);
            // this.props.syncTree.disabledSearch(treeId,true);
            this.setState({
                checkDisable:true,
                disabledSearch:true
            });
        }else{
            if(selectedTreeNode.id === 'root'){
                this.props.button.setButtonsVisible({
                    Import:true,
                    Save:false,
                    SaveAdd:false,
                    Cancel:false,
                    Refresh:true,
                    Print:true,
                    Output:true,
                    imports:true,
                    export:true

                });
                 //设置表单启用状态项不可用
                 this.props.form.setFormItemsDisabled(formId,{enablestate:true});
            }else{
                this.props.button.setButtonsVisible({
                    Import:true,
                    Save:false,
                    SaveAdd:false,
                    Cancel:false,
                    Refresh:true,
                    Print:true,
                    Output:true,
                    imports:true,
                    export:true
                });
                //集团节点不能停启用全局数据
                let pk_org = this.props.form.getFormItemsValue(formId,'pk_org').value;
                if(pk_org==='GLOBLE00000000000000'&&this.props.nodeType==='GROPE_NODE'){//集团节点不能修改全局的数据
                    this.props.form.setFormItemsDisabled(formId,{'enablestate':true});
                }else if(pk_org!='GLOBLE00000000000000'&&this.props.nodeType==='GLOBE_NODE'){//集团节点不能修改全局的数据
                    this.props.form.setFormItemsDisabled(formId,{'enablestate':true});
                }else{
                    this.props.form.setFormItemsDisabled(formId,{'enablestate':false});
                }
            }
            this.props.form.setFormStatus(formId,'browse');
             //设置表单启用状态项可用
            // setTimeout(() => { this.props.form.setFormItemsDisabled(formId,{'enablestate':false});}, 2);
            //设置左树可操作
            this.props.syncTree.setNodeDisable(treeId,false);
            // this.props.syncTree.disabledSearch(treeId,false);
            this.setState({
                checkDisable:false,
                disabledSearch:false
            });
        }

        let allData = this.props.syncTree.getSyncTreeValue(treeId);
        if(!allData||(allData.length === 1&&(!allData[0].children) )){//无数据时  打印按钮不可用
            this.props.button.setButtonDisabled(['Print','Output'],true);
        }else{
            this.props.button.setButtonDisabled(['Print','Output'],false);
        }
        
    }
    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve (data, item, isChange) {
        if(data==='root'){
            this.props.form.EmptyAllFormValue(formId);
            this.toggleShow('browse');
            // setFormEnableStateProp(this.props);
            return;
        }
        ajax({
                url:"/nccloud/uapbd/areaclass/AreaClassQueryByPkAction.do",
                data:{pk_areacl:data},
                success:(result)=>{
                    if(result.success){
                        this.props.form.EmptyAllFormValue(formId);
                        let rowsData = result.data.form.areaclassForm.rows 
                        if(pageStatus === 'browse'){
                            rowsData= Utils.convertGridEnablestate(rowsData);
                        }
                        // this.props.form.setAllFormValue(result.data);
                        let cardData = {rows:rowsData};
                        // result.data.areaclassForm.rows = Utils.convertGridEnablestate(result.data.areaclassForm.rows);
                        // let cardData = {rows:result.data.areaclassForm.rows};
                        let value = {'areaclassForm':cardData}
                        this.props.form.setAllFormValue(value);
                        this.props.form.setFormItemsDisabled(formId,{code:!result.data.isCodeEdit});
                        // this.props.form.setAllFormValue(result.data.areaclassForm);
                        this.toggleShow(pageStatus);
                    }else{
                        alert(result.message);
                    }
                }
        });
    }

    /**
     * 启用操作
     * @param {*}  
     */
    enableAreaClass(){
        let formData = this.props.form.getAllFormValue(formId);//获得表单信息
        let newValue = this.props.form.getFormItemsValue(formId,'enablestate').value;
        formData.rows = Utils.convertGridEnablestate(formData.rows);
        let requestParam = {
            model:formData,
            pageid:this.props.pageCode //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        ajax({
            url:"/nccloud/uapbd/areaclass/AreaClassEnableAction.do",
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //更新右卡数据
                    result.data.formData.areaclassForm.rows = Utils.convertGridEnablestate(result.data.formData.areaclassForm.rows);
                    let cardData = {rows:result.data.formData.areaclassForm.rows};
                    let value = {'areaclassForm':cardData}
                    this.props.form.setAllFormValue(value);
                    // this.props.form.setAllFormValue(result.data.formData);
                    let treeData = this.dealTreeData(result.data.treeData);
                    this.props.syncTree.editNodeSuccess(treeId,treeData[0]);
                    if(newValue){
                        this.props.modal.close('modal');
                        this.props.modal.close('enableModal');
                        toast({title:this.state.json['10140ARCLB-000002'],color: 'success'});/* 国际化处理： 启用成功！,提示*/
                    }else{
                        this.props.modal.close('disableModal');
                        this.props.modal.close('modal');
                        toast({title:this.state.json['10140ARCLB-000004'],color: 'success'});/* 国际化处理： 停用成功！,提示*/
                    }
                }else{
                    alert(result.message);
                }
            }
        });
    }
    /**
     * 停用操作
     * @param {*}  
     */
    disableAreaClass(){
        this.enableAreaClass();
    }

    /**
     * 表单编辑事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index){
        let  selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
        if('root' === selectedTreeNode.id){
            return;
        }
        switch(key){
            case "enablestate":
                let newValue = this.props.form.getFormItemsValue(formId,'enablestate').value;
                if(newValue){
                    promptBox({
                        color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title:this.state.json['10140ARCLB-000003'],/* 国际化处理： 提示*/
                        content:this.state.json['10140ARCLB-000005'],/* 国际化处理： 确定要启用该数据吗？*/
                        cancelBtnClick:()=>{
                            props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                        },
                        beSureBtnClick:()=>{
                            this.enableAreaClass();
                        }
                    });
                    // props.modal.show('modal',{
                    //     title:'提示',
                    //     content:'确定要启用该数据吗？',
                    //     closeModalEve:()=>{
                    //         props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                    //     },
                    //     cancelBtnClick: ()=>{
                    //         props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                    //     },
                    //     beSureBtnClick:()=>{
                    //         this.enableAreaClass();
                    //     }
                    // });
                }else{
                    promptBox({
                        color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title:this.state.json['10140ARCLB-000003'],/* 国际化处理： 提示*/
                        content:this.state.json['10140ARCLB-000006'],/* 国际化处理： 您确定要停用所选数据及其所有下级数据吗？*/
                        cancelBtnClick:()=>{
                            props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                        },
                        beSureBtnClick:()=>{
                            this.enableAreaClass();
                        }
                    });
                    // props.modal.show('modal',{
                    //     title:'提示',
                    //     content:'确定要停用该数据吗？',
                    //     closeModalEve:()=>{
                    //         props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                    //     },
                    //     cancelBtnClick: ()=>{
                    //         props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                    //     },
                    //     beSureBtnClick:()=>{
                    //         this.enableAreaClass();
                    //     }
                    // });
                }
              break;
            default:
              break;
        }
    }

    /**
     * 新增
     */
    onAddAreaClass(selectNode){
        pageStatus = "add";
        ajax({
            url:"/nccloud/uapbd/areaclass/AreaClassGetNewAction.do",
            data:{pk_areacl:selectNode.id,nodeType:this.props.nodeType},
            success:(result)=>{
                if(result.success){
                    this.props.form.EmptyAllFormValue(formId);
                    this.props.form.setFormStatus(formId,'add');
                    let rowsData = result.data.form.areaclassForm.rows 
                    // rowsData= Utils.convertGridEnablestate(rowsData);
                    // this.props.form.setAllFormValue(result.data);
                    let cardData = {rows:rowsData};
                    let value = {'areaclassForm':cardData}
                    Utils.filterEmptyData(rowsData.valus);
                    this.props.form.setAllFormValue(value);
                    this.props.form.setFormItemsDisabled(formId,{code:!result.data.isCodeEdit});
                    this.toggleShow(pageStatus);
                }else{
                    alert(result.message);
                }
            }
        });
    }

    /**
     * 编辑
     */
    onEditAreaClass(selectedTreeNode){
        pageStatus = 'edit';
        //设置选中节点
        this.props.syncTree.setNodeSelected(treeId,selectedTreeNode.id);
        this.onSelectEve(selectedTreeNode.id, selectedTreeNode, true);
    }

   
    /**
     * 保存
     */
    onSaveAreaClass(saveType){
        debugger
        let  selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
        let formData = this.props.form.getAllFormValue(formId);//获得表单信息
        let flag = this.props.form.isCheckNow(formId);
        if(!flag){
            return;
        }
        formData.rows = Utils.convertGridEnablestateToSave(formData.rows);
        
        //下面的代码用来验证公式
        // orgdata.areacode = 'orgForm';
        let validateData = {"model" :formData,"pageid" :this.props.pageCode};
        validateData.model.areacode = formId;
        this.props.validateToSave( validateData ,()=>{
             this.areaClassSaveFun(saveType,formData)
             }, { 'areaclassForm': 'form' },'form');
    }

    areaClassSaveFun(saveType,formData){
        let requestParam = {
            model:formData,
            pageid:this.props.pageCode //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        ajax({
            url:"/nccloud/uapbd/areaclass/AreaClassSaveAction.do",
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //更新右卡数据
                    result.data.formData.areaclassForm.rows = Utils.convertGridEnablestate(result.data.formData.areaclassForm.rows);
                    // this.props.form.setAllFormValue(result.data.formData);
                    let cardData = {rows:result.data.formData.areaclassForm.rows};
                    let value = {'areaclassForm':cardData}
                    this.props.form.setAllFormValue(value);
                    //处理左树数据
                    let treeData = this.dealTreeData(result.data.treeData);
                    if(pageStatus == 'edit'){
                        //更新左树数据
                        this.props.syncTree.editNodeSuccess(treeId,treeData);
                    }else{
                        this.props.syncTree.addNodeSuccess(treeId,treeData);
                    }
                    this.toggleShow('browse');
                    if(saveType==='saveAdd'){
                        let pid = treeData[0].nodeData.pid;
                        if(pid){
                            this.props.syncTree.setNodeSelected(treeId,pid);
                        }else{
                            this.props.syncTree.setNodeSelected(treeId,'root');
                        }
                        this.onAddAreaClass(this.props.syncTree.getSelectNode(treeId));
                    }
                    toast({ color: 'success', title: this.state.json['10140ARCLB-000037'] });/* 国际化处理： 保存成功*/
                }else{
                    alert(result.message);
                }
            }
        });
    }

    /**
     * 保存新增
     */
    onSaveAdd(){
        this.onSaveAreaClass('saveAdd');
    }

    /**
     * 删除操作
     */
    deleteAreaClass(){
        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
        let requestParam = {pk_areacl:selectedTreeNode.id,ts:selectedTreeNode.nodeData.ts};
        let that = this;
        ajax({
            url:"/nccloud/uapbd/areaclass/AreaClassDeleteAction.do",
            data:requestParam,
            success:(result)=>{
                debugger;
                if(result.success){
                    this.props.form.EmptyAllFormValue(formId);
                    //调用异步树的接口，删除该树节点
                    this.props.asyncTree.delTreeData(treeId,selectedTreeNode.id);
                    //设置表单启用状态项不可用
                    this.props.form.setFormItemsDisabled(formId,{enablestate:true});
                    // toast({content:"删除成功！",title:"提示"});
                    // this.props.modal.close('deleteModal');
                    // setFormEnableStateProp(this.props);
                    if (!this.props.syncTree.getSyncTreeValue(treeId)[0].children || this.props.syncTree.getSyncTreeValue(treeId)[0].children.length === 0){
                        this.setState({cardEmpty:true})
                    }
                    toast({ color: 'success', title: this.state.json['10140ARCLB-000038'] });/* 国际化处理： 删除成功*/
                }
            },
            error: function(res){
                // alert(res.message);
                toast({ color: 'warning', content:res.message });
                that.props.modal.close('deleteModal');
            }
        })
    } 

    /**
     * 删除事件
     */
    onDeleteAreaClass(selectedTreeNode){
        //设置选中节点
        this.props.syncTree.setNodeSelected(treeId,selectedTreeNode.id);
        // this.props.modal.show('deleteModal');
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title:this.state.json['10140ARCLB-000040'], //删除
            content:this.state.json['10140ARCLB-000007'], /* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
            beSureBtnClick:()=>{this.deleteAreaClass()}
        })
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key){
        if(pageStatus !=='browse'){//编辑太 左树不可用
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:false
            };
            this.props.syncTree.hideIcon(treeId, key, obj );
            return;
        }

        //设置
        if(key === "root"){
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(treeId, key, obj );
            return;
        }
        let node =  this.props.syncTree.getSyncTreeValue(treeId,key);
        let pk_org = node.nodeData.pk_org;
        if(pk_org==='GLOBLE00000000000000'&&this.props.nodeType==='GROPE_NODE'){//集团节点不能修改全局的数据
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(treeId, key, obj );
        }else if(pk_org!='GLOBLE00000000000000'&&this.props.nodeType==='GLOBE_NODE'){
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(treeId, key, obj );
        }else{
            let obj = {
                delIcon:true, //false:隐藏； true:显示; 默认都为true显示
                editIcon:true,
                addIcon:true
            };
            this.props.syncTree.hideIcon(treeId, key, obj );
        }
    }
    /**
     * checkbox change 事件
     */
    onCheckBoxChange(checked){
        debugger
        showDisable = !showDisable;
        this.loadTreeData(showDisable)
    }

     /**
     * 引入
     */
    onImport(){
        let that  = this;
        ajax({
            url:"/nccloud/uapbd/areaclass/AreaClassImportQueryAction.do",
            method:"post",
            data:{},
            success:(res)=>{
                if(res.success){
                    //弹出引入窗口
                    that.props.modal.show(importModalId);
                    that.orgTransfer.setRootTitle(this.state.json['10140ARCLB-000008']);/* 国际化处理： 行政区划*/
                    if(res.data){
                        that.orgTransfer.reset(res.data);
                    }else{
                        that.orgTransfer.reset([]);
                    }
                    that.orgTransfer.setMoveType('0');
                }else{
                    alert(res.message);
                }
            },
            error: function(res){
                alert(res.message);
            }
        });

    }

     /**
	 * 切换树节点移动方式
	 */
	handleOprTypeChange(value){
		this.setState({
			oprType : value
        });
        this.orgTransfer.setMoveType(value);
    }
     //数据选择监听事件
     handelBeforeMove(nodes,value,type){
        // if(type==='bl2r'){
        //    return this.checkBeforeMove(nodes);
        // }
        return true;
    }

    /**
     * 引入对话框
     */
    getImportDialog(){
        return (
			<div id="org_transfer" className="steps-content nc-theme-gray-area-bgc" style={{height:'450px'}}>
			    <Transfer 
                   ref={(item)=>{this.orgTransfer = item}} showSearch={true}
                />
                <NCRadio.NCRadioGroup 
                     style={{width:'100%',textAlign:'center'}}
                    name="oprType"
                    selectedValue={this.state.oprType}
                    onChange={this.handleOprTypeChange.bind(this)}>
                    {/* <NCRadio value="0" >所有上下级</NCRadio>
                    <NCRadio value="1" >单一节点</NCRadio>
                    <NCRadio value="2" >所有一级节点</NCRadio>
                    <NCRadio value="3" >所有二级节点</NCRadio>
                    <NCRadio value="4" >所有三级节点</NCRadio>
                    <NCRadio value="5" >所有四级节点</NCRadio> */}
                    <NCRadio value="0" >{this.state.json['10140ARCLB-000029']/* 国际化处理： 包含所有下级*/}</NCRadio>
                    <NCRadio value="1" >{this.state.json['10140ARCLB-000030']/* 国际化处理： 仅自己*/}</NCRadio>
                    <NCRadio value="2" >{this.state.json['10140ARCLB-000031']/* 国际化处理： 仅直接下级*/}</NCRadio>
                    <NCRadio value="3" >{this.state.json['10140ARCLB-000032']/* 国际化处理： 仅末级*/}</NCRadio>
                    <NCRadio value="4" >{this.state.json['10140ARCLB-000033']/* 国际化处理： 全部*/}</NCRadio>
                </NCRadio.NCRadioGroup>
                <br/><a style={{color:'red'}}>*{this.state.json['10140ARCLB-000034']/* 国际化处理： 选择任何一种都会带上所有上级*/}</a>
			</div>
            
		);
    }
    openIcon = () => {
        return (
            <span>{this.state.json['10140ARCLB-000035']/* 国际化处理： 开关*/}</span>
        )
    }    
     /**
	 * 将树数据转换为表数据，提供给第三步生成表格数据使用
	 */
	convertToTable=(orgTree,data)=>{
		orgTree.forEach((item,index)=>{
			data.push(item);
			if(item.children&&item.children.length > 0){
				this.convertToTable(item.children,data);
			}
		});
	}

    //引入保存
    onImportSave(){
        var orgs = this.orgTransfer.getData();
        if(!(orgs&&orgs.length>0)){
            // alert('您没有选择任何数据！');
            toast({content : this.state.json['10140ARCLB-000009'],color : 'warning'});/* 国际化处理： 您没有选择任何数据！*/
            return;
        }
        let that = this;
        ajax({
            url:"/nccloud/uapbd/areaclass/AreaClassImportSaveAction.do",
            method:"post",
            data:{orgs,showDisable:showDisable,nodeType:this.props.nodeType},
            success:(res)=>{
                if(res.success){
                    if(res.data.warning){
                        toast({ color: 'warning', content: res.data.warning });
                    }else{
                        toast({ color: 'success', title:this.state.json['10140ARCLB-000010']});/* 国际化处理： 引入成功！*/
                    }
                     //同步树  加载全部数据
                     that.props.syncTree.setSyncTreeData(treeId , that.dealTreeData(res.data.treeData));
                     //展开节点  设置默认展开项
                     that.props.syncTree.openNodeByPk(treeId, "root");
                     //设置默认中根节点
                     that.props.syncTree.setNodeSelected(treeId, "root");
                     that.onSelectEve( "root",null,true);
                     that.props.modal.close(importModalId);
                     that.toggleShow('browse');
                }else{
                    alert(res.message);
                }
            },
            error: function(res){
                alert(res.message);
            }
        });
    }
    onClickButton(props,id){
        switch (id) {
            case 'Cancel':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10140ARCLB-000011'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10140ARCLB-000012'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick:()=>{
                        if (!props.syncTree.getSyncTreeValue(treeId)[0].children || props.syncTree.getSyncTreeValue(treeId)[0].children.length === 0){
                            this.setState({cardEmpty:true})
                        }
                        props.form.cancel(formId);
                        this.toggleShow('browse');
                        //编码回滚
                        let pkValue = this.props.form.getFormItemsValue(formId,'pk_areacl').value;
                        if(pkValue){
                            return;
                        }
                        let codeValue = this.props.form.getFormItemsValue(formId,'code').value;
                        if(!codeValue){
                            return;
                        }
                        ajax({
                            url:rollBackCodeUrl,
                            data:{pk_areacl:pkValue,newBillCode:codeValue,nodeType:this.props.nodeType},
                            success:(result)=>{
                                if(result.success){
        
                                }else{
                                    alert(result.message);
                                }
                            }
                        });
                    }
                })
            break;
            case 'Save':
                this.onSaveAreaClass();
            break
            case 'SaveAdd':
                this.onSaveAdd();
            break;
            case 'Import':
                this.onImport();
            break;
            case 'Refresh':
                this.loadTreeData(showDisable,'Refresh');
            break;
            case 'Print':
                this.onPrintClinck('print');
                // debugger
                // let allD = this.props.syncTree.getSyncTreeValue(treeId)[0].children;
                // let pks = [];
                // allD.forEach((item,index) => {
                //     if(item.id !=='root'){
                //         pks.push(item.id);
                //     }
                // });
                // print(
                //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                //     printUrl, 
                //     {
                //         //billtype:'',  //单据类型
                //         funcode: props.appCode,      //功能节点编码，即模板编码
                //         nodekey:'areaclass',     //模板节点标识(NC段默认模板配置)
                //         oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                //     }
                // );
                break;
            case 'Output':
                this.onPrintClinck('output');
                // let allD1 = this.props.syncTree.getSyncTreeValue(treeId)[0].children;
                // let pks1 = [];
                // allD1.forEach((item,index) => {
                //     pks1.push(item.id);
                // });
                // this.setState({
                //     pks: pks1
                //  },this.refs.printOutput.open());	
                // print(
                //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                //     printUrl, 
                //     {
                //         //billtype:'',  //单据类型
                //         funcode: props.appCode,      //功能节点编码，即模板编码
                //         //nodekey:'',     //模板节点标识
                //         nodekey:'areaclass',     //模板节点标识(NC段默认模板配置)
                //         outputType:'output',
                //         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                //     }
                // );
                break;
            case 'export':
                this.setState({

                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            default:
            break;
        }
    }
    /**
     * 打印、输出
     */
    onPrintClinck(flag){
        let treeData = this.props.syncTree.getSyncTreeValue(treeId);
        if(!treeData){
            toast({content:this.state.json['10140ARCLB-000013'],title:this.state.json['10140ARCLB-000003'],color:"warning"});/* 国际化处理： 没有打印的数据！,提示*/
            return;
        }
        let pks = this.getTreeAllPks(treeData);
        if(!pks||pks.length === 0){
            toast({content:this.state.json['10140ARCLB-000013'],title:this.state.json['10140ARCLB-000003'],color:"warning"});/* 国际化处理： 没有打印的数据！,提示*/
            return;
        }
        if(flag === 'print'){
            print('pdf', printUrl,
            {
                //billtype:'',
                funcode: this.props.appCode,      //功能节点编码，即模板编码
                nodekey:'areaclass',     //模板节点标识(NC段默认模板配置)
                oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                // outputType: flag
            });
        }else{
            this.setState({
                pks: pks
             },this.refs.printOutput.open());
        }
    }
    /**
     * 获取树的主键
     */
    getTreeAllPks = (treeData)=>{
        let result = new Array();
        const loop = (treeData)=>{
            treeData.forEach(data=>{
                if(data.refpk!='root'){
                    result.push(data.refpk);
                }
                if(data && data['children'] && data['children'].length>0){
                    loop(data.children);
                }
            })
        }
        loop(treeData);
        return result;
    }

    // /**
    //  * 管控模式校验
    //  */
    // chcekMode(){
    //     var bdselect =  new BDselect([mdClassId]);
    //     return bdselect.getModeByClassid(mdClassId,(mode) => {
    //         var managemode = mode[0].managemode;
    //         var nodetype = this.props.nodeType;
    //         if (managemode == BDselect.SCOPE_GROUP&&nodetype ==='GLOBE_NODE'){
    //             toast({color: 'warning',content : '可见范围为集团无全局节点'});
    //             return false;
    //         }
    //     });
    // }

    addClickCall = () => {
        this.setState({cardEmpty:false})
        this.onAddAreaClass({id:"root"})
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
        const {asyncTree,syncTree,form,button,modal,search,DragWidthCom, BillHeadInfo} = this.props;
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const {createAsyncTree} = asyncTree;//创建异步树，需要引入这个
        const {createBillHeadInfo} = BillHeadInfo;
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个
        const {createButton}=button;
        const {cardEmpty} = this.state;
        const { createButtonApp } = button;
        let { createModal } = modal;  //模态框
        let titleName = this.props.nodeType == 'GLOBE_NODE'?this.state.json['10140ARCLB-000000']:this.state.json['10140ARCLB-000001']
        const {NCCreateSearch} = search;
        return(
            <div className="nc-bill-tree-card">
                {createModal('modal',{noFooter:false})}
                {createModal('deleteModal',{
                     title:this.state.json['10140ARCLB-000014'],/* 国际化处理： 删除提醒*/
                     content:this.state.json['10140ARCLB-000015'],/* 国际化处理： 确定要删除数据吗？*/
                     userControl:true,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.deleteAreaClass.bind(this),
                     cancelBtnClick: ()=>{this.props.modal.close('deleteModal')}
                })}
                {createModal('enableModal',{
                     title:this.state.json['10140ARCLB-000016'],/* 国际化处理： 启用提醒*/
                     content:this.state.json['10140ARCLB-000005'],/* 国际化处理： 确定要启用该数据吗？*/
                     userControl:true,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.enableAreaClass.bind(this),
                     cancelBtnClick: ()=>{this.props.modal.close('enableModal')}
                })}
                {createModal('disableModal',{
                     title:this.state.json['10140ARCLB-000017'],/* 国际化处理： 停用提醒*/
                     content:this.state.json['10140ARCLB-000006'],/* 国际化处理： 您确定要停用所选数据及其所有下级数据吗？*/
                     userControl:true,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.disableAreaClass.bind(this),
                     cancelBtnClick: ()=>{this.props.modal.close('disableModal')}
                })}
                 { this.state.json['10140ARCLB-000018']&& createModal(importModalId,{
                    title:this.state.json['10140ARCLB-000018'],/* 国际化处理： 引入行政区划*/
                    content:this.getImportDialog.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onImportSave.bind(this),
                    cancelBtnClick: ()=>{this.props.modal.close(importModalId)}
                }) }
                {/* 头部 header*/}
                <NCDiv className="header" areaCode={NCDiv.config.HEADER}>
                     {/*页面大图标*/}
                    {/* 标题 title*/}
                    <div className='title'>
                        {createBillHeadInfo(
                            {
                                //title-search-detail
                                title: this.props.nodeType == 'GLOBE_NODE'?this.state.json['10140ARCLB-000000']:this.state.json['10140ARCLB-000001'],
                                backBtnClick: () => {},
                                initShowBackBtn: false
                            }
                        )}
                    </div>
                    <span className="showOff">
                        <Checkbox
                            disabled ={this.state.checkDisable}
                            // defaultChecked={false}
                            checked = {showDisable}
                            onChange={this.onCheckBoxChange.bind(this)}
                            size="lg"
                        >
                            {this.state.json['10140ARCLB-000036']/* 国际化处理： 显示停用*/}
                        </Checkbox>
			        </span>

                    {/* 按钮组 btn-group*/}
                    <div className=" btn-group">
                        {/* { createButton('btnImport', {name: '引入',buttonColor:'main-button',style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onImport.bind(this) })}
                        { createButton('btnSave', {name: '保存',buttonColor:'main-button',style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onSaveAreaClass.bind(this) })}
                        { createButton('btnSaveAdd', {name: '保存新增',buttonColor:'secondary-button',style:{height:'32px','line-height':'33px',width:'80px','font-size':'13px','font-family':'PingFangHk'}, onButtonClick: this.onSaveAdd.bind(this) })}
                        { createButton('btnCancel', {name: 取消,buttonColor:'secondary-button', style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onCancelAreaClass.bind(this) })} */}
                         {createButtonApp({
                            area: 'card_head',
                            buttonLimit: 5,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.card_head')
                        })}
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                         // 左树区域
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId :treeId,
                                    needEdit: true, //不启用编辑
                                    showLine: true, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    searchType:"filtration",
                                    disabledSearch:this.state.disabledSearch,
                                    onSelectEve: this.onSelectEve.bind(this),//选择
                                    onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                    clickEditIconEve: this.onEditAreaClass.bind(this), //编辑点击 回调
                                    clickAddIconEve: this.onAddAreaClass.bind(this), //新增点击 回调
                                    clickDelIconEve: this.onDeleteAreaClass.bind(this), // 删除点击 回调
                                    showModal:false,
                                    defaultExpandAll:false   //初始化展开所有节点  ，默认参数为false,不展开,地区分类数据量太大，全部展开太耗时了
                                    //openIcon:this.openIcon.bind(this)
                                    // onTreeExpand:this.onTreeExpandCallBack.bind(this),//
                                })}
                            </div>}     //左侧区域dom
                         // 右卡片区域
                        rightDom = {
                            <div style={{ height: '100%' }}>
                            <EmptyAreaTip
                                type="btn"
                                desc={this.state.json['10140ARCLB-000041']/* 国际化处理： 请先新增左侧树*/}
                                onClick={this.addClickCall}
                                show={cardEmpty} />
                            <div className="card-area" style={{ display: cardEmpty ? 'none' : 'block' }}>
                                {createForm(formId, {
                                    onAfterEvent: this.onAfterFormEvent.bind(this),
                                    cancelPSwitch: true
                                })
                                }
                            </div></div> }     //右侧区域dom

                        defLeftWid = '20%'      // 默认左侧区域宽度，px/百分百
                    />
                </div>
                <PrintOutput
					ref='printOutput'
					url={printUrl}
					data={{
						funcode: this.props.appCode,      //功能节点编码，即模板编码
                        nodekey:'areaclass',     //模板节点标识(NC段默认模板配置)
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
                >
                </PrintOutput>
                <ExcelImport
                    {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = {this.props.billType}//单据类型
                    selectedPKS = {[]}
					appcode={this.props.appCode}
					pagecode={this.props.pageCode}
				/>
            </div>

        )
    }
    
    /**
     * 单据模板
     * @param props
     */
    initTemplate = (props)=>{
    
        props.createUIDom({
            pagecode : props.pageCode,
            // appid : props.appId
            // appcode:props.appCode
        },
        (data)=>{
            let meta = data.template;
            console.log(data);
            props.renderItem('form', formId, 'pk_fatherarea', AreaclTreeRef('pk_fatherarea'));
            meta = this.modifierMeta(meta,props);
                
            // setFormEnableStateProp(props);
            props.meta.setMeta(meta);
          if(data.button){
              let excelimportconfig = excelImportconfig(props,'uapbd',this.props.billType,true,'',{'appcode':this.props.appCode , 'pagecode':this.props.pageCode},()=>{this.loadTreeData(showDisable)});
			  props.button.setUploadConfig("imports",excelimportconfig);
              props.button.setButtons(data.button);
            //   props.button.setPopContent('Delline','确认要删除该条吗？') /* 设置操作列上删除按钮的弹窗提示 */
          }
        });
    
    }
    
    
    
    /**
     * 设置表单启用状态属性不可以编辑
     * @param props
     */
    setFormEnableStateProp=(props)=>{
        //获得元数据
        let meta = props.meta.getMeta();
        //判断元数据中有我的表单元数据
        if(Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(formId)){
            //获得表单元数据
            let formMeta = props.meta.getMeta()[formId];
            //判断表单元数据有属性
            if(formMeta.hasOwnProperty("items")){
                //获得属性
                let items = formMeta.items;
                if(Object.prototype.toString.call(items).slice(8, -1) === 'Array'){
                    items.map((item)=>{
                        //查找enablestate属性
                        if(item.hasOwnProperty("attrcode") && item.attrcode == 'enablestate'){
                            //设置enablestate属性不可用
                            props.form.setFormItemsDisabled(formId,{enablestate:true});
                        }
                    });
                }
            }
        }
    }
    
    /**
     * 更新元数据 设置参照
     * @param meta
     * @param props
     * @returns {*}
     */
    modifierMeta=(meta,props) =>{
        if('GLOBE_NODE' === props.nodeType){
            meta[formId].items.map((item)=>{
                if (item.attrcode == 'pk_fatherarea') {
                    item.queryCondition = () => {
                        return {
                            //此处可以添加参数
                            TreeRefActionExt: 'nccloud.web.uapbd.areaclass.action.AreaClassRefExtAction'
                        };
                    }
                }
            })
        }
        return meta;
    
    }
}
// /**
//  * 创建页面
//  */
// let AreaClassFun = createPage({
//     // initTemplate: initTemplate,
// })(AreaClassPage)


/**
 * 渲染页面
 */
// ReactDOM.render(<AreaClassFun  {...config}/>, document.querySelector('#app'));

export default AreaClassFun;


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65