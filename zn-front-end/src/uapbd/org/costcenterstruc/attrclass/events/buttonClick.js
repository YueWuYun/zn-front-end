//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, toast } from 'nc-lightapp-front';
export default function buttonClick(props, id) {
    let _this = this;
    switch (id) {
        case 'add':
            if (_this.pagestatus == 'browse') {
                _this.initPageStatus('add');
            }
            props.editTable.addRow('attrclass');
            break;
        case 'edit':
            _this.initPageStatus('edit');
            props.editTable.setStatus('attrclass', 'edit');
            break;
        case 'del':
            let checkrows = _this.props.editTable.getCheckedRows('attrclass');
            if (!checkrows || checkrows.length <= 0) {
                toast({ color: 'danger', content: _this.state.json['barappobject-000000'] });/* 国际化处理： 请选择需要删除的数据*/
                return;
            }
            let delrows = [];
            let delindex = [];
            for (let index = 0; index < checkrows.length; index++) {
                delrows.push(checkrows[index].data);
                delindex.push(checkrows[index].index);
            }

            if (_this.pagestatus == 'browse') {
                _this.props.ncmodal.show('modal', {
                    title: <span className='nc-theme-common-font-c'>{_this.state.json['barappobject-000001']}</span>,/* 国际化处理： 您确定要删除所选数据吗？*/
                    beSureBtnClick: () => {
                        ajax({
                            url: '/nccloud/bcbd/attrclass/delete.do',
                            data: { 'attrclass': { rows: delrows } },
                            success: (result) => {
                                if (result && result.success) {
                                    if (result.data && result.data.status) {
                                        _this.props.editTable.deleteTableRowsByIndex('attrclass', delindex, true);
                                        toast({ color: 'success' });
                                    } else {
                                        toast({ color: 'danger', content: result.data.errmsg });
                                    }
                                }
                            }
                        })
                    }
                })
            } else {
                let indexs = [];
                checkrows.map((row) => {
                    indexs.push(row.index);
                    return indexs;
                });
                _this.props.editTable.deleteTableRowsByIndex('attrclass', indexs);
            }
            break;
        case 'save':
            if (!_this.props.editTable.checkRequired('attrclass', _this.props.editTable.getAllRows('attrclass'))) {
                return;
            }
            _this.props.editTable.filterEmptyRows('attrclass');
            let changerows = _this.props.editTable.getChangedRows('attrclass');
            if (!changerows || changerows.length <= 0) {//若没有改变则走取消逻辑
                _this.initPageStatus('browse');
                _this.getdata();
                _this.props.editTable.setStatus('attrclass', 'browse');
                toast({ color: 'success' });
                return;
            }
            let addrows = [], editrows = [], deleterows = [];
            for (let index = 0; index < changerows.length; index++) {
                let row = changerows[index];
                if (row.status == '2') {//新增的行
                    addrows.push({ values: row.values });
                }
                if (row.status == '3') {//删除的行
                    deleterows.push({ values: row.values });
                }
                if (row.status == '1') {//修改的行
                    editrows.push({ values: row.values });
                }
            }
            ajax({
                url: '/nccloud/bcbd/attrclass/save.do',
                data: {
                    addrows: addrows && addrows.length > 0 ? { 'attrclass': { rows: addrows } } : "",
                    editrows: editrows && editrows.length > 0 ? { 'attrclass': { rows: editrows } } : "",
                    deleterows: deleterows && deleterows.length > 0 ? { 'attrclass': { rows: deleterows } } : ""
                },
                success: (result) => {
                    if (result && result.success) {
                        if (result.data && result.data.status) {
                            _this.initPageStatus('browse');
                            _this.getdata();//回写数据
                            _this.props.editTable.setStatus('attrclass', 'browse');
                            toast({ color: 'success' });
                        } else {
                            toast({ color: 'danger', content: result.data.errmsg });
                        }
                    }
                }
            })
            break;
        case 'cancel':
            props.ncmodal.show('modal', {
                title: <span className='nc-theme-common-font-c'>{_this.state.json['barappobject-000002']}</span>,/* 国际化处理： 确定要取消吗？*/
                beSureBtnClick: () => {
                    _this.initPageStatus('browse');
                    _this.getdata();
                    _this.props.editTable.setStatus('attrclass', 'browse');
                }
            })
            break;
    }

}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS