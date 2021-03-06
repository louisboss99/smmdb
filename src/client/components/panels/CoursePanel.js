import React from 'react'
import LazyLoad from 'react-lazyload'
import {
  connect
} from 'react-redux'
import got from 'got'
import QRCode from 'qrcode'

import { resolve } from 'url'

import CourseDownloadButton from '../buttons/CourseDownloadButton'
import CourseVideoButton from '../buttons/CourseVideoButton'
import SMMButton, { COLOR_SCHEME } from '../buttons/SMMButton'
import ReuploadArea from '../areas/ReuploadArea'
import UploadImageArea from '../areas/UploadImageArea'
import {
  ScreenSize
} from '../../reducers/mediaQuery'
import {
  domain
} from '../../../static'
import {
  setCourse, setCourseSelf, setCourseUploaded
} from '../../actions'
import {
  DIFFICULTY
} from '../../reducers/courseData'

const MAX_LENGTH_TITLE = 32
const MAX_LENGTH_MAKER = 10
const MAX_LENGTH_NNID = 19
const MAX_LENGTH_VIDEOID = 12
const VIDEO_ID = /^[a-z0-9A-Z| |.|\\_|\\-]+$/

class CoursePanel extends React.PureComponent {
  constructor (props) {
    super(props)
    const course = props.course.toJS()
    this.state = {
      showDetails: false,
      changed: false,
      saved: false,
      title: course.title,
      maker: course.maker,
      nnId: course.nintendoid ? course.nintendoid : '',
      videoId: course.videoid ? course.videoid : '',
      difficulty: course.difficulty,
      shouldDelete: false
    }
    this.onShowDetails = this.onShowDetails.bind(this)
    this.onHideDetails = this.onHideDetails.bind(this)
    this.onCourseSubmit = this.onCourseSubmit.bind(this)
    this.onCourseDelete = this.onCourseDelete.bind(this)
    this.onTitleChange = this.onStringChange.bind(this, 'title', MAX_LENGTH_TITLE)
    this.onMakerChange = this.onStringChange.bind(this, 'maker', MAX_LENGTH_MAKER)
    this.onNintendoIdChange = this.onStringChange.bind(this, 'nnId', MAX_LENGTH_NNID)
    this.onVideoIdChange = this.onStringChange.bind(this, 'videoId', MAX_LENGTH_VIDEOID)
    this.onDifficultyChange = this.onSelectChange.bind(this, 'difficulty')
    this.onReuploadComplete = this.onReuploadComplete.bind(this)
    this.onUploadFullComplete = this.onUploadFullComplete.bind(this)
    this.onUploadPrevComplete = this.onUploadPrevComplete.bind(this)
    this.onStar = this.onStar.bind(this)
  }
  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.course.get('title') !== this.state.title) {
      this.setState({
        title: nextProps.course.get('title')
      })
    }
    if (nextProps.course.get('maker') !== this.state.maker) {
      this.setState({
        maker: nextProps.course.get('maker')
      })
    }
    if (nextProps.course.get('nintendoid') !== this.state.nnId) {
      this.setState({
        nnId: nextProps.course.get('nintendoid') ? nextProps.course.get('nintendoid') : ''
      })
    }
    if (nextProps.course.get('videoid') !== this.state.videoId) {
      this.setState({
        videoId: nextProps.course.get('videoid') ? nextProps.course.get('videoid') : ''
      })
    }
    if (nextProps.course.get('difficulty') !== this.state.difficulty) {
      this.setState({
        difficulty: nextProps.course.get('difficulty')
      })
    }
  }
  onShowDetails (e) {
    e.stopPropagation()
    if (!this.state.showDetails) {
      this.setState({
        showDetails: true,
        shouldDelete: false
      })
    }
  }
  onHideDetails () {
    this.setState({
      showDetails: false
    })
  }
  onCourseSubmit () {
    const course = this.props.course.toJS()
    if (this.state.title === course.title &&
      this.state.maker === course.maker &&
      this.state.nnId === course.nintendoid &&
      this.state.videoId === course.videoid &&
      this.state.difficulty === course.difficulty) return;
    (async () => {
      try {
        const update = {
          title: this.state.title,
          maker: this.state.maker,
          nintendoid: this.state.nnId,
          videoid: this.state.videoId,
          difficulty: this.state.difficulty
        }
        if (!VIDEO_ID.test(update.videoid) && update.videoid !== '') {
          delete update.videoid
        }
        const res = (await got(resolve(domain, `/api/updatecourse?id=${course.id}`), {
          headers: {
            'Authorization': `APIKEY ${this.props.apiKey}`
          },
          method: 'POST',
          body: update,
          json: true,
          useElectronNet: false
        })).body
        if (this.props.uploaded) {
          this.props.dispatch(setCourseUploaded(this.props.id, res))
        } else {
          if (this.props.isSelf) {
            this.props.dispatch(setCourseSelf(this.props.id, res))
          } else {
            this.props.dispatch(setCourse(this.props.id, res))
          }
        }
        this.setState({
          changed: false,
          saved: true
        })
      } catch (err) {
        if (err.response) {
          if (err.response.body.includes('not found')) {
            this.props.onCourseDelete(this.props.id)
          } else {
            console.error(err.response.body)
          }
        } else {
          console.error(err)
        }
      }
    })()
  }
  onCourseDelete () {
    if (this.state.shouldDelete) {
      (async () => {
        try {
          await got(resolve(domain, `/api/deletecourse?id=${this.props.course.get('id')}`), {
            headers: {
              'Authorization': `APIKEY ${this.props.apiKey}`
            },
            useElectronNet: false
          })
          this.props.onCourseDelete(this.props.id)
        } catch (err) {
          if (err.response.body.includes('not found')) {
            this.props.onCourseDelete(this.props.id)
          } else {
            console.error(err.response.body)
          }
        }
      })()
    } else {
      this.setState({
        shouldDelete: true
      })
    }
  }
  onStringChange (value, limit, e) {
    let val = e.target.value
    if (val.length > limit) {
      val = val.substr(0, limit)
    }
    const res = {
      changed: true,
      saved: false
    }
    res[value] = val
    this.setState(res)
  }
  onSelectChange (value, e) {
    const val = e.target.value
    const res = {
      changed: true,
      saved: false
    }
    res[value] = val
    this.setState(res)
  }
  onReuploadComplete (course) {
    if (this.props.uploaded) {
      this.props.dispatch(setCourseUploaded(this.props.id, course))
    } else {
      if (this.props.isSelf) {
        this.props.dispatch(setCourseSelf(this.props.id, course))
      } else {
        this.props.dispatch(setCourse(this.props.id, course))
      }
    }
  }
  onUploadFullComplete (course) {
    if (this.props.uploaded) {
      this.props.dispatch(setCourseUploaded(this.props.id, course))
    } else {
      if (this.props.isSelf) {
        this.props.dispatch(setCourseSelf(this.props.id, course))
      } else {
        this.props.dispatch(setCourse(this.props.id, course))
      }
    }
  }
  onUploadPrevComplete (course) {
    if (this.props.uploaded) {
      this.props.dispatch(setCourseUploaded(this.props.id, course))
    } else {
      if (this.props.isSelf) {
        this.props.dispatch(setCourseSelf(this.props.id, course))
      } else {
        this.props.dispatch(setCourse(this.props.id, course))
      }
    }
  }
  async onStar (e) {
    e.stopPropagation()
    try {
      const course = (await got(resolve(domain, `/api/starcourse?id=${this.props.course.get('id')}`), {
        headers: {
          'Authorization': `APIKEY ${this.props.apiKey}`
        },
        method: 'POST',
        json: true,
        useElectronNet: false
      })).body
      if (course != null) {
        if (this.props.uploaded) {
          this.props.dispatch(setCourseUploaded(this.props.id, course))
        } else {
          if (this.props.isSelf) {
            this.props.dispatch(setCourseSelf(this.props.id, course))
          } else {
            this.props.dispatch(setCourse(this.props.id, course))
          }
        }
      }
    } catch (err) {
      if (err.response) {
        console.error(err.response.body)
      } else {
        console.error(err)
      }
    }
  }
  render () {
    const screenSize = this.props.screenSize
    const course = this.props.course.toJS()
    const style = parseInt(course.gameStyle)
    const colorScheme = this.state.changed ? COLOR_SCHEME.RED : (this.state.saved ? COLOR_SCHEME.GREEN : COLOR_SCHEME.YELLOW)
    const modified = this.props.downloadedCourse && this.props.downloadedCourse.get('modified') !== this.props.course.lastmodified
    const p = this.props.progress && this.props.progress.toJS()
    const progress = (p && (100 * p[0] / p[1])) || (this.props.downloadedCourse && 100)
    const saveId = this.props.saveId
    const downloaded = progress === 100
    const styles = {
      panel: {
        height: this.state.showDetails ? 'auto' : '169px',
        maxWidth: '906px',
        backgroundColor: process.env.ELECTRON ? (
          downloaded ? (
            modified ? (
              '#DD8F33'
            ) : (
              saveId != null ? (
                '#6ddd83'
              ) : (
                '#9fdd96'
              )
            )
          ) : (
            '#d4dda5'
          )
        ) : (
          '#d4dda5'
        ),
        borderRadius: '10px',
        margin: '10px',
        color: '#000',
        overflow: 'hidden',
        display: 'flex'
      },
      top: {
        height: '169px',
        cursor: this.state.showDetails ? 'auto' : 'pointer',
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        verticalAlign: 'top'
      },
      rank: {
        width: '100px',
        minWidth: '100px',
        backgroundColor: '#d7db48',
        borderRadius: '10px 0 0 10px',
        display: screenSize === ScreenSize.SUPER_SMALL ? 'none' : 'block'
      },
      details: {
        width: screenSize === ScreenSize.SUPER_SMALL ? '100%' : 'calc(100% - 100px)'
      },
      theme: {
        width: '91px',
        height: '44px'
      },
      title: {
        height: '44px',
        maxWidth: 'calc(100% - 155px)',
        margin: '0 10px',
        textAlign: 'left',
        fontSize: screenSize === ScreenSize.SUPER_SMALL ? '16px' : '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: '1'
      },
      close: {
        display: this.state.showDetails ? '' : 'none',
        cursor: 'pointer',
        width: '32px',
        height: '32px',
        margin: '6px',
        backgroundColor: '#11c2b0',
        borderRadius: '5px',
        padding: '6px'
      },
      preview: {
        width: screenSize === ScreenSize.SUPER_SMALL ? '100%' : 'calc(100% - 86px)',
        height: '81px',
        overflow: 'hidden'
      },
      previewImgWrapper: {
        width: '720px',
        height: '81px',
        backgroundColor: '#cfcfab',
        textAlign: 'left'
      },
      previewImg: {
        height: '100%'
      },
      mii: {
        height: '81px',
        width: '86px',
        display: screenSize === ScreenSize.SUPER_SMALL ? 'none' : 'block'
      },
      miiImgWrapper: {
        width: '76px',
        height: '76px',
        boxShadow: '0px 5px 0px 0px rgba(0,0,0,0.4)',
        backgroundColor: '#fff',
        borderRadius: '5px'
      },
      footer: {
        height: '44px',
        width: '100%',
        lineHeight: '44px',
        fontSize: '18px',
        margin: '0 12px'
      },
      stats: {
        float: 'left',
        display: 'flex',
        alignItems: 'center',
        position: 'absolute'
      },
      statsStars: {
        width: screenSize === ScreenSize.SUPER_SMALL ? '28px' : '36px',
        height: screenSize === ScreenSize.SUPER_SMALL ? '28px' : '36px',
        margin: '0 8px',
        cursor: 'pointer'
      },
      statsDownloads: {
        width: screenSize === ScreenSize.SUPER_SMALL ? '20px' : '24px',
        height: screenSize === ScreenSize.SUPER_SMALL ? '20px' : '24px',
        margin: '0 8px'
      },
      statsText: {
        fontSize: '12px'
      },
      statsAutoScroll: {
        height: '24px',
        margin: '0 8px'
      },
      maker: {
        float: 'right',
        width: 'auto',
        display: 'flex',
        alignItems: 'center'
      },
      makerRep: {
        width: '10px',
        height: '10px',
        margin: '0 8px'
      },
      makerName: {
        color: '#000',
        fontSize: '22px',
        marginLeft: '14px'
      },
      bottom: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
      },
      edit: {
        padding: '10px',
        display: 'flex',
        flexWrap: 'wrap'
      },
      option: {
        width: '50%',
        padding: '10px',
        textAlign: 'left',
        fontSize: '16px'
      },
      input: {
        width: '100%',
        height: '32px',
        fontSize: '18px'
      },
      imgLarge: {
        maxWidth: '320px',
        maxHeight: '240px'
      },
      buttonPanel: {
        width: screenSize >= ScreenSize.MEDIUM ? 'calc(100% - 360px)' : 'auto',
        margin: screenSize < ScreenSize.MEDIUM ? '20px' : '0 20px',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }
    }
    return (
      <div style={styles.panel} onClick={this.onShowDetails}>
        <div style={styles.rank} />
        <div style={styles.details}>
          <div style={styles.top}>
            <div style={styles.theme}>
              <img src={
                style === 0 ? (
                  '/img/smb.png'
                ) : (
                  style === 1 ? (
                    '/img/smb3.png'
                  ) : (
                    style === 2 ? (
                      '/img/smw.png'
                    ) : (
                      '/img/nsmbu.png'
                    )
                  )
                )
              } />
            </div>
            <div style={styles.title}>
              { course.title }
            </div>
            <div style={styles.close} onClick={this.onHideDetails}>
              <img style={{width: '100%'}} src='/img/cancel.svg' />
            </div>
            <div style={styles.preview}>
              <div style={styles.previewImgWrapper}>
                <LazyLoad height={81} offset={100} once>
                  <img style={styles.previewImg} src={`${domain}/courseimg/${course.id}_full${course.vFull ? `?v=${course.vFull}` : ''}`} ref={v => { this.full = v }} />
                </LazyLoad>
              </div>
            </div>
            <div style={styles.mii}>
              <div style={styles.miiImgWrapper}>
                <img style={{width: '100%'}} src='/img/mii_default.png' />
              </div>
            </div>
            <div style={styles.footer}>
              <div style={styles.stats}>
                <img onClick={this.onStar} style={styles.statsStars} src={course.starred ? '/img/starred.png' : '/img/unstarred.png'} />
                { course.stars } /
                <img style={styles.statsDownloads} src='/img/downloads.png' />
                { course.downloads }
                <img style={styles.statsDownloads} src={
                  course.difficulty === 0 ? (
                    '/img/easy.png'
                  ) : (
                    course.difficulty === 1 ? (
                      '/img/normal.png'
                    ) : (
                      course.difficulty === 2 ? (
                        '/img/expert.png'
                      ) : (
                        course.difficulty === 3 ? (
                          '/img/superexpert.png'
                        ) : (
                          '/img/normal.png'
                        )
                      )
                    )
                  )
                } />
                {
                  screenSize > ScreenSize.SUPER_SMALL && (
                  <div style={styles.statsText}>
                    {
                      course.difficulty === 0 ? (
                        'easy'
                      ) : (
                        course.difficulty === 1 ? (
                          'normal'
                        ) : (
                          course.difficulty === 2 ? (
                            'expert'
                          ) : (
                            course.difficulty === 3 ? (
                              's. expert'
                            ) : (
                              '-'
                            )
                          )
                        )
                      )
                    }
                  </div>
                )}
                {
                  course.autoScroll === 1 ? (
                    <img style={styles.statsAutoScroll} src='/img/slow.png' />
                  ) : (
                    course.autoScroll === 2 ? (
                      <img style={styles.statsAutoScroll} src='/img/medium.png' />
                    ) : (
                      course.autoScroll === 3 && (
                        <img style={styles.statsAutoScroll} src='/img/fast.png' />
                      )
                    )
                  )
                }
                {
                  this.props.course.autoScrollSub === 1 ? (
                    <img style={styles.statsAutoScroll} src='/img/slow.png' />
                  ) : (
                    this.props.course.autoScrollSub === 2 ? (
                      <img style={styles.statsAutoScroll} src='/img/medium.png' />
                    ) : (
                      this.props.course.autoScrollSub === 3 && (
                        <img style={styles.statsAutoScroll} src='/img/fast.png' />
                      )
                    )
                  )
                }
              </div>
              <div style={styles.maker}>
                <div style={styles.makerName}>
                  { course.maker }
                </div>
              </div>
            </div>
          </div>
          {
            this.state.showDetails && (
            <div style={styles.bottom}>
              {
                this.props.canEdit && (
                <div style={styles.edit}>
                  <ReuploadArea courseId={course.id} upload={this.props.reupload} onUploadComplete={this.onReuploadComplete} />
                  <UploadImageArea type='full' courseId={course.id} upload={this.props.imageFull} onUploadComplete={this.onUploadFullComplete} />
                  <UploadImageArea type='prev' courseId={course.id} upload={this.props.imagePrev} onUploadComplete={this.onUploadPrevComplete} />
                  <div style={styles.option}>
                    <div style={styles.value}>
                      Title:
                    </div>
                    <input style={styles.input} value={this.state.title} onChange={this.onTitleChange} />
                  </div>
                  <div style={styles.option}>
                    <div style={styles.value}>
                      Maker:
                    </div>
                    <input style={styles.input} value={this.state.maker} onChange={this.onMakerChange} />
                  </div>
                  <div style={styles.option}>
                    <div style={styles.value}>
                      Nintendo ID:
                    </div>
                    <input style={styles.input} value={this.state.nnId} onChange={this.onNintendoIdChange} />
                  </div>
                  <div style={styles.option}>
                    <div style={styles.value}>
                      YouTube ID:
                    </div>
                    <input style={styles.input} value={this.state.videoId} onChange={this.onVideoIdChange} />
                  </div>
                  <div style={styles.option}>
                    <div style={styles.value}>
                      Estimated difficulty:
                    </div>
                    <select style={styles.input} value={this.state.difficulty} onChange={this.onDifficultyChange}>
                      <option value={DIFFICULTY.EASY}>Easy</option>
                      <option value={DIFFICULTY.NORMAL}>Normal</option>
                      <option value={DIFFICULTY.EXPERT}>Expert</option>
                      <option value={DIFFICULTY.SUPER_EXPERT}>Super Expert</option>
                    </select>
                  </div>
                  <div style={styles.option} />
                  <SMMButton text='Save' iconSrc='/img/submit.png' fontSize='13px' padding='3px' colorScheme={colorScheme} onClick={this.onCourseSubmit} />
                  <SMMButton text={this.state.shouldDelete ? 'Click again' : 'Delete'} iconSrc='/img/delete.png' fontSize='13px' padding='3px' onClick={this.onCourseDelete} />
                </div>
              )}
              <div style={styles.imageLarge}>
                <img style={styles.imgLarge} src={`${domain}/courseimg/${course.id}${course.vPrev ? `?v=${course.vPrev}` : ''}`} ref={v => { this.prev = v }} />
              </div>
              <div style={styles.buttonPanel}>
                <CourseDownloadButton courseId={course.id} lastModified={course.lastmodified} modified={modified} progress={progress} saveId={saveId} screenSize={screenSize} />
                {
                  course.videoid &&
                  <CourseVideoButton videoId={course.videoid} screenSize={screenSize} />
                }
                {
                  !process.env.ELECTRON &&
                  <img ref={qr => {
                    if (!qr) return
                    QRCode.toDataURL(resolve(domain, `/api/downloadcourse?id=${this.props.course.id}&type=3ds`), (err, url) => {
                      if (err) console.error(err)
                      qr.src = url
                    })
                  }} />
                }
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
export default connect(state => ({
  screenSize: state.getIn(['mediaQuery', 'screenSize'])
}))(CoursePanel)
