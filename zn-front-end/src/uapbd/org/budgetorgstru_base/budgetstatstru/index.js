//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,toast ,promptBox ,getMultiLang} from 'nc-lightapp-front';
import './budgetstatstru.less'
let { NCCol:Col,NCRow:Row ,NCFormControl,NCDiv} = base;

const {NCDatePicker, NCButton ,NCPanel,NCCheckbox,NCPopconfirm ,NCRadio } = base;

/**
 * 穿梭框--导入使用
 */
import Transfer from '../../../public/excomponents/Transfer';

//集团(所有）参照
// import GroupDefaultTreeRef from '../../../refer/org/GroupDefaultTreeRef/index'
//集团参照
import GroupDefaultTreeRef from '../../../../uap/refer/riart/groupTreeRef/index'
//组织类型参照
import OrgTypeGridRef from '../../../refer/org/OrgTypeGridRef/index'
import createUIDom from '../../../public/utils/BDCreateUIDom';
import  Utils from '../../../public/utils';

let sysSaveType = 'add';//add--新增  edit--修改  copy--复制
let memberSaveType = 'edit';
let sysVersionModalId = 'systemversion';//体系版本化模态框
let importModalId = 'importModalId';//引入对话框id


let treeTableId = 'statmemberTable';
let pk_budgetorgstru = '';
let pk_svid = '';
let memberFomPageCode = '10100BOS_statmember_form';
let memberFormId = 'statmemberFrom';//成员--编辑id
let orgFormId = 'orgForm';//成员组织信息模板id
let memberEditModalId = 'memberModal';//成员--编辑模态窗id

let memberSortModalId = 'memberSortModal';//结构调整模态框id
let memberSortTreeId = 'memberSortTree';//结构调整--树id

let pk_importGroup = '';//引入对话框的集团参照的主键
let groupname = '';
let pk_orgtypes = 'BUSINESSUNIT00000000';//引入的组织类型
let showDisableOrg = false;//引入对话框是否显示停用的组织
let orgTypeName = '';
//this.state.json['10100BOSB-000000']//引入组织类型名称/* 国际化处理： 业务单元*/
let isSort = false;//结构不是被调整过，用来判断是不是需要刷新数据
/**
 * AjaxUrl配置
 */
let ajaxUrl={
    memberLoadUrl:"/nccloud/uapbd/org/BudgetOSStatMemberQueryAction.do",
    memberSortQryUrl:"/nccloud/uapbd/org/BudgetOSStatMemberSortQueryAction.do",
    memberSetOrderUrl:"/nccloud/uapbd/org/BudgetOSStatMemberSetOrderAction.do",
    memberQryByPkUrl:"/nccloud/uapbd/org/BudgetOSStatMemberQueryByPkAction.do",
    memberDeleteUrl:"/nccloud/uapbd/org/BudgetOSStatMemberDeleteAction.do",
    memberGetNewUrl:"/nccloud/uapbd/org/BudgetOSStatMemberAddAction.do",
    memberSaveUrl:"/nccloud/uapbd/org/BudgetOSStatMemberSaveAction.do"
}
let tableBtnAry = ["Editline","Delline"];		//树表列操作按钮

/**
 * 预算组织系统--统计成员管理界面
 * wangdca
 */
class StatMember extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        let { form, button, table, search ,syncTree } = this.props;
        let { setSyncTreeData } = syncTree;
        this.setSyncTreeData = setSyncTreeData;   //设置树根节点数据方法
        this.state={
            oprType:'0',
            importLeftTreeData:[],
            importRightTreeData:[],
            refs: {},
            json:{},
            searchValue:''	
        }
        this.initTemplate(props);
    }

    componentDidMount () {
        // var url = location.search.substr(1);
        // pk_budgetorgstru=url.split('=')[1];
        debugger
        pk_budgetorgstru = this.props.getUrlParam('pk_budgetorgstru');
        pk_svid = this.props.getUrlParam('pk_svid');

        //加载左树 默认不加载停用数据
        this.loadTreeTableData();
    }

     /**
     * 浏览器或页签关闭时的提示信息--编辑态提示、浏览态不提示
     * @param {*} uiStatus 
     */
    windowCloseListener(uiStatus){
        if(uiStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    loadTreeTableData(isRefreshAction=false){
        let that = this;
        ajax({
            url:ajaxUrl.memberLoadUrl,
            method:"post",
            data:{pk_budgetorgstru: pk_budgetorgstru,nodeType:this.props.nodeType,pk_svid:pk_svid},
            success:function(res){
                if(res.success){
                    if(res.data.grid){
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        let datas =  that.props.treeTableManyCol.createNewData(res.data.grid.statmemberTable.rows);
                        // let datas = res.data.statmemberTable.rows;
                        //根据树状表的数据构造树表
                        that.props.treeTableManyCol.initTreeTableData(treeTableId,datas,'refpk');
                    }else{
                        // let datas =  that.props.treeTableManyCol.createNewData({rows: []});
                        // that.props.treeTableManyCol.initTreeTableData(treeTableId,datas,'refpk')
                        that.props.treeTableManyCol.emptyAllData(treeTableId);
                    }
                    pk_importGroup = res.data.pk_group;
                    groupname = res.data.groupname;
                    if(isRefreshAction){
                        toast({ color: 'success', title: that.state.json['10100BOSB-000001'] });/* 国际化处理： 刷新成功！*/
                    }
                    that.setState({ searchValue:'' });
                }
                that = null;
            }
        });
    }
    //停用
    onClickButton(props,id){
        switch (id) {
            case 'Import':
                this.onImportClick();
                break;
            case 'AddVirtual':
                this.onAddMember();
                break;
            case 'Refresh':
                this.loadTreeTableData(true);
                break;
            case 'SortManage':
                this.onSortClick();
                break;
            default:
                break;
        }
    }
    //成员修改保存
    onSaveMember(){
        let memberFlag = this.props.form.isCheckNow(memberFormId);
        let orgFlae = this.props.form.isCheckNow(orgFormId);
        if(!memberFlag||!orgFlae){
            return;
        }
       
        let orgdata = this.props.form.getAllFormValue(orgFormId);
         //下面的代码用来验证公式
         orgdata.areacode = 'orgForm';
         let validateData = {"model" :orgdata,"pageid" :this.props.statPageCode};
         this.props.validateToSave( validateData ,()=>{
              this.memberSaveFun(orgdata)
              }, { 'orgForm': 'form' },'form');
        
    }
    /**
     * 成员保存方法
     * @param {*} orgdata 
     */
    memberSaveFun(orgdata){
        let formdata = this.props.form.getAllFormValue(memberFormId);
        let requestParam = {
            model: formdata,
            pageid: memberFomPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        let orgRequest = {
            model:orgdata,
            pageid:'10100RCSB_reportorg'
        };

        let that = this;
        let selectMember = this.props.treeTableManyCol.getSelectedRow(treeTableId);
        ajax({
            url:ajaxUrl.memberSaveUrl,
            method:"post",
            data:{'memberData':requestParam,'orgData':orgRequest,nodeType:this.props.nodeType,pk_svid:pk_svid,pk_system:pk_budgetorgstru},
            // data:requestParam,
            success:function(res){ 
                if(res.success){
                     //后台返回的是表格的数据  需要构造成树状表的数据
                     let datas = res.data.statmemberTable.rows[0];
                    //  let datas =  that.props.treeTableManyCol.createNewData(res.data.statmemberTable.rows);
                    toast({ color: 'success', title: that.state.json['10100BOSB-000002'] });/* 国际化处理： 保存成功！*/
                    that.windowCloseListener('browse');
                    that.props.modal.close(memberEditModalId);
                    //根据树状表的数据构造树表
                    if(memberSaveType ==='edit'){
                        that.props.treeTableManyCol.editRowEve(treeTableId,datas);
                    }else{
                       // that.props.treeTableManyCol.addChildRowEve(treeTableId,datas,selectMember);
                       that.loadTreeTableData(false);
                    }
                }
                that = null;
            }
        });
    }
    //成员新增虚节点
    onAddMember(){
        let selectMember = this.props.treeTableManyCol.getSelectedRow(treeTableId);
        let pk_member = '';
        let pk_membeorg = '';
        if(selectMember&&selectMember.length>0){
            pk_member = selectMember[0].rowId;
            pk_membeorg = selectMember[0].values.pk_org.value;
        }
        memberSaveType = 'add';
        ajax({
            url:ajaxUrl.memberGetNewUrl,
            data:{pk_system:pk_budgetorgstru,pk_member:pk_member,pk_membeorg:pk_membeorg,nodeType:this.props.nodeType,pk_svid:pk_svid},
            success: (res) => {
                if (res.success) {
                    let meta = this.props.meta.getMeta();
                    meta[memberFormId].items.map((obj)=>{
                        if(obj.attrcode == 'pk_fathermember'){
                            obj.queryCondition = function () {
                                return {
                                    "pk_svid": pk_svid
                                }
                            }
                        }
                    })
                    this.props.form.EmptyAllFormValue(memberFormId);
                    this.props.form.setFormStatus(memberFormId,'add');
                    this.props.form.EmptyAllFormValue(orgFormId);
                    this.props.form.setFormStatus(orgFormId,'add');
                    
                    // this.props.form.setAllFormValue({statmemberFrom:res.data.memberForm.statmemberFrom});
                    // this.props.form.setAllFormValue({orgForm:res.data.orgForm.orgForm});

                    let cardData = {rows:res.data.memberForm.statmemberFrom.rows};
                    let cardvalue = {'statmemberFrom':cardData}
                    Utils.filterEmptyData(cardvalue.statmemberFrom.rows[0].values);
                    this.props.form.setAllFormValue(cardvalue);

                    let orgData = {rows:res.data.orgForm.orgForm.rows};
                    let orgvalue = {'orgForm':orgData}
                    Utils.filterEmptyData(orgvalue.orgForm.rows[0].values);
                    this.props.form.setAllFormValue(orgvalue);
                    
                    // if(res.data.ismanageorg){
                        //     props.form.setFormStatus(orgFormId,'edit');
                        // }else{
                            //     props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                            //     props.form.setFormStatus(orgFormId,'browse');
                            // }
                    this.props.modal.show(memberEditModalId);
                    this.windowCloseListener('add');
               }
            }
        });

    }

     //========================= 体系成员引入=========================
     onImportClick(){
          //校验成员只能有一个根节点//统计体系成员不需要保证只有一个根，可以有多根
        // let allMember = this.props.treeTableManyCol.getAllValue(treeTableId);
        // let selectMember = this.props.treeTableManyCol.getSelectedRow(treeTableId);
        // if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
        //     toast({content : this.state.json['10100BOSB-000003'],color : 'warning'});/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
        //     return;
        // }
        this.onImportDataLoad.call(this,false);
       
    }

    //引入时是否显示停用的组织
    onShowDisableOrg(checked){
        showDisableOrg = !showDisableOrg;
        this.onImportDataLoad.call(this,showDisableOrg);
    }

    onImportDataLoad(showDisableOrg){
        let that = this;
        //获取选中的成员作为引入数据的根节点
        let pk_bssmember = '';
        let selectMember = this.props.treeTableManyCol.getSelectedRow(treeTableId);
        if(selectMember&&selectMember.length>0){
            pk_bssmember = selectMember[0].rowId;
        }

        ajax({
            url:"/nccloud/uapbd/org/BudgetOSStatMemberImportQueryAction.do",
            method:"post",
            data:{pk_group:pk_importGroup,showDisable:showDisableOrg,pk_system:pk_budgetorgstru,pk_orgtypes:pk_orgtypes,pk_svid:pk_svid,pk_bssmember:pk_bssmember},
            success:function(res){
                if(res.success){
                    //弹出引入窗口
                    that.props.modal.show(importModalId);
                    that.orgTransfer.setRootTitle( groupname+'-' + orgTypeName)
                    if(res.data){
                        that.orgTransfer.reset(res.data);
                    }else{
                        that.orgTransfer.reset([]);
                    }
                    // that.orgTransfer.setMoveType('0');
                    that.orgTransfer.setMoveType(that.state.oprType);
                }
                that = null;
            }
        });
    }
    //体系成员引入保存
    onImportSave(){
        var orgs = this.orgTransfer.getData();
        if(!(orgs&&orgs.length>0)){
            toast({content : this.state.json['10100BOSB-000004'],color : 'warning'});/* 国际化处理： 您没有选择任何数据！*/
            return;
        }

        // let pk = this.props.syncTree.getSelectNode(leftTree).id;
        // let pk_sysvid =this.props.syncTree.getSelectNode(leftTree).nodeData.pk_vid;
        let that = this;
        //获取选中的成员作为引入数据的根节点
        let pk_fmsmember = '';
        let pk_membeorg = '';
        let selectMember = this.props.treeTableManyCol.getSelectedRow(treeTableId);
        if(selectMember&&selectMember.length>0){
            pk_fmsmember = selectMember[0].rowId;
            pk_membeorg = selectMember[0].values.pk_org.value;
        }
        ajax({
            url:"/nccloud/uapbd/org/BudgetOSStatMemberImportSaveAction.do",
            method:"post",
            // data:{orgs,pk_system:pk,pk_sysvid:pk_sysvid},
            data:{orgs,pk_system:pk_budgetorgstru,pk_fmsmember:pk_fmsmember,pk_membeorg:pk_membeorg,nodeType:this.props.nodeType,pk_svid:pk_svid},
            success:function(res){
                if(res.success){
                    if(res.data){//返回全新的数据 刷新界面
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        // 
                        let datas =  that.props.treeTableManyCol.createNewData(res.data.statmemberTable.rows);
                        // let datas = res.data.statmemberTable.rows;
                        //根据树状表的数据构造树表
                        that.props.treeTableManyCol.initTreeTableData(treeTableId,datas,'refpk');
                    }else{
                        that.props.treeTableManyCol.emptyAllData(treeTableId);
                    }
                    that.props.modal.close(importModalId);
                }
                
            }
        });
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
	 * 切换树节点移动方式
	 */
	handleOprTypeChange(value){
		this.setState({
			oprType : value
        });
        this.orgTransfer.setMoveType(value);
    }
    
    createCfg(id,param){
        var obj;
        if(id==='GroupDefaultTreeRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    this.setState(Object.assign (this.state.refs,temp));
                    if(pk_importGroup!==temp.value.refpk){
                        pk_importGroup = temp.value.refpk;
                        this.onImportClick();
                    }
                }.bind(this)
            }
        }
        if(id==='OrgTypeGridRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    this.setState(Object.assign (this.state.refs,temp));
                    if(pk_orgtypes!==temp.value.refpk){
                        pk_orgtypes = temp.value.refpk;
                        this.onImportClick();
                    }
                }.bind(this)
            }
        }
        this.state.refs[id]=obj;
        var result_param= Object.assign(obj, param)
        return result_param;
    }

    //数据选择监听事件
    handelBeforeMove(nodes,value,type){
        if(type==='bl2r'){
           return this.checkBeforeMove(nodes);
        }
    }

    checkBeforeMove(nodes){
        let returnResult = true
        nodes.forEach((item,index)=>{
            if(item.nodeData.isMember){
                /* 国际化处理： 在体系中已经存在，请重新选择*/
                toast({content : item.refname + this.state.json['10100BOSB-000005'],color : 'warning'});
                returnResult = false;
                return
            }
			if(item.children&&item.children.length > 0){
				this.checkBeforeMove(item.children);
			}
        });
        return returnResult;
    }

    onCheckboxChange(id,check){
        switch(id){
            case 'orgShowDisable':
                this.onShowDisableOrg.call(this,check);
                break;
            case 'sysShowDisable':
                this.onCheckShowDisable.call(this,check);
                break;
        }
    }
    getImportDialog(){
        return (
			<div id="org_transfer" className="steps-content" style={{height:'450px'}}>
                <Row className='steps-content-row'>
                    <Col md={4} xs={4} sm={4}>
                        {GroupDefaultTreeRef({}=this.createCfg("GroupDefaultTreeRef",{
                                value:{refpk:pk_importGroup,
                                    refname:groupname
                                },
                                fieldid : 'GroupDefaultTreeRef',
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    // isShowDisabledData: true,
                                    // pk_reportcombinestru: this.props.syncTree.getSelectNode(leftTree).id
                                };
                            }.bind(this)
                        }))}
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        {OrgTypeGridRef({}=this.createCfg("OrgTypeGridRef",{
                                value:{refpk:pk_orgtypes,
                                    refname:orgTypeName
                                },
                                fieldid : 'OrgTypeGridRef',
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    GridRefActionExt:'nccloud.web.org.budgetorgstru.action.BudgetOSMemberImportSqlBuilder'
                                };
                            }.bind(this)
                        }))}
                    </Col>
                    <Col>
                         <NCCheckbox id = 'orgShowDisable' 
                            onChange = {this.onCheckboxChange.bind(this,'orgShowDisable')}
                            checked = {showDisableOrg}
                         >{this.state.json['10100BOSB-000019']}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                    </Col>
                </Row>             
			    <Transfer 
                    ref={(item)=>{this.orgTransfer = item}} showSearch={true}
                />
                <NCRadio.NCRadioGroup
                    name="oprType"
                    selectedValue={this.state.oprType}
                    onChange={this.handleOprTypeChange.bind(this)}>
                    <NCRadio value="0" >{this.state.json['10100BOSB-000020']}</NCRadio>{/* 国际化处理： 包含所有下级*/}
                    <NCRadio value="1" >{this.state.json['10100BOSB-000021']}</NCRadio>{/* 国际化处理： 仅自己*/}
                    <NCRadio value="2" >{this.state.json['10100BOSB-000022']}</NCRadio>{/* 国际化处理： 仅直接下级*/}
                    <NCRadio value="3" >{this.state.json['10100BOSB-000023']}</NCRadio>{/* 国际化处理： 仅末级*/}
                </NCRadio.NCRadioGroup>
			</div>
            
		);
    }

          /**
     * 结构调整
     */
    onSortClick(){
        let pk_system = pk_budgetorgstru;
        ajax({
            url:ajaxUrl.memberSortQryUrl,
            method:"post",
            data:{pk_budgetorgstru:pk_system,pk_svid:pk_svid},
            success:(res)=>{
                if(res.success){
                    //转换树的父子关系
                    if(res.data){
                        let treeData = this.dealTreeData(res.data);
                        this.setSyncTreeData(memberSortTreeId, treeData);
                    }else{
                        this.setSyncTreeData(memberSortTreeId, []);
                    }
                    this.props.modal.show(memberSortModalId);
                }
            }
        });
    }
    /**
     * 排序树不需要操作功能
     * @param {*} key 
     */
    onMouseEnterSortTreeEve( key ) {
        let obj = {
            delIcon:false,
            editIcon:false,
            addIcon:false
        };
        this.props.syncTree.hideIcon( memberSortTreeId, key, obj )
    }

    setOrder(orderType){
        let selected = this.props.syncTree.getSelectNode(memberSortTreeId)
        if(!selected){
            /* 国际化处理： 请选择要操作的数据！*/
            toast({content : this.state.json['10100BOSB-000006'],color : 'warning'});
            return;
        }
        let pk_member = selected.id;
        ajax({
            url:ajaxUrl.memberSetOrderUrl,
            method:"post",
            data:{pk_member:pk_member,orderType:orderType,pk_svid:pk_svid},
            success:(res)=>{
                if(res.success){
                    //转换树的父子关系
                    let treeData = this.dealTreeData(res.data);
                    this.setSyncTreeData(memberSortTreeId, treeData);
                    this.props.syncTree.setNodeSelected(memberSortTreeId,selected.id);
                    this.props.modal.show(memberSortModalId);
                    isSort = true;
                }
            }
        });
    }
      /**
     * 处理树数据
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
     * 树表数据选中事件
     * @param {*} record 
     * @param {*} index 
     * @param {*} e 
     */
    checkboxChange(record, index, e){
        let pk_bosmember = record.values.pk_bosmember.value;
        if(pk_bosmember){
            this.props.button.setButtonDisabled(['Import','AddVirtual','Editline','Delline'],true);
        }else{
            this.props.button.setButtonDisabled(['Import','AddVirtual','Editline','Delline'],false);
        }
        let selectMember = this.props.treeTableManyCol.getSelectedRow(treeTableId);
        if(selectMember&&selectMember.length>0){
            // pk_bssmember = selectMember[0].rowId;
        }else{
            this.props.button.setButtonDisabled(['Import','AddVirtual','Editline','Delline'],false);
        }
    }


    onSearch(value){
        this.setState({ searchValue:value });
        this.props.treeTableManyCol.searchTreeTable({ moduleId: 'statmemberTable', 
            searchValue: value, filters: ['code','name'], expanded: true, defaultExpandAllRows: false})
    }

    render() {
        const {button, syncTree, modal,DragWidthCom,treeTable,treeTableManyCol,editTable,BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {createButton} = button;
        const { createButtonApp } = button;
        const { createTreeTable } = treeTable;
        let { treeTableCol } = treeTableManyCol;
        let {createSyncTree} = syncTree;
        let { createModal } = modal;
        return (
            <div className="bankPage">
                 {/*预算组织统计成员- 编辑模态框*/}
                 { this.state.json['10100BOSB-000009']&&createModal(memberEditModalId,{
                    title:this.state.json['10100BOSB-000009'],/* 国际化处理： 预算组织体系统计成员管理*/
                    content:function(){
                        return(
                            <div>
                                <div>
                                     {this.props.form.createForm(memberFormId)}
                                     {/* <div> */}
                                        {/* <hr/> */}
                                        {this.state.json['10100BOSB-000024']}:{/* 国际化处理： 组织信息*/}
                                     {/* </div> */}
                                     {this.props.form.createForm(orgFormId)}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onSaveMember.bind(this),
                    showModal:true,
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        // this.props.modal.show('warning',{
                        //     beSureBtnClick:()=>{
                        //         this.props.modal.close(memberEditModalId);
                        //         this.props.modal.close('warning');
                        //     }
                        // });
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title:this.state.json['10100BOSB-000010'],/* 国际化处理： 确认取消*/
                            content:this.state.json['10100BOSB-000011'],/* 国际化处理： 是否确认要取消？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(memberEditModalId);
                                this.windowCloseListener('browse');
                            }
                        })
                    }
                }) }

                 {/*体系成员- 引入操作模态框*/}
                 { this.state.json['10100BOSB-000012']&&createModal(importModalId,{
                    title:this.state.json['10100BOSB-000012'],/* 国际化处理： 请选择要引入的组织*/
                    content:this.getImportDialog.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onImportSave.bind(this),
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{
                        this.props.modal.close(importModalId);
                        this.windowCloseListener('browse');
                    }
                }) }

                 {/*统计成员- 结构调整模态框*/}
                 { this.state.json['10100BOSB-000013']&&createModal(memberSortModalId,{
                    title:this.state.json['10100BOSB-000013'],/* 国际化处理： 结构调整*/
                    className:'jiegou',
                    content:function(){
                        return(
                            <div className="tree-table">
                                <DragWidthCom
                                        //树
                                        leftDom = {
                                            <div className="tree-area add-limit-style-tree">
                                                {createSyncTree({
                                                    treeId:memberSortTreeId,
                                                    showLine:true, 
                                                    needSearch:false,
                                                    defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                                    onMouseEnterEve:this.onMouseEnterSortTreeEve.bind(this),//鼠标滑过节点事件
                                                    showModal:false
                                                })}
                                            </div>
                                        } 
                                        //
                                        rightDom = {
                                            <div>
                                                 <div className = 'button-area'>
                                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                                        <NCButton fieldid={"indexuptop"}  onClick= {this.setOrder.bind(this,'upTop')}>{this.state.json['10100BOSB-000025']}</NCButton>{/* 国际化处理： 置于顶层*/}
                                                    </div>
                                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                                        <NCButton fieldid={"indexupone"} onClick= {this.setOrder.bind(this,'upOne')}>{this.state.json['10100BOSB-000026']}</NCButton>{/* 国际化处理： 向上一层*/}
                                                    </div>
                                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                                        <NCButton fieldid={"indexdownone"} onClick= {this.setOrder.bind(this,'downOne')}>{this.state.json['10100BOSB-000027']}</NCButton>{/* 国际化处理： 向下一层*/}
                                                    </div>
                                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                                        <NCButton fieldid={"indexdownbottom"} onClick= {this.setOrder.bind(this,'downBottom')}>{this.state.json['10100BOSB-000028']}</NCButton>{/* 国际化处理： 置于底层*/}
                                                    </div>
                                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                                        <NCButton fieldid={"indexupgrade"} onClick= {this.setOrder.bind(this,'upgrade')}>{this.state.json['10100BOSB-000029']}</NCButton>{/* 国际化处理： 升级*/}
                                                    </div>
                                                    <div className="opr-botton" style={{marginBottom:'10px'}}>
                                                        <NCButton fieldid={"indexdegrade"} onClick= {this.setOrder.bind(this,'degrade')}>{this.state.json['10100BOSB-000030']}</NCButton>{/* 国际化处理： 降级*/}
                                                    </div>
                                                 </div>
                                            </div>
                                        }  
                                        defLeftWid = '80%'      // 默认左侧区域宽度，px/百分百 
                                    />
                            </div>
                        )
                    }.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    // beSureBtnClick:this.onImportSave.bind(this)
                    noFooter:true,
                    hasCloseBtn:true,
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{
                        this.props.modal.close(memberSortModalId);
                        if(isSort){
                            this.loadTreeTableData();
                        }
                        this.windowCloseListener('browse');
                    }
                    // size:'sm'//模态框大小 sm/lg/xlg
                }) }

                
                {/* 标题 title */}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header" >
                    {createBillHeadInfo({
                        title:this.state.json['10100BOSB-000009'],
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
                {/* 标题 主界面区域  左树--右树表*/}
                <div className="table-area">
                    <div className="treeTableCol">
                         {/* 树表搜索 */}
                         <Row style={{marginBottom: 10,marginLeft:10}}>
                                <Col style={{marginTop: 10}} md={2} xs={2} sm={2}>
                                    <NCFormControl
                                        placeholder={this.state.json['10100BOSB-000057'] }
                                        value={this.state.searchValue}
                                        onChange={this.onSearch.bind(this)}
                                        type="search"
                                        // disabled={this.state.searchDisable}
                                    />
                                </Col>
                            </Row>
                            { treeTableCol( treeTableId,{
                                async:false,    //数据同步加载为false,异步加载为true
                                defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                showCheckBox:true,       // 是否显示复选框 ,默认false不显示
                                checkboxChange:this.checkboxChange.bind(this), //新增勾选onChange事件
                                checkedType:'radio'      // 勾选方式，单选radio,多选 checkbox； 默认多选
                            } ) }
                    </div>
                </div>
            </div>
        )
    }

    //初始化单据模板
    initTemplate = function(props) {
        createUIDom(props)(
            {
                pagecode : props.statPageCode
                // appid : props.appId
                // appcode:props.appCode
            },
            {
                moduleId: "10100BOSB",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData;
                    orgTypeName = this.state.json['10100BOSB-000000']//引入组织类型名称/* 国际化处理： 业务单元*/
                }
                if(data){
                    let meta = data.template;
                    meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delline',this.state.json['10100BOSB-000016']) /* '确认要删除该条吗？' 设置操作列上删除按钮的弹窗提示 */
                    }
                }
        });
    }
    
    tableButtonClick=(props, id, text, record, index)=>{
        let pk = record.values.pk_bssmember.value;
        let pk_vid = record.values.pk_vid.value;
        switch(id){
            case 'Editline':
                memberSaveType = 'edit';
                ajax({
                    url:ajaxUrl.memberQryByPkUrl,  
                    data: {pk_member:pk,pk_svid:pk_svid,pk_vid:pk_vid},
                    success: (res) => {
                        if (res.success) {
                            let meta = props.meta.getMeta();
                            meta[memberFormId].items.map((obj)=>{
                                if(obj.attrcode == 'pk_fathermember'){
                                    obj.queryCondition = function () {
                                        return {
                                            "pk_svid": pk_svid
                                        }
                                    }
                                }
                            })
                            props.form.setFormStatus(memberFormId,'edit');
                            props.form.EmptyAllFormValue(memberFormId);
                            props.form.EmptyAllFormValue(orgFormId);
                            // props.form.setAllFormValue({statmemberFrom:res.data.memberForm.statmemberFrom});
                            // props.form.setAllFormValue({orgForm:res.data.orgForm.orgForm});
    
                            let cardData = {rows:res.data.memberForm.statmemberFrom.rows};
                            let cardvalue = {'statmemberFrom':cardData}
                            props.form.setAllFormValue(cardvalue);
        
                            let orgData = {rows:res.data.orgForm.orgForm.rows};
                            let orgvalue = {'orgForm':orgData}
                            props.form.setAllFormValue(orgvalue);
                            if(res.data.ismanageorg){
                                props.form.setFormStatus(orgFormId,'edit');
                            }else{
                                props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                                props.form.setFormStatus(orgFormId,'browse');
                            }
                            props.modal.show(memberEditModalId);
                            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                                return '';
                            };
                        }
                    }
                });
                break;
            case 'Delline':
                ajax({
                    url:ajaxUrl.memberDeleteUrl,  
                    data: {pk_member:pk,ts:record.values.ts.value,pk_svid:pk_svid,pk_vid:pk_vid},
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', title: this.state.json['10100BOSB-000017'] });/* 国际化处理： 删除成功！*/
                            props.treeTableManyCol.delRowByPk(treeTableId,record);
                        }
                    }
                });
                break;
            default:
                break;
    
        }
    }
     modifierMeta=(props, meta)=> {
        meta[memberFormId].items.map((obj)=>{
            if(obj.attrcode == 'pk_fathermember'){
                obj.refcode = 'uapbd/refer/org/BudgetStatStruMemberDefaultTreeRef/index.js';
            };
            if(obj.attrcode == 'pk_entityorg'){
                obj.refcode = 'uapbd/refer/org/PlanBudgetDefaultGridRef/index.js';
            };
        });
        meta[orgFormId].items.map((obj)=>{
            if(obj.attrcode == 'datasource'){
                obj.refcode = 'uapbd/refer/org/DataSourceDefaultGridRef/index.js';
            }
        });
        //树表添加操作列
        meta[treeTableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100BOSB-000018'],/* 国际化处理： 操作*/
            itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
            width: 200,
            visible: true,
            fixed:'right',
            render: (text, record, index) => {
                let pk_bosmember = record.values.pk_bosmember.value;
                if(pk_bosmember){
                    tableBtnAry = [];
                }else{
                    tableBtnAry = ['Editline', 'Delline'];
                }
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
        return meta;
    }
}

// let StatMember =  createPage({
//     // initTemplate: initTemplate,
// })(MemberPanel);
export default StatMember;

// ReactDOM.render(<StatMember />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65