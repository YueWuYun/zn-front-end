//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import{ajax, base,cardCache} from 'nc-lightapp-front';

import {oprButtonClick} from '../clickEvents';
let {setDefData, getDefData } = cardCache;
const urls = {
    "queryTemp" : "/platform/templet/querypage.do",
    "mergerequest" : "/nccloud/platform/pub/mergerequest.do",
};
import AccPeriodTreeGridRef from '../../../../../../uapbd/refer/pubinfo/AccPeriodTreeGridRef/index';
let {NCDatetimepick,NCDatePicker } = base;

const pagecodeValues = {
    'org' : '10100ORG_orgunit',
    'org_v' : '10100ORG_orgversion',
    'financeorg_v':'10100ORG_financeorgversion',
    'orgmanager':'10100ORG_orgmanager',
    'orgmoduleperiod':'10100ORG_orgmoduleperiod',
    'innercustsupp':'10100ORG_innercustsupp',
    'orgvatfunclet':'10100ORG_orgvatfunclet',
    'orgdept':'10100DEPT_orgdept',
};

export  default function(props,callback){
    let that = this;
    debugger
    let reqData = [
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['org_v']}\"\n}`,
            rqCode: 'org_v'
        },
        {
            rqUrl: urls['queryTemp'],
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues['org']}\"\n}`,
            rqCode: 'org'
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
            rqUrl: '/uapbd/org/isgroupadmin.do',
           // rqJson: `{\n  \"pagecode\": \"${pagecodeValues['orgdept']}\"\n}`,
            rqCode: 'usertype'
        },
        {
             rqUrl: '/platform/appregister/queryallbtns.do',
             rqJson: `{\n \"pagecode\": \"${props.config.pagecode}\",\n \"appcode\": \"${props.config.appcode}\"\n}`,
             rqCode: 'button'
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
            rqUrl: '/uapbd/org/haverootorgunit.do',
            rqCode: 'haverootorgunit'
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
        async:false,
        success : (res) => {
            //TODO
            console.log(res);
            // props.createUIDom({
            //     pagecode : props.config.pagecode
            //     //appid : props.config.appid
            //     //appcode:props.config.appcode,
            // },
            // (data)=>{
                debugger
                let meta = res.data.org;
                 //业务单元版本化
                 meta['org_v'] = res.data.org_v.org_v;
                 meta['orglist'] = res.data.org.orglist;
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
                 });
                 
                 //批量设置业务期初期间
                 meta['orgmoduleperiod'] = res.data.orgmoduleperiod.orgmoduleperiod;
                 //生成内部客商
                 meta['innercustsupp'] = res.data.innercustsupp.innercustsupp;
                 meta['innercustsupp'].items.map((obj)=>{
                    if(obj.attrcode == 'pk_org'){
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

                 //查询区域的负责人也需要组织和集团的过滤
                 meta['10100ORGSEARCH'].items.map((obj)=>{

                    if(obj.attrcode == 'chargeleader'){
                        obj.isShowUnit = true;
                        obj.isShowUsual = true;
                        obj.queryCondition=()=>{
                            return {
                                isMutiGroup:"Y"
                            }
                        }
                    }
                    if(obj.attrcode == 'principal' ){
                        obj.isShowUnit = true;
                        obj.isShowUsual = true;
                        obj.queryCondition=()=>{
                            return {
                                isMutiGroup:"Y"
                            }
                        }
                    }
                    if(obj.attrcode == 'pk_corp'){
                        //所属公司增加权限过滤
                        obj.queryCondition = function () {
                            return {
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                AppCode:props.config.appcode
                            }
                        }
                    }
                })

                 let buttonAry =[];
                 res.data.button.map((obj)=>{
                     if(obj.hasOwnProperty('area')&&obj.hasOwnProperty('key')&&obj.area ==='currency-opr-col'){
                         buttonAry.push(obj.key);
                     }
                 });
                 meta = modifierMeta(props, meta,buttonAry)
                 props.meta.setMeta(meta , () => {
                    res.data.button && props.button.setButtons(res.data.button, ()=>{
                        props.button.setPopContent('oprdel', props.config.josn['10100ORG-000091']); 
                        setDefData('orgunit_setroot',props.config.datasource,true);
                        // let queryInfo = props.search.getQueryInfo('10100ORGSEARCH');
                        //setDefData('orgunit_searchoid',props.config.datasource,queryInfo.oid);
                        
                        setDefData('orgunit_searchoid',props.config.datasource,meta['10100ORGSEARCH'].oid);
                       // cacheTools.set('orgunit_setroot',true);
                       // cacheTools.set('orgunit_searchoid',meta['10100ORGSEARCH'].oid);
                        
                        if('1' == res.data.usertype.usertype){
                            //如果是集团管理员,设置根节点才可以见
                            setDefData('orgunit_setroot',props.config.datasource,false);
                           // cacheTools.set('orgunit_setroot',false);
                            props.button.setButtonVisible(['setroot-2'],false);
                        }
                      
                        //刚进入小应用的时候，只能新增，其他按钮不能使用
                        var btns1 = ['enable','disable','auxiliary','version','printpage','back','delete','orgunitreldept','setadminorgroot','setcorproot','setorgroot'],
                            btns2 = ['orgmoduleperiod','createinnercustsupp','logomanage','editVAT','orgmanager','attachconfig','print','export'],
                            btns3 = ['financeorgversion','liabilitycenterversion','hrorgversion','adminorgversion'];
                        props.button.setButtonDisabled([...btns1, ...btns2],true); 
                        props.button.setButtonVisible(['edit','copy','save','saveadd'],false);
                        //当没有行政组织或者法人公司的时候，设置成根行政组织和设置成根法人公司不可用
                        setDefData('haveadminrootorgunit',props.config.datasource,res.data.haveadminrootorgunit);
                        setDefData('havecorprootorgunit',props.config.datasource,res.data.havecorprootorgunit);
                        setDefData('haverootorgunit',props.config.datasource,res.data.haverootorgunit);
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
                        callback();
                    });
                });
              
           // );
            //});
        }
    });
}




function modifierMeta(props, meta,buttonAry){
debugger
    let searchId = props.config.searchId;
    let gridId = props.config.gridId;
    //meta[gridId].status = 'browse';

    //添加超链接
    meta[gridId].items = meta[gridId].items.map((item,key)=>{
        //item.width = '120px';
        if (item.attrcode === 'code') {
            item.render = (text, record, index) => {
                return (
                    <span
                        style={{color: '#007ace', cursor: 'pointer' }}
                        onClick={() => {
                            //不需要强制查询数据库，如果有缓存就走缓存
                            let pk_org = record.values['pk_org'].value;
                            setDefData('orgunit_needquerydata_'+pk_org,props.config.datasource,false);
                            setDefData('orgunit_pk_org',props.config.datasource,pk_org);
                            setDefData('orgunit_code',props.config.datasource,record.values['code'].value);
                            setDefData('orgunit_name',props.config.datasource,record.values['name'].value);
                            setDefData('orgunit_shortname',props.config.datasource,record.values['shortname'].value);
                            setDefData('orgunit_pk_accperiodscheme',props.config.datasource,record.values['pk_accperiodscheme'].value);
                            setDefData('orgunit_btnopr',props.config.datasource,'linkedline');
                            props.pushTo('/card', {
                                status: 'browse',
                                pagecode:props.config.cardpagecode,
                                appcode:props.config.appcode,
                                pk_org: record.values['pk_org'].value//列表卡片传参
                            });
                        }}
                    >
						{record && record.values['code'] && record.values['code'].value}
					</span>
                );
            };
        }
        return item;

    });

    //添加操作列
    meta[gridId].items.push({
        attrcode: 'opr',
        label: props.config.josn['10100ORG-000093'],
        itemtype:'customer',
        width: '200px',
        fixed: 'right',
        className: 'table-opr',
        visible: true,
        render: (text, record, index) => {
            return props.button.createOprationButton(buttonAry, {
                area: 'currency-opr-col',
                buttonLimit: 3,
                onButtonClick:oprButtonClick.bind(this,record,index)
            });
        }
    });

    //业务期初期间设置会计期间为操作列
    meta['orgmoduleperiod'].items.push({
        attrcode: 'opr',
        label:  props.config.josn['10100ORG-000101'],
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
    return meta;
}
//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX