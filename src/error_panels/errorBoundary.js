import { Icon56WifiOutline } from '@vkontakte/icons';
import { Placeholder, View, Panel } from '@vkontakte/vkui';
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hasError: false,
            networkError: false
        }
    }

    static getDerivedStateFromError(error) {
        console.log(error)
        return { hasError: true };
    }

    render() {
        window.addEventListener('offline', () => {
            this.setState({networkError: true})
        })

        if(this.state.hasError) {
            
            return (
                <View>
                    <Panel>
                        <Placeholder
                            stretched
                            icon={<Icon56WifiOutline fill={'var(--red)'}/>}
                        >
                            Нет подключения к интернету <br/> Включите интернет и перезагрузите приложение с очисткой кэша
                        </Placeholder>
                    </Panel>
                </View>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary