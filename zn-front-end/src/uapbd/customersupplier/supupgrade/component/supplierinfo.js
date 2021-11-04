//VdGkeeUGfpITQgmLjgVjSKZzRiECuU74vpcWZg7jdfFGpT8rMt+CwqESGZ3eUYHk
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,cardTable} from 'nc-lightapp-front';
import UpgradeHeadForm from "./upgradeHead";
import SupBaseInfo from "./supbaseinfo";

var urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do",
    querySupBaseInfoUrl:"/nccloud/uapbd/customersupplier/querysupbaseinfo.do"
}
class SupplierInfo extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            upFormId:'supupgrade',
            baseFormId:'supplier_baseInfo',
            bankTableId:'supbankacc',
            linkTableId:'suplinkman',
            type:'0',//0--升级   1--合并
            countryTableId:'supcountrytaxes',
            sourceorg:{},
            //sourcecode:'',
            sourcesup:{}
        },this.props.config);
        this.state = {
            supplier:'',
            json:{},
            inlt:{}
        }
        this.initData = this.initData.bind(this);
        this.setBaseInfoData = this.setBaseInfoData.bind(this);
    }
    componentDidMount(){
        //this.initData();
        //this.setBaseInfoData();
    }
    componentWillReceiveProps(newProps){
        this.state.json = newProps.config.json || {};
        this.state.inlt = newProps.config.inlt || {};
        this.setState(this.state);
    }
    initData(templateid,callback){
        var me = this;
        let requestParams = {
            pk_supplier:me.config.sourcesup.pk_supplier,
            type:me.config.type,
            templateid:templateid,
            upTemplateid:me.state.upTemplateid,
            //templateid:me.SupBaseInfo.meta.getMeta().pageid,
            //pk:me.config.type == '0' ? me.config.sourcesup.pk_supupgrade : me.config.sourcesup.pk_supmerge
            pk:me.config.pk
        }
        ajax({
            url: urls['querySupBaseInfoUrl'],
            //async:false,
            data:requestParams,
            success: function (res) {
                let { success, data ,formulamsg} = res;
                if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
                    me.UpgradeHeadForm.dealFormulamsg(
                        formulamsg,
                        {
                            [me.config.upFormId]:'form'
                        }
                    );
                    me.SupBaseInfo.dealFormulamsg(
                        formulamsg,
                        {
                            [me.config.formId]:'form',
                            [me.config.tableId1]:'cardTable',
                            [me.config.tableId2]:'cardTable',
                            [me.config.tableId3]:'cardTable'
                        }
                    );
                }
                if(success){
                    let {billCard,supplierClassVo,head} = data;
                    let finalData = {
                        [me.config.baseFormId]:billCard.head[me.config.baseFormId],
                        [me.config.bankTableId]:billCard.bodys[me.config.bankTableId],
                        [me.config.linkTableId]:billCard.bodys[me.config.linkTableId],
                        [me.config.countryTableId]:billCard.bodys[me.config.countryTableId],
                        classVo:supplierClassVo
                    };
                    me.state.supplier = finalData;
                    me.setState(me.state,()=>{
                        me.UpgradeHeadForm.form.setAllFormValue({[me.config.upFormId]:head ? head[me.config.upFormId] : {rows:[]}});
                        me.setBaseInfoData();
                        if(callback)
                            callback();
                    });

                }
            }
        })
    }

    /**
     * 获取表头form templateID
     * @param templateid
     * @param callback
     */
    getUpFormTemplateid(templateid,callback){
        let me = this;
        me.state.upTemplateid = templateid;
        me.setState(me.state,()=>{
            callback && callback();
        });
    }
    /**
     * 根据供应商加载明细数据
     * @param data
     */
    setBaseInfoData(){
        var me = this;
        if(!me.SupBaseInfo)
            return;
        let data = me.state.supplier;
        //设置baseInfo表单数据
        me.UpgradeHeadForm.form.setFormStatus(me.config.upFormId,`browse`);
        me.UpgradeHeadForm.form.setFormItemsValue(me.config.upFormId,{
            sourceorg:me.config.sourceorg,
            sourcesup:{value:me.config.sourcesup.pk_supplier,display:me.config.sourcesup.code}
        });
        me.SupBaseInfo.form.setAllFormValue({[me.config.baseFormId]:data.supplier_baseInfo});
        if(data.supbankacc){
            me.SupBaseInfo.cardTable.setTableData(me.config.bankTableId,data.supbankacc);
        }else{
            me.SupBaseInfo.cardTable.setTableData(me.config.bankTableId,{rows:[]});
        }
        if(data.suplinkman){
            me.SupBaseInfo.cardTable.setTableData(me.config.linkTableId,data.suplinkman);
        }else{
            me.SupBaseInfo.cardTable.setTableData(me.config.linkTableId,{rows:[]});
        }
        if(data.supcountrytaxes){
            me.SupBaseInfo.cardTable.setTableData(me.config.countryTableId,data.supcountrytaxes);
        }else{
            me.SupBaseInfo.cardTable.setTableData(me.config.countryTableId,{rows:[]});
        }
    }
    render(){
        var me = this;
        //let {headConfig} = me.config;
        return(
            <div className="card-area" style={{overflow_y:'scroll'}}>
                <UpgradeHeadForm {...{initData:this.getUpFormTemplateid.bind(this)}} ref={(UpgradeHeadForm)=>{me.UpgradeHeadForm=UpgradeHeadForm}}/>
                {
                    me.state.upTemplateid &&
                    <SupBaseInfo {...{json:this.state.json,inlt:this.state.inlt,initData:this.initData}} ref={(SupBaseInfo)=>{me.SupBaseInfo=SupBaseInfo}}/>}
            </div>
        )
    }
}
export default SupplierInfo
//VdGkeeUGfpITQgmLjgVjSKZzRiECuU74vpcWZg7jdfFGpT8rMt+CwqESGZ3eUYHk