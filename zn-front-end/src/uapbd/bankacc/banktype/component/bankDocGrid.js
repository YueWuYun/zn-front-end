//B8VSNEVXa5j9HtWs3T8x00KpleBYubIgKVpb+oFanVcV414s/dJHkZAaop2ZxrHP
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,table,print,high,getBusinessInfo,createPageIcon} from 'nc-lightapp-front';
import Utils from "../../../public/utils";
import './index .less';

const { PrintOutput } = high;
const {NCCheckbox,NCBackBtn,NCMessage:Message,NCDiv} = base;
const urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do",
    queryUrl:"/nccloud/uapbd/bankacc/querybankdoc.do",
    print:"/nccloud/uapbd/bankacc/print.do"
}
let businessInfo = getBusinessInfo();
const appid = '0001Z010000000001932';
const pageCode = '10140BANK_bankdoc_querylist';
class BankDocGrid extends Component{
    constructor(props){
        super(props);
        this.config =  Object.assign({
            //title:'银行档案',
            pk_org:'GLOBLE00000000000000',
            enablestate:'2',
            tableId:'bankdoclist',
            searchId:'bankdoc_query',
            oid:'1002Z010000000000A15',
            pageCode:'10140BANK_bankdoc_querylist',
            appid:'0001Z010000000001932'//按钮注册
        },this.props.config);
        this.state = {
            checked:false,
            total:0,
            json:this.config.json || {},
            inlt:this.config.inlt || {},
            data:''//输出
        }
        this.loadGridData = this.loadGridData.bind(this);
        this.printPage = this.printPage.bind(this);
        this.initTemplate(this.props);
    }

    /**
     * 加载模板
     * @param props
     * @param callback
     */
    initTemplate = (props,callback)=>{
        props.createUIDom(
            {
                pagecode: pageCode//页面id
                //appid: appid//注册按钮的id
            },
            function (data){
                if(data){
                    if(data.template){
                        let meta = data.template;
                        modifyMeta(props,meta);
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtonVisible({
                            'Return':false
                        });
                        props.button.setButtons(button);
                        buttonStatus(props,true);
                    }
                    callback && callback();
                }
            }
        )
    }
    componentWillReceiveProps(newProps){
        let newConfig = newProps.config || {};
        this.state.json = newConfig.json;
        this.state.inlt = newConfig.inlt;
        this.setState(this.state);
    }
    componentDidMount(){
        //this.loadGridData('init');
        //解决tableUC下面没有适应的问题
        this.props.table.updateTableHeight();
    }
    /**
     * 查询按钮点击事件
     * @param props
     * @param val
     */
    onClickSearchBtn(props,val){
        //校验通过后，条件查询请求
        this.loadGridData(null,()=>{
            /*多语 已成功    多语 `查询成功,共${this.state.total}条。`*/
            this.state.total > 0 && toast({title:this.state.json['10140BANK-000006'],content:this.state.inlt.get('10140BANK-000009',{total:this.state.total}),color:'success'});
            /*多语 '请注意！'    多语 `未查询出符合条件的数据！`*/
            this.state.total == 0 && toast({title:this.state.json['10140BANK-000043'],content:this.state.json['10140BANK-000044'],color:'warning'});
        });
    }
    //加载列表数据
    loadGridData = (pks,callback)=>{
        let me = this;
        let searchData;
        //不能从meta直接获取查询模板id，目前meta里的oid是错误的
        //let oid = me.props.meta.getMeta()[me.config.searchId].oid;
        let queryInfo = me.props.search.getQueryInfo(me.config.searchId);
        let oid =  queryInfo.oid;
        //获取查询区数据
        searchData = me.props.search.getAllSearchData(me.config.searchId);
        if(!searchData)
            return;
        //分页信息
        let pageInfo =  me.props.table.getTablePageInfo(me.config.tableId);
        let paramData = {
            querycondition:searchData,
            pageInfo:pageInfo,
            queryAreaCode:me.config.searchId,
            oid:oid,
            querytype:'tree',
            userdefObj:{
                type:me.config.type,
                pk_org:me.config.pk_org,
                pageCode:me.config.pageCode,
                isShowOff:me.state.checked
            }
        }
        if(pks){
            paramData.userdefObj.pks = pks;
            paramData.userdefObj.total = me.state.total;
        }
        ajax({
            url: urls['queryUrl'],
            data:paramData,
            success: function (res) {
                let { success, data ,formulamsg} = res;
                if (success) {
                    if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
                        me.props.dealFormulamsg(
                            formulamsg,
                            {
                                [me.config.tableId]:'grid'
                            }
                        );
                    }
                    if(data){
                        //表格数据启用状态 123 转化true false
                        data[me.config.tableId].rows = Utils.convertGridEnablestate(data[me.config.tableId].rows);
                        me.state.queryData = data[me.config.tableId].rows;
                        me.props.table.setAllTableData(me.config.tableId,data[me.config.tableId]);
                        //手动记录点击查询结果集总数
                        if(!pks){
                            me.state.total = data[me.config.tableId].allpks.length;
                        }
                        buttonStatus(me.props,false);
                    }else{
                        let nulldata = {
                            rows:[],
                            pageInfo:{
                                pageIndex:0,
                                pageSize:10,
                                total:0,
                                totalPage:1
                            }
                        }
                        me.state.total = 0;
                        me.props.table.setAllTableData(me.config.tableId,nulldata);
                        buttonStatus(me.props,true);
                    }
                    me.setState(me.state,()=>{
                        callback && callback();
                    });
                }
            }
        })
    }
    /**
     * checkbox 选中事件
     */
    onCheckBoxClick(){
        //this.setState({checked:!this.state.checked});
    }
    /**
     * 启用停用change 事件
     */
    onCheckBoxChange(){
        this.state.checked = !this.state.checked;
        this.setState(this.state);
        this.loadGridData();
    }
    /*
    *按钮点击
    */
    onButtonClick(props,id) {
        var me = this;
        if(Array.isArray(props)){
            id = props[1];
        }
        switch (id.toLowerCase()) {
            case 'return':
                /*let returnPage;
                if(me.config.type == 'glb'){
                    returnPage = "/uapbd/bankacc/bankdoc_glb/main/index.html";
                }else if(me.config.type == "grp"){
                    returnPage = "/uapbd/bankacc/bankdoc_grp/main/index.html";
                }else{
                    returnPage = "/uapbd/bankacc/bankdoc_org/main/index.html";
                }
                props.linkTo(returnPage,{});*/
                if(me.config.returnCardPage)
                    me.config.returnCardPage.call();
                break;
            case 'print'://打印
                me.printPage.call('print');
                break;
            case 'output'://输出
                //me.printPage.call('output');
                let pks=[];
                let tableData = me.props.table.getAllTableData(me.config.tableId);
                tableData.rows.forEach((item)=>{
                    pks.push(item.values.pk_bankdoc.value);
                });
                if(pks.length == 0){
                    //Message.create({content: '请选择需要输出的记录', color: 'warning'});
                    toast({content:me.state.json['10140BANK-000007'],color: 'warning'});
                    return;
                }
                let config = {
                    funcode:'10140BANK',//功能节点编码
                    nodekey:'bankdoclist',//模板节点表示
                    billtype:'',//单据类型
                    oids:pks,
                    outputType:'output',
                    userjson:`{type:'list'}`
                }
                me.setState({
                    data:config
                },()=>{me.refs.printOutput.open()});
                break;
        }
    }
    printPage(flag){
        var me = this;
        let funcnode;

        switch(me.config.type){
            case 'glb':
                funcnode = '10140BANK';
                break;
            case 'grp':
                funcnode = '10140BANK';
                break;
            case 'org':
                funcnode = '10140BANK';
                break;
        }
        let pks=[];
        let tableData = me.props.table.getAllTableData(me.config.tableId);
        tableData.rows.forEach((item)=>{
            pks.push(item.values.pk_bankdoc.value);
        });
        if(pks.length == 0){
            //Message.create({content: '请选择需要打印的记录', color: 'warning'});
            toast({content:me.state.json['10140BANK-000008'], color: 'warning'});
            return;
        }
        if(flag){
            print(
                'pdf',//支持两种类型打印，‘html’模板打印  pdf--pdf打印
                urls['print'],
                {
                    funcode:funcnode,//功能节点编码
                    appcode:funcnode,
                    nodekey:'bankdoclist',//模板节点表示
                    billtype:'',//单据类型
                    oids:pks,
                    outputType:'output',
                    userjson:`{type:'list'}`
                }
            );
        }else{
            print(
                'pdf',//支持两种类型打印，‘html’模板打印  pdf--pdf打印
                urls['print'],
                {
                    funcode:funcnode,//功能节点编码
                    appcode:funcnode,
                    nodekey:'bankdoclist',//模板节点表示
                    billtype:'',//单据类型
                    oids:pks,
                    userjson:`{type:'list'}`
                }
            );
        }
    }
    /*************
     * 分页处理
     * ***********/
    handlePageInfoChange = (props,config,pks)=>{
        let me = this;
        let temp = pks.map((item)=>{
            return `'${item}'`;
        });
        me.loadGridData(temp.join(","));
    }
    render(){
        const {button,search,table,BillHeadInfo} = this.props;
        const {NCCreateSearch} = search;
        const {createSimpleTable } = table;
        const {createButtonApp}=button;
        const {createBillHeadInfo} = BillHeadInfo;

        return(
            <div className="nc-bill-list">
                <NCDiv fieldid={this.state.json['10140BANK-000000']} areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area">
                    <div id={'return'}>
                        <NCBackBtn className='title-search-detail' onClick={ this.onButtonClick.bind(this,[this.props,'Return']) }></NCBackBtn>
                    </div>
                    <div className="header-title-search-area">
                        {/*{createPageIcon()}
                        <h2 className="title-search-detail" fieldid={this.state.json['10140BANK-000000']+"_title"}>{this.state.json['10140BANK-000000']/*多语  银行档案*!/</h2>*/}
                        {createBillHeadInfo({title :this.state.json['10140BANK-000000'],initShowBackBtn:false})}
                        <span className="title-search-detail">
                                <NCCheckbox
                                    defaultChecked={false}
                                    checked={this.state.checked}
                                    onChange={this.onCheckBoxChange.bind(this)}
                                    onClick={this.onCheckBoxClick.bind(this)}
                                    size="lg" >
                                    {this.state.json['10140BANK-000012']/*多语  显示停用*/}
                                </NCCheckbox>
                        </span>
                    </div>
                    {/* 按钮组 btn-group*/}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.config.searchId, {
                        clickSearchBtn: this.onClickSearchBtn.bind(this)
                    })}
                </div>
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.config.tableId, {
                        showIndex:true,
                        handlePageInfoChange:this.handlePageInfoChange.bind(this)
                    })
                    }</div>
                <PrintOutput
                    ref='printOutput'
                    url= {urls['print']}
                    data={this.state.data}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
            </div>
        );
    }
}

/**
 * 按钮状态控制
 * @param props
 * @param status
 */
function buttonStatus(props,status){
    props.button.setDisabled({
        'Print':status || false,
        'output':status || false
    })
}
const modifyMeta = (props,meta)=>{
    meta['bankdoclist'].pagination = true;
    meta['bankdoc_query'].items.forEach((item)=>{
        if(item.attrcode == 'pk_org'){
            item.isMultiSelectedEnabled=true;
            item.queryCondition = {
                org:props.config.pk_org,
                TreeRefActionExt:'nccloud.web.uapbd.bankacc.action.BankdocListFilterOrg',
                type:props.config.type || 'glb'
            }
        }
        if("pk_banktype,pk_workcalendar,pk_country".includes(item.attrcode)){
            item.isMultiSelectedEnabled=true;
        }
        if(item.attrcode == "enablestate"){
            item.isMultiSelectedEnabled = true;
        }
    });
}
/**
 * 创建页面
 */
export default BankDocGrid = createPage({
    //initTemplate:initTemplate
    billinfo:{
        billtype: 'grid',
        pagecode: pageCode,
        headcode: 'bankdoclist'
    }
})(BankDocGrid);
//B8VSNEVXa5j9HtWs3T8x00KpleBYubIgKVpb+oFanVcV414s/dJHkZAaop2ZxrHP