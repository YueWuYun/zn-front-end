import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, high, toast, pageTo, getMultiLang} from 'nc-lightapp-front';
import UserRefer from 'src/uap/refer/riart/userRefer';
import AddUserRefer from 'src/uap/refer/riart/userReferWithDeptAndOrg';
const { NCButton, NCRadio, NCModal, NCTabs, NCTransfer, NCTextArea, } = base;
const {ApproveDetail, }= high;
const {NCTabPane} = NCTabs;
// import testData from './test.json'

import './index.less';


// class Test extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             showDetails:false
//         }
//     }
//     handleShow = () => {
//         const current = this.state.showDetails
//         console.log(current)
//         this.setState({
//             showDetails:!current
//         })
//     }
//     close = () => {
//         const current = this.state.showDetails
//         this.setState({showDetails:!current})
//     }
//     render(){
//         return (
//             <div>
//             <NCButton onClick = {this.handleShow}>{this.state.show?"close":"show"}</NCButton>

//             <ProcessDeal
//                 billtype = "zdydj-Cxx-zdygx"
//                 billid = "1001ZZ1000000000ZTF4"
//                 showModal = {this.state.showDetails}
//                 close = {this.close}
//                 refreshApprove={..(true)}
//             />
//              </div> 
//         )
//     }
// }
  
export default class ProcessDeal extends Component {
    constructor(props){
        super(props);        
        this.state = {
            json:{},  // 加载多语     
            inlt:null, //加载多语 
            assgindata:{},
            message:{},
            showModal:props.showModal
        }
        this.close = this.close.bind(this);
        this.refreshApprove = this.refreshApprove.bind(this)
    }
    
    prepareDate(billtype,billid){
        let data = {billtype:billtype,billid:billid};
        let devUrl='/nccloud/workflow/approvalcenter/workflowLoadDataAction.do';

        // console.log('testData', testData)
        // if(testData.data && testData.data.message){
        //     // 正常返回，显示弹窗并设置数据
        //     this.setState({showModal:true,assgindata:testData.data.assgininfo,message:testData.data.message[0]})  
        // }
        // return;

        ajax({
            url: devUrl,
            data: data,
            method: 'POST',
            success: (res) => {
                //console.log("获取data、message",res);
                if(res.data && res.data.message){
                    // 正常返回，显示弹窗并设置数据
                    this.setState({showModal:true,assgindata:res.data.assgininfo,message:res.data.message[0]})  
                }else if(res.data && res.data.errorMsg){
                    // res.data内为errorMsg的时候要怎么处理，你需要在这儿处理  TODO
                    // 错误返回，关闭弹窗（主要为调用回调方法close）
                    this.close();
                    toast({color: 'danger', content: res.data.errorMsg});
                }else if(!res.data && res.error && res.error.message){
                    this.close();
                    toast({color: 'danger', content: res.error.message});
                }
            },
            error: (res) => { // 后台错误的时候，显示错误信息
                if (res && res.message) {
                    toast( { color: 'danger', content: res.message });
                }
                // 并关闭弹窗（主要为调用回调方法close）
                this.close();
            }
        });   
    }
    close(){
        this.props.close();
    }
    refreshApprove(){
        typeof this.props.refreshApprove === 'function' && this.props.refreshApprove(true);

    }
    componentWillMount() {
        // this.prepareDate(this.props.billtype,this.props.billid);
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
            }

        }
        getMultiLang({ 'moduleId': '1016-10160501', 'domainName': 'uap', callback });
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.showModal){
            this.prepareDate(nextProps.billtype,nextProps.billid);
        }else{
            this.setState({showModal:nextProps.showModal})
        }
    }
    render() {    
        return (            
            <div>
                <ModalDetail  
                    json={this.state.json} 
                    inlt={this.state.inlt} 
                    display={this.state.showModal} 
                    data={this.state.assgindata} 
                    message={this.state.message}
                    cancel={this.close}
                    refreshApprove = {this.refreshApprove}
                />
            </div>   
        )
    }
}

class ModalDetail extends Component {    
    constructor(props){        
        super(props);
        this.menuData=[];
        this.initTransferData=[];   //初始数据
        this.mapTransfer = {};
        this.usersResult = {};
        this.defaultSelectedKeys;
        this.falseMap = {};
        (this.props.data)?this.prepareData(this.props.data.content):"";   //预处理数据
        this.isMultiSelect = this.props.data && (JSON.stringify(this.props.data) !="{}") ? this.props.data.muplityWithOutAssgin:"";
        let _this = this
        this.state = {   
            json: this.props.json,//{},// //多语
            inlt: this.props.inlt,//多语null,
            message:this.props.message,
            assgindata:(Boolean(JSON.stringify(this.props.data)=="{}"))?"":this.props.data,
            showModal:this.props.display,   //是否显示modal
            sadm:false, //查看流程
            enableActions:[],
            approveType: "",
            transferApproverUser: null,  //选择改派人state
            addApproverUsers:[],   //选择加签人state
            suggestion:"",   //审批意见
            //selectedKeys:[],  //所有选中的item的keys 
            source: this.initTransferData,  //穿梭框数据
            currentMenu: this.defaultSelectedKeys,//指派时选择
            target:[],   //穿梭框右边数据
            activeKey:this.defaultSelectedKeys,  //tabs默认选项卡内容
            mapCheck: (function(obj){
                Object.keys(_this.mapTransfer).map((item, index) => {
                    obj[item] = props.data.content[index].isChoice || false;
                });
                return obj;
            })({})       
        }
    }
    prepareData(data){
        if(!data){
            return 
        }
        data.forEach((element, index)=> {
            this.falseMap[element.selectpath] = false;
            this.menuData[this.menuData.length] = {name: element.desc, id: element.selectpath};
            if(element.isAssgin){
                this.mapTransfer[element.selectpath] = element.assginUsers.map(item => {
                    return {title: item.name, code: item.code, key: element.selectpath + "_" + item.pk};
                });
            }else{
                this.mapTransfer[element.selectpath] = [];
            }
        });
        let firstKey = Object.keys(this.mapTransfer)[0];
        this.initTransferData = this.mapTransfer[firstKey];
        this.defaultSelectedKeys = firstKey;
    }
    closeModal = () => {
        this.setState({addApproverUsers:[],transferApproverUser:null});
        this.cleanSuggest();
        this.props.cancel();        
    }
    suggestAreaChange = (value) => {
        this.setState({
            suggestion:value
        })
    }
    cleanSuggest(){
        this.setState({
            suggestion:""
        })
    }

    //单选当前操作
    handleApproveType= (value) => {       
        this.setState ({
            approveType:value
        });
        this.cleanSuggest();
    }
    // 改派操作
    setTransferApprover = (value) => {
        this.setState({
            transferApproverUser:value
        });
    }
    //加签操作
    setAddApprover = value => {
        this.setState({
            addApproverUsers:value
        })
    }
    //穿梭框分支选择动作 ***
    handleSelectBranch = (value) => {
        //this.state.currentMenu
        let changeObj = {};
        changeObj[value?value:this.state.currentMenu] = true;  
        //console.log("changeObj",changeObj)                 
        this.setState({
            currentMenu: value,
            source: this.mapTransfer[value],    
            mapCheck: this.isMultiSelect ? Object.assign({},this.state.mapCheck,changeObj) : Object.assign({}, this.falseMap, changeObj)            
        })
    }

    //穿梭框动作 当item在穿梭成功后的回调
    handleTransferChange = (targetKeys, direction, moveKeys) => {
        if(!this.usersResult[this.state.currentMenu]) this.usersResult[this.state.currentMenu] = [];
        if(direction == 'right'){
            moveKeys.forEach(item => {
                if(item.indexOf(this.state.currentMenu) > -1){
                    this.usersResult[this.state.currentMenu].push(item);
                }
            });
        }else if(direction == 'left'){
            moveKeys.forEach(item => {
                if(item.indexOf(this.state.currentMenu) > -1){
                    let index = this.usersResult[this.state.currentMenu].indexOf(item);
                    this.usersResult[this.state.currentMenu].splice(index,1) ;
                }
            }); 
        }
        this.setState({
            target: targetKeys
        });
    }
    //===================确定============
    detailDoApprove(approveType){
        //console.log("detailDoApprove",approveType);
        if (approveType == "normal") {
            //穿梭框提交
            this.transferConfirm();
        }
        else if (approveType == "addapprover") {
            //加签提交
            this.addapprove();
        }
        else if (approveType == "transfer") {
            //改派提交
            this.transferApprove()
        }else if(approveType == "approve"){
            this.approvePass();
        }
    }
    //穿梭框提交
    transferConfirm(){
        if(this.props.data){
            this.props.data.content.forEach(processItem => {
                processItem.isChoice = this.state.mapCheck[processItem.selectpath];
                if(processItem.isAssgin){
                    if(!this.usersResult[processItem.selectpath]){
                        processItem.assginUsers = [];
                    }
                    processItem.assginUsers = processItem.assginUsers.filter(item => {
                        return this.usersResult[processItem.selectpath].includes(processItem.selectpath +'_'+item.pk);
                    });
                }
            });            
            this.dealAssginUsedr(this.props.data);
        }else {
            this.dealAssginUsedr(this.props.data);
        }       
    }
    dealAssginUsedr = (value) => {
        //this.state.assgindata = value;
        // this.approvePass();
        //console.log("value",value);
        this.setState({           
            assgindata: value,
        })
    this.detailDoApprove("approve");
    }
    //加签提交
    addapprove() {
        let value = this.state.addApproverUsers;
        let addApproveUsers = [];
        let suggestion = this.state.suggestion;
        if (value && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
                let cdata = value[i].refpk;
                addApproveUsers.push(cdata)
            }
        }

        if (!addApproveUsers || addApproveUsers.length == 0) {
            toast({ color: 'warning', content: this.state.json['10160501-000044'] });/* 国际化处理： 请选择加签用户*/
            return;
        }
        //*
        ajax({
            url: '/nccloud/workflow/approvalcenter/addApprove.do',
            data: { "pk_checkflow": this.state.message.pk_detail, 
                    "pk_message": this.state.message.pk_message, 
                    "billtype": this.state.message.billtype, 
                    "billid": this.state.message.billid, 
                    "approve_users": addApproveUsers, 
                    "checknote": suggestion, 
                    "check_note": suggestion 
            },
            method: 'POST',
            success: (res) => {
                if (res.data) {
                    if (res.data && (res.data == "200" || res.data.code == "200")) {
                        //console.log("加签",res)
                        this.cleanSuggest();
                        this.closeModal();                    
                        toast({ color: 'success' });
                    }
                }
            }
        });
    }
    //改派提交
    transferApprove(force_trans) {
        let value = this.state.transferApproverUser;
        let addTransferUsers = [];
        let suggestion = this.state.suggestion;
        if (value) {
            let cdata = value.refpk;
            addTransferUsers.push(cdata)

        }
        if (addTransferUsers == null || addTransferUsers.length == 0) {
            toast({ color: 'warning', content: this.state.json['10160501-000043'] });/* 国际化处理： 请选择改派用户*/
            return;
        }
        ajax({
            url: '/nccloud/workflow/approvalcenter/approveTransfer.do',
            data: { "pk_checkflow": this.state.message.pk_detail,
                    "pk_message": this.state.message.pk_message, 
                    "billtype": this.state.message.billtype, 
                    "billid": this.state.message.billid, 
                    "trans_user": addTransferUsers, 
                    "checknote": this.state.suggestion, 
                    "check_note": this.state.suggestion,
                    force_trans:force_trans?true:false },
            method: 'POST',
            success: (res) => {
                if (res.data) {
                    if (res.data && (res.data == "200" || res.data.code == "200")) {
                        //console.log("改派提交")
                        this.cleanSuggest();
                        this.closeModal();                        
                        toast({ color: 'success' });
                    }
                }
            }
        });
    }   

    approvePass(){
        let msg = this.state.message;
        let suggestion = this.state.suggestion;
        let data = {
            "billtype": msg.billtype, 
            "billid": msg.billid, 
            "pk_checkflow": msg.pk_detail, 
            "skipCodes": [], 
            "assgininfo": (this.state.assgindata)?this.state.assgindata:{}, 
            "isAssgin": true,
            "checknote": suggestion,
            "check_note": suggestion
        };
        ajax({
            url: '/nccloud/workflow/approvalcenter/approvePassAction.do',
            data:data,
            method: 'POST',
            success: (res) => {                    
                if (res.data && (res.data == "200" || res.data.code == "200")) {
                    //console.log("审批通过",res)
                    this.cleanSuggest();
                    this.closeModal();       
                    this.props.refreshApprove();
                    toast({ color: 'success', content: this.state.json['10160501-000094'] });/* 国际化处理： 审批完成*/                   
                }
               
            }
        });
    }
    // tabs 选项卡
    onChangeTabs = (activeKey) => {

        this.setState({
            currentMenu: activeKey,
            source: this.mapTransfer[activeKey]
        });
    }
    //查看流程按键
    handleshowDetail = () => {
        let currentState = this.state.sadm;
        this.setState({
            sadm:!currentState
        })
    }
    componentWillReceiveProps(nextProps){
        this.menuData=[];    //数据源
        this.initTransferData=[];
        this.mapTransfer = {};
        this.usersResult = {};
        this.falseMap = {};
        if(nextProps.data){
            this.isMultiSelect = nextProps.data.muplityWithOutAssgin;
            this.prepareData(nextProps.data.content);
        }
        let _this = this;
        this.setState( {
            json:nextProps.json,
            inlt:nextProps.inlt,
            message:nextProps.message,            
            assgindata:(Boolean(JSON.stringify(nextProps.data)=="{}"))?"":nextProps.data,
            enableActions:(Boolean(JSON.stringify(nextProps.message)=="{}"))?"":JSON.parse(nextProps.message.detail).enableActions,  //this.props.message?JSON.parse(this.props.message.detail).enableActions:"", 
            approveType: (Boolean(JSON.stringify(nextProps.message)=="{}"))?"":JSON.parse(nextProps.message.detail).enableActions[0],
            activeKey:(nextProps.data)?(Boolean(JSON.stringify(nextProps.data)!=="{}"))?nextProps.data.content[0].selectpath:"":"",//||
            showModal: nextProps.display,
            source: this.initTransferData,
            currentMenu: this.defaultSelectedKeys,            
            target: [],
            mapCheck: nextProps.data?(function(obj){
                Object.keys(_this.mapTransfer).map((item, index) => {
                    obj[item] = nextProps.data.content[index].isChoice || false;
                });
                return obj;
            })({}):""
        })
        
    }

    render(){
        // addapprover  //加签
        //  transfer    //改派
        //  Noapprove   //指派
        let data = this.state.assgindata;
        // let approveType = ((this.state.approveType).search("活动")!=-1) ? (data ?
        //             "normal":"approve"):((this.state.approveType).search("审核")!=-1) ?
        //             "approve":this.state.approveType; 
        // let approveType = data ?"normal": ["other","transfer","addapprover"].includes(this.state.approveType) ?this.state.approveType:"approve"
        let approveType = data ? ["other","transfer","addapprover"].includes(this.state.approveType) ? this.state.approveType:"normal":"approve";
        let enableActions = this.state.enableActions;  //所具有的权限
        let modalBody = "";  //modal内容       
        let muplityWithOutAssgin = data?data.muplityWithOutAssgin:""; //是否需要选择后续分支  false是需要（在右边显示）  true是不需要（在中间显示）
        //选择后续分支单选组
        let radiogroup = data?this.menuData.map(item => {      
            return  <NCRadio fieldid={item.name + "_item"} key={item.id} title={item.name} value={item.id}>
                        {item.name}
                    </NCRadio>    
            }):""
        let tabsTitle = data&&Boolean(JSON.stringify(data)!="{}")?data.content.map(item=>{
                            return  item.selectpath===this.state.currentMenu?item.nextActName:""
                        }):""
        let tabsList = data&&Boolean(JSON.stringify(data)!="{}")?data.content.map(item=>{                              
            return (                                                                  
                <NCTabPane tab={item.nextActName} key={item.selectpath}>                       
                    <NCTransfer
                        className="transfer-content"
                        dataSource={this.state.source}   //设置数据源。当有targetKey props存在时，dataSource的数据刨去targetKey数据,剩下的都放在左边列表
                        showCheckbox={false}
                        titles={[this.state.json['10160501-000125'], this.state.json['10160501-000126']]}  //两columns的title
                        targetKeys={this.state.target} //展示在右边列表的数据集
                        //selectedKeys={this.state.selectedKeys} //所有选中的item的keys
                        onChange={this.handleTransferChange}         //当item在穿梭成功后的回调 参数(targetKeys, direction, moveKeys)                                             
                        //onSelectChange={this.handleSelectChange}  //当选中的item发生改变时的回调 参数(sourceSelectedKeys, targetSelectedKeys)
                        notFoundContent={' '}       //当没有相关内容的显示内容
                        lazy={{container:"modal"}}      //懒加载dom
                        render={item => item.title}          //每行数据渲染函数，该函数的入参为 dataSource 中的项，返回值为 ReactElement。                                          
                    >
                    </NCTransfer>
                </NCTabPane> 
            )                        
        }):""                                                                                                       
                            
        //console.log("approveType",approveType);
        //console.log("message",this.state.message);
        //console.log("datarender",data);
        //console.log("enableActions",enableActions);        

        modalBody = 
            (
                <NCModal.Body style={{minHeight:data?"475px":"295px", maxHeight: "477px"}}>
                    <div className="body-content">
                    {(enableActions && enableActions.length > 1 && (enableActions.filter(el => ["addapprover", "transfer"].includes(el))).length > 0||(data&&data.content.length>0))?                            
                            (<div className="content-inner">                                
                                <div className="label" style={{ width: 90 }}>{this.state.json['10160501-000117']}:</div>{/* 国际化处理： 选择审批内容*/}
                                <div className="content">
                                    <div style={{ width: 300 }}>                                            
                                        <NCRadio.NCRadioGroup
                                            className="approveContent-radiogroup"
                                            selectedValue={approveType=="approve"?"normal":approveType}
                                            onChange={this.handleApproveType}  
                                        > 
                                            {/* 国际化处理： 执行业务按钮*/}                        
                                            <NCRadio value="normal" key="normal">{this.state.json['10160501-000119']}</NCRadio> 
                                            {/* 国际化处理： 改派*/}
                                            {(enableActions || []).filter(function (item, idx, origin) { return item == "transfer"; }).length > 0 ?
                                                (<NCRadio value="transfer">{this.state.json['10160501-000048']}</NCRadio>) : <React.Fragment></React.Fragment>} 
                                            {/* 国际化处理： 加签*/}
                                            {(enableActions || []).filter(function (item, idx, origin) { return item == "addapprover"; }).length > 0 ?
                                                (<NCRadio value="addapprover">{this.state.json['10160501-000046']}</NCRadio>): <React.Fragment></React.Fragment> }  
                                        </NCRadio.NCRadioGroup>
                                    </div>
                                </div>
                            </div>
                            ):""
                        }
                        {   approveType==="other"?"":
                            approveType==="transfer"?
                            (   
                                <div className="content-inner">                                    
                                    {/* 选框名称 */}
                                    {/* 国际化处理： 选择改派人员*/}
                                    <div className="label" style={{ width: 90, paddingTop: "4px" }}>
                                        {this.state.json['10160501-000076']}:
                                    </div>
                                    <div className="content">
                                        <div style={{ width: 200 }}>                                                                      
                                        <UserRefer
                                            style={{ width: 200 }}
                                            fieldid="userReferChange"
                                            value={this.state.transferApproverUser}
                                            queryCondition={{
                                                isMutiGroup: false,
                                                isShowGroupAdmin: false,
                                                isShowSysAdmin: false,
                                                isAuthFilter: false,
                                                isAllUserVisible: false,
                                                isShareUserVisible: false,
                                                isSelfVisible: false,
                                                isNeedNCUser: false,
                                                adminoption: 'USE'
                                            }}
                                            onChange={this.setTransferApprover}
                                            isMultiSelectedEnabled={false}
                                            placeholder={this.state.json['10160501-000049']}/* 国际化处理： 改派人*/
                                        />                                        
                                        </div>
                                    </div>
                                </div>
                            ):approveType==="addapprover"?
                            (
                                <div className="content-inner">
                                    {/* 选框名称 */}
                                    {/* 国际化处理： 选择加签人员*/}
                                    <div className="label" style={{ width: 90, paddingTop: "4px" }}>
                                        {this.state.json['10160501-000075']}:
                                    </div>
                                    <div className="content">
                                        <div style={{ width: 200 }}>                                                                      
                                        <AddUserRefer
                                            fieldid="adduserRefer"
                                            value={this.state.addApproverUsers}
                                            queryCondition={{
                                                GridRefActionExt: "nccloud.web.riart.billtype.ref.action.ItfApproveCenterUserRef",
                                                isMutiGroup: false,
                                                isShowGroupAdmin: false,
                                                isShowSysAdmin: false,
                                                isAuthFilter: false,
                                                isAllUserVisible: false,
                                                isShareUserVisible: false,
                                                isSelfVisible: false,
                                                isNeedNCUser: false,
                                                adminoption: 'USE'
                                            }}
                                            onChange={this.setAddApprover}
                                            isMultiSelectedEnabled={true}
                                            placeholder={this.state.json['10160501-000047']}/* 国际化处理： 加签人*/
                                        />
                                        </div>
                                    </div>
                                </div>
                            ):approveType==="normal"&&data?
                            ((!muplityWithOutAssgin) ?
                                (<div className="content-inner select-branch">
                                    {/* 选框名称 */}
                                    {/* 国际化处理： 选择后续分支*/}
                                    <div className="label" style={{ width: 90 }}>
                                        {this.state.json['10160501-000120']}:
                                    </div>
                                    <div className="content">
                                        <div style={{ width: 400 }}>                                                                   
                                        <NCRadio.NCRadioGroup
                                            className="select-branch-part"
                                            name="color"
                                            selectedValue={this.state.currentMenu}
                                            onChange={this.handleSelectBranch}
                                        >
                                            {radiogroup}  
                                        </NCRadio.NCRadioGroup>
                                        </div>
                                    </div>
                                </div>):""
                            ):""
                        }
                        { //选项卡穿梭框
                            (approveType==="normal" && data && this.state.source.length>0)?(!muplityWithOutAssgin)?
                            (<div className={"content-inner select-tabs-transfer select-tabs-transfer-right"}>
                                <div className="content">
                                    <NCTabs
                                        defaultActiveKey="1"
                                        onChange={this.onChangeTabs}
                                        className="tabs"
                                    >   
                                        <NCTabPane className="select-dispatch-part" tab={tabsTitle} key="1">
                                            <NCTransfer
                                                className="transfer-content"
                                                dataSource={this.state.source}   //设置数据源。当有targetKey props存在时，dataSource的数据刨去targetKey数据,剩下的都放在左边列表
                                                showCheckbox={false}
                                                titles={[this.state.json['10160501-000125'], this.state.json['10160501-000126']]}  //两columns的title
                                                targetKeys={this.state.target} //展示在右边列表的数据集
                                                //selectedKeys={this.state.selectedKeys} //所有选中的item的keys
                                                onChange={this.handleTransferChange}         //当item在穿梭成功后的回调 参数(targetKeys, direction, moveKeys)                                             
                                                //onSelectChange={this.handleSelectChange}  //当选中的item发生改变时的回调 参数(sourceSelectedKeys, targetSelectedKeys)
                                                notFoundContent={' '}       //当没有相关内容的显示内容
                                                lazy={{container:"modal"}}      //懒加载dom
                                                render={item => item.title}          //每行数据渲染函数，该函数的入参为 dataSource 中的项，返回值为 ReactElement。                                          
                                            >
                                            </NCTransfer>
                                        </NCTabPane>                                                                                                        
                                    </NCTabs>
                                </div>
                            </div>):(    //位于中间
                                <div className={"content-inner select-tabs-transfer select-tabs-transfer-center"}>
                                {/* <div className="label">{this.state.json['10160501-000121']}:</div>国际化处理： 指派后续活动的参与者 */}
                                {/* 国际化处理： 指派后续活动的参与者*/}
                                <div className="label" style={{ width: 90}}>
                                        {this.state.json['10160501-000121']}:
                                </div>
                                
                                <div className="content">
                                    <NCTabs
                                        className="tabs" 
                                        defaultActiveKey={this.state.currentMenu}                                        
                                        onChange={this.onChangeTabs}                                                                            
                                    >       
                                        {tabsList}  
                                    </NCTabs>
                                </div>
                            </div>
                            ):""
                        }
                        {                    
                            (<div className="content-inner">
                                <div className="label">{this.state.json['10160501-000016']}:</div>{/* 国际化处理： 审批意见*/}
                                <div className="content">
                                    {(approveType==="normal"&&data)?
                                    (<NCTextArea 
                                        fieldid="comment"
                                        className="approve-opinion-content" 
                                        cols="80" rows="4" wrap="soft" 
                                        value={this.state.suggestion}
                                        onChange={this.suggestAreaChange}                              
                                    />):
                                    (<NCTextArea 
                                        fieldid="comment"
                                        className="approve-opinion-content" 
                                        cols="58" rows="8" wrap="soft" 
                                        value={this.state.suggestion}
                                        onChange={this.suggestAreaChange}                              
                                    />)}                                
                                </div>
                            </div>)  
                        }                                                      
                    </div>
                </NCModal.Body>
            )
        return (
            <div className="approve-modal-content">
                  {/* 模态框内容 */}
                  <NCModal
                    dialogClassName="approve-modal-part"
                    show = {this.state.showModal}
                    onHide = {this.closeModal} 
                    centered = {true}
                    resizable = {false}
                    width = {data?820:640}   //{approveType==="normal"&&data?820:640}
                    
                    style = {{paddingLeft:"0px"}}
                  >
                        {/* 模态框头部 */}
                        <NCModal.Header closeButton className="modal-part-header" closeButton={true}>
                            <NCModal.Title className="modal-part-title">{this.state.json['10160501-000119']}</NCModal.Title>{/* 国际化处理： 执行工作流*/}
                        </NCModal.Header>
                        {modalBody}
                        <NCModal.Footer className="modal-part-footer">
                            <NCButton fieldid="confirm" className="btn-default" colors="primary" onClick={this.detailDoApprove.bind(this,approveType)} style={{marginRight: 5}}>{this.state.json['10160501-000012']}</NCButton>{/* 国际化处理： 确定 */}
                            <NCButton className="btn-flow" onClick={this.handleshowDetail} style={{marginRight: 5}}>{this.state.json['10160501-000118']}</NCButton>{/* 国际化处理： 查看流程*/}
                            <NCButton fieldid="cancel" className="btn-default" onClick={this.closeModal} style={{marginRight: 5}}>{this.state.json['10160501-000087']}</NCButton>{/* 国际化处理： 关闭*/}                            
                        </NCModal.Footer>

                </NCModal>
                {/* 查看流程 */}
                {this.state.sadm ?                    
                    <ApproveDetail
                        show={this.state.sadm}
                        close={this.handleshowDetail}
                        billtype={this.state.message.billtype}
                        billid={this.state.message.billid}
                    />
                    : ""}                  
            </div>
        )
    }
}
// let TestPage = createPage({
//     //initTemplate: initTemplate,
// })(Test);
// ReactDOM.render(<TestPage />,document.querySelector("#app"))