//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,table,createPageIcon} from 'nc-lightapp-front';
import SuppliersumeHead from '../component/suppliersumeHead';
import SuppliersumeTable from '../component/suppliersumeTable';
import NotifyModel from '../../supupgrade/component/notifymodel';
import SupplierInfo from '../../supupgrade/component/supplierinfo';
import './index.less'

const {NCMessage:Message} = base;
const urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do",
    queryCurrOrg : "/nccloud/uapbd/bankacc/querycurrorg.do",
    queryUrl:"/nccloud/uapbd/suppliersume/querylist.do",
    compareUrl:"/nccloud/uapbd/suppliersume/compare.do",
    mergeSave:"/nccloud/uapbd/suppliersume/sumesave.do",
    queryMessageUrl:"/nccloud/uapbd/suppliersume/querymessage.do"
}
let pageCode = '1317SUME_list',appid = '0001Z010000000002RDJ';
let curOrg={};
class SuppliersumeQueryList extends Component{
    constructor(props){
        super(props);
        this.config =  Object.assign({
            title:'',
            tableId:'supmerge',
            searchId:'queryCondition',
            pageCode:'1317SUME_list',
            headForm:{
                formId:'supmerge',
                pageCode:'1317SUME_form'
            },
            appid:'0001Z010000000002RDJ'//按钮注册
        },this.props.config);
        this.state = {
            curOrg:'',
            selectedRow:{},
            json:{},
            inlt:{}
        }

        let callback = (json,status,inlt)=> {
            this.state.json = json;//多语对象
            this.state.inlt = inlt;//用来处理占位符
            /* 国际化处理： 供应商合并*/
            this.config.title = this.state.json['1317SUME-000000'];
            this.state.title = this.state.json['1317SUME-000000'];

            this.initTemplate(this.props);
        }
        //加载多语文件
        this.props.MultiInit.getMultiLang({moduleId: '1317SUME',domainName: 'uapbd',callback});
        this.getCurrOrg = this.getCurrOrg.bind(this);
    }
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
                        /**
                         * 查询区参照处理
                         */
                        if(meta.queryCondition){
                            meta.queryCondition.items.forEach(item=>{
                                //item.isMultiSelectedEnabled = true;
                                if(['pk_target','source_org','operator','target_code'].includes(item.attrcode))
                                    item.isShowDisabledData=true;

                            });
                            /*meta.queryCondition.items.find(item=>{return item.attrcode=='pk_marbasclass.code'}).isShowUnit=true;
                            meta.queryCondition.items.find(item=>{return item.attrcode=='pk_srcmaterial.code'}).isShowUnit=true;*/
                        }
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setButtonVisible('Notify',false);
                    }
                    //设置当前登录人信息
                    if(data.context){
                        curOrg = data.context;
                    }
                    callback && callback();
                }
            }
        )
    }
    /**
     * 获取当前登录用户组织
     */
    getCurrOrg(){
        var me = this;
        let requestparam = {
            type:'org'
        }
        ajax({
            url: urls['queryCurrOrg'],
            data:requestparam,
            success: function (res) {
                if(res.success){
                    me.state.curOrg = {
                        refpk:res.data.pk_org,
                        refcode:res.data.code,
                        refname:res.data.name
                    };
                    me.setState(me.state);
                }
            }
        })
        console.log(this.state);
    }
    componentDidMount(){
        this.getCurrOrg();
        this.props.button.setDisabled({
            Notify:true
        });
    }
    /**
     * 查询按钮点击事件
     * @param props
     * @param val
     */
    onClickSearchBtn(props,val){
        //校验通过后，条件查询请求
        this.loadGridData((total)=>{
            this.props.button.setDisabled({
                Notify:false
            });
            total > 0 && toast({title:this.state.json['1317SUME-000010'],content:this.state.inlt.get('1317SUME-000022',{total:total}),color:'success'});/* 国际化处理： 已成功,查询成功,共,条*/
            total == 0 && toast({title:this.state.json['1317SUME-000011'],content:this.state.json['1317SUME-000023'],color:'warning'});/* 国际化处理： 请注意！,未查询出符合条件的数据*/
        });
    }
    //加载列表数据
    loadGridData = (callback)=>{
        let me = this;
        //获取查询区数据
        let searchData = me.props.search.getAllSearchData(me.config.searchId);
        //分页信息
        let pageInfo =  me.props.table.getTablePageInfo(me.config.tableId);
        let oid = me.props.meta.getMeta()[me.config.searchId].oid;
        let paramData = {
            querycondition:!searchData ? {}:searchData,
            pageInfo:pageInfo,
            queryAreaCode:me.config.searchId,
            oid:oid,
            querytype:'tree',
            userdefObj:{
                pk_org:me.state.curOrg.refpk,
                pageCode:me.config.pageCode
            }
        }

        ajax({
            url: urls['queryUrl'],
            data:paramData,
            success: function (res) {
                let { success, data ,formulamsg} = res;
                let total = 0;
                if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
                    me.props.dealFormulamsg(
                        formulamsg,
                        {
                            [me.config.tableId]:'grid'
                        }
                    );
                }
                if (success) {
                    if(data){
                        me.props.table.setAllTableData(me.config.tableId,data[me.config.tableId]);
                        total = data[me.config.tableId].rows.length;
                    }else{
                        let nulldata = {
                            rows:[]
                        }
                        me.props.table.setAllTableData(me.config.tableId,nulldata);
                    }
                    callback && callback(total);
                }
            }
        })
    }
    /**
     * 按钮点击事件
     * @param id
     */
    onButtonClick(props,id) {
        var me = this;
        switch (id.toLowerCase()) {
            case 'merge':
                let sourcesup = me.SuppliersumeHead.form.getFormItemsValue(me.config.headForm.formId,'pk_source');
                let targetsup = me.SuppliersumeHead.form.getFormItemsValue(me.config.headForm.formId,'pk_target');
                if(!sourcesup.value || !targetsup.value){
                    toast({content: me.state.json['1317SUME-000012'], color: 'warning'});/* 国际化处理： 源供应商或目的供应商不能为空*/
                    return;
                }
                if(sourcesup.value == targetsup.value){
                    toast({content: me.state.json['1317SUME-000013'], color: 'warning'});/* 国际化处理： 源供应商与目的供应商不能相同*/
                    return;
                }
                let requestParams={
                    pk_org:curOrg.pk_org || me.state.curOrg.refpk,
                    pk_source:sourcesup.value,
                    pk_target:targetsup.value
                }
                let formData = me.SuppliersumeHead.form.getAllFormValue(me.config.headForm.formId);
                formData.areacode = me.config.headForm.formId;
                let businessLogic = ()=>{
                    ajax({
                        url: urls['compareUrl'],
                        data: requestParams,
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                if(data){
                                    if(data["source"]&&data["target"]){
                                        let {source,target,souceOrgName,targetOrgName,sourcefinancelen,targetfinancelen,sourceStocklen,targetStocklen} = data;
                                        let i = 1;
                                        let num = 0;
                                        let data2 = [];
                                        /*
                                         *处理组织页签信息
                                         */
                                        if(source.supfinance||target.supfinance){
                                            let len = sourcefinancelen>=targetfinancelen?sourcefinancelen:targetfinancelen;
                                            for(num;num<len;num++){
                                                data2.push({ a: i,  b: me.state.json['1317SUME-000014'],/* 国际化处理： 供应商财务信息*/
                                                    c: source.supfinance && source.supfinance[i-1] ? source.supfinance[i-1].pk_org : '',
                                                    d: target.supfinance && target.supfinance[i-1] ? target.supfinance[i-1].pk_org : '',
                                                    key: i });
                                                i += 1;
                                            }
                                        }
                                        num=0;
                                        if(source.supstock||target.supstock){
                                            let len = sourceStocklen>=targetStocklen?sourceStocklen:targetStocklen;
                                            let j = 1;
                                            for(num;num<len;num++){
                                                data2.push({ a: i,  b: me.state.json['1317SUME-000015'],/* 国际化处理： 供应商采购信息*/
                                                    c: source.supstock && source.supstock[j-1] ? source.supstock[j-1].pk_org : '',
                                                    d: target.supstock && target.supstock[j-1] ? target.supstock[j-1].pk_org : '',
                                                    key: i });
                                                i += 1;
                                                j += 1;
                                            }
                                        }
                                        let formConfig = {
                                            data1 : [
                                                { a: me.state.json['1317SUME-000003'],b: source.code, c: target.code, key: '1' },/* 国际化处理： 供应商编码*/
                                                { a: me.state.json['1317SUME-000004'],b: source.name, c: target.name, key: '2' },/* 国际化处理： 供应商名称*/
                                                { a: me.state.json['1317SUME-000005'],b: source.name6, c: target.name6, key: '3' },/* 国际化处理： 供应商分类*/
                                                { a: me.state.json['1317SUME-000006'],  b: source.name5, c: target.name5, key: '4' },/* 国际化处理： 地区分类*/
                                            ],
                                            data2 : data2,
                                            title:{
                                                columns1:[' ',me.state.json['1317SUME-000001'],me.state.json['1317SUME-000002']],
                                                columns2:[' ',me.state.json['1317SUME-000007'],me.state.json['1317SUME-000008'],me.state.json['1317SUME-000009']]
                                            }
                                        }
                                        me.props.modal.show('modal',{
                                            title:me.state.json['1317SUME-000016'],/* 国际化处理： 供应商合并比较*/
                                            content:<SuppliersumeTable config={formConfig} />,
                                            userControl:true,
                                            beSureBtnClick:me.onSaveSys.bind(this,sourcesup.value,targetsup.value),
                                            cancelBtnClick:()=>{
                                                me.props.modal.close(`modal`);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
                me.SuppliersumeHead.validateToSave({model:formData,pageid:me.config.headForm.pageCode},businessLogic,{[me.config.headForm.formId]:'form'},'form');
                break;
            case 'notify':
                let selectedRow = me.state.selectedRow;
                if(!selectedRow || !selectedRow.pk_supmerge){
                    Message.create({content: me.state.json['1317SUME-000017'], color: 'warning'});/* 国际化处理： 请先选择指定的记录*/
                    return;
                }
                let modalConfig = {
                    queryMessageUrl:urls['queryMessageUrl'],
                    pk:selectedRow.pk_supmerge.value
                }
                me.props.modal.show('modal',{
                    noFooter:false,
                    userControl:true,
                    title:me.state.json['1317SUME-000018'],/* 国际化处理： 发送通知消息*/
                    leftBtnName:me.state.json['1317SUME-000019'],/* 国际化处理： 发送*/
                    rightBtnName:me.state.json['1317SUME-000020'],/* 国际化处理： 取消*/
                    content:<NotifyModel config={modalConfig} ref={(NotifyModel)=>{me.NotifyModel = NotifyModel}}/>,
                    beSureBtnClick:me.sendMessage.bind(this)
                });
                break;
        }
    }
    sendMessage(){
        var me = this;
        me.NotifyModel.sendMessage();
    }

    /**
     * 获取选中行
     * @param props
     * @param moduleId
     * @param record
     * @param index
     */
    clickRow(props, moduleId, record , index){
        this.state.selectedRow = record;
        this.setState(this.state);
    }
    onRowDoubleClick = (record,index)=>{
        var me = this;
        let config = {
            sourceorg:record.source_org,
            type:'1',
            pk:record.pk_supmerge.value,
            sourcesup:record.sourcesupplier.value
        }
        me.props.modal.show(`modal`,{
            noFooter:true,
            title:me.state.json['1317SUME-000080'],//多语  '源供应商基本信息'
            leftBtnName:me.state.json['1317SUME-000021'],/* 国际化处理： 关闭*/
            rightBtnName:'',
            content:<SupplierInfo config={config}/>
        });
    }
    /**
     * 供应商合并保存
     * @param sourcepk
     * @param targetpk
     */
    onSaveSys(sourcepk,targetpk){
        let data={
            pk_source:sourcepk,  //源客户
            pk_target:targetpk  //目的客户
        }
        ajax({
            url: urls['mergeSave'],
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    this.SuppliersumeHead.form.setFormItemsValue('supmerge',{
                        pk_source:{value:'',display:''},
                        pk_target:{value:'',display:''}
                    });
                    this.props.modal.close(`modal`);
                    //this.loadGridData();
                    if(data){
                        this.props.table.setAllTableData(this.config.tableId,data[this.config.tableId]);
                    }else{
                        let nulldata = {
                            rows:[]
                        }
                        this.props.table.setAllTableData(this.config.tableId,nulldata);
                    }
                }
            }
        });
    }
    render(){
        const {button,search,table,modal} = this.props;
        let { createModal } = modal;  //模态框
        const {NCCreateSearch} = search;
        const {createSimpleTable } = table;
        const {createButtonApp}=button;
        const{ BillHeadInfo}=this.props;
        const{ createBillHeadInfo}=BillHeadInfo
        const{ NCDiv} =base;
        return(
            <div className="nc-bill-list">
                {createModal('modal',{
                    noFooter:false
                })}
                 <NCDiv areaCode={NCDiv.config.HEADER} >
                    <div className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                    title: this.state.json['1317SUME-000000'],/* 国际化处理： 供应商合并 */
                                    initShowBackBtn: false
                            })}
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
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.config.searchId, {
                        clickSearchBtn: this.onClickSearchBtn.bind(this)
                    })}
                </div>
                <SuppliersumeHead ref={(SuppliersumeHead)=>{this.SuppliersumeHead = SuppliersumeHead}}/>
                <div className="card-area">
                    {createSimpleTable(this.config.tableId, {
                        showIndex:true,
                        onRowClick:this.clickRow.bind(this),
                        onRowDoubleClick:this.onRowDoubleClick.bind(this)
                    })}
                </div>
            </div>
        );
    }
}
/**
 * 创建页面
 */
export default SuppliersumeQueryList = createPage({
    //initTemplate:initTemplate
    billinfo:{
        billtype: 'grid',
        pagecode: pageCode,
        headcode: 'supmerge'
    }
})(SuppliersumeQueryList);
ReactDOM.render(<SuppliersumeQueryList/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65