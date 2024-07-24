import PiButton, {PiButtonProps} from "./PiButton.tsx";
import {Link} from "react-router-dom";


interface PiLinkButtonProps extends PiButtonProps {
    /**
     * the path to navigate to when the button is clicked
     */
    to?: string
    /**
     * the state to pass to the page when the button is clicked
     */
    state?: any
}

/**
 * A button that extends PiButton and acts as a link to another page
 * @constructor
 */
export default function PiLinkButton({to, state, ...button_props}: PiLinkButtonProps) {
    return (
        <Link to={to ?? '/'} state={state}
              style={{
                  width: 'fit-content', padding: 0, margin: 0,
                  userSelect: 'none', cursor: 'pointer'
              }}>
            <PiButton {...button_props}/>
        </Link>
    )
}
