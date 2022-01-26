import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import {
  	AdaptivityProvider,
	ConfigProvider,
	useAdaptivity,
	AppRoot,
	SplitLayout,
	SplitCol,
	ViewWidth,
	PanelHeader,
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

const MainView = lazy(() => import('./mainView'))

const App = () => {
    const { viewWidth } = useAdaptivity()

    return (
        <ConfigProvider>
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout header={<PanelHeader separator={false} />}>
                        <SplitCol spaced={viewWidth && viewWidth > ViewWidth.MOBILE}>
                            <ErrorBoundary>
                                <Suspense fallback={<ScreenSpinner/>}>
                                    <MainView/>
                                </Suspense>
                            </ErrorBoundary>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
};

try {
    localStorage.setItem('test', 'test')
    ReactDOM.render(<App/>, document.getElementById("root"));
} catch {
    ReactDOM.render(<CookiePlaceholder/>, document.getElementById("root"));
}

// if (process.env.NODE_ENV === "development") {
// 	import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
