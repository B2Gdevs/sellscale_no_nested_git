import './App.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import LottieControl from './components/lottie_banner'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/**
 * 
 * @param {*} user_id is the id of th user creating the order
 * @param {*} selectedTicker the symbol of the ticker to purchase
 * @param {*} selectedQuantity the number of shares to purchase
 * @param {*} price the price of the purchase
 * @param {*} errorSetter a global dom error handler
 */
async function createOrder(user_id, selectedTicker, selectedQuantity, price, errorSetter) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        "ticker_name": selectedTicker,
        "user_id": user_id,
        "quantity": parseInt(selectedQuantity),
        "price": price

      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log({
      "ticker_name": selectedTicker,
      "user_id": user_id,
      "quantity": parseInt(selectedQuantity),
      "price": price

    })

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log('result is: ', JSON.stringify(result, null, 4));

  } catch (err) {
    errorSetter(err.message);
  }
}

/**
 * 
 * @param {*} tickerSymbol the symbol of the ticker
 * @param {*} dataSetter the function to set data to be used by other components
 * @param {*} errorSetter a global dom error handler
 * @param {*} loaderSetter a global dom loading value setter (determines when something is finished loading)
 */
async function getTickerInfo(tickerSymbol, dataSetter, errorSetter, loaderSetter) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/tickers/${tickerSymbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log('result is: ', JSON.stringify(result, null, 4));

    dataSetter(result);
  } catch (err) {
    errorSetter(err.message);
  } finally {
    loaderSetter(false);
  }
}

/**
 * 
 * @param {*} dataSetter the function to set data to be used by other components
 * @param {*} errorSetter a global dom error handler
 * @param {*} loaderSetter a global dom loading value setter (determines when something is finished loading)
 */
async function getTickers(dataSetter, errorSetter, loaderSetter) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/tickers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log('result is: ', JSON.stringify(result, null, 4));

    dataSetter(result);
  } catch (err) {
    errorSetter(err.message);
  } finally {
    loaderSetter(false);
  }
}

/**
 * 
 * @param {*} dataSetter the function to set data to be used by other components
 * @param {*} errorSetter a global dom error handler
 * @param {*} loaderSetter a global dom loading value setter (determines when something is finished loading)
 */
async function getOrders(dataSetter, errorSetter, loaderSetter) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log('result is: ', JSON.stringify(result, null, 4));

    dataSetter(result);
  } catch (err) {
    errorSetter(err.message);
  } finally {
    loaderSetter(false);
  }
}

/**
 * 
 * @param {*} dict of props for global error handling, loading, and setting changed values 
 * @returns 
 */
function TickerDropDown({ setIsLoading, setErr, onChange, selectedValue }) {
  const [tickers, setTickers] = useState();

  useEffect(() => {
    setIsLoading(true);
    getTickers(setTickers, setErr, setIsLoading);

  }, [])
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">ticker</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedValue || "MSFT"}
        label="TickerSymbol"
        onChange={(event) => { onChange(event.target.value); console.log(event.target.value) }}
      >
        {tickers && (
          tickers.map((ticker) => {
            return (
              <MenuItem key={ticker} value={ticker}>{ticker}</MenuItem>
            )
          })

        )}
      </Select>
    </FormControl>
  );
}


/**
 * The entry point to the entire app.
 */
function App() {
  const [orders, setOrders] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTickerInfo, setSelectedTickerInfo] = useState(false);
  const [selectedQuantity, setQuantity] = useState(0);
  const [selectedTicker, setSelectedTicker] = useState("MSFT");
  const [createdOrder, setCreatedOrder] = useState({});
  const [err, setErr] = useState('');
  const viewOrdersHandler = async () => {
    // Create order
    setIsLoading(true);
    getOrders(setOrders, setErr, setIsLoading)
  };
  const createOrderHandler = async () => {
    // hard coding user id to 1, we can change later
    setCreatedOrder(createOrder(1, selectedTicker, selectedQuantity, selectedTickerInfo.currentPrice, setErr))
  };
  const viewTickerHandler = async () => {
    getTickerInfo(selectedTicker, setSelectedTickerInfo, setErr, setIsLoading)
  };

  return (
    <Grid container sx={{
      bgcolor: '#EDF7F4',
      paddingBottom: 100
    }}>
      <Grid container item xs={12} sm={12} md={12} lg={12} sx={{
        height: 100,
        marginBottom: 20,
        bgcolor: '#EDF7F4',
      }}
        alignItems="center"
        justifyContent="center">
        <Grid item xs={12} sm={12} md={12} lg={3} >
          <h1>StachO Trades</h1>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={8} >

          <LottieControl></LottieControl>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={6}>
        <TickerDropDown setIsLoading={setIsLoading} setErr={setErr} onChange={setSelectedTicker} selectedValue={selectedTicker} />
        <Button variant="contained" onClick={viewTickerHandler} sx={{ bgcolor: '#FFA500', borderRadius: 20}}>View Ticker Info</Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Ticker Symbol</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {selectedTickerInfo.symbol}
                </TableCell>
                <TableCell align="right">{selectedTickerInfo.currentPrice}</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>



        <TextField
          style={{ width: "200px", margin: "5px" }}
          type="number"
          label="quantity"
          variant="outlined"
          onChange={(event) => { setQuantity(event.target.value) }}
        />
        <div>

          <Button variant="contained" sx={{ bgcolor: '#FFA500', borderRadius: 20 }} onClick={createOrderHandler}>Purchase</Button>
        </div>
      </Grid>
      <Grid item lg={6}>
        <Button variant="contained" onClick={viewOrdersHandler}
          sx={{
            height: 75,
            width: "100%",
            marginBottom: 20,
            borderRadius: 20,
            bgcolor: '#FFA500'

          }}
        >View Orders</Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Company</TableCell>
                <TableCell align="right">Purchaser</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {orders && (orders.map((order) => {
                return (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {order.order_id}
                    </TableCell>
                    <TableCell align="right">{order.ticker_name}</TableCell>
                    <TableCell align="right">{order.user_id}</TableCell>
                    <TableCell align="right">{order.quantity}</TableCell>
                    <TableCell align="right">{order.price}</TableCell>
                    <TableCell align="right">{order.total}</TableCell>
                  </TableRow>
                )
              }))}

            </TableBody>
          </Table>
        </TableContainer>
      </Grid>


    </Grid>
  );
};

export default App;
