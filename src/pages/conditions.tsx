import App from 'pages/App'
import { useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import storeList from 'utils/dummy/store.json'
import { Checkbox, FormGroup, FormControlLabel, Button } from '@material-ui/core'
import { makeStyles, createStyles } from "@material-ui/core/styles"
interface checkebox {
  is24Hours: boolean
  hasAtm: boolean
  hasDrug: boolean
}
interface Store {
  code: string
  name: string
  postal: string
  address: string
  tel: string
  is24Hours: boolean
  hasAtm: boolean
  hasDrug: boolean
}

export default function Conditions(): JSX.Element {
  const [state, setState] = useState<checkebox>({
    is24Hours: false,
    hasAtm: false,
    hasDrug: false
  })
  const [data, setData] = useState<Store[]>([])
  const { is24Hours, hasAtm, hasDrug } = state

  const styles = makeStyles(() =>
    createStyles({
      searchBtn: {
        backgroundColor: '#3f51b5',
        color: '#FFF'
      }
    })
  )

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const search = async () => {
    const checkedArr = (Object.keys(state) as (keyof checkebox)[]).filter((val) => {
      return state[val]
    })

    const res: Store[] = await axios.get('http://localhost:3001/store').then((res: AxiosResponse) => {
      return res.data
    }).catch(() => {
      return storeList
    })

    if (!checkedArr.length) return

    let result: Store[] = []
    let tmp: Store[] = []

    checkedArr.forEach((value, i) => {
      if (i === 0) {
        tmp = res.filter((store: Store) => {
          if (store[value]) return store
          else return
        })
      } else {
        tmp = tmp.filter((store: Store) => {
          if (store[value]) return store
          else return
        })
      }
    })

    result = tmp
    setData(result)
    console.log(result)
  }

  return (
    <App>
      <div className="conditions">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={is24Hours}
                color="default"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeValue(e)}
                name="is24Hours"
              />
            }
            label="24時間営業"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hasAtm}
                color="default"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeValue(e)}
                name="hasAtm"
              />
            }
            label="ATMあり"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hasDrug}
                color="default"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeValue(e)}
                name="hasDrug"
              />
            }
            label="ドラッグ"
          />
        </FormGroup>
        <div className="btn-wrapper">
          <Button className={styles().searchBtn} onClick={search}>検索</Button>
        </div>
        <ul>{data.map((store: Store, i) =>
          <li key={i}>
            <p>{store.name}</p><p>{store.address}</p>{store.is24Hours && <p className="24hours">24時間</p>}
            {store.hasAtm && <p className="atm">ATM</p>}{store.hasDrug && <p className="drug">ドラッグ</p>}
          </li>)}
        </ul>
      </div>
    </App>
  )
}
