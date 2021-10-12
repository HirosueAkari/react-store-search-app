import { useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import storeList from 'utils/dummy/store.json'
import Button from '@material-ui/core/Button'
import App from 'pages/App'

interface Store {
  code: number
  name: string
  address: string
}

export default function FreeWord(): JSX.Element {
  const [data, setData] = useState<Store[]>([])
  const [freeWord, setFreeWord] = useState('')

  const onChangeFreeWord = (el: React.ChangeEvent<HTMLInputElement>) => {
    setFreeWord(el.target.value)
  }

  const search = async () => {
    const res: Store[] = await axios.get('http://localhost:3001/store').then((res: AxiosResponse) => {
      return res.data
    }).catch(() => {
      return storeList
    })

    if (freeWord) {
      const arr: Store[] = res.filter((store: Store) => store.address.includes(freeWord) || store.name.includes(freeWord))
      setData(arr)
      return
    }
  }

  return (
    <App>
      <div className="freeWord">
        <div className="formRow">
          <input
            type="text"
            onChange={(el: React.ChangeEvent<HTMLInputElement>) => onChangeFreeWord(el)}
          />
          <Button className="searchBtn" onClick={search}>検索</Button>
        </div>
        <ul>{data.map((store: Store, i) => <li key={i}><p>{store.name}</p><p>{store.address}</p></li>)}</ul>
      </div>
    </App>
  )
}