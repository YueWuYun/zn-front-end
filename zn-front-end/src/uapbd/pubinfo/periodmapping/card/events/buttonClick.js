//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, toast, cardCache,promptBox } from 'nc-lightapp-front';
let { updateCache, addCache, getNextId, deleteCacheById } = cardCache;
export default function buttonClick(props, id) {
    let tableId = 'periodmappingdetail';
    let formId = 'periodmapping';
    let auditId = 'auditInfo';
    let curr_this = this;
    
    let data = props.form.getAllFormValue(formId);
    let pk = data.rows[0].values.pk_peiodmapping.value;//数据库中拼写错误，所以使用pk_peiodmapping
    let pk_url = props.getUrlParam('pk');//url 上的id ，单据的主键
    let dataSource = 'uapbd.pubinfo.periodmapping.cache'
     
    switch (id) {
        case 'add'://新增按钮
            this.page_type = 'add';
            curr_this.props.form.EmptyAllFormValue(formId)
            curr_this.props.editTable.setTableData(tableId, { rows: [] });
            curr_this.props.form.setFormStatus(formId, 'add');

            curr_this.props.form.EmptyAllFormValue(auditId);//清空审计信息
            curr_this.props.form.setFormStatus(auditId,'browse');
            curr_this.setState({
                backbtnstatus: 'none'
            })
            curr_this.props.button.setButtonsVisible({
                add: false,
                edit: false,
                del: false,
                save: true,
                cancel: true,
            });
            curr_this.props.form.setFormItemsDisabled(formId,{
                'code':false,
                'targetperiod':false,
                'sourceperiod':true,
                'targetyear':true
            })
            break;
        case 'edit':
            if (!pk) {
                toast({content:'编辑失败：没有可以编辑的数据',color:'warning'})
                return;
            }
            this.page_type = 'edit';
            props.form.setFormStatus(formId, 'edit');
            props.editTable.setStatus('periodmappingdetail', 'browse');//下方是不可编辑的
            curr_this.setState({
                backbtnstatus: 'none'
            })
            curr_this.props.button.setButtonsVisible({
                add: false,
                edit: false,
                del: false,
                save: true,
                cancel: true,
            });
            curr_this.props.form.setFormItemsDisabled(formId,{
                'code':true,
                'targeteperiod':true,
                'sourceperiod':true,
                'targetyear':false
            });
            break;

        case 'del':
            if (!pk) {
                toast({ content: '删除失败：没有可以删除的数据', color: 'warning' })
                return;
            }
            let data = {
                pks: [pk],
            }
            promptBox({
				color: 'warning',
                title: '删除',
				content: '确定删除所选数据吗？',
				beSureBtnClick: () => {
                    ajax({
                        url: '/nccloud/pubinfo/periodmapping/delete.do',
                        data: data,
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                 
                                let curr_id = pk;
                                let nextId = getNextId(curr_id, dataSource);
                                deleteCacheById('pk_periodmapping', curr_id, dataSource);
                                if (!nextId || nextId == null) {
									setTimeout(() => {
                                        curr_this.props.form.EmptyAllFormValue('periodmapping');
                                        curr_this.props.editTable.setTableData('periodmappingdetail',  { rows: [] });
									}, 0)
                                    curr_this.props.button.setButtonsVisible({
                                        add: true,
                                        edit: true,
                                        del: true,
                                        save: false,
                                        cancel: false
                                    });
								} else {
									curr_this.getData2(nextId);//删除之后还有没有下一条数据了
								}
								toast({ color: 'success' });
                            }
                        },
                        error: (res) => {
                            toast({ content: '删除失败' + res.message, color: 'danger' })/* 国际化处理： 删除失败：*/
                        }
                    });
				}
			});

            break;
        case 'save'://保存的时候需要处理一下审计信息吗？
            if (!this.page_type) {
                this.page_type = props.getUrlParam('status');
            }
            if (!props.form.isCheckNow('periodmapping')){//是否开启表单校验
                return;
            }
            let table_data = this.props.editTable.getAllData(tableId);
            let form_data = props.form.getAllFormValue(formId);
            let rowdata = this.props.editTable.getChangedRows(tableId, false);//false代表不走校验
            let flag = this.props.editTable.checkRequired(tableId, rowdata);//检验必输项是否已经输入
            let year = this.props.form.getFormItemsValue(formId,'targetyear').value;//目标会计年度
            if (!flag) {
                return;
            }

            let alldata = {
                year: year,
                data: { form_data },
                list: { table_data }
            };
            let url = '/nccloud/pubinfo/periodmapping/save.do'//新增保存
            ajax({
                url: url,
                data: alldata,
                success: (res) => {
                     
                    let { success, data } = res;
                    if (success && data) {
                        curr_this.props.editTable.setStatus('periodmappingdetail', 'browse');
                        curr_this.setState({
                            backbtnstatus: ''
                        })
                        curr_this.props.button.setButtonsVisible({
                            add: true,
                            edit: true,
                            del: true,
                            save: false,
                            cancel: false
                        });
                        curr_this.props.form.setFormItemsDisabled('periodmapping',{
                            'code':true,
                            'targetperiod':true,
                            'sourceperiod':true,
                            'targetyear':false
                        })
                        curr_this.props.editTable.setTableData('periodmappingdetail', data && data.periodmappingdetail && data.periodmapping ? data.periodmappingdetail['periodmappingdetail'] : { rows: [] });
                        curr_this.props.form.setAllFormValue({'periodmapping': data.periodmapping.periodmapping });

                        //缓存页面信息
                        if (curr_this.page_type == 'add') {
							addCache(data.periodmapping.periodmapping.rows[0].values.pk_peiodmapping.value, data.periodmapping.periodmapping, 'periodmapping', dataSource, data.periodmapping.periodmapping.rows[0].values);
						} else {
							updateCache('pk_periodmapping', data.periodmapping.periodmapping.rows[0].values.pk_periodmapping.value, data.periodmapping.periodmapping, 'periodmapping', dataSource, data.periodmapping.periodmapping.rows[0].values);
						}
						curr_this.page_type = 'browse';
                        toast({ color: 'success' });
                    } else {
                        curr_this.props.editTable.setStatus('periodmappingdetail', 'browse');
                        curr_this.props.button.setButtonsVisible({
                            add: true,
                            edit: true,
                            del: true,
                            save: false,
                            cancel: false
                        });
                        curr_this.props.form.setFormItemsDisabled('periodmapping',{
                            'code':true,
                            'targetperiod':true,
                            'sourceperiod':true,
                            'targetyear':false
                        })
                        curr_this.page_type = 'browse';
                        toast({ color: 'success' });
                    }
                },
                error: (res) => {
                    toast({content:'保存失败：'+res.message,color:'danger'});
                }
            })
            break;
        case 'cancel':
            this.page_type = 'browse';
             
			let status = props.getUrlParam('status');
			promptBox({
				color: 'warning',
                title:'取消',
                content:'确定取消该操作吗？',
				beSureBtnClick: () => {
					let that = this;
					that.props.form.setFormStatus('periodmapping', 'browse');
					that.props.button.setButtonVisible({
					});
					that.setState({
						backbtnstatus: ''
                    });
                    if(pk == null && pk_url == null){
                        that.props.form.EmptyAllFormValue('periodmapping');
                        that.props.editTable.setTableData('periodmappingdetail',  { rows: [] });
                    }else if(pk != null && pk_url == null) {
                        that.getData2(pk,'browse');
                    }else if(pk == null && pk_url != null){
                        that.getData2(pk_url,'browse');
                    }else if(pk != null && pk_url != null){
                        that.getData2(pk,'browse');
                    }
                    that.props.button.setButtonsVisible({
                        add: true,
                        edit: true,
                        del: true,
                        save: false,
                        cancel: false
                    });
				}
			});
            break;
    }
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS