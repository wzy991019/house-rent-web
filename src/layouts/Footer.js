import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          {/*版本信息*/}
          Copyright <Icon type="copyright" /> 2021 王子阳 毕业设计 出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
