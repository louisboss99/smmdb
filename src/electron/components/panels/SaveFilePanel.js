import React from 'react'

export default class SaveFilePanel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      hover: false
    }
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.onClick = this.onClick.bind(this)
  }
  mouseEnter () {
    this.setState({
      hover: true
    })
  }
  mouseLeave () {
    this.setState({
      hover: false
    })
  }
  onClick () {
    if (this.props.onClick) this.props.onClick(this.props.course, this.props.save, this.props.courseId)
  }
  render () {
    const course = this.props.course
    const path = course ? course.getPath() : null
    const isSelected = this.props.isSelected
    const styles = {
      li: {
        margin: '20px 10px',
        width: '180px',
        height: '160px',
        color: '#fff',
        overflow: 'hidden',
        cursor: 'pointer',
        background: isSelected ? '#cc0008' : '#a0a0af'
      },
      divCrop: {
        margin: '10px 0 0 10px',
        width: '160px',
        height: '90px',
        overflow: 'hidden',
        display: 'inline-block',
      },
      img: {
        width: '160px',
        height: '120px',
        backgroundColor: '#323245'
      },
      divTitle: {
        margin: '10px 0 0 10px',
        backgroundColor: '#e5e5ef',
        width: '160px',
        height: '30px',
        lineHeight: '30px',
        overflow: 'hidden',
        color: '#000',
        padding: '0 10px'
      },
      divScroll: {
        animation: 'scroll 4s linear infinite',
        width: '400px',
        height: '30px',
        lineHeight: '30px',
        display: 'block',
        position: 'relative'
      },
      divScrollPaused: {
        width: '400px',
        height: '30px',
        lineHeight: '30px',
        display: 'block',
        position: 'relative'
      }
    }
    return course ? (
      <div style={styles.li} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.onClick}>
        <div style={styles.divCrop}>
          <img style={styles.img} src={`${path}/thumbnail1.jpg`} />
        </div>
        <div style={styles.divTitle}>
          <div style={this.state.hover ? styles.divScroll : styles.divScrollPaused}>
            { course.title }
          </div>
        </div>
      </div>
    ) : (
      <div style={styles.li}>
        <div style={styles.divCrop}>
          <img style={styles.img} src='/img/noise.gif' />
        </div>
        <div style={styles.divTitle} />
      </div>
    )
  }
}
