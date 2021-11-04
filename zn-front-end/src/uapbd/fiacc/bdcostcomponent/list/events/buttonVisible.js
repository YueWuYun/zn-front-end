//2+0Qf+roUlDHXBeA/o9JMIiPw76taH0hKJDSd6sjDJNkjBs6D0W0DGiBCqpleLUq


/**
 * author kangjjd
 */

export default function buttonVisible(props,status,id){
    let flag = true;
    switch (id) {
        case 'Add'://新增
            break;
        case 'Delete'://删除
            break;
        case 'Edit'://修改
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Refresh'://刷新
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Save'://保存
            if (status == 'browse') {
                flag = false;
            }
            break;
        case 'Cancel'://取消
            if (status == 'browse') {
                flag = false;
            }
            break;
        case 'Refresh'://刷新
            if (status != 'browse') {
                flag = false;
            }
            break;

        default:
            break;    
    }
    return flag;

}
//2+0Qf+roUlDHXBeA/o9JMIiPw76taH0hKJDSd6sjDJNkjBs6D0W0DGiBCqpleLUq