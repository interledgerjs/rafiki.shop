import * as React from 'react'

type props = {
  inputType?: 'text'|'password'|'email'|'number'
  className?: string
  errorState?: boolean
  inputRef?: any
  name: string
  style?: any
  textColour?: string
  blurColour?: string
  disabled?: boolean
  hint?: string
  label?: string
  defaultText?: string
  maxWidth?: string
  onKeyPress?: (event: any) => void
  validationFunction?: (e: any) => void
}

const TextInput: React.FC<props> = (props) => {
  const textColour = props.textColour? props.textColour : 'dark'
  let blurColour = props.blurColour? props.blurColour : 'dark'
  let focusColour = 'dark'
  const maxWidth = props.maxWidth? props.maxWidth : 'sm'
  const inputType = props.inputType? props.inputType: 'text'
  if (props.errorState) {
    blurColour = 'error'
    focusColour = 'error'
  }

  const [value, setValue] = React.useState('')
  const [focussed, setFocussed] = React.useState(false)

  return (
    <div style={props.style} className={`bg-transparent max-w-${maxWidth} ${props.className} mx-auto relative h-18 mb-5`}>

      <div 
        className={`left-0 right-0 top-0 bg-secondary h-inputBox border${focussed||props.errorState? '-2': ''} border-${focussed||props.errorState? focusColour: textColour}`}>
      </div>

      <label 
        className={props.label ? `${value === '' ? 'inputText' : 'hidden'} text-${focussed? focusColour: blurColour} border-l-2 border-r-2 border-transparent`: `invisible `}>
        {props.label || 'Label'}
      </label>

      <input 
        onFocus={() => {setFocussed(true)}} onBlur={() => {setFocussed(false)}} ref={props.inputRef? props.inputRef: undefined} name={props.name} type={inputType} className={`inputText focus:outline-none bg-transparent text-${textColour} max-w-${maxWidth} w-11/12 focus:`} onKeyPress={props.onKeyPress? e => props.onKeyPress(e) : () => {}} onChange={e => {setValue(e.target.value);if (props.validationFunction) props.validationFunction(e)}}>
      </input>

      <p 
        className={props.hint? `assistiveText text-${focussed? focusColour: blurColour} w-full` : `invisible`}>
        { props.hint }
      </p>

    </div>
  )
}

export default TextInput
