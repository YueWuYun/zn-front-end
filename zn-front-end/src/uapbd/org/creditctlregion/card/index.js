//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,NCDatePicker,toast,cacheTools,print,high,getBusinessInfo,cardCache,promptBox,getMultiLang} from 'nc-lightapp-front';
let { getCacheById, updateCache ,addCache,getCurrentLastId ,getNextId, deleteCacheById } = cardCache;
let { NCCol:Col, NCRow:Row,NCAffix,NCStep,NCRadio ,NCDiv} =base;
const {PrintOutput}=high;
const {NCBackBtn}=base;
const NCSteps = NCStep.NCSteps;
let businessInfo = getBusinessInfo();
import './index.less';
const  formId = 'head';
const tableId = 'financeorgs';
let uiStatus = 'browse';
import  Utils from '../../../public/utils';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Transfer from '../../../public/excomponents/Transfer';
import { Table } from '../../../public/excomponents';

const appId = '0001Z01000000000156S';
const pageCode = '10100CRECR_card';
const tableBtnAry = ["DelLine"];		//表列操作按钮
const toListURl = '/list';
// let toListURl = '/uapbd/org/creditctlregion/main/index.html';

let enableUrl='/nccloud/uapbd/org/CreditCtlRegionEnableAction.do';
let disableUrl='/nccloud/uapbd/org/CreditCtlRegionDisableAction.do';
let printUrl='/nccloud/uapbd/org/CreditCtlRegionPrintAction.do';
let queryURL= '/nccloud/uapbd/org/CreditCtlRegionQuery.do';

/**
 * AjaxUrl配置
 */
let ajaxUrl={
    orgTreeLoadUrl:'/nccloud/uapbd/org/CreditCtlRegionQuerySourceOrgAction.do',
    createCreditUrl:'/nccloud/uapbd/org/CreditRegionCreateFromOrgAction.do',
    batchSaveUrl:'/nccloud/uapbd/org/CreditRegionBatchSaveAction.do',
}

let cachKey = '10100CRECR_list';//缓存的标识
let stepModal = 'stepModal';//批量新增模态框id
let stepTableId = 'stepListTable';//批增第二部列表组件id
let editTableId = 'editListTable';//批增第三步列表组件id

class CRECREditForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            // cardState:'browse',
            pks:[],	
            currentStep:0,
            oprType:'0',
            allTreeData: [],
            rightTreeData: [],
            stepListData:[],
            json:{}
        }
        this.initTemplate(props);
    }

    componentWillMount() {
    }
    //处理新增
    onAddNew(){
        ajax({
            url:'/nccloud/uapbd/org/CreditCtlRegionGetNewAction.do',
            success:(res)=>{
                if(res.success){
                    //清除上个界面的所有的值
                    this.props.form.EmptyAllFormValue(formId);
                    this.props.form.setFormStatus(formId,'add');
                    // this.props.form.setAllFormValue(res.data.form);
                    let cardData = {rows:res.data.form.head.rows};
                    let value = {'head':cardData}
                    Utils.filterEmptyData(value.head.rows[0].values);
                    this.props.form.setAllFormValue(value);
                    this.props.cardTable.setTableData(tableId,{rows: []});
                    this.toggleShow ("Add");
                    //保存完之后会把行操作按钮隐藏掉，所以新增的时候，把按钮在显示出来
                    this.props.button.setButtonVisible(['DelLine'],true);
                    //不知道为啥设置编辑态不好使，在此重新设置一下
                    setTimeout(()=>{
                        this.changeBodyEdit(0);
                        this.props.form.setFormStatus(formId, 'edit');
                        this.props.cardTable.addRow(tableId);
                    }, 200); 
                }else{
                    alert(res.message);
                }
            }
        });
    }

    // //获取url的status
    // getStatus(){
    //     if(window.location.hash.indexOf('#')!=-1){
    //         return window.location.hash.split('#')[1].split("&")[0].split("=")[1];
    //     }else{
    //         return 'browse';
    //     }
    // }

    //切换页面状态--设置按钮显示和业务状态
	toggleShow (status) {
        uiStatus = status;
        // this.setState({
        //     cardState:status
        // })
        let pk_ccregion = this.props.form.getFormItemsValue(formId,'pk_ccregion')?this.props.form.getFormItemsValue(formId,'pk_ccregion').value:null;
        if(!pk_ccregion){
            pk_ccregion = this.props.getUrlParam('id');
        }
        //浏览态
        if('browse'===status){
            this.props.button.setMainButton('Add',true);
            this.props.button.setButtonsVisible({
                Add:true,
                Copy:true,
                Edit:true,
                Delete:true,
                // btnEnable:false,
                Return:true,
                Save:false,
                SaveAdd:false,
                Cancel:false,
                AddLine:false,
                DelLine:false,
                Print:true,
                Output:true,
                Refresh:true
                // btnAddNew:true,
            });
            this.props.cardTable.setStatus(tableId, "browse");
            this.props.form.setFormStatus(formId, 'browse');
            this.props.form.setFormItemsDisabled(formId,{'enablestate':false});
            if(!pk_ccregion){
                this.props.button.setButtonDisabled(['Copy','Edit','Delete','Print','Output'],true);
            }
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);//是否显示翻页
            //控制返回按钮是否显示
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: true
            });
        
        }else{//编辑状态
            this.props.button.setButtonsVisible({
                Add:false,
                Edit:false,
                Copy:false,
                Delete:false,
                // btnEnable:false,
                Return:false,
                Save:true,
                SaveAdd:true,
                Cancel:true,
                AddLine:true,
                DelLine:true,
                Print:false,
                Output:false,
                Refresh:false
            });
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//是否显示翻页
            this.props.cardTable.setStatus(tableId, 'edit');
            this.props.form.setFormStatus(formId, 'edit');
            this.props.form.setFormItemsDisabled(formId,{'enablestate':true});

            if(uiStatus === 'Add' || uiStatus === 'add'){
                this.props.button.setButtonsVisible({
                    SaveAdd:true
                });
            }else{
                this.props.button.setButtonsVisible({
                    SaveAdd:false
                });
            }

             //控制返回按钮是否显示
             this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false
            });
        }

        if(uiStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
	};

    //获取url的enablestate
    // getEnablestate(){
    //     if(window.location.hash.indexOf('#')!=-1){
    //         return window.location.hash.split('#')[1].split("&")[2].split("=")[1];
    //     }
    // }
    //获取url的pkjob
    // getPk_ccregion(){
    //     if(window.location.hash.indexOf('#')!=-1){
    //         return window.location.hash.split('#')[1].split("&")[1].split("=")[1];
    //     }else{
    //         return '';
    //     }

    // }
    //根据卡片状态控制按钮显示
    componentDidMount() {
        debugger
        let that = this;
        uiStatus = this.props.getUrlParam('status');
        if(uiStatus==='edit'||uiStatus==='browse'){
            let pk_ccregion = this.props.getUrlParam('id');
            this.loadCardData(pk_ccregion,uiStatus);
        }
        if(uiStatus==='add'){
            this.onAddNew();
        }
        if(this.props.getUrlParam('status')==='copy'){
            this.onCopyed();
        }
    }

    //取消
    onRefreshed(){
        let pk_ccregion = this.props.getUrlParam('id');
        if(!pk_ccregion){
            pk_ccregion = getCurrentLastId(cachKey);
        }
        this.loadCardData(pk_ccregion,'browse');
    }
    //复制
    onCopyed(){
        debugger;
        let pkvalue = this.props.form.getFormItemsValue(formId,'pk_ccregion');
        let pk_ccregion = pkvalue?pkvalue.value:undefined;
        if(!pk_ccregion){
            pk_ccregion = this.props.getUrlParam('id');
        }
        if(pk_ccregion){//新增状态若以前界面有值则要恢复
            ajax({
                url:'/nccloud/uapbd/org/CreditCtlRegionCopyAction.do',
                data:{'pk_ccregion':pk_ccregion},
                success:(res)=>{
                    if(res){

                        this.props.form.EmptyAllFormValue(formId);
                        // this.props.form.setAllFormValue(res.data.form);
                        res.data.form.head.rows = Utils.convertGridEnablestate(res.data.form.head.rows);
                        let cardData = {rows:res.data.form.head.rows};
                        let value = {'head':cardData}
                        this.props.form.setAllFormValue(value);
                        this.props.cardTable.setTableData(tableId,{rows: []});
                        // if(res.data.grid){//有子表数据
                        //     this.props.editTable.setTableData(tableId, res.data.grid.financeorgs);
                        // }
                        this.toggleShow('Add')
                        this.props.cardTable.setStatus(tableId, "edit");
                        this.props.form.setFormStatus(formId, 'edit');
                        let newValue = this.props.form.getFormItemsValue(formId,'layertype').value;
                        this.onAferEdit(this.props,formId,'layertype',newValue,0);

                        //不知道为啥设置编辑态不好使，在此重新设置一下
                        setTimeout(()=>{
                            this.changeBodyEdit(newValue);
                            this.props.form.setFormStatus(formId, 'edit');
                        }, 200); 
                    }else{
                        alert(res.message)
                    }
                }
            });
        }
    }
    /**
     * 保存
     * @param {*} saveType -- Save   SaveAdd
     */
    onSaveClick(saveType){
        let flag = this.props.form.isCheckNow(formId);
        if(!flag){
            return;
        }
        this.props.cardTable.filterEmptyRows(tableId,['pk_financeorg'],'include');
        if(!this.props.cardTable.checkTableRequired(tableId)) {//edittable的必输项校验   
            return;
        }
        let CardData = this.props.createMasterChildData('10100CRECR_card', formId, tableId);
        let enableValue =  this.props.form.getFormItemsValue(formId,'enablestate').value;
        if(!(enableValue==='0'||enableValue==='1'||enableValue ==='2'||enableValue === '3')){
            CardData.head.head.rows = Utils.convertGridEnablestate(CardData.head.head.rows);
        }

        this.props.validateToSave( CardData ,()=>{
            this.saveCardData(saveType,CardData)
        }, {
            formId: 'form',
            [tableId]: 'cardTable'
        },'card');
    }

    saveCardData(saveType,CardData){

        let pkCell = this.props.form.getFormItemsValue(formId,'pk_ccregion');
        let pk_ccregion=pkCell.value;

        let saveData = CardData;
        let that = this;
        ajax({
            url:'/nccloud/uapbd/org/CreditCtlRegionSaveAction.do',
            data:saveData,
            success:function(res){
                let { success, data } = res;
                if(success){
                    toast({ color: 'success', title: that.state.json['10100CRECR-000000'] });/* 国际化处理： 保存成功！*/
                    res.data.form.head.rows = Utils.convertGridEnablestate(res.data.form.head.rows);
                    let pk_value = res.data.form.head.rows[0].values.pk_ccregion.value;
                    let cardData = {rows:res.data.form.head.rows};
                    let value = {'head':cardData}
                    that.props.form.setAllFormValue(value);
                    if( res.data.grid){//有子表数据
                        that.props.cardTable.setTableData(tableId, data.grid.financeorgs);
                    }

                    var cachdata = {head:{head:{rows:res.data.form.head.rows}}}//更新缓存的数据
                    if(pk_ccregion){//修改保存
                        updateCache('pk_ccregion',pk_value, cachdata,formId,cachKey);
                    }else{//新增保存
                        addCache(pk_value, cachdata,formId,cachKey);
                    }
                    //更新URL中的主键的值，上下翻页要以此为依据查找上下的主键
                    that.props.setUrlParam(pk_value);
                    if(saveType === 'SaveAdd'){
                        that.onAddNew();
                    }else{
                        //保存完之后，需要把子表操作行按钮隐藏
                        that.props.button.setButtonVisible(['DelLine'],false);
                        that.toggleShow('browse');
                    }
                }
            }
        });
    }

    //按钮点击事件
    onClickHeaderBtn(props,id){
        //获取表单状态
        let headstatus = props.form.getFormStatus('head');
        let that = this;
        let pkCell = props.form.getFormItemsValue(formId,'pk_ccregion');
        let pk_ccregion=pkCell.value;
        switch (id) {
            case'Add':
                this.onAddNew();
            break;
            case 'BatchAdd':
                this.onBatchAdd();
            break;
            case 'Save':
                this.onSaveClick('Save');
                break;
            case 'SaveAdd':
                this.onSaveClick('SaveAdd');
                break;
            case 'Edit':
                let pkCelledit = props.form.getFormItemsValue(formId,'pk_ccregion');
                let pk_ccregionedit=pkCelledit.value;
                ajax({
                    url:'/nccloud/uapbd/org/CreditCtlRegionPermAction.do',
                    data:{pk_ccregion:pk_ccregionedit,mdOperateCode:'edit'},
                    success: (e) => {
                        this.toggleShow('edit');
                        let newValue = this.props.form.getFormItemsValue(formId,'layertype').value;
                        this.changeBodyEdit(newValue);
                    }
                });
                break;
            case 'Copy':
                this.onCopyed();
            break;
            case 'Delete':
                let tsCell = props.form.getFormItemsValue(formId,'ts');
                let ts=tsCell.value;
                let pk_ccregions = [];
                pk_ccregions.push(pk_ccregion);
                promptBox({
                    color: 'warning', 
                    title: this.state.json['10100CRECR-000035'],
                    content: this.state.json['10100CRECR-000001'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
                    beSureBtnClick:() => {
                        let that = this;
                        ajax({
                            url:'/nccloud/uapbd/org/CreditCtlRegionDeleteAction.do',
                            data:{pk_ccregions:pk_ccregions,ts:ts},
                            success:function(res){
                                if(res.success){
                                    //删除后显示下一条数据
                                    let nextId = getNextId(pk_ccregion, cachKey);//根据当前id,获取下个id
                                    //调用删除缓存数据方法
                                    deleteCacheById("pk_ccregion",pk_ccregion,cachKey);
                                    if(!nextId){
                                        that.props.setUrlParam({
                                            id: ""
                                        });
                                    }else{
                                        that.props.setUrlParam({
                                            id: nextId
                                        });
                                    }
                                    //根据nextId查询下条数据
                                    that.loadCardData(nextId,'browse');
                                }else{
                                    alert(res.message);
                                }
                            }
                        });
                    }
                });
                break;
            case'Return':
                // props.linkTo('/uapbd/org/creditctlregion/main/index.html');
                props.pushTo(toListURl,{ status:'browse',pagecode:'10100CRECR_list'});
                break;
            case 'Cancel':
                promptBox({
                    color: 'warning', 
                    title: this.state.json['10100CRECR-000002'],/* 国际化处理： 取消*/
                    content: this.state.json['10100CRECR-000003'],/* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick:() => {
                        this.onRefreshed();
                    }
                });
            break;
            case 'Refresh':
                this.onRefreshed();
            break;
            case 'Print':
                let pks = [];
                pks.push(pk_ccregion);
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    printUrl, 
                    {
                        // billtype:'',  //单据类型
                        funcode:'10100CRECR',      //功能节点编码，即模板编码
                        nodekey:'creditctlregionEditorPrint',     //模板节点标识
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                );
            break;
            case 'Output':
                let pks1 = [];
                pks1.push(pk_ccregion);
                this.setState({
                    pks: pks1
                },this.refs.printOutput.open());
                break;
            default:
                    break;
        }

    }
    /**
     * 批量新增
     */
    onBatchAdd(){
        let that= this;
        this.props.modal.show(stepModal);
        this.setState({
            currentStep : 0,
            oprType : '0'
        });
        ajax({
            url : ajaxUrl.orgTreeLoadUrl,
            data : {},
            success : (res)=>{
                let {success,data} = res;
                if(res.data){
                    this.orgTransfer.reset(res.data.orgVOs);
                    this.state.allTreeData = res.data && res.data.orgVOs ? res.data.orgVOs : [];
                }else{
                    this.orgTransfer.reset([]);
                }
                this.orgTransfer.setMoveType('0');
                this.updatestepModalButtonStatus(0);
                this.orgTransfer.setRootTitle(this.state.json['10100CRECR-000015'])/* 国际化处理： 财务组织*/
            }
        });
    }
    /**
     * 卡片翻页,因为非标准的主子表数据，缓存中数据不全，无法直接使用，只能重新查询数据了
     * @param {} props 
     * @param {*} pk 
     */
    pageInfoClick(props, pk){
        if(!pk){//没有可以切换的数据了
            toast({  title:this.state.json['10100CRECR-000004'], content: this.state.json['10100CRECR-000005'] });/* 国际化处理： 提示,没有可以切换的数据了*/
            return;
        }
        this.loadCardData(pk,'browse');
    }

    /**
     * 更新界面的数据（一般数据更新后为浏览态）
     * @param {主键} pk_ccregion 
     * @param {数据更新后的状态} status 
     */
    loadCardData(pk_ccregion,status){
        uiStatus = status;
         //清除上个界面的所有的值
        this.props.form.EmptyAllFormValue(formId);
        this.props.cardTable.setTableData(tableId,{rows: []});
        if(!pk_ccregion){//如果主键为空则表示没有数据可以展示了，此处置空界面数据即可
            this.toggleShow(uiStatus);
            return;
        }
        ajax({
            url:queryURL,
            data:{pk_ccregion:pk_ccregion},
            success:(res)=>{
                if(res.data){
                    res.data.form.head.rows = Utils.convertGridEnablestate(res.data.form.head.rows);
                    let cardData = {rows:res.data.form.head.rows};
                    let value = {'head':cardData}
                    this.props.form.setAllFormValue(value);
                    if( res.data.grid){//有子表数据
                        this.props.cardTable.setTableData(tableId, res.data.grid.financeorgs);
                    }
                    this.toggleShow(uiStatus);
                    let newValue = this.props.form.getFormItemsValue(formId,'layertype').value;
                    if(uiStatus==='edit'){
                        this.changeBodyEdit(newValue);
                    }
                    //更新URL中的主键的值，上下翻页要以此为依据查找上下的主键
                    this.props.setUrlParam(pk_ccregion);

                    //不知道为啥设置编辑态不好使，在此重新设置一下
                    if(uiStatus === 'edit'){
                        setTimeout(()=>{
                            this.changeBodyEdit(newValue);
                            this.props.form.setFormStatus(formId, 'edit');
                        }, 200); 
                    }
                }
            }
        });
    }

    /**
     * 根据主表layertype选择是财务组织还是集团 动态设置子表的可编辑属性
     * @param {*} value 
     */
    changeBodyEdit(value){
        if(value==="0"||value === 0){//财务组织可以有子表
            this.props.button.setButtonsVisible({AddLine:true});
            this.props.cardTable.setStatus(tableId,'edit');
        }else{
            this.props.button.setButtonsVisible({AddLine:false});
            this.props.cardTable.setStatus(tableId,'browse');
        }
    }

    //表单编辑后事件
    onAferEdit(props, moduleId, key, value, index){
        if(key==='layertype'){
            this.changeBodyEdit(value.value);
            if(value.value === '1'){
                this.props.cardTable.setTableData(tableId,{rows: []});
            }
            // if(value.value==="0"){//财务组织可以有子表
            //     this.props.button.setButtonsVisible({AddLine:true});
            //     this.props.cardTable.setStatus('edit');
            // }else{
            //     this.props.button.setButtonsVisible({AddLine:false});
            //     this.props.cardTable.setStatus(tableId,'browse');
            //     this.props.editTable.setTableData(tableId,{rows: []});
            // }
        }
        if(key === 'enablestate'){
            let newValue = this.props.form.getFormItemsValue(formId,'enablestate').value;
            let pk_ccregion = this.props.form.getFormItemsValue(formId,'pk_ccregion').value;
            let ts = this.props.form.getFormItemsValue(formId,'ts').value;
            //设回原值防止直接关闭，值没有回滚
            props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
            if(newValue){
                promptBox({
                    color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100CRECR-000004'],/* 国际化处理： 提示*/
                    content:this.state.json['10100CRECR-000006'],/* 国际化处理： 确定要启用该数据吗？*/
                    cancelBtnClick:()=>{
                        props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                    },
                    beSureBtnClick:()=>{
                        ajax({
                            url:enableUrl,
                            data:{pk_ccregion:pk_ccregion,ts:ts},
                            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let ts = res.data.form.head.rows[0].values.ts;
                                //操作成功，更新页面当前行数据
                                props.form.setFormItemsValue(formId, { 'enablestate': {value:newValue} });
                                props.form.setFormItemsValue(formId,{'ts':ts});
                                toast({ color: 'success', title: this.state.json['10100CRECR-000007'] });/* 国际化处理： 启用成功！*/

                                // 更新缓存，否则启用后返回列表，状态还是已停用
                                var cachdata = {head:{head:{rows:res.data.form.head.rows}}}//更新缓存的数据
                                updateCache('pk_ccregion', pk_ccregion, cachdata, formId, cachKey);
                            },
                            error : (res)=>{
                                alert(res.message);
                            }
                        });
                    }
                });
                // props.modal.show('modal',{
                //     title:'提示',
                //     content:'确定要启用该数据吗？',
                //     size:'sm',
                //     closeModalEve:()=>{
                //         props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                //     },
                //     cancelBtnClick: ()=>{
                //         props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                //     },
                //     beSureBtnClick:()=>{
                //         ajax({
                //             url:enableUrl,
                //             data:{pk_ccregion:pk_ccregion,ts:ts},
                //             success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                //                 let ts = res.data.form.head.rows[0].values.ts;
                //                 //操作成功，更新页面当前行数据
                //                 props.form.setFormItemsValue(formId,{'ts':ts});
                //                 toast({ color: 'success', content: '启用成功' });
                //             },
                //             error : (res)=>{
                //                 alert(res.message);
                //             }
                //         });
                //     }
                // });
            }else{
                promptBox({
                    color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100CRECR-000004'],/* 国际化处理： 提示*/
                    content:this.state.json['10100CRECR-000008'],/* 国际化处理： 确定要停用该数据吗？*/
                    cancelBtnClick:()=>{
                        props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                    },
                    beSureBtnClick:()=>{
                        ajax({
                            url:disableUrl,
                            data:{pk_ccregion:pk_ccregion,ts:ts},
                            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let ts = res.data.form.head.rows[0].values.ts;
                                //操作成功，更新页面当前行数据
                                props.form.setFormItemsValue(formId, { 'enablestate': {value:newValue} });
                                props.form.setFormItemsValue(formId,{'ts':ts});
                                toast({ color: 'success', title: this.state.json['10100CRECR-000009'] });/* 国际化处理： 停用成功！*/

                                // 更新缓存，否则停用后返回列表，状态还是已启用
                                var cachdata = {head:{head:{rows:res.data.form.head.rows}}}//更新缓存的数据
                                updateCache('pk_ccregion', pk_ccregion, cachdata, formId, cachKey);
                            },
                            error : (res)=>{
                                alert(res.message);
                            }
                        });
                    }
                });
                // props.modal.show('modal',{
                //     title:'提示',
                //     content:'确定要停用该数据吗？',
                //     size:'sm',
                //     closeModalEve:()=>{
                //         props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                //     },
                //     cancelBtnClick: ()=>{
                //         props.form.setFormItemsValue(formId, { 'enablestate': {value:!newValue} });
                //     },
                //     beSureBtnClick:()=>{
                //         ajax({
                //             url:disableUrl,
                //             data:{pk_ccregion:pk_ccregion,ts:ts},
                //             success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                //                 let ts = res.data.form.head.rows[0].values.ts;
                //                 //操作成功，更新页面当前行数据
                //                 props.form.setFormItemsValue(formId,{'ts':ts});
                //                 toast({ color: 'success', content: '停用成功' });
                //             },
                //             error : (res)=>{
                //                 alert(res.message);
                //             }
                //         });
                //         // this.enableAreaClass();
                //     }
                // });
            }
        }
    }

   //子表新增事件
   onAddSubClick(props, id){
    // props.editTable.addRow(tableId)
    props.cardTable.addRow(tableId)
   }

   /**
    * 标体参照处理事件，更改参照显示编码，设置名称的显示值
    * @param {*} props 
    * @param {*} moduleId 
    * @param {*} key 
    * @param {支持复选} value
    * @param {*} changedrows 
    * @param {*} i 
    */
   afterSubEvent(props, moduleId, key,value, changedrows, index, record){
       debugger
//         if(key === 'pk_financeorg'&&changedrows[0].newvalue.value != changedrows[0].oldvalue.value){
//             let setObj = {}
//             setObj.value = record.values.pk_financeorg.value;
//             setObj.display = value.refname;
//             props.cardTable.setValByKeyAndIndex(tableId,index,'pk_financeorg.name',setObj);
//             record.values.pk_financeorg.display = value.refcode;
//         }
        if(key === 'pk_financeorg'){
            if(value.length === 0){
                 props.cardTable.setValByKeyAndIndex(tableId,index,'pk_financeorg',{display:null,value:null});
                 props.cardTable.setValByKeyAndIndex(tableId,index,'pk_financeorg.name',{display:null,value:null});
                 return;
            }
            var rowNum = props.cardTable.getNumberOfRows(tableId);
            // props.cardTable.delRowsByIndex(tableId, index);
            // props.cardTable.setValByKeyAndIndex(tableId,index,'pk_financeorg',{display:null,value:null});
            // props.cardTable.setValByKeyAndIndex(tableId,index,'pk_financeorg.name',{display:null,value:null});
            value.forEach(element => {	
                props.cardTable.addRow(tableId,rowNum,
                    {'pk_financeorg':{display:element.refcode,value:element.refpk},
                    'pk_financeorg.name':{display:element.refname?element.refname:element.display,value:element.refname}},
                    false);
            });
            setTimeout(()=>{
                props.cardTable.delRowsByIndex(tableId, index);
            },50)
        }
   }


    //返回列表界面
    onReturnClick(){
        this.props.pushTo(toListURl,{ status:'browse',pagecode:'10100CRECR_list'});
    }

    buttonClick =(props, id)=>{
        switch (id) {
            case 'AddLine':
                this.onAddSubClick(props, id);
            break;
        default:
            break
        }
    }

     //批量新增--------------------
    /**
	 * 组织批量新增委托关系模态框中的分步内容
	 */
	getSteps(){
		let { button } = this.props;
		let { createButtonApp } = button;
		const steps = [{
			title: this.state.json['10100CRECR-000020'],/* 国际化处理： 选择财务组织*/
			content: this.getFirstContent,
		  }, {
			title: this.state.json['10100CRECR-000021'],/* 国际化处理： 选择创建信用控制域*/
			content: this.getSecondContent,
		  }, {
			title: this.state.json['10100CRECR-000022'],/* 国际化处理： 编辑选择信用控制域*/
			content: this.getLastContent,
		  }];
		return (
			<div>
				<NCSteps  current={this.state.currentStep} style={{marginBottom:'10px'}}>
					{steps.map(item => <NCStep key={item.title} title={item.title} />)}
				</NCSteps>
				{steps[this.state.currentStep].content()}
				{this.state.currentStep === 0 && <div className="steps-radio" style={{display: 'flex',width: '100%',justifyContent: 'center'}}>
					<NCRadio.NCRadioGroup
						name="oprType"
						selectedValue={this.state.oprType}
						onChange={this.handleOprTypeChange.bind(this)}>
						<NCRadio value="0" >{this.state.json['10100CRECR-000028']}</NCRadio>{/* 国际化处理： 包含所有下级*/}
						<NCRadio value="1" >{this.state.json['10100CRECR-000029']}</NCRadio>{/* 国际化处理： 仅自己*/}
						<NCRadio value="2" >{this.state.json['10100CRECR-000030']}</NCRadio>{/* 国际化处理： 仅直接下级*/}
						<NCRadio value="3" >{this.state.json['10100CRECR-000031']}</NCRadio>{/* 国际化处理： 仅末级*/}
					</NCRadio.NCRadioGroup>
				</div>}
				{/* <div className="steps-action">
					{createButtonApp({
							area: 'modal_area',
							buttonLimit: 4,
							onButtonClick: this.onStepButtonClick.bind(this),
							popContainer: document.querySelector('.steps-action')

						})}
				</div> */}
			</div>
		);
    }

    updatestepModalButtonStatus=(current)=>{
		if(current === 0){
			this.props.button.setDisabled({
				Prev: true,
				Next:false,
				Finish:true,
                CancelStep:false,
                FinishRE:true
            });
            this.props.button.setButtonsVisible({
                Prev: true,
				Next:true,
				Finish:true,
                CancelStep:true,
                FinishRE:false
            });
		}else if(current === 1){
			this.props.button.setDisabled({
				Prev: false,
				Next:false,
				Finish:false,
                CancelStep:false,
                FinishRE:true
            });
            this.props.button.setButtonsVisible({
                Prev: true,
				Next:true,
				Finish:true,
                CancelStep:true,
                FinishRE:false
            });
		}else{
			this.props.button.setDisabled({
				Prev: false,
				Next:true,
				Finish:false,
                CancelStep:false,
                FinishRE:false
            });
            this.props.button.setButtonsVisible({
                Prev: true,
				Next:false,
				Finish:true,
                CancelStep:true,
                FinishRE:true
            });
		}

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

	/**
	 * 获取分步中的第一步的页面内容
	 */
	getFirstContent=()=>{
		return (
			<div id="org_transfer" className="first-steps-content" style={{height: 300}}>
                <Transfer
                     ref={(item)=>{this.orgTransfer = item}} showSearch={true}
                    // TransferId={'org_transferid'} 
                    // leftTreeData={this.state.firstStepOrgValue.leftTreeData} 
                    // rightTreeData={this.state.firstStepOrgValue.rightTreeData}
                    // value={this.state.firstStepOrgValue} 
                    // oprType={this.state.oprType}
                />
			</div>
		);
	}

	/**
	 * 获取分步中的第二步的页面内容
	 */
	getSecondContent=()=>{
		return (
			<div id="steps-second-content" className="steps-content">
			<div></div>
                {this.props.editTable.createEditTable(stepTableId, {//列表区
                    useFixedHeader:true,
                    showIndex:true,				//显示序号
                    showCheck:true,			//显示复选框
                    adaptionHeight:true
                })}
			</div>
		);
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
    /**
	 * 获取分步中的第三步的页面内容
	 */
	getLastContent=()=>{
		return (
			<div id="steps-last-content" className="steps-content">
                {this.props.editTable.createEditTable(editTableId, {//列表区
                    useFixedHeader:true,
                    showIndex:true,				//显示序号
                    // showCheck:true,			//显示复选框
                    adaptionHeight:true
                })}
			</div>
		);
	}
    //批量新增的按钮点击事件
	onStepButtonClick(props,id) {
        let that = this;
        switch (id) {
             case "Prev":
				let current = this.state.currentStep-1;
				if(current<0) current=0;
				this.setState({
					currentStep:current
				},()=>{
                    if(current===0){
                        that.orgTransfer.reset(this.state.allTreeData);
                        that.state.rightTreeData.forEach(node => {
                            that.orgTransfer.state.treeWapper.moveRight(node.key);
                        });
                    };
                    if(current===1){
                        that.props.editTable.setTableData(stepTableId, that.state.stepListData);
                    };
                    this.updatestepModalButtonStatus(current);
                    // that.orgTransfer.setRootTitle('财务组织');
                 });

				break;
            case "Next":
                current = this.state.currentStep+1;
                if(current>2) current=2;
                let beforStep = this.state.currentStep;
                if(beforStep=== 0){
                    var orgs = this.orgTransfer.getData();

                    if(!(orgs&&orgs.length>0)){
                        // alert('您没有选择任何数据！');
                        toast({color:'warning',content:this.state.json['10100CRECR-000023']});/* 国际化处理： 请选择财务组织!*/
                        break;
                    }
                    this.setState({//前面放一个是为了stat中加载列表界面，否则设置值的时候报错
                        currentStep:current
                    });
                    this.state.rightTreeData = orgs;
                    ajax({
                        url: ajaxUrl.createCreditUrl,
                        data : {orgs:orgs,from:'card'},
                        success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                            let { success,data} = res;
                            if (success) {
                                that.props.editTable.setTableData(stepTableId, res.data[stepTableId]);
                                that.setState({//为了最后一步的时候点上一步能出现数据
                                    stepListData:res.data[stepTableId]
                                });
                            }
                        }
                    });
                }else if(beforStep === 1){
                    let tableData =  this.props.editTable.getCheckedRows(stepTableId);
                    if(!tableData||tableData.length===0){
                        toast({content:this.state.json['10100CRECR-000024'],color:'warning'});/* 国际化处理： 请选择数据*/
                        break;
                    }
                    this.setState({//前面放一个是为了stat中加载列表界面，否则设置值的时候报错
                        currentStep:current
                    });
                    let datarows = [];
                    tableData.forEach((val) => {
                        datarows.push(val.data);
                    });
                    setTimeout(() => {
                        that.props.editTable.setTableData(editTableId, {rows:datarows});
                        that.props.editTable.setStatus(editTableId, 'edit');
                    }, 10)
                }
                this.updatestepModalButtonStatus(current);
				break;
            case "Finish":
                 if(this.state.currentStep === 1){
                    let tableData =  this.props.editTable.getCheckedRows(stepTableId);
                    if(!tableData||tableData.length===0){
                        toast({content:this.state.json['10100CRECR-000024'],color:'warning'});/* 国际化处理： 请选择数据*/
                        break;
                    }
                    let datarows = [];
                    tableData.forEach((val) => {
                        datarows.push(val.data);
                    });

                    let data = {
                        pageid:pageCode,
                        model: {
                            areacode:stepTableId,
                            areaType: 'table',
                            pageinfo: null,
                            rows: datarows
                        }
                    };
                    ajax({
                        url: ajaxUrl.batchSaveUrl,
                        data,
                        success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                            let { success,data} = res;
                            if (success) {
							    toast({title:this.state.json['10100CRECR-000025'],color:'success'});/* 国际化处理： 新增成功！*/
                                that.props.modal.close(stepModal);
                                // this.refreshAction(props);
                            }
                        }
                    });
                 }else  if(this.state.currentStep === 2){
                    let tableData =  this.props.editTable.getCheckedRows(editTableId);
                    console.log(tableData);
                    if(!tableData||tableData.length===0){
                        toast({content:this.state.json['10100CRECR-000024'],color:'warning'});/* 国际化处理： 请选择数据*/
                        break;
                    }
                    let datarows = [];
                    tableData.forEach((val) => {
                        datarows.push(val.data);
                    });

                    let data = {
                        pageid:pageCode,
                        model: {
                            areacode:stepTableId,
                            areaType: 'table',
                            pageinfo: null,
                            rows: datarows
                        }
                    };
                    ajax({
                        url: ajaxUrl.batchSaveUrl,
                        data,
                        success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                            let { success,data} = res;
                            if (success) {
							    toast({title:this.state.json['10100CRECR-000025'],color:'success'});/* 国际化处理： 新增成功！*/
                                that.props.modal.close(stepModal);
                                // this.refreshAction(props);
                            }
                        }
                    });
                 }
                 break;
            case 'FinishRE':
                let tableData =  this.props.editTable.getCheckedRows(editTableId);
                console.log(tableData);
                if(!tableData||tableData.length===0){
                    toast({content:this.state.json['10100CRECR-000024'],color:'warning'});/* 国际化处理： 请选择数据*/
                    break;
                }
                let datarows = [];
                tableData.forEach((val) => {
                    datarows.push(val.data);
                });

                let data = {
                    pageid:pageCode,
                    model: {
                        areacode:stepTableId,
                        areaType: 'table',
                        pageinfo: null,
                        rows: datarows
                    }
                };
                ajax({
                    url: ajaxUrl.batchSaveUrl,
                    data,
                    success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                        let { success,data} = res;
                        if (success) {
                            toast({title:this.state.json['10100CRECR-000025'],color:'success'});/* 国际化处理： 新增成功！*/
                            // that.props.modal.close(stepModal);
                            that.onBatchAdd();
                            // this.refreshAction(props);
                            // that.props.modal.show(stepModal);
                        }
                    }
                });
                 break;
			case "CancelStep":
				this.props.modal.close('stepModal');
                break;
        }
    }

    render() {
        const {cardTable,button, form ,modal,editTable,cardPagination,BillHeadInfo} = this.props;
        const {createForm} = form;
        const {createButtonApp} = button;
        let { createCardPagination } = cardPagination;
        const {createModal} = modal;
        let { createEditTable } = editTable;
        let { createCardTable } = cardTable;
        let status = uiStatus;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
        <div className="nc-bill-card">
            <div className="nc-bill-top-area">
                <NCAffix>
                    <NCDiv  areaCode={NCDiv.config.HEADER}  className='nc-bill-header-area' >
                            <div className='header-title-search-area' >
                                {/* {this.state.cardState === 'browse'&&
                                    <NCBackBtn className='title-search-detail'
                                    onClick={ this.onReturnClick.bind(this) }></NCBackBtn>}
                                <h2 className="title-search-detail">{this.state.json['10100CRECR-000010']}</h2> */}
                                 <span>
                                    {
                                        createBillHeadInfo(
                                            {
                                                title :this.state.json['10100CRECR-000010'],             //标题/* 国际化处理： 信用控制域*/
                                                backBtnClick:this.onReturnClick.bind(this)             //返回按钮的点击事件
                                            }
                                    )}
                                </span>
                            </div>
                         <div className="header-button-area">
                            {createButtonApp({
                                area: 'card_head',//按钮注册中的按钮区域
                                buttonLimit: 5, 
                                onButtonClick: this.onClickHeaderBtn.bind(this) 
                                //popContainer: document.querySelector('.header-button-area')
                            })}
                            {createCardPagination({
                                handlePageInfoChange: this.pageInfoClick.bind(this),
                                dataSource: cachKey
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>  
                <div className="nc-bill-form-area">
                    {createForm(formId, {
                        onAfterEvent: this.onAferEdit.bind(this),
                        cancelPSwitch: true
                    })}
                </div>
            </div>
            <div className="nc-bill-bottom-area"> 
                <div className="nc-bill-table-area" style={{marginTop : 8}} >
                    {createCardTable(tableId, {
                        tableHead:()=>{
                            return (
                                <div className="shoulder-definition-area">
                                    <div className="definition-icons">
                                        {createButtonApp({
                                            area: 'card_body',//按钮注册中的按钮区域
                                            onButtonClick: this.buttonClick.bind(this) 
                                        })}
                                    </div>
                                </div>
                            )
                        },
                        // modelSave: this.modelSave.bind(this),
                        showIndex:true,
                        // isAddRow: true,   // 失去焦点是否自动增行
                        onAfterEvent: this.afterSubEvent.bind(this)
                    })}
                </div>
                {createModal('modal', {
                   
                })}
                 {/* 批量新增 */}
				{this.state.json['10100CRECR-000026']&&createModal(stepModal,{
					title : this.state.json['10100CRECR-000026'],										//标题/* 国际化处理： 批量新增信用控制域*/
					content : this.getSteps.bind(this)(),							//内容
                    noFooter : false,
                    className:'batch-add',
                    showCustomBtns:true,
                    customBtns:<div >
					    {createButtonApp({
							area: 'modal_area',
							onButtonClick: this.onStepButtonClick.bind(this),
							popContainer: document.querySelector('.steps-action')

						})}
				    </div>
                })}
                <PrintOutput
					ref='printOutput'
					url={printUrl}
					data={{
						funcode:'10100CRECR',      //功能节点编码，即模板编码
                        nodekey:'creditctlregionEditorPrint',     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
                >
                </PrintOutput>
            </div>
        </div>
        )
    }
    initTemplate = (props)=> {
        createUIDom(props)(
            {
                pagecode : pageCode
                // appid : appId
                // appcode:'10100CRECR'
            },
            {
                moduleId: "10100CRECR",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    let meta = data.template;
                    meta = this.modifierMeta(props, meta);
                    props.meta.setMeta(meta);
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delete', this.state.json['10100CRECR-000011']) /* 设置操作列上删除按钮的弹窗提示 *//* 国际化处理： '确认要删除吗？'*/
                    }
                }
        });
    
    }
    tableButtonClick=(props, id, text, record, index)=>{
        switch (id) {
            case 'DelLine':
                props.cardTable.delRowsByIndex(tableId, index);
            break;
            default:
            break;
        }
    }
    modifierMeta=(props, meta) =>{
    
        meta[tableId].items.map((obj)=>{
            if(obj.attrcode == 'pk_financeorg'){
                obj.queryCondition = function () {
                    return {
                        "pk_org": businessInfo.groupId 
                    }
                };
                obj.isMultiSelectedEnabled = true;
            }
        });
    
        meta[tableId].showindex = true;
        // meta[formId].status = status;
        // meta[tableId].status = status;
    
        //子表添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100CRECR-000012'],/* 国际化处理： 操作*/
            width: 200,
            itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
            className: 'table-opr',
            visible: true,
            fixed:'right',
            render: (text, record, index) => {
                return (
                    props.button.createOprationButton(
                        tableBtnAry,
                        {
                            area: "card_body_inner",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                        }
                    )
                )
            }
        });
    
        return meta;
    }
}



CRECREditForm =  createPage({
    initTemplate:function(){},
    billinfo:[{
        billtype: 'card', 
        pagecode: pageCode, 
        headcode: 'head',
        bodycode: 'financeorgs'
    },{
        billtype: 'grid', 
        pagecode: pageCode,
        bodycode: 'stepListTable',
    },{
        billtype: 'grid', 
        pagecode: pageCode,
        bodycode: 'editListTable'
    }]
    
    // initTemplate: initTemplate
})(CRECREditForm);
// ReactDOM.render(<CRECREditForm />,
//     document.querySelector("#app"));
export default CRECREditForm;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65