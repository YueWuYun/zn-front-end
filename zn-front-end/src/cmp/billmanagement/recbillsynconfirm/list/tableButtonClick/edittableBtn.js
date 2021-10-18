/*9wRAZp3u790wkD+T7rv7r7naHkVcMVxjoyARqdTdLjxOU/NV2Cf8dbpdypG3vDcf*/
/**
 * [收款协同]-确定编辑按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const edittableBtn = function (record,index) {
    this.props.pushTo('/card', {
        status: 'edit',
        id: record.pk_recbill.value
    });
}

/*9wRAZp3u790wkD+T7rv7r7naHkVcMVxjoyARqdTdLjxOU/NV2Cf8dbpdypG3vDcf*/