//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * Created by mianh on 2018/4/13 0013.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;

import './index.less'

import Chaiyan3 from './chaiyan3.js'
import Liupzhc from './liupzhc.js'
import Liusenc from './liusenc.js'
import Mazheng from './mazheng.js'
import Tangcht from './tangcht.js'
import Tongchg from './tongchg.js'
import Wangdca from './wangdca.js'
import Wanglinw from './wanglinw.js'
import Wanglqh from './wanglqh.js'
import Wangqchf from './wangqchf.js'
import Wpz from './wpz.js'
import Xuehaoc from './xuehaoc.js'
import Xuewenc from './xuewenc.js'
import Yinshb from './yinshb.js'
import Zhangwxf from './zhangwxf.js'
import Zhaochxs from './zhaochxs.js'
import Zhenmx from './zhenmx.js'
import Zhoucx from './zhoucx.js'
import Zoujinga from './zoujinga.js'
import Wangying16 from './wangying16.js'

class RefDemoTest extends Component {
	render() {
		return (
			<Row>
				<Col md={12} xs={12} sm={12}>
					<h1>参照测试</h1>
				</Col>

				<Chaiyan3/>
				<Liupzhc/>
				<Liusenc/>
				<Mazheng/>
				<Tangcht/>
				<Tongchg/>
				<Wangdca/>
				<Wanglinw/>
				<Wanglqh/>
				<Wangqchf/>
				<Wpz/>
				<Xuehaoc/>
				<Xuewenc/>
				<Yinshb/>
				<Zhangwxf/>
				<Zhaochxs/>
				<Zhenmx/>
				<Zhoucx/>
				<Zoujinga/>				
                <Wangying16/>
			</Row>
		)
	}
};

ReactDOM.render(<RefDemoTest />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65