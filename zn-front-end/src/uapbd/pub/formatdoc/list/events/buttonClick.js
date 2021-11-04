//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, base,output, toast, promptBox,print } from 'nc-lightapp-front';

export default function buttonClick(props, id) {
    let rows =props.table.getAllTableData('formatdocdata').rows;
    let pks =[];
    switch (id) {
        case 'add':
            props.pushTo('/card', {
                status: 'add',
            });
            break;
        // case 'del':
        //     let checkdata = props.table.getCheckedRows('formatdocform');
        //     if (!checkdata || checkdata.length === 0) {
        //         toast({ content: this.state.json['xi-exsystem-000012'], color: 'warning' })/* 国际化处理： 删除失败：没有可以删除的数据,请选择!*/
        //         return;
        //     }
        //     promptBox({
        //         color: 'warning',
        //         title: this.state.json['xi-exsystem-000004'],/* 国际化处理： 删除*/
        //         content: this.state.json['xi-exsystem-000013'],/* 国际化处理： 确定要删除所选数据吗？*/
        //         beSureBtnClick: () => {
                     
        //             //获取选中行
        //             let that = this;
        //             let data1 = this.props.table.getCheckedRows('formatdocform');
        //             let arr = data1.map(item => item.index);
        //             let datavalue = data1.map(item => item.data);
        //             let value = datavalue.map(item => item.values);
        //             let data = value.map(item => item.pk_formatdoc.value);

        //             ajax({
        //                 url: '/nccloud/uapbd/formatdoc/formatdocDelete.do',
        //                 data: { data },
        //                 success: (res) => {
        //                     let { success, data } = res;
        //                     if (success) {
        //                         that.props.table.deleteTableRowsByIndex('formatdocform', arr);
        //                         toast({ color: 'success' });
        //                     }
        //                 },
        //                 error: (res) => {
        //                     toast({ content: this.state.json['xi-exsystem-000014'] + res.message, color: 'danger' })/* 国际化处理： 删除失败:*/
        //                 }
        //             });
        //         },
        //     });
        //     break;
            // case 'edit':
            // if(props.table.getCheckedRows('formatdocdata').length<=0){

            // }else{
            //     props.pushTo('/card', {
            //         status: 'edit',
            //         pk: props.table.getCheckedRows('formatdocdata')[0].data.values.pk_formatdoc.value
            //     });
            // }
            // break;
        case  'print_o':debugger;
            rows.map((item)=>{
            pks.push(item.values.pk_formatdoc.value);
            return pks;
            });
            if(pks!=null&&""!=pks){
                let outputdata = {
                    funcode:'10140LFOR',
                    appcode:'10140LFOR',
                    nodekey:'formatdoc_card',
                    oids:pks,
                    outputType: 'output'
                }
                output({
                    url:'/nccloud/uapbd/formatdoc/print.do',
                    data:outputdata,
                });
            }else{
                toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
            }
            break;
        case 'print_p'://打印
        
        rows.map((item)=>{
            pks.push(item.values.pk_formatdoc.value);
            return pks;
        });
        if(pks!=null&&""!=pks){
            print(
                'pdf',
                '/nccloud/uapbd/formatdoc/print.do',
                {
                    funcode:'10140LFOR',
                    appcode:'10140LFOR',
                    nodekey:'formatdoc_card',
                    oids:pks,
                },
                false
            )
        }else{
            toast({content:this.state.json['1880000025-000001'],color:'warning'});/* 国际化处理： 请选择要操作的用户*/
        }
    break;
    }
}








// import { ajax, base, toast } from 'nc-lightapp-front';
// let {NCMessage} = base;
// export default function buttonClick(props, id) {
//     switch (id) {
//         case 'add':
//         props.linkTo(
//         '../card/index.html',
//         {status: 'add'});
//         break;
//         case 'delbtn':
//         let checkdRows = this.props.editTable.getCheckedRows('exsystem');
//         if(!checkdRows||checkdRows.length === 0){
// 			NCMessage.create({content:'删除失败：没有可以删除的数据,请选择',position: 'bottom',color: 'warning'})
// 			return;
// 		}
//         props.modal.show('delete');
//         break;
//         case 'refreshbtn':
//         this.refresh();
//         break;
//     }
// }

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS