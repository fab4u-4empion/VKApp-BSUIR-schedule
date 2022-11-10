import { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import {
  	AdaptivityProvider,
	ConfigProvider,
	AppRoot,
    ScreenSpinner,
    usePlatform,
    WebviewType,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./styles/styles.css"
import ErrorBoundary from "./components/error_panels/errorBoundary";
import CookiePlaceholder from "./components/error_panels/cookiePlaceholder";
import { СontextProvider } from './context/context'
import axios from "axios";

const App = lazy(() => import('./App'))

const Index = () => {
    const platform = usePlatform()
    const appearance = "light"
    //platform === VKCOM ? "android" : platform
    return (
        <СontextProvider>
            <ConfigProvider appearance={appearance} platform="android" webviewType={WebviewType.INTERNAL}>
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
    bridge.send("VKWebAppInit");
    history.pushState({
        activeStory: "favorites",
        searchValue: "",
        isSearch: false,
        favorites_activePanel: "favorites-list",
        body_overflow: "visible"
    }, "")
    axios
        .get("https://iis.bsuir.by/api/v1/schedule/current-week")
        .then(response => {
            sessionStorage.setItem("week", JSON.stringify(response.data))
            ReactDOM.render(<Index />, document.getElementById("root"));
        })
} catch {
    ReactDOM.render(<CookiePlaceholder/>, document.getElementById("root"));
}

//import("./eruda").then(({ default: eruda }) => { }); //runtime download

// if (process.env.NODE_ENV === "development") {
// 	import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
