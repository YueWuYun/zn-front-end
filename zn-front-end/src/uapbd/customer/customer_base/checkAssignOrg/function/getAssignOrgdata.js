//lUc5CHSpNnAZyHLbzFFHzMhAC6xmgjWTAO5zZsJlytMlt9Q3kuUJ31U1yMHsw1fY
import {ajax} from 'nc-lightapp-front';
export  default function (props, id, pk_customer, callback) {
    let {NODE_TYPE, pagecode} = props.config;
    ajax({
        url: '/nccloud/uapbd/customer/baseAction.do',
        data: {
            actionName: id,
            pk_customer: pk_customer.value,
            NODE_TYPE: NODE_TYPE,
            pagecode: pagecode,
            areacode: 'assignOrgtable'
        },
        success: (res) => {
            let {success, data} = res;
            if (success) {
                if (data) {
                    if(data['assignOrgtable']){
                        props.table.setAllTableData('assignOrgtable', data['assignOrgtable']);
                        callback && callback.call(this,data['assignOrgtable'].rows);
                    }else{
                        props.table.setAllTableData('assignOrgtable', {rows:[]});
                        callback && callback.call(this,[]);
                    }
                    props.form.setFormItemsValue('assignOrgCustInfo', {
                        'name': data['assignOrgtable'].rows[0].values['pk_customer.name'],
                        'code': data['assignOrgtable'].rows[0].values['pk_customer.code']
                    })
                }else{
                    props.table.setAllTableData('assignOrgtable', {rows:[]});
                    callback && callback.call(this,[]);
                }
                props.button.setButtonDisabled(['assignModalEnable', 'assignEnable','assignModalDisable'],true)
            }
        }
    })
}

//lUc5CHSpNnAZyHLbzFFHzMhAC6xmgjWTAO5zZsJlytMlt9Q3kuUJ31U1yMHsw1fY