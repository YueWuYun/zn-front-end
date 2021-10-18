/*c5erdBQW3itEjvSgud8fYRM/DuuSQR2hwJqm8C7NZHhlp5MS2E+b0xyxFQuNbBbP*/
/**
 * 处理按钮的可见性
 * @param {*} props 界面内置对象
 */

import { 
	app_id, module_id, base_url, button_limit, oid, appcode,
	list_page_id,list_search_id, list_table_id,
	card_page_id,card_from_id,card_fromtail_id
} from '../../cons/constant.js';

export default function initButton(props) {
    //界面状态
    let islink = props.getUrlParam('islink');
    if(islink){
        props.button.setButtonVisible( [ 
            'file',
            'printdrop','printgroup','print','output',
            'refresh' 
        ], true );
        props.button.setButtonVisible( [
            'save','saveandadd','cancel',
            'add','edit','delete','copy',
            'enable', 'disable',
            'confirm','cancelconfirm','change','destroy',
            'frozendropbtn','frozengroup','frozen', 'defrozen',
        ], false );
    }else{
        //浏览
        if(props.getUrlParam('status') === 'browse'){
            let hideBtn = [
                'save','saveandadd','cancel',
                'enable', 'disable',
                'confirm','cancelconfirm','change','destroy',
                'frozendropbtn','frozengroup','frozen', 'defrozen'
            ];
            // 常用显示按钮 新增 修改 删除 复制 附件管理 预览 打印 输出
            let displayBtn = [ 'add','edit','delete','copy',
                            'file','print','output' ];
            
            // billstatus 确认标识 N=未确认，Y=已确认，C=变更待确认，  
            let billstatus =  props.form.getFormItemsValue( card_from_id, 'billstatus');
            // enablestate 停用标志 1=未启用，2=已启用，3=已停用，
            let enablestate =  props.form.getFormItemsValue( card_from_id, 'enablestate');
            // frozenflag 账户状态   0=正常，1=冻结，2=部分冻结，3=销户，
            let frozenflag =  props.form.getFormItemsValue( card_from_id, 'frozenflag');
            // acctype  账户类型  0=活期，1=协定，2=定期，3=通知，4=贷款，7=票据， 
            let acctype =  props.form.getFormItemsValue( card_from_id, 'acctype');
            
            if(props.getUrlParam('id')){
                // 4=贷款，7=票据
                if(acctype && (acctype.value == 4 || acctype.value == 7)){
                    //编辑状态：显示按钮：保存，保存新增，取消
                    // 已确认				
                    if (billstatus && billstatus.value === 'Y'){
                        // 已启用
                        if(enablestate && enablestate.value == 2){
                            props.button.setButtonVisible( [
                                'save','saveandadd','cancel',
                                'enable',
                                'confirm','destroy',
                                'frozendropbtn','frozengroup','frozen', 'defrozen',
                                'edit','delete'
                            ], false );
                            props.button.setButtonVisible( [
                                'add','copy','cancelconfirm','disable','change',
                                'file',
                                'printdrop','printgroup','print','output',
                                'refresh'
                            ], true );
                        }
                        // 未启用				
                        else{
                            props.button.setButtonVisible( [
                                'save','saveandadd','cancel',
                                'disable',
                                'confirm','destroy',
                                'frozendropbtn','frozengroup','frozen', 'defrozen',
                                'edit','delete'
                            ], false );
                            props.button.setButtonVisible( [
                                'add','copy','enable','cancelconfirm','change',
                                'file',
                                'printdrop','printgroup','print','output',
                                'refresh'
                            ], true );
                        }
                    }
                    // 变更待确认
                    else if (billstatus && billstatus.value === 'C'){
                        props.button.setButtonVisible( [
                            'save','saveandadd','cancel',
                            'edit','delete',
                            'enable', 'disable',
                            'cancelconfirm','change','destroy',
                            'frozendropbtn','frozengroup','frozen', 'defrozen'
                        ], false );
                        props.button.setButtonVisible( [
                            'add','copy','confirm',
                            'file',
                            'printdrop','printgroup','print','output',
                            'refresh'
                        ], true );
                    }
                    else{
                        // 待确认 已启用				
                        if(enablestate && enablestate.value == 2){
                            props.button.setButtonVisible( [
                                'save','saveandadd','cancel',
                                'enable', 'disable',
                                'cancelconfirm','change','destroy',
                                'frozendropbtn','frozengroup','frozen', 'defrozen'
                            ], false );
                            props.button.setButtonVisible( [
                                'add','edit','delete','copy','confirm',
                                'file',
                                'printdrop','printgroup','print','output',
                                'refresh'
                            ], true );
                        }else{
                            props.button.setButtonVisible( [
                                'save','saveandadd','cancel',
                                'enable', 'disable',
                                'cancelconfirm','change','destroy',
                                'frozendropbtn','frozengroup','frozen', 'defrozen'
                            ], false );
                            props.button.setButtonVisible( [
                                'add','edit','delete','copy','confirm',
                                'file',
                                'printdrop','printgroup','print','output',
                                'refresh'
                            ], true );
                        }
                    }
                }else{
                    // 已确认
                    if(billstatus && billstatus.value === 'Y'){
                        if(frozenflag && frozenflag.value){
                            if(frozenflag.value != 1 && frozenflag.value != 3){
                                props.button.setButtonVisible( [
                                    'save','saveandadd','cancel',
                                    'enable', 'disable',
                                    'confirm',
                                    'frozendropbtn','frozengroup','defrozen',
                                    'edit','delete'
                                ], false );
                                props.button.setButtonVisible( [
                                    'add','copy',
                                    'cancelconfirm', 'change', 'frozen', 'destroy',
                                    'file',
                                    'printdrop','printgroup','print','output',
                                    'refresh'
                                ], true );
                            }else if(frozenflag.value != 3){
                                props.button.setButtonVisible( [
                                    'save','saveandadd','cancel',
                                    'enable', 'disable','destroy',
                                    'confirm',
                                    'frozendropbtn','frozengroup','frozen',
                                    'edit','delete'
                                ], false );
                                props.button.setButtonVisible( [
                                    'add','copy',
                                    'cancelconfirm', 'defrozen', 'change',
                                    'file',
                                    'printdrop','printgroup','print','output',
                                    'refresh'
                                ], true );
                            }else{
                                props.button.setButtonVisible( [
                                    'save','saveandadd','cancel',
                                    'enable', 'disable',
                                    'frozendropbtn','frozengroup','frozen', 'defrozen',
                                    'confirm','destroy',
                                    'edit','delete'
                                ], false );
                                props.button.setButtonVisible( [
                                    'add','copy',
                                    'cancelconfirm', 'change',
                                    'file',
                                    'printdrop','printgroup','print','output',
                                    'refresh'
                                ], true );
                            }
                        }else{
                            props.button.setButtonVisible( [
                                'save','saveandadd','cancel',
                                'enable', 'disable',
                                'frozendropbtn','frozengroup','frozen', 'defrozen',
                                'confirm','destroy',
                                'edit','delete'
                            ], false );
                            props.button.setButtonVisible( [
                                'add','copy',
                                'cancelconfirm', 'change',
                                'file',
                                'printdrop','printgroup','print','output',
                                'refresh'
                            ], true );
                        }
                    }
                    // 变更待确认
                    else if (billstatus && billstatus.value === 'C'){
                        props.button.setButtonVisible( [
                            'save','saveandadd','cancel',
                            'edit','delete',
                            'enable', 'disable',
                            'cancelconfirm','change','destroy',
                            'frozendropbtn','frozengroup','frozen', 'defrozen'
                        ], false );
                        props.button.setButtonVisible( [
                            'add','copy','confirm',
                            'file',
                            'printdrop','printgroup','print','output',
                            'refresh'
                        ], true );
                    }
                    // 未确认
                    else{
                        props.button.setButtonVisible( [
                            'save','saveandadd','cancel',
                            'enable', 'disable',
                            'cancelconfirm','change','destroy',
                            'frozendropbtn','frozengroup','frozen', 'defrozen',
                            '',''
                        ], false );
                        props.button.setButtonVisible( [
                            'add','edit','delete','copy','confirm',
                            'file',
                            'printdrop','printgroup','print','output',
                            'refresh'
                        ], true );
                    }
                }
            }else{
                props.button.setButtonVisible( [
                    'save','saveandadd','cancel',
                    'enable',
                    'confirm','destroy',
                    'frozendropbtn','frozengroup','frozen', 'defrozen',
                    'edit','delete','copy','cancelconfirm','disable','change',
                    'file',
                    'printdrop','printgroup','print','output',
                    'refresh'
                ], false );
                props.button.setButtonVisible( [
                    'add'
                ], true );
                props.button.setMainButton(['add',], true);
            }
        }
        // 新增,编辑,复制，变更状态
        else{
            props.button.setButtonVisible( [ 'save','saveandadd','cancel' ], true );
            //编辑状态：显示按钮：保存，保存新增，取消
            props.button.setButtonVisible( [
                'add','edit','delete','copy',
                'enable', 'disable',
                'confirm','cancelconfirm','change','destroy',
                'frozendropbtn','frozengroup','frozen', 'defrozen',
                'file',
                'printdrop','printgroup','print','output',
                'refresh'
            ], false );
        }
    }
}

/*c5erdBQW3itEjvSgud8fYRM/DuuSQR2hwJqm8C7NZHhlp5MS2E+b0xyxFQuNbBbP*/