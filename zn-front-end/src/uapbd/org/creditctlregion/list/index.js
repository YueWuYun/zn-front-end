//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax,base,high,toast ,print,cardCache,promptBox,getMultiLang,getBusinessInfo,createPageIcon} from 'nc-lightapp-front';
const {PrintOutput}=high;
const { NCHotKeys } = base;
let {setDefData, getDefData } = cardCache;
let loginContext=getBusinessInfo();//当前登录用户信息
import  Utils from '../../../public/utils';
import './index.less';
let {NCCol:Col,NCRow:Row,NCIcon,NCStep,NCRadio ,NCDiv}=base;
const NCSteps = NCStep.NCSteps;
import Transfer from '../../../public/excomponents/Transfer';
import { Table } from '../../../public/excomponents';
import createUIDom from '../../../public/utils/BDCreateUIDom';

let searchId = 'searchArea';//查询组件ID
let tableId = 'listTable';//列表组件ID
let stepTableId = 'stepListTable';//批增第二部列表组件id
let editTableId = 'editListTable';//批增第三步列表组件id
// let nodeTitle = this.state.json['10100CRECR-000010'];//节点标题/* 国际化处理： 信用控制域*/
let queryparam = {};//查询条件
let stepModal = 'stepModal';//批量新增模态框id
let cachKey = '10100CRECR_list';//缓存的标识
let isShowDisable = false;//是否显示停用

/**
 * AjaxUrl配置
 */
let ajaxUrl={
    dataLoadUrl:'/nccloud/uapbd/org/CreditCtlRegionQuery.do',
    disabledUrl:'/nccloud/uapbd/org/CreditCtlRegionDisableAction.do',
    deleteUrl:'/nccloud/uapbd/org/CreditCtlRegionDeleteAction.do',
    enableUrl:'/nccloud/uapbd/org/CreditCtlRegionEnableAction.do',
    disableUrl:'/nccloud/uapbd/org/CreditCtlRegionDisableAction.do',
    orgTreeLoadUrl:'/nccloud/uapbd/org/CreditCtlRegionQuerySourceOrgAction.do',
    createCreditUrl:'/nccloud/uapbd/org/CreditRegionCreateFromOrgAction.do',
    batchSaveUrl:'/nccloud/uapbd/org/CreditRegionBatchSaveAction.do',
    printUrl:'/nccloud/uapbd/org/CreditCtlRegionPrintAction.do',
    permissionUrl:'/nccloud/uapbd/org/CreditCtlRegionPermAction.do'
}
/**
 * 节点配置
 */
const appId = '0001Z01000000000156S';
const appCode = '10100CRECR';
const pageCode = '10100CRECR_list';
// const oId = '1010Z010000000002RJT';     //查询区查询模板id
const linkItem = 'code';                //列表超链接到卡片的字段
const pk_item = 'pk_ccregion';          //列表主键

const tableBtnAry = ["Edit","Copy","Delete"];		//树表列操作按钮

let cardUrl = '/card';
// let cardUrl = '/uapbd/org/creditctlregion/edit/index.html';

/**
 * 信用控制域
 * wangdca
 */
class CreditctlregionList extends Component {

    constructor(props){
        super(props);
        this.searchId = searchId;
        this.tableId = tableId;
        this.state={
			isShowOff:false,				//列表是否显示停用数据
			currentStep:0,
			oprType:'0',
			firstStepOrgValue:{},
            secondStepOrgValue:{},
            pks:[],
            allTreeData: [],
            rightTreeData: [],
            stepListData:[],
            json:{}
        }
        this.initTemplate(props);
    }

    componentDidMount() {
        // debugger
        // let searchVal =getDefData("searchParams",cachKey);
        // if(searchVal && searchVal != false){
        //     this.props.search.setSearchValue(searchId,searchVal.conditions);
        //     this.refreshAction(this.props);
        // }
        // setTimeout(()=>{
        //     this.updateButtonStatus();
        // }, 300); 
    }
    /**
     * 更新按钮的状态
     */
    updateButtonStatus(){
        // let { hasCacheData } = this.props.table;
        // if(!hasCacheData(cachKey)){
        //     this.props.button.setButtonDisabled(['BDelete','Enable','Disable','Print','Output'],true);
        //     return;
        // }
        this.props.button.setMainButton('Add',true);
        var allData = this.props.table.getAllTableData(tableId);
        if(!allData||allData.rows.length === 0){
            this.props.button.setButtonDisabled(['BDelete','Print','Output'],true);
            return;
        }else{
            this.props.button.setButtonDisabled(['Print','Output'],false);
        }
        var checked = this.props.table.getCheckedRows(tableId);
        if(!checked||checked.length ===0){
            this.props.button.setButtonDisabled(['BDelete'],true);
        }else{
            this.props.button.setButtonDisabled(['BDelete'],false);
        }
        ///选择单条数据时，可操作的按钮高亮显示，不可操作的按钮置灰显示；
        if(checked.length > 0){
            var enablestate = checked[0].data.values.enablestate.value;
            if(enablestate == 2){
                this.props.button.setButtonDisabled(['Enable'],true);
                this.props.button.setButtonDisabled(['Disable'],false);
            }else{
                this.props.button.setButtonDisabled(['Enable'],false);
                this.props.button.setButtonDisabled(['Disable'],true);
            }
        }
        else {
            this.props.button.setButtonDisabled(['Enable','Disable'], true)
        }
        // //选择单条数据时，可操作的按钮高亮显示，不可操作的按钮置灰显示；
        // //选择多条数据时，若数据都是同一状态的，则相应状态下可操作的按钮高亮显示，不可操作的按钮置灰显示；（如，启用/停用按钮，若多条数据都是已启用数据，则启用置灰，停用高亮）
        // //选择多条数据时，是多状态混合的，则按钮都可用，点击后依据点击的按钮做同一处理；（如，启用/停用按钮，若已选数据既有已停用，也有已启用，则启用/停用按钮都高亮显示）
        // //如果一些按钮需要靠后台才能验证是否可用，则始终高亮可点击，点击后通过后台反馈，给出前端提示；
        // var allEnable = true;//是否全启用状态
        // var allDisable  = true;//是否全停用状态
        // var notAll = true;//是否混合状态
        // checked.rows.forEach((item,index) => {
        //     var enablestate = item.values.enablestate.value;
        //     if(enablestate === 2||enablestate === '2'){
        //         allDisable = false;
        //     }
        //     if(enablestate === 3||enablestate === '3'){
        //         allEnable = false;
        //     }
        // });

    }
    // componentWillMount(){
    //     // this.onDataLode();
    //     let pageInfo = {
    //         pageIndex:0,
    //         pageSize:10
    //     }
    // }
    //按钮点击事件
    onClickButton(props,id){
        switch (id) {
            case 'Add':
                // props.linkTo(cardUrl,{
                //     status:'add',
                //     data:'',
                //     enablestate:''
                // });
                props.pushTo(cardUrl,{
                    status:'add',
                    pagecode:'10100CRECR_card',
                    id:'',
                    enablestate:''
                });
            break;
            case 'Refresh':
                this.refreshAction(props,true);
            break;
            case 'BatchAdd':
                this.onBatchAdd();
            break;
            case 'BDelete':
                debugger
                var selValue = props.table.getCheckedRows(tableId);
                if(!selValue||selValue.length ===0){
                    toast({ color: 'warning', content: this.state.json['10100CRECR-000013'] });/* 国际化处理： 没有选择数据！*/
                    return;
                }
                var pk_ccregions = [];
                var indexs=[];
                selValue.forEach((item)=>{
                    pk_ccregions.push(item.data.values.pk_ccregion.value);
                });
                selValue.forEach((item)=>{
                    indexs.push(item.index);
                });
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100CRECR-000035'],
                    content:this.state.json['10100CRECR-000001'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
                    beSureBtnClick:()=>{
                        ajax({
                                url:ajaxUrl.deleteUrl,
                                data:{pk_ccregions:pk_ccregions},
                                success: (e) => {
                                    toast({ color: 'success', title: this.state.json['10100CRECR-000014'] });/* 国际化处理： 删除成功！*/
                                    //更新表中的数据
                                    indexs.forEach((item)=>{
                                        props.table.deleteTableRowsByIndex(tableId, item);
                                    });
                                    //同时删除缓存中的数据
                                    let {deleteCacheId} = props.table;
                                    pk_ccregions.forEach((item)=>{
                                        deleteCacheId(tableId,item);
                                    });
                                    toggleShow(props);
                                }
                        });
                    }
                })
            break;
            case 'Enable':
                var selValue = props.table.getCheckedRows(tableId);
                if(!selValue||selValue.length ===0){
                    toast({ color: 'warning', content: this.state.json['10100CRECR-000013'] });/* 国际化处理： 没有选择数据！*/
                    return;
                }
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100CRECR-000033'],/* 国际化处理： 提示*/
                    content:this.state.json['10100CRECR-000006'],/* 国际化处理： 确定要启用该数据吗？*/
                    beSureBtnClick:()=>{
                        var pk_ccregions = [];
                        selValue.forEach((item)=>{
                            pk_ccregions.push(item.data.values.pk_ccregion.value);
                        });
                        ajax({
                            url : ajaxUrl.enableUrl,
                            data:{pk_ccregions:pk_ccregions},
                            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                this.refreshAction(props);
                                toast({ color: 'success', title: this.state.json['10100CRECR-000007'] });/* 国际化处理： 启用成功！*/
                            }
                        });
                    }
                })
            break;
            case 'Disable':
                var selValue = props.table.getCheckedRows(tableId);
                if(!selValue||selValue.length ===0){
                    toast({ color: 'warning', content: this.state.json['10100CRECR-000013'] });/* 国际化处理： 没有选择数据！*/
                    return;
                }
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100CRECR-000034'],/* 国际化处理： 提示*/
                    content:this.state.json['10100CRECR-000008'],/* 国际化处理： 确定要停用该数据吗？*/
                    beSureBtnClick:()=>{
                        var pk_ccregions = [];
                        selValue.forEach((item)=>{
                            pk_ccregions.push(item.data.values.pk_ccregion.value);
                        });
                        ajax({
                            url : ajaxUrl.disableUrl,
                            data:{pk_ccregions:pk_ccregions},
                            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                this.refreshAction(props);
                                toast({ color: 'success', title: this.state.json['10100CRECR-000009'] });/* 国际化处理： 停用成功！*/
                            }
                        });
                    }
                })
            break;
            case 'Print':
                let allD = this.props.table.getAllTableData(tableId);
                let pks = [];
                allD.rows.forEach((item,index) => {
                    pks.push(item.values['pk_ccregion'].value);
                });
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    ajaxUrl.printUrl,
                    {
                        // billtype:'',  //单据类型
                        funcode:appCode,      //功能节点编码，即模板编码
                        nodekey:'creditctlregionListPrint',     //模板节点标识
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                );
            break;
            case 'Output':
                let allD1 = this.props.table.getAllTableData(tableId);
                let pks1 = [];
                allD1.rows.forEach((item,index) => {
                    pks1.push(item.values['pk_ccregion'].value);
                });
                this.setState({
                    pks: pks1
                 },this.refs.printOutput.open());
                // print(
                //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                //     ajaxUrl.printUrl, 
                //     {
                //         // billtype:'',  //单据类型
                //         funcode:appCode,      //功能节点编码，即模板编码
                //         nodekey:'creditctlregionListPrint',     //模板节点标识
                //         outputType:'output',
                //         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                //     }
                // );
            break;
            default:
            break;
        }
    }

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
                // this.setState({
                //     firstStepOrgValue : {
                //         leftTreeData : data&&data.orgVOs?data.orgVOs:[],
                //         rightTreeData : []
                //     }
                //     // secondStepOrgValue : {
                //     //     leftTreeData : data&&data.financeOrgVOs?data.financeOrgVOs:[],
                //     //     rightTreeData : []
                //     // }
                // });
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

    //分页信息点击事件
    onClickPageInfo(props){
        let pageInfo = props.table.getTablePageInfo(tableId);
        let searchVal = props.search.getAllSearchData(searchId);
        let queryparam = {};
        if(searchVal!=null){
            searchVal.map((obj)=>{
                queryparam[obj.field] = obj.value.firstvalue;

            });
        }
        let paramdata = {
            pageInfo:pageInfo,
            queryCondition: queryparam
        };
        ajax({
            method: 'post',
            data: paramdata,
            url: ajaxUrl.dataLoadUrl,
            success: function (res) {
                if(res.hasOwnProperty('data')){
                    // Utils.convertGridEnablestate(res.data[tableId].rows); 
                    props.table.setAllTableData(tableId, res.data[tableId]);
                }
            }
        });
    }
    //显示停用数据
	showOffChange(){
        isShowDisable = !isShowDisable;
        this.setState(
            {isShowOff : !this.state.isShowOff},
            () => {
                this.refreshAction(this.props);
            }
        );
	}

    //查询区按钮点击事件
    onClickSearchBtn(props,searchVal){
        setDefData("searchParams",cachKey,searchVal);
        let queryInfo = this.props.search.getQueryInfo(searchId);
        var searchVals = this.props.search.getAllSearchData(searchId) || {};
        let data = {
            // querycondition: {conditions:searchVal==null?null:searchVal.conditions},//tree查询
            querycondition: searchVals,
            // conditions:searchVal==null?null:searchVal.conditions,//simple的查询方式
            pageInfo: props.table.getTablePageInfo(tableId)?props.table.getTablePageInfo(tableId):
			{
                pageIndex: 0,
                pageSize: 10,
                total: 0,
                totalPage: 0
            },
            // pageInfo: {
            //     pageIndex: 0,
            //     pageSize: 10,
            //     total: 0,
            //     totalPage: 0
            // },
            pagecode: pageCode,
            queryAreaCode:searchId,  //查询区编码
            oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree',
            appcode:appCode,
            isShowOff:this.state.isShowOff
        };
        let that = this;
        ajax({
            url: ajaxUrl.dataLoadUrl,
            data,
            success: (res) => {
                if(res.data){
                    // Utils.convertGridEnablestate(res.data[tableId].rows); 
                    that.props.table.setAllTableData(tableId, res.data[tableId]);
                    var msg = this.state.json['10100CRECR-000016'] + res.data[tableId].rows.length + this.state.json['10100CRECR-000017']/* 国际化处理： 查询成功,共 , 条。*/
                    toast({content:msg,color:"success"});
                }else{
                    props.table.setAllTableData(this.tableId, {rows:[]});
                    toast({content:this.state.json['10100CRECR-000018'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
                }
                this.updateButtonStatus();
                // cacheTools.set("hasSearched",1);
                // cacheTools.set("searchParams",searchVal);
                // cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
            }
        });
    }
    //数据加载
    onDataLode(){
        let pageInfo = this.props.table.getTablePageInfo(tableId);
        let paramdata = {
            pageInfo:pageInfo,
            queryCondition: queryparam,
            isShowOff:this.state.isShowOff
        };
        let that = this;
        ajax({
            method: 'post',
            data: paramdata,
            url: ajaxUrl.dataLoadUrl,
            success: function (res) {
                if(res.hasOwnProperty('data')){
                    // Utils.convertGridEnablestate(res.data[tableId].rows); 
                    that.props.table.setAllTableData(tableId, res.data[tableId]);
                }
            }
        });
    }
    refreshAction =(props,isRefreshAction = false)=>{
        let searchVal = props.search.getAllSearchData(searchId);
        let queryInfo = this.props.search.getQueryInfo(searchId);
        let that = this;
        if(searchVal != false){
            let data = {
                // conditions: searchVal==null?null:searchVal.conditions,
                querycondition: searchVal,
                pageInfo:props.table.getTablePageInfo(tableId)?props.table.getTablePageInfo(tableId):
                {
                    pageIndex: 0,
                    pageSize: 10,
                    total: 0,
                    totalPage: 0
                },
                pagecode: pageCode,
                queryAreaCode:searchId,  //查询区编码
                oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype:'tree',
                appcode:appCode,
                isShowOff:this.state.isShowOff
            };
            ajax({
                url: ajaxUrl.dataLoadUrl,
                data,
                success: (res) => {
                    if(res.data){
                        // Utils.convertGridEnablestate(res.data[tableId].rows); 
                        that.props.table.setAllTableData(tableId, res.data[tableId]);
                        if(isRefreshAction){
                            toast({title:this.state.json['10100CRECR-000019'],color:"success"});/* 国际化处理： 刷新成功！*/
                        }
                    }else{
                        props.table.setAllTableData(this.tableId, {rows:[]});
                        toast({content:this.state.json['10100CRECR-000018'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
                    }
                    //更新按钮状态
                    this.updateButtonStatus();
                }
            });
        }
    }
    pageInfoClick = (props, config, pks)=>{
        // props.table.setAllTableData(this.tableId, {rows:[]});
        let data = {
            "allpks": pks,
            "pageid": pageCode
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: ajaxUrl.dataLoadUrl,
            data: data,
            success: function(res) {
                if(res.data){
                    // Utils.convertGridEnablestate(res.data[tableId].rows); //不显示启用停用了
                    props.table.setAllTableData(tableId, res.data[tableId]);
                }else{
                    props.table.setAllTableData(tableId, {rows:[]});
                    toast({content:that.state.json['10100CRECR-000018'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
                }
            }
        });

        // let pageInfo = props.table.getTablePageInfo(this.tableId);
        // let searchVal = props.search.getAllSearchData(searchId);

		// cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));

        // let data = {
        //     "allpks": pks,
        //     "pageid": pageId
        // };
        // //得到数据渲染到页面
        // let that = this;
        // ajax({
        //     url: queryPageUrl,
        //     data: data,
        //     success: function(res) {
        //         let { success, data } = res;
        //         if (success) {
        //             if (data) {
        //                 props.table.setAllTableData(tableId, data[tableId]);
        //             } else {
        //                 props.table.setAllTableData(tableId, { rows: [] });
        //             }
        //         }
        //     }
        // });
    }
    doubleClick = (record, index, e)=>{
        // let pk = record.values.pk_ccregion.value;//edittable的写法
        let pk = record.pk_ccregion.value;//singletable
        // let searchVal = this.props.search.getAllSearchData(searchId);
		// cacheTools.set("searchParams", searchVal);
		// cacheTools.get("searchParams");
        // cacheTools.set('preid',pk);
        this.props.pushTo(cardUrl, {
            pagecode:'10100CRECR_card',
            status: 'browse',
            id: pk,
        });

	}
    //表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
        if(key === 'enablestate'){
            let ableUrl = '';
            let newEnalbe = value[0].newvalue.value;
            if(newEnalbe){
                ableUrl = ajaxUrl.enableUrl;
            }else{
                ableUrl = ajaxUrl.disabledUrl;
            }
            ajax({
				url:ableUrl,
				data:{pk_ccregion:data.values.pk_ccregion.value},
				success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success, data } = res;
					if (success) {
                        let ts = data.form.head.rows[0].values.ts.value;
						//操作成功，更新页面当前行数据
                        props.editTable.setValByKeyAndIndex(tableId,index,'ts',{value:ts});
                        if(newEnalbe){
                            toast({ color: 'success', title: this.state.json['10100CRECR-000007'] });/* 国际化处理： 启用成功！*/
                        }else{
                            toast({ color: 'success', title: this.state.json['10100CRECR-000009'] });/* 国际化处理： 停用成功！*/
                        }
					}else{
                        props.editTable.cancelEdit(tableId);
                        alert(res.message);
                    }
				}
			});
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
			<div className="use-my-modal-use">
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
			<div id="steps-second-content" className="steps-content steps-content-style">
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
                    }
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
                        data : {orgs:orgs,from:'list'},
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
                                this.refreshAction(props);
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
                                this.refreshAction(props);
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
                            this.refreshAction(props);
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
        const { table, button ,search,modal,editTable,BillHeadInfo} = this.props;
        const { createSimpleTable } = table;
        let { createEditTable } = editTable;
        const { createButton } = button;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const {createModal} = modal;
        let {NCFormControl,NCCheckbox} = base;
        const {createBillHeadInfo} = BillHeadInfo;
        return (

			<div className="nc-bill-list">
                {/* 标题 title */}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
                    <div className="header-title-search-area">
                        {/*页面大图标*/}
                        {/* {createPageIcon()} */}
                        {/* <h2 className="title-search-detail">{this.state.json['10100CRECR-000010']}</h2>国际化处理： 信用控制域 */}
                        {createBillHeadInfo({
                            title:this.state.json['10100CRECR-000010']/* 国际化处理： 信用控制域*/,
                            initShowBackBtn:false
                        })}
                        {/* 显示停用数据 */}
                        <span className="showOff customize-showOff title-search-detail">
                            <NCCheckbox
                                checked = {this.state.isShowOff}
                                onChange={this.showOffChange.bind(this)}
                            >{this.state.json['10100CRECR-000032']}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                        </span>
                    </div>
                    
                    
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'list_head',
                            buttonLimit: 5,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.list_head'),
                            hotKeysMap: {
                                // 对象中edit、delete、copy 指对应操作按钮数据中 key 值
                                Add: {
                                    // key为内置常量  例如editAction => ctrl+e
                                    key: "ctrl+/"
                                },
                                BatchAdd: {
                                    // 扩展了 自定义快捷键情况  不建议使用
                                    // 如果有特殊需要建议让组件内部增加常量提供
                                    key: "ctrl+b"
                                }
                            },
                            // 是否启用  默认false不启用快捷键
                            hotKeysEnabled: true
                        })}
                    </div>
                </NCDiv>

                <div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.onClickSearchBtn.bind(this)
					})}
				</div>

                {/* 列表区 */}
                <div className='nc-bill-table-area'>
                    {createSimpleTable(tableId, {//列表区
                    //  {createEditTable(tableId, {//列表区//SimpleTable 不支持列表的启用停用,editTable不支持分页
                        useFixedHeader:true,
                        onAfterEvent: this.onAfterEvent.bind(this),//启用停用事件
                        onSelected: this.updateButtonStatus.bind(this),                        // 左侧选择列单个选择框回调
                        onSelectedAll: this.updateButtonStatus.bind(this),                  // 左侧选择列全选回调
                        // selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
                        showIndex:true,				//显示序号
                        showCheck:true,			//显示复选框
                        // checkedType:'radio'
                        handlePageInfoChange: this.pageInfoClick.bind(this),
                        onRowDoubleClick: this.doubleClick.bind(this),
                        dataSource: cachKey,//缓存的标识
                        pkname: 'pk_ccregion',
                        componentInitFinished:()=>{
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理
                        }

                    })}
                </div>

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
					url={ajaxUrl.printUrl}
					data={{
						funcode:appCode,      //功能节点编码，即模板编码
                        nodekey:'creditctlregionListPrint',     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
                >
                </PrintOutput>
            </div>
        )
    }

    initTemplate = function(props) {
        // let that = this;
        createUIDom(props)(
            {
                pagecode : pageCode,
                appid : appId
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
                    meta = this.modifierMeta(props, meta)
                    props.meta.setMeta(meta,() => {
                        let searchVal =getDefData("searchParams",cachKey);
                        if(searchVal && searchVal != false){
                            props.search.setSearchValue(searchId,searchVal.conditions);
                            // this.props.search.setSearchValue(searchId,searchVal.conditions);
                            let queryInfo = this.props.search.getQueryInfo(searchId);
                            let data = {
                                // conditions: searchVal==null?null:searchVal.conditions,
                                querycondition: searchVal,
                                pageInfo:props.table.getTablePageInfo(tableId)?props.table.getTablePageInfo(tableId):
                                {
                                    pageIndex: 0,
                                    pageSize: 10,
                                    total: 0,
                                    totalPage: 0
                                },
                                pagecode: pageCode,
                                queryAreaCode:searchId,  //查询区编码
                                oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                                querytype:'tree',
                                appcode:appCode,
                                isShowOff:isShowDisable
                            };
                            ajax({
                                url: ajaxUrl.dataLoadUrl,
                                data,
                                success: (res) => {
                                    if(res.data){
                                        // Utils.convertGridEnablestate(res.data[tableId].rows);
                                        props.table.setAllTableData(tableId, res.data[tableId]);
                                    }else{
                                        props.table.setAllTableData(tableId, {rows:[]});
                                        // toast({content:that.state.json['10100CRECR-000027'],color:"warning"});/* 国际化处理： 无数据*/
                                    }
                                    //更新按钮状态
                                    toggleShow(props)
                                }
                            });
                        }
                        setTimeout(()=>{
                            toggleShow(props)
                        }, 300);
                    });
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delete',
                        this.state.json['10100CRECR-000001']
                        ) /* 设置操作列上删除按钮的弹窗提示  '删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？'*/
                    }

                    //查询区的集团条件是不可编辑，需要有默认值
                    var goupVlaue = props.search.getSearchValByField(searchId,'pk_group');
                    if(goupVlaue&&goupVlaue.display&&goupVlaue.display === ''){

                    }else{
                        props.search.setSearchValByField(searchId,'pk_group',{value: loginContext.groupId, display: loginContext.groupName});
                    }
                }
        });
    }
    
    tableButtonClick=(props, id, text, record, index)=>{
        // let pk_ccregion = record.values.pk_ccregion.value;//editTable的取法
        let pk_ccregion = record.pk_ccregion.value;
        let pk_ccregions = [];
        pk_ccregions.push(pk_ccregion);
        let ts =  record.ts.value;
        switch (id) {
            case 'Edit':
                ajax({
                    url:ajaxUrl.permissionUrl,
                    data:{pk_ccregion:pk_ccregion,mdOperateCode:'edit'},
                    success: (e) => {
                        props.pushTo(cardUrl, {
                            status: 'edit',
                            pagecode:'10100CRECR_card',
                            id:pk_ccregion,
                            // enablestate:record.values.enablestate.value
                            enablestate:record.enablestate.value
                        });
                    }
                });
            break;
            case 'Delete':
                ajax({
                        url:ajaxUrl.deleteUrl,
                        data:{pk_ccregions:pk_ccregions,ts:ts},
                        success: (e) => {
                            toast({ color: 'success', title: this.state.json['10100CRECR-000014'] });/* 国际化处理： 删除成功！*/
                            props.table.deleteTableRowsByIndex(tableId, index);
                            let {deleteCacheId} = props.table;
                            deleteCacheId(tableId,pk_ccregion);
                        }
                    });
            break;
            case 'Copy':
                props.pushTo(cardUrl, {
                    status: 'copy',
                    pagecode:'10100CRECR_card',
                    id: pk_ccregion//列表卡片传参
                });
            break;
            default:
            break;
        }
    
    }
    
    modifierMeta=(props, meta) =>{
        //添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100CRECR-000012'],/* 国际化处理： 操作*/
            itemtype:'customer',
            width: '200px',
            fixed: 'right',
            className: 'table-opr',
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
        meta[tableId].pagination = true;
        meta[tableId].items = meta[tableId].items.map((item, key) => {
            // //item.width = 150;
            if (item.attrcode == linkItem) {
                item.render = (text, record, index) => {
                    return (
                        <span
                            style={{color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                // let searchVal = props.search.getAllSearchData(searchId);
                                // cacheTools.set("searchParams",searchVal);
                                // cacheTools.set('preid',record[pk_item].value);
                                // cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
                                props.pushTo(cardUrl, {
                                    status: 'browse',
                                    pagecode:'10100CRECR_card',
                                    id: record[pk_item].value//列表卡片传参
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

    /**
     * 更新按钮的状态
     */
    function toggleShow(props){
        props.button.setMainButton('Add',true);
        var allData = props.table.getAllTableData(tableId);
        if(!allData||allData.rows.length === 0){
            props.button.setButtonDisabled(['BDelete','Enable','Disable','Print','Output'],true);
            return;
        }else{
            props.button.setButtonDisabled(['Print','Output'],false);
        }
        var checked = props.table.getCheckedRows(tableId);
        if(!checked||checked.length ===0){
            props.button.setButtonDisabled(['BDelete','Enable','Disable'],true);
        }else{
            props.button.setButtonDisabled(['BDelete','Enable','Disable'],false);
        }
        ///选择单条数据时，可操作的按钮高亮显示，不可操作的按钮置灰显示；
        if(checked.length === 1){
            var enablestate = checked[0].data.values.enablestate.value;
            if(enablestate===2){
                props.button.setButtonDisabled(['Enable'],true);
                props.button.setButtonDisabled(['Disable'],false);
            }else{
                props.button.setButtonDisabled(['Enable'],false);
                props.button.setButtonDisabled(['Disable'],true);
            }
        }
    }

CreditctlregionList = createPage({
    initTemplate:function(){},
    billinfo:[{
        billtype: 'grid', 
        pagecode: pageCode,
        bodycode: 'stepListTable',
    },{
        billtype: 'grid', 
        pagecode: pageCode,
        bodycode: 'editListTable'
    },{
        billtype: 'grid', 
        pagecode: pageCode,
        bodycode: 'listTable'
    }]
})(CreditctlregionList);

// ReactDOM.render(<SingleTable />, document.querySelector('#app'));
export default CreditctlregionList;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65