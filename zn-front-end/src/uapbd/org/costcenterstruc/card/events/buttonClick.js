//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, toast ,cardCache} from 'nc-lightapp-front';
import AttrClassModal from '../../attrclass/index';
let dataSource = 'uap.bcbd.barappobject.barappobjectcache';
const { deleteCacheById ,getNextId} = cardCache;
export default function buttonClick(props, id) {
    let _this = this;
    switch (id) {
        case 'add':
            _this.setpagestatus('add');
            break;
        case 'edit':
            _this.setpagestatus('edit');
            break;
        case 'delete':
            let formdata = _this.props.form.getAllFormValue('head');
            if (!formdata) { return; }
            props.ncmodal.show('ncmodal', {
                title: <span className='nc-theme-common-font-c'>{_this.state.json['barappobject-000003']}</span>,/* 国际化处理： 是否确认要删除?*/
                beSureBtnClick: () => {
                    ajax({
                        url: '/nccloud/bcbd/barappobject/delete.do',
                        data: { 'head': formdata },
                        success: (result) => {
                            //删除成功后处理
                            if (result.data && result.data.status) {
                                //取下一条数据进行显示！
                                _this.props.form.EmptyAllFormValue('head');
                                _this.props.cardTable.setTableData('body', { rows: [] });
                                let curr_pk = _this.pk_barappobject;
                                toast({ color: 'success' });
                                if(!curr_pk){return;}
                                let nextId = getNextId(curr_pk, dataSource);
                                deleteCacheById("pk_barappobject", curr_pk, dataSource);
                                _this.getData(nextId);
                            } else if (result.data && result.data.errmsg) {
                                toast({ color: 'danger', content: result.data.errmsg });
                            }
                        }
                    })
                }
            });
            break;
        case 'cancel':
            props.ncmodal.show('ncmodal', {
                title: <span className='nc-theme-common-font-c'>{_this.state.json['barappobject-000004']}</span>,/* 国际化处理： 是否确认要取消?*/
                beSureBtnClick: () => {
                    _this.getData();
                    _this.setpagestatus('browse');
                }
            });
            break;
        case 'attrcalssify':
            props.modal.show('attrclass', {
                title: _this.state.json['barappobject-000005'],/* 国际化处理： 属性分类*/
                size: 'xlg',
                noFooter: true,
                content: <AttrClassModal />
            });
            break;
        case 'save':
            if (!props.form.isCheckNow('head')) {
                return;
            }
            if (!props.cardTable.checkTableRequired('body')) {
                return;
            }
            let saveformdata = _this.props.form.getAllFormValue('head');
            let savebodydata;
            if (_this.pagestatus == 'edit') {
                savebodydata = _this.props.cardTable.getChangedRows('body');
            } else {
                savebodydata = _this.props.cardTable.getAllRows('body');
            }
            if (_this.props.cardTable.getNumberOfRows('body') <= 0) {
                toast({ color: 'warning', content: _this.state.json['barappobject-000006'] });/* 国际化处理： 表体数据不能为空!*/
                return;
            }
            let bodyrows = [];
            for (let i = 0; i < savebodydata.length; i++) {
                bodyrows.push(savebodydata[i]);
            }
            ajax({
                url: '/nccloud/bcbd/barappobject/save.do',
                data: {
                    head: { 'head': saveformdata },
                    body: bodyrows && bodyrows.length > 0 ? { 'body': { rows: bodyrows } } : "",
                    opt: _this.pagestatus
                },
                success: (res) => {
                    if (res && res.success) {
                        if (res.data && res.data.status) {//保存成功
                            _this.getData(res.data.pk_barappobject,_this.pagestatus);
                            _this.setpagestatus('browse');
                            toast({ color: "success" });
                        } else {
                            if (res.data.errmsg) {
                                toast({ color: "danger", content: res.data.errmsg });
                            }
                        }
                    }
                }
            })
            break;
        case 'addline':
            _this.props.cardTable.addRow('body', _this.props.cardTable.getNumberOfRows('body'), null, false);
            break;
        case 'delline':
            let checkbody = _this.props.cardTable.getCheckedRows('body');
            if (!checkbody || checkbody.length <= 0) {
                toast({ color: 'warning', content: _this.state.json['barappobject-000007'] });/* 国际化处理： 请选择要删除的数据*/
                return;
            }
            let indexs = [];
            for (let i = 0; i < checkbody.length; i++) {
                if (checkbody[i].data.values.isdefault.value) {
                    toast({ color: 'warning', content: _this.state.json['barappobject-000013'] });/* 国际化处理： 预置数据不允许删除*/
                    return;
                }
                indexs.push(checkbody[i].index);
            }
            _this.props.cardTable.delRowsByIndex('body', indexs);
            break;
    }

}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS