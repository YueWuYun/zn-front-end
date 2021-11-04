//8Y1LhJS8q2oCJRAmHQLCmxE/rIbuZaWuBo+RMTf1iy2edWrsSej0hCcytwC89YN2
export default function(props, moduleId, key, value,  index, record,status){

    //客户联系人只有默认可以编辑，其余字段都是直接从联系人表单编辑
    if(key!== 'isdefault'){
        return false;
    }else{
        return true;
    }

}

//8Y1LhJS8q2oCJRAmHQLCmxE/rIbuZaWuBo+RMTf1iy2edWrsSej0hCcytwC89YN2