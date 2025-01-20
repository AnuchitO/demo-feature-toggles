import icon from './icon-transfer.svg'
import iconDisabled from './icon-transfer-disable.svg'
import iconLoading from './icon-loading.png'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #1E40AF 30%, #0EA5E9 90%)',
    border: 0,
    borderRadius: 100,
    marginLeft: 8,
    marginRight: 8,
    paddingLeft: 32,
    paddingRight: 32,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 36,
    padding: '0 30px',
    textTransform: 'none',
  },
});

interface Props {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}


export const TransferButton = ({ onClick, disabled = false, loading = false, label = "Transfer" }: Props) => {
  const classes = useStyles();

  if (loading) {
    return <>
      <Button className={classes.root} disabled
        startIcon={<img src={iconLoading} alt={label} className="animate-spin w-6 h-6" />}
      > {label}</Button>
    </>
  }

  if (disabled) {
    return <>
      <Button className={classes.root} disabled
        startIcon={<img src={iconDisabled} alt={label} className="w-6 h-6" />}
      > {label}</Button>
    </>
  }

  return <>
    <Button className={classes.root}
      startIcon={<img src={icon} alt={label} className="w-6 h-6" />}
      onClick={onClick}
    > {label}</Button>
  </>
}
