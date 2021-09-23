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
  const [storeName, setStoreName] = useState('')
  const search = () => {
    axios.get('https://jsonplaceholder.typicode.com/pasts').then((res: AxiosResponse) => {
      setData(res.data)
    }).catch(() => {
      setData(storeList)
    })
  }

  const onChangeValue = (el: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(el.target.value)
  }
  return (
    <div className="App">
      <div className="form">
        <input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeValue(e)}
        />
        <p>{storeName}</p>
      </div>
      <button className="searchBtn" onClick={search}>検索</button>
      <ul>{data.map((store: Store) => <li key={store.code}> {store.name} </li>)}</ul>
    </div>
  );
}

export default App;
