//5WDelIanR8BEnstFViPZJ422bqc28xJVomYiAEj+nJJTeejKVDEz0j4QfGmDxjFl
/**
 * 向导批改
 * @author yinshb
 */
import React, { Component } from 'react';
import { base,ajax,toast } from 'nc-lightapp-front';
let {  NCButton, NCModal } = base;
import  Utils from '../../../../public/utils';
import Batcheditform from './BatchEditForm';
var EMPTY_FN = function(){};

class Batcheditmodal extends Component {
    constructor(props) {
        super(props);
        this.tableConfig = props.tableConfig;
        this.url = props.url;
        this.state = {
            showForm : false,
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            tableItems : {},
            orgs : [],
            pks : [],
            permOrg : [],
            pk_group:''
        };
        this.onFinish = props.onFinish || EMPTY_FN;
    }

    show = (pks,orgs,permOrg) => {
        ajax({
            url : '/nccloud/uapbd/material/queryBatchUpdateTab.do',
            data : {mdId:this.tableConfig.mdId},
            success : (res) => {
                if(res.data && res.data.tab){
                    let meta = this.props.meta.getMeta();
                    let tableItems = {};
                    res.data.tab.forEach(element => {
                        let attrItems = [];
                        tableItems[element.code] = {
                            code : element.code,
                            name : element.name,
                            attrs : element.attrs,
                            pk_batchupdatetab : element.pk_batchupdatetab,
                            attrItems : attrItems
                        };
                        let requiredArr = ['intolerance','outtolerance','outcloselowerlimit'];
                        element.attrs.forEach(attr=>{
                            if(this.tableConfig.tableRelation[element.code] != null){
                                this.tableConfig.tableRelation[element.code].forEach(metaid=>{
                                    meta[metaid].items.forEach(item=>{
                                        if(item.attrcode === attr.code){
                                            let i = Utils.clone(item);
                                            i.visible = true;
                                            i.disabled = false;
                                            attr.name = item.label;
                                            if(requiredArr.indexOf(item.attrcode) > -1){
                                                i.required = true;
                                            }
                                            attrItems.push(i);
                                        }else if(this.tableConfig.specialItems[element.code] && this.tableConfig.specialItems[element.code] === item.attrcode){
                                            tableItems[element.code].special = Utils.clone(item);
                                            tableItems[element.code].special.visible = true;
                                            tableItems[element.code].special.disabled = false;
                                            tableItems[element.code].special.isMultiSelectedEnabled = true;
                                            if(element.code === 'plan_info'){
                                                tableItems[element.code].special.label = this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000156')/* 国际化处理： 所属业务单元*/;
                                            }
                                        }else if(attr.relatedattr){
                                            let relatedattr = attr.relatedattr.split(',');
                                            if(relatedattr.indexOf(item.attrcode) > -1){
                                                let i = Utils.clone(item);
                                                i.visible = true;
                                                i.disabled = false;
                                                attr.name = item.label;
                                                attrItems.push(i);
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    });
                    let hasPermOrg = [];
                    orgs.forEach(item=>{
                        if(permOrg.indexOf(item) > -1 && hasPermOrg.indexOf(item) === -1){
                            hasPermOrg.push(item);
                        }
                    });
                    this.state.tableItems = tableItems;
                    this.state.modal.show = true;
                    this.state.showForm = true;
                    this.state.orgs = orgs;
                    this.state.pks = pks;
                    this.state.permOrg = permOrg;
                    this.state.hasPermOrg = hasPermOrg;
                    this.setState(this.state);
                }
            }
        });
    }

    onsubmit = () => {
        let reqData = this.Batcheditform.getData();
        if(!reqData){
            return
        }
        let orgs = [];
        if(reqData.currTabKey == 'base_info'){
            this.state.orgs.forEach(item=>{
                if(this.state.permOrg.indexOf(item) > -1){
                    orgs.push(item);
                }
            });
        }else{
            orgs = this.state.orgs;
        }
        if(orgs.length === 0){
            toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000150')/* 国际化处理： 界面选中的数据中没有可供批改的记录！*/});
            return;
        }
        reqData.orgs = orgs;
        reqData.pks = this.state.pks;
        ajax({
            url : this.url,
            data : reqData,
            success : (res) => {
                this.state.modal.show = false;
                this.setState(this.state,()=>{this.onFinish(res);});
                let {data} = res;
                if(data && data.errorLogResult && data.errorLogResult.errorMsgs && data.errorLogResult.errorMsgs.length > 0){
                    let msg = '';
                    data.errorLogResult.errorMsgs.forEach(item=>{
                        msg = msg + item.errormsg;
                    });
                    toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:msg});
                }
            }
        })
    }

    render(){

        return (
            <NCModal {...this.state.modal} fieldid={'batchedit'}>
                <NCModal.Header closeButton={false}>
                    <NCModal.Title>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000109')/* 国际化处理： 快速批改*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div>{this.state.showForm && <Batcheditform tableItems={this.state.tableItems} ref={item=>this.Batcheditform=item} {...this.props} oprFlag={'directEdit'} hasPermOrg={this.state.hasPermOrg} orgs={this.state.orgs} pks={this.state.pks}/>}</div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton fieldid={'onsubmit'} onClick={ this.onsubmit }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000109')/* 国际化处理： 快速批改*/}</NCButton></span>
                    <NCButton fieldid={'cancel'} onClick={()=>{this.state.modal.show = false;this.setState(this.state);}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        )
    }

}

export default Batcheditmodal;
//5WDelIanR8BEnstFViPZJ422bqc28xJVomYiAEj+nJJTeejKVDEz0j4QfGmDxjFl