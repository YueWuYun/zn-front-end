//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WorkCalendar from '../../workcalendar/main/workcalendar.js';
import {ajax,createPage } from 'nc-lightapp-front';

var Page = createPage({})(WorkCalendar);
var config = {
  title: "10140WORKCALENDAR-000011",//'工作日历-全局',
  nodetype: 'glb',
  pagecode: '10140WCB_main',
  appcode: '10140WCB'
};
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65