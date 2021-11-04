//SawE5IQgajMDBtK2lCMMzpNOzVo6i5fnxrVv8rzDUxdUOAO268KETpLzLNr/zhEj
export default function formbeforeEvent(props, moduleId, key, value, data) {
    if(key == 'memo'){
        return true;
    }
    let isdefault = props.form.getFormItemsValue('head', 'isdefault').value;
    return !isdefault;//预置数据不能修改
}

//SawE5IQgajMDBtK2lCMMzpNOzVo6i5fnxrVv8rzDUxdUOAO268KETpLzLNr/zhEj