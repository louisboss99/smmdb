import React from 'react'
import {
  connect
} from 'react-redux'

import NavigationButton from '../buttons/NavigationButton'
import SubNavigationButton from '../buttons/SubNavigationButton'
import LoginButton from '../buttons/LoginButton'
import {
  ScreenSize
} from '../../reducers/mediaQuery'

class NavigationArea extends React.PureComponent {
  render () {
    const screenSize = this.props.screenSize
    const display = this.props.display
    const styles = {
      navigation: {
        display: 'flex',
        width: '240px',
        height: screenSize >= ScreenSize.MEDIUM ? 'auto' : '100vh',
        maxHeight: screenSize >= ScreenSize.MEDIUM ? display ? '500px' : '0' : '100vh',
        position: screenSize >= ScreenSize.MEDIUM ? 'absolute' : 'fixed',
        top: screenSize >= ScreenSize.MEDIUM ? '40px' : '0',
        left: screenSize >= ScreenSize.MEDIUM ? '10px' : '0',
        flexDirection: 'column',
        backgroundColor: screenSize >= ScreenSize.MEDIUM ? '' : '#ffcf00',
        overflowY: display ? screenSize >= ScreenSize.MEDIUM ? 'none' : 'auto' : 'hidden',
        overflowX: 'hidden',
        transform: screenSize >= ScreenSize.MEDIUM ? 'none' : display ? 'none' : 'translateX(-240px)',
        transition: screenSize >= ScreenSize.MEDIUM ? 'max-height 1s linear' : 'transform 0.5s linear',
        willChange: screenSize >= ScreenSize.MEDIUM ? 'max-height' : 'transform'
      }
    }
    return (
      <div style={styles.navigation} id='scroll'
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <NavigationButton onClick={this.props.onClick} link='/' text='Home' iconSrc='/img/home.svg' iconColor='dark' />
        <NavigationButton onClick={this.props.onClick} link='/courses' text='Courses' iconSrc='/img/courses.png' iconColor='dark' />
        {
          screenSize < ScreenSize.MEDIUM &&
          <SubNavigationButton onClick={this.props.onClick} link='/courses/filter' text='Filter' iconSrc='/img/filter.svg' iconColor='dark' />
        }
        {
          !process.env.ELECTRON &&
          <NavigationButton onClick={this.props.onClick} link='/courses64' text='Courses64' iconSrc='/img/mario64.png' iconColor='dark' />
        }
        <NavigationButton onClick={this.props.onClick} link='/upload' text='Upload' iconSrc='/img/upload.png' iconColor='dark' />
        {
          !process.env.ELECTRON &&
          <NavigationButton onClick={this.props.onClick} link='/upload64' text='Upload64' iconSrc='/img/upload64.png' iconColor='dark' />
        }
        {
          !process.env.ELECTRON &&
          <NavigationButton onClick={this.props.onClick} link='/net64' text='Net64' iconSrc='/img/net64.svg' iconColor='dark' />
        }
        <NavigationButton onClick={this.props.onClick} link='/profile' text='Profile' iconSrc='/img/profile.png' iconColor='dark' />
        {
          !process.env.ELECTRON &&
          <NavigationButton onClick={this.props.onClick} link='/faq' text='FAQ' iconSrc='/img/help.png' iconColor='dark' />
        }
        {
          !process.env.ELECTRON &&
          <NavigationButton onClick={this.props.onClick} link='/social' text='Social' iconSrc='/img/social.svg' iconColor='dark' />
        }
        {
          !process.env.ELECTRON &&
          <NavigationButton onClick={this.props.onClick} link='https://github.com/Tarnadas/smmdb' blank text='API' iconSrc='/img/api.png' iconColor='dark' />
        }
        {
          !process.env.ELECTRON && (
          <NavigationButton onClick={this.props.onClick} link='https://github.com/Tarnadas/cemu-smmdb/releases' blank text='Client' iconSrc='/img/client.png' iconColor='dark' />
        )
        }
        <div style={{height: '20px', minHeight: '20px'}} />
        {
          screenSize < ScreenSize.MEDIUM && !process.env.ELECTRON && <LoginButton onClick={this.props.onClick} />
        }
        <div style={{height: '70px', minHeight: '70px'}} />
      </div>
    )
  }
}
export default connect(state => ({
  screenSize: state.getIn(['mediaQuery', 'screenSize'])
}))(NavigationArea)
