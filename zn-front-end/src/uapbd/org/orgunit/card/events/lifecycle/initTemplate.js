//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import {ajax, base,cardCache,getBusinessInfo} from 'nc-lightapp-front';
import oprButtonClick from '../clickEvents/oprButtonClick';
import AccPeriodTreeGridRef from '../../../../../../uapbd/refer/pubinfo/AccPeriodTreeGridRef/index';
const {NCMenu,NCDatePicker } = base;
let {setDefData, getDefData } = cardCache;

const { Item } = NCMenu;

const urls = {
    "queryTemp" : "/platform/templet/querypage.do",
    "mergerequest" : "/nccloud/platform/pub/mergerequest.do",
};


const pagecodeValues = {
    'corp' : '10100ORG_corp',
    'org' : '10100ORG_orgunitcard',
    'adminorg' : '10100ORG_adminorg',
    'assetorg' : '10100ORG_assetorg',
    'factory' : '10100ORG_factory',
    'financeorg' : '10100ORG_financeorg',
    'fundorg' : '10100ORG_fundorg',
    'hrorg' : '10100ORG_hrorg',
    'itemorg' : '10100ORG_itemorg',
    'liabilitycenter' : '10100ORG_liabilitycenter',
    'maintainorg' : '10100ORG_maintainorg',
    'planbudget' : '10100ORG_planbudget',
    'plancenter' : '10100ORG_plancenter',
    'purchaseorg' : '10100ORG_purchaseorg',
    'qccenter' : '10100ORG_qccenter',
    'saleorg' : '10100ORG_saleorg',
    'stockorg' : '10100ORG_stockorg',
    'trafficorg' : '10100ORG_trafficorg',
    'org_v' : '10100ORG_orgversion',
    'financeorg_v':'10100ORG_financeorgversion',
    'orgmanager':'10100ORG_orgmanager',
    'orgmoduleperiod':'10100ORG_orgmoduleperiod',
    'innercustsupp':'10100ORG_innercustsupp',
    'orgvatfunclet':'10100ORG_orgvatfunclet',
    'orgdept':'10100DEPT_orgdept',
};


export  default function(props,callback){

    let reqData = [
        
        {//获取辅助属性结构定义保存的卡片模板
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['corp']}\"\n}`,
            rqCode: 'corp'
        },
        {//获取辅助属性结构定义保存的卡片模板
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['org']}\"\n}`,
            rqCode: 'org'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['adminorg']}\"\n}`,
            rqCode: 'adminorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['assetorg']}\"\n}`,
            rqCode: 'assetorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['factory']}\"\n}`,
            rqCode: 'factory'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['financeorg']}\"\n}`,
            rqCode: 'financeorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['fundorg']}\"\n}`,
            rqCode: 'fundorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['hrorg']}\"\n}`,
            rqCode: 'hrorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['itemorg']}\"\n}`,
            rqCode: 'itemorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['liabilitycenter']}\"\n}`,
            rqCode: 'liabilitycenter'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['maintainorg']}\"\n}`,
            rqCode: 'maintainorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['planbudget']}\"\n}`,
            rqCode: 'planbudget'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['plancenter']}\"\n}`,
            rqCode: 'plancenter'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['purchaseorg']}\"\n}`,
            rqCode: 'purchaseorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['qccenter']}\"\n}`,
            rqCode: 'qccenter'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['saleorg']}\"\n}`,
            rqCode: 'saleorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['stockorg']}\"\n}`,
            rqCode: 'stockorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['trafficorg']}\"\n}`,
            rqCode: 'trafficorg'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['org_v']}\"\n}`,
            rqCode: 'org_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['financeorg_v']}\"\n}`,
            rqCode: 'financeorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['orgmanager']}\"\n}`,
            rqCode: 'orgmanager'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['orgmoduleperiod']}\"\n}`,
            rqCode: 'orgmoduleperiod'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['innercustsupp']}\"\n}`,
            rqCode: 'innercustsupp'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['orgvatfunclet']}\"\n}`,
            rqCode: 'orgvatfunclet'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['orgdept']}\"\n}`,
            rqCode: 'orgdept'
        },
        {
             rqUrl: '/platform/appregister/queryallbtns.do',
             rqJson: `{\n \"pagecode\": \"${props.config.pagecode}\",\n \"appcode\": \"${props.config.appcode}\"\n}`,
             rqCode: 'button'
        },
        {
            rqUrl: '/uapbd/org/haverootorgunit.do',
            rqCode: 'haverootorgunit'
        },
        {
            rqUrl: '/uapbd/org/haveadminrootorgunit.do',
            rqCode: 'haveadminrootorgunit'
        },
        {
            rqUrl: '/uapbd/org/havecorprootorgunit.do',
            rqCode: 'havecorprootorgunit'
        },
        {
            rqUrl: '/platform/appregister/queryappcontext.do',
             rqJson: `{\n \"appcode\": \"${props.config.appcode}\"}`,
             rqCode: 'context'
        }
        
    ];
    ajax({
        url : urls['mergerequest'],
        data : reqData,
        success : (res) => {
            //TODO
            // console.log(res);
            // props.createUIDom({
            //     pagecode : props.config.pagecode
            //     //appid : props.config.appid
            //     //appcode: props.config.appcode,
            // },
            // (data)=>{
                
                let meta = res.data.org;

                //如果没有根节点的时候，上级业务单元设置为非必填项
                // if(!res.data.haverootorgunit){
                //     let pk_fatherorgitem = meta['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
                //     pk_fatherorgitem.required = false;
                //     pk_fatherorgitem.disabled = true;
                // }
                setDefData('orgunit_haverootorgunit',props.config.datasource,res.data.haverootorgunit);
                // meta['org'] = res.data.org.org;
                // meta['orgauditinfo'] = res.data.org.orgauditinfo;
                // meta['orgversioninfo'] = res.data.org.orgversioninfo;       
                // meta['orgtype'] = res.data.org.orgtype;            ;
                

                // //meta = modifierMeta(props, meta,values);
                // //处理物料辅助属性
                // if(res.data.MarAssistant && res.data.MarAssistant.MarAssistant){
                //     res.data.MarAssistant.MarAssistant.forEach((item,index) => {
                //         let it = {
                //             id:item.pk_userdefitem,
                //             name:item.showname
                //         }
                //         MarAssistant.push(it);
                //     });
                // }
                //暂时没有人员的参照，用这个替代一下，到时候在换复杂参照
                meta['org'].items.map((obj)=>{
                    //上级业务单元权限过滤
                    if(obj.attrcode == 'pk_fatherorg'){
                        //if(!getDefData('orgunit_setroot',props.config.datasource)){
                            obj.queryCondition = function () {
                                return {
                                    TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                    AppCode:props.config.appcode
                                }
                            }
                        //}
                    }
                    if(obj.attrcode == 'chargeleader'){
                        obj.isShowUnit = true;
                        obj.isShowUsual = true;
                        obj.unitCondition=()=>{
                            return {
                                isMutiGroup:"Y"
                            }
                        }
                    }
                    if(obj.attrcode == 'principal' ){
                        obj.isShowUnit = true;
                        obj.isShowUsual = true;
                        obj.unitCondition=()=>{
                            return {
                                isMutiGroup:"Y"
                            }
                        }
                    }
                    if(obj.attrcode == 'pk_corp'){
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:props.config.appcode
                            }
                        }
                    }
                })
                
                //法人公司
                meta['corp'] = res.data.corp.corp;
                meta['corpcontactinfo'] = res.data.corp.corpcontactinfo;
                meta['corpaudioinfo'] = res.data.corp.corpaudioinfo;
                meta['corpotherinfo'] = res.data.corp.corpotherinfo;
                meta['corpdefinfo'] = res.data.corp.corpdefinfo;
                //添加自定义参照
                meta['corp'].items.map((obj)=>{

                    
                    if(obj.attrcode == 'pk_fatherorg'){
                        //法人公司职能中上级公司需要跨集团
                        obj.isShowUnit = true;
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:props.config.appcode
                            }
                        }
                    }
                    if(obj.attrcode == 'industry'){
                        //经济行业
                        props.renderItem('form','corp', 'industry', null);
                        obj.queryCondition = function () {
                            return {
                                pk_defdoclist: '1009ZZ100000000034NN'
                            }
                        }
                    }
                    if(obj.attrcode == 'ecotype'){
                        //经济类型
                        props.renderItem('form','corp', 'ecotype', null);
                        obj.queryCondition = function () {
                            return {
                                pk_defdoclist: '1009ZZ100000000034NZ'
                            }
                        }
                    }
                    if(obj.attrcode == 'corptype'){
                        //单位类型
                        props.renderItem('form','corp', 'corptype', null);
                        obj.queryCondition = function () {
                            return {
                                pk_defdoclist: '1010ZZ10000000003NY1'
                            }
                        }
                    }
                    if(obj.attrcode == 'unitdistinction'){
                        //单位级别
                        props.renderItem('form','corp', 'unitdistinction', null);
                        obj.queryCondition = function () {
                            return {
                                pk_defdoclist: '1010ZZ10000000003OPT'
                            }
                        }
                    }
                })
                //人力资源
                meta['hrorg'] = res.data.hrorg.hrorg;
                meta['hrorgauditinfo'] = res.data.hrorg.hrorgauditinfo;
                meta['hrorgdef'] = res.data.hrorg.hrorgdef;
                meta['hrorg'].items.map((obj)=>{
                    
                    if(obj.attrcode == 'pk_fatherorg'){
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:props.config.appcode
                            }
                        }
                    }
                })
                //财务组织
                meta['financeorg'] = res.data.financeorg.financeorg;
                meta['financeorgaudioinfo'] = res.data.financeorg.financeorgaudioinfo;
                meta['financeorgdef'] = res.data.financeorg.financeorgdef;
                let businessInfo = getBusinessInfo();
                let pkGroup = businessInfo==null?null:businessInfo.groupId;
                meta['financeorg'].items.map((obj)=>{
                    
                    if(obj.attrcode == 'pk_costregion'){
                        //成本域增加集团过滤
                        props.renderItem('form','financeorg', 'pk_costregion', null);
                        obj.queryCondition = function () {
                            return {
                                pk_group: pkGroup
                            }
                        }
                    }
                })
                //资金
                meta['fundorg'] = res.data.fundorg.fundorg;
                meta['fundorgdef'] = res.data.fundorg.fundorgdef;
                meta['fundorgauditinfo'] = res.data.fundorg.fundorgauditinfo;
                meta['fundorg'].items.map((obj)=>{
                    
                    if(obj.attrcode == 'pk_fatherorg'){
                        obj.isShowUnit = true ;
                    }
                })
                //采购
                meta['purchaseorg'] = res.data.purchaseorg.purchaseorg;
                meta['purchaseorgdef'] = res.data.purchaseorg.purchaseorgdef;
                meta['purchaseorgauditinfo'] = res.data.purchaseorg.purchaseorgauditinfo;
                //销售
                meta['saleorg'] = res.data.saleorg.saleorg;
                meta['saleorgdef'] = res.data.saleorg.saleorgdef;
                meta['saleorgaudit'] = res.data.saleorg.saleorgaudit;
                meta['saleorgrelation'] = res.data.saleorg.saleorgrelation;
                meta['saleorg'].items.map((obj)=>{
                    
                    if(obj.attrcode == 'pk_fatherorg'){
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:props.config.appcode
                            }
                        }
                    }
                })
                //库存
                meta['stockorg'] = res.data.stockorg.stockorg;
                meta['stockorgaudit'] = res.data.stockorg.stockorgaudit;
                meta['stockorgdef'] = res.data.stockorg.stockorgdef;
                meta['stockassetrelation'] = res.data.stockorg.stockassetrelation;
                meta['stockorgrelation'] = res.data.stockorg.stockorgrelation;
                meta['stockqccenterrelation'] = res.data.stockorg.stockqccenterrelation;
                meta['stocktrafficrelation'] = res.data.stockorg.stocktrafficrelation;
                meta['stockorg'].items.map((obj)=>{
                    if(obj.attrcode == 'pk_financeorg'){
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:props.config.appcode
                            }
                        }
                    }
                })
                //物流
                meta['trafficorg'] = res.data.trafficorg.trafficorg;
                meta['trafficorgauditinfo'] = res.data.trafficorg.trafficorgauditinfo;
                meta['trafficorgdef'] = res.data.trafficorg.trafficorgdef;
                //质检
                meta['qccenter'] = res.data.qccenter.qccenter;
                meta['qccenterauditinfo'] = res.data.qccenter.qccenterauditinfo;
                meta['qccenterdef'] = res.data.qccenter.qccenterdef;
                //资产
                meta['assetorg'] = res.data.assetorg.assetorg;
                meta['assetorgauditinfo'] = res.data.assetorg.assetorgauditinfo;
                meta['assetorgdef'] = res.data.assetorg.assetorgdef;
                meta['assetorgmaintainrelation'] = res.data.assetorg.assetorgmaintainrelation;
                //维修
                meta['maintainorg'] = res.data.maintainorg.maintainorg;
                meta['maintainorgauditinfo'] = res.data.maintainorg.maintainorgauditinfo;
                meta['maintainorgdef'] = res.data.maintainorg.maintainorgdef;
                meta['maintainstockrelation'] = res.data.maintainorg.maintainstockrelation;
                //利润中心
                meta['liabilitycenter'] = res.data.liabilitycenter.liabilitycenter;
                meta['liabilitycenterauditinfo'] = res.data.liabilitycenter.liabilitycenterauditinfo;
                meta['liabilitycenterdef'] = res.data.liabilitycenter.liabilitycenterdef;
                //项目
                meta['itemorg'] = res.data.itemorg.itemorg;
                meta['itemorgauditinfo'] = res.data.itemorg.itemorgauditinfo;
                meta['itemorgdefinfo'] = res.data.itemorg.itemorgdefinfo;
                meta['itemstockrelation'] = res.data.itemorg.itemstockrelation;
                meta['itemorg'].items.map((obj)=>{
                    if(obj.attrcode == 'pk_fatherorg'){
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:props.config.appcode
                            }
                        }
                    }
                })
                //预算
                meta['planbudget'] = res.data.planbudget.planbudget;
                meta['planbudgetauditinfo'] = res.data.planbudget.planbudgetauditinfo;
                meta['planbudgetdef'] = res.data.planbudget.planbudgetdef;
                 //添加自定义参照
                 meta['planbudget'].items.map((obj)=>{
                    // if(obj.attrcode == 'datasource'){
                    //     //数据源
                    //     props.renderItem('form','corp_base', 'datasource', null);
                    //     obj.queryCondition = function () {
                    //         return {
                    //             pk_defdoclist: '1009ZZ100000000034NN',
                    //         }
                    //     }
                    // }
                })
                //行政
                meta['adminorg'] = res.data.adminorg.adminorg;
                meta['adminorgauditinfo'] = res.data.adminorg.adminorgauditinfo;
                meta['adminorgdef'] = res.data.adminorg.adminorgdef;
                meta['adminorg'].items.map((obj)=>{
                    
                    if(obj.attrcode == 'pk_fatherorg'){
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:props.config.appcode
                            }
                        }
                    }
                })
                //工厂
                meta['factory'] = res.data.factory.factory;
                meta['factoryauditinfo'] = res.data.factory.factoryauditinfo;
                meta['factorydefitem'] = res.data.factory.factorydefitem;
                //计划中心
                meta['plancenter'] = res.data.plancenter.plancenter;
                meta['plancenterdefiitem'] = res.data.plancenter.plancenterdefiitem;
                meta['plancenterauditinfo'] = res.data.plancenter.plancenterauditinfo;
                 //业务单元版本化
                 meta['org_v'] = res.data.org_v.org_v;
                 meta['org_v_head'] = res.data.org_v.org_v_head;
                 //财务组织版本化
                 meta['financeorg_v'] = res.data.financeorg_v.financeorg_v;
                 //组织主管
                 meta['orgmanager'] = res.data.orgmanager.orgmanager;
                 meta['orgmanager'].items.map((obj)=>{
                    if(obj.attrcode == 'cuserid'){
                        //经济类型
                       // props.renderItem('table','orgmanager', 'cuserid', null);
                        obj.isMultiSelectedEnabled = false;
                        obj.queryCondition = function () {
                            return {
                                GridRefActionExt: 'nccloud.web.org.orgunit.action.UserFilter'
                            }
                        }
                    }
                 })

                 //批量设置业务期初期间
                 meta['orgmoduleperiod'] = res.data.orgmoduleperiod.orgmoduleperiod;
                 //业务期初期间设置会计期间为操作列(同一列中某些列为日期，某些列为参照，平台不支持，只能变通，按照操作列的方式修改)
                meta['orgmoduleperiod'].items.push({
                    attrcode: 'opr',
                    label: props.config.josn['10100ORG-000101'],
                    itemtype:'customer',
                    width: '60px',
                    //fixed: 'right',
                    className: 'table-opr',
                    visible: true,
                    render: (text, record, index) => {
                        let moudleidnum = record.values.moduleid.value;
                        let arr = [
                            '4510',
                            '4530',
                            '4532',
                            '3613',
                            '3614',
                            '3615',
                            '3616',
                            '3617',
                            '3618',
                            '3632',
                            '3630',
                            '3634',
                            '3635',
                            '3637'
                        ];
                        var index = arr.indexOf(moudleidnum);
                        var pk_accperiodscheme = getDefData('orgunit_pk_accperiodscheme',props.config.datasource);
                        var timedata = record.values.pk_accperiod.value;

                        if (index >= 0) { //画日期
                            return (
                                <div style={{width:200}}>
                                    <NCDatePicker 
                                    value={timedata} 
                                    onChange={(value)=>{
                                        timedata = value;
                                        props.editTable.setValByKeyAndRowId('orgmoduleperiod',record.rowid,'pk_accperiod',{"value":timedata,"display":timedata});
                                    }}/>
                                </div>
                            )
                        } else { //refer
                            // if(record.values.pk_orgtype.value == 'STOCKORGTYPE00000000'){
                            //     ajax({
                            //         url: '/nccloud/uapbd/org/setaccperiodscheme.do',
                            //         data: {
                            //             pk_orgtype: record.values.pk_orgtype.display,
                            //             pk_org: record.values.pk_org.value,
                            //             moudleid: moudleidnum
                            //         },
                            //         success: (res) => {
                            //             if (res.success) {
                            //                 if (res.data) {
                            //                     pk_accperiodscheme =  res.data
                            //                 }
                            //             }
                            //         }
                            //     });
                            // }
                            
                            return (
                                <div style={{width:200}}>
                                    {AccPeriodTreeGridRef({
                                        value:{"refname":timedata,"refpk":timedata}, 
                                        onChange:(value)=>{
                                            timedata = value.refname;
                                            props.editTable.setValByKeyAndRowId('orgmoduleperiod',record.rowid,'pk_accperiod',{"value":timedata,"display":timedata});
                                        },
                                        queryCondition:() => {
                                            return {
                                                "pk_accperiodscheme": pk_accperiodscheme
                                            }
                                        }
                                    } )}
                                </div>
                                )
                        }        
                    }
                });
                 //生成内部客商
                 meta['innercustsupp'] = res.data.innercustsupp.innercustsupp;
                 meta['innercustsupp'].items.map((obj)=>{
                    if(obj.attrcode == 'pk_org'){
                        //经济类型
                       // props.renderItem('table','orgmanager', 'cuserid', null);
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.org.orgunit.action.InnercustOrgFilter'
                            }
                        }
                    }
                 })
                 //vat维护
                 meta['orgvatfunclet'] = res.data.orgvatfunclet.orgvatfunclet;
                 //
                 meta['orgdept'] = res.data.orgdept.orgdept;
                 
                 
                 
                //组合原NC也去的单据模板关联关系
                meta['formrelation'].corp=['corpotherinfo','corpcontactinfo','corpdefinfo','corpaudioinfo'];//'corpaudioinfo'
                meta['formrelation'].org=['orgtype','orgversioninfo','orgauditinfo'];//'corpaudioinfo','orgauditinfo'
                meta['formrelation'].hrorg=['hrorgdef','hrorgauditinfo'];//'hrorgauditinfo'
                meta['formrelation'].financeorg=['financeorgdef','financeorgaudioinfo'];//'financeorgaudioinfo'
                meta['formrelation'].fundorg=['fundorgdef','fundorgauditinfo'];//,'fundorgauditinfo'
                meta['formrelation'].purchaseorg=['purchaseorgdef','purchaseorgauditinfo'];//,'purchaseorgauditinfo'
                meta['formrelation'].saleorg=['saleorgdef','saleorgaudit'];//'saleorgdef','saleorgaudit',
                meta['formrelation'].stockorg=['stockorgdef','stockorgaudit'];//'stockorgaudit','stockorgdef'
                meta['formrelation'].trafficorg=['trafficorgdef','trafficorgauditinfo'];//'trafficorgauditinfo',
                meta['formrelation'].qccenter=['qccenterdef','qccenterauditinfo'];//'qccenterauditinfo',
                meta['formrelation'].assetorg=['assetorgdef','assetorgauditinfo'];//'assetorgauditinfo','assetorgdef'
                meta['formrelation'].maintainorg=['maintainorgdef','maintainorgauditinfo'];//'maintainorgauditinfo','maintainorgdef'
                meta['formrelation'].liabilitycenter=['liabilitycenterdef','liabilitycenterauditinfo'];//'liabilitycenterauditinfo',
                meta['formrelation'].itemorg=['itemorgdefinfo','itemorgauditinfo'];//'itemorgauditinfo','itemorgdefinfo'
                meta['formrelation'].planbudget=['planbudgetdef','planbudgetauditinfo'];//'planbudgetauditinfo',
                meta['formrelation'].adminorg=['adminorgdef','adminorgauditinfo'];//'adminorgauditinfo',
                meta['formrelation'].factory=['factorydefitem','factoryauditinfo'];//'factoryauditinfo',
                meta['formrelation'].plancenter=['plancenterdefiitem','plancenterauditinfo'];//,'plancenterauditinfo'
                // meta['formrelation'].materialpu=['pu_base','pu_audit'];
                // meta['formrelation'].marasstframe=['marasstframe_audit'];

                //设置编辑公式的billinfo
                props.setRelationItemBillinfo([
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_adminorg',
                        templetid: res.data.adminorg.pageid,
                        headcode: 'adminorg'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_adminorg',
                        templetid: res.data.adminorg.pageid,
                        headcode: 'adminorgdef'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_assetorg',
                        templetid: res.data.assetorg.pageid,
                        headcode: 'assetorg'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_assetorg',
                        templetid: res.data.assetorg.pageid,
                        headcode: 'assetorgdef'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_corp',
                        templetid: res.data.corp.pageid,
                        headcode: 'corp'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_corp',
                        templetid: res.data.corp.pageid,
                        headcode: 'corpcontactinfo'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_corp',
                        templetid: res.data.corp.pageid,
                        headcode: 'corpdefinfo'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_corp',
                        templetid: res.data.corp.pageid,
                        headcode: 'corpotherinfo'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_factory',
                        templetid: res.data.factory.pageid,
                        headcode: 'factory'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_factory',
                        templetid: res.data.factory.pageid,
                        headcode: 'factorydefitem'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_financeorg',
                        templetid: res.data.financeorg.pageid,
                        headcode: 'financeorg'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_financeorg',
                        templetid: res.data.financeorg.pageid,
                        headcode: 'financeorgdef'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_fundorg',
                        templetid: res.data.fundorg.pageid,
                        headcode: 'fundorg'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_fundorg',
                        templetid: res.data.fundorg.pageid,
                        headcode: 'fundorgdef'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_hrorg',
                        templetid: res.data.hrorg.pageid,
                        headcode: 'hrorg'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_hrorg',
                        templetid: res.data.hrorg.pageid,
                        headcode: 'hrorgdef'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_itemorg',
                        templetid: res.data.itemorg.pageid,
                        headcode: 'itemorg'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_itemorg',
                        templetid: res.data.itemorg.pageid,
                        headcode: 'itemorgdefinfo'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_liabilitycenter',
                        templetid: res.data.liabilitycenter.pageid,
                        headcode: 'liabilitycenter'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_liabilitycenter',
                        templetid: res.data.liabilitycenter.pageid,
                        headcode: 'liabilitycenterdef'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_maintainorg',
                        templetid: res.data.maintainorg.pageid,
                        headcode: 'maintainorg'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_maintainorg',
                        templetid: res.data.maintainorg.pageid,
                        headcode: 'maintainorgdef'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_orgunitcard',
                        templetid: res.data.org.pageid,
                        headcode: 'org'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_planbudget',
                        templetid: res.data.planbudget.pageid,
                        headcode: 'planbudget'
                    },
                    {
                        billtype: 'form',
                        pagecode: '10100ORG_planbudget',
                        templetid: res.data.planbudget.pageid,
                        headcode: 'planbudgetdef'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.plancenter.pageid,
                        pagecode: '10100ORG_plancenter',
                        headcode: 'plancenter'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.plancenter.pageid,
                        pagecode: '10100ORG_plancenter',
                        headcode: 'plancenterdefiitem'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.purchaseorg.pageid,
                        pagecode: '10100ORG_purchaseorg',
                        headcode: 'purchaseorg'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.purchaseorg.pageid,
                        pagecode: '10100ORG_purchaseorg',
                        headcode: 'purchaseorgdef'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.qccenter.pageid,
                        pagecode: '10100ORG_qccenter',
                        headcode: 'qccenter'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.qccenter.pageid,
                        pagecode: '10100ORG_qccenter',
                        headcode: 'qccenterdef'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.saleorg.pageid,
                        pagecode: '10100ORG_saleorg',
                        headcode: 'saleorg'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.saleorg.pageid,
                        pagecode: '10100ORG_saleorg',
                        headcode: 'saleorgdef'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.stockorg.pageid,
                        pagecode: '10100ORG_stockorg',
                        headcode: 'stockorg'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.stockorg.pageid,
                        pagecode: '10100ORG_stockorg',
                        headcode: 'stockorgdef'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.trafficorg.pageid,
                        pagecode: '10100ORG_trafficorg',
                        headcode: 'trafficorg'
                    },
                    {
                        billtype: 'form',
                        templetid: res.data.trafficorg.pageid,
                        pagecode: '10100ORG_trafficorg',
                        headcode: 'trafficorgdef'
                    }]);

                props.meta.setMeta(meta);
                res.data.button && props.button.setButtons(res.data.button);
                buttonToggleShow(props);

                var pk_org = props.getUrlParam('pk_org');

                
                if(getDefData('orgunit_setroot',props.config.datasource)){
                    
                    //如果是集团管理员,设置根节点才可以见
                    //当没有行政组织或者法人公司的时候，设置成根行政组织和设置成根法人公司不可用
                    let adminroot = res.data.haveadminrootorgunit;

                    if(!adminroot.haveroot){
                        props.button.setButtonDisabled(['setadminorgroot'],true);
                    }else{
                        if(pk_org == adminroot.pk){
                            //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                            props.button.setButtonDisabled(['setadminorgroot'],true);
                        }else{
                            props.button.setButtonDisabled(['setadminorgroot'],false);
                        }
                        
                    }

                    let corproot = res.data.havecorprootorgunit;
                    if(!corproot.haveroot){
                        props.button.setButtonDisabled(['setcorproot'],true);
                    }else{
                        if(pk_org == corproot.pk){
                            props.button.setButtonDisabled(['setcorproot'],true);
                        }else{
                            props.button.setButtonDisabled(['setcorproot'],false);
                        }
                        
                    }

                    let orgroot = res.data.haverootorgunit;

                    if(!orgroot.haveroot){
                        props.button.setButtonDisabled(['setorgroot'],true);
                    }else{
                        if(pk_org == orgroot.pk){
                            //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                            props.button.setButtonDisabled(['setorgroot'],true);
                        }else{
                            props.button.setButtonDisabled(['setorgroot'],false);
                        }
                        
                    }
                }else{
                    props.button.setButtonVisible(['setroot-2'],false);
                }

                // if(!res.data.haveadminrootorgunit){
                //     props.button.setButtonDisabled(['setadminorgroot'],true);
                // }else{
                //     props.button.setButtonDisabled(['setadminorgroot'],false);
                // }
                // if(!res.data.havecorprootorgunit){
                //     props.button.setButtonDisabled(['setcorproot'],true);
                // }else{
                //     props.button.setButtonDisabled(['setcorproot'],false);
                // }
                //props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
                //props.button.setButtonVisible(['edit','delete','copy','save'],true);
               callback();
            //});
        }
    });
}


function buttonToggleShow(props){
    let status = props.getUrlParam('status');
    //按钮的显示状态
    if(status === 'add'){
        props.button.setButtonVisible(['save','saveadd','cancel'],true);
        props.button.setButtonVisible(['edit','delete','copy','enable','disable','add','more'],false);
        props.button.setButtonVisible(['versions','auxiliary','orgunitreldept','printpage','setroot','back','refresh','setadminorgroot','setcorproot','setorgroot'],false);
    }else if(status ==='edit'){
        props.button.setButtonVisible(['save','cancel'],true);
        props.button.setButtonVisible(['edit','delete','copy','enable','disable','add','saveadd','more'],false);
        props.button.setButtonVisible(['versions','auxiliary','orgunitreldept','printpage','setroot','back','refresh','setadminorgroot','setcorproot','setorgroot'],false);
    }else{
        //设置根节点按钮，只有集团管理员登录才可以看见
        let setroot = getDefData('orgunit_setroot', props.config.datasource);//cacheTools.get('orgunit_setroot');
        props.button.setButtonVisible(['setroot-2'],setroot);
        props.button.setButtonVisible(['save','saveadd','cancel','back'],false);
        props.button.setButtonVisible(['edit','delete','copy','enable','disable','add','more'],true);
        props.button.setButtonVisible(['versions','auxiliary','orgunitreldept','printpage','refresh','setadminorgroot','setcorproot','setorgroot'],true);
    }
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX