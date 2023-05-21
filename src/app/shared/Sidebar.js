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
      { path: `/${urlPrefix}/apps`, state: 'appsMenuOpen' },
      { path: `/${urlPrefix}/basic-ui`, state: 'basicUiMenuOpen' },
      { path: `/${urlPrefix}/advanced-ui`, state: 'advancedUiMenuOpen' },
      { path: `/${urlPrefix}/form-elements`, state: 'formElementsMenuOpen' },
      { path: `/${urlPrefix}/tables`, state: 'tablesMenuOpen' },
      { path: `/${urlPrefix}/maps`, state: 'mapsMenuOpen' },
      { path: `/${urlPrefix}/icons`, state: 'iconsMenuOpen' },
      { path: `/${urlPrefix}/charts`, state: 'chartsMenuOpen' },
      { path: `/${urlPrefix}/user-pages`, state: 'userPagesMenuOpen' },
      { path: `/${urlPrefix}/error-pages`, state: 'errorPagesMenuOpen' },
      { path: `/${urlPrefix}/general-pages`, state: 'generalPagesMenuOpen' },
      { path: `/${urlPrefix}/ecommerce`, state: 'ecommercePagesMenuOpen' },

      { path: `/${urlPrefix}/scene`, state: 'scenePagesMenuOpen' },
      { path: `/${urlPrefix}/config-helper`, state: 'confhelperPagesMenuOpen' },
      { path: `/${urlPrefix}/demo`, state: 'demoPagesMenuOpen' },
      { path: `/${urlPrefix}/settings`, state: 'settingsPagesMenuOpen' },
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
                <span className="font-weight-bold mb-2"><Trans>测试用户</Trans></span>
                <span className="text-secondary text-small"><Trans>Project Manager</Trans></span>
              </div>
              <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
            </a>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/dashboard`) ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to={`/${urlPrefix}/dashboard`}>
              <span className="menu-title"><Trans>主控</Trans></span>
              <i className="mdi mdi-home menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/scene`) ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to={`/${urlPrefix}/scene`}>
              <span className="menu-title"><Trans>场地管理</Trans></span>
              <i className="mdi mdi-settings menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/demo`) ? 'nav-item active' : 'nav-item'}>
            <div className={this.state.demoPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
              onClick={() => this.toggleMenuState('demoPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-title"><Trans>演示</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-chart-bar menu-icon"></i>
            </div>
            <Collapse in={this.state.demoPagesMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className={this.isPathActive(`/${urlPrefix}/demo/current`) ? 'nav-link active' : 'nav-link'}
                    to={`/${urlPrefix}/demo/current`}>
                    <Trans>电流</Trans>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={this.isPathActive(`/${urlPrefix}/demo/smart-meter`) ? 'nav-link active' : 'nav-link'}
                    to={`/${urlPrefix}/demo/smart-meter`}>
                    <Trans>智能电表</Trans>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={this.isPathActive(`/${urlPrefix}/demo/voltameter`) ? 'nav-link active' : 'nav-link'}
                    to={`/${urlPrefix}/demo/voltameter`}>
                    <Trans>智能电能质量仪</Trans>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li className={this.isPathActive(`/${urlPrefix}/settings`) ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to={`/${urlPrefix}/settings`}>
              <span className="menu-title"><Trans>设置</Trans></span>
              <i className="mdi mdi-settings menu-icon"></i>
            </Link>
          </li>
          {/* <li className={ this.isPathActive('/basic-ui') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('basicUiMenuOpen') } data-toggle="collapse">
              <span className="menu-title"><Trans>Basic UI Elements</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-crosshairs-gps menu-icon"></i>
            </div>
            <Collapse in={ this.state.basicUiMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/buttons') ? 'nav-link active' : 'nav-link' } to="/basic-ui/buttons"><Trans>Buttons</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/dropdowns') ? 'nav-link active' : 'nav-link' } to="/basic-ui/dropdowns"><Trans>Dropdowns</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/typography') ? 'nav-link active' : 'nav-link' } to="/basic-ui/typography"><Trans>Typography</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/form-elements') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('formElementsMenuOpen') } data-toggle="collapse">
              <span className="menu-title"><Trans>Form Elements</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            </div>
            <Collapse in={ this.state.formElementsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/form-elements/basic-elements') ? 'nav-link active' : 'nav-link' } to="/form-elements/basic-elements"><Trans>Basic Elements</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/tables') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('tablesMenuOpen') } data-toggle="collapse">
              <span className="menu-title"><Trans>Tables</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-table-large menu-icon"></i>
            </div>
            <Collapse in={ this.state.tablesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link' } to="/tables/basic-table"><Trans>Basic Table</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/icons') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.iconsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('iconsMenuOpen') } data-toggle="collapse">
              <span className="menu-title"><Trans>Icons</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-contacts menu-icon"></i>
            </div>
            <Collapse in={ this.state.iconsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/icons/mdi') ? 'nav-link active' : 'nav-link' } to="/icons/mdi"><Trans>Material</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/user-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.userPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('userPagesMenuOpen') } data-toggle="collapse">
              <span className="menu-title"><Trans>User Pages</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-lock menu-icon"></i>
            </div>
            <Collapse in={ this.state.userPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/login-1') ? 'nav-link active' : 'nav-link' } to="/user-pages/login-1"><Trans>Login</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/register-1') ? 'nav-link active' : 'nav-link' } to="/user-pages/register-1"><Trans>Register</Trans></Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/user-pages/lockscreen') ? 'nav-link active' : 'nav-link' } to="/user-pages/lockscreen"><Trans>Lockscreen</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/error-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.errorPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('errorPagesMenuOpen') } data-toggle="collapse">
              <span className="menu-title"><Trans>Error Pages</Trans></span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-security menu-icon"></i>
            </div>
            <Collapse in={ this.state.errorPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/error-pages/error-404') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-404">404</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/error-pages/error-500') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-500">500</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="http://bootstrapdash.com/demo/purple-react-free/documentation/documentation.html" rel="noopener noreferrer" target="_blank">
              <span className="menu-title"><Trans>Documentation</Trans></span>
              <i className="mdi mdi-file-document-box menu-icon"></i>
            </a>
          </li> */}
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