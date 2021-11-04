//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { Component } from 'react';

import { createPage, base,ajax, high,toast } from 'nc-lightapp-front';
let { NCButton, NCModal} = base;
/*
1,仅为示例, 代码不可照搬, 
2,请严格遵守React数据传递机制，
构造参数 
                type                mark
data,           Object              值数据
valueChange     function            改变值并确认后的回调函数

data: 打开编辑界面时,会以参数名为data传入，数据格式为
 {
     sysinittempvo 当前数据对应的模板数据，里面REFPATH不能为空
     m_sysinitvo， sysinittempvo对应参数值存储VO, 此对象存的值为nc对画框的java类, 真正的数据值存在sysinitvo
     sysinitvo，   真正存储参数值VO
 }
特别注意： 供应链的SCM03 SCM07特殊,  没有对应的sysinitvo, 原因不详.

valueChange 编辑完成后 需要调用valueChange(data), data为修改后的值,格式与传入的data格式相同。
*/

class Test extends Component {

    constructor(props) {
        super(props);
        this.valueChange = props.valueChange;
        this.data = props.data;
    }
    render() {
        var  onClick = () =>{
            this.data.sysinitvo.value = 4;
            this.valueChange(this.data);
           
        };
        return (
            <NCModal show={true}>
                        <NCModal.Header>
                            <NCModal.Title>动态参数设置窗口</NCModal.Title>
                        </NCModal.Header>
                        <NCModal.Body>
                          {this.data.toString()}
                        </NCModal.Body>
                        <NCModal.Footer>
                            <span><NCButton onClick={onClick}>确定</NCButton></span>
                        </NCModal.Footer>
                    </NCModal>
        );  
    } 
}
export default Test;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65