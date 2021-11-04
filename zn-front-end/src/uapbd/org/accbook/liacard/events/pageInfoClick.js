//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1
import { ajax } from 'nc-lightapp-front';
export default function (props, pk) {
    debugger;
    let data = {
        cuserid: pk,
        status: props.getUrlParam('status')
    };
    let that = this;
    ajax({
        data: data,
        url: '/nccloud/riaam/user/queryBypk.do',
        success: function (res) {
            let { success, data } = res;
            if (success) {
                that.props.form.setAllFormValue({ 'user': data.user.user });
                that.props.button.setButtonDisabled('disrole', data.isShow);
                that.setState({
                    istoprocessuser: data.istoprocessuser
                });
                that.props.table.setAllTableData('shareorglist', data.shareorglist && data.shareorglist.shareorglist ? data.shareorglist.shareorglist : { rows: [] });
                that.props.table.setAllTableData('userGroup', data.userGroup && data.userGroup.userGroup ? data.userGroup.userGroup : { rows: [] });
                that.props.button.setButtonVisible('enable', '3' === data.user.user.rows[0].values.enablestate.value ? true : false);
                that.props.button.setButtonVisible('disable', '3' === data.user.user.rows[0].values.enablestate.value ? false : true);
                that.props.button.setButtonVisible('unLock', data.user.user.rows[0].values.islocked.value ? true : false);
                that.props.button.setButtonVisible('lock', data.user.user.rows[0].values.islocked.value ? false : true);
                // alert(that.props.getUrlParam('status'));                 
                // if(that.props.getUrlParam('status')=="copy"){
                //     that.props.table.setAllTableData('shareorglist', {rows:[]});
                //     that.props.table.setAllTableData('userGroup', {rows:[]});
                //     that.props.form.setFormItemsValue('user',{
                //         'user_password':{value:null},
                //         'creator':{value:null,display:null},
                //         'creationtime':{value:null},
                //         'modifier':{value:null,display:null},
                //         'modifiedtime':{value:null},
                //         'disabledate':{value:null},
                //         'enablestate':{value:'2',display:this.state.json['1880000025-000004']},/* 国际化处理： 已启用*/
                //     })
                //     if(that.state.cur_pk_group!=data.user.user.rows[0].values.pk_group.value){
                //         props.form.setFormItemsValue('user',{
                //             'pk_org':{value:null,display:null},
                //             'pk_group':{value:null,display:null},
                //             'pk_usergroupforcreate':{value:null,display:null},
                //         })
                //     }
                // }else{
                // }
                // if(that.props.getUrlParam('status')=="browse"){

                // }

            }
        },
        error: function (res) {
            toast({ content: res.message, color: 'danger' });
        }
    });
}

//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1