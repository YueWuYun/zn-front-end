//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { createPage, output,ajax, base, toast, cardCache,promptBox,print } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache, getNextId, deleteCacheById, getCurrentLastId } = cardCache;
export default function buttonClick(props, id) {
    let tableId = 'formatdoccard';
    let formId = 'formatdocform';
    let curr_this = this;
     
    let data = props.form.getAllFormValue(formId);
    let pk = data.rows[0].values.pk_formatdoc.value;
    let pk_url = props.getUrlParam('pk');//url 上的id ，单据的主键
    let dataSource = 'uapbd.pub.formatdocdata.cache';  
    switch (id) {
        case 'add':
            this.page_type = 'add';
            curr_this.props.form.EmptyAllFormValue(formId)
            curr_this.props.editTable.setTableData(tableId, { rows: [] });
            curr_this.props.form.setFormStatus(formId, 'add');
            curr_this.setState({
                backbtnstatus: 'none'
            })
            curr_this.props.button.setButtonsVisible({
                add: false,
                editor: false,
                del: false,
                save: true,
                cancel: true,
                print: false,
            });
            break;
        case 'editor':
            if (!pk) {
                toast({ content: this.state.json['xi-exsystem-000005'], color: 'warning' })/* 国际化处理： 编辑失败：没有可以编辑的数据*/
                return;
            }
            this.page_type = 'edit';
            props.form.setFormStatus(formId, 'edit');
            props.editTable.setStatus('formatdocform', 'edit');
            curr_this.setState({
                backbtnstatus: 'none'
            })
            curr_this.props.button.setButtonsVisible({
                add: false,
                editor: false,
                del: false,
                save: true,
                cancel: true,
                print: false,
            });
            break;

        case 'del':
            if (!pk) {
                toast({ content: this.state.json['xi-exsystem-000006'], color: 'warning' })/* 国际化处理： 删除失败：没有可以删除的数据*/
                return;
            }
            let data = {
                pk_formatdoc: pk,
            }
            debugger;
            promptBox({
				color: 'warning',
				title: this.state.json['xi-exsystem-000007'],/* 国际化处理： 删除*/
				content: this.state.json['xi-exsystem-000008'],/* 国际化处理：  确定删除所选数据吗？*/
				beSureBtnClick: () => {
                    ajax({
                        url: '/nccloud/uapbd/formatdoc/formatdocDelete.do',
                        data: data,
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                 
                                let nextId = getNextId(pk, dataSource);
                                deleteCacheById('pk_formatdoc', pk, dataSource);
                                if (!nextId || nextId == null) {
									setTimeout(() => {
                                        curr_this.props.form.EmptyAllFormValue('formatdocform');
                                        //curr_this.props.editTable.setTableData('formatdoccard',  { rows: [] });
									}, 0)
                                    curr_this.props.button.setButtonsVisible({
                                        add: true,
                                        editor: true,
                                        del: true,
                                        print: true,
                                        save: false,
                                        cancel: false
                                    });
								} else {
									curr_this.getData2(nextId);
								}
								toast({ color: 'success' });
                            }
                        },
                        error: (res) => {
                            toast({ content: this.state.json['xi-exsystem-000009'] + res.message, color: 'danger' })/* 国际化处理： 删除失败：*/
                        }
                    });
				}
			});

            break;
        case 'save':
            if (!this.page_type) {
                this.page_type = props.getUrlParam('status');
            }
            if (!props.form.isCheckNow('formatdocform')){
                return;
            }
            let table_data = this.props.editTable.getAllData(tableId);
            // let CardData = this.props.createMasterChildData('12210704_card', formId, tableId);
            let form_data = props.form.getAllFormValue(formId);
            let rowdata = this.props.editTable.getChangedRows(tableId, false);
            // let flag = this.props.editTable.checkRequired(tableId, rowdata);
            // if (!flag) {
            //     return;
            // }
            let alldata = {
                data: { form_data },
                list: { table_data }
            };
            debugger;
            if(!(alldata.data.form_data.rows[0].values.fm==undefined)){
                alldata.data.form_data.rows[0].values.fm.value='';
            }
            // if(!alldata.data.form_data.rows[0].values.is_default!=undefined){
            //     if(alldata.data.form_data.rows[0].values.is_default.value=='Y'){
            //         alldata.data.form_data.rows[0].values.is_default.value='true';
            //     }else if(alldata.data.form_data.rows[0].values.is_default.value=='N'){
            //         alldata.data.form_data.rows[0].values.is_default.value='false';
            //     }
                
            // }
            let url = '/nccloud/uapbd/pub/formatdoc.do'//新增保存
            ajax({
                url: url,
                data: alldata,
                success: (res) => {
                     debugger;
                    let { success, data } = res;
                    if (success && data) {
                        curr_this.props.form.setFormStatus('formatdocform', 'browse');
                        //curr_this.props.editTable.setStatus('formatdoccard', 'browse');
                        curr_this.setState({
                            backbtnstatus: ''
                        })
                        curr_this.props.button.setButtonsVisible({
                            add: true,
                            edit: true,
                            del: true,
                            save: false,
                            cancel: false, 
                            print: true,  
                        });
                        //curr_this.props.editTable.setTableData('formatdoccard', data && data.formatdoccard ? formatdoccard.formatdoccard['formatdoccard'] : { rows: [] });
                        curr_this.props.form.setAllFormValue({ 'formatdocform': data.formatdocform.formatdocform });
                        // //缓存页面信息
                         if (curr_this.page_type == 'add') {
						 	addCache(data.formatdocform.formatdocform.rows[0].values.pk_formatdoc.value, data.formatdocform.formatdocform, 'formatdoccard', dataSource, data.formatdocform.formatdocform.rows[0].values);
						 } else {
                            
						 	updateCache('pk_formatdoc', data.formatdocform.formatdocform.rows[0].values.formatdocform.value, data.formatdocform.formatdoccard, 'formatdoccard', dataSource, data.formatdocform.formatdocform.rows[0].values);
						 }
						curr_this.page_type = 'browse';
                        toast({ color: 'success' });
                    }
                },
                error: (res) => {
                    toast({ content: this.state.json['xi-exsystem-000010'] + res.message, color: 'danger' })/* 国际化处理： 保存失败：*/
                }
            })
            break;
        case 'cancel':
            this.page_type = 'browse';
             
			let status = props.getUrlParam('status');
			promptBox({
				color: 'warning',
				title: this.state.json['xi-exsystem-000011'],/* 国际化处理： 取消*/
				content: this.state.json['xi-exsystem-000012'],/* 国际化处理： 确定取消该操作吗？*/
				beSureBtnClick: () => {
					let that = this;
					that.props.form.setFormStatus('formatdocform', 'browse');
					that.props.button.setButtonVisible({
					});
					that.setState({
						backbtnstatus: ''
                    });
                    if(pk == null && pk_url == null){
                        that.props.form.EmptyAllFormValue('formatdocform');
                        //that.props.editTable.setTableData('childtable',  { rows: [] });
                    }else if(pk != null && pk_url == null) {
                        that.getData2(pk,'browse');
                    }else if(pk == null && pk_url != null){
                        that.getData2(pk_url,'browse');
                    }else if(pk != null && pk_url != null){
                        that.getData2(pk,'browse');
                    }     
                    that.props.button.setButtonsVisible({
                        add: true,
                        editor: true,
                        del: false,
                        save: false,
                        cancel: false,
                        print:true
                    });
				}
			});
            break;
        case 'print_o'://输出
            debugger;
            if(pk!=null&&""!=pk){
                let outputdata = {
                    funcode:'10140LFOR',
                    appcode:'10140LFOR',
                    nodekey:'formatdoc_card',
                    oids:[pk],
                    outputType: 'output'
                }
                output({
                    url:'/nccloud/uapbd/formatdoc/print.do',
                    data:outputdata,
                });
            }else{
                toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
            }
            break;
        case 'print_p'://打印
            if(pk!=null&&""!=pk){
                print(
                    'pdf',
                    '/nccloud/uapbd/formatdoc/print.do',
                    {
                        funcode:'10140LFOR',
                        appcode:'10140LFOR',
                        nodekey:'formatdoc_card',
                        oids:[pk],
                    },
                    false
                )
            }else{
                toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
            }
        break;
    }
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS