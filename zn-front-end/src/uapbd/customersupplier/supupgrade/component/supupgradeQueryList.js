//tXurG/613ScXWk6XMHx9dWkCaIJDzKuwugtaXUK70FBxOL4qnb7Ouk620e2aLxchJGBXcBo+Mf/P
//5ggEiou57Q==
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,table} from 'nc-lightapp-front';
import SupplierInfo from './supplierinfo';

const urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do",
    queryUrl:"/nccloud/uapbd/customersupplier/queryhistory.do"
}
let pageCode = '1317SUUG_supupgrade_querylist',appid = '0001Z010000000002950';
class SupupgradeQueryList extends Component{
    constructor(props){
        super(props);
        this.config =  Object.assign({
            title:'',
            tableId:'supupgrade',
            oid:'1018Z010000000006U5N',
            searchId:'queryCondition',
            pageCode:'1317SUUG_supupgrade_querylist',
            appid:'0001Z010000000002950'//按钮注册
        },this.props.config);
        this.state = {
            json:{},
            inlt:{}
        }

        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.initTemplate(this.props);
    }
    componentWillReceiveProps(newProps){
        this.state.json = newProps.json || {};
        this.state.inlt = newProps.inlt || {};
        this.setState(this.state);
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
                        /**
                         * 查询区参照处理
                         */
                        if(meta.queryCondition){
                            meta.queryCondition.items.forEach(item=>{
                                //item.isMultiSelectedEnabled = true;
                                if(['operator','destup.code','destup.pk_org'].includes(item.attrcode))
                                    item.isShowDisabledData=true;

                            });
                        }
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    callback && callback();
                }
            }
        )
    }
    /**
     * 查询按钮点击事件
     * @param props
     * @param val
     */
    onClickSearchBtn(props,val){
        //校验通过后，条件查询请求
        this.loadGridData();
    }
    //加载列表数据
    loadGridData = ()=>{
        let me = this;
        let queryInfo = me.props.search.getQueryInfo(me.config.searchId);
        let oid =  queryInfo.oid;
        //获取查询区数据
        let searchData = me.props.search.getAllSearchData(me.config.searchId);
        //分页信息暂时没什么用
        let pageInfo ={
            pageIndex:0,
            pageSize:10
        };
        let paramData = {
            querycondition:searchData,
            pageInfo:pageInfo,
            pageCode:me.config.pageCode,
            oid:oid || me.config.oid,
            queryAreaCode:me.config.searchId,
            querytype:'tree'
        }
        /*//查询区域未设置
        if(!searchData)
            paramData = {
                pageCode:me.config.pageCode,
                pageInfo:pageInfo
            };*/
        ajax({
            url: urls['queryUrl'],
            data:paramData,
            success: function (res) {
                let { success, data ,formulamsg} = res;
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
                        //多语  '已成功' `查询成功,共${data[me.config.tableId].rows.length}条。`
                        toast({title:me.state.json['1317SUUG-000025'],content:me.state.inlt.get('1317SUUG-000029',{total:data[me.config.tableId].rows.length}),color:'success'});
                        me.props.table.setAllTableData(me.config.tableId,data[me.config.tableId]);
                    }else{
                        let nulldata = {
                            rows:[]
                        }
                        me.props.table.setAllTableData(me.config.tableId,nulldata);
                        //多语   '请注意！' `未查询出符合条件的数据！`
                        toast({title:me.state.json['1317SUUG-000026'],content:me.state.json['1317SUUG-000032'],color:'warning'});
                    }
                }
            }
        })
    }
    /**
     * 按钮点击事件
     * @param id
     */
    onButtonClick(props,id) {

    }
    onRowDoubleClick = (record,index)=>{
        var me = this;
        let config = {
            sourceorg:record.sourceorg,
            pk:record.pk_supupgrade.value,
            type:'0',
            json:me.state.json,
            inlt:me.state.inlt,
            sourcesup:record.sourcesup.value
        }
        me.props.modal.show(`modal`,{
            noFooter:true,
            title:me.state.json['1317SUUG-000080'],//多语 '源供应商基本信息'
            leftBtnName:me.state.json['1317SUUG-000027'],//多语  '关闭'
            rightBtnName:'',
            content:<SupplierInfo config={config}/>
        });
    }
    render(){
        const {button,search,table,modal} = this.props;
        const {NCCreateSearch} = search;
        let { createModal } = modal;  //模态框
        const {createSimpleTable } = table;
        return(
            <div>
                {createModal('modal',{noFooter:false})}
                <div className="nc-singleTable-search-area" style={{paddingLeft:20}}>
                    {NCCreateSearch(this.config.searchId, {
                        clickSearchBtn: this.onClickSearchBtn.bind(this)
                    })}
                </div>
                <div className="card-area" style={{marginTop:10}}>{createSimpleTable(this.config.tableId, {
                    showIndex:true,
                    onRowDoubleClick:this.onRowDoubleClick
                })}</div>
            </div>
        );
    }
}
/**
 * 创建页面
 */
export default SupupgradeQueryList = createPage({
    //initTemplate:initTemplate
    billinfo:{
        billtype: 'grid',
        pagecode: pageCode,
        headcode: 'supupgrade'
    }
})(SupupgradeQueryList);
//tXurG/613ScXWk6XMHx9dWkCaIJDzKuwugtaXUK70FBxOL4qnb7Ouk620e2aLxchJGBXcBo+Mf/P
//5ggEiou57Q==