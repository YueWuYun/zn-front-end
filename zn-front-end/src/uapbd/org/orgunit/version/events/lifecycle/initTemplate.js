//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import {ajax, base, toast,cacheTools} from 'nc-lightapp-front';

const {NCMenu } = base;

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

    'corpversion' : '10100ORG_corpversion',
    'orgversion' : '10100ORG_orgcardversion',
    'adminorgversion' : '10100ORG_adminorgversion',
    'assetorgversion' : '10100ORG_assetorgversion',
    'factoryversion' : '10100ORG_factoryversion',
    'financeorgversion' : '10100ORG_financeorgcardversion',
    'fundorgversion' : '10100ORG_fundorgversion',
    'hrorgversion' : '10100ORG_hrorgversion',
    'itemorgversion' : '10100ORG_itemorgversion',
    'liabilitycenterversion' : '10100ORG_liabilitycenterversion',
    'maintainorgversion' : '10100ORG_maintainorgversion',
    'planbudgetversion' : '10100ORG_planbudgetversion',
    'plancenterversion' : '10100ORG_plancenterversion',
    'purchaseorgversion' : '10100ORG_purchaseorgversion',
    'qccenterversion' : '10100ORG_qccenterversion',
    'saleorgversion' : '10100ORG_saleorgversion',
    'stockorgversion' : '10100ORG_stockorgversion',
    'trafficorgversion' : '10100ORG_trafficorgversion',
};


export  default function(props,callback){

    debugger
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




        {//获取辅助属性结构定义保存的卡片模板
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['corpversion']}\"\n}`,
            rqCode: 'corp_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['adminorgversion']}\"\n}`,
            rqCode: 'adminorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['assetorgversion']}\"\n}`,
            rqCode: 'assetorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['factoryversion']}\"\n}`,
            rqCode: 'factory_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['financeorgversion']}\"\n}`,
            rqCode: 'financeorgcard_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['fundorgversion']}\"\n}`,
            rqCode: 'fundorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['hrorgversion']}\"\n}`,
            rqCode: 'hrorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['itemorgversion']}\"\n}`,
            rqCode: 'itemorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['liabilitycenterversion']}\"\n}`,
            rqCode: 'liabilitycenter_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['maintainorgversion']}\"\n}`,
            rqCode: 'maintainorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['planbudgetversion']}\"\n}`,
            rqCode: 'planbudget_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['plancenterversion']}\"\n}`,
            rqCode: 'plancenter_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['purchaseorgversion']}\"\n}`,
            rqCode: 'purchaseorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['qccenterversion']}\"\n}`,
            rqCode: 'qccenter_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['saleorgversion']}\"\n}`,
            rqCode: 'salesorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['stockorgversion']}\"\n}`,
            rqCode: 'stockorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['trafficorgversion']}\"\n}`,
            rqCode: 'trafficorg_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['orgversion']}\"\n}`,
            rqCode: 'org_v'
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
                debugger
                let meta = res.data.org_v;
                //组织版本信息
                meta['org_v'] = res.data.org_v.org_v;
                meta['orgtype_v'] = res.data.org_v.orgtype_v;
                meta['orgunitversioninfo'] = res.data.org_v.orgunitversioninfo;           ;
                

                //法人公司
                meta['corp_v'] = res.data.corp_v.corp_v;
                meta['corpversionotherinfo'] = res.data.corp_v.corpversionotherinfo;
                meta['corpversionlinkinfo'] = res.data.corp_v.corpversionlinkinfo;
                //添加自定义参照
               
                //人力资源
                meta['hrorg_v'] = res.data.hrorg_v.hrorg_v;
                //财务组织
                meta['financeorgcard_v'] = res.data.financeorgcard_v.financeorgcard_v;
                //资金
                meta['fundorg_v'] = res.data.fundorg_v.fundorg_v;
                //采购
                meta['purchaseorg_v'] = res.data.purchaseorg_v.purchaseorg_v;
                //销售
                meta['salesorg_v'] = res.data.salesorg_v.salesorg_v;
                //库存
                meta['stockorg_v'] = res.data.stockorg_v.stockorg_v;
                meta['stocktrafficrelation_v'] = res.data.stockorg_v.stocktrafficrelation_v;
                meta['stockqccenterrelation_v'] = res.data.stockorg_v.stockqccenterrelation_v;
                meta['stockorgrelation_v'] = res.data.stockorg_v.stockorgrelation_v;
                meta['stockassetrelation_v'] = res.data.stockorg_v.stockassetrelation_v;
                //物流
                meta['trafficorg_v'] = res.data.trafficorg_v.trafficorg_v;
                //质检
                meta['qccenter_v'] = res.data.qccenter_v.qccenter_v;
                //资产
                meta['assetorg_v'] = res.data.assetorg_v.assetorg_v;
                meta['assetorgmaintainrelation_v'] = res.data.assetorg_v.assetorgmaintainrelation_v;
                //维修
                meta['maintainorg_v'] = res.data.maintainorg_v.maintainorg_v;
                meta['maintainstockrelation_v'] = res.data.maintainorg_v.maintainstockrelation_v;
                //利润中心
                meta['liabilitycenter_v'] = res.data.liabilitycenter_v.liabilitycenter_v;
                //项目
                meta['itemorg_v'] = res.data.itemorg_v.itemorg_v;
                meta['itemstockrelation_v'] = res.data.itemorg_v.itemstockrelation_v;
                //预算
                meta['planbudget_v'] = res.data.planbudget_v.planbudget_v;
                 //添加自定义参照

                //行政
                meta['adminorg_v'] = res.data.adminorg_v.adminorg_v;

                //工厂
                meta['factory_v'] = res.data.factory_v.factory_v;

                //计划中心
                meta['plancenter_v'] = res.data.plancenter_v.plancenter_v;
                
                      
                //组合原NC也去的单据模板关联关系
                meta['gridrelation'].corp_version=['corpversionotherinfo','corpversionlinkinfo'];//'corpaudioinfo'
                meta['gridrelation'].org_version=['orgtype_v','orgunitversioninfo'];//'corpaudioinfo'
                //meta['formrelation'].hrorg=['hrorgdef'];//'hrorgauditinfo'
                //meta['formrelation'].financeorg=['financeorgdef'];//'financeorgaudioinfo'
                //meta['formrelation'].fundorg=['fundorgdef'];//,'fundorgauditinfo'
                //meta['formrelation'].purchaseorg=['purchaseorgdef'];//,'purchaseorgauditinfo'
                meta['gridrelation'].saleorg_version=['saleorgrelation_v'];//'saleorgdef','saleorgaudit',
                meta['gridrelation'].stockorg_version=['stocktrafficrelation_v','stockqccenterrelation_v','stockorgrelation_v','stockassetrelation_v'];//'stockorgaudit','stockorgdef'
               // meta['formrelation'].trafficorg=['trafficorgdef'];//'trafficorgauditinfo',
                //meta['formrelation'].qccenter=['qccenterdef'];//'qccenterauditinfo',
                meta['gridrelation'].assetorg_version=['assetorgmaintainrelation_v'];//'assetorgauditinfo','assetorgdef'
                meta['gridrelation'].maintainorg_version=['maintainstockrelation_v'];//'maintainorgauditinfo','maintainorgdef'
                //meta['formrelation'].liabilitycenter=['liabilitycenterdef'];//'liabilitycenterauditinfo',
                meta['gridrelation'].itemorg_version=['itemstockrelation_v'];//'itemorgauditinfo','itemorgdefinfo'
               // meta['formrelation'].planbudget=['planbudgetdef'];//'planbudgetauditinfo',
                //meta['formrelation'].adminorg=['adminorgdef'];//'adminorgauditinfo',
                //meta['formrelation'].factory=['factorydefitem'];//'factoryauditinfo',
               // meta['formrelation'].plancenter=['plancenterdefiitem'];//,'plancenterauditinfo'
                // meta['formrelation'].materialpu=['pu_base','pu_audit'];
                // meta['formrelation'].marasstframe=['marasstframe_audit'];

                //组织信息
                meta['org'] = res.data.org.org;
                meta['orgtype'] = res.data.org.orgtype;  
                meta['orgversioninfo'] = res.data.org.orgversioninfo;       
                          ;
                
                
                //法人公司
                meta['corp'] = res.data.corp.corp;
                meta['corpcontactinfo'] = res.data.corp.corpcontactinfo;
                meta['corpaudioinfo'] = res.data.corp.corpaudioinfo;
                meta['corpotherinfo'] = res.data.corp.corpotherinfo;
                //添加自定义参照
            
                //人力资源
                meta['hrorg'] = res.data.hrorg.hrorg;
                meta['hrorgauditinfo'] = res.data.hrorg.hrorgauditinfo;
                meta['hrorgdef'] = res.data.hrorg.hrorgdef;
                //财务组织
                meta['financeorg'] = res.data.financeorg.financeorg;
                meta['financeorgaudioinfo'] = res.data.financeorg.financeorgaudioinfo;
                meta['financeorgdef'] = res.data.financeorg.financeorgdef;
                //资金
                meta['fundorg'] = res.data.fundorg.fundorg;
                meta['fundorgdef'] = res.data.fundorg.fundorgdef;
                meta['fundorgauditinfo'] = res.data.fundorg.fundorgauditinfo;
                //采购
                meta['purchaseorg'] = res.data.purchaseorg.purchaseorg;
                meta['purchaseorgdef'] = res.data.purchaseorg.purchaseorgdef;
                meta['purchaseorgauditinfo'] = res.data.purchaseorg.purchaseorgauditinfo;
                //销售
                meta['saleorg'] = res.data.saleorg.saleorg;
                meta['saleorgdef'] = res.data.saleorg.saleorgdef;
                meta['saleorgaudit'] = res.data.saleorg.saleorgaudit;
                meta['saleorgrelation'] = res.data.saleorg.saleorgrelation;
                //库存
                meta['stockorg'] = res.data.stockorg.stockorg;
                meta['stockorgaudit'] = res.data.stockorg.stockorgaudit;
                meta['stockorgdef'] = res.data.stockorg.stockorgdef;
                meta['stocktrafficrelation'] = res.data.stockorg.stocktrafficrelation;
                meta['stockqccenterrelation'] = res.data.stockorg.stockqccenterrelation;
                meta['stockorgrelation'] = res.data.stockorg.stockorgrelation;
                meta['stockassetrelation'] = res.data.stockorg.stockassetrelation;
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
               // meta['itemorgdefinfo'] = res.data.itemorg.itemorgdefinfo;
                meta['itemstockrelation'] = res.data.itemorg.itemstockrelation;
                //预算
                meta['planbudget'] = res.data.planbudget.planbudget;
                meta['planbudgetauditinfo'] = res.data.planbudget.planbudgetauditinfo;
                meta['planbudgetdef'] = res.data.planbudget.planbudgetdef;

                //行政
                meta['adminorg'] = res.data.adminorg.adminorg;
                meta['adminorgauditinfo'] = res.data.adminorg.adminorgauditinfo;
                meta['adminorgdef'] = res.data.adminorg.adminorgdef;
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


                 //批量设置业务期初期间
                 meta['orgmoduleperiod'] = res.data.orgmoduleperiod.orgmoduleperiod;
                 //生成内部客商
                 meta['innercustsupp'] = res.data.innercustsupp.innercustsupp;

                 //vat维护
                 meta['orgvatfunclet'] = res.data.orgvatfunclet.orgvatfunclet;
                 //
                 meta['orgdept'] = res.data.orgdept.orgdept;
                 
                 
                 
                //组合原NC也去的单据模板关联关系
                meta['formrelation'].corp=['corpcontactinfo','corpotherinfo'];//'corpaudioinfo'
                meta['formrelation'].org=['orgtype','orgversioninfo'];//'corpaudioinfo'
                //meta['formrelation'].hrorg=['hrorgdef'];//'hrorgauditinfo'
                //meta['formrelation'].financeorg=['financeorgdef'];//'financeorgaudioinfo'
                //meta['formrelation'].fundorg=['fundorgdef'];//,'fundorgauditinfo'
                //meta['formrelation'].purchaseorg=['purchaseorgdef'];//,'purchaseorgauditinfo'
                meta['formrelation'].saleorg=['saleorgrelation'];//'saleorgdef','saleorgaudit',
                meta['formrelation'].stockorg=['stocktrafficrelation','stockqccenterrelation','stockorgrelation','stockassetrelation'];//'stockorgaudit','stockorgdef'
               // meta['formrelation'].trafficorg=['trafficorgdef'];//'trafficorgauditinfo',
                //meta['formrelation'].qccenter=['qccenterdef'];//'qccenterauditinfo',
                meta['formrelation'].assetorg=['assetorgmaintainrelation'];//'assetorgauditinfo','assetorgdef'
                meta['formrelation'].maintainorg=['maintainstockrelation'];//'maintainorgauditinfo','maintainorgdef'
                //meta['formrelation'].liabilitycenter=['liabilitycenterdef'];//'liabilitycenterauditinfo',
                meta['formrelation'].itemorg=['itemstockrelation'];//'itemorgauditinfo','itemorgdefinfo'

                props.meta.setMeta(meta,()=>{
                    callback();
                });
               // data.button && props.button.setButtons(data.button);
                props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
                //props.button.setButtonVisible(['edit','delete','copy','save'],true);
                
            //});
        }
    });
}




//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX