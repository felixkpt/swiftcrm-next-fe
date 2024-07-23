'use client'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

type Props = {
    action: 'open' | 'close' | 'toggle'
}

const Toggler = ({ action = 'open' }: Props) => {

    const handleClick = () => {
        const appLeftDrawer = document.getElementById('appLeftDrawer')
        console.log(action, appLeftDrawer)
        if (appLeftDrawer) {
            if (action == 'toggle') {
                const width = window.innerWidth
                if (width > 1027) {
                    appLeftDrawer.classList.toggle('drawer-toggle')

                } else {
                    appLeftDrawer.classList.add('drawer-toggle')

                }
                console.log(width)
                // appLeftDrawer.classList.add('drawer-close')
            } else {
                appLeftDrawer.classList.add('drawer-toggle')
            }
        }
    }

    return (
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleClick}
        >
            <MenuIcon />
        </IconButton>
    )
}

export default Toggler