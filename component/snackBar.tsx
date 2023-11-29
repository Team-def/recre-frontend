import * as React from 'react';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

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
        minWidth: '10vw',
        minHeight: '4vw',
        fontSize: '2vw',
      }
    });
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