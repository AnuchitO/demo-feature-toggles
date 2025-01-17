import icon from './icon-transaction.svg'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
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
  onClick: () => void;
}


export const TransactionButton = ({ onClick }: Props) => {
  const classes = useStyles();
  return <>
    <Button className={classes.root}
      startIcon={<img src={icon} alt="transfer" className="w-6 h-6" />}
      onClick={onClick}
    > Transactions</Button>
  </>
}
