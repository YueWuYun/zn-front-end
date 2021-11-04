//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, base, toast, promptBox } from 'nc-lightapp-front';

let formId = 'periodmapping';

export default function buttonClick(props, id) {
    switch (id) {
        case 'add':
            props.pushTo('/card', {
                pagecode:'10140ACMAP_card',
                status: 'add',
            });
            break;
        case 'del':
            let checkdata = props.table.getCheckedRows('periodmapping');
            if (!checkdata || checkdata.length === 0) {
                toast({ content: '删除失败：没有可以删除的数据，请选择！', color: 'warning' })
                return;
            }
            promptBox({
                color: 'warning',
                title:'删除',
                content:'确定要删除所选数据吗?',
                beSureBtnClick: () => {
                     
                    //获取选中行
                    let that = this;
                    let data1 = this.props.table.getCheckedRows('periodmapping');
                    let arr = data1.map(item => item.index);
                    let datavalue = data1.map(item => item.data);
                    let value = datavalue.map(item => item.values);
                    let data = value.map(item => item.pk_peiodmapping.value);

                    ajax({
                        url: '/nccloud/pubinfo/periodmapping/delete.do',
                        data: {
                            pks:data
                        },
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                that.props.table.deleteTableRowsByIndex('periodmapping', arr);
                                toast({ color: 'success' });
                            }
                        },
                        error: (res) => {
                            toast({content:'删除失败：' + res.message,color:'danger'})
                        }
                    });
                },
            });
            break;
    }
}
//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS