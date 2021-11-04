//9tv1g3IZkQWAa/BGFx3PX9FLsteZ3rbgBAc6nReCkiIbtGw+OEy8kHyKSUDdaYOL
export default function(props,status){
    if(status === 'add' || status==='copy' || status === 'create'){
        let SaveAdd=false,DataTemplet=false;
        if(status==='add'){
            SaveAdd = true;
            DataTemplet = true;
        }else if(status==='copy'){
            SaveAdd = true;
            DataTemplet = true;
        }else if(status === 'create'){
            SaveAdd = false;
            DataTemplet = false;
        }
        props.button.setButtonsVisible({
            Add : false,//新增
            Edit : false,//修改
            Save : true,//保存
            SaveAdd:SaveAdd,//保存新增
            Delete : false,//删除
            Cancel : true,//取消
            Refresh : false,//刷新
            Copy : false,//复制
            BatchUpdate : false,//批改
            BatchUpdateWizard : false,//向导批改
            BatchUpdateRuleTeam : false,//按规则批改
            Assign : false,//分配
            CancelAssign : false,//取消分配
            AssignWizard : false,//向导分配
            AssignStatus : false,//已分配组织查询
            assistantMenu : false,//辅助功能下拉按钮组
            CreateVersion : false,//创建新版本
            File : false,//附件管理
            OrgBrowse : false,//按组织查看
            QueryOrgDoc : false,//查看组织档案
            Associate : false, //申请单查询
            Enable:false,//启用
            Disable:false, //停用
            Print:false,//打印
            Upgrade : false,//升级
            convert_add:true,
            More:false,
            DataTemplet:DataTemplet
        });
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    }else if(status === 'edit'){
        props.button.setButtonsVisible({
            Add : false,//新增
            Edit : false,//修改
            Save : true,//保存
            SaveAdd:false,//保存新增
            Delete : false,//删除
            Cancel : true,//取消
            Refresh : false,//刷新
            Copy : false,//复制
            BatchUpdate : false,//批改
            BatchUpdateWizard : false,//向导批改
            BatchUpdateRuleTeam : false,//按规则批改
            Assign : false,//分配
            CancelAssign : false,//取消分配
            AssignWizard : false,//向导分配
            AssignStatus : false,//已分配组织查询
            assistantMenu : false,//辅助功能下拉按钮组
            CreateVersion : false,//创建新版本
            File : false,//附件管理
            OrgBrowse : false,//按组织查看
            QueryOrgDoc : false,//查看组织档案
            Associate : false, //申请单查询
            Enable:false,//启用
            Disable:false, //停用
            Print:false,//打印
            Upgrade:false,//升级
            convert_add:true,
            More:false,
            DataTemplet : false
        });
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    }else{
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        let pk_material = props.form.getFormItemsValue('material','pk_material');
        let enable = false, disable = false;
        if(!pk_material || !pk_material.value){
            props.button.setDisabled({
                Edit : true,
                Delete:true,
                Copy:true,
                Enable:true,
                Disable:true,
                CreateVersion:true,
                Associate:true,
                Assign : true,
                AssignStatus:true,
                File:true,
                Print:true,
                Output:true,
                Refresh:true,
                Upgrade:true,
                DataTemplet:false,
                BatchUpdate : true
            });
        }else{
            props.button.setDisabled({
                Edit : false,
                Delete:false,
                Copy:false,
                CreateVersion:false,
                Assign : false,
                AssignStatus:false,
                File:false,
                Print:false,
                Output:false,
                Refresh:false,
                Upgrade:false,
                BatchUpdate : false
            });
            let enablestate = props.form.getFormItemsValue('material','enablestate');
            if(enablestate){
                if(enablestate.value === '2'){
                    disable = true;
                    props.button.setDisabled({
                        Enable:true,
                        Disable:false
                    });
                }else{
                    enable = true;
                    props.button.setDisabled({
                        Enable:false,
                        Disable:true
                    });
                }
            }else{
                props.button.setDisabled({
                    Enable:true,
                    Disable:true
                });
            }
            let pk_material_pf = props.form.getFormItemsValue('material','pk_material_pf');
            if(!pk_material_pf || !pk_material_pf.value){
                props.button.setDisabled({
                    Associate:true
                });
            }else {
                props.button.setDisabled({
                    Associate:false
                });
            }
        }
        props.button.setButtonsVisible({
            Add : true,//新增
            Edit : true,//修改
            Save : false,//保存
            SaveAdd:false,//保存新增
            Delete : true,//删除
            Cancel : false,//取消
            Refresh : true,//刷新
            Copy : true,//复制
            BatchUpdate : true,//批改
            BatchUpdateWizard : true,//向导批改
            BatchUpdateRuleTeam : true,//按规则批改
            Assign : true,//分配
            CancelAssign : true,//取消分配
            AssignWizard : true,//向导分配
            AssignStatus : true,//已分配组织查询
            assistantMenu : true,//辅助功能下拉按钮组
            CreateVersion : true,//创建新版本
            File : true,//附件管理
            OrgBrowse : true,//按组织查看
            QueryOrgDoc : true,//查看组织档案
            Associate : true, //申请单查询
            Enable:enable,//启用
            Disable:disable, //停用
            Print:true,//打印
            Upgrade:true,//升级
            convert_add:false,
            More:true,
            DataTemplet:false,

            //子表按钮
            fi_head_delete: true,
            pfc_head_delete: true,
            pu_head_delete: true,
            sale_head_delete: true,
            stock_head_delete: true,
            plan_head_delete: true,
            prod_head_delete: true,
            cost_head_delete: true,
            pfccinfo_head_delete: true,
            
            fi_head_print: true,
            pfc_head_print: true,
            pu_head_print: true,
            sale_head_print: true,
            stock_head_print: true,
            plan_head_print: true,
            prod_head_print: true,
            cost_head_print: true,
            pfccinfo_head_print: true,

            fi_head_output: true,
            pfc_head_output: true,
            pu_head_output: true,
            sale_head_output: true,
            stock_head_output: true,
            plan_head_output: true,
            prod_head_output: true,
            cost_head_output: true,
            pfccinfo_head_output: true,

            fi_head_refresh: true,
            pfc_head_refresh: true,
            pu_head_refresh: true,
            sale_head_refresh: true,
            stock_head_refresh: true,
            plan_head_refresh: true,
            prod_head_refresh: true,
            cost_head_refresh: true,
            pfccinfo_head_refresh: true,
        });
        if(pk_material == null || pk_material.value == null || pk_material.value.length < 1){
            props.button.setButtonsVisible({
                Add : true,//新增
                Edit : false,//修改
                Save : false,//保存
                SaveAdd:false,//保存新增
                Delete : false,//删除
                Cancel : false,//取消
                Refresh : false,//刷新
                Copy : false,//复制
                BatchUpdate : false,//批改
                BatchUpdateWizard : false,//向导批改
                BatchUpdateRuleTeam : false,//按规则批改
                Assign : false,//分配
                CancelAssign : false,//取消分配
                AssignWizard : false,//向导分配
                AssignStatus : false,//已分配组织查询
                assistantMenu : false,//辅助功能下拉按钮组
                CreateVersion : false,//创建新版本
                File : false,//附件管理
                OrgBrowse : false,//按组织查看
                QueryOrgDoc : false,//查看组织档案
                Associate : false, //申请单查询
                Enable:false,//启用
                Disable:false, //停用
                Print:false,//打印
                Upgrade:false,//升级
                convert_add:false,
                More:false,
                DataTemplet:false,

                //子表按钮
                fi_head_delete: false,
                pfc_head_delete: false,
                pu_head_delete: false,
                sale_head_delete: false,
                stock_head_delete: false,
                plan_head_delete: false,
                prod_head_delete: false,
                cost_head_delete: false,
                pfccinfo_head_delete: false,
                
                fi_head_print: false,
                pfc_head_print: false,
                pu_head_print: false,
                sale_head_print: false,
                stock_head_print: false,
                plan_head_print: false,
                prod_head_print: false,
                cost_head_print: false,
                pfccinfo_head_print: false,

                fi_head_output: false,
                pfc_head_output: false,
                pu_head_output: false,
                sale_head_output: false,
                stock_head_output: false,
                plan_head_output: false,
                prod_head_output: false,
                cost_head_output: false,
                pfccinfo_head_output: false,

                fi_head_refresh: false,
                pfc_head_refresh: false,
                pu_head_refresh: false,
                sale_head_refresh: false,
                stock_head_refresh: false,
                plan_head_refresh: false,
                prod_head_refresh: false,
                cost_head_refresh: false,
                pfccinfo_head_refresh: false,
            });
        }
    }
}
//9tv1g3IZkQWAa/BGFx3PX9FLsteZ3rbgBAc6nReCkiIbtGw+OEy8kHyKSUDdaYOL