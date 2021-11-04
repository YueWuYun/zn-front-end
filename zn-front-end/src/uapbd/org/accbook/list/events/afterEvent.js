//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a
import { createPage,base,ajax,high,getBusinessInfo,toast } from 'nc-lightapp-front';

export default function (props, moduleId, key, value, changedrows, data, index) {
    let that = this;
    let businessInfo = getBusinessInfo();
    let cur_pk_group = businessInfo.groupId;
    let pk_group = index.values.pk_group.value;
    if(cur_pk_group==pk_group){
        if(key=="islocked"){
            let midifydata ={
                areaType:'form',
                rows:[index]
            }
            ajax({
                data:{midifydata},
                async : false,
                url: '/nccloud/riaam/user/saveislock.do',
                success: function (res) {
                    props.table.setValByKeyAndIndex('user',data,'ts',{value:res.data.ts})
                }
            })
        };
    }else{
        toast({content:that.state.json['1880000025-000000'],color:'warning'});/* 国际化处理： 共享用户，不可被修改*/
    }    
}

//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a