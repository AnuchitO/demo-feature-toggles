import { Accounts } from './Accounts'
import "./App.css"
import icon from './icon-transfer.svg'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 100,
    paddingLeft: 32,
    paddingRight: 32,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    textTransform: 'none',
  },
});


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
        <div className="text-center mt-8 mb-2 font-quick">
          <h1 className="font-black text-gray-700 tracking-wide text-xl">
            Banks are supported
          </h1>
          <p className="font-bold text-gray-500">including yours</p>
        </div>
        <div className="p-8 flex justify-center">hello</div>
      </div>
    </div >
  </>
}
export default App;
