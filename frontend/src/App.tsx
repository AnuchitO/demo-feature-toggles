import { Accounts } from './Accounts'
import { MonthlyDropdown } from './MonthlyDropdown'
import "./App.css"
import icon from './icon-transfer.svg'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { commaSeparated } from './formater'

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 100,
    paddingLeft: 32,
    paddingRight: 32,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 36,
    padding: '0 30px',
    textTransform: 'none',
  },
});

interface TransactionProps {
  type: string;
  date: string;
  amount: number;
}

const Transaction = ({ type = "Activity", date = "18 Jan 2025 15:03", amount = 0 }: TransactionProps) => {
  return <>
    <div className="flex justify-between m-4">
      <div className="flex flex-col text-left">
        <p className="font-thin text-gray text-sm font-os">{type}</p>
      </div>
      <div className="flex flex-col text-right">
        <p className="font-thin text-gray-400 text-xs/6 tracking-tighter font-os">{date}</p>
        {amount >= 0 && <p className="font-thin text-green-400 text-sm font-os">+{commaSeparated(amount)}</p>}
        {amount < 0 && <p className="font-thin text-red-400 text-sm font-os">{commaSeparated(amount)}</p>}
      </div>
    </div>
  </>
}


const App = () => {
  const classes = useStyles();

  const onClick = () => {
    alert('transfer')
  }

  return <>
    <div>
      <div className="rounded-2xl overflow-hidden shadow-lg">
        {/* <div className="flex justify-center bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" > */}
        <div className="flex flex-col justify-center" >
          <div>
            <Accounts />
          </div>
          <div>
            <Button className={classes.root}
              startIcon={<img src={icon} alt="transfer" className="w-6 h-6" />}
              onClick={onClick}
            > Transfer</Button>
          </div>
        </div>
        <div className="flex flex-col justify-center m-4" >
          <div className="flex justify-between m-1">
            <p className="font-black text-slate-100 text-xs">
              Transactions
            </p>
            <MonthlyDropdown />
          </div>
          <div className="w-80 h-40 rounded-lg shadow-lg" >
            <Transaction type={"Transfer in"} date={"10 Jan 2025 14:22"} amount={498200} />
            <hr className="border-t border-gray-500 m-4" />
            <Transaction type={"Transfer out"} date={"16 Jan 2025 11:35"} amount={-293000} />
            <p className="font-black text-gray-500  text-sm">
              End of this month's transactions
            </p>
          </div>
        </div>
      </div>
    </div >
  </>
}
export default App;
