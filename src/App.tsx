import './App.scss'
import storeList from 'utils/dummy/store.json'
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

  const search = async () => {
    const res = await axios.get('http://localhost:3001/store').then((res: AxiosResponse) => {
      return res.data
    }).catch(() => {
      return storeList
    })

    const arr: Store[] = res.filter((store: Store) => store.name.includes(storeName))
    setData(arr)
  }

  const onChangeValue = (el: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(el.target.value)
  }

  return (
    <div className="App">
      <div className="form">
        <div className="formRow">
          <p>店名</p>
          <input
            type="text"
            onChange={(el: React.ChangeEvent<HTMLInputElement>) => onChangeValue(el)}
          />
        </div>
      </div>
      <button className="searchBtn" onClick={search}>検索</button>
      <ul>{data.map((store: Store, i) => <li key={i}>{store.name}</li>)}</ul>
    </div>
  )
}

export default App;
