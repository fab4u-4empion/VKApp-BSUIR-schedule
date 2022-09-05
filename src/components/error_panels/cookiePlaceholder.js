import React from "react";
import {
  	AdaptivityProvider,
	ConfigProvider,
	useAdaptivity,
	AppRoot,
	SplitLayout,
	SplitCol,
	ViewWidth,
	PanelHeader,
    Placeholder
} from "@vkontakte/vkui";
import { Icon56ErrorOutline } from '@vkontakte/icons';
import ErrorBoundary from "./errorBoundary";

const CookiePlaceholder = () => {
    const { viewWidth } = useAdaptivity()

    return (
        <ConfigProvider>
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout header={<PanelHeader separator={false} />}>
                        <SplitCol spaced={viewWidth && viewWidth > ViewWidth.MOBILE}>
                            <Placeholder Placeholder
                                stretched
                                icon={<Icon56ErrorOutline fill={'var(--dynamic_red)'} />}
                            >
                                Сервис не может работать с выключенными Cookie <br /> или в режиме инкогнито
                            </Placeholder>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
};

export default CookiePlaceholder