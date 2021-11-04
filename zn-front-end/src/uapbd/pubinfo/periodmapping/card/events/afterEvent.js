//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a
import { ajax } from 'nc-lightapp-front';

let formId = 'periodmapping';
let tableId = 'periodmappingdetail';

//两个编辑后事件，一个是目标会计期间方案 targetperiod，另一个是目标会计年度 targetyear

export default function afterEvent(props, moduleId, key, value, index) {
    let _this = this;
    if (moduleId == 'periodmapping'){
        if (key === 'targetperiod'){
            this.props.form.setFormItemsDisabled(formId,{
                'sourceperiod':false,
                'targetyear':false,
            })
            let pk = this.props.form.getFormItemsValue(formId,'targetperiod').value;
            ajax({
                url: '/nccloud/pubinfo/periodmapping/querytargetyear.do',
                data: pk,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        let options = [];
                        Object.keys(data).map((value,index)=>{
                            options.push({value:value,display:value});
                            return options;
                        });
                        _this.props.renderItem('form', formId, 'targetyear', null);
                        let meta = _this.props.meta.getMeta();
                        meta[formId].items.map((item,index)=>{
                            meta[formId].items.find((item) => item.attrcode == 'targetyear').options = options;
                            return meta;
                        });
                        _this.props.meta.setMeta(meta);
                    }
                }
            })

        }
        if (key === 'targetyear'){
            //根据表单中的条件去查应该展示的表格数据,表单中的会计年度字段不显示，但是为必填项，所以需要根据选中的目标会计年度来自动带出对应的会计期间档案的pk
            let year = this.props.form.getFormItemsValue(formId,'targetyear').value;
            let form_data = this.props.form.getAllFormValue(formId);

            let alldata = {
                year:year,
                form_data:{form_data},
            };
            ajax({
                url: '/nccloud/pubinfo/periodmapping/qrydetailvo.do',//目标会计年度更新之后要自动更新表体数据，无数据则自动赋值
                data: alldata,
                success: (res) => {
                    let {success,data} = res;
                    if (success ){
                        if (data && data.periodmappingdetail){
                            _this.props.editTable.setTableData('peridomappingdetail',{rows:[]});
                            _this.props.form.setAllFormValue({ 'periodmapping': data.periodmapping.periodmapping});
                        // _this.props.form.setFormItemsValue('periodmapping',{'targetyear':{value:data.targetYear.targetYear,display:data.targetYear.targetYear}});//会计年度真实值
                            _this.props.editTable.setTableData('periodmappingdetail',data.periodmappingdetail.periodmappingdetail);
                        } else {
                            _this.props.editTable.setTableData('periodmappingdetail',{rows:[]});
                        }
                    }
                }
            })
        }
    }
}


//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a