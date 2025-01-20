import icon from './icon-cancel.svg'
import iconDisable from './icon-cancel-disable.svg'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #2F2F2F 30%, #64748b 90%)',
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
  onClick: () => void;
  disabled?: boolean;
}


export const CancelButton = ({ onClick, label = "Cancel", disabled = false }: Props) => {
  const classes = useStyles();

  if (disabled) {
    return <>
      <Button className={classes.root} disabled
        startIcon={<img src={iconDisable} alt={label} className="w-6 h-6" />}
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

