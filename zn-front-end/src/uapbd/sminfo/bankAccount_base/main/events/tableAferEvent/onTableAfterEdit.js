//YUVJHeggZAYWKYsB5JPyU0KLc6V3uAoORk4TkRaW0ulLvO7x2YkkyOGx6FIjFLaM
import{ajax} from 'nc-lightapp-front';
/**
 * 银行账户列表编辑后事件（好像没有什么用）
 * @param props
 * @param moduleId
 * @param key
 * @param value
 * @param changedrows
 * @param record
 * @param index
 */
export default  function onTableAfterEdit(props,moduleId,key,value,changedrows,record,index){
    // props, moduleId, key, value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）){
    //ajax回传参数
    let  paramdata = {
        pageid:'10100JOBB_job',
        gridmode:{
            areacode:props.config.gridId,
            pageinfo:{},
            rows:[]
        }
    }
    switch(key){
        case 'enablestate':
            if(value){//如果是启用
                props.modal.show('enableModal',{
                    title:this.state.json['10140BANKACC-000036'],/* 国际化处理： 提示*/
                    content:this.state.json['10140BANKACC-000017'],/* 国际化处理： 确定启用？*/
                    beSureBtnClick:()=>{
                        console.log(1);
                    }
                });
            }else{//如果是停用
                props.modal.show('disAbleModal',{
                    title:this.state.json['10140BANKACC-000036'],/* 国际化处理： 提示*/
                    content:this.state.json['10140BANKACC-000017'],/* 国际化处理： 确定启用？*/
                    beSureBtnClick:()=>{
                        console.log(2);
                    }
                });
            }
            break;
    }
}

//YUVJHeggZAYWKYsB5JPyU0KLc6V3uAoORk4TkRaW0ulLvO7x2YkkyOGx6FIjFLaM