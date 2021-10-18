import App from 'pages/App'
import { useState } from 'react'
import { Checkbox, FormGroup, FormControlLabel } from '@material-ui/core'

export default function Conditions(): JSX.Element {
  const [state, setState] = useState({
    is24Hours: false,
    hasAtm: false,
    hasDrug: false
  })
  const { is24Hours, hasAtm, hasDrug } = state

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <App>
      <div className="conditions">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={is24Hours} color="default" onChange={changeValue} name="is24Hours" />
            }
            label="24時間営業"
          />
          <FormControlLabel
            control={
              <Checkbox checked={hasAtm} color="default" onChange={changeValue} name="hasAtm" />
            }
            label="ATMあり"
          />
          <FormControlLabel
            control={
              <Checkbox checked={hasDrug} color="default" onChange={changeValue} name="hasDrug" />
            }
            label="ドラッグ"
          />
        </FormGroup>
      </div>
    </App>
  )
}
