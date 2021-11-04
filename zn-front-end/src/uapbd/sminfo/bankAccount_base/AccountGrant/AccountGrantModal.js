//jJQG/0T4wAvy9xh4QkEXQCyWBpZDolOi8udM1bebzmas6OBGL2W1SFlR5vgo+0Ea
import React, { Component } from 'react';
import { createPage, base,ajax,toast} from 'nc-lightapp-front';
let { NCButton, NCModal} = base;
import OrgTypeSelector  from '../../../public/pubComponent/OrgtypeSelector';
var EMPTY_FN = function(){};
class AccountGrantModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
                // backdrop:false/"static"//是否弹出遮罩层/点击遮罩层是否触发关闭事件
            },
            json:props.json
        };
        this.multiJson = props.json;
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }

    componentWillReceiveProps(nextProps){
        if(Object.keys(nextProps.json).length !== 0 ){
            this.state.json = nextProps.json;
            this.setState(this.state);
        }
    }

    show(isGrant,isList){
        this.state.modal.show = true;
        this.props.config.isGrant = isGrant;
        this.props.config.isList = isList;
        this.setState(this.state, ()=>{
            this.orgSelect.reset('finance_info');
        });


    }

    onsubmit(){
        debugger
        let targetOrgIds = [];
        this.orgSelect.state.selectData.datas
        &&this.orgSelect.state.selectData.datas.map((item)=>{
            targetOrgIds.push(item['id']);
        });
        let isList = this.props.config.isList;
        let pk_list = [];
        let checkedrows = this.props.table.getCheckedRows(this.props.config.gridId);
        checkedrows&&checkedrows.map((obj)=>{
            pk_list.push(isList?obj.data.values.pk_bankaccbas.value:obj.data.values.pk_bankaccsub.value)
        });
        targetOrgIds.length===0?toast({
                'color':'danger',
                'content':this.multiJson['10140BANKACC-000000']/* 国际化处理： 请选择目标组织*/
            }):
            ajax({
                url:isList?'/nccloud/uapbd/bankacc/grantBankacc.do':'/nccloud/uapbd/bankacc/cardGrantBankacc.do',
                data:{
                    pk_list:pk_list,
                    targetOrgIds:targetOrgIds,
                    isGrant:this.props.config.isGrant,
                    isList:this.props.config.isList
                },
                success:(res)=>{
                    let{success,data} = res;
                    if(success){
                        if(data&&data.hasOwnProperty('message')){
                            toast({'color':'warning','title':data.message});
                            this.cancel();
                        }
                        else{
                            toast({
                                'color':'success',
                                'title':this.multiJson['10140BANKACC-000001']/* 国际化处理： 操作成功！*/
                            })
                            this.cancel();
                        }
                    }
                }
            });
    }
    cancel(){
        this.state.modal.show = false;
        this.setState(this.state);
    }
    render() {
        var modalCfg = {...this.state.modal}
        return (
            <NCModal {...modalCfg} onHide = {this.cancel.bind(this)} fieldid="accountGrant">
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.props.config.isGrant?this.multiJson['10140BANKACC-000002']:this.multiJson['10140BANKACC-000003']}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div><OrgTypeSelector ref={( item )=> this.orgSelect = item} {...this.props} {...{json:this.multiJson}} /></div>
                </NCModal.Body>
                <NCModal.Footer>

                    <NCButton fieldid = 'submit' onClick={ this.onsubmit.bind(this) }>{this.multiJson['10140BANKACC-000004']}</NCButton>
                    <NCButton fieldid = 'cancel' onClick={ this.cancel.bind(this) }>{this.multiJson['10140BANKACC-000005']}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }
}
export default AccountGrantModal;

//jJQG/0T4wAvy9xh4QkEXQCyWBpZDolOi8udM1bebzmas6OBGL2W1SFlR5vgo+0Ea