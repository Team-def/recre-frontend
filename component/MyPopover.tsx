import { Alert, AlertTitle } from '@mui/material';
import Popover from '@mui/material/Popover';
import Image from 'next/image';
import React, { useRef } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { anchorElAtom } from '@/app/modules/popoverAtom';
import { useAtom } from 'jotai';

function MyPopover({url}: {url: string}) {
    const [anchorEl, setAnchorEl] = useAtom(anchorElAtom);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    return(<><Popover
    id={id}
    open={openPopover}
    anchorEl={anchorEl}
    onClose={handleClose}
    autoFocus={true}
    anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    sx={{zIndex:1800}}
>
        <div className='QR-code-ans'>
            <Image src={`https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=${url}`} alt="QR" layout='fill' unoptimized={true} />
        </div>
    </Popover>
        <style jsx>{`
            .QR-code-ans{
                width: 10vw;
                height: 10vw;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            `}</style>
        </>)
}

MyPopover.propTypes = {
    url: PropTypes.object.isRequired,
  }

export default React.memo(MyPopover);