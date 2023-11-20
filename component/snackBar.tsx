import * as React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

function MySnackBar({isAns, ans, nick} : {isAns : boolean, ans : string, nick : string}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (variant: VariantType) => {
    if(ans === '')
        return; 
    let message = `${nick} : ${ans}`;
    if(isAns)
        enqueueSnackbar(message, { variant });
    else
        enqueueSnackbar(message);
  };

  const handleClickVariant = (variant: VariantType) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('This is a success message!', { variant });
  };

  return (
    <></>
  );
}

export default function IntegrationNotistack(props : {isAns : boolean, ans : string, nick : string}) {
  return (
    <SnackbarProvider maxSnack={10}>
      <MySnackBar isAns={props.isAns} ans={props.ans} nick={props.nick}/>
    </SnackbarProvider>
  );
}