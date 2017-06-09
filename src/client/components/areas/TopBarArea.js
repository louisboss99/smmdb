import React from 'react'

import LoginButton from '../buttons/LoginButton'
import SMMButton   from '../buttons/SMMButton'

export default class TopBarArea extends React.PureComponent{
    render () {
        const styles = {
            topbar: {
                height: '50px',
                padding: '10px',
                marginBottom: '20px'
            }
        };
        return (
            <div style={styles.topbar}>
                <LoginButton />
                <SMMButton text="Courses" iconSrc="/img/courses.png" iconColor="dark" />
                <SMMButton text="Upload" iconSrc="/img/upload.png" iconColor="dark" />
                <SMMButton text="Profile" iconSrc="/img/profile.png" iconColor="dark" />
                <SMMButton text="API" iconSrc="/img/api.png" iconColor="dark" />
                <a href="https://github.com/Tarnadas/cemu-smmdb/releases" target="__blank">
                    <SMMButton text="Client" iconSrc="/img/client.png" iconColor="dark" />
                </a>
                <a href="https://www.reddit.com/r/CemuMarioMaker" target="__blank">
                    <SMMButton text="Reddit" iconSrc="/img/reddit.png" iconColor="dark" />
                </a>
                <a href="https://discord.gg/0wURURBfQTrjAXqh" target="__blank">
                    <SMMButton text="Discord" iconSrc="/img/discord.png" iconColor="dark" />
                </a>
            </div>
        );
    }
}