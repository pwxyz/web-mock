import React from 'react';
import styles from './index.css';
import api from '@/constants/api';
import throttle from 'lodash/throttle'
import request from '@/utils/request';
import debounce from 'lodash/debounce';

const BasicLayout: React.FC = props => {
  return (
    <div>
      {props.children}
    </div>
  );
};

// class BasicLayout extends React.Component<any, any>{
//   state = {
//     isLogin: false
//   }

//   componentDidMount() {
//     console.log('index did')
//     this.verfiyToken()

//     // window.addEventListener('keypress', throttle(this.xx, 1000))
//     // window.addEventListener('mousemove', debounce(function () {
//     //   this.console.log('mousemove')
//     // }, 100))
//   }

//   // xx = () => {
//   //   // debounce(function () {
//   //   //   console.log('keypress')
//   //   // }, 100)
//   //   console.log('press xx')
//   // };


//   verfiyToken = async () => {
//     let res = await request({ method: 'post', url: api.LOGIN_VERIFY })
//     if (res && res['isLogin']) {

//     }
//     console.log('res', res)
//   }

//   render() {
//     return (
//       <div>
//         {this.props.children}
//       </div>
//     )
//   }
// }

export default BasicLayout;
