//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1
import { ajax } from 'nc-lightapp-front';
export default function (props, pk) {
    debugger;
    let pageInfo = props.table.getTablePageInfo('userrole');
    pageInfo.pageIndex+=''
    let state = this.state.tabvalue == "5" ? 'AdminUserGroupDisplayValueObject' : 'AdminRoleGroupDisplayValueObject';
    let tabstate = (state != null ? [state] : null);
    // status: props.getUrlParam('status'),
    // 'state': tabstate,
    let data = {
        'pk_role': pk,
        'pageid': "10120ARM_card",
        
        'pageInfo': pageInfo
    };
    
    let _this = this;

    function loadDataByTableName(tablename, data, curr_props) {
        if (data != null) {
            curr_props.table.setAllTableData(tablename, data[tablename]);
        } else {
            curr_props.table.setAllTableData(tablename, { rows: [] });
        }
    }
    
 
    ajax({
        url: '/nccloud/rabc/role/detail.do',
        data:data,
        success: (res) => {
            if (res.success) {
                if (res.data != null) {
                    if (res.data.role && res.data.role != null) {
                        props.form.setAllFormValue({ 'role': res.data.role.role });
                    }
                    if (res.data.userrole != null) {
                        
                        loadDataByTableName('userrole', res.data.userrole.userrole, props);
                    }
                    if (res.data.FuncPermissionConfig != null) {
                        loadDataByTableName('FuncPermissionConfig', res.data.FuncPermissionConfig.FuncPermissionConfig, props);
                    }
                    if (res.data.SubjectOrg != null) {
                        loadDataByTableName('SubjectOrg', res.data.SubjectOrg.SubjectOrg, props);
                    }

                    if (res.data.adminorg != null) {
                        loadDataByTableName('adminorg', res.data.adminorg.adminorg, props, true);
                    }

                    if (res.data.AdminUserGroupDisplayValueObject != null) {
                        loadDataByTableName('AdminUserGroupDisplayValueObject', res.data.AdminUserGroupDisplayValueObject.AdminUserGroupDisplayValueObject, props, true);
                    }

                    if (res.data.AdminRoleGroupDisplayValueObject != null) {
                        loadDataByTableName('AdminRoleGroupDisplayValueObject', res.data.AdminRoleGroupDisplayValueObject.AdminRoleGroupDisplayValueObject, props, true);
                    }

                    if (res.data.fun_role_tree != null) {
                        if (res.data.fun_role_tree.fun_role_tree) {
                            props.syncTree.setSyncTreeData('fun_role_tree', res.data.fun_role_tree.fun_role_tree);
                        } else {
                            props.syncTree.setSyncTreeData('fun_role_tree', []);
                        }
                    }
                    if (res.data.adminresource != null) {
                        loadDataByTableName('adminresource', res.data.adminresource.adminresource, props, true);
                    }
                }
            }
        },
        error: (msg) => {
            toast({ content: msg.message, color: 'danger' });
        }
    });

}



//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1