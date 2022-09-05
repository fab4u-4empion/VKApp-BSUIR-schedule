import { Icon16CancelCircleOutline } from "@vkontakte/icons"
import { Snackbar } from "@vkontakte/vkui"

export const ErrorSnackbar = ({ message, setSnackbar }) => {
    return (
        <Snackbar
            onClose={() => { setSnackbar(null) }}
            before={<Icon16CancelCircleOutline fill="var(--dynamic_red)" width={24} height={24} />}
            duration={1700}
        >
            {message}
        </Snackbar>
    )
}