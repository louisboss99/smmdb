import React from 'react'
import {
    connect
} from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import request from 'request-promise'

import * as url from 'url'

import {
    setCourses
} from '../../actions'
import {
    domain
} from '../../renderer'

import CoursePanel from '../panels/CoursePanel'

class MainView extends React.PureComponent {
    constructor (props) {
        super(props);
        this.renderCourses = this.renderCourses.bind(this);
    }
    componentDidMount () {
        (async () => {
            const courses = JSON.parse(await request({
                url: url.resolve(domain, '/api/getcourses')
            }));
            this.props.dispatch(setCourses(courses));
        })();
    }
    renderCourses (courses) {
        return Array.from((function * () {
            for (let i in courses) {
                yield (
                    <CoursePanel course={courses[i]} key={i} />
                )
            }
        })());
    }
    render () {
        console.log(this.props.courses);
        const styles = {
            main: {
                marginTop: '30px',
                width: 'calc(100% - 240px)',
                height: 'calc(100% - 60px)',
                overflow: 'hidden'
            },
            flex: {
                color: '#fff',
                overflow: 'hidden',
                display: 'flex'
            }
        };
        return (
            <div style={styles.main}>
                <div style={styles.flex}>
                    <Scrollbars style={{height: '100%'}}>
                        {
                            this.renderCourses(this.props.courses)
                        }
                    </Scrollbars>
                </div>
            </div>
        )
    }
}
export default connect(state => {
    const courses = state.get('courseData').toJS();
    return {
        courses
    }
})(MainView);