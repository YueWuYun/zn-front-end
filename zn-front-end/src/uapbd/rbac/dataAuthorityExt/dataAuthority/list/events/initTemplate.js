//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { base, ajax,toast } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
let pageId = '10120DPA_dataperm';
export default function (props) {
    let meta = {};
    let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        if (status) {
            
                
                let discret_table_type = {
                        moduletype: 'table',
                        pagination: false,
                        code:'discret_table_type',
                        status: 'browse', //or edit
                        lineHeight: '40px',
                        showindex : true,
                        items: [
                            {
                                itemtype: 'input',
                                col: 4,
                                label: json['10120DPA-000022'],/* 国际化处理： 编码*/
                                maxlength: 20,
                                attrcode: 'code',
                                visible:true, 
                                disabled:true,
                            },
                            {
                                itemtype: 'input',
                                col: 4,
                                label: json['10120DPA-000023'],/* 国际化处理： 名称*/
                                maxlength: 20,
                                attrcode: 'name',
                                visible:true, 
                                disabled:true,
                            },
                            {
                                itemtype: 'input',
                                col: 4,
                                label: json['10120DPA-000024'],/* 国际化处理： 主键*/
                                maxlength: 20,
                                attrcode: 'pk',
                                visible:false, 
                                disabled:true,
                            }
                        ]
                    
                }
            props.createUIDom(
                {
                pagecode: pageId,
                // appcode:'10120DPA'
                },
                function (data) {
                if (data) {
                    if (data.template) {			
                    let meta = data.template;
                    modifierMeta(props, meta,json);//添加航操作
                    meta.discret_table_type=discret_table_type;//离散类型
                    props.meta.setMeta(meta);
                    }
                    if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setPopContent('main_delete_line',json['10120DPA-000025']);/* 国际化处理： 确认要删除该信息吗？*/
                    props.button.setPopContent('use_delete_line',json['10120DPA-000025']);/* 国际化处理： 确认要删除该信息吗？*/
                    }else{
                    props.button.setButtons(meta_btn.button);
                    props.button.setPopContent('main_delete_line',json['10120DPA-000025']);/* 国际化处理： 确认要删除该信息吗？*/
                    props.button.setPopContent('use_delete_line',json['10120DPA-000025']);/* 国际化处理： 确认要删除该信息吗？*/
                    }
                }
                }
            )
        } else {
            console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
        }
    }
    props.MultiInit.getMultiLang({ 'moduleId': '1012-dataauthority', 'domainName': 'uap', callback });

}

//添加表格操作列
function modifierMeta(props, meta, json) {
    //规则定义行操作
	let maintain_event = {
		label: json['10120DPA-000026'],/* 国际化处理： 操作*/
		attrcode: 'opr',
		itemtype: 'customer',
		visible:true,
		render: (text, record, index) => {
            let buttonAry = ["main_delete_line"];
            //获取新增和修改按钮的可用性，确定航操作按钮的显隐性
            // let table_status = props.editTable.getStatus('DataPermission_maintain');
            // if(table_status=='browse'){
            //     buttonAry = ["main_delete_line"];
            // }
			return props.button.createOprationButton(buttonAry,{
                                area: 'page_main_line',
                                buttonLimit: 2, 
                                onButtonClick: (props, key) => maintainButtonClick('DataPermission_maintain', props, key, text, record, index,json), 
                                // popContainer: document.querySelector('.body-button-area')
                    })
		}
	};
    meta['DataPermission_maintain'].items.push(maintain_event);
    //设置维护资源实体参照过滤条件
    meta['DataPermission_maintain'].items.map((item) => {
        if (item.attrcode == 'resourceid') {
            item.queryCondition={
                operationType:'0'
            };
            item.onlyLeafCanSelect=true;
        }
    })

    //规则定义行操作
	let use_event = {
		label: json['10120DPA-000026'],/* 国际化处理： 操作*/
		attrcode: 'opr',
		itemtype: 'customer',
		visible:true,
		render: (text, record, index) => {
            let buttonAry = ["use_delete_line"];
            //获取新增和修改按钮的可用性，确定航操作按钮的显隐性
            // let table_status = props.editTable.getStatus('DataPermission_use');
            // if(table_status=='browse'){
            //     buttonAry = ["use_delete_line"];
            // }
			return props.button.createOprationButton(buttonAry,{
                                area: 'page_use_line',
                                buttonLimit: 2, 
                                onButtonClick: (props, key) => maintainButtonClick('DataPermission_use',props, key, text, record, index, json), 
                                // popContainer: document.querySelector('.body-button-area')
                    })
		}
	};
    meta['DataPermission_use'].items.push(use_event);
    //设置使用资源实体参照过滤条件
    meta['DataPermission_use'].items.map((item) => {
        if (item.attrcode == 'resourceid') {
            item.queryCondition={
                operationType:'1'
            };
            item.onlyLeafCanSelect=true;
        }
    })
}

function maintainButtonClick(moduleId, props, key, text, record, index, json){
    //获取当前删除的动作行，如果历史数据将后台数据库删除，如果是新增数据将前台删除
    let pk_dataperm = record.values.pk_dataperm.value;
    if(pk_dataperm==null||pk_dataperm==''){
        props.editTable.deleteTableRowsByIndex(moduleId, index);
        let num = props.editTable.getNumberOfRows(moduleId);
        if(num==0){
            props.button.setButtonVisible({
                edit:false,
                save:false,
                cancel:false
            });
        }else{
            let table_status = props.editTable.getStatus(moduleId);
            if(table_status=='browse'){
                props.button.setButtonVisible({
                    edit:true,
                });
            }        
        }
        toast({color:"success"})
        return;
    }
    //手动设置为删除状态
    record.status='3';
    //record.values.status.value='3';
    delete record.values.option;
    let data = {
        gridModel:{rows:[record]},
        userdata:{
            moduleid:moduleId
            }
        }
    ajax({
        loading: true,
        url: '/nccloud/rbac/permission/SavePermission.do',
        data: data,
        success: function (res) {
            if (res.success) {
                if(res.data){
                    props.editTable.deleteTableRowsByIndex(moduleId, index);
                    let num = props.editTable.getNumberOfRows(moduleId);
                    if(num==0){
                        props.button.setButtonVisible({
                            edit:false,
                            save:false,
                            cancel:false
                        });
                    }else{
                        let table_status = props.editTable.getStatus(moduleId);
                        if(table_status=='browse'){
                            props.button.setButtonVisible({
                                edit:true,
                            });
                        }      
                    }
                    //刷新数据
                    let reflesh_date = props.editTable.getAllData(moduleId);
                    props.editTable.setTableData(moduleId,reflesh_date);
                    //使用权规则删除后，此角色关联的用户针对此实体的数据使用权可能需要3-5分钟才能生效
                    toast({ color: 'success', content: json['10120DPA-000027'] });/* 国际化处理： 使用权规则删除后，数据使用权可能需要3-5分钟才能生效！*/
                }else{
                    
                }
            } else {
                toast({color:"danger",content:res.message})
            }
        }
    });

}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX