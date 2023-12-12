import * as React from 'react';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { createTheme, styled } from '@mui/material';

function MySnackBar({isAns, ans, nick} : {isAns : boolean, ans : string, nick : string}) {
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if(isAns)
        handleClick('success')
    else
        handleClick('error')
  }, [ans]);

  const handleClick = (variant: VariantType) => {
    if(ans === '')
        return; 
    let message = `${nick} : ${ans}`;
    enqueueSnackbar(message, { 
      variant: 'default',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      style: {  
        width: '20vw',
        height: '7vh',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '1.5vw',
        userSelect:'none', 
        backgroundColor:'rgb(0,0,0,0.5)',
        borderRadius:'13px',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }
    });
  };

  return (
    <></>
  );
}

export default function IntegrationNotistack(props : {isAns : boolean, ans : string, nick : string}) {
  return (
    <SnackbarProvider maxSnack={10} >
      <MySnackBar isAns={props.isAns} ans={props.ans} nick={props.nick}/>
    </SnackbarProvider>
  );
}