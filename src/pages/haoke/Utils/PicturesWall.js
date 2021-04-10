import { Upload, Icon, Modal } from 'antd';

// 子组件继承父组件
class PicturesWall extends React.Component {

    constructor(props) {
      super(props);

      // 处理默认图片
      let fileList = [];
      if (this.props.fileList){
        // 对传进来的fileList进行分割
        fileList = this.props.fileList.split(',').map(item => {
          return {
            uid: item,
            name: item,
            status: 'done',
            url: item
          }
        });
      }

      this.state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
      };
    }



    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    // 将fileList传递给handleFileList
    handleChange = ({ fileList }) => {
      this.setState({ fileList });
      this.props.handleFileList(this.state.fileList);
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                {/*// 上传组件*/}
                <Upload
                    action="/haoke/pic/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;
