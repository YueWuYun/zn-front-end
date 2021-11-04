//DOdSPdUS1w7hnMXER6Un8bwDo4sEH38Z7ipV39iBFuBaR6IFZuY8dAB4Yd6P85iG
//初始化模板适配
import {ajax, excelImportconfig} from 'nc-lightapp-front';
import  Util from '../../../../public/utils';
import {pageId, appcode, urls} from '../content';
import { headButton, shoulderButton } from '../../common/btnName'
export default function(props=this.props,callback) {
    Util.initPage(
        this.props,
        pageId,
        '10100CC',//多语资源编码
        (data)=>{ //拿到 模板数据 进行模板渲染
            if(data.button){
                let button = data.button;
                //适配导入导出功能
                let arr = [];
                //uapbd 模块名  uapbd_sgmenu 单据类型名 回调函数直接进行复制
                let excelimportconfig = excelImportconfig(props,'uapbd','costcenter');
                props.button.setUploadConfig( headButton.ImportData ,excelimportconfig);
                props.button.setButtons(button);
            };
            if(data.template){
                let meta = data.template;
                //所属利润中心加主组织权限
                let pk_profitcenter = meta['pk_group'].items.find(item => item.attrcode === 'pk_profitcenter');
                pk_profitcenter.queryCondition=()=>{
                    return {
                        AppCode:appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
                //所属工厂加主组织权限
                let pk_factory = meta['pk_group'].items.find(item => item.attrcode === 'pk_factory');
                pk_factory.queryCondition=()=>{
                    return {
                        AppCode:appcode,
                        GridRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
                //所属财务组织加主组织权限
                let pk_financeorg = meta['pk_group'].items.find(item => item.attrcode === 'pk_financeorg');
                pk_financeorg.queryCondition=()=>{
                    return {
                        AppCode:appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
                props.meta.setMeta(meta);
            }
            //如果个性化设置了默认业务单元，则自动带出主组织参照
            if(data.context&&data.context.pk_org){
                this.state.curOrg.pk_org=data.context.pk_org;
                this.state.curOrg.name=data.context.org_Name;
            };
            //维护root数据
            //自定义根节点
            this.root = {
                "isleaf": false,
                "key":"~",
                "title":this.state.json['10100CC-000000'],/* 国际化处理： 成本中心*/
                "id":"~",
                "innercode":"~",
                "pid": "",
                "refname": this.state.json['10100CC-000000'],/* 国际化处理： 成本中心*/
                "refpk": "~"
            };
        },
        ()=>{// 业务的回调方法 渲染模板后要做的操作
            let data = [Object.assign( {...this.root} , {children : null} )];
            this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
            //刚渲染完后 修改(headButton.Edit)，版本化(headButton.Version)， 导入(headButton.ImportData)/导出模板(headButton.ExportData)，刷新显示 ；
            // 新增(headButton.Add: 'uapbd_Add')， 新增保存(headButton.Save_add: 'uapbd_AddSave')， 取消( Cancel: 'uapbd_Cancel',//取消)隐藏
            this.props.button.setButtonsVisible({
                query:true,
                costcentergrp:true,
                import:true,
                refresh:true,
                cancel:false,
                [headButton.Save]: false,// save:false,
                [headButton.Save_add]: false,//saveAdd:false,
                [shoulderButton.AddCcdepts]: false,//addccdept:false,
                [shoulderButton.DelCcdepts]: false,//delccdept:false,
                [shoulderButton.AddCcwork]: false,//addccwork:false,
                [shoulderButton.DelCcwork]: false,//delccwork:false
                [shoulderButton.AddFeetype]: false,//addccwork:false,
                [shoulderButton.DelFeetype]: false,//delccwork:false
            });

            this.setButtonStatus();

            //如果个性化设置了默认业务单元，需要预加载所有数据
            ajax({
                url: urls['orgtypeqry'],
                data: {pk_org:this.state.curOrg.pk_org},
                success: (result) => {
                    if(result.success&&result.data){
                        this.onOrgChanged({
                            refpk:this.state.curOrg.pk_org,
                            refname:this.state.curOrg.name,
                            values:{
                                orgtype33:{
                                    value:(result.data['orgtype33']==true?'Y':'N')
                                },
                                orgtype15:{
                                    value:(result.data['orgtype15']==true?'Y':'N')
                                }
                            }
                        })
                    }
                }
            });
        },
        this
    );
}
//DOdSPdUS1w7hnMXER6Un8bwDo4sEH38Z7ipV39iBFuBaR6IFZuY8dAB4Yd6P85iG