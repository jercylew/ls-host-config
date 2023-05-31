import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import HomeUrlPrefix from '../HomeUrlPrefix';

const urlPrefix = HomeUrlPrefix();
class Sidebar extends Component {

  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: `/${urlPrefix}/dashboard`, state: 'dashboardPagesMenuOpen' },      
      { path: `/${urlPrefix}/scene`, state: 'scenePagesMenuOpen' },
      { path: `/${urlPrefix}/electric-monitor`, state: 'electricMonitorPagesMenuOpen' },
      { path: `/${urlPrefix}/ble-mesh`, state: 'bleMeshPagesMenuOpen' },
      { path: `/${urlPrefix}/system`, state: 'systemPagesMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));
  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className="nav-item nav-profile">
            <a href="!#" className="nav-link" onClick={evt => evt.preventDefault()}>
              <div className="nav-profile-image">
                <img src={require("../../assets/images/faces/face1.jpg")} alt="profile" />
                <span className="login-status online"></span> {/* change to offline or busy as needed */}
              </div>
              <div className="nav-profile-text">
                <span className="font-weight-bold mb-2"><Trans>操作员</Trans></span>
                {/* <span className="text-secondary text-small"><Trans>Project Manager</Trans></span> */}
              </div>
              <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
            </a>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/dashboard`) ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to={`/${urlPrefix}/dashboard`}>
              <span className="menu-title"><Trans>主页</Trans></span>
              <i className="mdi mdi-home menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/scene`) ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to={`/${urlPrefix}/scene`}>
              <span className="menu-title"><Trans>场地设置</Trans></span>
              <i className="mdi mdi-settings menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/electric-monitor`) ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to={`/${urlPrefix}/electric-monitor`}>
              <span className="menu-title"><Trans>电箱设置</Trans></span>
              <i className="mdi mdi-settings menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/ble-mesh`) ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.bleMeshPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
              onClick={() => this.toggleMenuState('bleMeshPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>蓝牙Mesh配置助手</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-chart-bar menu-icon"></i>
            </div>
            <Collapse in={this.state.bleMeshPagesMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className={this.isPathActive(`/${urlPrefix}/ble-mesh/overview`) ? 'nav-link active' : 'nav-link'}
                    to={`/${urlPrefix}/ble-mesh/overview`}>
                    <Trans>总览</Trans>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={this.isPathActive(`/${urlPrefix}/ble-mesh/mesh`) ? 'nav-link active' : 'nav-link'}
                    to={`/${urlPrefix}/ble-mesh/mesh`}>
                    <Trans>Mesh信息</Trans>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={this.isPathActive(`/${urlPrefix}/ble-mesh/advanced`) ? 'nav-link active' : 'nav-link'}
                    to={`/${urlPrefix}/ble-mesh/advanced`}>
                    <Trans>高级功能</Trans>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/system`) ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to={`/${urlPrefix}/system`}>
              <span className="menu-title"><Trans>系统设置</Trans></span>
              <i className="mdi mdi-settings menu-icon"></i>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);