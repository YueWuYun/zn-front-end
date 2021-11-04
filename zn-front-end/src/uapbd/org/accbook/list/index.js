//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,base,ajax,cardCache,cacheTools,toast,createPageIcon,high } from 'nc-lightapp-front';
import UploadImg from '../../../public/packages/uploadImg';
import Utils from '../../../public/utils';
import AccEnable from '../acccard/events/AccEnable';
import LiaEnable from '../liacard/events/LiaEnable';
import { buttonClick, initTemplate, afterEvent,searchBtnClick,afterRowClick,doubleClick } from './events';
import './index.less';
const {setDefData, getDefData } = cardCache;
const { get } = cacheTools;
const {ExcelImport} = high;
let searchValue = {"conditions":[]};
class UserList extends Component {
    constructor(props) {
        super(props);
        this.state={
            usermigrate:{},
            usergroup:{},
            group:{},
            reforg:'',
            buttonstatus:true,
            imgModalShow:false,//签名图片框
            signImgUrl: '',//签名图片框
            cuserid: '',//签名图片框
            json:{},
            inlt:null,
            disableData:{},
            checkData:{},
            curDataValues:{},
            enableopr:true
        }
    }
    
    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log(未加载到多语资源);   // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源*/
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': 'user-001', 'domainName': 'uap', callback });
    }
    componentDidMount() {
        this.getData()
    }
    onChangea = (value) => {
        let that = this;
        that.setState({module:value})
    }
    onChangeb = (value) => {
        let that = this;
        that.setState({
            billtype:value
        })
    }
    getData = () => {
        
        let pageInfo = {pageIndex: 0,pageSize: "10"}
        let data = {
            pageInfo: pageInfo,
            querycondition: searchValue,
            pageCode: "101001CB_accbook",
            queryAreaCode:"accbook_search",  //查询区编码
            oid:"1001SS10000000000103",  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree',
            showDisable:this.state.checkValue?'1':'0'
        }
        //let data = this.props.getUrlParam('pk_accountingbook');
        //let data = this.props.search.getQueryInfo('accbook_search');
        if(data!=null){
            var that = this;
            ajax({
                data: {acc:data},
                url: '/nccloud/uapbd/accbook/listquery.do',
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        if("undefined" != typeof data){
                        for(var index in data.accbooklist.rows ){    
                            if(data.accbooklist.rows[index].values){
                                data.accbooklist.rows[index].values.showflag = {value:data.isShow};
                            }
                        }
                        that.props.table.setAllTableData('accbooklist', data&&data.accbooklist?data.accbooklist:{rows:[]});
                    }
                    }
                },
                error: function (res) {
                    toast({content:res.message,color:'danger'});
                }
            })
        }
    }
    handlePageInfoChangeFn = (props, config,pks,other) => {
        let _this = this;
        searchBtnClick(props,pks,false);
    };
    getusermigrate(data){
        const transMigrate = {
            key:data.key,
            value:data.value
        }
        this.setState({
            usermigrate: transMigrate
        })
    }
    getusergroup(data){
        const righttreedata = data;
        this.setState({
            usergroup: righttreedata
        })
    }
    getgroup(data){
        const rightgroupdata = data;
        this.setState({
            group:rightgroupdata
        });
    }
    getreforg(data){
        const reforg = data;
        this.setState({
            reforg :reforg
        });
    }
    getaccModal() {
        return (<div>
            <AccEnable
                disableData={this.state.disableData}
                checkData={this.state.checkData}
                enableopr={this.state.enableopr}
                changeCheck={this.changeCheck.bind(this)}
                multiJson={this.state.json}
                inlt={this.state.inlt}>
            </AccEnable>
        </div>)
    }
    getliaModal() {
        return (<div>
            <LiaEnable
                disableData={this.state.disableData}
                checkData={this.state.checkData}
                enableopr={this.state.enableopr}
                changeCheck={this.changeCheck.bind(this)}
                multiJson={this.state.json}
                inlt={this.state.inlt}>
            </LiaEnable>
        </div>)
    }
    changeCheck(field,val){
        let enableopr = this.state.enableopr;
        //启用操作：勾选设置为启用，取消勾选设置为原来的未启用或是已停用
        if(enableopr){
            this.state.checkData[field]['value'] = val?2:this.state.curDataValues[field]['value'];
        }else {
            //停用操作：勾选设置为停用，取消勾选设置为原来的启用
            this.state.checkData[field]['value'] = val?3:2;
        }
        this.setState({checkData:this.state.checkData});
    }
    
    render() {
        let { button,search,modal,table } = this.props;
        let { NCCreateSearch } = search;
        let { createButton, createButtonApp} = button;
        let { createModal } = modal;
        let { createSimpleTable } = table;
        let { NCDiv } = base;
        let { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
            <div className="nc-bill-list">
                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {/* {createPageIcon()} */}
                            <span>
                                {createBillHeadInfo({
                                    title: '核算账簿',
                                    initShowBackBtn: false
                                })}
                            </span>
                            {/* <h2 fieldid={`${this.state.json['1880000025-000024']}_title`} className="title-search-detail">{this.state.json['1880000025-000024']}</h2> */}
                        </div>
                        <div className="header-button-area">
                            
                            {this.props.button.createButtonApp({
                                area: 'header-button-area',
                                buttonLimit: 10, 
                                onButtonClick: buttonClick.bind(this), 
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area">
                    {NCCreateSearch('accbook_search', {
                        clickSearchBtn: searchBtnClick.bind(this),
                        showAdvBtn:true
                    })}
                </div>
                <div className="nc-bill-table-area">
                    {createSimpleTable('accbooklist', {
                        //dataSource: "uap.rbac.user.usercache",
                        //pkname: "cuserid",   
                        showCheck: true,                  
                        showIndex:true,
                        onAfterEvent: afterEvent,
                        onRowClick:afterRowClick,
                        onRowDoubleClick: doubleClick.bind(this),
                        handlePageInfoChange: this.handlePageInfoChangeFn
                    })}
                </div>
                {createModal('enableaccModal',{
                    userControl:true,
                    size:'300px',
                    content : this.getaccModal()						//内容
                })}
                {createModal('enableliaModal',{
                    userControl:true,
                    size:'300px',
                    content : this.getliaModal()						//内容
                })}
                {createModal('modal', {})}
                {createModal('newpsw', {})}
                {createModal('groupinnershare', {})}
                {createModal('groupjshare', {})}
                {createModal('usermigrate', {})}
                {/* 图片上传model */}
                
                <div>
                
                </div>
            </div>
        )
    }
}
UserList = createPage({
    initTemplate: initTemplate,
})(UserList);
export default UserList;




//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65