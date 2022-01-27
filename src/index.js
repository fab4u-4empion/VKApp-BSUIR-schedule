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
import ErrorBoundary from "./error_panels/errorBoundary";
import CookiePlaceholder from "./error_panels/cookiePlaceholder";

// Init VK  Mini App
bridge.send("VKWebAppInit");

bridge.subscribe((e) => {
    if (e.detail.type === "VKWebAppUpdateConfig") {
        document.body.setAttribute("scheme", e.detail.data.scheme);
    }
});

const App = lazy(() => import('./App'))

const Index = () => {
    return (
        <ConfigProvider>
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
    ReactDOM.render(<Index/>, document.getElementById("root"));
} catch {
    ReactDOM.render(<CookiePlaceholder/>, document.getElementById("root"));
}

// if (process.env.NODE_ENV === "development") {
// 	import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
