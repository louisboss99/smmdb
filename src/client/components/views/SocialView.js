import React from 'react'
import {
  connect
} from 'react-redux'

import SMMButton from '../buttons/SMMButton'
import {
  ScreenSize
} from '../../reducers/mediaQuery'

class SocialView extends React.PureComponent {
  render () {
    const screenSize = this.props.screenSize
    const styles = {
      social: {
        height: '100%',
        padding: '3% 5%',
        color: '#000',
        display: 'flex',
        textAlign: 'left',
        flexDirection: 'column',
        overflow: screenSize < ScreenSize.MEDIUM ? 'hidden' : 'auto'
      },
      main: {
        flex: '1 0 0%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: screenSize === ScreenSize.SUPER_SMALL ? '20px 10px' : '20px',
        fontSize: '16px',
        backgroundColor: 'rgba(59,189,159,1)',
        boxShadow: '0px 0px 10px 10px rgba(59,189,159,1)'
      },
      header: {
        width: '100%',
        margin: '6px 0',
        fontSize: '18px',
        padding: '6px 12px',
        backgroundColor: '#fff8af',
        borderRadius: '6px',
        border: '4px solid #f8ca00',
        boxShadow: '0 0 0 4px black'
      },
      content: {
        width: '100%',
        margin: '10px 0 26px 0',
        fontSize: '14px',
        lineHeight: '20px'
      }
    }
    return (
      <div style={styles.social} id='scroll'>
        <div style={styles.main}>
          <div style={styles.header}>
            Links
          </div>
          <div style={styles.content}>
            You can visit us on the following platforms<br /><br />
            <SMMButton link='https://www.reddit.com/r/CemuMarioMaker' blank text='Reddit' iconSrc='/img/reddit.svg' iconColor='bright' />
            <SMMButton link='https://discord.gg/SPZsgSe' blank text='Discord' iconSrc='/img/discord.svg' iconColor='bright' />
          </div>
          <div style={styles.header}>
            Support me
          </div>
          <div style={styles.content}>
            Any support is greatly appreciated and helps me keep the website going<br /><br />
            <SMMButton link='https://paypal.me/MarioReder' blank text='Paypal' iconSrc='/img/paypal.svg' padding='4px' />
            <SMMButton link='https://flattr.com/profile/Tarnadas' blank noText iconSrc='/img/flattr.svg' padding='4px' iconColor='bright' />
            <SMMButton link='https://ko-fi.com/A0843EPC' blank text='Ko-Fi' iconSrc='/img/kofi.svg' iconColor='dark' padding='4px' />
          </div>
          <div style={styles.header}>
            Affiliates
          </div>
          <div style={styles.content}>
            Here are all our affiliate links. If you want to become an affiliate, please contact the webmaster<br /><br />
            <SMMButton link='https://sm64o.com/' blank text='Net64 Forum' iconSrc='/img/sm64o.png' iconColor='bright' noText />
            <SMMButton link='http://mariomods.net/' blank text='Mario Making Mods' iconSrc='/img/MMM.png' iconColor='bright' noText />
            <SMMButton link='http://sm64hacks.com/' blank text='Super Mario 64 Hacks' iconSrc='/img/sm64hacks.png' iconColor='bright' noText />
          </div>
        </div>
      </div>
    )
  }
}
export default connect(state => ({
  screenSize: state.getIn(['mediaQuery', 'screenSize'])
}))(SocialView)
