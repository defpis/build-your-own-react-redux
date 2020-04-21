import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header></Header>
        <Content></Content>
      </div>
    );
  }
}

/**
 * 连接状态与组件
 */
const connect = (
  mapStateToProps: any = null,
  mapDispatchToProps: any = null,
) => (WrapperedComponent: any) => {
  class Connect extends Component<any, any> {
    static contextTypes = {
      store: PropTypes.object,
    };

    constructor(props: any) {
      super(props);
      this.state = { allProps: {} };
    }

    componentWillMount() {
      this._updateProps();
      const { store } = this.context;
      store.subscribe(() => this._updateProps());
    }

    // 更新低阶组件的输入以重新渲染视图
    _updateProps() {
      const { store } = this.context;
      this.setState({
        allProps: {
          ...(mapStateToProps
            ? mapStateToProps(store.getState(), this.props)
            : {}),
          ...(mapDispatchToProps
            ? mapDispatchToProps(store.dispatch, this.props)
            : {}),
        },
      });
    }

    render() {
      return (
        <WrapperedComponent {...this.state.allProps}>/</WrapperedComponent>
      );
    }
  }

  return Connect;
};

/**
 * 返回作为被包裹组件的输入
 * 必须返回一个全新的对象
 * @param state store的状态
 * @param props component的输入
 */
const mapStateToProps = (state: any, props: any) => {
  return {
    themeColor: state.themeColor,
  };
};

const mapDispatchToProps = (dispatch: any, props: any) => {
  return {
    onSwitchColor(color: string) {
      dispatch({ type: 'CHANGE_COLOR', themeColor: color });
    },
  };
};

const Header = connect(mapStateToProps)(
  class extends Component<any, any> {
    static propTypes = {
      themeColor: PropTypes.string,
    };

    render() {
      return <h1 style={{ color: this.props.themeColor }}>React.js 小书</h1>;
    }
  },
);

const Content = connect(mapStateToProps)(
  class extends Component<any, any> {
    static propTypes = {
      themeColor: PropTypes.string,
    };

    render() {
      return (
        <div>
          <p style={{ color: this.props.themeColor }}>React.js 小书内容</p>
          <ThemeSwitch></ThemeSwitch>
        </div>
      );
    }
  },
);

const ThemeSwitch = connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  class extends Component<any, any> {
    static propTypes = {
      themeColor: PropTypes.string,
      onSwitchColor: PropTypes.func,
    };

    handleSwitchColor(color: string) {
      if (this.props.onSwitchColor) {
        this.props.onSwitchColor(color);
      }
    }

    render() {
      return (
        <div>
          <button
            style={{ color: this.props.themeColor }}
            onClick={this.handleSwitchColor.bind(this, 'red')}
          >
            Red
          </button>
          <button
            style={{ color: this.props.themeColor }}
            onClick={this.handleSwitchColor.bind(this, 'blue')}
          >
            Blue
          </button>
        </div>
      );
    }
  },
);
