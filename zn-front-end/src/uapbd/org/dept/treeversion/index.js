//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {  base } from 'nc-lightapp-front';
import './index.less'
const {NCForm,NCInput,NCTable,NCDiv} = base;

class DeptTreeVersion extends Component {
    getMemo(event){
        this.props.config.getMemo(event.target.value);
    }
    render(){
        return (
            <NCDiv fieldid="deptv" areaCode={NCDiv.config.FORM} className='branch' >
                <table >
                    <tr fieldid = 'firsttr'>
                        <td width="9%"></td>
                        <td fieldid = 'firsttd' className = 'nc-theme-common-font-c'>
                            {this.props.config.json['10100DEPT-000071']/* 国际化处理： 当前版本号*/}
                        </td>
                        <td fieldid = 'secondtd'>
                            <input name='vno' className='not-allow nc-theme-from-input-bgc nc-theme-common-font-c' type='text' style={{width:'200px',height:'30px'}} disabled="disabled" value={this.props.config.vno}/>
                        </td>
                        <td width="9%"></td>
                        <td fieldid = 'thirdtd' className = 'nc-theme-common-font-c'>
                            {this.props.config.json['10100DEPT-000072']/* 国际化处理： 当前版本开始时间*/}
                        </td>
                        <td fieldid = 'fourthtd'>
                            <input name='vbegindate' className='not-allow nc-theme-from-input-bgc nc-theme-common-font-c' type='text' style={{width:'200px',height:'30px'}} disabled="disabled" value={this.props.config.vbegindate}/>
                        </td>
                        <td width="9%"></td>
                    </tr>
                    <tr fieldid = 'firsttr'>
                        <td width="9%"></td>
                        <td fieldid = 'newfirsttd' className = 'nc-theme-common-font-c'>
                            {this.props.config.json['10100DEPT-000073']/* 国际化处理： 新版本说明*/}
                        </td>
                        <td fieldid = 'newsecondtd' className = 'nc-theme-common-font-c'>
                            <input name='vname' className= 'nc-theme-common-font-c nc-theme-from-input-bgc' type='text' autofocus='autofocus' style={{width:'200px',height:'30px'}} onBlur={this.getMemo.bind(this)}/>
                        </td>
                        <td width="9%"></td>
                        <td fieldid = 'newthirdtd' className = 'nc-theme-common-font-c'>
                            {this.props.config.json['10100DEPT-000074']/* 国际化处理： 新版本生效日期*/}
                        </td>
                        <td fieldid = 'newfourthtd' className = 'nc-theme-common-font-c'>
                            <input name='veffectdate' className='not-allow nc-theme-from-input-bgc nc-theme-common-font-c' style={{width:'200px',height:'30px'}} type='text' disabled="disabled" value={this.props.config.veffectdate}/>
                        </td >
                        <td width="9%"></td>
                    </tr>
                </table>
            </NCDiv>
        )
    }

}

export default DeptTreeVersion;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65