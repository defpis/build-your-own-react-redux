import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import App from './App';

/**
 * 创建一个Store
 * @param reducer 缓速器
 */
function createStore(reducer: any): any {
  let state: any = null;
  const listeners: any[] = [];
  const subscribe = (listener: any): void => {
    listeners.push(listener);
  };
  const getState = (): any => state;
  const dispatch = (action: any): void => {
    state = reducer(state, action);
    listeners.forEach((listener: any): void => listener());
  };
  dispatch({});
  return { getState, dispatch, subscribe };
}

/**
 * 状态变更缓速器
 */
const themeReducer = (state: any, action: any): any => {
  if (!state) {
    return {
      themeColor: 'red',
    };
  }
  switch (action.type) {
    case 'CHANGE_COLOR':
      return { ...state, themeColor: action.themeColor };
    default:
      return state;
  }
};

const store = createStore(themeReducer);

export class Provider extends Component<any, any> {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any,
  };

  static childContextTypes = {
    store: PropTypes.object,
  };

  getChildContext() {
    return {
      store: this.props.store,
    };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App></App>
  </Provider>,
  document.getElementById('app'),
);
