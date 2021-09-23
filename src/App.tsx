import './App.css'
import storeList from 'utils/dummy/store.json';
import { useState } from "react"
import axios, { AxiosResponse } from 'axios'

interface Store {
  code: number
  name: string
  address: string
}

function App() {
  const [data, setData] = useState<Store[]>([])
  const search = () => {
    axios.get('https://jsonplaceholder.typicode.com/pasts').then((res: AxiosResponse) => {
      setData(res.data)
    }).catch(() => {
      setData(storeList)
    })
  }
  return (
    <div className="App">
      <button className="searchBtn" onClick={search}>検索</button>
      <ul>{data.map((store: Store) => <li key={store.code}> {store.name} </li>)}</ul>
    </div>
  );
}

export default App;
