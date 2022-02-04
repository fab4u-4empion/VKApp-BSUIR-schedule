import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import {
  	AdaptivityProvider,
	ConfigProvider,
	AppRoot,
    ScreenSpinner,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./styles/styles.css"
import ErrorBoundary from "./error_panels/errorBoundary";
import CookiePlaceholder from "./error_panels/cookiePlaceholder";

const App = lazy(() => import('./App'))

const Index = () => {
    return (
        <ConfigProvider platform="android">
            <AdaptivityProvider>
                <AppRoot>
                    <ErrorBoundary>
                        <Suspense fallback={<ScreenSpinner/>}>
                            <App/>
                        </Suspense>
                    </ErrorBoundary>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
};

try {
    localStorage.setItem('test', 'test')
    bridge
        .send("VKWebAppStorageGet", { "keys": ["groupsFavorite"] })
        .then(e => {
            if (e.keys[0].value) {
                sessionStorage.setItem("groupsFavorite", e.keys[0].value)
            }
            bridge.send("VKWebAppInit");

            bridge.subscribe((e) => {
                if (e.detail.type === "VKWebAppUpdateConfig") {
                    document.body.setAttribute("scheme", e.detail.data.scheme);
                }
            });
            ReactDOM.render(<Index />, document.getElementById("root"));
        })
    ReactDOM.render(<Index/>, document.getElementById("root"));
} catch {
    ReactDOM.render(<CookiePlaceholder/>, document.getElementById("root"));
}

import("./eruda").then(({ default: eruda }) => { }); //runtime download

// if (process.env.NODE_ENV === "development") {
// 	import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
