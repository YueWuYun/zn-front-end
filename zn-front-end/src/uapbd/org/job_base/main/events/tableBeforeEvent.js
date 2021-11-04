//LXv9pKDqqugbW7lBwM+/ae1XrEpaCmlw5OVbH150P/TgVHtqx8MJ9mTvzQJUxE1K
import{toast,getBusinessInfo} from 'nc-lightapp-front';
import manageModeUtils from '../../../../public/utils/ManageModeUtils';

//编辑前事件
export default function(props,moduleId,item,index,value,record){
    let rocordval = record.values;
    let rem = manageModeUtils.call(this,props.config.NODE_TYPE,rocordval.pk_org.value,rocordval.pk_group.value,'',getBusinessInfo().groupId);
    if(!rem.editFlag){
        toast({'color':'warning','title':rem.message});
    }
    return rem.editFlag;
}

//LXv9pKDqqugbW7lBwM+/ae1XrEpaCmlw5OVbH150P/TgVHtqx8MJ9mTvzQJUxE1K