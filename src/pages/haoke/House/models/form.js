import {routerRedux} from 'dva/router';
import {message} from 'antd';
import { addHouseResource , updateHouseResource } from '@/services/haoke';

export default {
  namespace: 'house',

  state: {},

  effects: {
    //调用services/haoke.js里面的addHouseResources方法进行提交数据
    * submitHouseForm({payload}, {call}) {
      yield call(addHouseResource, payload);
      message.success('提交成功');
    },
    * updateHouseForm({payload}, {call}) {
      yield call(updateHouseResource, payload);
      message.success('提交成功');
    }
  },

  reducers: {
    saveStepFormData(state, {payload}) {
      return {
        ...state
      };
    },
  },
};
