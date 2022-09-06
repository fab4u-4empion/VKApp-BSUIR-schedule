import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import {
  	AdaptivityProvider,
	ConfigProvider,
	AppRoot,
    ScreenSpinner,
    usePlatform,
    VKCOM
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./styles/styles.css"
import ErrorBoundary from "./components/error_panels/errorBoundary";
import CookiePlaceholder from "./components/error_panels/cookiePlaceholder";
import { СontextProvider } from './context/context'

const App = lazy(() => import('./App'))

const Index = () => {
    const platform = usePlatform()
    return (
        <СontextProvider>
            <ConfigProvider platform={platform === VKCOM ? "android" : platform}>
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
        </СontextProvider>
    );
};

try {
    localStorage.setItem('test', 'test')
    sessionStorage.setItem("groupsFavorite", JSON.stringify([]))
    sessionStorage.setItem("teachersFavorite", JSON.stringify([]))
    bridge
        .send("VKWebAppStorageGet", { "keys": ["groupsFavorite", "teachersFavorite"] })
        .then(e => {
            console.log(e);
            if (e.keys[0].value) {
                sessionStorage.setItem("groupsFavorite", e.keys[0].value)
            }
            if (e.keys[1].value) {
                sessionStorage.setItem("teachersFavorite", e.keys[1].value)
            }
            bridge.send("VKWebAppInit");

            bridge.subscribe((e) => {
                if (e.detail.type === "VKWebAppUpdateConfig") {
                    document.body.setAttribute("scheme", e.detail.data.scheme);
                }
            });
            history.pushState({
                activeStory: "favorites",
                searchValue: "",
                isSearch: false,
                favorites_activePanel: "favorites-list",
                body_overflow: "visible"
            }, "")
            ReactDOM.render(<Index />, document.getElementById("root"));
        })
    // history.pushState({
    //     activeStory: "favorites",
    //     searchValue: "",
    //     isSearch: false,
    //     favorites_activePanel: "favorites-list",
    //     body_overflow: "visible"
    // }, "")
    // ReactDOM.render(<Index/>, document.getElementById("root"));
} catch {
    ReactDOM.render(<CookiePlaceholder/>, document.getElementById("root"));
}

import("./eruda").then(({ default: eruda }) => { }); //runtime download

// if (process.env.NODE_ENV === "development") {
// 	import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
